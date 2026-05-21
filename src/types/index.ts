/**
 * Core type definitions for the AI QA Automation Framework
 */

/** Represents user intent extracted from a conversation turn */
export interface UserIntent {
  query: string;
  category: 'general' | 'support' | 'billing' | 'technical' | 'complaint';
  expectedTopic: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

/** Conversation history entry */
export interface ConversationTurn {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

/** Business rules that the chatbot must follow */
export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  expectedBehavior: string;
  severity: 'critical' | 'major' | 'minor';
}

/** MCP context passed into evaluation agents */
export interface MCPContext {
  sessionId: string;
  userIntent: UserIntent;
  conversationHistory: ConversationTurn[];
  businessRules: BusinessRule[];
  groundTruth?: GroundTruth;
  metadata: Record<string, unknown>;
}

/** Ground truth data for factual accuracy testing */
export interface GroundTruth {
  facts: Fact[];
  sourceDocument?: string;
}

export interface Fact {
  claim: string;
  expectedValue: string;
  tolerance?: string;
}

/** Result from an AI evaluation agent */
export interface EvaluationResult {
  agentName: string;
  passed: boolean;
  score: number;          // 0.0 – 1.0
  confidence: number;     // 0.0 – 1.0
  reasoning: string;
  details: EvaluationDetail[];
  timestamp: string;
}

export interface EvaluationDetail {
  criterion: string;
  passed: boolean;
  score: number;
  observation: string;
}

/** Aggregated report for a single test scenario */
export interface TestReport {
  testName: string;
  prompt: string;
  response: string;
  mcpContext: MCPContext;
  evaluations: EvaluationResult[];
  overallPassed: boolean;
  overallScore: number;
  screenshotPaths: string[];
  videoPath?: string;
}

/** Tone categories for validation */
export type ToneCategory =
  | 'professional'
  | 'friendly'
  | 'empathetic'
  | 'formal'
  | 'casual'
  | 'assertive';

/** Configuration for the evaluation pipeline */
export interface EvaluationConfig {
  openaiModel: string;
  temperature: number;
  maxTokens: number;
  scoreThreshold: number;
  retryAttempts: number;
}
