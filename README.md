<div align="center">

<!-- Animated-style banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1a1b27,100:4f8cff&height=220&section=header&text=🧪%20STER&fontSize=80&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Smart%20Test%20Evidence%20Recorder&descSize=22&descAlignY=55&descColor=9aa3b2" width="100%" />

<br/>

### 💀 RIP to the Screenshot → Alt-Tab → Paste → Rename loop

<br/>

<img src="https://img.shields.io/badge/⚡_ONE_HOTKEY-Capture_Everything-4f8cff?style=for-the-badge&labelColor=0d1117" />
<img src="https://img.shields.io/badge/📊_EXPORT-Excel_•_Word_•_PDF_•_HTML-3ec77a?style=for-the-badge&labelColor=0d1117" />
<img src="https://img.shields.io/badge/🔒_OFFLINE-Nothing_Leaves_Your_Machine-ff5b6e?style=for-the-badge&labelColor=0d1117" />

<br/><br/>

<img src="https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js_22-339933?style=flat-square&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Tests-12%2F12_Passing-brightgreen?style=flat-square" />
<img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
<img src="https://img.shields.io/badge/Windows_%7C_macOS_%7C_Linux-lightgrey?style=flat-square" />

<br/><br/>

> **An offline, cross-platform, MCP-powered test evidence tool**
> **built _for_ Manual QA Engineers, _by_ a Manual QA Engineer.**

<br/>

