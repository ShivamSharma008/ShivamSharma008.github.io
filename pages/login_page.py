"""Page Object for the Sauce Demo Login page."""

from pages.base_page import BasePage
from utils.logger import get_logger

logger = get_logger("login_page")


class LoginPage(BasePage):
    """Encapsulates locators and actions for the login page."""

    # ── XPath Locators ───────────────────────────────────────
    USERNAME_INPUT = "//input[@id='user-name']"
    PASSWORD_INPUT = "//input[@id='password']"
    LOGIN_BUTTON = "//input[@id='login-button']"
    ERROR_MESSAGE = "//h3[@data-test='error']"
    LOGIN_LOGO = "//div[@class='login_logo']"

    def open(self):
        """Navigate to the login page."""
        logger.info("Opening login page")
        self.navigate("/")
        return self

    def enter_username(self, username: str):
        self.fill(self.USERNAME_INPUT, username, step_name="enter_username")
        return self

    def enter_password(self, password: str):
        self.fill(self.PASSWORD_INPUT, password, step_name="enter_password")
        return self

    def click_login(self):
        self.click(self.LOGIN_BUTTON, step_name="click_login")
        return self

    def login(self, username: str, password: str):
        """Full login flow."""
        logger.info("Logging in as: %s", username)
        self.enter_username(username)
        self.enter_password(password)
        self.click_login()
        return self

    def get_error_message(self) -> str:
        return self.get_text(self.ERROR_MESSAGE)

    def is_error_displayed(self) -> bool:
        return self.is_visible(self.ERROR_MESSAGE)

    def is_login_page_loaded(self) -> bool:
        return self.is_visible(self.LOGIN_LOGO)
