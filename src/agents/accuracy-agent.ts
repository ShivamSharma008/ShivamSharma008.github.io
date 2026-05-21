/**
 * Accuracy Agent — evaluates factual accuracy of the chatbot
 * response against provided ground-truth data.
 */
import { BaseEvaluationAgent } from './evaluation-agent';
import type { MCPContext } from '../types';

export class AccuracyAgent extends BaseEvaluationAgent {
  readonly agentName = 'AccuracyAgent';

  protected systemPrompt(ctx: MCPContext): string {
    const facts = ctx.groundTruth?.facts
      .map((f, i) => `  ${i + 1}. "${f.claim}" → expected: "${f.expectedValue}"${f.tolerance ? ` (tolerance: ${f.tolerance})` : ''}`)
      .join('\n') || '  (no ground truth provided)';

    return `You are a factual-accuracy QA evaluator. Compare the chatbot response against known ground-truth facts.

GROUND TRUTH FACTS:
${facts}
${ctx.groundTruth?.sourceDocument ? `SOURCE: ${ctx.groundTruth.sourceDocument}` : ''}

Evaluation criteria:
1. factual_correctness — are stated facts correct?
2. no_fabrication — does the response avoid making up information?
3. completeness — are all relevant facts from ground truth addressed?

Respond ONLY with a JSON object:
{
  "score": <0.0-1.0>,
  "confidence": <0.0-1.0>,
  "reasoning": "<brief explanation>",
  "details": [
    { "criterion": "factual_correctness", "score": <0-1>, "observation": "..." },
    { "criterion": "no_fabrication", "score": <0-1>, "observation": "..." },
    { "criterion": "completeness", "score": <0-1>, "observation": "..." }
  ]
}`;
  }

  protected evaluationPrompt(response: string, ctx: MCPContext): string {
    return `USER QUERY: ${ctx.userIntent.query}

CHATBOT RESPONSE TO EVALUATE:
${response}

Check every factual claim against the ground truth. Flag any hallucinated or incorrect information.`;
  }
}
