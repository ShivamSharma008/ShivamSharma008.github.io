/**
 * Test: Business Rule Compliance
 * Validates that chatbot responses adhere to all applicable business rules
 * using MCP context and the BusinessRulesAgent.
 *
 * Author: Shivam Sharma | Senior SDET
 */
import { test, expect } from '@playwright/test';
import { MCPContextBuilder } from '../src/mcp/context-builder';
import { MCPClient } from '../src/mcp/mcp-client';
import { BusinessRulesAgent } from '../src/agents/business-rules-agent';
import { captureStep } from '../src/utils/screenshot-helper';
import { attachEvaluationResult, summarizeResults } from '../src/utils/reporter';
import {
  INTENTS,
  HISTORIES,
  BUSINESS_RULES,
  GROUND_TRUTHS,
  MOCK_RESPONSES,
} from '../fixtures/test-data';

const mcpClient = new MCPClient();
const agent = new BusinessRulesAgent();

test.describe('Business Rule Compliance Tests', () => {
  test('refund response mentioning 30-day window should comply', async ({ page }, testInfo) => {
    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.refundPolicy)
      .withHistory(...HISTORIES.refundThread)
      .withBusinessRules(...BUSINESS_RULES)
      .withGroundTruth(GROUND_TRUTHS.refundPolicy)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');
    await captureStep(page, testInfo, '01-chatbot-loaded');

    const response = MOCK_RESPONSES.refundGood;

    const result = await agent.evaluate(response, ctx);
    await attachEvaluationResult(testInfo, result);
    await captureStep(page, testInfo, '02-evaluation-complete');

    expect(result.passed, `Business rule violation: ${result.reasoning}`).toBe(true);
  });

  test('response omitting refund window should violate BR-001', async ({ page }, testInfo) => {
    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.refundPolicy)
      .withBusinessRules(...BUSINESS_RULES)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');
    await captureStep(page, testInfo, '01-chatbot-loaded');

    const response = MOCK_RESPONSES.refundBad;

    const result = await agent.evaluate(response, ctx);
    await attachEvaluationResult(testInfo, result);
    await captureStep(page, testInfo, '02-evaluation-complete');

    expect(result.passed, 'Missing refund window should violate BR-001').toBe(false);
  });

  test('tech support should offer escalation after 2+ turns', async ({ page }, testInfo) => {
    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.technicalIssue)
      .withHistory(...HISTORIES.techSupportThread)
      .withBusinessRules(...BUSINESS_RULES)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');
    await captureStep(page, testInfo, '01-chatbot-loaded');

    const response = MOCK_RESPONSES.techSupportGood;

    const result = await agent.evaluate(response, ctx);
    await attachEvaluationResult(testInfo, result);
    await captureStep(page, testInfo, '02-evaluation-complete');

    const { summary } = summarizeResults([result]);
    console.log(`Business Rules Summary: ${summary}`);

    expect(result.passed).toBe(true);
  });
});
