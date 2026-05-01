import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";

/**
 * ══════════════════════════════════════════════════════════════
 *  Test Exceptions – Step Definitions
 * ══════════════════════════════════════════════════════════════
 *
 *  TRACEABILITY:
 *    exceptions.feature  →  THIS FILE  →  TestExceptionsPage  →  EXCEPTIONS_LOCATORS
 *
 *  Ctrl+Click on  this.exceptionsPage!.xxx()  →  jumps to TestExceptionsPage.ts
 *  Ctrl+Click on  EXCEPTIONS_LOCATORS.xxx     →  jumps to locators/locators.ts
 * ══════════════════════════════════════════════════════════════
 */

// ── Navigation ──

Given("I am on the Test Exceptions page", async function (this: CustomWorld) {
  await this.exceptionsPage!.navigate();
});

// ── Assertions ──

Then("I should see the exceptions page heading", async function (this: CustomWorld) {
  const url = this.page!.url();
  expect(url).toContain("practice-test-exceptions");
  console.log(`    📄 On exceptions page: ${url}`);
});

Then("I should see the exceptions page instructions", async function (this: CustomWorld) {
  const url = this.page!.url();
  expect(url).toContain("practice-test-exceptions");
  const screenshot = await this.page!.screenshot({ fullPage: true });
  this.attach(screenshot, "image/png");
  console.log("    📄 Exceptions page content verified");
});

Then("I should see the confirmation message {string}", async function (this: CustomWorld, expected: string) {
  const message = await this.exceptionsPage!.getConfirmationMessage();
  expect(message).toContain(expected);
  console.log(`    ✅ Confirmation: "${message}"`);
});

Then("the Row 2 input should become visible", async function (this: CustomWorld) {
  const isVisible = await this.exceptionsPage!.isRow2InputVisible();
  expect(isVisible).toBeTruthy();
  console.log("    ✅ Row 2 input is now visible");
});

// ── Actions ──

When("I clear and type {string} in the Row 1 input", async function (this: CustomWorld, text: string) {
  await this.exceptionsPage!.typeInRow1(text);
});

When("I type {string} in the Row 2 input", async function (this: CustomWorld, text: string) {
  await this.exceptionsPage!.typeInRow2(text);
});

When("I click the Add button", async function (this: CustomWorld) {
  await this.exceptionsPage!.clickAddButton();
});

When("I click the Save button on exceptions page", async function (this: CustomWorld) {
  await this.exceptionsPage!.clickSaveButton();
});

When("I click the Save button for Row 2", async function (this: CustomWorld) {
  await this.exceptionsPage!.clickRow2SaveButton();
});

When("I click the Edit button on exceptions page", async function (this: CustomWorld) {
  await this.exceptionsPage!.clickEditButton();
});
