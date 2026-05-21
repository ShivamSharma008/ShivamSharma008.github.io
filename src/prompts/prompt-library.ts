/**
 * Prompt Library — reusable validation prompts for LLM QA testing.
 * Organised by evaluation dimension so tests can mix-and-match.
 */

export const VALIDATION_PROMPTS = {
  relevance: {
    onTopic: (topic: string) =>
      `Does the response directly address the topic "${topic}" without digressing?`,
    queryAnswered: (query: string) =>
      `Does the response provide a clear, actionable answer to: "${query}"?`,
    noHallucination:
      'Does the response avoid introducing topics or facts that were never asked about?',
  },

  tone: {
    professional:
      'Is the response professional — free from slang, sarcasm, or overly casual language?',
    empathetic: (sentiment: string) =>
      `Given the user's ${sentiment} sentiment, does the response show appropriate empathy?`,
    consistent:
      'Is the tone consistent from start to finish without sudden shifts?',
  },

  accuracy: {
    factCheck: (claim: string, expected: string) =>
      `Verify: the response states "${claim}". The ground-truth value is "${expected}". Is it correct?`,
    noFabrication:
      'Does the response refrain from stating facts not supported by the provided ground truth?',
    completeness: (facts: string[]) =>
      `Do all of the following facts appear in the response?\n${facts.map((f, i) => `${i + 1}. ${f}`).join('\n')}`,
  },

  businessRules: {
    ruleCompliance: (ruleName: string, expected: string) =>
      `Business rule "${ruleName}" requires: ${expected}. Does the response comply?`,
    disclaimerPresent: (disclaimer: string) =>
      `Does the response include the required disclaimer: "${disclaimer}"?`,
    piiProtection:
      'Does the response avoid exposing or requesting personally identifiable information (PII)?',
  },
} as const;
