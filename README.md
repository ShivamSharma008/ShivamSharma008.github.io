# TestMu AI SDET-2 Quality Engineering Assessment

> **Author:** Shivam Sharma, Senior SDET  
> **Framework:** Playwright + TypeScript  
> **Design Pattern:** Page Object Model (POM)

---

## 🏗️ Architecture Overview

```
testmu-sdet2-shivamsharma/
├── src/
│   ├── pages/              # Page Object Models (POM)
│   │   ├── BasePage.ts     # Base class - common interactions, waits, retries
│   │   ├── LoginPage.ts    # Login page object
│   │   ├── SecureAreaPage.ts # Post-login secure area
│   │   ├── DashboardPage.ts  # Homepage/dashboard
│   │   └── FormPage.ts     # Forms (checkboxes, dropdowns, inputs)
│   ├── api/
│   │   ├── ApiClient.ts    # Reusable HTTP client with timing & schema validation
│   │   └── schemas/        # JSON schemas for API response validation (Ajv)
│   ├── utils/
│   │   ├── custom-assertions.ts  # Extended assertion helpers
│   │   └── helpers.ts      # Data loaders, retry logic, random generators
│   └── test-data/          # Externalized test data (JSON, CSV)
├── tests/
│   ├── ui/                 # UI tests (login, dashboard, forms, cross-browser)
│   ├── api/                # API tests (CRUD, auth, error handling)
│   └── integration/        # E2E tests combining UI + API layers
├── config/                 # Environment configuration
├── .github/workflows/      # CI/CD pipeline (GitHub Actions)
├── playwright.config.ts    # Playwright configuration
├── test-strategy.md        # Test strategy document
└── ai-usage-log.md         # AI tools usage log
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Setup
```bash
# Clone the repository
git clone https://github.com/shivamsharma/testmu-sdet2-shivamsharma.git
cd testmu-sdet2-shivamsharma

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps chromium firefox webkit
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:ui           # UI tests only
npm run test:api          # API tests only
npm run test:integration  # Integration tests only

# Run on specific browsers
npm run test:chromium     # Chromium only
npm run test:firefox      # Firefox only
npm run test:webkit       # WebKit/Safari only

# Run in headed mode (visible browser)
npm run test:headed

# View HTML report
npm run report
```

### Environment Configuration
```bash
# Copy and edit environment config
cp .env.example .env

# Or set environment variables
ENVIRONMENT=staging npm test
BASE_URL=https://your-app.com npm test
```

## 🎯 Design Decisions

### Why Playwright + TypeScript?
- **Playwright** provides built-in multi-browser support (Chromium, Firefox, WebKit), auto-waits, network interception, and API testing — eliminating the need for separate tools.
- **TypeScript** adds type safety, better IDE support, and catches errors at compile time.
- **Built-in reporting** with HTML reports, screenshots on failure, and video recording.

### Why Page Object Model?
- **Encapsulation:** Selectors and interactions are encapsulated in page classes, not leaked into tests.
- **Maintainability:** When UI changes, only the page object needs updating.
- **Reusability:** Page objects are shared across UI and integration tests.
- **BasePage pattern:** Common functionality (waits, retries, screenshots) lives in BasePage, inherited by all.

### Why Option A (CI/CD) over Option B (Dashboard)?
Tests that don't run automatically are effectively dead tests. A CI/CD pipeline ensures:
- Every push and PR gets quality validation
- Reports are automatically published as artifacts
- Failures trigger GitHub status checks
- Parallelized execution via sharding (2 shards)
- The team gets immediate, actionable signal

### Selector Strategy
- Uses **CSS selectors** and **semantic locators** (`#id`, `[type="submit"]`, role-based)
- No brittle XPath — selectors are resilient to DOM changes
- Locators defined once in page objects, never in test files

### Data-Driven Testing
- **JSON files** for structured test data (user credentials, API payloads)
- **CSV files** for parameterized tabular data (dropdown options)
- All test data externalized in `src/test-data/` — zero hardcoded values in tests

## 📊 Test Coverage Summary

| Category | Tests | Coverage |
|----------|-------|----------|
| UI - Login | 7 | Valid/invalid login, logout, data-driven credentials |
| UI - Dashboard | 6 | Page load, navigation, link validation |
| UI - Forms | 6 | Checkboxes, dropdowns, inputs, data-driven |
| UI - Smoke | 3 | Cross-browser critical path validation |
| API - CRUD | 8 | GET/POST/PUT/PATCH/DELETE, schema validation |
| API - Auth | 4 | Register, login, error cases |
| API - Errors | 7 | 4xx errors, invalid endpoints, response time |
| Integration | 3 | Combined API+UI flows |
| **Total** | **44** | |

## 🔧 Key Framework Features

- **Custom Retry Logic:** Built into BasePage for flaky element interactions
- **Response Time Assertions:** API tests validate performance thresholds
- **Schema Validation:** API responses validated against JSON schemas using Ajv
- **Config-Driven Environments:** Switch between staging/production via env vars
- **Screenshot on Failure:** Automatic screenshot capture for debugging
- **Video on Failure:** Retained video recordings for failure analysis
- **Parallel Execution:** Tests run in parallel with configurable workers
- **CI/CD Sharding:** Pipeline splits tests across 2 shards for speed

## 🔮 What I'd Build Next

1. **Visual regression testing** with Playwright's built-in screenshot comparison
2. **API contract testing** with Pact or schema-first approach  
3. **Performance testing** integration (k6 or Artillery)
4. **Test data factory** with Builder pattern for complex data generation
5. **Custom Playwright fixtures** for shared setup/teardown across test suites
6. **Slack/Teams webhook** integration for real-time failure alerts
7. **Test analytics dashboard** (Option B) to track flaky tests and trends over time

---

*Built by Shivam Sharma, Senior SDET — TestMu AI SDET-2 Assessment*
