type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  userId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  [key: string]: string | number | boolean | undefined;
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;
  private logLevel: LogLevel;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };

    return levels[level] <= levels[this.logLevel];
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext,
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private logToConsole(
    level: LogLevel,
    message: string,
    data?: string, // Note: Pass JSON as string - use JSON.stringify() for objects
    context?: LogContext,
    includeStack?: boolean,
  ) {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context);
    const logData = data || '';

    switch (level) {
      case 'error':
        console.error(formattedMessage, logData);
        if (includeStack && data) {
          try {
            const parsedData = JSON.parse(data);
            if (parsedData.stack) {
              console.error('Stack trace:', parsedData.stack);
            }
          } catch {
            // Ignore parsing errors
          }
        }
        break;
      case 'warn':
        console.warn(formattedMessage, logData);
        break;
      case 'info':
        console.info(formattedMessage, logData);
        break;
      case 'debug':
        console.debug(formattedMessage, logData);
        break;
    }
  }

  private async logToExternal(
    level: LogLevel,
    message: string,
    data?: string, // Note: Pass JSON as string - use JSON.stringify() for objects
    context?: LogContext,
    includeStack?: boolean,
  ) {
    // Only log to external services in production for errors and warnings
    if (!this.isProduction || (level !== 'error' && level !== 'warn')) return;

    try {
      // Example: Log to external service (Sentry, LogRocket, etc.)
      // await sendToLogService({
      //   level,
      //   message,
      //   data,
      //   context,
      //   timestamp: new Date().toISOString(),
      //   environment: process.env.NODE_ENV,
      // });
    } catch (error) {
      // Fallback to console if external logging fails
      console.error('Failed to log to external service:', error);
    }
  }

  error(
    message: string,
    data?: string,
    context?: LogContext,
    includeStack?: boolean,
  ) {
    // Note: Pass JSON as string - use JSON.stringify() for objects
    this.logToConsole('error', message, data, context, includeStack);
    this.logToExternal('error', message, data, context, includeStack);
  }

  warn(
    message: string,
    data?: string,
    context?: LogContext,
    includeStack?: boolean,
  ) {
    // Note: Pass JSON as string - use JSON.stringify() for objects
    this.logToConsole('warn', message, data, context, includeStack);
    this.logToExternal('warn', message, data, context, includeStack);
  }

  info(
    message: string,
    data?: string,
    context?: LogContext,
    includeStack?: boolean,
  ) {
    // Note: Pass JSON as string - use JSON.stringify() for objects
    // Only log to console in development for info level
    if (this.isDevelopment) {
      this.logToConsole('info', message, data, context, includeStack);
    }
  }

  debug(
    message: string,
    data?: string,
    context?: LogContext,
    includeStack?: boolean,
  ) {
    // Note: Pass JSON as string - use JSON.stringify() for objects
    // Only log in development for debug level
    if (this.isDevelopment) {
      this.logToConsole('debug', message, data, context, includeStack);
    }
  }

  // API-specific logging methods
  apiRequest(method: string, endpoint: string, context?: LogContext) {
    this.info(`API Request: ${method} ${endpoint}`, undefined, {
      method,
      endpoint,
      ...context,
    });
  }

  apiResponse(
    method: string,
    endpoint: string,
    statusCode: number,
    duration?: number,
    context?: LogContext,
  ) {
    const message = `API Response: ${method} ${endpoint} - ${statusCode}`;
    const logContext = {
      method,
      endpoint,
      statusCode,
      duration: duration ? `${duration}ms` : undefined,
      ...context,
    };

    if (statusCode >= 400) {
      this.error(message, undefined, logContext);
    } else {
      this.info(message, undefined, logContext);
    }
  }

  apiError(
    method: string,
    endpoint: string,
    error: Error | unknown,
    context?: LogContext,
    includeStack: boolean = true, // Default to true for API errors
  ) {
    const errorData =
      error instanceof Error
        ? JSON.stringify({
            name: error.name,
            message: error.message,
            stack: error.stack,
          })
        : JSON.stringify({ error: String(error) });

    this.error(
      `API Error: ${method} ${endpoint}`,
      errorData,
      {
        method,
        endpoint,
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        ...context,
      },
      includeStack,
    );
  }
}

// Export singleton instance
export const logger = new Logger();
