"""Screenshot capture utility."""

import os
from datetime import datetime
from pathlib import Path

from playwright.sync_api import Page

from utils.logger import get_logger

logger = get_logger("screenshot")

SCREENSHOT_DIR = Path(__file__).parent.parent / "screenshots"
SCREENSHOT_DIR.mkdir(exist_ok=True)


def capture_screenshot(page: Page, name: str = "screenshot") -> str:
    """Capture a screenshot and return the file path."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    safe_name = name.replace(" ", "_").replace("/", "_")
    filename = f"{safe_name}_{timestamp}.png"
    filepath = SCREENSHOT_DIR / filename
    page.screenshot(path=str(filepath), full_page=True)
    logger.info("Screenshot saved: %s", filepath)
    return str(filepath)


def capture_step_screenshot(page: Page, step_name: str) -> str:
    """Capture a screenshot for a specific test step."""
    return capture_screenshot(page, f"step_{step_name}")
