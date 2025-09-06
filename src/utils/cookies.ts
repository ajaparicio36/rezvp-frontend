'use server';

import { COOKIE_NAMES, COOKIE_OPTIONS } from '@/types/cookies';
import { cookies } from 'next/headers';

const cookieStore = await cookies();

export async function setAccessToken(token: string) {
  cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, token, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60, // 1 hour
  });
}

export async function setRefreshToken(token: string) {
  cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, token, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function setUserId(userId: string) {
  cookieStore.set(COOKIE_NAMES.USER_ID, userId, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getAccessToken(): Promise<string | undefined> {
  return cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  return cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
}

export async function getUserId(): Promise<string | undefined> {
  return cookieStore.get(COOKIE_NAMES.USER_ID)?.value;
}

export async function setAuthTokens(
  accessToken: string,
  refreshToken: string,
  userId: string,
) {
  await Promise.all([
    setAccessToken(accessToken),
    setRefreshToken(refreshToken),
    setUserId(userId),
  ]);
}

export async function clearAuthTokens() {
  cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
  cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
  cookieStore.delete(COOKIE_NAMES.USER_ID);
}

export async function hasValidTokens(): Promise<boolean> {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();
  return !!(accessToken && refreshToken);
}
