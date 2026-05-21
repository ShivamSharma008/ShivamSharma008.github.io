/**
 * Test: Factual Accuracy
 * Validates chatbot responses against ground-truth data using
 * MCP context and the AccuracyAgent.
 *
 * Author: Shivam Sharma | Senior SDET
 */
import { test, expect } from '@playwright/test';
import { MCPContextBuilder } from '../src/mcp/context-builder';
import { MCPClient } from '../src/mcp/mcp-client';
import { AccuracyAgent } from '../src/agents/accuracy-agent';
import { captureStep } from '../src/utils/screenshot-helper';
import { attachEvaluationResult } from '../src/utils/reporter';
import {
  INTENTS,
  HISTORIES,
  GROUND_TRUTHS,
  MOCK_RESPONSES,
} from '../fixtures/test-data';

const mcpClient = new MCPClient();
const agent = new AccuracyAgent();

test.describe('Factual Accuracy Tests', () => {
  test('correct refund facts should pass accuracy check', async ({ page }, testInfo) => {
    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.refundPolicy)
      .withHistory(...HISTORIES.refundThread)
      .withGroundTruth(GROUND_TRUTHS.refundPolicy)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');
    await captureStep(page, testInfo, '01-chatbot-loaded');

    const response = MOCK_RESPONSES.refundGood;

    const result = await agent.evaluate(response, ctx);
    await attachEvaluationResult(testInfo, result);
    await captureStep(page, testInfo, '02-evaluation-complete');

    expect(result.passed, `Accuracy failed: ${result.reasoning}`).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0.8);
  });

  test('incorrect refund facts should fail accuracy check', async ({ page }, testInfo) => {
    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.refundPolicy)
      .withGroundTruth(GROUND_TRUTHS.refundPolicy)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');
    await captureStep(page, testInfo, '01-chatbot-loaded');

    const response = MOCK_RESPONSES.refundBad;

    const result = await agent.evaluate(response, ctx);
    await attachEvaluationResult(testInfo, result);
    await captureStep(page, testInfo, '02-evaluation-complete');

    expect(result.passed, 'Incorrect facts should fail').toBe(false);
  });

  test('fabricated pricing data should fail accuracy check', async ({ page }, testInfo) => {
    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.pricingInquiry)
      .withGroundTruth(GROUND_TRUTHS.pricing)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');
    await captureStep(page, testInfo, '01-chatbot-loaded');

    const response = MOCK_RESPONSES.pricingFabricated;

    const result = await agent.evaluate(response, ctx);
    await attachEvaluationResult(testInfo, result);
    await captureStep(page, testInfo, '02-evaluation-complete');

    expect(result.passed, 'Fabricated data should fail accuracy').toBe(false);
    expect(result.score).toBeLessThan(0.5);
  });
});
