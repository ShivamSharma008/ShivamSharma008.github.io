package com.framework.api;

import io.restassured.response.Response;
import org.junit.jupiter.api.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Standalone E2E API tests using Rest Assured.
 * These can run independently of Cucumber.
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("JSONPlaceholder API E2E Tests")
public class ApiE2ETest {

    private static ApiHelper apiHelper;
    private static int createdPostId;

    @BeforeAll
    static void setup() {
        apiHelper = new ApiHelper("https://jsonplaceholder.typicode.com");
    }

    @Test
    @Order(1)
    @DisplayName("GET /posts - Retrieve all posts")
    void testGetAllPosts() {
        Response response = apiHelper.get("/posts");

        assertEquals(200, response.getStatusCode());
        List<?> posts = response.jsonPath().getList("$");
        assertFalse(posts.isEmpty(), "Posts list should not be empty");
        assertEquals(100, posts.size(), "Should return 100 posts");
    }

    @Test
    @Order(2)
    @DisplayName("GET /posts/1 - Retrieve single post")
    void testGetSinglePost() {
        Response response = apiHelper.get("/posts/1");

        assertEquals(200, response.getStatusCode());
        assertEquals(1, response.jsonPath().getInt("id"));
        assertNotNull(response.jsonPath().getString("title"));
        assertNotNull(response.jsonPath().getString("body"));
        assertEquals(1, response.jsonPath().getInt("userId"));
    }

    @Test
    @Order(3)
    @DisplayName("POST /posts - Create a new post")
    void testCreatePost() {
        Map<String, Object> body = new HashMap<>();
        body.put("title", "Test Post Title");
        body.put("body", "Test Post Body Content");
        body.put("userId", 1);

        Response response = apiHelper.post("/posts", body);

        assertEquals(201, response.getStatusCode());
        createdPostId = response.jsonPath().getInt("id");
        assertTrue(createdPostId > 0, "Created post should have an ID");
        assertEquals("Test Post Title", response.jsonPath().getString("title"));
        assertEquals("Test Post Body Content", response.jsonPath().getString("body"));
    }

    @Test
    @Order(4)
    @DisplayName("PUT /posts/1 - Update a post")
    void testUpdatePost() {
        Map<String, Object> body = new HashMap<>();
        body.put("id", 1);
        body.put("title", "Updated Title");
        body.put("body", "Updated Body");
        body.put("userId", 1);

        Response response = apiHelper.put("/posts/1", body);

        assertEquals(200, response.getStatusCode());
        assertEquals("Updated Title", response.jsonPath().getString("title"));
        assertEquals("Updated Body", response.jsonPath().getString("body"));
    }

    @Test
    @Order(5)
    @DisplayName("PATCH /posts/1 - Partial update")
    void testPatchPost() {
        Map<String, Object> body = new HashMap<>();
        body.put("title", "Patched Title");

        Response response = apiHelper.patch("/posts/1", body);

        assertEquals(200, response.getStatusCode());
        assertEquals("Patched Title", response.jsonPath().getString("title"));
    }

    @Test
    @Order(6)
    @DisplayName("DELETE /posts/1 - Delete a post")
    void testDeletePost() {
        Response response = apiHelper.delete("/posts/1");

        assertEquals(200, response.getStatusCode());
    }

    @Test
    @Order(7)
    @DisplayName("GET /users - Retrieve all users")
    void testGetAllUsers() {
        Response response = apiHelper.get("/users");

        assertEquals(200, response.getStatusCode());
        List<?> users = response.jsonPath().getList("$");
        assertEquals(10, users.size(), "Should return 10 users");
    }

    @Test
    @Order(8)
    @DisplayName("GET /posts?userId=1 - Filter posts by user")
    void testGetPostsByUser() {
        Map<String, Object> params = new HashMap<>();
        params.put("userId", 1);

        Response response = apiHelper.getWithQueryParams("/posts", params);

        assertEquals(200, response.getStatusCode());
        List<?> posts = response.jsonPath().getList("$");
        assertFalse(posts.isEmpty());
        // Verify all returned posts belong to userId 1
        List<Integer> userIds = response.jsonPath().getList("userId");
        userIds.forEach(id -> assertEquals(1, id));
    }

    @Test
    @Order(9)
    @DisplayName("GET /posts/1/comments - Get comments for post")
    void testGetCommentsForPost() {
        Response response = apiHelper.get("/posts/1/comments");

        assertEquals(200, response.getStatusCode());
        List<?> comments = response.jsonPath().getList("$");
        assertFalse(comments.isEmpty(), "Comments list should not be empty");
        // Verify all comments belong to post 1
        List<Integer> postIds = response.jsonPath().getList("postId");
        postIds.forEach(id -> assertEquals(1, id));
    }

    @Test
    @Order(10)
    @DisplayName("GET /posts/9999 - Non-existent resource returns 404")
    void testGetNonExistentPost() {
        Response response = apiHelper.get("/posts/9999");

        assertEquals(404, response.getStatusCode());
    }
}

