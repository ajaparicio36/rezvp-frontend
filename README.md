# 🚀 NextJS API Hook + Logger

A modern Next.js application with robust API handling, comprehensive error management, structured logging capabilities, and automatic token management with cookie-based authentication.

## ✨ Features

- **🔄 Smart API Calls** - Custom hook for handling API requests with automatic token refresh and retry logic
- **🍪 Cookie Management** - Server-side cookie utilities for secure token storage
- **🛡️ Middleware Protection** - Automatic route protection and token refresh
- **🛡️ Error Management** - Comprehensive error handling with custom error classes and user-friendly messages
- **📝 Structured Logging** - Advanced logging system with different levels and external service integration
- **👤 User Context Management** - Centralized user and business data management with automatic fetching
- **🎨 Type Safety** - Full TypeScript support with proper type definitions
- **⚡ Next.js 14** - Latest Next.js with App Router and server components

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Authentication:** Token-based with automatic refresh
- **State Management:** React Context for user data
- **Cookies:** Secure HTTP-only cookies
- **HTTP Client:** Fetch API with custom wrapper
- **Logging:** Custom logger with console and external service support

## 📁 Project Structure

```
src/
├── contexts/
│   └── UserContext.tsx        # User and business data context provider
├── hooks/
│   ├── useApiCall.ts          # Custom API call hook with token management
│   └── useUser.ts             # User context hooks for components
├── middleware.ts              # Route protection and token refresh
├── types/
│   ├── api.ts                 # API response types
│   ├── errors.ts              # Custom error classes
│   └── user.ts                # User and business type definitions
└── utils/
    ├── api/
    │   ├── client.ts          # Client-side API utilities
    │   ├── errorHandler.ts    # API error handling utilities
    │   └── errorMessages.ts   # User-friendly error messages
    ├── auth.ts                # Authentication utilities
    ├── cookies.ts             # Server-side cookie management
    └── logger.ts              # Structured logging system
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nextjs-hook-logger-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

```bash
# Application Environment
NODE_ENV=development                    # development | production | test

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001  # Your NestJS backend URL

# Logging Configuration
LOG_LEVEL=info                         # error | warn | info | debug
```

### Optional Variables

```bash
# External Logging Services
EXTERNAL_LOG_ENDPOINT=                 # Your external logging service endpoint
EXTERNAL_LOG_API_KEY=                  # API key for external logging service

# Performance Monitoring
VERCEL_ANALYTICS_ID=                   # Vercel Analytics ID (if deploying to Vercel)

# Feature Flags
ENABLE_DEBUG_MODE=false                # Enable additional debug information
```

## 📚 Usage Examples

### User Context & Data Management

The application provides a comprehensive user context system for managing user and business data across your app.

#### Setting Up the Provider

First, wrap your app with the UserProvider:

```typescript
// app/layout.tsx
import { UserProvider } from '@/contexts/UserContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
```

#### Using User Data in Components

```typescript
import { useUser, useBusiness, useUserData } from '@/hooks/useUser';

// For user-specific data
function UserProfile() {
  const {
    user,
    loading,
    error,
    isAuthenticated,
    fullName,
    displayName,
    refreshUser
  } = useUser();

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome, {displayName}!</h1>
      <p>Full name: {fullName}</p>
      <p>Email: {user?.email}</p>
      <button onClick={refreshUser}>Refresh Profile</button>
    </div>
  );
}

// For business-specific data
function BusinessDashboard() {
  const {
    business,
    loading,
    error,
    hasBusiness,
    isVerified,
    subscriptionStatus,
    businessName,
    refreshBusiness,
  } = useBusiness();

  if (loading) return <div>Loading business...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!hasBusiness) return <div>No business profile found</div>;

  return (
    <div>
      <h1>{businessName}</h1>
      <p>Status: {subscriptionStatus}</p>
      <p>Verified: {isVerified ? 'Yes' : 'No'}</p>
      <button onClick={refreshBusiness}>Refresh Business</button>
    </div>
  );
}

// For combined user and business data
function OnboardingFlow() {
  const {
    user,
    business,
    loading,
    isAuthenticated,
    needsOnboarding,
    refreshAll,
  } = useUserData();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please authenticate</div>;

  if (needsOnboarding) {
    return (
      <div>
        <h2>Complete Your Setup</h2>
        {!user && <p>Please complete your profile</p>}
        {!business && <p>Please set up your business</p>}
        <button onClick={refreshAll}>Check Again</button>
      </div>
    );
  }

  return <div>Setup complete! Welcome to the dashboard.</div>;
}
```

#### Advanced Context Usage

```typescript
import { useUserContext } from '@/contexts/UserContext';

