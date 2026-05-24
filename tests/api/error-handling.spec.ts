/**
 * API Error Handling Tests
 * Author: Shivam Sharma, Senior SDET
 *
 * Covers: 4xx client errors, invalid endpoints, malformed requests
 * Target: https://jsonplaceholder.typicode.com and https://dummyjson.com
 */
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/ApiClient';
import { CustomAssertions } from '../../src/utils/custom-assertions';

test.describe('API Error Handling Tests', () => {
  let api: ApiClient;
  let authApi: ApiClient;

  test.beforeEach(async ({ request }) => {
    api = new ApiClient(request);
    authApi = new ApiClient(request, 'https://dummyjson.com');
  });

  test('TC-ERR-001: Should return 404 for non-existent post', async () => {
    const response = await api.get('/posts/999');
    CustomAssertions.assertStatus(response, 404);
  });

  test('TC-ERR-002: Should return 404 for invalid endpoint', async () => {
    const response = await api.get('/postsxyz/1');
    CustomAssertions.assertStatus(response, 404);
  });

  test('TC-ERR-003: Should return 400 for login with bad credentials', async () => {
    const response = await authApi.post('/auth/login', {
      username: 'invaliduser',
      password: 'wrongpassword',
    });
    CustomAssertions.assertStatus(response, 400);
    expect(response.body.message).toBeTruthy();
  });

  test('TC-ERR-004: Should validate response time under threshold', async () => {
    const response = await api.get('/posts/1');
    CustomAssertions.assertResponseTime(response, 5000);
  });
});
