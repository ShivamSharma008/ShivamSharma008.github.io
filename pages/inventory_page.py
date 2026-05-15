"""Page Object for the Sauce Demo Inventory (Products) page."""

from pages.base_page import BasePage
from utils.logger import get_logger

logger = get_logger("inventory_page")


class InventoryPage(BasePage):
    """Encapsulates locators and actions for the inventory page."""

    # ── XPath Locators ───────────────────────────────────────
    PAGE_TITLE = "//span[@class='title']"
    INVENTORY_LIST = "//div[@class='inventory_list']"
    INVENTORY_ITEM = "//div[@class='inventory_item']"
    INVENTORY_ITEM_NAME = "//div[@class='inventory_item_name ']"
    SORT_DROPDOWN = "//select[@class='product_sort_container']"
    SHOPPING_CART_BADGE = "//span[@class='shopping_cart_badge']"
    SHOPPING_CART_LINK = "//a[@class='shopping_cart_link']"
    BURGER_MENU = "//button[@id='react-burger-menu-btn']"
    LOGOUT_LINK = "//a[@id='logout_sidebar_link']"

    @staticmethod
    def add_to_cart_button(item_name: str) -> str:
        """XPath for the 'Add to cart' button of a product by name."""
        return (
            f"//div[text()='{item_name}']/ancestor::div[@class='inventory_item']"
            f"//button[contains(@id,'add-to-cart')]"
        )

    @staticmethod
    def remove_button(item_name: str) -> str:
        return (
            f"//div[text()='{item_name}']/ancestor::div[@class='inventory_item']"
            f"//button[contains(@id,'remove')]"
        )

    @staticmethod
    def item_price(item_name: str) -> str:
        return (
            f"//div[text()='{item_name}']/ancestor::div[@class='inventory_item']"
            f"//div[@class='inventory_item_price']"
        )

    # ── Page actions ─────────────────────────────────────────
    def get_page_title(self) -> str:
        return self.get_text(self.PAGE_TITLE)

    def get_product_count(self) -> int:
        return self.get_element_count(self.INVENTORY_ITEM)

    def get_all_product_names(self) -> list[str]:
        elements = self.page.locator(self.INVENTORY_ITEM_NAME)
        return [elements.nth(i).inner_text() for i in range(elements.count())]

    def add_product_to_cart(self, product_name: str):
        logger.info("Adding to cart: %s", product_name)
        self.click(self.add_to_cart_button(product_name), step_name="add_to_cart")
        return self

    def remove_product_from_cart(self, product_name: str):
        logger.info("Removing from cart: %s", product_name)
        self.click(self.remove_button(product_name), step_name="remove_from_cart")
        return self

    def get_cart_count(self) -> int:
        if self.is_visible(self.SHOPPING_CART_BADGE, timeout=2000):
            return int(self.get_text(self.SHOPPING_CART_BADGE))
        return 0

    def sort_products(self, value: str):
        """Sort products. Values: az, za, lohi, hilo."""
        logger.info("Sorting products by: %s", value)
        self.select_option(self.SORT_DROPDOWN, value, step_name="sort_products")
        return self

    def get_product_price(self, product_name: str) -> str:
        return self.get_text(self.item_price(product_name))

    def go_to_cart(self):
        self.click(self.SHOPPING_CART_LINK, step_name="go_to_cart")
        return self

    def logout(self):
        logger.info("Logging out")
        self.click(self.BURGER_MENU, step_name="open_menu")
        self.click(self.LOGOUT_LINK, step_name="click_logout")
        return self

    def is_inventory_page_loaded(self) -> bool:
        return self.is_visible(self.INVENTORY_LIST)
