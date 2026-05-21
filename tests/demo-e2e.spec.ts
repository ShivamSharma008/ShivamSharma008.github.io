/**
 * Demo Test Suite — runs WITHOUT an OpenAI API key.
 * Uses mock AI evaluation results to demonstrate the full pipeline:
 * Browser → MCP Context → Evaluation → Screenshots → HTML Report
 *
 * Author: Shivam Sharma | Senior SDET
 */
import { test, expect } from '@playwright/test';
import { MCPContextBuilder } from '../src/mcp/context-builder';
import { MCPClient } from '../src/mcp/mcp-client';
import { captureStep } from '../src/utils/screenshot-helper';
import { attachEvaluationResult, summarizeResults } from '../src/utils/reporter';
import { INTENTS, HISTORIES, BUSINESS_RULES, GROUND_TRUTHS, MOCK_RESPONSES } from '../fixtures/test-data';
import type { EvaluationResult } from '../src/types';

const mcpClient = new MCPClient();

/** Helper: create a mock evaluation result */
function mockEvaluation(
  agentName: string,
  score: number,
  reasoning: string,
  details: { criterion: string; score: number; observation: string }[]
): EvaluationResult {
  return {
    agentName,
    passed: score >= 0.7,
    score,
    confidence: 0.9,
    reasoning,
    details: details.map((d) => ({ ...d, passed: d.score >= 0.7 })),
    timestamp: new Date().toISOString(),
  };
}

// ─── RELEVANCE TESTS ──────────────────────────────────────────

