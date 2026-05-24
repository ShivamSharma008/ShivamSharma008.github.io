# AI Usage Log

> **Author:** Shivam Sharma, Senior SDET  
> **Project:** TestMu AI SDET-2 Quality Engineering Assessment

---

## AI Tools Used

| # | Tool | Task | What It Produced | My Design Decision |
|---|------|------|------------------|--------------------|
| 1 | GitHub Copilot CLI (Claude) | Project scaffolding and architecture | Assisted with folder structure generation and boilerplate setup | I defined the architecture (POM, layer separation, config-driven design). AI accelerated the mechanical creation of files and folders. |
| 2 | GitHub Copilot CLI (Claude) | Page Object Model implementation | Helped generate BasePage and child page objects | I designed the inheritance pattern, selector strategy, and retry logic. AI helped write the TypeScript implementations. |
| 3 | GitHub Copilot CLI (Claude) | API Client with schema validation | Generated the ApiClient class and JSON schemas | I chose Ajv for validation, designed the response wrapper pattern with timing, and defined the schema contracts. |
| 4 | GitHub Copilot CLI (Claude) | Test suite creation | Assisted in writing test cases across UI, API, and integration layers | I defined the test scenarios, coverage strategy, and data-driven approach. AI helped translate those into Playwright test code. |
| 5 | GitHub Copilot CLI (Claude) | CI/CD Pipeline configuration | Generated GitHub Actions workflow | I designed the pipeline architecture (sharding, artifact publishing, failure notification). AI helped with YAML syntax. |
| 6 | GitHub Copilot CLI (Claude) | Documentation | Assisted with README, test-strategy.md | I wrote the strategy, risk analysis, and architectural rationale. AI helped format and structure the documents. |

## Summary

AI was used as an **accelerator**, not a decision-maker. Every architectural choice — from the POM pattern to the CI/CD sharding strategy to the selector approach — was a deliberate engineering decision. AI helped execute those decisions faster by reducing boilerplate coding time.

The key design decisions I owned:
- **Playwright over Cypress/Selenium** — for multi-browser, API testing, and built-in reporting
- **TypeScript over JavaScript** — for type safety and better maintainability
- **POM with BasePage pattern** — for encapsulation and reusability
- **JSON schemas with Ajv** — for strict API contract validation
- **CI/CD (Option A) over Dashboard** — because automated execution is the foundation of quality
- **Test sharding** — for scalable CI execution as the suite grows

---

*Logged by Shivam Sharma, Senior SDET*
