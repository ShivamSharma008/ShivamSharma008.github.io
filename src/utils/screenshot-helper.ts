/**
 * Screenshot Helper — captures and attaches screenshots inside Playwright tests
 */
import type { Page, TestInfo } from '@playwright/test';
import path from 'path';

export async function captureStep(
  page: Page,
  testInfo: TestInfo,
  stepName: string
): Promise<string> {
  const safeName = stepName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filePath = path.join('reports', `${safeName}-${Date.now()}.png`);

  const buffer = await page.screenshot({ fullPage: true });

  // Attach to Playwright HTML report
  await testInfo.attach(stepName, {
    body: buffer,
    contentType: 'image/png',
  });

  return filePath;
}
