'use client';
import { useState } from 'react';
import { ApiResponse, NestJSError } from '@/types/api';
import { parseErrorMessage } from '@/utils/api/errorMessages';
import { logger } from '@/utils/logger';
import { refreshAccessToken } from '@/utils/api/client';
import { getAccessToken } from '@/utils/cookies';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export function useApiCall<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const call = async (
    endpoint: string,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    const url = endpoint.startsWith('http')
      ? endpoint
      : `${API_BASE_URL}${endpoint}`;

    try {
      // Get access token from cookie
      const accessToken = await getAccessToken();

      const isFormData = options?.body instanceof FormData;

      // Prepare headers with token
      const headers: HeadersInit = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options?.headers,
      };

      // First attempt
      let response = await fetch(url, {
        ...options,
        headers,
      });

      // If unauthorized and we have a token, try to refresh
      if (response.status === 401 && accessToken) {
        logger.info('Token expired, attempting refresh', undefined, {
          endpoint,
          method: options?.method || 'GET',
        });

        // Try to refresh the token
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          // Retry with new token
          const newHeaders: HeadersInit = {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            Authorization: `Bearer ${newAccessToken}`,
            ...options?.headers,
          };

          response = await fetch(url, {
            ...options,
            headers: newHeaders,
          });

          logger.info('Request retried with new token', undefined, {
            endpoint,
            method: options?.method || 'GET',
            status: response.status,
          });
        } else {
          // Refresh failed, redirect to login
          logger.warn('Token refresh failed, redirecting to login', undefined, {
            endpoint,
            method: options?.method || 'GET',
          });

          window.location.href = '/login';
          return {
            success: false,
            error: {
              statusCode: 401,
              message: 'Session expired. Please log in again.',
            },
          };
        }
      }

      // Log API request
      logger.apiRequest(options?.method || 'GET', endpoint, {
        status: response.status,
      });

      // Check if response is successful
      if (response.ok) {
        const responseData: T = await response.json();
        setData(responseData);

        // Log successful response
        logger.apiResponse(
          options?.method || 'GET',
          endpoint,
          response.status,
          undefined,
        );

        return {
          success: true,
          data: responseData,
        };
      } else {
        // Handle error response
        const errorResult: NestJSError = await response.json();
        const errorMessage = parseErrorMessage(errorResult);
        setError(errorMessage);

        // Log API error
        logger.apiResponse(
          options?.method || 'GET',
          endpoint,
          response.status,
          undefined,
        );

        return {
          success: false,
          error: errorResult,
        };
      }
    } catch (err) {
      const errorMessage = 'Network error occurred';
      setError(errorMessage);

      // Log with stack trace for network errors
      const errorData =
        err instanceof Error
          ? JSON.stringify({
              name: err.name,
              message: err.message,
              stack: err.stack,
            })
          : JSON.stringify({ error: String(err) });

      logger.error('API Call Failed', errorData, { endpoint }, true);

      return {
        success: false,
        error: {
          statusCode: 0,
          message: errorMessage,
        },
      };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return { call, loading, error, data, reset };
}
