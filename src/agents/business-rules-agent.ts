/**
 * Business Rules Agent — evaluates whether the chatbot response
 * complies with all applicable business rules.
 */
import { BaseEvaluationAgent } from './evaluation-agent';
import type { MCPContext } from '../types';

export class BusinessRulesAgent extends BaseEvaluationAgent {
  readonly agentName = 'BusinessRulesAgent';

  protected systemPrompt(ctx: MCPContext): string {
    const rules = ctx.businessRules
      .map(
        (r) =>
          `  [${r.severity.toUpperCase()}] ${r.id}: ${r.name}\n    Condition: ${r.condition}\n    Expected: ${r.expectedBehavior}`
      )
      .join('\n');

    return `You are a business-rule compliance QA evaluator. Determine whether the chatbot response follows every applicable business rule.

BUSINESS RULES:
${rules || '  (no rules provided)'}

For each rule, evaluate:
- Does the condition apply to this conversation?
- If yes, does the response meet the expected behavior?

Respond ONLY with a JSON object:
{
  "score": <0.0-1.0>,
  "confidence": <0.0-1.0>,
  "reasoning": "<brief explanation>",
  "details": [
    { "criterion": "<rule_id>", "score": <0-1>, "observation": "..." }
  ]
}`;
  }

  protected evaluationPrompt(response: string, ctx: MCPContext): string {
    const history = ctx.conversationHistory
      .map((t) => `[${t.role}]: ${t.content}`)
      .join('\n');

    return `USER QUERY: ${ctx.userIntent.query}

CONVERSATION HISTORY:
${history || '(none)'}

CHATBOT RESPONSE TO EVALUATE:
${response}

Evaluate each business rule. A critical rule violation must result in score 0.`;
  }
}
