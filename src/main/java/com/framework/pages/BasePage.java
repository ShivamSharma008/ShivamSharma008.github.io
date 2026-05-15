package com.framework.pages;

import com.framework.utils.WaitHelper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

/**
 * Base page class with common page operations.
 * All Page Objects should extend this class.
 */
public abstract class BasePage {

    protected final Logger logger = LogManager.getLogger(this.getClass());
    protected final WebDriver driver;
    protected final WaitHelper waitHelper;

    protected BasePage(WebDriver driver) {
        this.driver = driver;
        this.waitHelper = new WaitHelper(driver);
    }

    public String getPageTitle() {
        return driver.getTitle();
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    public void navigateTo(String url) {
        logger.info("Navigating to: {}", url);
        driver.get(url);
        waitHelper.waitForPageLoad();
    }

    protected void click(By locator) {
        waitHelper.click(locator);
    }

    protected void type(By locator, String text) {
        waitHelper.type(locator, text);
    }

    protected String getText(By locator) {
        return waitHelper.getText(locator);
    }

    protected boolean isDisplayed(By locator) {
        return waitHelper.isDisplayed(locator);
    }
}

