/**
 * DashboardPage - Page Object for main dashboard interactions
 * Author: Shivam Sharma, Senior SDET
 *
 * Target: https://the-internet.herokuapp.com (main page with available examples)
 */
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly pageHeading: Locator;
  readonly subHeading: Locator;
  readonly availableExamples: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.locator('h1.heading');
    this.subHeading = page.locator('h2');
    this.availableExamples = page.locator('#content ul li a');
  }

  /** Navigate to home/dashboard */
  async goto(): Promise<void> {
    await this.navigate('/');
  }

  /** Get page heading */
  async getHeading(): Promise<string> {
    return await this.getText(this.pageHeading);
  }

  /** Get all available example links */
  async getExampleLinks(): Promise<string[]> {
    const links: string[] = [];
    const count = await this.availableExamples.count();
    for (let i = 0; i < count; i++) {
      const text = await this.availableExamples.nth(i).textContent();
      if (text) links.push(text.trim());
    }
    return links;
  }

  /** Click on a specific example by name */
  async navigateToExample(exampleName: string): Promise<void> {
    const link = this.page.locator(`#content ul li a`, { hasText: exampleName });
    await this.clickWithRetry(link);
  }

  /** Get the count of available examples */
  async getExampleCount(): Promise<number> {
    return await this.availableExamples.count();
  }

  /** Check if a specific example exists */
  async hasExample(exampleName: string): Promise<boolean> {
    const links = await this.getExampleLinks();
    return links.some(link => link.toLowerCase().includes(exampleName.toLowerCase()));
  }
}
