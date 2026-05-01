import * as dotenv from "dotenv";
import * as path from "path";

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

/**
 * Centralised runtime configuration.
 * Values come from .env → environment variables → defaults.
 * Change .env to tune the framework without touching code.
 */
export const config = {
  /** false = browser UI visible; true = invisible (CI mode) */
  headless: (process.env.HEADLESS ?? "false").toLowerCase() === "true",

  /** Root URL of the application under test */
  baseUrl: process.env.BASE_URL ?? "https://practicetestautomation.com",

  /** Global step / action timeout in ms */
  defaultTimeout: Number(process.env.DEFAULT_TIMEOUT ?? 30000),

  /** Viewport dimensions */
  viewport: {
    width: Number(process.env.VIEWPORT_WIDTH ?? 1280),
    height: Number(process.env.VIEWPORT_HEIGHT ?? 720),
  },

  /** Number of parallel Cucumber workers */
  parallelWorkers: Number(process.env.PARALLEL_WORKERS ?? 1),

  /** Capture a screenshot after every Gherkin step */
  screenshotOnStep: (process.env.SCREENSHOT_ON_STEP ?? "true").toLowerCase() === "true",

  /** Record video for every scenario */
  videoRecording: (process.env.VIDEO_RECORDING ?? "true").toLowerCase() === "true",

  /** Directories */
  dirs: {
    allureResults: "./allure-results",
    allureReport: "./allure-report",
    videos: "./test-results/videos",
    screenshots: "./test-results/screenshots",
  },
};

