'use client';
import { useApiCall } from '@/hooks/useApiCall';
import { OAuthLoginResponse } from '@/schemas/auth';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

const LoginWithGoogle = () => {
  const { call, loading, error, data } = useApiCall<OAuthLoginResponse>();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await call('/auth/oauth/google');

      if (result.success && data) {
        router.push(data.url);
      }

      if (error) {
        logger.error('OAuth Error: ' + error);
        toast.error('Failed to initiate Google login. Please try again.');
      }
    } catch (e) {
      if (e instanceof Error) {
        logger.error('OAuth Exception: ' + e.message);
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Button onClick={handleLogin} disabled={loading}>
      {loading ? 'Loading...' : 'Login with Google'}
    </Button>
  );
};

export default LoginWithGoogle;
