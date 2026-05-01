import { Page } from "playwright";
import { BasePage } from "./BasePage";
import { EXCEPTIONS_LOCATORS } from "../locators/locators";

/**
 * ══════════════════════════════════════════════════════════════
 *  TestExceptionsPage – Page Object for the Test Exceptions module
 * ══════════════════════════════════════════════════════════════
 *
 *  Project: Shivam Sharma – Automation Test Framework
 *
 *  URL: https://practicetestautomation.com/practice-test-exceptions/
 *
 *  Page structure:
 *    Row 1 has: label, disabled input, Edit button, hidden Save button, Add button
 *    - Click Edit → input becomes enabled, Save becomes visible
 *    - Click Save → confirmation appears
 *    - Click Add → Row 2 appears with a new input
 *
 *  TRACEABILITY:
 *    exceptions.feature → exceptions.steps.ts → TestExceptionsPage → EXCEPTIONS_LOCATORS
 * ══════════════════════════════════════════════════════════════
 */
export class TestExceptionsPage extends BasePage {
  private readonly loc = EXCEPTIONS_LOCATORS;

  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ──

  async navigate(): Promise<void> {
    await this.navigateTo("https://practicetestautomation.com/practice-test-exceptions/");
    await this.page.waitForLoadState("networkidle");
  }

  // ── Queries ──

  async getPageHeading(): Promise<string> {
    return this.getTextContent(this.loc.pageTitle);
  }

  async getPageContentText(): Promise<string> {
    return this.getTextContent(this.loc.pageContent);
  }

  async getConfirmationMessage(): Promise<string> {
    return this.getTextContent(this.loc.confirmationMessage, 15000);
  }

  async isConfirmationVisible(): Promise<boolean> {
    return this.isElementVisible(this.loc.confirmationMessage, 10000);
  }

  async isRow2InputVisible(): Promise<boolean> {
    return this.isElementVisible(this.loc.row2Input, 10000);
  }

  // ── Actions ──

  /** Click the Edit button to enable the Row 1 input field */
  async clickEditButton(): Promise<void> {
    await this.clickElement(this.loc.editButton);
    // Wait for the input to become enabled (no longer disabled)
    await this.page.waitForSelector(
      "#row1 input.input-field:not([disabled])",
      { state: "visible", timeout: 5000 }
    );
  }

  /** Clear and type into Row 1 input – must click Edit first */
  async typeInRow1(text: string): Promise<void> {
    await this.clickEditButton();
    await this.page.waitForSelector(this.loc.row1Input, { state: "visible", timeout: 5000 });
    const input = this.page.locator(this.loc.row1Input);
    await input.clear();
    await input.fill(text);
  }

  /** Click the Add button to add a new row */
  async clickAddButton(): Promise<void> {
    await this.clickElement(this.loc.addButton);
  }

  /** Type into Row 2 input (appears after clicking Add) */
  async typeInRow2(text: string): Promise<void> {
    await this.page.waitForSelector(this.loc.row2Input, { state: "visible", timeout: 10000 });
    const input = this.page.locator(this.loc.row2Input);
    await input.fill(text);
  }

  /** Click Save button for Row 1 (becomes visible after Edit) */
  async clickSaveButton(): Promise<void> {
    await this.page.waitForSelector(this.loc.saveButton, { state: "visible", timeout: 5000 });
    await this.clickElement(this.loc.saveButton);
  }

  /** Click Save button for Row 2 */
  async clickRow2SaveButton(): Promise<void> {
    await this.page.waitForSelector(this.loc.row2SaveButton, { state: "visible", timeout: 5000 });
    await this.clickElement(this.loc.row2SaveButton);
  }
}
