/**
 * Environment Configuration Manager
 * Author: Shivam Sharma, Senior SDET
 * Supports config-driven environment switching
 */
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export interface EnvConfig {
  baseUrl: string;
  apiBaseUrl: string;
  authApiBaseUrl: string;
  environment: string;
  timeout: number;
  retryCount: number;
}

const environments: Record<string, EnvConfig> = {
  staging: {
    baseUrl: 'https://the-internet.herokuapp.com',
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    authApiBaseUrl: 'https://dummyjson.com',
    environment: 'staging',
    timeout: 30000,
    retryCount: 2,
  },
  production: {
    baseUrl: 'https://the-internet.herokuapp.com',
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    authApiBaseUrl: 'https://dummyjson.com',
    environment: 'production',
    timeout: 15000,
    retryCount: 1,
  },
};

export function getConfig(): EnvConfig {
  const env = process.env.ENVIRONMENT || 'staging';
  const config = environments[env] || environments.staging;

  return {
    baseUrl: process.env.BASE_URL || config.baseUrl,
    apiBaseUrl: process.env.API_BASE_URL || config.apiBaseUrl,
    authApiBaseUrl: process.env.AUTH_API_BASE_URL || config.authApiBaseUrl,
    environment: env,
    timeout: Number(process.env.TIMEOUT) || config.timeout,
    retryCount: Number(process.env.RETRY_COUNT) || config.retryCount,
  };
}
