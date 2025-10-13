/**
 * Rate Limiter for API endpoints
 *
 * Simple in-memory rate limiting for serverless functions.
 * For production with multiple instances, consider Redis/Upstash.
 *
 * Usage:
 * ```typescript
 * const limiter = createRateLimiter({ requests: 5, window: 60 });
 * const { success, remaining, reset } = await limiter.check(identifier);
 * if (!success) {
 *   return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
 * }
 * ```
 */

interface RateLimitConfig {
  requests: number; // Number of requests allowed
  window: number; // Time window in seconds
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // Unix timestamp when limit resets
}

// In-memory storage for rate limit data
// Key format: "identifier:endpoint"
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Clean up expired entries every 5 minutes
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Create a rate limiter instance
 */
export function createRateLimiter(config: RateLimitConfig) {
  return {
    /**
     * Check if request is allowed
     * @param identifier Unique identifier (IP, user ID, email, etc.)
     * @returns Rate limit result
     */
    async check(identifier: string): Promise<RateLimitResult> {
      const now = Date.now();
      const key = identifier;
      const windowMs = config.window * 1000;

      // Get or create rate limit entry
      let entry = rateLimitStore.get(key);

      // If entry doesn't exist or has expired, create new one
      if (!entry || entry.resetAt < now) {
        entry = {
          count: 1,
          resetAt: now + windowMs,
        };
        rateLimitStore.set(key, entry);

        return {
          success: true,
          remaining: config.requests - 1,
          reset: entry.resetAt,
        };
      }

      // Check if limit exceeded
      if (entry.count >= config.requests) {
        return {
          success: false,
          remaining: 0,
          reset: entry.resetAt,
        };
      }

      // Increment count
      entry.count++;
      rateLimitStore.set(key, entry);

      return {
        success: true,
        remaining: config.requests - entry.count,
        reset: entry.resetAt,
      };
    },

    /**
     * Reset rate limit for specific identifier (useful for testing)
     */
    async reset(identifier: string): Promise<void> {
      rateLimitStore.delete(identifier);
    },
  };
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const rateLimiters = {
  // Password reset request - 3 requests per 15 minutes
  passwordReset: createRateLimiter({ requests: 3, window: 15 * 60 }),

  // Password reset verification - 5 attempts per 10 minutes
  passwordResetVerify: createRateLimiter({ requests: 5, window: 10 * 60 }),

  // Email verification send - 1 request per 30 seconds
  emailVerificationSend: createRateLimiter({ requests: 1, window: 30 }),

  // Email verification verify - 5 attempts per 10 minutes
  emailVerificationVerify: createRateLimiter({ requests: 5, window: 10 * 60 }),

  // Account deletion - 3 attempts per hour
  accountDeletion: createRateLimiter({ requests: 3, window: 60 * 60 }),

  // Login attempts - 5 attempts per 15 minutes
  login: createRateLimiter({ requests: 5, window: 15 * 60 }),

  // Registration - 3 accounts per hour per IP
  registration: createRateLimiter({ requests: 3, window: 60 * 60 }),

  // Password change - 5 attempts per hour
  passwordChange: createRateLimiter({ requests: 5, window: 60 * 60 }),
};

/**
 * Get client identifier from request
 * Uses IP address or user ID depending on context
 */
export function getClientIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Try to get IP from various headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  const ip = forwarded?.split(",")[0] || realIp || cfConnectingIp || "unknown";

  return `ip:${ip}`;
}

/**
 * Helper to add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: Response,
  result: RateLimitResult,
): Response {
  const headers = new Headers(response.headers);
  headers.set("X-RateLimit-Limit", String(result.remaining + 1));
  headers.set("X-RateLimit-Remaining", String(result.remaining));
  headers.set("X-RateLimit-Reset", String(result.reset));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
