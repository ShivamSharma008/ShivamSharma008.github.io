import { Page } from "playwright";
import { BasePage } from "./BasePage";
import { NAV_LOCATORS, PRACTICE_HUB_LOCATORS } from "../locators/locators";

/**
 * ══════════════════════════════════════════════════════════════
 *  PracticeHubPage – Page Object for the Practice Section Hub
 * ══════════════════════════════════════════════════════════════
 *
 *  Project: Shivam Sharma – Automation Test Framework
 *
 *  URL: https://practicetestautomation.com/practice/
 *
 *  The Practice page lists links to all testable modules:
 *    • Test Login Page
 *    • Test Exceptions
 *    • JavaScript Delays
 *
 *  TRACEABILITY:
 *    practice.feature → practice.steps.ts → PracticeHubPage → PRACTICE_HUB_LOCATORS
 * ══════════════════════════════════════════════════════════════
 */
export class PracticeHubPage extends BasePage {
  private readonly loc = PRACTICE_HUB_LOCATORS;
  private readonly nav = NAV_LOCATORS;

  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ──

  /** Navigate directly to the Practice hub page */
  async navigate(): Promise<void> {
    await this.navigateTo("https://practicetestautomation.com/practice/");
    await this.page.waitForLoadState("networkidle");
  }

  /** Click the Practice tab in the top navigation menu */
  async clickPracticeTab(): Promise<void> {
    // Use fallback selector resolution
    const sel = await this.resolveSelector(
      this.nav.practiceMenuLink,
      this.nav.practiceMenuFallback,
      "a:has-text('Practice')",
    );
    await this.clickElement(sel);
    await this.page.waitForLoadState("networkidle");
  }

  // ── Queries ──

  /** Get the page heading text */
  async getPageHeading(): Promise<string> {
    return this.getTextContent(this.loc.pageTitle);
  }

  /** Get the full page content text */
  async getPageContentText(): Promise<string> {
    return this.getTextContent(this.loc.pageContent);
  }

  /** Get all practice section link texts */
  async getAllPracticeLinkTexts(): Promise<string[]> {
    return this.getAllTexts(this.loc.allPracticeLinks);
  }

  /** Get count of practice links */
  async getPracticeLinkCount(): Promise<number> {
    return this.getElementCount(this.loc.allPracticeLinks);
  }

  // ── Actions: Navigate to sub-sections ──

  /** Click the "Test Login Page" link */
  async clickTestLoginLink(): Promise<void> {
    await this.clickElement(this.loc.testLoginLink);
    await this.page.waitForLoadState("networkidle");
  }

  /** Click the "Test Exceptions" link */
  async clickTestExceptionsLink(): Promise<void> {
    await this.clickElement(this.loc.testExceptionsLink);
    await this.page.waitForLoadState("networkidle");
  }

  /** Click the "JavaScript Delays" link (if available) */
  async clickJsDelaysLink(): Promise<void> {
    await this.clickElement(this.loc.jsDelaysLink);
    await this.page.waitForLoadState("networkidle");
  }

  /** Click the "Test Table" link */
  async clickTestTableLink(): Promise<void> {
    await this.clickElement(this.loc.testTableLink);
    await this.page.waitForLoadState("networkidle");
  }

  /** Check if a specific practice link is visible */
  async isPracticeLinkVisible(linkSelector: string): Promise<boolean> {
    return this.isElementVisible(linkSelector);
  }
}

