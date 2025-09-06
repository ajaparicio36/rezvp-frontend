import { NestJSError } from '@/types/api';

export function parseErrorMessage(error?: NestJSError): string {
  if (!error) return 'An unexpected error occured.';

  // Map NestJS error types and status codes to user-friendly messages
  const errorMap: Record<string, string> = {
    'Bad Request': 'The request was invalid or cannot be served.',
    Unauthorized: 'You are not authorized to perform this action.',
    Forbidden: 'You do not have permission to access this resource.',
    'Not Found': 'The requested resource was not found.',
    Conflict: 'The resource already exists.',
    'Internal Server Error':
      'Something went wrong on our end. Please try again.',
  };

  const statusCodeMap: Record<number, string> = {
    400: 'Please check your input and try again.',
    401: 'You are not authorized to perform this action.',
    403: 'You do not have permission to access this resource.',
    404: 'The requested resource was not found.',
    409: 'The resource already exists.',
    422: 'Please check your input and try again.',
    500: 'Something went wrong on our end. Please try again.',
  };

  // Check for specific error type first
  if (error.error && errorMap[error.error]) {
    return errorMap[error.error];
  }

  // Check status code mapping
  if (error.statusCode && statusCodeMap[error.statusCode]) {
    return statusCodeMap[error.statusCode];
  }

  // Fallback to the message from the server
  return error.message || 'An unexpected error occurred.';
}
