"""Wait helpers for robust element interactions."""

from playwright.sync_api import Page, Locator, TimeoutError as PWTimeoutError

from config.config import settings
from utils.logger import get_logger

logger = get_logger("wait_helpers")

DEFAULT_TIMEOUT = settings.get("timeout", 30000)


def wait_for_element(page: Page, selector: str, timeout: int = DEFAULT_TIMEOUT) -> Locator:
    """Wait for an element to be visible and return its locator."""
    logger.debug("Waiting for element: %s", selector)
    locator = page.locator(selector)
    locator.wait_for(state="visible", timeout=timeout)
    return locator


def wait_for_element_hidden(page: Page, selector: str, timeout: int = DEFAULT_TIMEOUT):
    """Wait for an element to be hidden or detached."""
    logger.debug("Waiting for element to disappear: %s", selector)
    page.locator(selector).wait_for(state="hidden", timeout=timeout)


def wait_for_url(page: Page, url_pattern: str, timeout: int = DEFAULT_TIMEOUT):
    """Wait until the page URL matches the given pattern."""
    logger.debug("Waiting for URL pattern: %s", url_pattern)
    page.wait_for_url(url_pattern, timeout=timeout)


def wait_for_network_idle(page: Page, timeout: int = DEFAULT_TIMEOUT):
    """Wait for the network to be idle."""
    logger.debug("Waiting for network idle")
    page.wait_for_load_state("networkidle", timeout=timeout)


def retry_action(action, retries: int = 3, delay_ms: int = 1000):
    """Retry an action up to *retries* times with a delay between attempts."""
    last_exc = None
    for attempt in range(1, retries + 1):
        try:
            return action()
        except (PWTimeoutError, Exception) as exc:
            last_exc = exc
            logger.warning("Attempt %d/%d failed: %s", attempt, retries, exc)
            if attempt < retries:
                import time
                time.sleep(delay_ms / 1000)
    raise last_exc
