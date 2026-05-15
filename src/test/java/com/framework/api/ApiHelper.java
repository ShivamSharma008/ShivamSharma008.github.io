package com.framework.api;

import com.framework.config.ConfigReader;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Map;

/**
 * Reusable API helper for Rest Assured operations.
 * Can be used directly or from step definitions.
 */
public class ApiHelper {

    private static final Logger logger = LogManager.getLogger(ApiHelper.class);

    private final String baseUri;

    public ApiHelper() {
        this.baseUri = ConfigReader.getInstance().getApiBaseUrl();
    }

    public ApiHelper(String baseUri) {
        this.baseUri = baseUri;
    }

    public Response get(String endpoint) {
        logger.info("GET {}{}", baseUri, endpoint);
        return RestAssured
                .given()
                    .baseUri(baseUri)
                    .contentType(ContentType.JSON)
                .when()
                    .get(endpoint)
                .then()
                    .extract().response();
    }

    public Response post(String endpoint, Map<String, Object> body) {
        logger.info("POST {}{} with body: {}", baseUri, endpoint, body);
        return RestAssured
                .given()
                    .baseUri(baseUri)
                    .contentType(ContentType.JSON)
                    .body(body)
                .when()
                    .post(endpoint)
                .then()
                    .extract().response();
    }

    public Response put(String endpoint, Map<String, Object> body) {
        logger.info("PUT {}{} with body: {}", baseUri, endpoint, body);
        return RestAssured
                .given()
                    .baseUri(baseUri)
                    .contentType(ContentType.JSON)
                    .body(body)
                .when()
                    .put(endpoint)
                .then()
                    .extract().response();
    }

    public Response patch(String endpoint, Map<String, Object> body) {
        logger.info("PATCH {}{} with body: {}", baseUri, endpoint, body);
        return RestAssured
                .given()
                    .baseUri(baseUri)
                    .contentType(ContentType.JSON)
                    .body(body)
                .when()
                    .patch(endpoint)
                .then()
                    .extract().response();
    }

    public Response delete(String endpoint) {
        logger.info("DELETE {}{}", baseUri, endpoint);
        return RestAssured
                .given()
                    .baseUri(baseUri)
                    .contentType(ContentType.JSON)
                .when()
                    .delete(endpoint)
                .then()
                    .extract().response();
    }

    public Response getWithQueryParams(String endpoint, Map<String, Object> params) {
        logger.info("GET {}{} with params: {}", baseUri, endpoint, params);
        return RestAssured
                .given()
                    .baseUri(baseUri)
                    .contentType(ContentType.JSON)
                    .queryParams(params)
                .when()
                    .get(endpoint)
                .then()
                    .extract().response();
    }
}

