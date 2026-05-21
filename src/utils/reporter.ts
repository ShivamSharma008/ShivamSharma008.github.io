/**
 * Reporter utility — attaches evaluation results to the Playwright HTML report
 */
import type { TestInfo } from '@playwright/test';
import type { EvaluationResult, TestReport } from '../types';

export async function attachEvaluationResult(
  testInfo: TestInfo,
  result: EvaluationResult
): Promise<void> {
  await testInfo.attach(`${result.agentName} — score ${result.score.toFixed(2)}`, {
    body: JSON.stringify(result, null, 2),
    contentType: 'application/json',
  });
}

export async function attachTestReport(
  testInfo: TestInfo,
  report: TestReport
): Promise<void> {
  await testInfo.attach('Full Test Report', {
    body: JSON.stringify(report, null, 2),
    contentType: 'application/json',
  });
}

export function summarizeResults(results: EvaluationResult[]): {
  allPassed: boolean;
  avgScore: number;
  summary: string;
} {
  const avgScore =
    results.reduce((sum, r) => sum + r.score, 0) / (results.length || 1);
  const allPassed = results.every((r) => r.passed);
  const summary = results
    .map((r) => `${r.agentName}: ${r.passed ? '✅' : '❌'} (${r.score.toFixed(2)})`)
    .join(' | ');
  return { allPassed, avgScore, summary };
}
