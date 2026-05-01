import { Page } from "playwright";
import { BasePage } from "./BasePage";
import { TABLE_LOCATORS } from "../locators/locators";

/**
 * ══════════════════════════════════════════════════════════════
 *  TestTablePage – Page Object for the Test Table module
 * ══════════════════════════════════════════════════════════════
 *
 *  Project: Shivam Sharma – Automation Test Framework
 *
 *  URL: /practice-test-tables/ (linked from Practice hub as "Test Table")
 *
 *  TRACEABILITY:
 *    practice.feature → practice.steps.ts → TestTablePage → TABLE_LOCATORS
 * ══════════════════════════════════════════════════════════════
 */
export class TestTablePage extends BasePage {
  private readonly loc = TABLE_LOCATORS;

  constructor(page: Page) {
    super(page);
  }

  // ── Queries ──

  async getPageHeading(): Promise<string> {
    return this.getTextContent(this.loc.pageTitle);
  }

  async getPageContentText(): Promise<string> {
    return this.getTextContent(this.loc.pageContent);
  }

  async isTableVisible(): Promise<boolean> {
    return this.isElementVisible(this.loc.dataTable);
  }

  async getTableHeaders(): Promise<string[]> {
    return this.getAllTexts(this.loc.tableHeaders);
  }

  async getTableRowCount(): Promise<number> {
    return this.getElementCount(this.loc.tableRows);
  }

  async getAllTableCellTexts(): Promise<string[]> {
    return this.getAllTexts(this.loc.tableCells);
  }
}

