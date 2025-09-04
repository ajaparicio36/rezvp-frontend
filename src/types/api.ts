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

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: ErrorDetails;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  details?: ErrorDetails;
}
