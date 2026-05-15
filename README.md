<div align="center">

# 🚀 BDD Selenium Automation Framework

### Enterprise-Grade Test Automation | Cucumber BDD | Java | Selenium 4 | Rest Assured

<br/>

![Java](https://img.shields.io/badge/Java-11%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Selenium](https://img.shields.io/badge/Selenium-4.27-43B02A?style=for-the-badge&logo=selenium&logoColor=white)
![Cucumber](https://img.shields.io/badge/Cucumber-7.20-23D96C?style=for-the-badge&logo=cucumber&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.8%2B-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)
![REST Assured](https://img.shields.io/badge/REST_Assured-5.5-5B2D8E?style=for-the-badge)
![JUnit5](https://img.shields.io/badge/JUnit-5-25A162?style=for-the-badge&logo=junit5&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

---

**Built & Engineered by [Shivam Sharma](https://github.com/ShivamSharma008) — Senior SDET**

---

</div>

## ✨ What Makes This Framework Stand Out

> A production-ready, scalable BDD test automation framework designed for **both UI and API testing** — powered by the Page Object Model, thread-safe WebDriver management, rich reporting, and a fully automated CI/CD pipeline.

### 🔑 Key Highlights

- 🧩 **Behavior-Driven Development** — Write tests in plain English with Cucumber Gherkin syntax
- 🌐 **Selenium 4 WebDriver** — Cross-browser UI testing with Chrome, Firefox, Edge support
- 🔗 **Rest Assured Integration** — Comprehensive API testing with JSON schema validation
- 📄 **Page Object Model** — Clean, maintainable, and reusable page abstractions
- 🧵 **Thread-Safe Execution** — ThreadLocal WebDriver for safe parallel test runs
- 📊 **Extent + Cucumber Reports** — Beautiful, interactive HTML reports with screenshots on failure
- ⚙️ **CI/CD Ready** — GitHub Actions pipeline with parallel job execution
- 🎯 **Tag-Based Execution** — Run smoke, regression, API, or UI tests independently

---

## 🏗️ Framework Architecture

```
📦 bdd-selenium-framework
 ┣ 📂 src/main/java/com/framework
 ┃ ┣ 📂 config/              → Configuration reader (Singleton pattern)
 ┃ ┣ 📂 pages/               → Page Object Model classes
 ┃ ┃ ┣ 📄 BasePage.java         ↳ Abstract base with common actions
 ┃ ┃ ┣ 📄 LoginPage.java        ↳ Login page interactions
 ┃ ┃ ┣ 📄 ProductsPage.java     ↳ Products listing & actions
 ┃ ┃ ┗ 📄 CartPage.java         ↳ Shopping cart operations
 ┃ ┗ 📂 utils/               → Utility classes
 ┃   ┣ 📄 DriverManager.java    ↳ ThreadLocal WebDriver lifecycle
 ┃   ┣ 📄 WaitHelper.java       ↳ Explicit wait strategies
 ┃   ┗ 📄 ScreenshotHelper.java ↳ Failure screenshot capture
 ┣ 📂 src/test/java/com/framework
 ┃ ┣ 📂 stepdefinitions/     → Cucumber step definitions
 ┃ ┣ 📂 hooks/               → Before/After hooks with auto-screenshots
 ┃ ┣ 📂 runners/             → JUnit 5 test runners (Smoke, API, Full)
 ┃ ┗ 📂 api/                 → Rest Assured API test layer
 ┣ 📂 src/test/resources
 ┃ ┣ 📂 features/            → Gherkin feature files
 ┃ ┣ 📄 config.properties    → Runtime configuration
 ┃ ┣ 📄 extent.properties    → Report customization
 ┃ ┗ 📄 log4j2.xml           → Logging configuration
 ┗ 📂 .github/workflows      → CI/CD pipeline definition
```

---

## 🚀 Quick Start

### Prerequisites

| Tool   | Version  |
|--------|----------|
| Java   | 11+      |
| Maven  | 3.8+     |
| Chrome | Latest   |

### ▶️ Run All Tests

```bash
mvn clean test
```

### 🏷️ Run by Tag

```bash
# Smoke tests
mvn clean test -Dtest=SmokeTestRunner

# API tests
mvn clean test -Dtest=ApiTestRunner

# UI tests
mvn clean test -Dcucumber.filter.tags="@ui"

# Login scenarios
mvn clean test -Dcucumber.filter.tags="@login"
```

### 🌍 Run with Custom Browser

```bash
mvn clean test -Dbrowser=firefox -Dheadless=true
```

### 🔌 Run Standalone API E2E Tests

```bash
mvn clean test -Dtest=ApiE2ETest
```

---

## 📊 Rich Reporting

After test execution, reports are generated automatically:

| Report | Location |
|--------|----------|
| 🎨 Extent Spark Report | `target/extent-reports/SparkReport.html` |
| 🥒 Cucumber HTML Report | `target/cucumber-reports/cucumber.html` |
| 📋 Cucumber JSON | `target/cucumber-reports/cucumber.json` |
| 📸 Failure Screenshots | `target/screenshots/` |
| 📝 Execution Logs | `target/logs/automation.log` |

---

## 🔧 Configuration

All runtime settings are centralized in `src/test/resources/config.properties`:

| Property | Description | Default |
|----------|-------------|---------|
| `browser` | Target browser | `chrome` |
| `headless` | Headless mode | `true` |
| `base.url` | Application URL | `https://www.saucedemo.com` |
| `api.base.url` | API base URL | `https://jsonplaceholder.typicode.com` |
| `implicit.wait` | Implicit wait (sec) | `10` |
| `explicit.wait` | Explicit wait (sec) | `15` |

---

## 🏷️ Test Tags

| Tag | Description |
|-----|-------------|
| `@ui` | UI / Selenium tests |
| `@api` | API / Rest Assured tests |
| `@smoke` | Smoke test suite |
| `@login` | Login feature tests |
| `@products` | Products page tests |
| `@positive` | Positive test cases |
| `@negative` | Negative test cases |

---

## 🔄 CI/CD Pipeline

The framework ships with a complete **GitHub Actions** workflow (`.github/workflows/ci-cd.yml`):

```
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│   API Tests     │   │   UI Tests      │   │  Smoke Tests    │
│   (Parallel)    │   │   (Parallel)    │   │   (Parallel)    │
└────────┬────────┘   └────────┬────────┘   └────────┬────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               ▼
                  ┌─────────────────────┐
                  │  Publish Results    │
                  │  + Artifacts Upload │
                  └─────────────────────┘
```

- ✅ Parallel test execution across API, UI & Smoke suites
- ✅ Test reports published as pipeline artifacts
- ✅ Manual trigger with custom tags & browser selection

---

## 🧪 Test Applications

| Type | Application | URL |
|------|-------------|-----|
| 🌐 UI Tests | SauceDemo | [saucedemo.com](https://www.saucedemo.com) |
| 🔗 API Tests | JSONPlaceholder | [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com) |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| Language | Java 11 |
| Build Tool | Apache Maven |
| BDD Framework | Cucumber 7 |
| UI Automation | Selenium WebDriver 4 |
| API Testing | Rest Assured 5 |
| Test Runner | JUnit 5 Platform |
| Reporting | Extent Reports + Cucumber Reports |
| CI/CD | GitHub Actions |
| Logging | Log4j2 + SLF4J |
| Driver Management | WebDriverManager |

</div>

---

<div align="center">

### 👨‍💻 Crafted with ☕ & Passion by **Shivam Sharma** | Senior SDET

[![GitHub](https://img.shields.io/badge/GitHub-ShivamSharma008-181717?style=for-the-badge&logo=github)](https://github.com/ShivamSharma008)

</div>

