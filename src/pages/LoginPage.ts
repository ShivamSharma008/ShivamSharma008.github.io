import { Page } from "playwright";
import { BasePage } from "./BasePage";
import { LOGIN_LOCATORS } from "../locators/locators";

/**
 * ══════════════════════════════════════════════════════════════
 *  LoginPage – Page Object for the Login Form
 * ══════════════════════════════════════════════════════════════
 *
 *  Project: Shivam Sharma – Automation Test Framework
 *
 *  URL: https://practicetestautomation.com/practice-test-login/
 *
 *  TRACEABILITY:
 *    login.feature  →  login.steps.ts  →  LoginPage  →  LOGIN_LOCATORS (locators.ts)
 *
 *  All selectors are imported from src/locators/locators.ts
 *  Ctrl+Click on any LOGIN_LOCATORS.xxx → jumps to the locator definition.
 * ══════════════════════════════════════════════════════════════
 */
export class LoginPage extends BasePage {
  /** Reference to centralized locators – Ctrl+Click to navigate */
  private readonly loc = LOGIN_LOCATORS;

  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ──

  async navigate(): Promise<void> {
    await this.navigateTo("https://practicetestautomation.com/practice-test-login/");
    await this.page.waitForLoadState("networkidle");
  }

  // ── Actions ──

  async enterUsername(username: string): Promise<void> {
    await this.fillInput(this.loc.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.loc.passwordInput, password);
  }

  async clickSubmit(): Promise<void> {
    await this.clickElement(this.loc.submitButton);
  }

  /** Convenience: fill both fields and submit */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickSubmit();
  }

  // ── Assertions / Queries ──

  async getSuccessMessage(): Promise<string> {
    return this.getTextContent(this.loc.successMessage);
  }

  async getErrorMessage(): Promise<string> {
    return this.getTextContent(this.loc.errorMessage, 5000);
  }

  async isLoggedInSuccessfully(): Promise<boolean> {
    try {
      await this.page.waitForURL("**/logged-in-successfully/**", { timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }
}
