/**
 * ContextManager – the MCP-aligned awareness layer.
 * Tracks active app, suggested step text, environment and exposes a snapshot()
 * that any capture call binds to. In a full build this becomes a true MCP server
 * exposing resources/tools/prompts.
 */
const os = require('os');

class ContextManager {
  constructor() {
    this.activeApp = null;
    this.lastUrl = null;
    this.startedAt = null;
  }
  start() { this.startedAt = new Date().toISOString(); }

  snapshot() {
    return {
      activeApp: this.activeApp || 'unknown',
      lastUrl: this.lastUrl,
      os: `${os.type()} ${os.release()}`,
      arch: os.arch(),
      locale: Intl.DateTimeFormat().resolvedOptions().locale,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ts: new Date().toISOString(),
      suggestedStep: this.activeApp ? `Action on ${this.activeApp}` : null
    };
  }

  setActiveApp(name) { this.activeApp = name; }
  setUrl(url) { this.lastUrl = url; }
}

module.exports = ContextManager;

