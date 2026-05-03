/**
 * Smart Test Evidence Recorder - Electron Main Process
 * Designed & Developed by Shivam Sharma
 */
const { app, BrowserWindow, ipcMain, globalShortcut, dialog, screen } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const SessionService = require('../core/sessionService');
const ScreenshotService = require('../core/screenshotService');
const ContextManager = require('../core/contextManager');
const Exporter = require('../core/exporter');
const { getDefaultTester } = require('../core/identity');

let mainWindow = null;
let recorderBar = null;
let session = null;
let screenshotService = null;
let contextManager = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    title: 'Smart Test Evidence Recorder',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
}

function createRecorderBar() {
  if (recorderBar) { recorderBar.show(); return; }
  const display = screen.getPrimaryDisplay().workAreaSize;
  recorderBar = new BrowserWindow({
    width: 460,
    height: 88,
    x: Math.floor(display.width / 2 - 230),
    y: 20,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    transparent: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });
  recorderBar.loadFile(path.join(__dirname, '..', 'renderer', 'recorder.html'));
  recorderBar.on('closed', () => { recorderBar = null; });
}

function registerShortcuts() {
  globalShortcut.register('CommandOrControl+Shift+S', async () => {
    if (session && session.isActive()) await captureStep();
  });
  globalShortcut.register('CommandOrControl+Shift+P', () => session && session.markLastStatus('Pass') && pushUpdate());
  globalShortcut.register('CommandOrControl+Shift+F', () => session && session.markLastStatus('Fail') && pushUpdate());
  globalShortcut.register('CommandOrControl+Shift+E', async () => { if (session) await endAndExport(); });
}

async function captureStep() {
  const ctx = contextManager.snapshot();
  const img = await screenshotService.capture();
  const step = session.addStep({
    description: ctx.suggestedStep || `Step at ${ctx.activeApp || 'desktop'}`,
    expected: '',
    actual: '',
    status: 'Not Run',
    screenshotPath: img.path,
    screenshotHash: img.sha256,
    context: ctx
  });
  pushUpdate(step);
}

function pushUpdate(step) {
  const payload = { steps: session.getSteps(), meta: session.getMeta() };
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('session:update', payload);
  if (recorderBar && !recorderBar.isDestroyed()) recorderBar.webContents.send('session:update', payload);
}

async function endAndExport() {
  const meta = session.getMeta();
  const defaultName = `${(meta.project || 'Project').replace(/\s+/g, '_')}_${meta.testCaseId || 'TC'}_${meta.environment || 'ENV'}_${new Date().toISOString().replace(/[:.]/g, '-')}_${meta.testerName.replace(/\s+/g, '_')}`;
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Save Test Evidence',
    defaultPath: defaultName,
    filters: [
      { name: 'Excel Workbook', extensions: ['xlsx'] },
      { name: 'Word Document', extensions: ['docx'] },
      { name: 'PDF Document', extensions: ['pdf'] },
      { name: 'HTML Report', extensions: ['html'] }
    ]
  });
  if (canceled || !filePath) return { canceled: true };
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  const exporter = new Exporter();
  await exporter.export(ext, filePath, session.getMeta(), session.getSteps());
  session.close();
  session = null;
  if (recorderBar) recorderBar.close();
  return { filePath };
}

// ---------- IPC ----------
ipcMain.handle('app:getDefaultTester', () => getDefaultTester());

ipcMain.handle('session:start', async (_e, meta) => {
  const tester = (meta && meta.testerName && meta.testerName.trim()) || getDefaultTester();
  session = new SessionService({
    project: meta.project || 'Untitled Project',
    testCaseId: meta.testCaseId || '',
    testCaseTitle: meta.testCaseTitle || '',
    environment: meta.environment || 'SIT',
    testerName: tester,
    osInfo: `${os.type()} ${os.release()} (${os.arch()})`,
    hostname: os.hostname(),
    startedAt: new Date().toISOString()
  });
  screenshotService = new ScreenshotService(session.artifactsDir);
  contextManager = new ContextManager();
  contextManager.start();
  createRecorderBar();
  return session.getMeta();
});

ipcMain.handle('session:capture', async () => { await captureStep(); return session.getSteps(); });
ipcMain.handle('session:updateStep', (_e, id, patch) => { session.updateStep(id, patch); pushUpdate(); return true; });
ipcMain.handle('session:deleteStep', (_e, id) => { session.deleteStep(id); pushUpdate(); return true; });
ipcMain.handle('session:get', () => session ? { steps: session.getSteps(), meta: session.getMeta() } : null);
ipcMain.handle('session:end', async () => endAndExport());

// ---------- Lifecycle ----------
app.whenReady().then(() => {
  createMainWindow();
  registerShortcuts();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createMainWindow(); });
});

app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

