package com.framework.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

/**
 * Page Object for the SauceDemo Login page.
 * All locators use XPath as preferred strategy.
 */
public class LoginPage extends BasePage {

    // ===== Locators (XPath) =====
    private final By usernameField = By.xpath("//input[@id='user-name']");
    private final By passwordField = By.xpath("//input[@id='password']");
    private final By loginButton = By.xpath("//input[@id='login-button']");
    private final By errorMessage = By.xpath("//div[@class='error-message-container error']//h3");
    private final By loginLogo = By.xpath("//div[@class='login_logo']");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    // ===== Page Actions =====

    public void navigateToLoginPage(String url) {
        logger.info("Navigating to login page: {}", url);
        navigateTo(url);
    }

    public void enterUsername(String username) {
        logger.info("Entering username: {}", username);
        type(usernameField, username);
    }

    public void enterPassword(String password) {
        logger.info("Entering password");
        type(passwordField, password);
    }

    public void clickLoginButton() {
        logger.info("Clicking login button");
        click(loginButton);
    }

    public void login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLoginButton();
    }

    public String getErrorMessage() {
        String error = getText(errorMessage);
        logger.info("Error message: {}", error);
        return error;
    }

    public boolean isErrorMessageDisplayed() {
        return isDisplayed(errorMessage);
    }

    public boolean isLoginPageDisplayed() {
        return isDisplayed(loginLogo);
    }

    public boolean isLoginButtonVisible() {
        return isDisplayed(loginButton);
    }
}

