"""UI Test fixtures — Page Object instantiation."""

import pytest

from pages.login_page import LoginPage
from pages.inventory_page import InventoryPage
from pages.cart_page import CartPage
from config.config import settings


@pytest.fixture
def login_page(page):
    """Return a LoginPage instance."""
    return LoginPage(page)


@pytest.fixture
def inventory_page(page):
    """Return an InventoryPage instance."""
    return InventoryPage(page)


@pytest.fixture
def cart_page(page):
    """Return a CartPage instance."""
    return CartPage(page)


@pytest.fixture
def logged_in_page(page):
    """Return a page that is already logged in with default credentials."""
    lp = LoginPage(page)
    lp.open()
    lp.login(settings["credentials"]["username"], settings["credentials"]["password"])
    return page
