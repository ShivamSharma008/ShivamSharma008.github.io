/**
 * BasePage - Foundation for all Page Objects
 * Author: Shivam Sharma, Senior SDET
 *
 * Provides common page interactions, custom waits, and retry logic.
 * All page objects extend this class for consistent behavior.
 */
import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate to a path relative to baseURL */
  async navigate(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /** Wait for an element to be visible with custom timeout */
  async waitForElement(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /** Click with built-in retry logic */
  async clickWithRetry(locator: Locator, retries = 3): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await locator.click({ timeout: 5000 });
        return;
      } catch (error) {
        if (attempt === retries) throw error;
        await this.page.waitForTimeout(500 * attempt);
      }
    }
  }

  /** Fill input with clearing first */
  async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.clear();
    await locator.fill(value);
  }

  /** Get text content with wait */
  async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return (await locator.textContent()) || '';
  }

  /** Check if element is visible */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /** Take a screenshot with descriptive name */
  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({
      path: `reports/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  /** Get current page title */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /** Get current URL */
  getCurrentUrl(): string {
    return this.page.url();
  }
}
