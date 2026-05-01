import { Page } from "playwright";

/**
 * ══════════════════════════════════════════════════════════════
 *  BasePage – Abstract base for every Page Object
 * ══════════════════════════════════════════════════════════════
 *
 *  Project: Shivam Sharma – Automation Test Framework
 *
 *  Every page object extends BasePage.  It provides:
 *    • Shared helpers (fill, click, getText, etc.)
 *    • Runtime selector resolution with fallback recovery
 *    • Console logging of which selector was used per action
 *
 *  TRACEABILITY:
 *    Feature → Step Definition → Page Object → Locator (locators.ts)
 * ══════════════════════════════════════════════════════════════
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ───────────────────────────────────────────
  //  NAVIGATION
  // ───────────────────────────────────────────

  /** Navigate to an absolute URL */
  async navigateTo(url: string): Promise<void> {
    this.logAction("navigateTo", url);
    await this.page.goto(url);
    await this.page.waitForLoadState("domcontentloaded");
  }

  // ───────────────────────────────────────────
  //  SELECTOR RESOLUTION (with fallback)
  // ───────────────────────────────────────────

  /**
   * Resolve a selector at runtime – tries the primary selector first,
   * then falls back to alternatives if provided.
   *
   * This enables "self-healing" when selectors change:
   *   1. Try the primary selector
   *   2. If not found, try each fallback in order
   *   3. Log which selector was actually used
   *   4. Throw with clear detail if none matched
   */
  protected async resolveSelector(
    primary: string,
    ...fallbacks: string[]
  ): Promise<string> {
    const candidates = [primary, ...fallbacks];
    for (const selector of candidates) {
      try {
        const el = await this.page.$(selector);
        if (el) {
          if (selector !== primary) {
            console.log(`  ⚠️  Fallback selector used: "${selector}" (primary "${primary}" not found)`);
          }
          return selector;
        }
      } catch {
        // selector syntax invalid, skip
      }
    }
    // Return primary anyway – the caller's waitForSelector will give a clear error
    return primary;
  }

  // ───────────────────────────────────────────
  //  CORE ACTIONS (with logging)
  // ───────────────────────────────────────────

  /** Wait for a selector and return its text content */
  async getTextContent(selector: string, timeout = 10000): Promise<string> {
    this.logAction("getTextContent", selector);
    await this.page.waitForSelector(selector, { timeout });
    return (await this.page.textContent(selector)) ?? "";
  }

  /** Fill an input field (clears existing value first) */
  async fillInput(selector: string, value: string): Promise<void> {
    this.logAction("fillInput", selector, value);
    await this.page.fill(selector, value);
  }

  /** Click an element */
  async clickElement(selector: string): Promise<void> {
    this.logAction("clickElement", selector);
    await this.page.click(selector);
  }

  /** Check if an element is visible within timeout */
  async isElementVisible(selector: string, timeout = 5000): Promise<boolean> {
    this.logAction("isElementVisible", selector);
    try {
      await this.page.waitForSelector(selector, { state: "visible", timeout });
      return true;
    } catch {
      return false;
    }
  }

  /** Wait for an element to appear */
  async waitForElement(selector: string, timeout = 10000): Promise<void> {
    this.logAction("waitForElement", selector);
    await this.page.waitForSelector(selector, { state: "visible", timeout });
  }

  /** Get all matching elements' text content as an array */
  async getAllTexts(selector: string): Promise<string[]> {
    this.logAction("getAllTexts", selector);
    return this.page.$$eval(selector, (els) => els.map((el) => el.textContent?.trim() ?? ""));
  }

  /** Get count of elements matching a selector */
  async getElementCount(selector: string): Promise<number> {
    return (await this.page.$$(selector)).length;
  }

  /** Get an attribute value from an element */
  async getAttribute(selector: string, attr: string): Promise<string | null> {
    this.logAction("getAttribute", selector, attr);
    return this.page.getAttribute(selector, attr);
  }

  /** Get current page URL */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /** Get page title */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /** Take a screenshot and return the buffer */
  async takeScreenshot(): Promise<Buffer> {
    return await this.page.screenshot({ fullPage: true });
  }

  // ───────────────────────────────────────────
  //  LOGGING (shows selector used per action)
  // ───────────────────────────────────────────

  protected logAction(action: string, selector: string, extra?: string): void {
    const tag = `[${this.constructor.name}]`;
    const detail = extra ? ` → "${extra}"` : "";
    console.log(`    🔍 ${tag} ${action}("${selector}")${detail}`);
  }
}
