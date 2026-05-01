import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";

// ─────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────

Given("I am on the login page", async function (this: CustomWorld) {
  await this.loginPage!.navigate();
});

// ─────────────────────────────────────────────────────
// LOGIN ACTIONS  (step def → page object method)
// ─────────────────────────────────────────────────────

When("I enter username {string}", async function (this: CustomWorld, username: string) {
  await this.loginPage!.enterUsername(username);
});

When("I enter password {string}", async function (this: CustomWorld, password: string) {
  await this.loginPage!.enterPassword(password);
});

When("I click the submit button", async function (this: CustomWorld) {
  await this.loginPage!.clickSubmit();
});

// ─────────────────────────────────────────────────────
// LOGIN ASSERTIONS
// ─────────────────────────────────────────────────────

Then("I should be redirected to the success page", async function (this: CustomWorld) {
  const isLoggedIn = await this.loginPage!.isLoggedInSuccessfully();
  expect(isLoggedIn).toBeTruthy();
});

Then("I should see the success message {string}", async function (this: CustomWorld, expectedMessage: string) {
  const message = await this.loginPage!.getSuccessMessage();
  expect(message).toContain(expectedMessage);
});

Then("I should see an error message {string}", async function (this: CustomWorld, expectedError: string) {
  const errorMessage = await this.loginPage!.getErrorMessage();
  expect(errorMessage).toContain(expectedError);
});

// ─────────────────────────────────────────────────────
// POST-LOGIN ACTIONS  (LoggedInPage page object)
// ─────────────────────────────────────────────────────

Then("I should see the logout button on the success page", async function (this: CustomWorld) {
  const isVisible = await this.loggedInPage!.isLogoutButtonVisible();
  expect(isVisible).toBeTruthy();
});

Then(
  "I should see the page content contains {string} or {string}",
  async function (this: CustomWorld, text1: string, text2: string) {
    const content = await this.loggedInPage!.getPageContent();
    const hasText = content.toLowerCase().includes(text1.toLowerCase())
      || content.toLowerCase().includes(text2.toLowerCase());
    expect(hasText).toBeTruthy();
  }
);

When("I click the logout button", async function (this: CustomWorld) {
  await this.loggedInPage!.clickLogout();
});

Then("I should be navigated back to the login page", async function (this: CustomWorld) {
  // After logout the URL should contain "practice-test-login"
  await this.page!.waitForLoadState("networkidle");
  const url = this.page!.url();
  expect(url).toContain("practice-test-login");
});
