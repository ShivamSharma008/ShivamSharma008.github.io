/**
 * Validation Prompts — higher-level prompt templates that combine
 * prompt-library primitives into complete evaluation instructions.
 */
import { VALIDATION_PROMPTS as P } from './prompt-library';
import type { MCPContext } from '../types';

export function buildRelevancePrompt(ctx: MCPContext): string {
  return [
    P.relevance.onTopic(ctx.userIntent.expectedTopic),
    P.relevance.queryAnswered(ctx.userIntent.query),
    P.relevance.noHallucination,
  ].join('\n\n');
}

export function buildTonePrompt(ctx: MCPContext, expectedTone: string): string {
  return [
    P.tone.professional,
    P.tone.empathetic(ctx.userIntent.sentiment),
    P.tone.consistent,
    `Expected tone style: ${expectedTone}`,
  ].join('\n\n');
}

export function buildAccuracyPrompt(ctx: MCPContext): string {
  if (!ctx.groundTruth) return 'No ground truth provided — skip factual accuracy check.';
  const factChecks = ctx.groundTruth.facts.map((f) =>
    P.accuracy.factCheck(f.claim, f.expectedValue)
  );
  return [
    ...factChecks,
    P.accuracy.noFabrication,
    P.accuracy.completeness(ctx.groundTruth.facts.map((f) => f.claim)),
  ].join('\n\n');
}

export function buildBusinessRulesPrompt(ctx: MCPContext): string {
  if (ctx.businessRules.length === 0) return 'No business rules to evaluate.';
  const ruleChecks = ctx.businessRules.map((r) =>
    P.businessRules.ruleCompliance(r.name, r.expectedBehavior)
  );
  return [...ruleChecks, P.businessRules.piiProtection].join('\n\n');
}
