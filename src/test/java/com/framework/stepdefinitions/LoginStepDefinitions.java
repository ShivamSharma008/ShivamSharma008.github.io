package com.framework.stepdefinitions;

import com.framework.config.ConfigReader;
import com.framework.pages.LoginPage;
import com.framework.pages.ProductsPage;
import com.framework.utils.DriverManager;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.And;
import org.junit.jupiter.api.Assertions;

/**
 * Step definitions for Login feature.
 * Delegates all actions to Page Object methods - no direct Selenium code.
 */
public class LoginStepDefinitions {

    private final LoginPage loginPage = new LoginPage(DriverManager.getDriver());
    private final ProductsPage productsPage = new ProductsPage(DriverManager.getDriver());

    @Given("I am on the SauceDemo login page")
    public void iAmOnTheSauceDemoLoginPage() {
        String baseUrl = ConfigReader.getInstance().getBaseUrl();
        loginPage.navigateToLoginPage(baseUrl);
        Assertions.assertTrue(loginPage.isLoginPageDisplayed(), "Login page should be displayed");
    }

    @When("I enter username {string}")
    public void iEnterUsername(String username) {
        loginPage.enterUsername(username);
    }

    @When("I enter password {string}")
    public void iEnterPassword(String password) {
        loginPage.enterPassword(password);
    }

    @When("I click the login button")
    public void iClickTheLoginButton() {
        loginPage.clickLoginButton();
    }

    @Then("I should be redirected to the products page")
    public void iShouldBeRedirectedToTheProductsPage() {
        Assertions.assertTrue(productsPage.isProductsPageDisplayed(),
                "Products page should be displayed after login");
    }

    @Then("the page title should be {string}")
    public void thePageTitleShouldBe(String expectedTitle) {
        String actualTitle = productsPage.getPageTitleText();
        Assertions.assertEquals(expectedTitle, actualTitle,
                "Page title should match expected value");
    }

    @Then("I should see an error message {string}")
    public void iShouldSeeAnErrorMessage(String expectedMessage) {
        Assertions.assertTrue(loginPage.isErrorMessageDisplayed(),
                "Error message should be displayed");
        String actualMessage = loginPage.getErrorMessage();
        Assertions.assertEquals(expectedMessage, actualMessage,
                "Error message should match expected text");
    }
}

