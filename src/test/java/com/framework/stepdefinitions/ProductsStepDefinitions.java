package com.framework.stepdefinitions;

import com.framework.config.ConfigReader;
import com.framework.pages.CartPage;
import com.framework.pages.LoginPage;
import com.framework.pages.ProductsPage;
import com.framework.utils.DriverManager;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.And;
import org.junit.jupiter.api.Assertions;

/**
 * Step definitions for Products feature.
 * Delegates all actions to Page Object methods.
 */
public class ProductsStepDefinitions {

    private final LoginPage loginPage = new LoginPage(DriverManager.getDriver());
    private final ProductsPage productsPage = new ProductsPage(DriverManager.getDriver());
    private final CartPage cartPage = new CartPage(DriverManager.getDriver());

    @Given("I am logged in as a standard user")
    public void iAmLoggedInAsAStandardUser() {
        ConfigReader config = ConfigReader.getInstance();
        loginPage.navigateToLoginPage(config.getBaseUrl());
        loginPage.login(
                config.getProperty("default.username"),
                config.getProperty("default.password")
        );
        Assertions.assertTrue(productsPage.isProductsPageDisplayed(),
                "Should be logged in and on products page");
    }

    @Then("I should see the products page")
    public void iShouldSeeTheProductsPage() {
        Assertions.assertTrue(productsPage.isProductsPageDisplayed(),
                "Products page should be displayed");
    }

    @Then("the products page title should be {string}")
    public void theProductsPageTitleShouldBe(String expectedTitle) {
        Assertions.assertEquals(expectedTitle, productsPage.getPageTitleText());
    }

    @Then("there should be {int} products displayed")
    public void thereShouldBeProductsDisplayed(int expectedCount) {
        Assertions.assertEquals(expectedCount, productsPage.getProductCount(),
                "Product count should match");
    }

    @When("I add the first product to the cart")
    public void iAddTheFirstProductToTheCart() {
        productsPage.addFirstProductToCart();
    }

    @When("I add another product to the cart at index {int}")
    public void iAddAnotherProductToTheCartAtIndex(int index) {
        productsPage.addProductToCartByIndex(index);
    }

    @Then("the cart badge should show {string} item(s)")
    public void theCartBadgeShouldShow(String expectedCount) {
        Assertions.assertEquals(expectedCount, productsPage.getCartItemCount(),
                "Cart badge count should match");
    }

    @When("I click on the shopping cart")
    public void iClickOnTheShoppingCart() {
        productsPage.clickCart();
    }

    @Then("I should be on the cart page")
    public void iShouldBeOnTheCartPage() {
        Assertions.assertTrue(cartPage.isCartPageDisplayed(),
                "Cart page should be displayed");
    }

    @Then("the cart should contain {int} item(s)")
    public void theCartShouldContainItems(int expectedCount) {
        Assertions.assertEquals(expectedCount, cartPage.getCartItemCount(),
                "Cart item count should match");
    }

    @When("I logout from the application")
    public void iLogoutFromTheApplication() {
        productsPage.logout();
    }

    @Then("I should be on the login page")
    public void iShouldBeOnTheLoginPage() {
        Assertions.assertTrue(loginPage.isLoginButtonVisible(),
                "Login page should be displayed after logout");
    }
}

