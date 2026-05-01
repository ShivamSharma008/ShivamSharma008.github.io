@exceptions @practice @mcp
Feature: Test Exceptions Module
  As a test automation engineer
  I want to test the Exceptions page functionality
  So that I can validate proper handling of dynamic elements and exceptions

  # ──────────────────────────────────────────────────────────────
  #  MCP CONTEXT: These tests verify exception-handling patterns.
  #  MCP agents use this module to understand how dynamic elements
  #  (appearing/disappearing) should be handled in automation.
  # ──────────────────────────────────────────────────────────────

  Background:
    Given I am on the Test Exceptions page

  @smoke @exceptions-edit
  Scenario: Edit an existing row on the Exceptions page
    Then I should see the exceptions page heading
    When I clear and type "Updated Row 1" in the Row 1 input
    And I click the Save button on exceptions page
    Then I should see the confirmation message "Row 1 was saved"
    And I capture a screenshot of the current page

  @exceptions-add
  Scenario: Add a new row and fill it with data
    When I click the Add button
    Then the Row 2 input should become visible
    When I type "New Row 2 Data" in the Row 2 input
    And I click the Save button for Row 2
    Then I should see the confirmation message "Row 2 was saved"
    And I capture a screenshot of the current page

  @exceptions-content @mcp-context
  Scenario: Validate page content and structure of Exceptions module
    Then I should see the exceptions page heading
    And I should see the exceptions page instructions
    And I capture a screenshot of the current page

