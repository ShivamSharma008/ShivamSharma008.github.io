/**
 * LoginPage - Page Object for Login functionality
 * Author: Shivam Sharma, Senior SDET
 *
 * Target: https://the-internet.herokuapp.com/login
 * Uses semantic locators - no brittle XPath
 */
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators using robust strategies (id, CSS, semantic)
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly flashMessage: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.flashMessage = page.locator('#flash');
    this.pageHeading = page.locator('h2');
  }

  /** Navigate to login page */
  async goto(): Promise<void> {
    await this.navigate('/login');
  }

  /** Perform login with given credentials */
  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickWithRetry(this.loginButton);
  }

  /** Get flash message text */
  async getFlashMessage(): Promise<string> {
    await this.waitForElement(this.flashMessage);
    return await this.getText(this.flashMessage);
  }

  /** Check if login was successful */
  async isLoggedIn(): Promise<boolean> {
    const message = await this.getFlashMessage();
    return message.includes('You logged into a secure area!');
  }

  /** Check if login failed */
  async isLoginFailed(): Promise<boolean> {
    const message = await this.getFlashMessage();
    return message.includes('Your username is invalid!') || message.includes('Your password is invalid!');
  }
}
