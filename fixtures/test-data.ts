/**
 * Test Data & Fixtures — reusable test scenarios for the AI QA framework.
 * Each scenario bundles a prompt, expected response traits, MCP context, and ground truth.
 */
import type { UserIntent, BusinessRule, GroundTruth, ConversationTurn } from '../src/types';

// ── User Intents ────────────────────────────────────────────

export const INTENTS: Record<string, UserIntent> = {
  refundPolicy: {
    query: 'What is your refund policy for digital products?',
    category: 'billing',
    expectedTopic: 'refund policy',
    sentiment: 'neutral',
  },
  technicalIssue: {
    query: 'My account is locked and I cannot reset my password. Please help!',
    category: 'technical',
    expectedTopic: 'account recovery',
    sentiment: 'negative',
  },
  generalGreeting: {
    query: 'Hello, how are you?',
    category: 'general',
    expectedTopic: 'greeting',
    sentiment: 'positive',
  },
  pricingInquiry: {
    query: 'How much does the Enterprise plan cost per month?',
    category: 'billing',
    expectedTopic: 'pricing',
    sentiment: 'neutral',
  },
  complaint: {
    query: 'I have been waiting 3 weeks for a response to my support ticket. This is unacceptable!',
    category: 'complaint',
    expectedTopic: 'support SLA',
    sentiment: 'negative',
  },
};

// ── Conversation Histories ──────────────────────────────────

export const HISTORIES: Record<string, ConversationTurn[]> = {
  refundThread: [
    { role: 'user', content: 'I bought a subscription yesterday.', timestamp: '2025-01-10T10:00:00Z' },
    { role: 'assistant', content: 'Thank you! How can I help with your subscription?', timestamp: '2025-01-10T10:00:05Z' },
    { role: 'user', content: 'What is your refund policy for digital products?', timestamp: '2025-01-10T10:01:00Z' },
  ],
  techSupportThread: [
    { role: 'user', content: 'My account is locked.', timestamp: '2025-01-10T09:00:00Z' },
    { role: 'assistant', content: 'I\'m sorry to hear that. Let me help you regain access.', timestamp: '2025-01-10T09:00:05Z' },
  ],
  empty: [],
};

// ── Business Rules ──────────────────────────────────────────

export const BUSINESS_RULES: BusinessRule[] = [
  {
    id: 'BR-001',
    name: 'Refund Eligibility Disclosure',
    description: 'When discussing refunds, always state the 30-day refund window.',
    condition: 'User asks about refunds',
    expectedBehavior: 'Response mentions 30-day refund window',
    severity: 'critical',
  },
  {
    id: 'BR-002',
    name: 'No Financial Advice',
    description: 'Never provide personalized financial or investment advice.',
    condition: 'User asks for financial advice',
    expectedBehavior: 'Response declines and suggests consulting a financial advisor',
    severity: 'critical',
  },
  {
    id: 'BR-003',
    name: 'PII Protection',
    description: 'Never ask users to share passwords, SSNs, or full credit card numbers in chat.',
    condition: 'Always',
    expectedBehavior: 'Response does not request sensitive PII',
    severity: 'critical',
  },
  {
    id: 'BR-004',
    name: 'Escalation Path',
    description: 'For unresolved issues after 2 turns, offer to escalate to a human agent.',
    condition: 'Conversation exceeds 2 turns without resolution',
    expectedBehavior: 'Response offers escalation to human support',
    severity: 'major',
  },
];

// ── Ground Truth ────────────────────────────────────────────

export const GROUND_TRUTHS: Record<string, GroundTruth> = {
  refundPolicy: {
    facts: [
      { claim: 'refund window', expectedValue: '30 days from purchase date' },
      { claim: 'refund method', expectedValue: 'original payment method' },
      { claim: 'processing time', expectedValue: '5-7 business days' },
    ],
    sourceDocument: 'company-refund-policy-v2.pdf',
  },
  pricing: {
    facts: [
      { claim: 'Enterprise plan price', expectedValue: '$99/month per seat' },
      { claim: 'minimum seats', expectedValue: '10 seats', tolerance: '±0' },
      { claim: 'annual discount', expectedValue: '20%' },
    ],
    sourceDocument: 'pricing-page-2025.html',
  },
};

// ── Sample Chatbot Responses (for offline/mock testing) ─────

export const MOCK_RESPONSES: Record<string, string> = {
  refundGood:
    'Our refund policy allows returns within 30 days from the purchase date. ' +
    'Refunds are processed to your original payment method and typically take 5-7 business days. ' +
    'Please contact support with your order number to initiate a refund.',

  refundBad:
    'All sales are final. We do not offer refunds for any digital products.',

  techSupportGood:
    'I understand how frustrating it must be to be locked out of your account. ' +
    'Let me walk you through the recovery steps: First, click "Forgot Password" on the login page. ' +
    'If that doesn\'t work, I can escalate this to our security team right away.',

  techSupportBad:
    'Just reset your password. It\'s not that complicated. Go figure it out.',

  pricingGood:
    'The Enterprise plan costs $99/month per seat with a minimum of 10 seats. ' +
    'If you choose annual billing, you\'ll receive a 20% discount. Would you like a demo?',

  pricingFabricated:
    'The Enterprise plan costs $49/month with no minimum seats. ' +
    'We also offer a lifetime deal at $999.',
};