test.describe('🎯 Response Relevance (Demo)', () => {
  test('✅ Relevant refund response passes relevance check', async ({ page }, testInfo) => {
    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.refundPolicy)
      .withHistory(...HISTORIES.refundThread)
      .withBusinessRules(...BUSINESS_RULES)
      .build();

    const validation = await mcpClient.sendContext(ctx);
    expect(validation.valid).toBe(true);

    await page.goto('https://example.com');
    await captureStep(page, testInfo, '01-page-loaded');

    // Display the test scenario on the page
    await page.evaluate((data) => {
      document.body.innerHTML = `
        <div style="font-family:system-ui;max-width:800px;margin:40px auto;padding:20px">
          <h1 style="color:#2563eb">🎯 Relevance Test — Refund Policy</h1>
          <div style="background:#f0f9ff;padding:16px;border-radius:8px;margin:16px 0">
            <h3>User Query:</h3>
            <p>"${data.query}"</p>
          </div>
          <div style="background:#f0fdf4;padding:16px;border-radius:8px;margin:16px 0">
            <h3>Chatbot Response:</h3>
            <p>${data.response}</p>
          </div>
          <div style="background:#fefce8;padding:16px;border-radius:8px;margin:16px 0">
            <h3>MCP Context:</h3>
            <p><strong>Category:</strong> ${data.category} | <strong>Topic:</strong> ${data.topic} | <strong>Sentiment:</strong> ${data.sentiment}</p>
            <p><strong>Session ID:</strong> ${data.sessionId}</p>
          </div>
        </div>`;
    }, {
      query: ctx.userIntent.query,
      response: MOCK_RESPONSES.refundGood,
      category: ctx.userIntent.category,
      topic: ctx.userIntent.expectedTopic,
      sentiment: ctx.userIntent.sentiment,
      sessionId: ctx.sessionId,
    });

    await captureStep(page, testInfo, '02-scenario-displayed');
    await page.waitForTimeout(1500);

    const result = mockEvaluation('RelevanceAgent', 0.92, 'Response directly addresses refund policy with accurate details.', [
      { criterion: 'topic_match', score: 0.95, observation: 'Response is about refund policy as expected.' },
      { criterion: 'query_addressed', score: 0.90, observation: 'All parts of the query are answered.' },
      { criterion: 'no_hallucination', score: 0.90, observation: 'No off-topic information introduced.' },
    ]);

    // Show evaluation result on page
    await page.evaluate((res) => {
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="font-family:system-ui;max-width:800px;margin:0 auto;padding:0 20px 40px">
          <div style="background:${res.passed ? '#f0fdf4' : '#fef2f2'};padding:16px;border-radius:8px;border-left:4px solid ${res.passed ? '#22c55e' : '#ef4444'}">
            <h3>${res.passed ? '✅' : '❌'} ${res.agentName} — Score: ${res.score.toFixed(2)}</h3>
            <p>${res.reasoning}</p>
            <ul>${res.details.map((d: any) => `<li><strong>${d.criterion}:</strong> ${d.score.toFixed(2)} — ${d.observation}</li>`).join('')}</ul>
          </div>
        </div>`;
      document.body.appendChild(el);
    }, result);

    await captureStep(page, testInfo, '03-evaluation-result');
    await attachEvaluationResult(testInfo, result);

    expect(result.passed).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0.7);
  });

  test('❌ Off-topic response fails relevance check', async ({ page }, testInfo) => {
    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.refundPolicy)
      .withHistory(...HISTORIES.refundThread)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');
    await captureStep(page, testInfo, '01-page-loaded');

    const offTopicResponse = 'The weather today in San Francisco is sunny with a high of 72°F.';

    await page.evaluate((data) => {
      document.body.innerHTML = `
        <div style="font-family:system-ui;max-width:800px;margin:40px auto;padding:20px">
          <h1 style="color:#dc2626">🎯 Relevance Test — Off-Topic Detection</h1>
          <div style="background:#f0f9ff;padding:16px;border-radius:8px;margin:16px 0">
            <h3>User Query:</h3>
            <p>"${data.query}"</p>
          </div>
          <div style="background:#fef2f2;padding:16px;border-radius:8px;margin:16px 0">
            <h3>Chatbot Response (OFF-TOPIC):</h3>
            <p>${data.response}</p>
          </div>
        </div>`;
    }, { query: ctx.userIntent.query, response: offTopicResponse });

    await captureStep(page, testInfo, '02-off-topic-scenario');
    await page.waitForTimeout(1500);

    const result = mockEvaluation('RelevanceAgent', 0.08, 'Response is completely off-topic. User asked about refund policy but got weather information.', [
      { criterion: 'topic_match', score: 0.05, observation: 'Weather has nothing to do with refund policy.' },
      { criterion: 'query_addressed', score: 0.0, observation: 'User query is not addressed at all.' },
      { criterion: 'no_hallucination', score: 0.20, observation: 'Entire response is irrelevant content.' },
    ]);

    await page.evaluate((res) => {
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="font-family:system-ui;max-width:800px;margin:0 auto;padding:0 20px 40px">
          <div style="background:#fef2f2;padding:16px;border-radius:8px;border-left:4px solid #ef4444">
            <h3>❌ ${res.agentName} — Score: ${res.score.toFixed(2)}</h3>
            <p>${res.reasoning}</p>
            <ul>${res.details.map((d: any) => `<li><strong>${d.criterion}:</strong> ${d.score.toFixed(2)} — ${d.observation}</li>`).join('')}</ul>
          </div>
        </div>`;
      document.body.appendChild(el);
    }, result);

    await captureStep(page, testInfo, '03-evaluation-failed');
    await attachEvaluationResult(testInfo, result);

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(0.5);
  });
});

// ─── TONE TESTS ───────────────────────────────────────────────

