# Test Strategy Document

> **Author:** Shivam Sharma, Senior SDET  
> **Project:** TestMu AI SDET-2 Quality Engineering Assessment  
> **Date:** May 2026

---

## 1. Test Approach

### Philosophy
Quality is not a phase — it's a continuous signal. This framework is designed to give the team **fast, reliable, and actionable feedback** on every code change. Tests are structured as a pyramid: fast API tests at the base, targeted UI tests in the middle, and strategic E2E integration tests at the top.

### Framework Design Principles
1. **Separation of Concerns:** Pages, tests, data, and utilities are cleanly separated
2. **Data-Driven:** Test data is externalized — no hardcoded values in test logic
3. **Resilient:** Custom retry logic and auto-waits reduce flakiness
4. **Extensible:** Any engineer can add new page objects or tests without modifying the framework core
5. **Observable:** Reports with screenshots, videos, and logs make failures immediately debuggable

## 2. Coverage Rationale

### What We Cover

#### UI Tests (22 tests)
- **Login Flow (7 tests):** Critical user-facing flow. Covers happy path, error states with data-driven invalid credentials, and full logout cycle. This is typically the most-tested flow and the first thing to break.
- **Dashboard (6 tests):** Validates the landing page loads correctly, navigation links work, and key features are accessible. Acts as a baseline smoke check.
- **Form Validation (6 tests):** Covers interactive form elements — checkboxes, dropdowns, inputs. Uses CSV-driven parameterization for dropdown options.
- **Cross-Browser Smoke (3 tests):** Lightweight tests that run across Chromium, Firefox, and WebKit. Validates that critical paths work across browsers without duplicating the full suite.

#### API Tests (19 tests)
- **CRUD Operations (8 tests):** Full lifecycle — Create, Read (single + list), Update (PUT/PATCH), Delete. Each validates status codes, response body, and schema compliance.
- **Authentication (4 tests):** Register and login flows with both success and failure cases. Validates token generation and error messages.
- **Error Handling (7 tests):** 4xx error responses, invalid endpoints, empty payloads, and response-time assertions. Ensures the API fails gracefully.

#### Integration Tests (3 tests)
- **API → UI Flow:** Creates data via API, then verifies the UI remains functional. Demonstrates cross-layer testing.
- **Auth → UI Flow:** Completes API auth flow, then validates UI state.
- **CRUD → UI Flow:** Full create-update-verify-login-logout cycle across both layers.

### Why This Coverage?
- **Login is the #1 regression risk** — every team member touches auth code
- **API tests are fast and reliable** — they form the foundation of our confidence
- **Integration tests catch layer-boundary bugs** that unit/API/UI tests miss individually
- **Cross-browser ensures no browser-specific regressions** without 3x test execution time

## 3. What We'd Cover Next

With more time, I would prioritize:
1. **Accessibility testing** (axe-core integration) — legal and user experience risk
2. **Visual regression** — catch unintended CSS/layout changes
3. **API contract tests** — prevent breaking changes between services
4. **Load/performance tests** — response time under concurrent users
5. **Mobile viewport tests** — responsive design validation
6. **Database state verification** — asserting data integrity end-to-end

## 4. Top 3 Risks

### Risk 1: Test Flakiness from External Dependencies
**Risk:** Tests depend on `the-internet.herokuapp.com`, `jsonplaceholder.typicode.com`, and `dummyjson.com` — external services that can be slow, rate-limited, or down.  
**Mitigation:** Built custom retry logic in BasePage, configured Playwright retries (2 in CI), and set generous timeouts. Long-term: mock external services or run a local instance.

### Risk 2: Selector Brittleness
**Risk:** UI selectors can break when the target application's DOM structure changes.  
**Mitigation:** Using ID-based and semantic selectors (not XPath), encapsulated in page objects. When selectors break, only the page object needs updating — not every test. Recommend adopting `data-testid` attributes in the production app.

### Risk 3: CI Pipeline Performance Degradation
**Risk:** As the test suite grows, CI execution time increases, leading to slow feedback loops and developers ignoring test results.  
**Mitigation:** Implemented test sharding (2 shards, extensible). Tests run in parallel. API tests don't require browsers. Future: tag-based selective execution (smoke, regression, full).

## 5. Improvement Plan

| Priority | Improvement | Impact |
|----------|-------------|--------|
| P0 | Add `data-testid` attributes to production app | Eliminates selector brittleness |
| P0 | Set up local mock server for API tests | Eliminates external dependency |
| P1 | Implement tag-based test execution | Run smoke in 2min, full suite in 10min |
| P1 | Add visual regression baseline | Catch unintended UI changes |
| P2 | Build test analytics dashboard | Track flaky tests and trends |
| P2 | Add performance benchmarks | Prevent response time degradation |

---

*Document by Shivam Sharma, Senior SDET*
