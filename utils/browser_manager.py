"""Browser setup and management utility."""

from playwright.sync_api import sync_playwright, Browser, BrowserContext, Page

from config.config import settings
from utils.logger import get_logger

logger = get_logger("browser_manager")


class BrowserManager:
    """Manages browser lifecycle: launch, context creation, and teardown."""

    def __init__(self, browser_type: str | None = None, headless: bool | None = None):
        self.browser_type = browser_type or settings["browser"]
        self.headless = headless if headless is not None else settings["headless"]
        self._playwright = None
        self._browser: Browser | None = None

    def start(self) -> Browser:
        """Launch the Playwright browser."""
        logger.info(
            "Launching %s (headless=%s)", self.browser_type, self.headless
        )
        self._playwright = sync_playwright().start()
        launcher = getattr(self._playwright, self.browser_type)
        launch_args = ["--start-maximized"]
        self._browser = launcher.launch(
            headless=self.headless,
            slow_mo=settings.get("slow_mo", 0),
            args=launch_args,
        )
        return self._browser

    def new_context(self, **kwargs) -> BrowserContext:
        """Create a new browser context with maximized viewport (no_viewport)."""
        return self._browser.new_context(
            no_viewport=True,
            **kwargs,
        )

    def stop(self):
        """Close browser and stop Playwright."""
        if self._browser:
            logger.info("Closing browser")
            self._browser.close()
        if self._playwright:
            self._playwright.stop()
