/**
 * Dashboard Interaction Tests - UI Tests
 * Author: Shivam Sharma, Senior SDET
 *
 * Covers: Dashboard load, navigation links, example availability
 * Target: https://the-internet.herokuapp.com
 */
import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Dashboard Tests', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    await dashboard.goto();
  });

  test('TC-DASH-001: Should load dashboard with heading', async () => {
    const heading = await dashboard.getHeading();
    expect(heading).toContain('Welcome to the-internet');
  });

  test('TC-DASH-002: Should display available example links', async () => {
    const count = await dashboard.getExampleCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-DASH-003: Should contain key test examples', async () => {
    expect(await dashboard.hasExample('Form Authentication')).toBeTruthy();
    expect(await dashboard.hasExample('Checkboxes')).toBeTruthy();
    expect(await dashboard.hasExample('Dropdown')).toBeTruthy();
  });

  test('TC-DASH-004: Should navigate to Form Authentication page', async ({ page }) => {
    await dashboard.navigateToExample('Form Authentication');
    await expect(page).toHaveURL(/.*login/);
  });

  test('TC-DASH-005: Should navigate to Checkboxes page', async ({ page }) => {
    await dashboard.navigateToExample('Checkboxes');
    await expect(page).toHaveURL(/.*checkboxes/);
  });

  test('TC-DASH-006: Should have correct page title', async () => {
    const title = await dashboard.getTitle();
    expect(title).toBe('The Internet');
  });
});
