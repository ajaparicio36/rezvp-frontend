import React from 'react';
import LoginCard from '@/components/login/LoginCard';
import Image from 'next/image';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Logo */}
      <div className="flex justify-center pt-8 pb-4">
        <div className="w-32 h-auto">
          <Image
            src="/logos/fullLogo.png"
            alt="Logo"
            width={128}
            height={48}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <LoginCard />
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <a
            href="/register"
            className="font-medium text-primary hover:underline transition-colors"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
