/**
 * Test: Response Relevance
 * Validates that chatbot responses are relevant to the user query using
 * MCP context and the RelevanceAgent.
 *
 * Author: Shivam Sharma | Senior SDET
 */
import { test, expect } from '@playwright/test';
import { MCPContextBuilder } from '../src/mcp/context-builder';
import { MCPClient } from '../src/mcp/mcp-client';
import { RelevanceAgent } from '../src/agents/relevance-agent';
import { captureStep } from '../src/utils/screenshot-helper';
import { attachEvaluationResult } from '../src/utils/reporter';
import { INTENTS, HISTORIES, BUSINESS_RULES, MOCK_RESPONSES } from '../fixtures/test-data';

const mcpClient = new MCPClient();
const agent = new RelevanceAgent();

test.describe('Response Relevance Tests', () => {
  test('relevant refund response should pass relevance check', async ({ page }, testInfo) => {
    // 1️⃣ Build MCP context
    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.refundPolicy)
      .withHistory(...HISTORIES.refundThread)
      .withBusinessRules(...BUSINESS_RULES)
      .build();

    // 2️⃣ Validate context via MCP client
    const validation = await mcpClient.sendContext(ctx);
    expect(validation.valid, `MCP validation errors: ${validation.errors.join(', ')}`).toBe(true);

    // 3️⃣ Navigate to chatbot (or use mock)
    await page.goto('https://example.com');
    await captureStep(page, testInfo, '01-chatbot-loaded');

    // 4️⃣ Simulate response (replace with real chatbot interaction)
    const response = MOCK_RESPONSES.refundGood;

    // 5️⃣ Evaluate with AI agent
    const result = await agent.evaluate(response, ctx);
    await attachEvaluationResult(testInfo, result);
    await captureStep(page, testInfo, '02-evaluation-complete');

    // 6️⃣ Assert
    expect(result.passed, `Relevance failed: ${result.reasoning}`).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0.7);
  });

  test('off-topic response should fail relevance check', async ({ page }, testInfo) => {
    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.refundPolicy)
      .withHistory(...HISTORIES.refundThread)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');
    await captureStep(page, testInfo, '01-chatbot-loaded');

    // Deliberately wrong response
    const response = 'The weather today in San Francisco is sunny with a high of 72°F.';

    const result = await agent.evaluate(response, ctx);
    await attachEvaluationResult(testInfo, result);
    await captureStep(page, testInfo, '02-evaluation-complete');

    expect(result.passed, 'Off-topic response should fail').toBe(false);
    expect(result.score).toBeLessThan(0.5);
  });
});
