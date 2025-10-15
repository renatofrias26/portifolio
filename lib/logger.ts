/**
 * Centralized logging utility for Upfolio
 * Integrates with Sentry for error tracking and event monitoring
 */

import * as Sentry from "@sentry/nextjs";

export enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  DEBUG = "debug",
}

export enum EventType {
  // User Events
  USER_SIGNUP = "user.signup",
  USER_LOGIN = "user.login",
  USER_LOGOUT = "user.logout",
  USER_DELETE = "user.delete",
  EMAIL_VERIFIED = "user.email_verified",
  PASSWORD_RESET = "user.password_reset",

  // Resume Events
  RESUME_UPLOAD = "resume.upload",
  RESUME_PARSE_START = "resume.parse.start",
  RESUME_PARSE_SUCCESS = "resume.parse.success",
  RESUME_PARSE_ERROR = "resume.parse.error",
  RESUME_ENHANCE_START = "resume.enhance.start",
  RESUME_ENHANCE_SUCCESS = "resume.enhance.success",
  RESUME_ENHANCE_ERROR = "resume.enhance.error",

  // Profile Events
  PROFILE_PUBLISH = "profile.publish",
  PROFILE_UNPUBLISH = "profile.unpublish",
  PROFILE_VIEW = "profile.view",
  PROFILE_MADE_PUBLIC = "profile.made_public",
  PROFILE_MADE_PRIVATE = "profile.made_private",

  // Job Assistant Events
  JOB_SEARCH = "job.search",
  JOB_SAVE = "job.save",
  JOB_APPLY = "job.apply",
  JOB_FIT_ANALYSIS = "job.fit_analysis",

  // AI Events
  AI_CHAT_MESSAGE = "ai.chat.message",
  AI_ERROR = "ai.error",

  // System Events
  DATABASE_ERROR = "system.database_error",
  API_ERROR = "system.api_error",
  RATE_LIMIT_EXCEEDED = "system.rate_limit_exceeded",
}

interface LogContext {
  userId?: string;
  username?: string;
  email?: string;
  metadata?: Record<string, unknown>;
  error?: Error | unknown;
}

class Logger {
  /**
   * Log an informational message
   */
  info(message: string, context?: LogContext) {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: LogContext) {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an error
   */
  error(message: string, context?: LogContext) {
    this.log(LogLevel.ERROR, message, context);

    // Send errors to Sentry
    if (context?.error) {
      Sentry.captureException(context.error, {
        contexts: {
          user: context.userId
            ? {
                id: context.userId,
                username: context.username,
                email: context.email,
              }
            : undefined,
          metadata: context.metadata,
        },
        tags: {
          message,
        },
      });
    } else {
      Sentry.captureMessage(message, {
        level: "error",
        contexts: {
          user: context?.userId
            ? {
                id: context.userId,
                username: context.username,
                email: context.email,
              }
            : undefined,
          metadata: context?.metadata,
        },
      });
    }
  }

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === "development") {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  /**
   * Track a specific event (sent to Sentry as breadcrumbs)
   */
  event(eventType: EventType, context?: LogContext) {
    const message = `Event: ${eventType}`;

    // Add breadcrumb to Sentry
    Sentry.addBreadcrumb({
      category: eventType.split(".")[0],
      message: eventType,
      level: "info",
      data: context?.metadata,
    });

    // Set user context if available
    if (context?.userId) {
      Sentry.setUser({
        id: context.userId,
        username: context.username,
        email: context.email,
      });
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[${new Date().toISOString()}] [EVENT] ${eventType}`,
        context?.metadata || {},
      );
    }

    // In production, you could also send to analytics service
    // Example: PostHog, Mixpanel, etc.
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      userId: context?.userId,
      username: context?.username,
      metadata: context?.metadata,
    };

    // Console output (always)
    const consoleMethod =
      level === LogLevel.ERROR ? console.error : console.log;
    consoleMethod(`[${timestamp}] [${level.toUpperCase()}] ${message}`, {
      ...logData,
      error: context?.error,
    });

    // Add to Sentry breadcrumbs (except for errors, which are captured separately)
    if (level !== LogLevel.ERROR) {
      Sentry.addBreadcrumb({
        category: "log",
        message,
        level: level as Sentry.SeverityLevel,
        data: context?.metadata,
      });
    }
  }

  /**
   * Measure performance of an operation
   */
  async measurePerformance<T>(
    operationName: string,
    operation: () => Promise<T>,
    context?: LogContext,
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await operation();
      const duration = Date.now() - startTime;

      this.info(`${operationName} completed`, {
        ...context,
        metadata: {
          ...context?.metadata,
          duration_ms: duration,
        },
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.error(`${operationName} failed`, {
        ...context,
        error,
        metadata: {
          ...context?.metadata,
          duration_ms: duration,
        },
      });

      throw error;
    }
  }
}

// Export singleton instance
export const logger = new Logger();
