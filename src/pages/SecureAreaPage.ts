/**
 * SecureAreaPage - Page Object for the Secure Area (post-login dashboard)
 * Author: Shivam Sharma, Senior SDET
 *
 * Target: https://the-internet.herokuapp.com/secure
 */
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SecureAreaPage extends BasePage {
  readonly logoutButton: Locator;
  readonly flashMessage: Locator;
  readonly pageHeading: Locator;
  readonly subHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.logoutButton = page.locator('a.button[href="/logout"]');
    this.flashMessage = page.locator('#flash');
    this.pageHeading = page.locator('h2');
    this.subHeading = page.locator('h4.subheader');
  }

  /** Get heading text */
  async getHeadingText(): Promise<string> {
    return await this.getText(this.pageHeading);
  }

  /** Get sub-heading text */
  async getSubHeadingText(): Promise<string> {
    return await this.getText(this.subHeading);
  }

  /** Perform logout */
  async logout(): Promise<void> {
    await this.clickWithRetry(this.logoutButton);
  }

  /** Check if on secure area */
  async isOnSecureArea(): Promise<boolean> {
    const heading = await this.getHeadingText();
    return heading.includes('Secure Area');
  }
}
