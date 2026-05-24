/**
 * API Authentication Tests
 * Author: Shivam Sharma, Senior SDET
 *
 * Covers: Login, Token validation, Error cases
 * Target: https://dummyjson.com
 */
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/ApiClient';
import { authSuccessSchema, authErrorSchema } from '../../src/api/schemas/api-schemas';
import { CustomAssertions } from '../../src/utils/custom-assertions';
import { loadJsonData } from '../../src/utils/helpers';

const apiPayloads = loadJsonData<any>('api-payloads.json');

test.describe('API Authentication Tests', () => {
  let authApi: ApiClient;

  test.beforeEach(async ({ request }) => {
    authApi = new ApiClient(request, 'https://dummyjson.com');
  });

  test.describe('Login', () => {
    test('TC-AUTH-001: Should login successfully with valid credentials', async () => {
      const response = await authApi.post('/auth/login', apiPayloads.loginSuccess);
      CustomAssertions.assertStatus(response, 200);
      expect(response.body.accessToken).toBeTruthy();
      expect(response.body.id).toBeTruthy();
      expect(response.body.username).toBe('emilys');

      const validation = ApiClient.validateSchema(response.body, authSuccessSchema);
      expect(validation.valid, `Schema errors: ${validation.errors.join(', ')}`).toBeTruthy();
    });

    test('TC-AUTH-002: Should fail login with invalid credentials', async () => {
      const response = await authApi.post('/auth/login', apiPayloads.loginFailed);
      CustomAssertions.assertStatus(response, 400);
      expect(response.body.message).toBeTruthy();

      const validation = ApiClient.validateSchema(response.body, authErrorSchema);
      expect(validation.valid).toBeTruthy();
    });
  });

  test.describe('Authenticated Access', () => {
    test('TC-AUTH-003: Should get current user with valid token', async () => {
      // First login to get token
      const loginResponse = await authApi.post('/auth/login', apiPayloads.loginSuccess);
      CustomAssertions.assertStatus(loginResponse, 200);
      const token = loginResponse.body.accessToken;

      // Use token to access current user
      authApi.setToken(token);
      const meResponse = await authApi.get('/auth/me');
      CustomAssertions.assertStatus(meResponse, 200);
      expect(meResponse.body.username).toBe('emilys');
      expect(meResponse.body.id).toBeTruthy();
    });

    test('TC-AUTH-004: Should fail login without password', async () => {
      const response = await authApi.post('/auth/login', { username: 'emilys' });
      CustomAssertions.assertStatus(response, 400);
      expect(response.body.message).toBeTruthy();
    });
  });
});
