"""End-to-End API tests using JSONPlaceholder."""

import pytest


@pytest.mark.api
class TestPostsAPI:
    """CRUD tests for the /posts endpoint."""

    @pytest.mark.smoke
    def test_get_all_posts(self, api_client):
        """GET /posts should return a list of 100 posts."""
        response = api_client.get("/posts")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 100

    @pytest.mark.smoke
    def test_get_single_post(self, api_client):
        """GET /posts/1 should return post details."""
        response = api_client.get("/posts/1")
        assert response.status_code == 200
        post = response.json()
        assert post["id"] == 1
        assert "title" in post
        assert "body" in post
        assert post["userId"] == 1

    @pytest.mark.regression
    def test_get_post_not_found(self, api_client):
        """GET /posts/99999 should return 404."""
        response = api_client.get("/posts/99999")
        assert response.status_code == 404

    @pytest.mark.smoke
    def test_create_post(self, api_client):
        """POST /posts should create a new post."""
        payload = {"title": "Test Post", "body": "Test Body", "userId": 1}
        response = api_client.post("/posts", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Test Post"
        assert data["body"] == "Test Body"
        assert "id" in data

    @pytest.mark.regression
    def test_update_post_put(self, api_client):
        """PUT /posts/1 should replace the post."""
        payload = {"id": 1, "title": "Updated Title", "body": "Updated Body", "userId": 1}
        response = api_client.put("/posts/1", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"

    @pytest.mark.regression
    def test_update_post_patch(self, api_client):
        """PATCH /posts/1 should partially update the post."""
        payload = {"title": "Patched Title"}
        response = api_client.patch("/posts/1", json=payload)
        assert response.status_code == 200
        assert response.json()["title"] == "Patched Title"

    @pytest.mark.regression
    def test_delete_post(self, api_client):
        """DELETE /posts/1 should return 200."""
        response = api_client.delete("/posts/1")
        assert response.status_code == 200

    @pytest.mark.regression
    def test_filter_posts_by_user(self, api_client):
        """GET /posts?userId=1 should return filtered posts."""
        response = api_client.get("/posts", params={"userId": 1})
        assert response.status_code == 200
        posts = response.json()
        assert len(posts) > 0
        assert all(p["userId"] == 1 for p in posts)


@pytest.mark.api
class TestCommentsAPI:
    """Tests for the /comments endpoint."""

    @pytest.mark.smoke
    def test_get_comments_for_post(self, api_client):
        """GET /posts/1/comments should return comments for the post."""
        response = api_client.get("/posts/1/comments")
        assert response.status_code == 200
        comments = response.json()
        assert len(comments) > 0
        assert all(c["postId"] == 1 for c in comments)

    @pytest.mark.regression
    def test_get_all_comments(self, api_client):
        """GET /comments should return all comments."""
        response = api_client.get("/comments")
        assert response.status_code == 200
        assert len(response.json()) == 500

    @pytest.mark.regression
    def test_filter_comments_by_post(self, api_client):
        """GET /comments?postId=1 should return filtered comments."""
        response = api_client.get("/comments", params={"postId": 1})
        assert response.status_code == 200
        comments = response.json()
        assert len(comments) == 5
        assert all(c["postId"] == 1 for c in comments)


@pytest.mark.api
class TestUsersAPI:
    """Tests for the /users endpoint."""

    @pytest.mark.smoke
    def test_get_all_users(self, api_client):
        """GET /users should return 10 users."""
        response = api_client.get("/users")
        assert response.status_code == 200
        assert len(response.json()) == 10

    @pytest.mark.regression
    def test_get_single_user(self, api_client):
        """GET /users/1 should return user details."""
        response = api_client.get("/users/1")
        assert response.status_code == 200
        user = response.json()
        assert user["id"] == 1
        assert "name" in user
        assert "email" in user
        assert "address" in user

    @pytest.mark.regression
    def test_get_user_todos(self, api_client):
        """GET /users/1/todos should return todos for user 1."""
        response = api_client.get("/users/1/todos")
        assert response.status_code == 200
        todos = response.json()
        assert len(todos) > 0
        assert all(t["userId"] == 1 for t in todos)