test.describe('🎭 Tone Validation (Demo)', () => {
  test('✅ Empathetic response to frustrated user passes', async ({ page }, testInfo) => {
    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.technicalIssue)
      .withHistory(...HISTORIES.techSupportThread)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');
    await captureStep(page, testInfo, '01-page-loaded');

    await page.evaluate((data) => {
      document.body.innerHTML = `
        <div style="font-family:system-ui;max-width:800px;margin:40px auto;padding:20px">
          <h1 style="color:#7c3aed">🎭 Tone Test — Empathy Check</h1>
          <div style="background:#fef2f2;padding:16px;border-radius:8px;margin:16px 0">
            <h3>😤 Frustrated User:</h3>
            <p>"${data.query}"</p>
            <span style="background:#fee2e2;padding:4px 8px;border-radius:4px;font-size:12px">Sentiment: ${data.sentiment}</span>
          </div>
          <div style="background:#f0fdf4;padding:16px;border-radius:8px;margin:16px 0">
            <h3>🤖 Chatbot Response:</h3>
            <p>${data.response}</p>
          </div>
        </div>`;
    }, {
      query: ctx.userIntent.query,
      response: MOCK_RESPONSES.techSupportGood,
      sentiment: ctx.userIntent.sentiment,
    });

    await captureStep(page, testInfo, '02-tone-scenario');
    await page.waitForTimeout(1500);

    const result = mockEvaluation('ToneAgent', 0.91, 'Response shows genuine empathy and offers concrete help.', [
      { criterion: 'tone_match', score: 0.90, observation: 'Empathetic tone maintained throughout.' },
      { criterion: 'empathy', score: 0.95, observation: 'Acknowledges frustration with "I understand how frustrating..."' },
      { criterion: 'professionalism', score: 0.90, observation: 'Professional language used consistently.' },
      { criterion: 'consistency', score: 0.88, observation: 'Tone is consistent from acknowledgment to resolution steps.' },
    ]);

    await page.evaluate((res) => {
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="font-family:system-ui;max-width:800px;margin:0 auto;padding:0 20px 40px">
          <div style="background:#f0fdf4;padding:16px;border-radius:8px;border-left:4px solid #22c55e">
            <h3>✅ ${res.agentName} — Score: ${res.score.toFixed(2)}</h3>
            <p>${res.reasoning}</p>
            <ul>${res.details.map((d: any) => `<li><strong>${d.criterion}:</strong> ${d.score.toFixed(2)} — ${d.observation}</li>`).join('')}</ul>
          </div>
        </div>`;
      document.body.appendChild(el);
    }, result);

    await captureStep(page, testInfo, '03-tone-passed');
    await attachEvaluationResult(testInfo, result);

    expect(result.passed).toBe(true);
  });

  test('❌ Rude response to frustrated user fails tone check', async ({ page }, testInfo) => {
    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.technicalIssue)
      .withHistory(...HISTORIES.techSupportThread)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');

    await page.evaluate((data) => {
      document.body.innerHTML = `
        <div style="font-family:system-ui;max-width:800px;margin:40px auto;padding:20px">
          <h1 style="color:#dc2626">🎭 Tone Test — Rude Response Detection</h1>
          <div style="background:#fef2f2;padding:16px;border-radius:8px;margin:16px 0">
            <h3>😤 Frustrated User:</h3>
            <p>"${data.query}"</p>
          </div>
          <div style="background:#fef2f2;padding:16px;border-radius:8px;margin:16px 0;border-left:4px solid #ef4444">
            <h3>🤖 Rude Chatbot Response:</h3>
            <p style="color:#dc2626">${data.response}</p>
          </div>
        </div>`;
    }, { query: ctx.userIntent.query, response: MOCK_RESPONSES.techSupportBad });

    await captureStep(page, testInfo, '01-rude-response');
    await page.waitForTimeout(1500);

    const result = mockEvaluation('ToneAgent', 0.15, 'Response is dismissive and rude. No empathy shown to a frustrated user.', [
      { criterion: 'tone_match', score: 0.10, observation: 'Tone is dismissive, not empathetic.' },
      { criterion: 'empathy', score: 0.05, observation: 'Zero empathy — "It\'s not that complicated" is condescending.' },
      { criterion: 'professionalism', score: 0.20, observation: '"Go figure it out" is unprofessional.' },
      { criterion: 'consistency', score: 0.25, observation: 'Consistently rude throughout.' },
    ]);

    await page.evaluate((res) => {
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="font-family:system-ui;max-width:800px;margin:0 auto;padding:0 20px 40px">
          <div style="background:#fef2f2;padding:16px;border-radius:8px;border-left:4px solid #ef4444">
            <h3>❌ ${res.agentName} — Score: ${res.score.toFixed(2)}</h3>
            <p>${res.reasoning}</p>
            <ul>${res.details.map((d: any) => `<li><strong>${d.criterion}:</strong> ${d.score.toFixed(2)} — ${d.observation}</li>`).join('')}</ul>
          </div>
        </div>`;
      document.body.appendChild(el);
    }, result);

    await captureStep(page, testInfo, '02-tone-failed');
    await attachEvaluationResult(testInfo, result);

    expect(result.passed).toBe(false);
  });
});

// ─── ACCURACY TESTS ───────────────────────────────────────────

