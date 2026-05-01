/**
 * ══════════════════════════════════════════════════════════════
 *  LOCATOR REGISTRY – Single source of truth for ALL selectors
 * ══════════════════════════════════════════════════════════════
 *
 *  Project: Shivam Sharma – Automation Test Framework
 *
 *  WHY THIS FILE EXISTS:
 *  ─────────────────────
 *  1. Every selector/XPath used in the framework lives HERE.
 *  2. Page objects import from this file – they never hard-code selectors.
 *  3. When a selector changes, you update ONE place.
 *  4. IDE navigation: Ctrl+Click on any locator constant → lands here.
 *  5. Runtime logs show which locator was used for each action.
 *
 *  TRACEABILITY FLOW:
 *  ──────────────────
 *  Feature File  →  Step Definition  →  Page Object  →  Locators (this file)
 *  (Gherkin)        (glue code)         (actions)        (selectors)
 *
 *  HOW TO READ:
 *  ────────────
 *  Each page gets its own exported object.
 *  Each property has a JSDoc comment explaining what it targets.
 * ══════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────
//  NAVIGATION / HEADER
// ─────────────────────────────────────────────
export const NAV_LOCATORS = {
  /** Top-level "Practice" menu link */
  practiceMenuLink:      "a#menu-item-20 >> text=Practice",
  /** Fallback: any link with text "Practice" in the nav */
  practiceMenuFallback:  "nav a:has-text('Practice')",
  /** Home link in navigation */
  homeLink:              "a:has-text('Home')",
  /** Site logo / brand */
  siteLogo:              ".site-logo",
} as const;

// ─────────────────────────────────────────────
//  PRACTICE HUB PAGE
//  URL: /practice/
// ─────────────────────────────────────────────
export const PRACTICE_HUB_LOCATORS = {
  /** Main page heading */
  pageTitle:             "h1.post-title, h1.entry-title",
  /** Link: Test Login Page */
  testLoginLink:         "a[href*='practice-test-login']",
  /** Link: Test Exceptions */
  testExceptionsLink:    "a[href*='practice-test-exceptions']",
  /** Link: Test Table */
  testTableLink:         "a[href*='test-table']",
  /** Link: JavaScript Delays (may not be present) */
  jsDelaysLink:          "a[href*='javascript-delays']",
  /** All practice links in the content area */
  allPracticeLinks:      ".entry-content a, .post-content a",
  /** Page content body */
  pageContent:           ".entry-content, .post-content",
} as const;

// ─────────────────────────────────────────────
//  LOGIN PAGE
//  URL: /practice-test-login/
// ─────────────────────────────────────────────
export const LOGIN_LOCATORS = {
  /** Username text input */
  usernameInput:         "#username",
  /** Password text input */
  passwordInput:         "#password",
  /** Submit / Login button */
  submitButton:          "#submit",
  /** Success heading after login */
  successMessage:        ".post-title",
  /** Error message banner */
  errorMessage:          "#error",
  /** Logout link on success page */
  logoutButton:          "a:has-text('Log out')",
} as const;

// ─────────────────────────────────────────────
//  LOGGED-IN SUCCESS PAGE
//  URL: /logged-in-successfully/
// ─────────────────────────────────────────────
export const LOGGED_IN_LOCATORS = {
  /** Page heading */
  pageTitle:             ".post-title",
  /** Full body content area */
  pageContent:           ".post-content",
  /** Logout link */
  logoutButton:          "a:has-text('Log out')",
  /** Bold/highlighted text */
  strongText:            ".post-content strong",
} as const;

// ─────────────────────────────────────────────
//  TEST EXCEPTIONS PAGE
//  URL: /practice-test-exceptions/
// ─────────────────────────────────────────────
export const EXCEPTIONS_LOCATORS = {
  /** Page heading – uses h2 on this page */
  pageTitle:             "h2, h1.post-title, h1.entry-title",
  /** Page content area */
  pageContent:           "#content, .entry-content, .post-content",
  /** "Add" button to add a new row */
  addButton:             "#add_btn",
  /** Row 1 container div */
  row1Container:         "#row1",
  /** Row 1 input field – the text input inside row1 */
  row1Input:             "#row1 input.input-field",
  /** Row 2 container div (appears after clicking Add) */
  row2Container:         "#row2",
  /** Row 2 input field – the text input inside row2 */
  row2Input:             "#row2 input.input-field",
  /** Save button in Row 1 (initially hidden, visible after Edit) */
  saveButton:            "#row1 #save_btn",
  /** Save button in Row 2 */
  row2SaveButton:        "#row2 #save_btn",
  /** Edit button in Row 1 */
  editButton:            "#row1 #edit_btn",
  /** Confirmation message */
  confirmationMessage:   "#confirmation",
  /** Instructions text */
  instructionsText:      "#instructions",
} as const;

// ─────────────────────────────────────────────
//  JAVASCRIPT DELAYS PAGE
//  URL: /javascript-delays/
// ─────────────────────────────────────────────
export const JS_DELAYS_LOCATORS = {
  /** Page heading */
  pageTitle:             "h1.post-title, h1.entry-title, h1",
  /** Page content area */
  pageContent:           ".entry-content, .post-content",
  /** The "Start" button that triggers a delayed action */
  startButton:           "#start",
  /** The loading spinner / indicator */
  loadingIndicator:      "#spinner, .spinner",
  /** The delayed result text that appears after waiting */
  delayedText:           "#delay",
} as const;

// ─────────────────────────────────────────────
//  PRACTICE TEST TABLE PAGE
//  URL: /practice-test-tables/ (or similar)
// ─────────────────────────────────────────────
export const TABLE_LOCATORS = {
  /** Page heading */
  pageTitle:             "h1, h1.post-title, h1.entry-title",
  /** Page content area */
  pageContent:           ".entry-content, .post-content, #content",
  /** The data table */
  dataTable:             "table",
  /** Table header row */
  tableHeader:           "table thead tr, table tr:first-child",
  /** Table body rows */
  tableRows:             "table tbody tr, table tr",
  /** Table cells */
  tableCells:            "table td",
  /** Table headers */
  tableHeaders:          "table th",
} as const;

// ─────────────────────────────────────────────
//  COMMON / SHARED SELECTORS
// ─────────────────────────────────────────────
export const COMMON_LOCATORS = {
  /** Any h1 heading on a page */
  h1Heading:             "h1",
  /** Any h2 heading on a page */
  h2Heading:             "h2",
  /** Main content wrapper */
  mainContent:           "#main, main, .site-content",
  /** WordPress entry content */
  entryContent:          ".entry-content, .post-content",
  /** Any button element */
  anyButton:             "button, input[type='submit'], [role='button']",
} as const;

