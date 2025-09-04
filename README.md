# 🚀 NextJS API Hook + Logger

A modern Next.js application with robust API handling, comprehensive error management, and structured logging capabilities.

## ✨ Features

- **🔄 Smart API Calls** - Custom hook for handling API requests with built-in loading states and error handling
- **🛡️ Error Management** - Comprehensive error handling with custom error classes and user-friendly messages
- **📝 Structured Logging** - Advanced logging system with different levels and external service integration
- **🎨 Type Safety** - Full TypeScript support with proper type definitions
- **⚡ Next.js 14** - Latest Next.js with App Router and server components

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** (Add your styling solution)
- **State Management:** React Hooks
- **HTTP Client:** Fetch API with custom wrapper
- **Logging:** Custom logger with console and external service support

## 📁 Project Structure

```
src/
├── hooks/
│   └── useApiCall.ts          # Custom API call hook
├── types/
│   ├── api.ts                 # API response types
│   └── errors.ts              # Custom error classes
└── utils/
    ├── api/
    │   ├── errorHandler.ts    # API error handling utilities
    │   └── errorMessages.ts   # User-friendly error messages
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

# Logging Configuration
LOG_LEVEL=info                         # error | warn | info | debug

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
# Add your API base URL here

# Database (if using)
# DATABASE_URL=postgresql://user:password@localhost:5432/database

# Authentication (if using)
# NEXTAUTH_SECRET=your-secret-key
# NEXTAUTH_URL=http://localhost:3000

# External Services
# SENTRY_DSN=your-sentry-dsn            # For error tracking
# LOGROCKET_APP_ID=your-logrocket-id    # For session recording
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

### Using the API Call Hook

```typescript
import { useApiCall } from '@/hooks/useApiCall';

function MyComponent() {
  const { call, loading, error, data } = useApiCall<UserData>();

  const fetchUser = async () => {
    const result = await call('/api/users/1', {
      method: 'GET',
    });

    if (result.success) {
      console.log('User data:', result.data);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <p>Welcome, {data.name}!</p>}
      <button onClick={fetchUser}>Fetch User</button>
    </div>
  );
}
```

### Creating API Routes with Error Handling

```typescript
// app/api/example/route.ts
import { NextRequest } from 'next/server';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/api/errorHandler';
import { ValidationError } from '@/types/errors';

export async function GET(request: NextRequest) {
  try {
    // Your API logic here
    const data = { message: 'Hello World' };

    return createSuccessResponse(data, {
      method: 'GET',
      endpoint: '/api/example',
    });
  } catch (error) {
    return createErrorResponse(error, {
      method: 'GET',
      endpoint: '/api/example',
    });
  }
}
```

### Using the Logger

```typescript
import { logger } from '@/utils/logger';

// Log different levels
logger.info('Application started');
logger.warn('This is a warning');
logger.error('An error occurred', JSON.stringify(errorData));

// API-specific logging
logger.apiRequest('GET', '/api/users');
logger.apiResponse('GET', '/api/users', 200, 150);
logger.apiError('POST', '/api/users', error);
```

## 🔍 Error Handling

The application includes comprehensive error handling:

- **Custom Error Classes**: `AppError`, `ValidationError`, `NotFoundError`, etc.
- **User-Friendly Messages**: Automatic conversion of technical errors to user-friendly messages
- **Structured Logging**: All errors are logged with context and stack traces
- **Type Safety**: Full TypeScript support for error handling

## 📊 Logging

The logging system supports:

- **Multiple Levels**: Error, Warn, Info, Debug
- **Context**: Additional metadata for each log entry
- **Environment-Aware**: Different behavior in development vs production
- **External Integration**: Ready for services like Sentry, LogRocket, etc.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms

This Next.js application can be deployed to any platform that supports Node.js. Check the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Antonio Aparicio**

- GitHub: [@ajaparicio36](https://github.com/ajaparicio36)

---

Built with ❤️ using Next.js and TypeScript
