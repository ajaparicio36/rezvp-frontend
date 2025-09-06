// ZodIssue type definition for validation errors
export interface ValidationIssue {
  code: string;
  message: string;
  path: (string | number)[];
  expected?: string;
  received?: string;
}

export interface ErrorDetails {
  message?: string;
  issues?: ValidationIssue[];
  [key: string]: string | number | boolean | ValidationIssue[] | undefined;
}

// NestJS returns data directly on success, not wrapped in ApiResponse
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: NestJSError;
}

// NestJS error format
export interface NestJSError {
  statusCode: number;
  message: string;
  error?: string; // Error type like "Unauthorized", "Bad Request"
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  details?: ErrorDetails;
}