function AdminPanel() {
  const {
    user,
    business,
    loading,
    error,
    refreshUser,
    refreshBusiness,
    refreshAll,
    clearData
  } = useUserContext();

  const handleLogout = async () => {
    // Clear all context data
    clearData();

    // Redirect to login
    window.location.href = '/login';
  };

  const handleRefreshAll = async () => {
    await refreshAll();
    console.log('All data refreshed');
  };

  return (
    <div>
      <h1>Admin Panel</h1>

      {/* User section */}
      <section>
        <h2>User Information</h2>
        {user ? (
          <div>
            <p>Name: {user.firstName} {user.lastName}</p>
            <p>Email: {user.email}</p>
            <button onClick={refreshUser}>Refresh User</button>
          </div>
        ) : (
          <p>No user data</p>
        )}
      </section>

      {/* Business section */}
      <section>
        <h2>Business Information</h2>
        {business ? (
          <div>
            <p>Business: {business.businessName}</p>
            <p>Type: {business.businessType}</p>
            <p>Verified: {business.isVerified ? 'Yes' : 'No'}</p>
            <button onClick={refreshBusiness}>Refresh Business</button>
          </div>
        ) : (
          <p>No business data</p>
        )}
      </section>

      {/* Actions */}
      <div>
        <button onClick={handleRefreshAll} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh All Data'}
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
}
```

#### Conditional Rendering with User State

```typescript
import { useUserData } from '@/hooks/useUser';

function AppContent() {
  const { isAuthenticated, hasProfile, hasBusiness, needsOnboarding } = useUserData();

  // Show loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show onboarding for incomplete profiles
  if (needsOnboarding) {
    return <OnboardingFlow />;
  }

  // Show main app for complete profiles
  return <MainDashboard />;
}

function NavigationMenu() {
  const { user, business, hasBusiness } = useUserData();

  return (
    <nav>
      <ul>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/profile">Profile</Link></li>

        {/* Business-specific navigation */}
        {hasBusiness && (
          <>
            <li><Link href="/business">Business Settings</Link></li>
            <li><Link href="/business/profile">Business Profile</Link></li>
          </>
        )}

        {/* Admin navigation for verified businesses */}
        {business?.isVerified && (
          <li><Link href="/admin">Admin Panel</Link></li>
        )}
      </ul>

      {/* User info */}
      <div>
        Welcome, {user?.firstName}
        {hasBusiness && <span> | {business?.businessName}</span>}
      </div>
    </nav>
  );
}
```

### Authentication Flow

```typescript
import { useApiCall } from '@/hooks/useApiCall';
import { saveAuthTokens, clearUserSession } from '@/utils/auth';

function LoginComponent() {
  const { call, loading, error } = useApiCall();

  const handleLogin = async (email: string, password: string) => {
    const result = await call('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.success) {
      // Tokens are automatically saved to secure cookies
      await saveAuthTokens({
        access_token: result.data.access_token,
        refresh_token: result.data.refresh_token,
        userId: result.data.userId,
      });

      window.location.href = '/dashboard';
    }
  };

  const handleLogout = async () => {
    await call('/auth/signout', { method: 'POST' });
    await clearUserSession();
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {/* Your login form */}
    </div>
  );
}
```

### Protected API Calls

The `useApiCall` hook automatically handles authentication:

```typescript
import { useApiCall } from '@/hooks/useApiCall';

function UserProfile() {
  const { call, loading, error, data } = useApiCall<UserData>();

  const fetchUserProfile = async () => {
    // Token is automatically included and refreshed if needed
    const result = await call('/api/profile');

    if (result.success) {
      console.log('Profile:', result.data);
    }
  };

  const updateProfile = async (profileData: Partial<UserData>) => {
    const result = await call('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    if (result.success) {
      console.log('Profile updated');
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <div>Welcome, {data.name}!</div>}
    </div>
  );
}
```

### Cookie Management

Server-side cookie operations (use in server components or API routes):

```typescript
import {
  getAccessToken,
  setAuthTokens,
  clearAuthTokens,
  hasValidTokens,
} from '@/utils/cookies';

// In a server component or API route
export async function GET() {
  const accessToken = await getAccessToken();
  const hasTokens = await hasValidTokens();

  if (!hasTokens) {
    redirect('/login');
  }

  // Use token for API calls
  return Response.json({ authenticated: true });
}

// Save tokens after successful authentication
await setAuthTokens(accessToken, refreshToken, userId);

// Clear tokens on logout
await clearAuthTokens();
```

## 🛡️ Middleware & Route Protection

The application includes automatic middleware that:

- **Protects Routes**: Redirects unauthenticated users from protected routes
- **Refreshes Tokens**: Automatically refreshes expired access tokens
- **Manages Redirects**: Redirects authenticated users away from auth pages

### Protected Routes Configuration

```typescript
// In middleware.ts
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings'];
const AUTH_ROUTES = ['/login', '/register', '/auth'];
```

### How It Works

1. **Token Check**: Middleware checks for access and refresh tokens
2. **Auto Refresh**: If access token is expired but refresh token exists, automatically refreshes
3. **Route Protection**: Redirects unauthorized users to login
4. **Auth Redirect**: Redirects already authenticated users away from login pages

### Manual Token Refresh

```typescript
import { refreshAccessToken } from '@/utils/api/client';

// Manually refresh token (usually handled automatically)
const newToken = await refreshAccessToken();
if (newToken) {
  console.log('Token refreshed successfully');
} else {
  console.log('Refresh failed, redirect to login');
}
```

## 🍪 Cookie Security

All authentication cookies are configured with:

- **HttpOnly**: Cannot be accessed via JavaScript
- **Secure**: Only sent over HTTPS in production
- **SameSite**: CSRF protection
- **Proper Expiration**: Access tokens (1 hour), Refresh tokens (7 days)

## 🔍 Error Handling

The application includes comprehensive error handling:

- **Automatic Retry**: Failed requests due to expired tokens are automatically retried
- **User-Friendly Messages**: Technical errors converted to readable messages
- **Session Management**: Automatic logout on authentication failures
- **Structured Logging**: All errors logged with context

## 📊 Logging

API calls are automatically logged:

```typescript
// Automatic logging in useApiCall
logger.apiRequest('POST', '/api/users');
logger.apiResponse('POST', '/api/users', 201, 150);
logger.apiError('POST', '/api/users', error);
```

## 🚀 Deployment

### Environment Variables for Production

```bash
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
LOG_LEVEL=warn
```

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**AJ Aparicio**

- GitHub: [@ajaparicio36](https://github.com/ajaparicio36)

---

Built with ❤️ using Next.js, TypeScript, and secure authentication patterns
