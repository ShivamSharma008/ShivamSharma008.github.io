package com.framework.hooks;

import com.framework.utils.DriverManager;
import com.framework.utils.ScreenshotHelper;
import io.cucumber.java.After;
import io.cucumber.java.AfterStep;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Cucumber Hooks for setup/teardown and screenshot capture.
 */
public class Hooks {

    private static final Logger logger = LogManager.getLogger(Hooks.class);

    @Before(value = "@ui")
    public void setUpUI(Scenario scenario) {
        logger.info("========================================");
        logger.info("Starting UI Scenario: {}", scenario.getName());
        logger.info("Tags: {}", scenario.getSourceTagNames());
        logger.info("========================================");
        DriverManager.initDriver();
    }

    @Before(value = "@api")
    public void setUpAPI(Scenario scenario) {
        logger.info("========================================");
        logger.info("Starting API Scenario: {}", scenario.getName());
        logger.info("Tags: {}", scenario.getSourceTagNames());
        logger.info("========================================");
    }

    @AfterStep(value = "@ui")
    public void afterStep(Scenario scenario) {
        try {
            byte[] screenshot = ScreenshotHelper.captureScreenshotAsBytes(DriverManager.getDriver());
            if (screenshot.length > 0) {
                scenario.attach(screenshot, "image/png", "Step Screenshot");
            }
        } catch (Exception e) {
            logger.warn("Could not capture step screenshot: {}", e.getMessage());
        }
    }

    @After(value = "@ui")
    public void tearDownUI(Scenario scenario) {
        try {
            if (scenario.isFailed()) {
                logger.error("Scenario FAILED: {}", scenario.getName());
                byte[] screenshot = ScreenshotHelper.captureScreenshotAsBytes(DriverManager.getDriver());
                if (screenshot.length > 0) {
                    scenario.attach(screenshot, "image/png", "Failure Screenshot");
                }
                ScreenshotHelper.captureScreenshot(DriverManager.getDriver(),
                        "FAILED_" + scenario.getName());
            } else {
                logger.info("Scenario PASSED: {}", scenario.getName());
            }
        } catch (Exception e) {
            logger.error("Error in teardown: {}", e.getMessage());
        } finally {
            DriverManager.quitDriver();
            logger.info("Browser closed for scenario: {}", scenario.getName());
        }
    }

    @After(value = "@api")
    public void tearDownAPI(Scenario scenario) {
        if (scenario.isFailed()) {
            logger.error("API Scenario FAILED: {}", scenario.getName());
        } else {
            logger.info("API Scenario PASSED: {}", scenario.getName());
        }
    }
}

