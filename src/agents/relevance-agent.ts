/**
 * Relevance Agent — evaluates whether the chatbot response
 * is relevant to the user's query and intent.
 */
import { BaseEvaluationAgent } from './evaluation-agent';
import type { MCPContext } from '../types';

export class RelevanceAgent extends BaseEvaluationAgent {
  readonly agentName = 'RelevanceAgent';

  protected systemPrompt(ctx: MCPContext): string {
    return `You are an expert QA evaluator that judges whether a chatbot response is RELEVANT to the user's query.

CONTEXT (MCP):
- User intent category: ${ctx.userIntent.category}
- Expected topic: ${ctx.userIntent.expectedTopic}
- Conversation turns so far: ${ctx.conversationHistory.length}

Respond ONLY with a JSON object:
{
  "score": <0.0-1.0>,
  "confidence": <0.0-1.0>,
  "reasoning": "<brief explanation>",
  "details": [
    { "criterion": "topic_match", "score": <0-1>, "observation": "..." },
    { "criterion": "query_addressed", "score": <0-1>, "observation": "..." },
    { "criterion": "no_hallucinated_topic", "score": <0-1>, "observation": "..." }
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

Judge the relevance of the response to the user's query. Be strict.`;
  }
}
