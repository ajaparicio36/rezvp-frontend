import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email().min(1).max(255),
  password: z
    .string()
    .min(6)
    .max(255)
    .refine((val) => /[A-Z]/.test(val), {
      message: 'Password must contain at least one uppercase letter',
    }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const loginResponse = z.object({
  accessToken: z.string().min(1).max(255),
  refreshToken: z.string().min(1).max(255),
  userId: z.string().min(1).max(255),
});

export type LoginResponse = z.infer<typeof loginResponse>;

export const registerSchema = z
  .object({
    email: z.email().min(1).max(255),
    password: z
      .string()
      .min(6)
      .max(255)
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter',
      }),
    confirmPassword: z.string().min(6).max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const registerResponse = z.object({
  accessToken: z.string().min(1).max(255),
  refreshToken: z.string().min(1).max(255),
  userId: z.string().min(1).max(255),
});

export type RegisterResponse = z.infer<typeof registerResponse>;

export const oauthLoginResponse = z.object({
  url: z.string().min(1).max(2048),
});

export type OAuthLoginResponse = z.infer<typeof oauthLoginResponse>;

export const oauthCallbackParams = z.object({
  accessToken: z.string().min(1).max(255),
  refreshToken: z.string().min(1).max(255),
  userId: z.string().min(1).max(255),
});

export type OAuthCallbackParams = z.infer<typeof oauthCallbackParams>;
