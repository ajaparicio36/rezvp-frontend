import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings'];

// Routes that should redirect to dashboard if user is authenticated
const AUTH_ROUTES = ['/login', '/register', '/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // If no tokens exist and trying to access protected route
  if (!accessToken && !refreshToken && isProtectedRoute(pathname)) {
    logger.info('Redirecting to login - no tokens found', undefined, {
      path: pathname,
    });
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If tokens exist and trying to access auth routes
  if (accessToken && isAuthRoute(pathname)) {
    logger.info(
      'Redirecting to dashboard - user already authenticated',
      undefined,
      {
        path: pathname,
      },
    );
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If no access token but refresh token exists, try to refresh
  if (!accessToken && refreshToken) {
    logger.info('Attempting token refresh', undefined, {
      path: pathname,
    });

    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();

        const response = NextResponse.next();

        // Set new tokens in cookies
        response.cookies.set('access_token', data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60, // 1 hour
          path: '/',
        });

        response.cookies.set('refresh_token', data.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });

        response.cookies.set('user_id', data.userId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });

        logger.info('Token refresh successful', undefined, {
          path: pathname,
          userId: data.userId,
        });

        return response;
      } else {
        // Refresh failed, clear tokens and redirect to login if on protected route
        logger.warn('Token refresh failed', undefined, {
          path: pathname,
          status: refreshResponse.status,
        });

        if (isProtectedRoute(pathname)) {
          const response = NextResponse.redirect(
            new URL('/login', request.url),
          );
          clearAuthCookies(response);
          return response;
        }
      }
    } catch (error) {
      logger.error(
        'Token refresh error',
        JSON.stringify({
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        }),
        {
          path: pathname,
        },
      );

      if (isProtectedRoute(pathname)) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        clearAuthCookies(response);
        return response;
      }
    }
  }

  return NextResponse.next();
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete('access_token');
  response.cookies.delete('refresh_token');
  response.cookies.delete('user_id');
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
