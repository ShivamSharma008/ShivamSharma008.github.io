@practice @mcp
Feature: Practice Section Navigation and Validation
  As a user of Practice Test Automation
  I want to navigate through all Practice section modules
  So that I can verify each module loads correctly and displays expected content

  # ──────────────────────────────────────────────────────────────
  #  MCP CONTEXT: These tests demonstrate how MCP provides context
  #  to AI agents by validating page structure, content, and links.
  #  An MCP-connected agent can read these results to understand
  #  the application's layout and available test areas.
  # ──────────────────────────────────────────────────────────────

  @smoke @practice-hub
  Scenario: Navigate to Practice page and verify available sections
    Given I am on the Practice hub page
    Then I should see the Practice page heading
    And I should see practice links for available modules
    And I capture a screenshot of the Practice hub

  @practice-hub @mcp-context
  Scenario: Navigate from Practice hub to Test Login Page
    Given I am on the Practice hub page
    When I click the Test Login Page link
    Then I should be on the login page URL
    And I should see the login form elements
    And I capture a screenshot of the current page

  @practice-hub @mcp-context
  Scenario: Navigate from Practice hub to Test Exceptions Page
    Given I am on the Practice hub page
    When I click the Test Exceptions link
    Then I should be on the test exceptions page URL
    And I should see the exceptions page loaded
    And I capture a screenshot of the current page

  @practice-hub @mcp-context
  Scenario: Navigate from Practice hub to Test Table Page
    Given I am on the Practice hub page
    When I click the Test Table link
    Then I should be on the test table page URL
    And I should see the test table page content
    And I capture a screenshot of the current page
