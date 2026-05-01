import { Page } from "playwright";
import { BasePage } from "./BasePage";
import { JS_DELAYS_LOCATORS } from "../locators/locators";

/**
 * ══════════════════════════════════════════════════════════════
 *  JavaScriptDelaysPage – Page Object for JavaScript Delays module
 * ══════════════════════════════════════════════════════════════
 *
 *  Project: Shivam Sharma – Automation Test Framework
 *
 *  URL: https://practicetestautomation.com/javascript-delays/
 *
 *  This page tests handling of:
 *    • JavaScript-rendered delayed content
 *    • Waiting strategies for dynamic elements
 *    • Spinner/loading indicator detection
 *
 *  TRACEABILITY:
 *    jsdelays.feature → jsdelays.steps.ts → JavaScriptDelaysPage → JS_DELAYS_LOCATORS
 * ══════════════════════════════════════════════════════════════
 */
export class JavaScriptDelaysPage extends BasePage {
  private readonly loc = JS_DELAYS_LOCATORS;

  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ──

  async navigate(): Promise<void> {
    await this.navigateTo("https://practicetestautomation.com/javascript-delays/");
    await this.page.waitForLoadState("networkidle");
  }

  // ── Queries ──

  async getPageHeading(): Promise<string> {
    return this.getTextContent(this.loc.pageTitle);
  }

  async getPageContentText(): Promise<string> {
    return this.getTextContent(this.loc.pageContent);
  }

  async getDelayedText(timeout = 20000): Promise<string> {
    this.logAction("getDelayedText", this.loc.delayedText);
    await this.page.waitForSelector(this.loc.delayedText, { state: "visible", timeout });
    return (await this.page.textContent(this.loc.delayedText)) ?? "";
  }

  async isDelayedTextVisible(timeout = 20000): Promise<boolean> {
    return this.isElementVisible(this.loc.delayedText, timeout);
  }

  async isStartButtonVisible(): Promise<boolean> {
    return this.isElementVisible(this.loc.startButton);
  }

  // ── Actions ──

  /** Click the Start button to trigger the delayed action */
  async clickStartButton(): Promise<void> {
    await this.clickElement(this.loc.startButton);
  }

  /** Wait for the loading spinner to disappear */
  async waitForLoadingToComplete(timeout = 20000): Promise<void> {
    try {
      const spinnerVisible = await this.isElementVisible(this.loc.loadingIndicator, 2000);
      if (spinnerVisible) {
        await this.page.waitForSelector(this.loc.loadingIndicator, {
          state: "hidden",
          timeout,
        });
      }
    } catch {
      // Spinner may never appear or already gone
    }
  }
}

