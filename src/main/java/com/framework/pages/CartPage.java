package com.framework.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Page Object for the SauceDemo Cart page.
 */
public class CartPage extends BasePage {

    // ===== Locators (XPath) =====
    private final By pageTitle = By.xpath("//span[@class='title']");
    private final By cartItems = By.xpath("//div[@class='cart_item']");
    private final By cartItemNames = By.xpath("//div[@class='inventory_item_name']");
    private final By removeButtons = By.xpath("//button[contains(@id,'remove')]");
    private final By checkoutButton = By.xpath("//button[@id='checkout']");
    private final By continueShoppingButton = By.xpath("//button[@id='continue-shopping']");

    public CartPage(WebDriver driver) {
        super(driver);
    }

    // ===== Page Actions =====

    public String getPageTitleText() {
        return getText(pageTitle);
    }

    public boolean isCartPageDisplayed() {
        return isDisplayed(pageTitle);
    }

    public int getCartItemCount() {
        List<WebElement> items = driver.findElements(cartItems);
        logger.info("Cart items count: {}", items.size());
        return items.size();
    }

    public List<String> getCartItemNames() {
        return driver.findElements(cartItemNames).stream()
                .map(WebElement::getText)
                .collect(Collectors.toList());
    }

    public void removeFirstItem() {
        logger.info("Removing first item from cart");
        List<WebElement> buttons = driver.findElements(removeButtons);
        if (!buttons.isEmpty()) {
            buttons.get(0).click();
        }
    }

    public void clickCheckout() {
        logger.info("Clicking checkout button");
        click(checkoutButton);
    }

    public void clickContinueShopping() {
        logger.info("Clicking continue shopping");
        click(continueShoppingButton);
    }
}

