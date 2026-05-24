/**
 * API Client - Reusable HTTP client for API testing
 * Author: Shivam Sharma, Senior SDET
 *
 * Provides CRUD operations, auth flows, response-time assertions,
 * and schema validation using Ajv.
 */
import { APIRequestContext, APIResponse } from '@playwright/test';
import Ajv, { ValidateFunction } from 'ajv';

const ajv = new Ajv({ allErrors: true });

export interface ApiResponseWrapper {
  status: number;
  body: any;
  headers: Record<string, string>;
  responseTime: number;
}

export class ApiClient {
  private request: APIRequestContext;
  private baseUrl: string;
  private token?: string;

  constructor(request: APIRequestContext, baseUrl: string = 'https://jsonplaceholder.typicode.com') {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /** Set auth token for subsequent requests */
  setToken(token: string): void {
    this.token = token;
  }

  /** Build headers with optional auth */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  /** Wrap API response with timing info */
  private async wrapResponse(response: APIResponse, startTime: number): Promise<ApiResponseWrapper> {
    const responseTime = Date.now() - startTime;
    let body: any;
    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }
    const headers: Record<string, string> = {};
    const allHeaders = response.headers();
    for (const [key, value] of Object.entries(allHeaders)) {
      headers[key] = value;
    }
    return { status: response.status(), body, headers, responseTime };
  }

  /** GET request */
  async get(endpoint: string, params?: Record<string, string>): Promise<ApiResponseWrapper> {
    const url = params
      ? `${this.baseUrl}${endpoint}?${new URLSearchParams(params)}`
      : `${this.baseUrl}${endpoint}`;
    const startTime = Date.now();
    const response = await this.request.get(url, { headers: this.getHeaders() });
    return this.wrapResponse(response, startTime);
  }

  /** POST request */
  async post(endpoint: string, data: any): Promise<ApiResponseWrapper> {
    const startTime = Date.now();
    const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
      data,
      headers: this.getHeaders(),
    });
    return this.wrapResponse(response, startTime);
  }

  /** PUT request */
  async put(endpoint: string, data: any): Promise<ApiResponseWrapper> {
    const startTime = Date.now();
    const response = await this.request.put(`${this.baseUrl}${endpoint}`, {
      data,
      headers: this.getHeaders(),
    });
    return this.wrapResponse(response, startTime);
  }

  /** PATCH request */
  async patch(endpoint: string, data: any): Promise<ApiResponseWrapper> {
    const startTime = Date.now();
    const response = await this.request.patch(`${this.baseUrl}${endpoint}`, {
      data,
      headers: this.getHeaders(),
    });
    return this.wrapResponse(response, startTime);
  }

  /** DELETE request */
  async delete(endpoint: string): Promise<ApiResponseWrapper> {
    const startTime = Date.now();
    const response = await this.request.delete(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
    });
    return this.wrapResponse(response, startTime);
  }

  /** Validate response body against JSON Schema */
  static validateSchema(data: any, schema: object): { valid: boolean; errors: string[] } {
    const validate: ValidateFunction = ajv.compile(schema);
    const valid = validate(data) as boolean;
    const errors = valid ? [] : (validate.errors || []).map(e => `${e.instancePath} ${e.message}`);
    return { valid, errors };
  }
}
