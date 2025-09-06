'use client';

import { clearAuthTokens, setAuthTokens } from '@/utils/cookies';

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  userId: string;
}

export async function saveAuthTokens(tokens: AuthTokens) {
  try {
    await setAuthTokens(
      tokens.access_token,
      tokens.refresh_token,
      tokens.userId,
    );
  } catch (error) {
    console.error('Error saving auth tokens:', error);
    throw new Error('Failed to save authentication tokens');
  }
}

export async function clearUserSession() {
  try {
    await clearAuthTokens();
    // Redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error('Error clearing user session:', error);
    // Force redirect even if clearing cookies fails
    window.location.href = '/login';
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    // Decode JWT token (basic implementation)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp < currentTime;
  } catch (error) {
    // If we can't decode the token, consider it expired
    return true;
  }
}

export function getTokenExpiry(token: string): Date | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return new Date(payload.exp * 1000);
  } catch (error) {
    return null;
  }
}
