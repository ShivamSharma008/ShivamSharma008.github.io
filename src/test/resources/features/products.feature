@ui @products
Feature: Products Page Functionality
  As a logged-in user
  I want to browse and interact with products
  So that I can add items to my cart

  Background:
    Given I am logged in as a standard user

  @smoke
  Scenario: View products page
    Then I should see the products page
    And the products page title should be "Products"
    And there should be 6 products displayed

  @cart
  Scenario: Add a product to the cart
    When I add the first product to the cart
    Then the cart badge should show "1" item

  @cart
  Scenario: Add multiple products to the cart
    When I add the first product to the cart
    And I add another product to the cart at index 1
    Then the cart badge should show "2" items

  @cart
  Scenario: Navigate to cart page
    When I add the first product to the cart
    And I click on the shopping cart
    Then I should be on the cart page
    And the cart should contain 1 item

  @logout
  Scenario: Logout from products page
    When I logout from the application
    Then I should be on the login page

