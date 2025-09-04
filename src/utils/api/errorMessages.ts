import { ErrorDetails } from '@/types/api';

export function parseErrorMessage(error?: {
  message: string;
  code?: string;
  details?: ErrorDetails;
}): string {
  if (!error) return 'An unexpected error occured.';

  const errorMap: Record<string, string> = {
    VALIDATION_ERROR: 'Please check your input and try again.',
    BAD_REQUEST: 'The request was invalid or cannot be served.',
    NOT_FOUND: 'The requested resource was not found.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    DUPLICATE_ENTRY: 'The resource already exists.',
    FORBIDDEN: 'You do not have permission to access this resource.',
    NETWORK_ERROR: 'Please check your internet connection and try again.',
    INTERNAL_ERROR: 'Something went wrong on our end. Please try again.',
    GOOGLE_AUTH_ERROR: 'Google authentication failed. Please try again.',
  };

  if (error.code && errorMap[error.code]) {
    return errorMap[error.code];
  }

  return error.message;
}