test.describe('📊 Factual Accuracy (Demo)', () => {
  test('✅ Correct pricing facts pass accuracy check', async ({ page }, testInfo) => {
    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.pricingInquiry)
      .withGroundTruth(GROUND_TRUTHS.pricing)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');

    await page.evaluate((data) => {
      document.body.innerHTML = `
        <div style="font-family:system-ui;max-width:800px;margin:40px auto;padding:20px">
          <h1 style="color:#059669">📊 Accuracy Test — Pricing Facts</h1>
          <div style="background:#f0f9ff;padding:16px;border-radius:8px;margin:16px 0">
            <h3>User Query:</h3>
            <p>"${data.query}"</p>
          </div>
          <div style="background:#f0fdf4;padding:16px;border-radius:8px;margin:16px 0">
            <h3>Chatbot Response:</h3>
            <p>${data.response}</p>
          </div>
          <div style="background:#fefce8;padding:16px;border-radius:8px;margin:16px 0">
            <h3>Ground Truth:</h3>
            <ul>${data.facts.map((f: any) => `<li><strong>${f.claim}:</strong> ${f.expectedValue}</li>`).join('')}</ul>
          </div>
        </div>`;
    }, {
      query: ctx.userIntent.query,
      response: MOCK_RESPONSES.pricingGood,
      facts: GROUND_TRUTHS.pricing.facts,
    });

    await captureStep(page, testInfo, '01-accuracy-scenario');
    await page.waitForTimeout(1500);

    const result = mockEvaluation('AccuracyAgent', 0.95, 'All pricing facts match ground truth exactly.', [
      { criterion: 'factual_correctness', score: 1.0, observation: '$99/month, 10 seats, 20% discount — all correct.' },
      { criterion: 'no_fabrication', score: 0.95, observation: 'Demo offer mentioned is valid upsell, not fabrication.' },
      { criterion: 'completeness', score: 0.90, observation: 'All 3 ground truth facts are addressed.' },
    ]);

    await page.evaluate((res) => {
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="font-family:system-ui;max-width:800px;margin:0 auto;padding:0 20px 40px">
          <div style="background:#f0fdf4;padding:16px;border-radius:8px;border-left:4px solid #22c55e">
            <h3>✅ ${res.agentName} — Score: ${res.score.toFixed(2)}</h3>
            <p>${res.reasoning}</p>
            <ul>${res.details.map((d: any) => `<li><strong>${d.criterion}:</strong> ${d.score.toFixed(2)} — ${d.observation}</li>`).join('')}</ul>
          </div>
        </div>`;
      document.body.appendChild(el);
    }, result);

    await captureStep(page, testInfo, '02-accuracy-passed');
    await attachEvaluationResult(testInfo, result);

    expect(result.passed).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0.8);
  });

  test('❌ Fabricated pricing data fails accuracy check', async ({ page }, testInfo) => {
    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.pricingInquiry)
      .withGroundTruth(GROUND_TRUTHS.pricing)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');

    await page.evaluate((data) => {
      document.body.innerHTML = `
        <div style="font-family:system-ui;max-width:800px;margin:40px auto;padding:20px">
          <h1 style="color:#dc2626">📊 Accuracy Test — Fabricated Data Detection</h1>
          <div style="background:#f0f9ff;padding:16px;border-radius:8px;margin:16px 0">
            <h3>User Query:</h3>
            <p>"${data.query}"</p>
          </div>
          <div style="background:#fef2f2;padding:16px;border-radius:8px;margin:16px 0;border-left:4px solid #ef4444">
            <h3>🚨 Chatbot Response (FABRICATED):</h3>
            <p style="color:#dc2626">${data.response}</p>
          </div>
          <div style="background:#fefce8;padding:16px;border-radius:8px;margin:16px 0">
            <h3>Ground Truth:</h3>
            <ul>${data.facts.map((f: any) => `<li><strong>${f.claim}:</strong> ${f.expectedValue}</li>`).join('')}</ul>
          </div>
        </div>`;
    }, {
      query: ctx.userIntent.query,
      response: MOCK_RESPONSES.pricingFabricated,
      facts: GROUND_TRUTHS.pricing.facts,
    });

    await captureStep(page, testInfo, '01-fabricated-scenario');
    await page.waitForTimeout(1500);

    const result = mockEvaluation('AccuracyAgent', 0.12, 'Response contains fabricated pricing. $49 vs actual $99, no minimum vs actual 10 seats, lifetime deal is fabricated.', [
      { criterion: 'factual_correctness', score: 0.10, observation: 'Price ($49) and minimum seats (none) are both wrong.' },
      { criterion: 'no_fabrication', score: 0.05, observation: '"Lifetime deal at $999" is completely fabricated.' },
      { criterion: 'completeness', score: 0.20, observation: 'Annual discount not mentioned at all.' },
    ]);

    await page.evaluate((res) => {
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="font-family:system-ui;max-width:800px;margin:0 auto;padding:0 20px 40px">
          <div style="background:#fef2f2;padding:16px;border-radius:8px;border-left:4px solid #ef4444">
            <h3>❌ ${res.agentName} — Score: ${res.score.toFixed(2)}</h3>
            <p>${res.reasoning}</p>
            <ul>${res.details.map((d: any) => `<li><strong>${d.criterion}:</strong> ${d.score.toFixed(2)} — ${d.observation}</li>`).join('')}</ul>
          </div>
        </div>`;
      document.body.appendChild(el);
    }, result);

    await captureStep(page, testInfo, '02-accuracy-failed');
    await attachEvaluationResult(testInfo, result);

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(0.5);
  });
});

