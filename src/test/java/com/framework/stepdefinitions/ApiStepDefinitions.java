package com.framework.stepdefinitions;

import com.framework.config.ConfigReader;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.And;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.http.ContentType;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.jupiter.api.Assertions;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Step definitions for API testing feature.
 * Uses Rest Assured for HTTP operations.
 */
public class ApiStepDefinitions {

    private static final Logger logger = LogManager.getLogger(ApiStepDefinitions.class);
    private Response response;

    private String getApiBaseUrl() {
        return ConfigReader.getInstance().getApiBaseUrl();
    }

    @When("I send a GET request to {string}")
    public void iSendAGetRequestTo(String endpoint) {
        logger.info("Sending GET request to: {}", endpoint);
        response = RestAssured
                .given()
                    .baseUri(getApiBaseUrl())
                    .contentType(ContentType.JSON)
                    .log().uri()
                .when()
                    .get(endpoint)
                .then()
                    .log().status()
                    .extract().response();
        logger.info("Response status: {}", response.getStatusCode());
    }

    @When("I send a POST request to {string} with body:")
    public void iSendAPostRequestToWithBody(String endpoint, io.cucumber.datatable.DataTable dataTable) {
        Map<String, String> bodyMap = new HashMap<>();
        dataTable.asLists(String.class).forEach(row -> bodyMap.put(row.get(0), row.get(1)));

        logger.info("Sending POST request to: {} with body: {}", endpoint, bodyMap);
        response = RestAssured
                .given()
                    .baseUri(getApiBaseUrl())
                    .contentType(ContentType.JSON)
                    .body(bodyMap)
                    .log().all()
                .when()
                    .post(endpoint)
                .then()
                    .log().all()
                    .extract().response();
    }

    @When("I send a PUT request to {string} with body:")
    public void iSendAPutRequestToWithBody(String endpoint, io.cucumber.datatable.DataTable dataTable) {
        Map<String, String> bodyMap = new HashMap<>();
        dataTable.asLists(String.class).forEach(row -> bodyMap.put(row.get(0), row.get(1)));

        logger.info("Sending PUT request to: {} with body: {}", endpoint, bodyMap);
        response = RestAssured
                .given()
                    .baseUri(getApiBaseUrl())
                    .contentType(ContentType.JSON)
                    .body(bodyMap)
                    .log().all()
                .when()
                    .put(endpoint)
                .then()
                    .log().all()
                    .extract().response();
    }

    @When("I send a DELETE request to {string}")
    public void iSendADeleteRequestTo(String endpoint) {
        logger.info("Sending DELETE request to: {}", endpoint);
        response = RestAssured
                .given()
                    .baseUri(getApiBaseUrl())
                    .contentType(ContentType.JSON)
                    .log().uri()
                .when()
                    .delete(endpoint)
                .then()
                    .log().status()
                    .extract().response();
    }

    @Then("the API response status code should be {int}")
    public void theApiResponseStatusCodeShouldBe(int expectedStatusCode) {
        int actualStatusCode = response.getStatusCode();
        logger.info("Expected status: {}, Actual status: {}", expectedStatusCode, actualStatusCode);
        Assertions.assertEquals(expectedStatusCode, actualStatusCode,
                "Response status code should match");
    }

    @Then("the response should contain a list of posts")
    public void theResponseShouldContainAListOfPosts() {
        List<?> posts = response.jsonPath().getList("$");
        logger.info("Number of posts returned: {}", posts.size());
        Assertions.assertFalse(posts.isEmpty(), "Posts list should not be empty");
    }

    @Then("the response should contain the post with id {int}")
    public void theResponseShouldContainThePostWithId(int expectedId) {
        int actualId = response.jsonPath().getInt("id");
        Assertions.assertEquals(expectedId, actualId, "Post ID should match");
    }

    @Then("the response should have field {string}")
    public void theResponseShouldHaveField(String fieldName) {
        Object value = response.jsonPath().get(fieldName);
        Assertions.assertNotNull(value, "Field '" + fieldName + "' should exist in response");
        logger.info("Field '{}' value: {}", fieldName, value);
    }

    @Then("the response field {string} should be {string}")
    public void theResponseFieldShouldBe(String fieldName, String expectedValue) {
        String actualValue = response.jsonPath().getString(fieldName);
        Assertions.assertEquals(expectedValue, actualValue,
                "Field '" + fieldName + "' should have expected value");
    }

    @Then("the response should contain a list of comments")
    public void theResponseShouldContainAListOfComments() {
        List<?> comments = response.jsonPath().getList("$");
        logger.info("Number of comments returned: {}", comments.size());
        Assertions.assertFalse(comments.isEmpty(), "Comments list should not be empty");
    }

    @Then("the response should contain a list of users")
    public void theResponseShouldContainAListOfUsers() {
        List<?> users = response.jsonPath().getList("$");
        logger.info("Number of users returned: {}", users.size());
        Assertions.assertFalse(users.isEmpty(), "Users list should not be empty");
    }
}

