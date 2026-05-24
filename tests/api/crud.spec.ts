/**
 * API CRUD Tests
 * Author: Shivam Sharma, Senior SDET
 *
 * Covers: Create, Read, Update, Delete operations
 * Includes schema validation and response-time assertions
 * Target: https://jsonplaceholder.typicode.com
 */
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/ApiClient';
import { usersListSchema, singleUserSchema, createPostSchema } from '../../src/api/schemas/api-schemas';
import { CustomAssertions } from '../../src/utils/custom-assertions';
import { loadJsonData } from '../../src/utils/helpers';

const apiPayloads = loadJsonData<any>('api-payloads.json');

test.describe('API CRUD Tests', () => {
  let api: ApiClient;

  test.beforeEach(async ({ request }) => {
    api = new ApiClient(request);
  });

  test.describe('GET Operations', () => {
    test('TC-API-001: Should fetch list of users', async () => {
      const response = await api.get('/users');
      CustomAssertions.assertStatus(response, 200);
      CustomAssertions.assertResponseTime(response, 5000);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

      // Schema validation
      const validation = ApiClient.validateSchema(response.body, usersListSchema);
      expect(validation.valid, `Schema errors: ${validation.errors.join(', ')}`).toBeTruthy();
    });

    test('TC-API-002: Should fetch single user by ID', async () => {
      const response = await api.get('/users/1');
      CustomAssertions.assertStatus(response, 200);
      CustomAssertions.assertResponseTime(response, 5000);
      expect(response.body.id).toBe(1);
      expect(response.body.email).toBeTruthy();

      // Schema validation
      const validation = ApiClient.validateSchema(response.body, singleUserSchema);
      expect(validation.valid, `Schema errors: ${validation.errors.join(', ')}`).toBeTruthy();
    });

    test('TC-API-003: Should return 404 for non-existent post', async () => {
      const response = await api.get('/posts/999');
      CustomAssertions.assertStatus(response, 404);
    });
  });

  test.describe('POST Operations', () => {
    test('TC-API-004: Should create a new post', async () => {
      const response = await api.post('/posts', apiPayloads.createPost);
      CustomAssertions.assertStatus(response, 201);
      CustomAssertions.assertResponseTime(response, 5000);
      expect(response.body.title).toBe(apiPayloads.createPost.title);
      expect(response.body.body).toBe(apiPayloads.createPost.body);
      expect(response.body.userId).toBe(apiPayloads.createPost.userId);
      expect(response.body.id).toBeTruthy();

      // Schema validation
      const validation = ApiClient.validateSchema(response.body, createPostSchema);
      expect(validation.valid, `Schema errors: ${validation.errors.join(', ')}`).toBeTruthy();
    });
  });

  test.describe('PUT Operations', () => {
    test('TC-API-005: Should update post via PUT', async () => {
      const response = await api.put('/posts/1', apiPayloads.updatePost);
      CustomAssertions.assertStatus(response, 200);
      expect(response.body.title).toBe(apiPayloads.updatePost.title);
      expect(response.body.body).toBe(apiPayloads.updatePost.body);
    });
  });

  test.describe('PATCH Operations', () => {
    test('TC-API-006: Should partially update post via PATCH', async () => {
      const response = await api.patch('/posts/1', { title: 'Patched Title' });
      CustomAssertions.assertStatus(response, 200);
      expect(response.body.title).toBe('Patched Title');
    });
  });

  test.describe('DELETE Operations', () => {
    test('TC-API-007: Should delete a post', async () => {
      const response = await api.delete('/posts/1');
      CustomAssertions.assertStatus(response, 200);
    });
  });

  test.describe('Filtering', () => {
    test('TC-API-008: Should support filtering by userId', async () => {
      const response = await api.get('/posts', { userId: '1' });
      CustomAssertions.assertStatus(response, 200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      for (const post of response.body) {
        expect(post.userId).toBe(1);
      }
    });
  });
});
