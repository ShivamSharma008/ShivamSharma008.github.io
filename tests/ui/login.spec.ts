/**
 * Login Flow Tests - UI Tests
 * Author: Shivam Sharma, Senior SDET
 *
 * Covers: Valid login, invalid credentials (data-driven), logout flow
 * Target: https://the-internet.herokuapp.com/login
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { SecureAreaPage } from '../../src/pages/SecureAreaPage';
import { loadJsonData } from '../../src/utils/helpers';

interface UserData {
  validCredentials: { username: string; password: string };
  invalidCredentials: Array<{ username: string; password: string; expectedError: string }>;
}

const userData = loadJsonData<UserData>('users.json');

test.describe('Login Flow Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC-LOGIN-001: Should login successfully with valid credentials', async ({ page }) => {
    await loginPage.login(userData.validCredentials.username, userData.validCredentials.password);
    const secureArea = new SecureAreaPage(page);
    expect(await secureArea.isOnSecureArea()).toBeTruthy();
  });

  test('TC-LOGIN-002: Should display success message after login', async ({ page }) => {
    await loginPage.login(userData.validCredentials.username, userData.validCredentials.password);
    const flashMessage = await loginPage.getFlashMessage();
    expect(flashMessage).toContain('You logged into a secure area!');
  });

  test('TC-LOGIN-003: Should logout successfully', async ({ page }) => {
    await loginPage.login(userData.validCredentials.username, userData.validCredentials.password);
    const secureArea = new SecureAreaPage(page);
    await secureArea.logout();
    const flashMessage = await loginPage.getFlashMessage();
    expect(flashMessage).toContain('You logged out of the secure area!');
  });

  // Data-driven invalid login tests
  for (const [index, cred] of userData.invalidCredentials.entries()) {
    test(`TC-LOGIN-004.${index + 1}: Should show error for invalid credentials - "${cred.username || '(empty)'}"`, async () => {
      await loginPage.login(cred.username, cred.password);
      const flashMessage = await loginPage.getFlashMessage();
      expect(flashMessage).toContain(cred.expectedError);
    });
  }

  test('TC-LOGIN-005: Should have correct page elements', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.pageHeading).toContainText('Login Page');
  });
});
