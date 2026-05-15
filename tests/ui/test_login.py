"""Login page UI tests — Sauce Demo."""

import pytest

from config.config import settings


@pytest.mark.ui
@pytest.mark.login
class TestLogin:
    """Tests for the login page."""

    @pytest.mark.smoke
    def test_successful_login(self, login_page, inventory_page):
        """Valid credentials should redirect to inventory page."""
        login_page.open()
        login_page.login(
            settings["credentials"]["username"],
            settings["credentials"]["password"],
        )
        assert inventory_page.is_inventory_page_loaded()
        assert inventory_page.get_page_title() == "Products"

    @pytest.mark.regression
    @pytest.mark.parametrize(
        "username, password, expected_error",
        [
            ("locked_out_user", "secret_sauce", "Sorry, this user has been locked out"),
            ("invalid_user", "wrong_pass", "Username and password do not match"),
            ("", "secret_sauce", "Username is required"),
            ("standard_user", "", "Password is required"),
        ],
        ids=["locked_out", "invalid_creds", "empty_username", "empty_password"],
    )
    def test_login_failure(self, login_page, username, password, expected_error):
        """Invalid login attempts should display appropriate error messages."""
        login_page.open()
        login_page.login(username, password)
        assert login_page.is_error_displayed()
        assert expected_error in login_page.get_error_message()

    @pytest.mark.smoke
    def test_login_page_loads(self, login_page):
        """Login page should load with the logo visible."""
        login_page.open()
        assert login_page.is_login_page_loaded()
