'use client';
import { useState } from 'react';
import { ApiResponse, NestJSError } from '@/types/api';
import { parseErrorMessage } from '@/utils/api/errorMessages';
import { logger } from '@/utils/logger';

export function useApiCall<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const call = async (
    url: string,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const isFormData = options?.body instanceof FormData;

      const response = await fetch(url, {
        headers: {
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          ...options?.headers,
        },
        ...options,
      });

      // Check if response is successful
      if (response.ok) {
        // NestJS returns data directly on success
        const data: T = await response.json();
        setData(data);
        return {
          success: true,
          data,
        };
      } else {
        // NestJS returns error object with statusCode, message, error
        const errorResult: NestJSError = await response.json();
        const errorMessage = parseErrorMessage(errorResult);
        setError(errorMessage);

        return {
          success: false,
          error: errorResult,
        };
      }
    } catch (err) {
      const errorMessage = 'Network error occured';
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

      logger.error('API Call Failed', errorData, { url }, true);

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
