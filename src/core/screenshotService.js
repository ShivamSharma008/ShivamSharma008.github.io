/**
 * ScreenshotService – wraps screenshot-desktop and emits SHA-256 hashed PNGs.
 * Falls back to a synthetic 1x1 PNG when the native capture is unavailable
 * (e.g., headless CI, unit tests).
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let screenshot = null;
try { screenshot = require('screenshot-desktop'); } catch { /* optional */ }

class ScreenshotService {
  constructor(dir) { this.dir = dir; }

  async capture() {
    let buffer;
    try {
      if (!screenshot) throw new Error('screenshot-desktop unavailable');
      buffer = await screenshot({ format: 'png' });
    } catch {
      // 1x1 transparent PNG fallback
      buffer = Buffer.from(
        '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4' +
        '890000000d49444154789c6300010000000500010d0a2db40000000049454e44ae426082',
        'hex'
      );
    }
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const file = path.join(this.dir, `shot_${ts}_${sha256.slice(0, 8)}.png`);
    fs.writeFileSync(file, buffer);
    return { path: file, sha256, bytes: buffer.length };
  }
}

module.exports = ScreenshotService;

