@ui @login
Feature: Login Functionality
  As a user of the SauceDemo application
  I want to be able to log in with valid credentials
  So that I can access the products page

  Background:
    Given I am on the SauceDemo login page

  @smoke @positive
  Scenario: Successful login with valid credentials
    When I enter username "standard_user"
    And I enter password "secret_sauce"
    And I click the login button
    Then I should be redirected to the products page
    And the page title should be "Products"

  @negative
  Scenario: Login with invalid credentials
    When I enter username "invalid_user"
    And I enter password "wrong_password"
    And I click the login button
    Then I should see an error message "Epic sadface: Username and password do not match any user in this service"

  @negative
  Scenario: Login with locked out user
    When I enter username "locked_out_user"
    And I enter password "secret_sauce"
    And I click the login button
    Then I should see an error message "Epic sadface: Sorry, this user has been locked out."

  @negative
  Scenario: Login with empty credentials
    When I click the login button
    Then I should see an error message "Epic sadface: Username is required"

  @smoke @positive
  Scenario Outline: Login with multiple valid users
    When I enter username "<username>"
    And I enter password "<password>"
    And I click the login button
    Then I should be redirected to the products page

    Examples:
      | username                | password     |
      | standard_user           | secret_sauce |
      | problem_user            | secret_sauce |
      | performance_glitch_user | secret_sauce |

