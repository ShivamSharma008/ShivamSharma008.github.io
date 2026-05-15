@api
Feature: REST API Testing
  As a QA engineer
  I want to validate JSONPlaceholder API endpoints
  So that I can ensure API reliability

  @smoke @api-get
  Scenario: Get all posts
    When I send a GET request to "/posts"
    Then the API response status code should be 200
    And the response should contain a list of posts

  @api-get
  Scenario: Get a single post by ID
    When I send a GET request to "/posts/1"
    Then the API response status code should be 200
    And the response should contain the post with id 1
    And the response should have field "userId"
    And the response should have field "title"
    And the response should have field "body"

  @api-post
  Scenario: Create a new post
    When I send a POST request to "/posts" with body:
      | title  | foo       |
      | body   | bar       |
      | userId | 1         |
    Then the API response status code should be 201
    And the response should have field "id"
    And the response field "title" should be "foo"

  @api-put
  Scenario: Update an existing post
    When I send a PUT request to "/posts/1" with body:
      | title  | updated title |
      | body   | updated body  |
      | userId | 1             |
    Then the API response status code should be 200
    And the response field "title" should be "updated title"

  @api-delete
  Scenario: Delete a post
    When I send a DELETE request to "/posts/1"
    Then the API response status code should be 200

  @api-get
  Scenario: Get comments for a post
    When I send a GET request to "/posts/1/comments"
    Then the API response status code should be 200
    And the response should contain a list of comments

  @api-get
  Scenario: Get users list
    When I send a GET request to "/users"
    Then the API response status code should be 200
    And the response should contain a list of users

