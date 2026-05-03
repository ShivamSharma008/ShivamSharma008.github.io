/**
 * Identity service – dynamic "Recorded By".
 * Order of resolution:
 *   1. Explicit tester name from session input.
 *   2. Persisted preference for current OS user.
 *   3. OS username (os.userInfo()).
 *   4. Fallback "Unknown Tester".
 * Never hardcoded to a single user.
 */
const os = require('os');
const fs = require('fs');
const path = require('path');

function configDir() {
  const base = process.env.APPDATA
    || (process.platform === 'darwin'
      ? path.join(os.homedir(), 'Library', 'Application Support')
      : path.join(os.homedir(), '.config'));
  const dir = path.join(base, 'STER');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function prefsFile() { return path.join(configDir(), 'identity.json'); }

function loadPrefs() {
  try { return JSON.parse(fs.readFileSync(prefsFile(), 'utf8')); } catch { return {}; }
}
function savePrefs(p) { fs.writeFileSync(prefsFile(), JSON.stringify(p, null, 2)); }

function getDefaultTester() {
  const prefs = loadPrefs();
  const osUser = (() => { try { return os.userInfo().username; } catch { return null; } })();
  if (prefs[osUser]) return prefs[osUser];
  return osUser || 'Unknown Tester';
}

function rememberTester(name) {
  const prefs = loadPrefs();
  const osUser = (() => { try { return os.userInfo().username; } catch { return 'default'; } })();
  prefs[osUser] = name;
  savePrefs(prefs);
}

module.exports = { getDefaultTester, rememberTester, configDir };

