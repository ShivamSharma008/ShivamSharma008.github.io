import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";

/**
 * ══════════════════════════════════════════════════════════════
 *  Practice Hub – Step Definitions
 * ══════════════════════════════════════════════════════════════
 *
 *  TRACEABILITY:
 *    practice.feature  →  THIS FILE  →  PracticeHubPage (page object)  →  PRACTICE_HUB_LOCATORS
 *
 *  Ctrl+Click on  this.practiceHubPage!.xxx()  →  jumps to PracticeHubPage.ts
 *  Ctrl+Click on  PRACTICE_HUB_LOCATORS.xxx    →  jumps to locators/locators.ts
 * ══════════════════════════════════════════════════════════════
 */

// ── Navigation ──

Given("I am on the Practice hub page", async function (this: CustomWorld) {
  await this.practiceHubPage!.navigate();
});

// ── Assertions ──

Then("I should see the Practice page heading", async function (this: CustomWorld) {
  const heading = await this.practiceHubPage!.getPageHeading();
  expect(heading.length).toBeGreaterThan(0);
  console.log(`    📄 Practice page heading: "${heading}"`);
});

Then("I should see practice links for available modules", async function (this: CustomWorld) {
  const linkTexts = await this.practiceHubPage!.getAllPracticeLinkTexts();
  expect(linkTexts.length).toBeGreaterThan(0);
  console.log(`    📋 Found ${linkTexts.length} practice links:`);
  linkTexts.forEach((t, i) => console.log(`       ${i + 1}. ${t}`));
});

Then("I capture a screenshot of the Practice hub", async function (this: CustomWorld) {
  const screenshot = await this.practiceHubPage!.takeScreenshot();
  this.attach(screenshot, "image/png");
});

Then("I capture a screenshot of the current page", async function (this: CustomWorld) {
  const screenshot = await this.page!.screenshot({ fullPage: true });
  this.attach(screenshot, "image/png");
});

// ── Navigation to sub-sections ──

When("I click the Test Login Page link", async function (this: CustomWorld) {
  await this.practiceHubPage!.clickTestLoginLink();
});

When("I click the Test Exceptions link", async function (this: CustomWorld) {
  await this.practiceHubPage!.clickTestExceptionsLink();
});

When("I click the JavaScript Delays link", async function (this: CustomWorld) {
  await this.practiceHubPage!.clickJsDelaysLink();
});

When("I click the Test Table link", async function (this: CustomWorld) {
  await this.practiceHubPage!.clickTestTableLink();
});

// ── URL Validations ──

Then("I should be on the login page URL", async function (this: CustomWorld) {
  const url = this.page!.url();
  expect(url).toContain("practice-test-login");
  console.log(`    🔗 Navigated to: ${url}`);
});

Then("I should be on the test exceptions page URL", async function (this: CustomWorld) {
  const url = this.page!.url();
  expect(url).toContain("practice-test-exceptions");
  console.log(`    🔗 Navigated to: ${url}`);
});

Then("I should be on the javascript delays page URL", async function (this: CustomWorld) {
  const url = this.page!.url();
  expect(url).toContain("javascript-delays");
  console.log(`    🔗 Navigated to: ${url}`);
});

Then("I should be on the test table page URL", async function (this: CustomWorld) {
  const url = this.page!.url();
  expect(url).toContain("table");
  console.log(`    🔗 Navigated to: ${url}`);
});

// ── Content Validations ──

Then("I should see the login form elements", async function (this: CustomWorld) {
  const usernameVisible = await this.loginPage!.isElementVisible("#username");
  const passwordVisible = await this.loginPage!.isElementVisible("#password");
  const submitVisible   = await this.loginPage!.isElementVisible("#submit");
  expect(usernameVisible).toBeTruthy();
  expect(passwordVisible).toBeTruthy();
  expect(submitVisible).toBeTruthy();
  console.log("    ✅ Login form: username, password, submit all visible");
});

Then("I should see the exceptions page content", async function (this: CustomWorld) {
  const content = await this.exceptionsPage!.getPageContentText();
  expect(content.length).toBeGreaterThan(0);
  console.log(`    📄 Exceptions page content length: ${content.length} chars`);
});

Then("I should see the exceptions page loaded", async function (this: CustomWorld) {
  const url = this.page!.url();
  expect(url).toContain("practice-test-exceptions");
  // Take screenshot to validate content visually
  const screenshot = await this.page!.screenshot({ fullPage: true });
  this.attach(screenshot, "image/png");
  console.log(`    ✅ Exceptions page loaded at: ${url}`);
});

Then("I should see the javascript delays page content", async function (this: CustomWorld) {
  const content = await this.jsDelaysPage!.getPageContentText();
  expect(content.length).toBeGreaterThan(0);
  console.log(`    📄 JS Delays page content length: ${content.length} chars`);
});

Then("I should see the test table page content", async function (this: CustomWorld) {
  const url = this.page!.url();
  expect(url).toContain("table");
  const screenshot = await this.page!.screenshot({ fullPage: true });
  this.attach(screenshot, "image/png");
  console.log(`    ✅ Test Table page loaded at: ${url}`);
});

