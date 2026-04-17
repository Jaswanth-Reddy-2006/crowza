/**
 * Secure API Client
 * Handles encrypted communication, token management, and security headers
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { RateLimiter, validateApiResponse } from './inputValidation';
import { auditLogger } from './auditLogger';

export interface SecureApiConfig {
  baseURL: string;
  timeout?: number;
  maxRetries?: number;
  rateLimitPerMinute?: number;
}

export interface ApiRequestConfig extends AxiosRequestConfig {
  requiresAuth?: boolean;
  skipValidation?: boolean;
  skipAudit?: boolean;
}

class SecureApiClient {
  private client: AxiosInstance;
  private readonly tokenKey = 'authToken';
  private readonly refreshTokenKey = 'refreshToken';
  private rateLimiter: RateLimiter;
  private userId: string | null = null;

  constructor(config: SecureApiConfig) {
    this.rateLimiter = new RateLimiter(config.rateLimitPerMinute || 100, 60000);

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        // CSP and security headers
        'X-Requested-With': 'XMLHttpRequest',
        'X-Content-Type-Options': 'nosniff',
      },
    });

    this.setupInterceptors(config);
  }

  /**
   * Setup request/response interceptors
   */
  private setupInterceptors(config: SecureApiConfig): void {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        // Rate limiting check
        const clientId = this.userId || 'anonymous';
        if (!this.rateLimiter.isAllowed(clientId)) {
          auditLogger.logRateLimitExceeded(
            clientId,
            config.url || '',
            100
          );
          throw new Error('Rate limit exceeded');
        }

        // Add auth token if needed
        if (config.headers && config.headers.requiresAuth !== false) {
          const token = await this.getAccessToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // Add security headers
        config.headers = this.addSecurityHeaders(config.headers || {});

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Validate response structure
        if (!response.config.skipValidation) {
          const validation = validateApiResponse(response.data);
          if (!validation.isValid) {
            console.warn('Invalid API response structure:', validation.errors);
          }
        }

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 - try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshAccessToken();
            const token = await this.getAccessToken();
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            auditLogger.logAuthEvent(
              this.userId || 'unknown',
              'AUTH_FAILED',
              false,
              { reason: 'Token refresh failed' }
            );
            // Trigger logout
            this.clearTokens();
            throw refreshError;
          }
        }

        // Handle other errors
        auditLogger.logEvent(
          'ERROR',
          this.userId || 'unknown',
          originalRequest.url || '',
          `API Error: ${error.message}`,
          'medium',
          'failure',
          { status: error.response?.status, data: error.response?.data }
        );

        return Promise.reject(error);
      }
    );
  }

  /**
   * Add security headers to requests
   */
  private addSecurityHeaders(headers: Record<string, any>): Record<string, any> {
    return {
      ...headers,
      'X-Requested-With': 'XMLHttpRequest',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    };
  }

  /**
   * Store access token securely
   */
  async storeAccessToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.tokenKey, token);
    } catch (error) {
      console.error('Failed to store access token:', error);
      throw error;
    }
  }

  /**
   * Get stored access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.tokenKey);
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
      return null;
    }
  }

  /**
   * Store refresh token securely
   */
  async storeRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.refreshTokenKey, token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
      throw error;
    }
  }

  /**
   * Get stored refresh token
   */
  private async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.refreshTokenKey);
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<void> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.client.post('/auth/refresh', {
        refreshToken,
      });

      if (response.data.success && response.data.data?.accessToken) {
        await this.storeAccessToken(response.data.data.accessToken);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      throw error;
    }
  }

  /**
   * Clear all stored tokens
   */
  async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.tokenKey);
      await SecureStore.deleteItemAsync(this.refreshTokenKey);
      this.userId = null;
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * Set current user ID for audit logging
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Perform GET request
   */
  async get<T = any>(
    url: string,
    config?: ApiRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Perform POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Perform PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Perform DELETE request
   */
  async delete<T = any>(
    url: string,
    config?: ApiRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.message || error.response.statusText;
      return new Error(`API Error (${error.response.status}): ${message}`);
    } else if (error.request) {
      // Request made but no response
      return new Error('No response from server');
    } else {
      // Error in request setup
      return new Error(error.message);
    }
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus(): {
    remaining: number;
    limit: number;
  } {
    const clientId = this.userId || 'anonymous';
    const remaining = this.rateLimiter.getRemainingRequests(clientId);
    return {
      remaining,
      limit: 100,
    };
  }
}

// Export singleton instance (to be initialized in app setup)
let apiClientInstance: SecureApiClient | null = null;

export function initializeApiClient(config: SecureApiConfig): SecureApiClient {
  apiClientInstance = new SecureApiClient(config);
  return apiClientInstance;
}

export function getApiClient(): SecureApiClient {
  if (!apiClientInstance) {
    throw new Error('API client not initialized');
  }
  return apiClientInstance;
}

export default SecureApiClient;
