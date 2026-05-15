"""Base Page Object — all page classes inherit from this."""

from playwright.sync_api import Page

from config.config import settings
from utils.logger import get_logger
from utils.screenshot import capture_step_screenshot
from utils.wait_helpers import wait_for_element, retry_action

logger = get_logger("base_page")


class BasePage:
    """Provides common actions shared across all Page Objects."""

    def __init__(self, page: Page):
        self.page = page
        self.timeout = settings.get("timeout", 30000)
        self._screenshot_on_step = settings.get("screenshot_on_step", True)

    # ── Navigation ───────────────────────────────────────────
    def navigate(self, path: str = ""):
        """Navigate to a URL relative to base_url."""
        url = f"{settings['base_url']}{path}"
        logger.info("Navigating to %s", url)
        self.page.goto(url, wait_until="domcontentloaded")
        self._step_screenshot("navigate")

    def get_current_url(self) -> str:
        return self.page.url

    def get_title(self) -> str:
        return self.page.title()

    # ── Element interactions ─────────────────────────────────
    def click(self, selector: str, step_name: str = "click"):
        """Click an element identified by *selector*."""
        logger.info("Clicking: %s", selector)
        wait_for_element(self.page, selector, self.timeout)
        self.page.locator(selector).click()
        self._step_screenshot(step_name)

    def fill(self, selector: str, text: str, step_name: str = "fill"):
        """Clear and type text into an input field."""
        logger.info("Filling '%s' into: %s", text, selector)
        wait_for_element(self.page, selector, self.timeout)
        self.page.locator(selector).fill(text)
        self._step_screenshot(step_name)

    def get_text(self, selector: str) -> str:
        """Return the visible text of an element."""
        wait_for_element(self.page, selector, self.timeout)
        return self.page.locator(selector).inner_text()

    def get_element_count(self, selector: str) -> int:
        """Return the count of elements matching the selector."""
        return self.page.locator(selector).count()

    def is_visible(self, selector: str, timeout: int | None = None) -> bool:
        """Check whether an element is visible."""
        try:
            self.page.locator(selector).wait_for(
                state="visible", timeout=timeout or 5000
            )
            return True
        except Exception:
            return False

    def select_option(self, selector: str, value: str, step_name: str = "select"):
        """Select a dropdown option by value."""
        logger.info("Selecting '%s' in: %s", value, selector)
        wait_for_element(self.page, selector, self.timeout)
        self.page.locator(selector).select_option(value)
        self._step_screenshot(step_name)

    def get_attribute(self, selector: str, attribute: str) -> str | None:
        """Return the value of an element's attribute."""
        wait_for_element(self.page, selector, self.timeout)
        return self.page.locator(selector).get_attribute(attribute)

    # ── Screenshot helper ────────────────────────────────────
    def _step_screenshot(self, step_name: str):
        if self._screenshot_on_step:
            capture_step_screenshot(self.page, step_name)
