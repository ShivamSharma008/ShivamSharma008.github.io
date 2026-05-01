<div align="center">

# 🎭 Playwright BDD Automation Framework with MCP

### **Shivam Sharma – Test Automation Engineer**

[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Cucumber](https://img.shields.io/badge/Cucumber_BDD-23D96C?style=for-the-badge&logo=cucumber&logoColor=white)](https://cucumber.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Allure](https://img.shields.io/badge/Allure_Reports-FF5A00?style=for-the-badge&logo=allure&logoColor=white)](https://docs.qameta.io/allure/)
[![MCP](https://img.shields.io/badge/MCP_Enabled-6B4FBB?style=for-the-badge&logo=anthropic&logoColor=white)](https://modelcontextprotocol.io/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

<br/>

> A **production-grade, enterprise-ready** test automation framework built with **Playwright + Cucumber BDD**,  
> featuring **Model Context Protocol (MCP)** for AI-powered testing, **Allure Reporting** with  
> per-step screenshots & video recordings, and a **centralized locator registry** for maintainability.

<br/>

| 📊 **13 Scenarios** | ✅ **71 Steps** | 🎬 **Video Recording** | 📸 **Per-Step Screenshots** | 🤖 **MCP-Enabled** |
|:---:|:---:|:---:|:---:|:---:|
| All Passing | All Passing | Every Scenario | Every Step | AI-Powered Context |

</div>

---

## 🌟 Key Highlights

<table>
<tr>
<td width="50%">

### 🏗️ Enterprise Architecture
- ✅ **Page Object Model** with BasePage inheritance
- ✅ **Centralized Locator Registry** – one file, all selectors
- ✅ **4-Layer Traceability** – Feature → Step → POM → Locator
- ✅ **TypeScript Strict Mode** – full type safety
- ✅ **Config-driven** via `.env` – zero code changes needed

</td>
<td width="50%">

### 🚀 Advanced Capabilities
- ✅ **MCP (Model Context Protocol)** – AI agent integration
- ✅ **Parallel Execution** – multi-worker support
- ✅ **Self-Healing Selectors** – runtime fallback resolution
- ✅ **Allure Reports** – screenshots + videos + failure details
- ✅ **Fullscreen Browser** – maximized window, real UX testing

</td>
</tr>
</table>

---

## 🏛️ Architecture – The 4-Layer Design

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Layer 1: FEATURE FILES (.feature)                                      │
│  ─────────────────────────────────                                      │
│  Business-readable Gherkin scenarios                                    │
│  Given I am on the login page                                           │
│  When I enter username "student"                                        │
│  Then I should see the success message "Logged In Successfully"         │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │ Ctrl+Click ↓
┌───────────────────────────▼─────────────────────────────────────────────┐
│  Layer 2: STEP DEFINITIONS (.steps.ts)                                  │
│  ─────────────────────────────────────                                  │
│  Glue code – calls page object methods, zero selectors here            │
│  await this.loginPage!.enterUsername(username);                          │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │ Ctrl+Click ↓
┌───────────────────────────▼─────────────────────────────────────────────┐
│  Layer 3: PAGE OBJECTS (.ts)                                            │
│  ───────────────────────────                                            │
│  BasePage → LoginPage, LoggedInPage, PracticeHubPage, etc.              │
│  Actions + Queries using locator constants from Layer 4                 │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │ Ctrl+Click ↓
┌───────────────────────────▼─────────────────────────────────────────────┐
│  Layer 4: LOCATOR REGISTRY (locators.ts)                                │
│  ────────────────────────────────────────                               │
│  ALL selectors defined ONCE: "#username", "#password", "#submit"        │
│  JSDoc comments explain each element • Self-healing fallback support    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
📦 playwright-practice-with-mcp/
├── 📁 src/
│   ├── 📁 features/                    ← Gherkin BDD Scenarios
│   │   ├── 📄 login.feature            → Login (positive + negative + logout)
│   │   ├── 📄 practice.feature         → Practice Hub navigation
│   │   ├── 📄 exceptions.feature       → Test Exceptions (Add/Edit/Save)
│   │   └── 📄 jsdelays.feature         → Test Table validation
│   │
│   ├── 📁 steps/                       ← Step Definitions (glue code)
│   │   ├── 📄 login.steps.ts           → Login step implementations
│   │   ├── 📄 practice.steps.ts        → Practice hub steps
│   │   ├── 📄 exceptions.steps.ts      → Exceptions steps
│   │   └── 📄 jsdelays.steps.ts        → Table steps
│   │
│   ├── 📁 pages/                       ← Page Object Model
│   │   ├── 📄 BasePage.ts              → Abstract base (logging, fallback)
│   │   ├── 📄 LoginPage.ts             → Login form interactions
│   │   ├── 📄 LoggedInPage.ts          → Post-login page
│   │   ├── 📄 PracticeHubPage.ts       → Practice section hub
│   │   ├── 📄 TestExceptionsPage.ts    → Exceptions module
│   │   ├── 📄 TestTablePage.ts         → Table data page
│   │   └── 📄 JavaScriptDelaysPage.ts  → Reserved for future
│   │
│   ├── 📁 locators/                    ← ★ Centralized Selector Registry
│   │   └── 📄 locators.ts              → ALL selectors in ONE file
│   │
│   ├── 📁 hooks/
│   │   └── 📄 hooks.ts                 → Browser lifecycle, screenshots, video
│   │
│   └── 📁 support/
│       ├── 📄 world.ts                 → Cucumber World (page objects)
│       └── 📄 config.ts                → .env config loader
│
├── 📄 cucumber.js                      ← 9 Cucumber profiles
├── 📄 .env                             ← Runtime configuration
├── 📄 .mcp.json                        ← MCP server config
├── 📄 tsconfig.json                    ← TypeScript config
├── 📄 package.json                     ← Dependencies & scripts
└── 📄 README.md                        ← This file
```

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/ShivamSharma008/ShivamSharma008.github.io.git
cd ShivamSharma008.github.io/playwright-practice-with-mcp

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Run all tests (browser visible, fullscreen)
npm test

# Generate Allure report
npm run report
```

---

## 🎮 Run Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all 13 scenarios |
| `npm run test:headed` | Browser visible (fullscreen) |
| `npm run test:headless` | No UI (CI mode) |
| `npm run test:smoke` | Only @smoke scenarios |
| `npm run test:login` | Login module only |
| `npm run test:practice` | All Practice section tests |
| `npm run test:exceptions` | Test Exceptions only |
| `npm run test:mcp` | MCP-context scenarios |
| `npm run test:parallel` | Parallel (3 workers) |
| `npm run test:negative` | Negative test cases |
| `npm run report` | Generate + open Allure report |

### Run a Single Test

```bash
npx cucumber-js --name "Successful login"           # By name
npx cucumber-js --tags "@post-login"                 # By tag
npx cucumber-js src/features/login.feature:12        # By line
```

---

## 🧪 Test Coverage

### Application Under Test: [practicetestautomation.com](https://practicetestautomation.com)

<table>
<tr>
<th>Module</th>
<th>Scenarios</th>
<th>What's Tested</th>
</tr>
<tr>
<td>🔐 <b>Login</b></td>
<td>4 scenarios</td>
<td>Valid login • Invalid username • Invalid password • Full logout flow</td>
</tr>
<tr>
<td>🏠 <b>Practice Hub</b></td>
<td>4 scenarios</td>
<td>Page content • Navigate to Login • Navigate to Exceptions • Navigate to Table</td>
</tr>
<tr>
<td>⚡ <b>Test Exceptions</b></td>
<td>3 scenarios</td>
<td>Edit row (Edit→Fill→Save) • Add new row • Page structure validation</td>
</tr>
<tr>
<td>📊 <b>Test Table</b></td>
<td>2 scenarios</td>
<td>Table visibility • Headers + rows + cell data extraction</td>
</tr>
</table>

**Total: 13 Scenarios · 71 Steps · 100% Passing ✅**

---

## 📸 Reporting & Evidence

### Allure Reports Include:
- 📸 **Screenshot on EVERY Gherkin step** – full visual trace
- 🎬 **Video recording per scenario** – WebM format
- ❌ **Extra failure screenshot** – captured on assertion failure
- 📊 **Timeline view** – visualize parallel execution

### Runtime Logging:
```
🔍 [LoginPage] fillInput("#username") → "student"
🔍 [LoginPage] fillInput("#password") → "Password123"
🔍 [LoginPage] clickElement("#submit")
🔍 [LoggedInPage] isElementVisible("a:has-text('Log out')")
✅ Confirmation: "Row 1 was saved"
```

---

## 🤖 MCP (Model Context Protocol)

This project demonstrates **MCP-enabled automation** — an AI agent can:

| Capability | Description |
|------------|-------------|
| 🌐 **Browse pages** | Playwright MCP server navigates and interacts with the web app |
| 📁 **Read project** | Filesystem MCP server understands code structure |
| 🧪 **Generate tests** | Agent reads page objects → creates new features |
| 🔧 **Self-heal** | Agent detects broken selectors → updates `locators.ts` |
| 🐛 **Debug** | Agent inspects Allure results, screenshots, videos |

### `.mcp.json` Configuration:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-playwright"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

---

## 🔍 Centralized Locator Registry

All selectors live in **one file** (`src/locators/locators.ts`):

```typescript
export const LOGIN_LOCATORS = {
  /** Username text input */
  usernameInput:  "#username",
  /** Password text input */
  passwordInput:  "#password",
  /** Submit / Login button */
  submitButton:   "#submit",
};
```

### Self-Healing Selector Fallback:
```typescript
// BasePage.ts – tries primary, then fallbacks at runtime
const selector = await this.resolveSelector(
  this.nav.practiceMenuLink,      // Try this first
  this.nav.practiceMenuFallback,  // If not found, try this
  "a:has-text('Practice')",        // Last resort
);
```

---

## 🖥️ Browser Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| `--start-maximized` | Enabled | Fullscreen window |
| `viewport: null` | No fixed size | Fills entire screen |
| `slowMo: 50` | When headed | Visible action speed |
| `recordVideo` | Per scenario | WebM capture |

---

## ⚡ Parallel Execution

```bash
npm run test:parallel        # 3 workers by default
npx cucumber-js --parallel 4 # Custom worker count
```

- Each worker → own browser instance
- Each scenario → own BrowserContext
- Full isolation → no shared state
- Results merge into single Allure report

---

## 🔗 IDE Navigation (Step → POM → Locator)

### JetBrains (IntelliJ / WebStorm):
1. Install **Cucumber.js** plugin
2. Set glue path: `src/steps`
3. **Ctrl+Click** any step → jumps through the chain

### VS Code:
- Pre-configured in `.vscode/settings.json`
- Install **"Cucumber (Gherkin) Full Support"** extension

```
Feature step ──Ctrl+Click──► Step Definition ──Ctrl+Click──► Page Object ──Ctrl+Click──► Locator
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| ![Playwright](https://img.shields.io/badge/-Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white) | Browser automation engine |
| ![Cucumber](https://img.shields.io/badge/-Cucumber-23D96C?style=flat-square&logo=cucumber&logoColor=white) | BDD framework (Gherkin) |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | Type-safe language |
| ![Allure](https://img.shields.io/badge/-Allure-FF5A00?style=flat-square) | Rich test reporting |
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) | Runtime environment |
| ![MCP](https://img.shields.io/badge/-MCP-6B4FBB?style=flat-square) | AI context protocol |

---

## 📈 Framework Capabilities Matrix

| Capability | Status | Details |
|------------|:------:|---------|
| Page Object Model | ✅ | BasePage → 6 page objects |
| Centralized Locators | ✅ | All in `locators.ts` |
| BDD with Cucumber | ✅ | 4 feature files, Gherkin syntax |
| Per-step Screenshots | ✅ | Every step captured |
| Video Recording | ✅ | Per-scenario WebM |
| Parallel Execution | ✅ | Multi-worker support |
| Single Test Run | ✅ | By name / tag / line |
| Fullscreen Browser | ✅ | Maximized + null viewport |
| Config-driven (.env) | ✅ | Zero-code configuration |
| MCP Integration | ✅ | Playwright + Filesystem servers |
| Selector Fallback | ✅ | Runtime self-healing |
| Action Logging | ✅ | Every action shows selector |
| IDE Navigation | ✅ | Full Ctrl+Click chain |
| Tag-based Execution | ✅ | 12+ tags available |
| Allure Reports | ✅ | Screenshots + video + timeline |

---

## 🔮 Future Enhancements

- [ ] Data-driven testing with Scenario Outlines
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Cross-browser testing (Firefox, WebKit)
- [ ] API hybrid testing
- [ ] Visual regression testing
- [ ] Accessibility testing (axe-core)
- [ ] Multi-environment support
- [ ] Database validation

---

## 👨‍💻 Author

<div align="center">

**Shivam Sharma**

[![GitHub](https://img.shields.io/badge/GitHub-ShivamSharma008-181717?style=for-the-badge&logo=github)](https://github.com/ShivamSharma008)

*Test Automation Engineer | Playwright | BDD | MCP*

</div>

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

</div>
