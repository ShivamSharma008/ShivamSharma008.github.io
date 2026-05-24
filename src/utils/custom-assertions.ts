/**
 * Custom Assertions - Extended assertion helpers
 * Author: Shivam Sharma, Senior SDET
 *
 * Reusable assertion utilities beyond Playwright's built-in expect.
 */
import { expect } from '@playwright/test';
import { ApiResponseWrapper } from '../api/ApiClient';

export class CustomAssertions {
  /** Assert API response status code */
  static assertStatus(response: ApiResponseWrapper, expectedStatus: number): void {
    expect(response.status, `Expected status ${expectedStatus} but got ${response.status}`).toBe(expectedStatus);
  }

  /** Assert response time is within threshold (ms) */
  static assertResponseTime(response: ApiResponseWrapper, maxMs: number): void {
    expect(response.responseTime,
      `Response took ${response.responseTime}ms, exceeding ${maxMs}ms threshold`
    ).toBeLessThan(maxMs);
  }

  /** Assert response body contains expected keys */
  static assertBodyContainsKeys(response: ApiResponseWrapper, keys: string[]): void {
    for (const key of keys) {
      expect(response.body, `Response body missing key: ${key}`).toHaveProperty(key);
    }
  }

  /** Assert response body field equals expected value */
  static assertBodyField(response: ApiResponseWrapper, field: string, expectedValue: any): void {
    expect(response.body[field],
      `Expected ${field} to be ${expectedValue}`
    ).toBe(expectedValue);
  }

  /** Assert string contains substring (case-insensitive) */
  static assertContains(actual: string, expected: string): void {
    expect(actual.toLowerCase()).toContain(expected.toLowerCase());
  }

  /** Assert array length */
  static assertArrayLength(arr: any[], expectedLength: number): void {
    expect(arr).toHaveLength(expectedLength);
  }

  /** Assert value is within range */
  static assertInRange(value: number, min: number, max: number): void {
    expect(value, `Expected ${value} to be between ${min} and ${max}`).toBeGreaterThanOrEqual(min);
    expect(value, `Expected ${value} to be between ${min} and ${max}`).toBeLessThanOrEqual(max);
  }
}
