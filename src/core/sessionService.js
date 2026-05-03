/**
 * SessionService – CRUD for steps, crash-safe persistence to JSON file.
 * Production version uses better-sqlite3; this MVP uses an append-safe JSON store
 * to keep the project portable (no native build required for test harness).
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { v4: uuid } = require('uuid');
const { configDir } = require('./identity');

class SessionService {
  constructor(meta) {
    this.id = uuid();
    this.meta = { ...meta, sessionId: this.id };
    this.steps = [];
    this._active = true;
    this.sessionDir = path.join(configDir(), 'sessions', this.id);
    this.artifactsDir = path.join(this.sessionDir, 'artifacts');
    fs.mkdirSync(this.artifactsDir, { recursive: true });
    this._persist();
  }

  isActive() { return this._active; }
  getMeta() { return { ...this.meta }; }
  getSteps() { return this.steps.map(s => ({ ...s })); }

  addStep(step) {
    const s = {
      id: uuid(),
      index: this.steps.length + 1,
      capturedAt: new Date().toISOString(),
      description: step.description || '',
      expected: step.expected || '',
      actual: step.actual || '',
      status: step.status || 'Not Run',
      screenshotPath: step.screenshotPath || null,
      screenshotHash: step.screenshotHash || null,
      context: step.context || {}
    };
    this.steps.push(s);
    this._persist();
    return s;
  }

  updateStep(id, patch) {
    const s = this.steps.find(x => x.id === id);
    if (!s) return null;
    const allowed = ['description', 'expected', 'actual', 'status'];
    for (const k of allowed) if (k in patch) s[k] = patch[k];
    this._persist();
    return s;
  }

  deleteStep(id) {
    this.steps = this.steps.filter(x => x.id !== id);
    this.steps.forEach((s, i) => (s.index = i + 1));
    this._persist();
  }

  markLastStatus(status) {
    if (!this.steps.length) return false;
    this.steps[this.steps.length - 1].status = status;
    this._persist();
    return true;
  }

  close() {
    this._active = false;
    this.meta.endedAt = new Date().toISOString();
    this._persist();
  }

  _persist() {
    const file = path.join(this.sessionDir, 'session.json');
    const tmp = file + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify({ meta: this.meta, steps: this.steps }, null, 2));
    fs.renameSync(tmp, file);
  }
}

module.exports = SessionService;

