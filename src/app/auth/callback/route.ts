import { oauthCallbackParams } from '@/schemas/auth';
import { setAuthTokens } from '@/utils/cookies';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  request: NextRequest,
  {
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  },
) => {
  try {
    const { accessToken, refreshToken, userId } = await searchParams;

    const validatedParams = oauthCallbackParams.safeParse({
      accessToken,
      refreshToken,
      userId,
    });

    if (!validatedParams.success) {
      logger.error(
        'OAuth Callback Validation Error: ' +
          JSON.stringify(validatedParams.error.issues),
      );
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 },
      );
    }

    await setAuthTokens(
      validatedParams.data.accessToken,
      validatedParams.data.refreshToken,
      validatedParams.data.userId,
    );

    return NextResponse.redirect(new URL('/', request.url));
  } catch (e) {
    logger.error('OAuth Callback Error: ' + e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
};
