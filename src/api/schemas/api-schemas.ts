/**
 * JSON Schemas for API Response Validation
 * Author: Shivam Sharma, Senior SDET
 *
 * Used with Ajv for strict schema validation of API responses
 * Schemas for JSONPlaceholder and DummyJSON APIs
 */

/** Schema for single user response from JSONPlaceholder /users/{id} */
export const singleUserSchema = {
  type: 'object',
  required: ['id', 'name', 'username', 'email'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    username: { type: 'string' },
    email: { type: 'string' },
    address: { type: 'object' },
    phone: { type: 'string' },
    website: { type: 'string' },
    company: { type: 'object' },
  },
};

/** Schema for users list response from JSONPlaceholder /users */
export const usersListSchema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['id', 'name', 'username', 'email'],
    properties: {
      id: { type: 'number' },
      name: { type: 'string' },
      username: { type: 'string' },
      email: { type: 'string' },
      address: { type: 'object' },
      phone: { type: 'string' },
      website: { type: 'string' },
      company: { type: 'object' },
    },
  },
};

/** Schema for create post response from JSONPlaceholder POST /posts */
export const createPostSchema = {
  type: 'object',
  required: ['id', 'title', 'body', 'userId'],
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    body: { type: 'string' },
    userId: { type: 'number' },
  },
};

/** Schema for DummyJSON login success response */
export const authSuccessSchema = {
  type: 'object',
  required: ['accessToken', 'id', 'username'],
  properties: {
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
    id: { type: 'number' },
    username: { type: 'string' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    gender: { type: 'string' },
    image: { type: 'string' },
  },
};

/** Schema for DummyJSON error response */
export const authErrorSchema = {
  type: 'object',
  required: ['message'],
  properties: {
    message: { type: 'string' },
  },
};
