/**
 * Centralized Error Telemetry and Sentry Integration Module.
 * Redacts guest PII, passwords, HMAC signatures, and JWT tokens before shipping errors to Sentry.
 */

export interface ErrorContext {
  eventId?: string;
  route?: string;
  userId?: string;
  role?: string;
  [key: string]: any;
}

/** Redacts sensitive PII (phone numbers, tokens, secrets, passwords) from objects. */
export function sanitizeContext(ctx?: Record<string, any>): Record<string, any> {
  if (!ctx) return {};
  const clean: Record<string, any> = {};

  for (const [key, val] of Object.entries(ctx)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('phone') ||
      lowerKey.includes('password') ||
      lowerKey.includes('secret') ||
      lowerKey.includes('token') ||
      lowerKey.includes('sig') ||
      lowerKey.includes('authorization')
    ) {
      clean[key] = '[REDACTED_PII]';
    } else if (typeof val === 'object' && val !== null) {
      clean[key] = sanitizeContext(val);
    } else {
      clean[key] = val;
    }
  }

  return clean;
}

/** Mask phone numbers for logging (e.g. +251911223344 -> +251***3344). */
export function maskPhone(phone?: string | null): string {
  if (!phone) return '';
  const str = phone.trim();
  if (str.length <= 4) return '***';
  return str.slice(0, 3) + '***' + str.slice(-4);
}

/**
 * Capture exceptions with sanitized event context.
 * Delegates to Sentry if SENTRY_DSN is configured, or logs sanitized error in dev.
 */
export function captureException(error: unknown, context?: ErrorContext): void {
  const sanitizedCtx = sanitizeContext(context);
  const err = error instanceof Error ? error : new Error(String(error));

  if (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      // Dynamic require of @sentry/nextjs if installed in runtime
      const sentry = eval('require')('@sentry/nextjs');
      sentry.withScope((scope: any) => {
        if (sanitizedCtx.eventId) scope.setTag('event_id', sanitizedCtx.eventId);
        if (sanitizedCtx.route) scope.setTag('route', sanitizedCtx.route);
        if (sanitizedCtx.role) scope.setTag('user_role', sanitizedCtx.role);
        scope.setExtras(sanitizedCtx);
        sentry.captureException(err);
      });
    } catch {
      // Sentry fallback if package is not bundled
      console.error(`[Telemetry Error] [${sanitizedCtx.route || 'app'}]`, err.name, err.message, sanitizedCtx);
    }
  } else {
    console.error(`[Dev Telemetry] [${sanitizedCtx.route || 'app'}]`, err.name, err.message, sanitizedCtx);
  }
}
