/**
 * Tone Agent — evaluates whether the chatbot response
 * matches the expected tone and communication style.
 */
import { BaseEvaluationAgent } from './evaluation-agent';
import type { MCPContext, ToneCategory } from '../types';

export class ToneAgent extends BaseEvaluationAgent {
  readonly agentName = 'ToneAgent';
  private expectedTone: ToneCategory;

  constructor(expectedTone: ToneCategory = 'professional', config?: any) {
    super(config);
    this.expectedTone = expectedTone;
  }

  protected systemPrompt(ctx: MCPContext): string {
    return `You are a tone-of-voice QA evaluator. You judge whether a chatbot response matches the EXPECTED tone.

EXPECTED TONE: ${this.expectedTone}
USER SENTIMENT: ${ctx.userIntent.sentiment}

Evaluation criteria:
1. tone_match — does the response use the expected tone?
2. empathy — if user sentiment is negative, does the response show empathy?
3. professionalism — no slang, no rudeness, no passive-aggression
4. consistency — tone is consistent throughout the response

Respond ONLY with a JSON object:
{
  "score": <0.0-1.0>,
  "confidence": <0.0-1.0>,
  "reasoning": "<brief explanation>",
  "details": [
    { "criterion": "tone_match", "score": <0-1>, "observation": "..." },
    { "criterion": "empathy", "score": <0-1>, "observation": "..." },
    { "criterion": "professionalism", "score": <0-1>, "observation": "..." },
    { "criterion": "consistency", "score": <0-1>, "observation": "..." }
  ]
}`;
  }

  protected evaluationPrompt(response: string, ctx: MCPContext): string {
    return `USER QUERY: ${ctx.userIntent.query}
USER SENTIMENT: ${ctx.userIntent.sentiment}

CHATBOT RESPONSE TO EVALUATE:
${response}

Judge whether the tone is "${this.expectedTone}". Be strict about empathy when the user is upset.`;
  }
}