[⚡ Quick Start](#-quick-start) · [✨ Features](#-what-you-get) · [🎬 Demo Flow](#-how-it-works) · [📦 Exports](#-export-formats) · [🗺️ Roadmap](#%EF%B8%8F-roadmap)

---

</div>

<br/>

## 😤 The Pain (You Already Know This)

```
📸 Screenshot → Alt+Tab → Open Excel → Paste → Resize →
✍️  Type step → Type expected → Type actual → Alt+Tab back →
🔁 Repeat... 30+ times per test case
```

<div align="center">

| 😩 Before STER | ⚡ After STER |
|:---:|:---:|
| 25–40 min per test case | **8–12 min** |
| 15–25 context switches | **0–2** |
| Manual formatting (10+ min) | **Instant** |
| Inconsistent across testers | **Standardized** |
| Frequent human errors | **Near zero** |
| Tester burnout 📉 | **Happy testers** 📈 |

</div>

> 💡 **70-80% of a manual tester's time goes into documentation, not testing.**
> STER gives you that time back.

---

<br/>

<div align="center">

## ⚡ The Fix — One Hotkey Changes Everything

<br/>

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   Press  Ctrl + Shift + S                                    ║
║                                                              ║
║   → Screenshot captured ✓                                    ║
║   → Auto-numbered ✓                                          ║
║   → Timestamped ✓                                            ║
║   → Context-tagged ✓                                         ║
║   → Saved to session ✓                                       ║
║                                                              ║
║   You didn't leave your app. You didn't open Excel.          ║
║   You didn't paste anything. It just... worked.              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

</div>

---

<br/>

## ✨ What You Get

<table>
<tr>
<td width="50%" valign="top">

### 🎯 Core Power
- ⌨️ **One-hotkey capture** — `Ctrl+Shift+S`
- 📋 **Inline step editing** — edit right in the UI
- ✅ **Pass / Fail / Blocked** — hotkey or dropdown
- 📊 **4 export formats** — xlsx, docx, pdf, html
- 👤 **Dynamic "Recorded By"** — auto from OS, never hardcoded
- 🔒 **100% offline** — zero telemetry, zero cloud
- 💾 **Crash-safe** — atomic saves after every change
- 🖥️ **Floating toolbar** — always-on-top, never in the way

</td>
<td width="50%" valign="top">

### 🧠 Smart Features
- 🔗 **Context binding** — tags active app, OS, locale, timezone
- 📝 **Auto-suggested steps** — generated from context
- 📊 **Auto-calculated summary** — pass/fail counts & %
- 🛡️ **Tamper-evident** — SHA-256 hashes (hidden from UI)
- 👥 **Multi-tester safe** — per-user identity persistence
- 📁 **Structured storage** — each session isolated
- 🌍 **Cross-platform** — Windows, macOS, Linux
- 📋 **Audit-grade** — accepted by clients & compliance

</td>
</tr>
</table>

---

<br/>

## 🚀 Quick Start

```powershell
git clone https://github.com/ShivamSharma008/ShivamSharma008.github.io.git
cd ShivamSharma008.github.io
npm install
npm test          # 12/12 ✅
npm start         # 🚀 Launch
```

<details>
<summary>📦 Build installers for distribution</summary>

```powershell
npm run build:win      # → NSIS .exe
npm run build:mac      # → .dmg
npm run build:linux    # → AppImage
```

</details>

---

<br/>

## 🎬 How It Works

<div align="center">

```
    ┌───────────────┐         ┌───────────────┐         ┌───────────────┐         ┌───────────────┐
    │               │         │               │         │               │         │               │
    │  1️⃣  START    │────────▶│  2️⃣  CAPTURE  │────────▶│  3️⃣  MARK     │────────▶│  4️⃣  EXPORT   │
    │               │         │               │         │               │         │               │
    │  Enter name,  │         │  Test your    │         │  Ctrl+Shift+P │         │  Ctrl+Shift+E │
    │  project,     │         │  app normally │         │  = Pass ✅     │         │  = Save as    │
    │  test case,   │         │               │         │               │         │  xlsx / docx  │
    │  environment  │         │  Ctrl+Shift+S │         │  Ctrl+Shift+F │         │  pdf / html   │
    │               │         │  = Capture 📸  │         │  = Fail ❌     │         │               │
    │  "Recorded    │         │               │         │               │         │  Screenshots  │
    │   By" = auto  │         │  Auto-number  │         │  Edit inline  │         │  embedded ✓   │
    │   from OS 👤  │         │  + timestamp  │         │  anytime      │         │  Summary      │
    │               │         │  + context    │         │               │         │  auto-calc ✓  │
    │               │         │               │         │               │         │               │
    └───────────────┘         └───────────────┘         └───────────────┘         └───────────────┘
```

</div>

---

<br/>

## 📦 Export Formats

<div align="center">

| | Format | What You Get |
|:---:|:---|:---|
| 📗 | **Excel (.xlsx)** | Summary sheet • Steps with embedded screenshots • Color-coded status • Hidden integrity manifest |
| 📘 | **Word (.docx)** | Professional document • Headings • Step-by-step evidence • Embedded images |
| 📕 | **PDF** | Printable A4 • Cover page • Step pages with screenshots • Professional footer |
| 🌐 | **HTML** | Single-file • Base64-embedded images • Open anywhere • Email-ready |

</div>

<br/>

> Every report carries this footer:
> ```
> Test Evidence Recorded By: <Your Name — dynamic>
> Generated Using: Smart Test Evidence Recorder
> Designed & Developed by Shivam Sharma
> ```

---

<br/>

## ⌨️ Keyboard Shortcuts

<div align="center">

| | Action | Windows / Linux | macOS |
|:---:|:---|:---:|:---:|
| 📸 | **Capture Screenshot** | `Ctrl+Shift+S` | `⌘⇧S` |
| ✅ | **Mark Pass** | `Ctrl+Shift+P` | `⌘⇧P` |
| ❌ | **Mark Fail** | `Ctrl+Shift+F` | `⌘⇧F` |
| 📊 | **End & Export** | `Ctrl+Shift+E` | `⌘⇧E` |

</div>

---

<br/>

## 🏗️ Architecture

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│                      │     │                      │     │                      │
│    🖥️  RENDERER UI   │◀───▶│   ⚡ ELECTRON IPC    │◀───▶│   🧠 CORE SERVICES   │
│                      │     │                      │     │                      │
│  index.html          │     │  main.js             │     │  identity.js         │
│  recorder.html       │     │  preload.js          │     │  sessionService.js   │
│  renderer.js         │     │  Global shortcuts    │     │  screenshotService   │
│                      │     │  Save dialogs        │     │  contextManager.js   │
│                      │     │                      │     │  exporter.js         │
│                      │     │                      │     │                      │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘
```

<details>
<summary>📂 Full project layout</summary>

```
src/
  main/            Electron main process
    main.js          Window mgmt, IPC, global shortcuts
    preload.js       Safe contextBridge API
  renderer/        UI layer
    index.html       Session setup + steps grid
    renderer.js      Frontend logic
    recorder.html    Always-on-top floating bar
  core/            Pure Node.js services (testable without Electron)
    identity.js           Dynamic "Recorded By" resolution
    sessionService.js     Step CRUD + atomic JSON persistence
    screenshotService.js  Capture + SHA-256 + headless fallback
    contextManager.js     MCP-aligned context snapshot
    exporter.js           Excel / Word / PDF / HTML
tests/
    e2e.test.js           12 end-to-end tests
```

</details>

---

<br/>

## 🧪 Tests — 12/12 Green

```
 PASS  tests/e2e.test.js

  Identity (dynamic Recorded By)
    ✅ returns OS user by default — never hardcoded
    ✅ rememberTester persists per OS user

  SessionService
    ✅ adds, updates, deletes and re-indexes steps
    ✅ markLastStatus updates the most recent step
    ✅ persists session.json atomically

  ScreenshotService
    ✅ captures, hashes and writes a PNG (with fallback)

  ContextManager (MCP snapshot)
    ✅ emits a snapshot with required keys

  Exporter
    ✅ Excel — tester name, embedded images, summary
    ✅ HTML — inline screenshots, dynamic footer, no SHA-256
    ✅ PDF — valid file with %PDF- header
    ✅ Word — valid .docx, dynamic footer, embedded images
    ✅ Rejects unsupported formats

  Tests:  12 passed, 12 total ✅
```

---

<br/>

## 🎯 Who Is This For?

<div align="center">

| You Are A... | STER Helps You... |
|:---:|:---|
| 🧪 **Manual Tester** | Stop wasting 80% of time on documentation |
| 👨‍💼 **QA Lead** | Get consistent, standardized evidence from every tester |
| 📊 **Manager** | Instant visibility into test execution quality |
| 🔍 **Auditor** | Tamper-evident, timestamped, hash-verified evidence |
| 🤝 **Client** | Professional, clean reports — no more messy screenshots |

</div>

---

<br/>

## 🎯 Real-World Scenarios

| Scenario | Time Saved |
|:---|:---|
| 🔥 **Smoke Testing** — rapid verification with instant evidence | ~70% faster |
| 🔄 **Regression Testing** — bulk capture, consistent reports | ~65% faster |
| 🎤 **Client Demo** — professional reports generated on the spot | Instant |
| 📋 **Audit Submission** — tamper-evident, compliant evidence | Hours → Minutes |
| 📚 **Training Notes** — screenshots from Udemy/tutorials | Effortless |
| 🐛 **Bug Reports** — step-by-step reproduction with screenshots | ~60% faster |

---

<br/>

## 🔐 Your Data Stays Yours

| OS | Storage Location |
|:---|:---|
| 🪟 Windows | `%APPDATA%\STER\sessions\<sessionId>\` |
| 🍎 macOS | `~/Library/Application Support/STER/sessions/<sessionId>/` |
| 🐧 Linux | `~/.config/STER/sessions/<sessionId>/` |

> Each session → `session.json` + `artifacts/*.png`
> **Nothing leaves the machine. No cloud. No telemetry. Ever.**

---

<br/>

## 🗺️ Roadmap

<div align="center">

```
  ✅ PHASE 1 — MVP                    🔜 PHASE 2 — Intelligence           🚀 PHASE 3 — Enterprise
  ━━━━━━━━━━━━━━━━━                   ━━━━━━━━━━━━━━━━━━━━━━              ━━━━━━━━━━━━━━━━━━━━
  ✓ Hotkey capture                     ○ Full MCP server                   ○ Team dashboard
  ✓ 4 export formats                   ○ AI-assisted step drafting         ○ JIRA / Azure DevOps
  ✓ Dynamic "Recorded By"             ○ Auto-defect generation            ○ Video recording
  ✓ Floating recorder bar              ○ Session templates                 ○ OCR auto-validation
  ✓ Crash-safe persistence             ○ Test mgmt import                  ○ NLP comparison
  ✓ Cross-platform                                                         ○ Cloud sync (encrypted)
```

</div>

---

<br/>

## 🧩 MCP Integration (Coming in Phase 2)

<details>
<summary>🔮 Click to see the MCP server design</summary>

<br/>

The `ContextManager` is the seed of a full MCP server:

| Type | Endpoint | Purpose |
|:---|:---|:---|
| 📦 Resource | `session://current` | Current session state |
| 📦 Resource | `step://{n}` | Individual step data |
| 📦 Resource | `screenshot://{id}` | Screenshot binary |
| 📦 Resource | `environment://host` | Host environment info |
| 🔧 Tool | `capture_screenshot` | Trigger capture programmatically |
| 🔧 Tool | `add_step` | Add a step with metadata |
| 🔧 Tool | `mark_status` | Set pass/fail/blocked |
| 🔧 Tool | `export_report` | Generate report |
| 💬 Prompt | `draft_step_from_context` | AI-draft a step description |
| 💬 Prompt | `draft_defect` | Generate defect report |
| 💬 Prompt | `summarize_run` | Summarize test execution |

> Makes STER drivable by **any MCP-aware AI** — Claude Desktop, Copilot, in-house LLMs.

</details>

---

<br/>

## 🤝 Contributing

```
1. Fork it
2. git checkout -b feature/amazing-feature
3. git commit -m 'Add amazing feature'
4. git push origin feature/amazing-feature
5. Open a Pull Request
```

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

<br/>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1a1b27,100:4f8cff&height=120&section=footer" width="100%" />

<br/>

**Designed & Developed with ❤️ by [Shivam Sharma](https://github.com/ShivamSharma008)**

*Built from a real pain point. Built for real testers.*

<br/>

⭐ **Star this repo if it saves you time** — it helps other testers find it!

</div>
