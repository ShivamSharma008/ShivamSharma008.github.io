package com.framework.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Page Object for the SauceDemo Products/Inventory page.
 */
public class ProductsPage extends BasePage {

    // ===== Locators (XPath) =====
    private final By pageTitle = By.xpath("//span[@class='title']");
    private final By productItems = By.xpath("//div[@class='inventory_item']");
    private final By productNames = By.xpath("//div[@class='inventory_item_name']");
    private final By productPrices = By.xpath("//div[@class='inventory_item_price']");
    private final By addToCartButtons = By.xpath("//button[contains(@id,'add-to-cart')]");
    private final By cartBadge = By.xpath("//span[@class='shopping_cart_badge']");
    private final By cartLink = By.xpath("//a[@class='shopping_cart_link']");
    private final By burgerMenuButton = By.xpath("//button[@id='react-burger-menu-btn']");
    private final By logoutLink = By.xpath("//a[@id='logout_sidebar_link']");
    private final By sortDropdown = By.xpath("//select[@class='product_sort_container']");

    public ProductsPage(WebDriver driver) {
        super(driver);
    }

    // ===== Page Actions =====

    public String getPageTitleText() {
        String title = getText(pageTitle);
        logger.info("Products page title: {}", title);
        return title;
    }

    public boolean isProductsPageDisplayed() {
        return isDisplayed(pageTitle);
    }

    public int getProductCount() {
        List<WebElement> items = waitHelper.waitForAllVisible(productItems);
        int count = items.size();
        logger.info("Product count: {}", count);
        return count;
    }

    public List<String> getProductNames() {
        List<WebElement> names = waitHelper.waitForAllVisible(productNames);
        return names.stream().map(WebElement::getText).collect(Collectors.toList());
    }

    public void addFirstProductToCart() {
        logger.info("Adding first product to cart");
        List<WebElement> buttons = driver.findElements(addToCartButtons);
        if (!buttons.isEmpty()) {
            buttons.get(0).click();
        }
    }

    public void addProductToCartByIndex(int index) {
        logger.info("Adding product at index {} to cart", index);
        List<WebElement> buttons = driver.findElements(addToCartButtons);
        if (index < buttons.size()) {
            buttons.get(index).click();
        }
    }

    public String getCartItemCount() {
        try {
            return getText(cartBadge);
        } catch (Exception e) {
            return "0";
        }
    }

    public void clickCart() {
        logger.info("Clicking shopping cart");
        click(cartLink);
    }

    public void logout() {
        logger.info("Performing logout");
        click(burgerMenuButton);
        waitHelper.waitForClickable(logoutLink);
        click(logoutLink);
    }
}

