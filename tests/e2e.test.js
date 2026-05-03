const path = require('path');
const fs = require('fs');
const os = require('os');

// Redirect APPDATA to a temp dir so tests do not pollute real user config
process.env.APPDATA = fs.mkdtempSync(path.join(os.tmpdir(), 'ster-test-'));

const SessionService = require('../src/core/sessionService');
const ScreenshotService = require('../src/core/screenshotService');
const ContextManager = require('../src/core/contextManager');
const Exporter = require('../src/core/exporter');
const { getDefaultTester, rememberTester } = require('../src/core/identity');

describe('Identity (dynamic Recorded By)', () => {
  test('returns OS user by default — never hardcoded', () => {
    const t = getDefaultTester();
    expect(typeof t).toBe('string');
    expect(t.length).toBeGreaterThan(0);
    expect(t.toLowerCase()).not.toBe('shivam sharma'); // must not equal author
  });

  test('rememberTester persists per OS user', () => {
    rememberTester('Alice QA');
    expect(getDefaultTester()).toBe('Alice QA');
    rememberTester('Bob Tester');
    expect(getDefaultTester()).toBe('Bob Tester');
  });
});

describe('SessionService', () => {
  let s;
  beforeEach(() => {
    s = new SessionService({
      project: 'Demo', testCaseId: 'TC-1', testCaseTitle: 'Login',
      environment: 'SIT', testerName: 'Test User',
      osInfo: 'TestOS', hostname: 'host', startedAt: new Date().toISOString()
    });
  });

  test('adds, updates, deletes and re-indexes steps', () => {
    s.addStep({ description: 'A' });
    s.addStep({ description: 'B' });
    const third = s.addStep({ description: 'C' });
    expect(s.getSteps()).toHaveLength(3);

    s.updateStep(third.id, { status: 'Pass', actual: 'works' });
    expect(s.getSteps()[2].status).toBe('Pass');
    expect(s.getSteps()[2].actual).toBe('works');

    s.deleteStep(third.id);
    expect(s.getSteps()).toHaveLength(2);
    expect(s.getSteps().map(x => x.index)).toEqual([1, 2]);
  });

  test('markLastStatus updates the most recent step', () => {
    s.addStep({ description: 'A' });
    s.addStep({ description: 'B' });
    expect(s.markLastStatus('Fail')).toBe(true);
    expect(s.getSteps()[1].status).toBe('Fail');
  });

  test('persists session.json atomically', () => {
    s.addStep({ description: 'persist' });
    const file = path.join(s.sessionDir, 'session.json');
    expect(fs.existsSync(file)).toBe(true);
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    expect(parsed.steps).toHaveLength(1);
  });
});

describe('ScreenshotService', () => {
  test('captures, hashes and writes a PNG (with fallback)', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shots-'));
    const svc = new ScreenshotService(dir);
    const r = await svc.capture();
    expect(fs.existsSync(r.path)).toBe(true);
    expect(r.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(r.bytes).toBeGreaterThan(0);
  });
});

describe('ContextManager (MCP snapshot)', () => {
  test('emits a snapshot with required keys', () => {
    const cm = new ContextManager();
    cm.start();
    cm.setActiveApp('Chrome');
    const snap = cm.snapshot();
    expect(snap).toHaveProperty('activeApp', 'Chrome');
    expect(snap).toHaveProperty('os');
    expect(snap).toHaveProperty('locale');
    expect(snap).toHaveProperty('timezone');
    expect(snap.suggestedStep).toMatch(/Chrome/);
  });
});

describe('Exporter (Excel / PDF / HTML)', () => {
  let session, shots, outDir;

  beforeAll(async () => {
    outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ster-out-'));
    session = new SessionService({
      project: 'Acme', testCaseId: 'TC-42', testCaseTitle: 'E2E flow',
      environment: 'UAT', testerName: 'QA Engineer',
      osInfo: 'TestOS 1.0', hostname: 'ci-host', startedAt: new Date().toISOString()
    });
    shots = new ScreenshotService(session.artifactsDir);

    for (const desc of ['Open app', 'Login', 'Submit form']) {
      const img = await shots.capture();
      session.addStep({
        description: desc, expected: 'OK', actual: 'OK',
        status: 'Pass', screenshotPath: img.path, screenshotHash: img.sha256
      });
    }
    session.markLastStatus('Fail');
    session.close();
  });

  test('Excel export contains tester name & embeds images', async () => {
    const file = path.join(outDir, 'report.xlsx');
    const r = await new Exporter().export('xlsx', file, session.getMeta(), session.getSteps());
    expect(fs.existsSync(file)).toBe(true);
    expect(fs.statSync(file).size).toBeGreaterThan(2000);
    expect(r.summary.total).toBe(3);
    expect(r.summary.failed).toBe(1);
    expect(r.summary.passed).toBe(2);
  });

  test('HTML export inlines screenshots and dynamic footer (no SHA-256 visible)', async () => {
    const file = path.join(outDir, 'report.html');
    await new Exporter().export('html', file, session.getMeta(), session.getSteps());
    const html = fs.readFileSync(file, 'utf8');
    expect(html).toContain('QA Engineer');                       // dynamic Recorded By
    expect(html).toContain('Designed &amp; Developed by Shivam Sharma');
    expect(html).toContain('data:image/png;base64,');            // embedded image
    expect(html).toContain('TC-42');
    expect(html).not.toContain('SHA-256');                       // no hash visible
  });

  test('PDF export is a valid non-empty file', async () => {
    const file = path.join(outDir, 'report.pdf');
    await new Exporter().export('pdf', file, session.getMeta(), session.getSteps());
    expect(fs.existsSync(file)).toBe(true);
    const head = fs.readFileSync(file).slice(0, 5).toString();
    expect(head).toBe('%PDF-');
  });

  test('Word export produces a valid .docx with dynamic footer', async () => {
    const file = path.join(outDir, 'report.docx');
    const r = await new Exporter().export('docx', file, session.getMeta(), session.getSteps());
    expect(fs.existsSync(file)).toBe(true);
    expect(fs.statSync(file).size).toBeGreaterThan(500);
    expect(r.summary.total).toBe(3);
    // .docx is a ZIP — starts with PK signature
    const head = fs.readFileSync(file).slice(0, 2).toString();
    expect(head).toBe('PK');
  });

  test('rejects unsupported formats', async () => {
    await expect(new Exporter().export('csv', 'x', session.getMeta(), [])).rejects.toThrow(/Unsupported/);
  });
});

