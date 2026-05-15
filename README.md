<div align="center">

# 🎭 Playwright Parallel Testing Framework

### ⚡ Python · Playwright · Pytest-Xdist · POM Architecture

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Playwright](https://img.shields.io/badge/Playwright-Latest-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/python/)
[![Pytest](https://img.shields.io/badge/Pytest-8.2+-0A9EDC?style=for-the-badge&logo=pytest&logoColor=white)](https://pytest.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**A production-grade test automation framework designed to demonstrate how parallel test execution can drastically cut down your test suite runtime — built for the testing community.**

<br/>

*Built & maintained by [**Shivam Sharma**](https://github.com/ShivamSharma008) — Senior SDET*

---

<img src="https://user-images.githubusercontent.com/placeholder/parallel-testing-banner.png" alt="Parallel Testing" width="700"/>

</div>

<br/>

## 🤔 Why Parallel Testing? The Problem Every Tester Faces

If you've ever stared at your terminal watching tests run **one… by… one**, you know the pain. A 20-test suite averaging 5 seconds per test takes **100 seconds sequentially**. Now imagine a real-world regression suite with hundreds of tests — you're looking at **30–60 minutes** of waiting.

> **Parallel testing distributes your tests across multiple workers, running them simultaneously.** The same 100-second suite finishes in **~25 seconds** with 4 workers. That's a **75% reduction in feedback time.**

### Sequential vs Parallel — A Visual Comparison

```
 ❌ SEQUENTIAL EXECUTION (1 worker)                    ✅ PARALLEL EXECUTION (4 workers)
 ─────────────────────────────────────                  ─────────────────────────────────────

 Worker 1: ████████████████████████████████████████      Worker 1: ██████████░░░░░░░░░░
           T1  T2  T3  T4  T5  T6  T7  T8  T9  T10     Worker 2: ██████████░░░░░░░░░░
                                                         Worker 3: ██████████░░░░░░░░░░
                                                         Worker 4: ██████████░░░░░░░░░░

 Total Time: ████████████████████████ ~100s               Total Time: ██████████ ~25s
                                                                      ↑
                                                               75% TIME SAVED!
```

### Real-World Impact

| Scenario | Tests | Sequential | 4 Workers | **Time Saved** |
|----------|------:|----------:|----------:|:--------------:|
| Smoke Suite | 10 | ~50s | ~13s | **74%** |
| Regression Suite | 50 | ~250s | ~63s | **75%** |
| Full Suite | 200 | ~1000s | ~250s | **75%** |
| Nightly Run | 500+ | ~42 min | ~11 min | **75%** |

> 💡 **With `pytest-xdist`, you get this with a single flag:** `pytest -n 4`

---

## 🏗️ Architecture & Design

This framework follows **Page Object Model (POM)** — the industry-standard design pattern for scalable, maintainable test automation. Every page in the application maps to a class, keeping test logic clean and reusable.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TEST EXECUTION ENGINE                        │
│                                                                     │
│   pytest.ini          conftest.py (root)         pytest-xdist       │
│   ┌──────────┐        ┌──────────────────┐       ┌──────────────┐   │
│   │ markers  │        │ browser fixture  │       │  -n 4        │   │
│   │ addopts  │        │ api_client       │       │  -n auto     │   │
│   │ testpaths│        │ auto-screenshot  │       │  parallel!   │   │
│   └──────────┘        └──────────────────┘       └──────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────────────┐   ┌─────────────────────────────┐     │
│   │      UI TESTS           │   │        API TESTS            │     │
│   │  ┌───────────────────┐  │   │  ┌───────────────────────┐  │     │
│   │  │ test_login.py     │  │   │  │ test_api.py           │  │     │
│   │  │ test_inventory.py │  │   │  │  • Posts CRUD         │  │     │
│   │  └───────┬───────────┘  │   │  │  • Comments           │  │     │
│   │          │              │   │  │  • Users               │  │     │
│   │          ▼              │   │  └───────────────────────┘  │     │
│   │  ┌───────────────────┐  │   └─────────────────────────────┘     │
│   │  │  PAGE OBJECTS     │  │                                       │
│   │  │  ├── BasePage     │  │   ┌─────────────────────────────┐     │
│   │  │  ├── LoginPage    │  │   │       UTILITIES             │     │
│   │  │  ├── InventoryPage│  │   │  ├── browser_manager.py     │     │
│   │  │  └── CartPage     │  │   │  ├── api_client.py          │     │
│   │  └───────────────────┘  │   │  ├── wait_helpers.py        │     │
│   └─────────────────────────┘   │  ├── screenshot.py          │     │
│                                 │  └── logger.py              │     │
│                                 └─────────────────────────────┘     │
├─────────────────────────────────────────────────────────────────────┤
│                     CONFIG & REPORTING                               │
│   config.yaml ──► multi-env ──► HTML / Allure Reports               │
│   (default | staging | production)                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
playwright-parallel-framework/
│
├── config/                        # Environment configuration
│   ├── config.py                  # YAML config reader with env overrides
│   └── config.yaml                # Multi-environment settings (default/staging/prod)
│
├── pages/                         # Page Object Model layer
│   ├── base_page.py               # Base class — click, fill, wait, screenshot
│   ├── login_page.py              # Login page interactions
│   ├── inventory_page.py          # Product listing & cart actions
│   └── cart_page.py               # Cart verification
│
├── tests/
│   ├── ui/                        # UI test suite (Sauce Demo)
│   │   ├── conftest.py            # UI fixtures — login_page, logged_in_page
│   │   ├── test_login.py          # 6 tests — valid login, locked out, empty fields
│   │   └── test_inventory.py      # 7 tests — products, cart, sorting, logout
│   └── api/                       # API test suite (JSONPlaceholder)
│       └── test_api.py            # 14 tests — CRUD posts, comments, users
│
├── utils/                         # Shared utilities
│   ├── browser_manager.py         # Playwright browser lifecycle
│   ├── api_client.py              # HTTP client wrapper (GET/POST/PUT/PATCH/DELETE)
│   ├── wait_helpers.py            # Smart waits & retry logic
│   ├── screenshot.py              # Auto-capture on step/pass/fail
│   └── logger.py                  # Structured logging
│
├── reports/                       # Generated HTML & Allure reports
├── screenshots/                   # Auto-captured test screenshots
├── logs/                          # Execution logs
│
├── .github/workflows/ci.yml      # GitHub Actions CI pipeline
├── Jenkinsfile                    # Jenkins declarative pipeline
├── conftest.py                    # Root fixtures — browser, API client, hooks
├── pytest.ini                     # Pytest markers & settings
├── requirements.txt               # Python dependencies
└── README.md                      # You are here!
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.12+** installed
- **pip** package manager
- **Git** for version control

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ShivamSharma008/ShivamSharma008.github.io.git
cd ShivamSharma008.github.io
```

### 2️⃣ Install Dependencies
```bash
pip install -r requirements.txt
python -m playwright install --with-deps chromium
```

### 3️⃣ Run Tests (Sequential)
```bash
python -m pytest
```

### 4️⃣ Run Tests in Parallel ⚡
```bash
# Fixed number of workers
python -m pytest -n 4

# Auto-detect based on CPU cores
python -m pytest -n auto
```

> 💡 **Pro Tip:** Start with `-n auto` — it uses all available CPU cores for maximum speed.

---

## 🎯 Test Execution Options

### Run by Category (Markers)
```bash
python -m pytest -m smoke              # Quick health check (6 tests)
python -m pytest -m regression         # Full regression (14+ tests)
python -m pytest -m ui                 # UI tests only
python -m pytest -m api                # API tests only
python -m pytest -m "smoke and ui"     # Combine markers
python -m pytest -m "not regression"   # Exclude regression
```

### Run with Parallel + Markers (The Power Combo)
```bash
# Smoke suite across 4 workers — finishes in seconds
python -m pytest -m smoke -n 4

# Full regression, max parallelism
python -m pytest -m regression -n auto

# All tests, 4 workers, verbose output
python -m pytest -n 4 -v
```

### Generate Reports
```bash
# HTML Report
python -m pytest -n 4 --html=reports/report.html --self-contained-html

# Allure Report
python -m pytest -n 4 --alluredir=reports/allure-results
allure serve reports/allure-results
```

---

## ⚙️ Multi-Environment Configuration

The framework supports **environment-based execution** through `config/config.yaml`:

```yaml
default:
  base_url: "https://www.saucedemo.com"
  browser: "chromium"
  headless: false
  timeout: 30000

staging:
  base_url: "https://www.saucedemo.com"
  headless: true

production:
  base_url: "https://www.saucedemo.com"
  headless: true
  viewport: { width: 1920, height: 1080 }
```

### Switch Environments
```bash
# Run against staging
ENV=staging python -m pytest -n 4

# Production + Firefox
ENV=production BROWSER=firefox python -m pytest -n 4

# Headed mode (watch the browser)
HEADLESS=false python -m pytest
```

### Environment Variables Reference
| Variable | Default | Options | Description |
|----------|---------|---------|-------------|
| `ENV` | `default` | `default` · `staging` · `production` | Configuration profile |
| `BROWSER` | `chromium` | `chromium` · `firefox` · `webkit` | Browser engine |
| `HEADLESS` | `true` | `true` · `false` | Run without browser UI |
| `BASE_URL` | saucedemo.com | Any URL | Override target URL |
| `API_BASE_URL` | jsonplaceholder | Any URL | Override API URL |

---

## 🧪 Test Coverage Overview

### UI Tests — Sauce Demo E-Commerce App

| Test | Type | What It Validates |
|------|------|-------------------|
| `test_successful_login` | Smoke | Valid credentials → inventory page |
| `test_login_failure` (4 params) | Regression | Locked out, invalid creds, empty fields |
| `test_login_page_loads` | Smoke | Page renders with logo |
| `test_products_are_displayed` | Smoke | 6 products visible on inventory |
| `test_add_product_to_cart` | Regression | Cart badge updates on add |
| `test_remove_product_from_cart` | Regression | Cart clears on remove |
| `test_sort_products_z_to_a` | Regression | Alphabetical reverse sorting |
| `test_sort_products_low_to_high` | Regression | Price ascending sort |
| `test_add_multiple_and_verify_cart` | Smoke | Multi-product cart flow |
| `test_logout` | Regression | Session ends, redirects to login |

### API Tests — JSONPlaceholder REST API

| Test | Method | Endpoint | Validates |
|------|--------|----------|-----------|
| `test_get_all_posts` | GET | `/posts` | Returns 100 posts |
| `test_get_single_post` | GET | `/posts/1` | Correct post structure |
| `test_get_post_not_found` | GET | `/posts/99999` | 404 response |
| `test_create_post` | POST | `/posts` | 201 + created data |
| `test_update_post_put` | PUT | `/posts/1` | Full update works |
| `test_update_post_patch` | PATCH | `/posts/1` | Partial update works |
| `test_delete_post` | DELETE | `/posts/1` | 200 on deletion |
| `test_filter_posts_by_user` | GET | `/posts?userId=1` | Query param filtering |
| `test_get_comments_for_post` | GET | `/posts/1/comments` | Nested resource |
| `test_get_all_comments` | GET | `/comments` | Returns 500 comments |
| `test_filter_comments_by_post` | GET | `/comments?postId=1` | Filtered comments |
| `test_get_all_users` | GET | `/users` | Returns 10 users |
| `test_get_single_user` | GET | `/users/1` | User detail structure |
| `test_get_user_todos` | GET | `/users/1/todos` | User's todo list |

---

## 📸 Auto-Screenshots

Screenshots are captured automatically at every stage — no manual effort needed:

| Event | Captured? | File Naming |
|-------|-----------|-------------|
| Every action step | ✅ Configurable | `STEP_{action_name}.png` |
| Test **passed** | ✅ Always | `PASS_{test_name}.png` |
| Test **failed** | ✅ Always | `FAIL_{test_name}.png` |

All screenshots are saved to the `screenshots/` directory and **automatically attached to HTML reports**.

> Set `screenshot_on_step: false` in `config.yaml` to disable step-level screenshots for faster execution.

---

## 🔄 CI/CD Pipelines

### GitHub Actions
The pipeline triggers automatically on push to `main` or `develop`. Manual runs let you pick environment, browser, and test markers.

```yaml
# .github/workflows/ci.yml highlights:
✅ Python 3.12 setup with pip caching
✅ Separate API and UI test stages
✅ Auto-upload: reports, screenshots, logs
✅ JUnit test result publishing
```

### Jenkins
A declarative `Jenkinsfile` provides parameterized builds:

```
✅ Environment selection (default / staging / production)
✅ Browser selection (chromium / firefox / webkit)
✅ Custom marker filtering
✅ Artifact archival (reports + screenshots + logs)
```

---

## 🧠 How Parallel Testing Works in This Framework

This framework uses **`pytest-xdist`** — the most battle-tested parallel execution plugin for Python.

### The Mechanism

```
                    pytest -n 4
                        │
            ┌───────────┼───────────┐───────────┐
            ▼           ▼           ▼           ▼
        Worker 0    Worker 1    Worker 2    Worker 3
        ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐
        │test_1 │   │test_2 │   │test_3 │   │test_4 │
        │test_5 │   │test_6 │   │test_7 │   │test_8 │
        │test_9 │   │test_10│   │test_11│   │test_12│
        └───────┘   └───────┘   └───────┘   └───────┘
            │           │           │           │
            └───────────┴───────────┴───────────┘
                        │
                   Results Merged
                   Report Generated
```

### Why It Works Safely Here

| Design Decision | Why It Enables Parallelism |
|----------------|----------------------------|
| **Function-scoped pages** | Each test gets its own browser context — zero shared state |
| **Session-scoped browser** | One browser instance, multiple isolated contexts = efficient |
| **Independent test data** | Tests don't depend on each other's data or order |
| **No shared mutable state** | Page Objects are instantiated per test |

### Quick Cheat Sheet

```bash
pytest -n 4              # 4 parallel workers
pytest -n auto           # Use all CPU cores
pytest -n 2 -m smoke     # 2 workers, smoke tests only
pytest -n auto --dist loadscope   # Group by module, then parallelize
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Language** | Python 3.12+ | Core language |
| **Browser Automation** | Playwright | Fast, reliable cross-browser testing |
| **Test Runner** | Pytest | Flexible test execution with markers |
| **Parallel Engine** | pytest-xdist | Multi-worker parallel execution |
| **Reporting** | pytest-html + Allure | Rich HTML and interactive reports |
| **API Testing** | Requests | HTTP client for REST API validation |
| **Config Management** | PyYAML + python-dotenv | Environment-based configuration |
| **CI/CD** | GitHub Actions + Jenkins | Automated pipeline execution |

---

## 🤝 Contributing

Contributions are welcome! Whether it's a bug fix, new test pattern, or documentation improvement — feel free to open a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📬 Connect with Me

<div align="center">

**Shivam Sharma** — *Senior SDET*

[![GitHub](https://img.shields.io/badge/GitHub-ShivamSharma008-181717?style=for-the-badge&logo=github)](https://github.com/ShivamSharma008)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/shivamsharma008)

*If this framework helped you understand parallel testing, give it a ⭐ — it motivates me to build more for the testing community!*

</div>

---

<div align="center">

**⭐ Star this repo if you found it useful! ⭐**

*Made with ❤️ by Shivam Sharma for the Testing Community*

</div>
