<div align="center">

# 🧠 AI QA Automation Framework

### _Next-Gen LLM & Chatbot Testing with Playwright + MCP + AI Agents_

<br/>

[![Playwright](https://img.shields.io/badge/Playwright-1.50+-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-8B5CF6?style=for-the-badge)](https://modelcontextprotocol.io)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![Zod](https://img.shields.io/badge/Zod-Runtime%20Validation-3E67B1?style=for-the-badge)](https://zod.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

<br/>

**A production-grade POC demonstrating how to test LLMs, conversational AI chatbots, and generative AI systems using AI-powered evaluation agents, structured context protocols, and browser-level automation.**

<br/>

[🚀 Quick Start](#-quick-start) · [🏗️ Architecture](#-architecture) · [🧪 Test Scenarios](#-test-scenarios) · [📊 Reports](#-reports--artifacts) · [🔗 Connect](#-author)

<br/>

---

</div>

## 💡 Why This Project?

Traditional QA approaches **fail** when testing AI-powered systems. You can't write `expect(response).toBe("exact string")` for an LLM. Responses are non-deterministic, context-dependent, and nuanced.

This framework solves that by introducing:

> 🎯 **AI Agents that judge AI responses** — using structured context, ground-truth data, and business rules to score every response across multiple quality dimensions.

<br/>

### 🔥 Key Capabilities

| Capability | Description |
|:---:|---|
| 🎯 **Response Relevance** | Is the chatbot staying on-topic? Does it address the actual query? |
| 🎭 **Tone Validation** | Does the response match the expected tone — professional, empathetic, formal? |
| 📊 **Factual Accuracy** | Are stated facts correct when compared against ground-truth data? |
| 📋 **Business Rule Compliance** | Does the response follow company policies, disclaimers, and SLA rules? |
| 🧩 **MCP Context Protocol** | Structured context envelopes carry user intent, history, and rules into every evaluation |
| 📸 **Visual Evidence** | Screenshots at every step, video recording of every test, HTML reports with attachments |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      🎭 PLAYWRIGHT TEST                         │
│                                                                 │
│   ┌──────────┐    ┌───────────┐    ┌────────────────────────┐  │
│   │ 🌐 Browser│───▶│ 🤖 Chatbot│───▶│ 📸 Capture Response   │  │
│   └──────────┘    └───────────┘    └───────────┬────────────┘  │
│                                                 │               │
│   ┌─────────────────────────────────────────────▼────────────┐ │
│   │              🧩 MCP CONTEXT BUILDER                       │ │
│   │                                                           │ │
│   │   👤 User Intent    💬 Conversation History               │ │
│   │   📋 Business Rules 📊 Ground Truth   🏷️ Metadata         │ │
│   │                                                           │ │
│   │   ✅ Zod Schema Validation (fail-fast on bad context)     │ │
│   └────────────────────────┬──────────────────────────────────┘ │
│                            │                                    │
│   ┌────────────────────────▼──────────────────────────────────┐ │
│   │           🧠 AI EVALUATION AGENTS (GPT-4o)                │ │
│   │                                                           │ │
│   │   ┌─────────────┐  ┌────────┐  ┌──────────┐  ┌────────┐ │ │
│   │   │🎯 Relevance │  │🎭 Tone │  │📊Accuracy│  │📋 Rules│ │ │
│   │   └──────┬──────┘  └───┬────┘  └────┬─────┘  └───┬────┘ │ │
│   │          │             │            │             │       │ │
│   │          ▼             ▼            ▼             ▼       │ │
│   │   score: 0.92    score: 0.88   score: 0.95   score: 0.90 │ │
│   └───────────────────────┬───────────────────────────────────┘ │
│                           ▼                                     │
│   ┌───────────────────────────────────────────────────────────┐ │
│   │  📄 HTML Report  │  📸 Screenshots  │  🎬 Video  │  📝 Log│ │
│   └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
ai-qa-automation/
│
├── 🎭 playwright.config.ts            # Headed mode, video, screenshots, HTML reports
├── 📦 package.json                    # Dependencies & scripts
├── ⚙️ tsconfig.json                   # TypeScript configuration
├── 🔐 .env.example                    # Environment variable template
│
├── 📂 src/
│   ├── 🧩 mcp/
│   │   ├── context-schema.ts          # Zod schemas for MCP context validation
│   │   ├── context-builder.ts         # Fluent builder API for MCP contexts
│   │   └── mcp-client.ts             # MCP client (local + remote server modes)
│   │
│   ├── 🧠 agents/
│   │   ├── evaluation-agent.ts        # Abstract base agent with retry & OpenAI
│   │   ├── relevance-agent.ts         # Judges topical relevance
│   │   ├── tone-agent.ts             # Judges tone, empathy, professionalism
│   │   ├── accuracy-agent.ts         # Checks facts against ground truth
│   │   └── business-rules-agent.ts   # Validates policy compliance
│   │
│   ├── 💬 prompts/
│   │   ├── prompt-library.ts          # Reusable atomic validation prompts
│   │   └── validation-prompts.ts      # Higher-level prompt composers
│   │
│   ├── 🔧 utils/
│   │   ├── logger.ts                  # Winston structured logging
│   │   ├── screenshot-helper.ts       # Step-level screenshot capture
│   │   └── reporter.ts              # Result attachment & summarization
│   │
│   └── 📝 types/
│       └── index.ts                   # TypeScript interfaces
│
├── 🧪 tests/
│   ├── demo-e2e.spec.ts               # Full demo suite (runs without API key)
│   ├── response-relevance.spec.ts     # Relevance evaluation tests
│   ├── tone-validation.spec.ts        # Tone & empathy tests
│   ├── factual-accuracy.spec.ts       # Fact-checking tests
│   └── business-rule-compliance.spec.ts # Business rule tests
│
├── 📋 fixtures/
│   └── test-data.ts                   # Sample intents, rules, ground truths
│
└── 📊 reports/                        # Generated: HTML, JSON, logs, screenshots
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 18+ | Runtime |
| **npm** | 9+ | Package manager |
| **OpenAI API Key** | — | Powers AI evaluation agents |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ShivamSharma008/ShivamSharma008.github.io.git
cd ShivamSharma008.github.io
git checkout ai-qa-llm-testing-framework

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install chromium

# 4. Configure environment
cp .env.example .env
# Edit .env → add your OPENAI_API_KEY
```

### ▶️ Run Tests

```bash
# 🎬 Run demo suite (works without API key!)
npx playwright test tests/demo-e2e.spec.ts --headed

# 🧪 Run all tests in headed mode (visible browser)
npm run test:headed

# 🧪 Run a specific suite
npx playwright test tests/tone-validation.spec.ts --headed

# 🖥️ Interactive UI mode
npm run test:ui

# 🐛 Debug mode (step-by-step with inspector)
npm run test:debug

# 📊 Open the HTML report
npm run report
```

---

## 🧩 MCP Integration — The Secret Sauce

### What is MCP?

**Model Context Protocol (MCP)** is an open standard for structured context exchange with LLMs. Instead of passing raw strings to evaluation agents, MCP wraps everything in a **validated context envelope**:

```
┌─────────────────────── MCP Context ───────────────────────┐
│                                                            │
│  🆔 Session ID (UUID)                                      │
│                                                            │
│  👤 User Intent                                            │
│     ├── query: "What is your refund policy?"               │
│     ├── category: "billing"                                │
│     ├── expectedTopic: "refund policy"                     │
│     └── sentiment: "neutral"                               │
│                                                            │
│  💬 Conversation History                                   │
│     ├── [user]: "I bought a subscription yesterday."       │
│     └── [assistant]: "How can I help?"                     │
│                                                            │
│  📋 Business Rules                                         │
│     ├── BR-001: Must mention 30-day refund window          │
│     ├── BR-002: Never give financial advice                │
│     └── BR-003: Never request PII                          │
│                                                            │
│  📊 Ground Truth                                           │
│     ├── refund window: "30 days from purchase"             │
│     └── processing time: "5-7 business days"               │
│                                                            │
│  ✅ Validated by Zod at build time                          │
└────────────────────────────────────────────────────────────┘
```

### Building Context — Fluent API

```typescript
const ctx = new MCPContextBuilder()
  .withUserIntent({
    query: 'What is your refund policy?',
    category: 'billing',
    expectedTopic: 'refund policy',
    sentiment: 'neutral',
  })
  .withHistory(
    { role: 'user', content: 'I bought a subscription yesterday.' },
    { role: 'assistant', content: 'How can I help?' }
  )
  .withBusinessRules({
    id: 'BR-001',
    name: 'Refund Disclosure',
    description: 'Must mention 30-day window',
    condition: 'User asks about refunds',
    expectedBehavior: 'Response mentions 30-day refund window',
    severity: 'critical',
  })
  .withGroundTruth({
    facts: [{ claim: 'refund window', expectedValue: '30 days' }],
  })
  .build(); // ← Zod validates here — throws on invalid data!
```

### MCP Client Modes

| Mode | When | How |
|:---:|---|---|
| 🏠 **Local** | Default | Context validated locally, passed directly to agents |
| 🌐 **Remote** | `MCP_SERVER_URL` set | Context POST-ed to an MCP-compatible server |

---

## 🧠 AI Evaluation Agents

Each agent is a **specialized GPT-4o-powered judge** that receives the MCP context and scores the chatbot response.

### Agent Architecture

```typescript
// All agents extend BaseEvaluationAgent
abstract class BaseEvaluationAgent {
  abstract systemPrompt(ctx: MCPContext): string;      // What to evaluate
  abstract evaluationPrompt(response: string): string; // The response to judge
  
  async evaluate(response, ctx): EvaluationResult {
    // → Calls OpenAI GPT-4o with structured JSON output
    // → Retries on failure (configurable)
    // → Returns scored result with reasoning
  }
}
```

### The Four Agents

| Agent | Evaluates | Key Criteria |
|:---:|---|---|
| 🎯 **RelevanceAgent** | Is the response on-topic? | `topic_match`, `query_addressed`, `no_hallucination` |
| 🎭 **ToneAgent** | Does the tone match expectations? | `tone_match`, `empathy`, `professionalism`, `consistency` |
| 📊 **AccuracyAgent** | Are facts correct? | `factual_correctness`, `no_fabrication`, `completeness` |
| 📋 **BusinessRulesAgent** | Are policies followed? | Each business rule scored individually |

### Sample Evaluation Output

```json
{
  "agentName": "RelevanceAgent",
  "passed": true,
  "score": 0.92,
  "confidence": 0.88,
  "reasoning": "Response directly addresses the refund policy query with specific details...",
  "details": [
    { "criterion": "topic_match", "score": 0.95, "observation": "Refund policy discussed as expected" },
    { "criterion": "query_addressed", "score": 0.90, "observation": "All aspects of the query answered" },
    { "criterion": "no_hallucination", "score": 0.90, "observation": "No off-topic information introduced" }
  ]
}
```

---

## 🧪 Test Scenarios

| Test Suite | What It Tests | Pass Threshold | Expected Results |
|:---:|---|:---:|:---:|
| `response-relevance.spec.ts` | On-topic responses, off-topic detection | Score ≥ 0.7 | ✅ Pass / ❌ Fail |
| `tone-validation.spec.ts` | Empathy, professionalism, tone consistency | Score ≥ 0.7 | ✅ Pass / ❌ Fail |
| `factual-accuracy.spec.ts` | Ground-truth matching, fabrication detection | Score ≥ 0.8 | ✅ Pass / ❌ Fail |
| `business-rule-compliance.spec.ts` | Policy adherence, PII protection | Score ≥ 0.7 | ✅ Pass / ❌ Fail |
| `demo-e2e.spec.ts` | **Full pipeline demo** (no API key needed!) | All above | 7/7 ✅ |

### Test Flow

```
1️⃣  Build MCP Context (intent + history + rules + ground truth)
       ↓
2️⃣  Validate Context via MCP Client (Zod schema check)
       ↓
3️⃣  Launch Browser → Navigate to Chatbot
       ↓
4️⃣  📸 Screenshot: "page-loaded"
       ↓
5️⃣  Capture / Simulate Chatbot Response
       ↓
6️⃣  🧠 Run AI Evaluation Agent(s)
       ↓
7️⃣  📸 Screenshot: "evaluation-complete"
       ↓
8️⃣  📎 Attach results to HTML report
       ↓
9️⃣  ✅ Assert pass/fail based on score threshold
```

---

## 📊 Reports & Artifacts

Every test run generates rich, interactive artifacts:

| Artifact | Location | Description |
|:---:|---|---|
| 📄 **HTML Report** | `reports/html-report/` | Interactive report with results, screenshots, attachments |
| 📋 **JSON Results** | `reports/results.json` | Machine-readable test results |
| 📸 **Screenshots** | Embedded in HTML report | Captured at each step via `captureStep()` |
| 🎬 **Videos** | `test-results/` | Full video recording of each test run |
| 🧠 **Evaluation JSON** | Attached to each test | Per-agent score, reasoning, and detail breakdowns |
| 📝 **Logs** | `reports/test-run.log` | Winston structured log output |

```bash
# Open the interactive HTML report
npm run report
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|---|:---:|---|---|
| `OPENAI_API_KEY` | ✅ | — | OpenAI API key for AI evaluation agents |
| `CHATBOT_URL` | ❌ | `https://example.com` | Target chatbot URL |
| `MCP_SERVER_URL` | ❌ | — | Remote MCP server endpoint |
| `LOG_LEVEL` | ❌ | `info` | Winston log level (`debug` \| `info` \| `warn` \| `error`) |

### Evaluation Thresholds

```typescript
// src/agents/evaluation-agent.ts
const DEFAULT_CONFIG = {
  openaiModel: 'gpt-4o',     // Evaluation model
  temperature: 0.1,           // Low temp = consistent scoring
  scoreThreshold: 0.7,        // Minimum passing score
  retryAttempts: 2,            // Retries on API failure
};
```

### Playwright Config

```typescript
// playwright.config.ts
use: {
  screenshot: 'on',           // 📸 Capture at every step
  video: 'on',                // 🎬 Record every test run
  headless: false,             // 🖥️ Headed mode by default
  trace: 'on-first-retry',    // 🔍 Trace for debugging
}
```

---

## 🛣️ Roadmap

- [ ] Multi-LLM support (Claude, Gemini, LLaMA)
- [ ] Custom scoring rubrics via YAML config
- [ ] CI/CD pipeline templates (GitHub Actions)
- [ ] Regression testing — compare scores across runs
- [ ] Dashboard for historical score trends
- [ ] RAG pipeline evaluation support

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "Add amazing feature"`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

<div align="center">

## 👤 Author

**Shivam Sharma**
_Senior SDET_

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shivamsharma-sdet/)

---

### ⭐ If you found this useful, give it a star!

_This project is a Proof of Concept demonstrating modern AI QA practices — how advanced LLM testing frameworks are designed, validated, and executed using Playwright, MCP, and AI evaluation agents._

[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=flat-square)](LICENSE)

</div>
