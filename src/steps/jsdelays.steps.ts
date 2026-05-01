import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";

/**
 * ══════════════════════════════════════════════════════════════
 *  Test Table – Step Definitions
 * ══════════════════════════════════════════════════════════════
 *
 *  TRACEABILITY:
 *    jsdelays.feature (table)  →  THIS FILE  →  TestTablePage  →  TABLE_LOCATORS
 *
 *  Ctrl+Click on  this.tablePage!.xxx()  →  jumps to TestTablePage.ts
 *  Ctrl+Click on  TABLE_LOCATORS.xxx     →  jumps to locators/locators.ts
 * ══════════════════════════════════════════════════════════════
 */

// ── Navigation ──

Given("I am on the Test Table page", async function (this: CustomWorld) {
  // Navigate to the test table page – linked from Practice hub
  await this.page!.goto("https://practicetestautomation.com/practice/");
  await this.page!.waitForLoadState("networkidle");
  // Find and click the Test Table link
  const tableLinks = await this.page!.$$("a");
  for (const link of tableLinks) {
    const text = await link.textContent();
    if (text && text.toLowerCase().includes("table")) {
      const href = await link.getAttribute("href");
      if (href) {
        await this.page!.goto(href);
        await this.page!.waitForLoadState("networkidle");
        break;
      }
    }
  }
});

// ── Assertions ──

Then("I should see the Test Table page heading", async function (this: CustomWorld) {
  const heading = await this.tablePage!.getPageHeading();
  expect(heading.length).toBeGreaterThan(0);
  console.log(`    📄 Table page heading: "${heading}"`);
});

Then("I should see the data table on the page", async function (this: CustomWorld) {
  const isVisible = await this.tablePage!.isTableVisible();
  expect(isVisible).toBeTruthy();
  console.log("    ✅ Data table is visible");
});

Then("I should see table headers", async function (this: CustomWorld) {
  const headers = await this.tablePage!.getTableHeaders();
  expect(headers.length).toBeGreaterThan(0);
  console.log(`    📋 Table headers: ${headers.join(", ")}`);
});

Then("I should see table rows with data", async function (this: CustomWorld) {
  const count = await this.tablePage!.getTableRowCount();
  expect(count).toBeGreaterThan(0);
  console.log(`    📋 Table has ${count} rows`);
  const cells = await this.tablePage!.getAllTableCellTexts();
  console.log(`    📋 Sample data: ${cells.slice(0, 5).join(" | ")}`);
});