// ─── BUSINESS RULES TESTS ────────────────────────────────────

test.describe('📋 Business Rule Compliance (Demo)', () => {
  test('✅ Refund response with 30-day window complies with BR-001', async ({ page }, testInfo) => {
    const ctx = new MCPContextBuilder()
      .withUserIntent(INTENTS.refundPolicy)
      .withHistory(...HISTORIES.refundThread)
      .withBusinessRules(...BUSINESS_RULES)
      .withGroundTruth(GROUND_TRUTHS.refundPolicy)
      .build();

    await mcpClient.sendContext(ctx);
    await page.goto('https://example.com');

    await page.evaluate((data) => {
      document.body.innerHTML = `
        <div style="font-family:system-ui;max-width:800px;margin:40px auto;padding:20px">
          <h1 style="color:#d97706">📋 Business Rules Test — Compliance Check</h1>
          <div style="background:#f0f9ff;padding:16px;border-radius:8px;margin:16px 0">
            <h3>User Query:</h3>
            <p>"${data.query}"</p>
          </div>
          <div style="background:#f0fdf4;padding:16px;border-radius:8px;margin:16px 0">
            <h3>Chatbot Response:</h3>
            <p>${data.response}</p>
          </div>
          <div style="background:#fefce8;padding:16px;border-radius:8px;margin:16px 0">
            <h3>Business Rules:</h3>
            <ul>${data.rules.map((r: any) => `<li><strong>[${r.severity}] ${r.id}:</strong> ${r.name} — ${r.expectedBehavior}</li>`).join('')}</ul>
          </div>
        </div>`;
    }, {
      query: ctx.userIntent.query,
      response: MOCK_RESPONSES.refundGood,
      rules: BUSINESS_RULES,
    });

    await captureStep(page, testInfo, '01-rules-scenario');
    await page.waitForTimeout(1500);

    const result = mockEvaluation('BusinessRulesAgent', 0.93, 'Response complies with all applicable business rules.', [
      { criterion: 'BR-001', score: 1.0, observation: '30-day refund window is explicitly mentioned.' },
      { criterion: 'BR-003', score: 1.0, observation: 'No PII is requested in the response.' },
      { criterion: 'BR-004', score: 0.80, observation: 'Escalation path implied via "contact support".' },
    ]);

    // Show final summary
    const { summary } = summarizeResults([result]);

    await page.evaluate((data) => {
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="font-family:system-ui;max-width:800px;margin:0 auto;padding:0 20px 40px">
          <div style="background:#f0fdf4;padding:16px;border-radius:8px;border-left:4px solid #22c55e">
            <h3>✅ ${data.res.agentName} — Score: ${data.res.score.toFixed(2)}</h3>
            <p>${data.res.reasoning}</p>
            <ul>${data.res.details.map((d: any) => `<li><strong>${d.criterion}:</strong> ${d.score.toFixed(2)} — ${d.observation}</li>`).join('')}</ul>
          </div>
          <div style="background:#ede9fe;padding:16px;border-radius:8px;margin-top:16px;text-align:center">
            <h3>📊 Summary: ${data.summary}</h3>
          </div>
        </div>`;
      document.body.appendChild(el);
    }, { res: result, summary });

    await captureStep(page, testInfo, '02-rules-passed');
    await attachEvaluationResult(testInfo, result);

    expect(result.passed).toBe(true);
  });
});
