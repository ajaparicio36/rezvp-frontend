import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import LoginForm from './LoginForm';

const LoginCard = () => {
  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-lg">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <LoginForm />
      </CardContent>
    </Card>
  );
};

export default LoginCard;
