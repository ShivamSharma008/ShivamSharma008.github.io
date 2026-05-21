/**
 * Test: Tone Validation
 * Ensures chatbot responses match the expected tone (professional, empathetic, etc.)
 * using MCP context and the ToneAgent.
 *
 * Author: Shivam Sharma | Senior SDET
 */
import { test, expect } from '@playwright/test';
import { MCPContextBuilder } from '../src/mcp/context-builder';
import { MCPClient } from '../src/mcp/mcp-client';
import { ToneAgent } from '../src/agents/tone-agent';
import { captureStep } from '../src/utils/screenshot-helper';
import { attachEvaluationResult } from '../src/utils/reporter';
import { INTENTS, HISTORIES, MOCK_RESPONSES } from '../fixtures/test-data';

const mcpClient = new MCPClient();

test.describe('Tone Validation Tests', () => {
  test('empathetic response to frustrated user should pass', async ({ page }, testInfo) => {
    const agent = new ToneAgent('empathetic');

    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.technicalIssue)
      .withHistory(...HISTORIES.techSupportThread)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');
    await captureStep(page, testInfo, '01-chatbot-loaded');

    const response = MOCK_RESPONSES.techSupportGood;

    const result = await agent.evaluate(response, ctx);
    await attachEvaluationResult(testInfo, result);
    await captureStep(page, testInfo, '02-evaluation-complete');

    expect(result.passed, `Tone failed: ${result.reasoning}`).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0.7);
  });

  test('rude response to frustrated user should fail tone check', async ({ page }, testInfo) => {
    const agent = new ToneAgent('empathetic');

    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.technicalIssue)
      .withHistory(...HISTORIES.techSupportThread)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');
    await captureStep(page, testInfo, '01-chatbot-loaded');

    const response = MOCK_RESPONSES.techSupportBad;

    const result = await agent.evaluate(response, ctx);
    await attachEvaluationResult(testInfo, result);
    await captureStep(page, testInfo, '02-evaluation-complete');

    expect(result.passed, 'Rude response should fail tone validation').toBe(false);
  });

  test('professional tone on billing inquiry should pass', async ({ page }, testInfo) => {
    const agent = new ToneAgent('professional');

    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.pricingInquiry)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');
    await captureStep(page, testInfo, '01-chatbot-loaded');

    const response = MOCK_RESPONSES.pricingGood;

    const result = await agent.evaluate(response, ctx);
    await attachEvaluationResult(testInfo, result);
    await captureStep(page, testInfo, '02-evaluation-complete');

    expect(result.passed).toBe(true);
  });
});
