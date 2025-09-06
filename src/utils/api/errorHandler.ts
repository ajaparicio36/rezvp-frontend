import { NextResponse } from 'next/server';
import { ValidationIssue, NestJSError } from '@/types/api';
import { AppError } from '@/types/errors';
import { logger } from '@/utils/logger';

interface ErrorContext {
  method?: string;
  endpoint?: string;
  userId?: string;
}

interface DatabaseError {
  code: string;
  message: string;
}

interface ValidationError {
  issues: ValidationIssue[];
}

export function createErrorResponse(
  error: unknown,
  context?: ErrorContext,
): NextResponse<NestJSError> {
  // Log the error with context and stack trace
  logger.apiError(
    context?.method || 'UNKNOWN',
    context?.endpoint || 'UNKNOWN',
    error,
    {
      userId: context?.userId,
    },
    true, // Include stack trace for error logging
  );

  // Handle known AppError instances
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        statusCode: error.statusCode,
        message: error.message,
        error: error.code || getErrorTypeFromStatus(error.statusCode),
      },
      { status: error.statusCode },
    );
  }

  // Handle validation errors from libraries like Zod
  if (error && typeof error === 'object' && 'issues' in error) {
    return NextResponse.json(
      {
        statusCode: 400,
        message: 'Validation failed',
        error: 'Bad Request',
      },
      { status: 400 },
    );
  }

  // Handle database errors (Prisma example)
  if (error && typeof error === 'object' && 'code' in error) {
    const dbError = error as DatabaseError;

    if (dbError.code === 'P2002') {
      return NextResponse.json(
        {
          statusCode: 409,
          message: 'A record with this information already exists',
          error: 'Conflict',
        },
        { status: 409 },
      );
    }
  }

  // Handle generic errors
  const message =
    error instanceof Error ? error.message : 'Internal server error';

  return NextResponse.json(
    {
      statusCode: 500,
      message:
        process.env.NODE_ENV === 'development'
          ? message
          : 'Internal server error',
      error: 'Internal Server Error',
    },
    { status: 500 },
  );
}

export function createSuccessResponse<T>(
  data: T,
  context?: ErrorContext,
): NextResponse<T> {
  // Log successful response
  if (context) {
    logger.apiResponse(
      context.method || 'UNKNOWN',
      context.endpoint || 'UNKNOWN',
      200,
      undefined,
      { userId: context.userId },
    );
  }

  // Return data directly like NestJS does
  return NextResponse.json(data);
}

function getErrorTypeFromStatus(statusCode: number): string {
  const errorTypes: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
  };

  return errorTypes[statusCode] || 'Unknown Error';
}
