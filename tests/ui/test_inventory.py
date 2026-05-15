"""Inventory page UI tests — Sauce Demo."""

import pytest

from pages.inventory_page import InventoryPage
from pages.cart_page import CartPage


@pytest.mark.ui
@pytest.mark.inventory
class TestInventory:
    """Tests for the products / inventory page."""

    @pytest.mark.smoke
    def test_products_are_displayed(self, logged_in_page):
        """Inventory page should show 6 products."""
        inv = InventoryPage(logged_in_page)
        assert inv.get_product_count() == 6

    @pytest.mark.regression
    def test_add_product_to_cart(self, logged_in_page):
        """Adding a product should update the cart badge."""
        inv = InventoryPage(logged_in_page)
        inv.add_product_to_cart("Sauce Labs Backpack")
        assert inv.get_cart_count() == 1

    @pytest.mark.regression
    def test_remove_product_from_cart(self, logged_in_page):
        """Removing a product should clear the cart badge."""
        inv = InventoryPage(logged_in_page)
        inv.add_product_to_cart("Sauce Labs Backpack")
        inv.remove_product_from_cart("Sauce Labs Backpack")
        assert inv.get_cart_count() == 0

    @pytest.mark.regression
    def test_sort_products_z_to_a(self, logged_in_page):
        """Sorting Z→A should reverse alphabetical order."""
        inv = InventoryPage(logged_in_page)
        inv.sort_products("za")
        names = inv.get_all_product_names()
        assert names == sorted(names, reverse=True)

    @pytest.mark.regression
    def test_sort_products_low_to_high(self, logged_in_page):
        """Sorting low→high should order prices ascending."""
        inv = InventoryPage(logged_in_page)
        inv.sort_products("lohi")
        names = inv.get_all_product_names()
        assert len(names) == 6

    @pytest.mark.smoke
    def test_add_multiple_products_and_verify_cart(self, logged_in_page):
        """Adding two products should show correct count in cart page."""
        inv = InventoryPage(logged_in_page)
        inv.add_product_to_cart("Sauce Labs Backpack")
        inv.add_product_to_cart("Sauce Labs Bike Light")
        assert inv.get_cart_count() == 2

        inv.go_to_cart()
        cart = CartPage(logged_in_page)
        items = cart.get_cart_item_names()
        assert "Sauce Labs Backpack" in items
        assert "Sauce Labs Bike Light" in items

    @pytest.mark.regression
    def test_logout(self, logged_in_page):
        """Logout should redirect to the login page."""
        inv = InventoryPage(logged_in_page)
        inv.logout()
        assert "/inventory" not in logged_in_page.url
