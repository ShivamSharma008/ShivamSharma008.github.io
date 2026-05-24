/**
 * Cross-Browser Smoke Tests - UI Tests
 * Author: Shivam Sharma, Senior SDET
 *
 * Lightweight smoke tests designed to run across all browser projects.
 * Validates core functionality works across chromium, firefox, and webkit.
 */
import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { LoginPage } from '../../src/pages/LoginPage';
import { SecureAreaPage } from '../../src/pages/SecureAreaPage';

test.describe('Cross-Browser Smoke Tests', () => {
  test('SMOKE-001: Homepage loads correctly', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    const heading = await dashboard.getHeading();
    expect(heading).toContain('Welcome to the-internet');
    const title = await dashboard.getTitle();
    expect(title).toBe('The Internet');
  });

  test('SMOKE-002: Login and logout flow works', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');

    const secureArea = new SecureAreaPage(page);
    expect(await secureArea.isOnSecureArea()).toBeTruthy();

    await secureArea.logout();
    const msg = await loginPage.getFlashMessage();
    expect(msg).toContain('You logged out of the secure area!');
  });

  test('SMOKE-003: Page navigation works', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await dashboard.navigateToExample('Checkboxes');
    await expect(page).toHaveURL(/.*checkboxes/);
  });
});
