'use client';
import { useApiCall } from '@/hooks/useApiCall';
import { LoginInput, LoginResponse, loginSchema } from '@/schemas/auth';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { setAuthTokens } from '@/utils/cookies';
import LoginWithGoogle from './LoginWithGoogle';

const LoginForm = () => {
  const { call, loading, error, data } = useApiCall<LoginResponse>();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      const result = await call('/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      if (result.success && data) {
        toast.success('Login successful!');

        setAuthTokens(data.accessToken, data.refreshToken, data.userId);
      }
    } catch (e) {
      if (e instanceof Error) {
        logger.error('Login Exception: ' + e.message);
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <LoginWithGoogle />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-2">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
