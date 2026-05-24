/**
 * Playwright Configuration
 * Author: Shivam Sharma, Senior SDET
 * Multi-browser, parallel execution, HTML reporting with failure artifacts
 */
import { defineConfig, devices } from '@playwright/test';
import { getConfig } from './config/env.config';

const config = getConfig();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : config.retryCount,
  workers: process.env.CI ? 2 : undefined,
  timeout: config.timeout,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'reports/test-results.json' }],
  ],

  use: {
    baseURL: config.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: config.apiBaseUrl,
      },
    },
  ],
});
