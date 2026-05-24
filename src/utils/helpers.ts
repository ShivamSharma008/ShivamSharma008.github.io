/**
 * Test Helpers - Reusable utility functions
 * Author: Shivam Sharma, Senior SDET
 *
 * Custom waits, retry logic, data loaders, and helper functions.
 */
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

/** Load JSON test data from file */
export function loadJsonData<T>(fileName: string): T {
  const filePath = path.resolve(__dirname, '..', 'test-data', fileName);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

/** Load CSV test data from file */
export function loadCsvData(fileName: string): Record<string, string>[] {
  const filePath = path.resolve(__dirname, '..', 'test-data', fileName);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return parse(raw, { columns: true, skip_empty_lines: true }) as Record<string, string>[];
}

/** Generate a random string of given length */
export function randomString(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/** Generate a random email */
export function randomEmail(): string {
  return `test_${randomString(6)}@testmu.com`;
}

/** Retry an async function with exponential backoff */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise(res => setTimeout(res, baseDelay * attempt));
    }
  }
  throw new Error('Retry failed');
}

/** Get current timestamp in ISO format */
export function timestamp(): string {
  return new Date().toISOString();
}

/** Format milliseconds to human readable */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}
