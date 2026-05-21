/**
 * Base Evaluation Agent — orchestrates AI-powered response evaluation
 * by delegating to specialized sub-agents (relevance, tone, accuracy, rules).
 */
import OpenAI from 'openai';
import type { MCPContext, EvaluationResult, EvaluationConfig } from '../types';
import { logger } from '../utils/logger';

const DEFAULT_CONFIG: EvaluationConfig = {
  openaiModel: 'gpt-4o',
  temperature: 0.1,
  maxTokens: 1024,
  scoreThreshold: 0.7,
  retryAttempts: 2,
};

export abstract class BaseEvaluationAgent {
  protected openai: OpenAI;
  protected config: EvaluationConfig;

  constructor(config?: Partial<EvaluationConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  /** Each sub-agent must define its own system prompt */
  protected abstract systemPrompt(ctx: MCPContext): string;

  /** Each sub-agent must define the user evaluation prompt */
  protected abstract evaluationPrompt(response: string, ctx: MCPContext): string;

  /** Human-readable agent name */
  abstract readonly agentName: string;

  /** Run the evaluation with retries */
  async evaluate(response: string, ctx: MCPContext): Promise<EvaluationResult> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: this.config.openaiModel,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: this.systemPrompt(ctx) },
            { role: 'user', content: this.evaluationPrompt(response, ctx) },
          ],
        });

        const raw = completion.choices[0]?.message?.content || '{}';
        const parsed = JSON.parse(raw);

        const result: EvaluationResult = {
          agentName: this.agentName,
          passed: parsed.score >= this.config.scoreThreshold,
          score: Math.min(1, Math.max(0, parsed.score ?? 0)),
          confidence: Math.min(1, Math.max(0, parsed.confidence ?? 0)),
          reasoning: parsed.reasoning || '',
          details: (parsed.details || []).map((d: any) => ({
            criterion: d.criterion || '',
            passed: d.score >= this.config.scoreThreshold,
            score: d.score ?? 0,
            observation: d.observation || '',
          })),
          timestamp: new Date().toISOString(),
        };

        logger.info(`${this.agentName} evaluation complete`, {
          score: result.score,
          passed: result.passed,
        });
        return result;
      } catch (err: any) {
        lastError = err;
        logger.warn(`${this.agentName} attempt ${attempt} failed: ${err.message}`);
      }
    }

    return {
      agentName: this.agentName,
      passed: false,
      score: 0,
      confidence: 0,
      reasoning: `Evaluation failed after ${this.config.retryAttempts} attempts: ${lastError?.message}`,
      details: [],
      timestamp: new Date().toISOString(),
    };
  }
}
