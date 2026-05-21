/**
 * MCP Context Schema — defines the structured context envelope
 * passed between Playwright tests and AI evaluation agents.
 *
 * Uses Zod for runtime validation so malformed contexts fail fast.
 */
import { z } from 'zod';

// ── Zod schemas ──────────────────────────────────────────────

export const UserIntentSchema = z.object({
  query: z.string().min(1),
  category: z.enum(['general', 'support', 'billing', 'technical', 'complaint']),
  expectedTopic: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
});

export const ConversationTurnSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.string().optional(),
});

export const BusinessRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  condition: z.string(),
  expectedBehavior: z.string(),
  severity: z.enum(['critical', 'major', 'minor']),
});

export const FactSchema = z.object({
  claim: z.string(),
  expectedValue: z.string(),
  tolerance: z.string().optional(),
});

export const GroundTruthSchema = z.object({
  facts: z.array(FactSchema),
  sourceDocument: z.string().optional(),
});

export const MCPContextSchema = z.object({
  sessionId: z.string().uuid(),
  userIntent: UserIntentSchema,
  conversationHistory: z.array(ConversationTurnSchema),
  businessRules: z.array(BusinessRuleSchema),
  groundTruth: GroundTruthSchema.optional(),
  metadata: z.record(z.unknown()),
});

export type MCPContextInput = z.infer<typeof MCPContextSchema>;
