import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "playwright";
import { LoginPage } from "../pages/LoginPage";
import { LoggedInPage } from "../pages/LoggedInPage";
import { PracticeHubPage } from "../pages/PracticeHubPage";
import { TestExceptionsPage } from "../pages/TestExceptionsPage";
import { JavaScriptDelaysPage } from "../pages/JavaScriptDelaysPage";
import { TestTablePage } from "../pages/TestTablePage";

/**
 * ══════════════════════════════════════════════════════════════
 *  CustomWorld – Cucumber World holding Playwright + Page Objects
 * ══════════════════════════════════════════════════════════════
 *
 *  Project: Shivam Sharma – Automation Test Framework
 *
 *  ┌────────────────────────────────────────────────┐
 *  │  Feature file  →  Step Definition  →  Page     │
 *  │                                     Object     │
 *  │  (Gherkin)        (glue code)       (POM)      │
 *  │                                                │
 *  │  Step defs access page objects via `this`:     │
 *  │    this.loginPage!.enterUsername("student")    │
 *  │    this.practiceHubPage!.clickTestLoginLink()  │
 *  └────────────────────────────────────────────────┘
 *
 *  Each scenario gets its own World with fresh context + pages.
 * ══════════════════════════════════════════════════════════════
 */
export interface ICustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  // ── Page Object instances ──
  loginPage?: LoginPage;
  loggedInPage?: LoggedInPage;
  practiceHubPage?: PracticeHubPage;
  exceptionsPage?: TestExceptionsPage;
  jsDelaysPage?: JavaScriptDelaysPage;
  tablePage?: TestTablePage;
}

export class CustomWorld extends World implements ICustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  loginPage?: LoginPage;
  loggedInPage?: LoggedInPage;
  practiceHubPage?: PracticeHubPage;
  exceptionsPage?: TestExceptionsPage;
  jsDelaysPage?: JavaScriptDelaysPage;
  tablePage?: TestTablePage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  /** Initialise ALL page objects after this.page is created by the hook */
  initPageObjects(): void {
    if (!this.page) throw new Error("Page not initialised before page objects");
    this.loginPage           = new LoginPage(this.page);
    this.loggedInPage        = new LoggedInPage(this.page);
    this.practiceHubPage     = new PracticeHubPage(this.page);
    this.exceptionsPage      = new TestExceptionsPage(this.page);
    this.jsDelaysPage        = new JavaScriptDelaysPage(this.page);
    this.tablePage           = new TestTablePage(this.page);
  }
}

setWorldConstructor(CustomWorld);

