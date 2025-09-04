import { NextResponse } from 'next/server';
import { ApiResponse, ValidationIssue } from '@/types/api';
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
): NextResponse<ApiResponse> {
  // Log the error with context
  logger.apiError(
    context?.method || 'UNKNOWN',
    context?.endpoint || 'UNKNOWN',
    error,
    {
      userId: context?.userId,
    },
  );

  // Handle known AppError instances
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
        },
      },
      { status: error.statusCode },
    );
  }

  // Handle validation errors from libraries like Zod
  if (error && typeof error === 'object' && 'issues' in error) {
    const validationError = error as ValidationError;
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: {
            issues: validationError.issues,
          },
        },
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
          success: false,
          error: {
            message: 'A record with this information already exists',
            code: 'DUPLICATE_ENTRY',
          },
        },
        { status: 409 },
      );
    }
  }

  // Handle generic errors
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred';

  return NextResponse.json(
    {
      success: false,
      error: {
        message:
          process.env.NODE_ENV === 'development'
            ? message
            : 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
    },
    { status: 500 },
  );
}

export function createSuccessResponse<T>(
  data: T,
  context?: ErrorContext,
): NextResponse<ApiResponse<T>> {
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

  return NextResponse.json({
    success: true,
    data,
  });
}
