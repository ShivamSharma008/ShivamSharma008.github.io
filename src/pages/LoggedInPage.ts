import { Page } from "playwright";
import { BasePage } from "./BasePage";
import { LOGGED_IN_LOCATORS } from "../locators/locators";

/**
 * ══════════════════════════════════════════════════════════════
 *  LoggedInPage – Page Object for the post-login success page
 * ══════════════════════════════════════════════════════════════
 *
 *  Project: Shivam Sharma – Automation Test Framework
 *
 *  URL: https://practicetestautomation.com/logged-in-successfully/
 *
 *  TRACEABILITY:
 *    login.feature  →  login.steps.ts  →  LoggedInPage  →  LOGGED_IN_LOCATORS
 * ══════════════════════════════════════════════════════════════
 */
export class LoggedInPage extends BasePage {
  private readonly loc = LOGGED_IN_LOCATORS;

  constructor(page: Page) {
    super(page);
  }

  // ── Queries ──

  /** Get the main heading text on the success page */
  async getPageHeading(): Promise<string> {
    return this.getTextContent(this.loc.pageTitle);
  }

  /** Get the full body content of the success page */
  async getPageContent(): Promise<string> {
    return this.getTextContent(this.loc.pageContent);
  }

  /** Check if the logout button is visible */
  async isLogoutButtonVisible(): Promise<boolean> {
    return this.isElementVisible(this.loc.logoutButton);
  }

  /** Get the highlighted (bold) text on the page */
  async getHighlightedText(): Promise<string> {
    return this.getTextContent(this.loc.strongText);
  }

  // ── Actions ──

  /** Click the logout button to end the session */
  async clickLogout(): Promise<void> {
    await this.clickElement(this.loc.logoutButton);
    await this.page.waitForLoadState("networkidle");
  }

  /** Verify the page URL contains the success path */
  async isOnSuccessPage(): Promise<boolean> {
    return this.getCurrentUrl().includes("logged-in-successfully");
  }
}
