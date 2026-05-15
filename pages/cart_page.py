"""Page Object for the Sauce Demo Cart page."""

from pages.base_page import BasePage
from utils.logger import get_logger

logger = get_logger("cart_page")


class CartPage(BasePage):
    """Encapsulates locators and actions for the shopping cart page."""

    # ── XPath Locators ───────────────────────────────────────
    PAGE_TITLE = "//span[@class='title']"
    CART_ITEM = "//div[@class='cart_item']"
    CART_ITEM_NAME = "//div[@class='inventory_item_name']"
    CHECKOUT_BUTTON = "//button[@id='checkout']"
    CONTINUE_SHOPPING_BUTTON = "//button[@id='continue-shopping']"

    @staticmethod
    def remove_item_button(item_name: str) -> str:
        return (
            f"//div[text()='{item_name}']/ancestor::div[@class='cart_item']"
            f"//button[contains(@id,'remove')]"
        )

    # ── Page actions ─────────────────────────────────────────
    def get_page_title(self) -> str:
        return self.get_text(self.PAGE_TITLE)

    def get_cart_items_count(self) -> int:
        return self.get_element_count(self.CART_ITEM)

    def get_cart_item_names(self) -> list[str]:
        elements = self.page.locator(self.CART_ITEM_NAME)
        return [elements.nth(i).inner_text() for i in range(elements.count())]

    def remove_item(self, item_name: str):
        logger.info("Removing item from cart: %s", item_name)
        self.click(self.remove_item_button(item_name), step_name="remove_cart_item")
        return self

    def click_checkout(self):
        self.click(self.CHECKOUT_BUTTON, step_name="click_checkout")
        return self

    def click_continue_shopping(self):
        self.click(self.CONTINUE_SHOPPING_BUTTON, step_name="continue_shopping")
        return self
