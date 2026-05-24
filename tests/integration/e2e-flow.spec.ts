/**
 * Integration Tests - E2E Flow combining API and UI layers
 * Author: Shivam Sharma, Senior SDET
 *
 * This test creates a post via API, then verifies the UI still works
 * correctly with the application. Demonstrates cross-layer testing.
 *
 * Flow: Create post via API → Verify API response → Login via UI → Verify secure area
 */
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/ApiClient';
import { LoginPage } from '../../src/pages/LoginPage';
import { SecureAreaPage } from '../../src/pages/SecureAreaPage';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { CustomAssertions } from '../../src/utils/custom-assertions';
import { loadJsonData } from '../../src/utils/helpers';

const apiPayloads = loadJsonData<any>('api-payloads.json');

test.describe('Integration Tests - API + UI Combined Flow', () => {

  test('TC-INT-001: Create post via API then verify UI login flow', async ({ page, request }) => {
    // Step 1: Create a post via API
    const api = new ApiClient(request);
    const createResponse = await api.post('/posts', apiPayloads.createPost);
    CustomAssertions.assertStatus(createResponse, 201);
    expect(createResponse.body.id).toBeTruthy();
    const createdPostId = createResponse.body.id;

    // Step 2: Verify the post was created with correct data
    expect(createResponse.body.title).toBe(apiPayloads.createPost.title);
    expect(createResponse.body.body).toBe(apiPayloads.createPost.body);

    // Step 3: Login via UI with known credentials
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');

    // Step 4: Verify we're on the secure area
    const secureArea = new SecureAreaPage(page);
    expect(await secureArea.isOnSecureArea()).toBeTruthy();

    // Step 5: Verify the created post ID is valid (API data consistency)
    expect(Number(createdPostId)).toBeGreaterThan(0);
  });

  test('TC-INT-002: API auth flow then verify UI state', async ({ page, request }) => {
    // Step 1: Login via DummyJSON API
    const authApi = new ApiClient(request, 'https://dummyjson.com');
    const loginResponse = await authApi.post('/auth/login', apiPayloads.loginSuccess);
    CustomAssertions.assertStatus(loginResponse, 200);
    expect(loginResponse.body.accessToken).toBeTruthy();

    // Step 2: Verify authenticated user info
    authApi.setToken(loginResponse.body.accessToken);
    const meResponse = await authApi.get('/auth/me');
    CustomAssertions.assertStatus(meResponse, 200);
    expect(meResponse.body.username).toBe('emilys');

    // Step 3: Verify UI dashboard loads correctly
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    const heading = await dashboard.getHeading();
    expect(heading).toContain('Welcome to the-internet');

    // Step 4: Verify example links are available
    const count = await dashboard.getExampleCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-INT-003: Verify API data consistency across operations', async ({ page, request }) => {
    const api = new ApiClient(request);

    // Step 1: Create post
    const createResponse = await api.post('/posts', apiPayloads.createPost);
    CustomAssertions.assertStatus(createResponse, 201);

    // Step 2: Update the post (use known post ID since JSONPlaceholder is a fake API)
    const updateResponse = await api.put('/posts/1', apiPayloads.updatePost);
    CustomAssertions.assertStatus(updateResponse, 200);
    expect(updateResponse.body.title).toBe(apiPayloads.updatePost.title);

    // Step 3: Navigate UI to verify app is still responsive
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();

    // Step 4: Login to verify full flow
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    const secureArea = new SecureAreaPage(page);
    expect(await secureArea.isOnSecureArea()).toBeTruthy();

    // Step 5: Logout and verify
    await secureArea.logout();
    const msg = await loginPage.getFlashMessage();
    expect(msg).toContain('You logged out of the secure area!');
  });
});
