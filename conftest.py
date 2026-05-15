"""Root conftest — shared fixtures for the entire test suite."""

import pytest

from utils.browser_manager import BrowserManager
from utils.screenshot import capture_screenshot
from utils.logger import get_logger
from utils.api_client import APIClient
from config.config import settings

logger = get_logger("conftest")


# ── Browser & page fixtures (UI) ────────────────────────────
@pytest.fixture(scope="session")
def browser_manager():
    """Session-scoped browser manager."""
    bm = BrowserManager()
    bm.start()
    yield bm
    bm.stop()


@pytest.fixture(scope="function")
def page(browser_manager):
    """Function-scoped page with a fresh browser context per test."""
    context = browser_manager.new_context()
    pg = context.new_page()
    pg.set_default_timeout(settings.get("timeout", 30000))
    yield pg
    pg.close()
    context.close()


# ── API client fixture ──────────────────────────────────────
@pytest.fixture(scope="session")
def api_client():
    """Session-scoped API client."""
    client = APIClient()
    yield client
    client.close()


# ── Auto-screenshot on failure ──────────────────────────────
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Capture a screenshot and attach it to the report on test failure."""
    outcome = yield
    report = outcome.get_result()

    if report.when == "call" and report.failed:
        pg = item.funcargs.get("page")
        if pg:
            path = capture_screenshot(pg, f"FAIL_{item.name}")
            logger.error("Test FAILED — screenshot: %s", path)

            # Attach to pytest-html report
            if hasattr(report, "extras"):
                import pytest_html
                report.extras = getattr(report, "extras", [])
                report.extras.append(pytest_html.extras.image(path))

    if report.when == "call" and report.passed:
        pg = item.funcargs.get("page")
        if pg:
            capture_screenshot(pg, f"PASS_{item.name}")
