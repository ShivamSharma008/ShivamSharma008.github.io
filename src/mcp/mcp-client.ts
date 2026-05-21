/**
 * MCP Client — handles communication with MCP-compatible servers
 * and provides a local evaluation pipeline when no remote server is configured.
 *
 * In local mode the context is validated and passed directly to agents.
 * In remote mode the context is POST-ed to an MCP server endpoint.
 */
import { MCPContextSchema } from './context-schema';
import type { MCPContext, EvaluationResult } from '../types';
import { logger } from '../utils/logger';

export interface MCPClientOptions {
  serverUrl?: string;
  timeout?: number;
}

export class MCPClient {
  private serverUrl: string | null;
  private timeout: number;

  constructor(opts: MCPClientOptions = {}) {
    this.serverUrl = opts.serverUrl || process.env.MCP_SERVER_URL || null;
    this.timeout = opts.timeout || 30_000;
  }

  /** Validate and optionally ship context to an MCP server */
  async sendContext(context: MCPContext): Promise<{ valid: boolean; errors: string[] }> {
    const result = MCPContextSchema.safeParse(context);
    if (!result.success) {
      const errors = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      logger.error('MCP context validation failed', { errors });
      return { valid: false, errors };
    }

    if (this.serverUrl) {
      try {
        const res = await fetch(`${this.serverUrl}/context`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(context),
          signal: AbortSignal.timeout(this.timeout),
        });
        if (!res.ok) {
          const body = await res.text();
          return { valid: false, errors: [`MCP server returned ${res.status}: ${body}`] };
        }
        logger.info('Context sent to MCP server', { sessionId: context.sessionId });
      } catch (err: any) {
        return { valid: false, errors: [`MCP server error: ${err.message}`] };
      }
    }

    logger.info('MCP context validated', { sessionId: context.sessionId });
    return { valid: true, errors: [] };
  }

  /** Retrieve evaluation results from an MCP server (remote mode only) */
  async fetchResults(sessionId: string): Promise<EvaluationResult[] | null> {
    if (!this.serverUrl) return null;
    try {
      const res = await fetch(`${this.serverUrl}/results/${sessionId}`, {
        signal: AbortSignal.timeout(this.timeout),
      });
      if (!res.ok) return null;
      return (await res.json()) as EvaluationResult[];
    } catch {
      return null;
    }
  }
}
