import {
  Before, After, BeforeAll, AfterAll, AfterStep,
  Status, setDefaultTimeout,
} from "@cucumber/cucumber";
import { chromium, Browser } from "playwright";
import { CustomWorld } from "../support/world";
import { config } from "../support/config";
import * as fs from "fs";
import * as path from "path";

// ── Global timeout from config ──
setDefaultTimeout(config.defaultTimeout);

let browser: Browser;

// ───────────────────────────────────────────────
// BeforeAll – launch ONE browser for the entire run
// ───────────────────────────────────────────────
BeforeAll(async function () {
  browser = await chromium.launch({
    headless: config.headless,
    slowMo: config.headless ? 0 : 50,
    args: [
      "--start-maximized",        // Launch browser maximized / fullscreen
      "--disable-infobars",
    ],
  });
  console.log(`\n🚀 Browser launched (headless=${config.headless}, fullscreen=maximized)\n`);
});

// ───────────────────────────────────────────────
// Before – fresh context + page for every scenario
// ───────────────────────────────────────────────
Before(async function (this: CustomWorld) {
  const contextOptions: any = {
    // Use no fixed viewport → browser fills the entire screen (maximized)
    viewport: null,
  };

  // Video recording (configurable)
  if (config.videoRecording) {
    contextOptions.recordVideo = {
      dir: config.dirs.videos,
      size: { width: 1920, height: 1080 },
    };
  }

  this.context = await browser.newContext(contextOptions);
  this.page = await this.context.newPage();

  // Initialise all page-object instances on the World
  this.initPageObjects();
});

// ───────────────────────────────────────────────
// AfterStep – screenshot on every step (configurable)
// ───────────────────────────────────────────────
AfterStep(async function (this: CustomWorld, { result }) {
  if (config.screenshotOnStep && this.page) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    this.attach(screenshot, "image/png");
  }
});

// ───────────────────────────────────────────────
// After – cleanup context, attach video
// ───────────────────────────────────────────────
After(async function (this: CustomWorld, { result }) {
  // Extra failure screenshot
  if (this.page && result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    this.attach(screenshot, "image/png");
  }

  // Close context (finalises video file)
  if (this.context) {
    const video = this.page?.video();
    await this.context.close();

    // Attach video to Allure report
    if (video) {
      try {
        const videoPath = await video.path();
        if (fs.existsSync(videoPath)) {
          const videoBuffer = fs.readFileSync(videoPath);
          this.attach(videoBuffer, "video/webm");
        }
      } catch {
        // video may not be available
      }
    }
  }
});

// ───────────────────────────────────────────────
// AfterAll – close browser
// ───────────────────────────────────────────────
AfterAll(async function () {
  if (browser) {
    await browser.close();
    console.log("\n🛑 Browser closed\n");
  }
});
