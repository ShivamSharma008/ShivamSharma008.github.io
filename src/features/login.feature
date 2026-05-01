@login
Feature: Login Functionality
  As a user of Practice Test Automation
  I want to be able to login with valid credentials
  So that I can access the logged-in page

  Background:
    Given I am on the login page

  @smoke @positive
  Scenario: Successful login with valid credentials
    When I enter username "student"
    And I enter password "Password123"
    And I click the submit button
    Then I should be redirected to the success page
    And I should see the success message "Logged In Successfully"
    And I should see the logout button on the success page

  @negative
  Scenario: Login with invalid username
    When I enter username "invalidUser"
    And I enter password "Password123"
    And I click the submit button
    Then I should see an error message "Your username is invalid!"

  @negative
  Scenario: Login with invalid password
    When I enter username "student"
    And I enter password "wrongPassword"
    And I click the submit button
    Then I should see an error message "Your password is invalid!"

  @smoke @positive @post-login
  Scenario: Perform post-login actions after successful login
    When I enter username "student"
    And I enter password "Password123"
    And I click the submit button
    Then I should be redirected to the success page
    And I should see the logout button on the success page
    And I should see the page content contains "Congratulations" or "successfully"
    When I click the logout button
    Then I should be navigated back to the login page
