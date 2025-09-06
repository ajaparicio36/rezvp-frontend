'use client';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export async function getAccessTokenFromCookie(): Promise<string | null> {
  try {
    // Get token from document.cookie in client-side
    const cookies = document.cookie.split(';');
    const accessTokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('access_token='),
    );

    if (accessTokenCookie) {
      return accessTokenCookie.split('=')[1];
    }
    return null;
  } catch (error) {
    console.error('Error getting access token from cookie:', error);
    return null;
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = getRefreshTokenFromCookie();

    if (!refreshToken) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      // Update cookies via server action
      await updateAuthCookies(
        data.access_token,
        data.refresh_token,
        data.userId,
      );

      return data.access_token;
    }

    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

function getRefreshTokenFromCookie(): string | null {
  try {
    const cookies = document.cookie.split(';');
    const refreshTokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('refresh_token='),
    );

    if (refreshTokenCookie) {
      return refreshTokenCookie.split('=')[1];
    }
    return null;
  } catch (error) {
    console.error('Error getting refresh token from cookie:', error);
    return null;
  }
}

async function updateAuthCookies(
  accessToken: string,
  refreshToken: string,
  userId: string,
) {
  // Call server action to update cookies
  const { setAuthTokens } = await import('@/utils/cookies');
  await setAuthTokens(accessToken, refreshToken, userId);
}
