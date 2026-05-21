/**
 * MCP Context Builder — fluent API for constructing validated MCP contexts.
 */
import { v4 as uuidv4 } from 'crypto';
import { MCPContextSchema } from './context-schema';
import type {
  MCPContext,
  UserIntent,
  ConversationTurn,
  BusinessRule,
  GroundTruth,
} from '../types';

export class MCPContextBuilder {
  private context: Partial<MCPContext> = {
    sessionId: crypto.randomUUID(),
    conversationHistory: [],
    businessRules: [],
    metadata: {},
  };

  /** Set the user intent for this evaluation */
  withUserIntent(intent: UserIntent): this {
    this.context.userIntent = intent;
    return this;
  }

  /** Append one or more conversation turns */
  withHistory(...turns: ConversationTurn[]): this {
    this.context.conversationHistory!.push(...turns);
    return this;
  }

  /** Add business rules the response must comply with */
  withBusinessRules(...rules: BusinessRule[]): this {
    this.context.businessRules!.push(...rules);
    return this;
  }

  /** Attach ground-truth facts for accuracy checking */
  withGroundTruth(gt: GroundTruth): this {
    this.context.groundTruth = gt;
    return this;
  }

  /** Attach arbitrary metadata */
  withMetadata(meta: Record<string, unknown>): this {
    this.context.metadata = { ...this.context.metadata, ...meta };
    return this;
  }

  /** Override the auto-generated session ID */
  withSessionId(id: string): this {
    this.context.sessionId = id;
    return this;
  }

  /** Validate and return the finalized MCPContext */
  build(): MCPContext {
    const parsed = MCPContextSchema.parse(this.context);
    return parsed as MCPContext;
  }
}
