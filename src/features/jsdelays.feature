@table @practice @mcp
Feature: Test Table Module
  As a test automation engineer
  I want to test the Test Table page
  So that I can validate table data rendering and content verification

  # ──────────────────────────────────────────────────────────────
  #  MCP CONTEXT: These tests validate how structured data (tables)
  #  is displayed. MCP agents can use these patterns to understand
  #  and extract tabular data from web applications.
  # ──────────────────────────────────────────────────────────────

  Background:
    Given I am on the Test Table page

  @smoke @table-content
  Scenario: Verify table is displayed with data
    Then I should see the Test Table page heading
    And I should see the data table on the page
    And I capture a screenshot of the current page

  @table-content @mcp-context
  Scenario: Validate table content and structure
    Then I should see the Test Table page heading
    And I should see table headers
    And I should see table rows with data
    And I capture a screenshot of the current page
