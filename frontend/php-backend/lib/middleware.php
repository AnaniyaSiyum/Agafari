<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — PHP BACKEND MIDDLEWARE
// Shared CORS, authentication, and rate-limiting helpers.
// =============================================================================

require_once __DIR__ . '/../config/db.php';

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

/**
 * Return the origin string that is allowed to call this API.
 * Reads ALLOWED_ORIGIN env var (set in cPanel); defaults to production domain.
 */
function get_allowed_origin(): string {
    return getenv('ALLOWED_ORIGIN') ?: 'https://agafari.com';
}

/**
 * Emit strict CORS headers. Only the configured production origin (or localhost
 * variants for local development) receives a mirrored Access-Control-Allow-Origin.
 */
function send_cors_headers(): void {
    $allowedProd = get_allowed_origin();
    $devOrigins  = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
    ];

    $requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ($requestOrigin === $allowedProd || in_array($requestOrigin, $devOrigins, true)) {
        header("Access-Control-Allow-Origin: {$requestOrigin}");
        header('Vary: Origin');
    } else {
        header("Access-Control-Allow-Origin: {$allowedProd}");
    }

    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 3600');

    // Security response headers
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');
}

// ---------------------------------------------------------------------------
// RATE LIMITING
// ---------------------------------------------------------------------------

/**
 * Check whether an IP address is within the login rate limit window.
 * Allows a maximum of 5 attempts per 15 minutes.
 *
 * Returns true  => request is allowed.
 * Returns false => too many attempts; caller should respond with HTTP 429.
 */
function check_login_rate_limit(string $ip): bool {
    try {
        $pdo = getPdoConnection();

        // Purge stale windows older than 15 minutes
        $pdo->prepare(
            'DELETE FROM php_rate_limits WHERE window_start < DATE_SUB(NOW(), INTERVAL 15 MINUTE)'
        )->execute();

        $row = php_query_one(
            'SELECT attempt_count FROM php_rate_limits WHERE ip_address = ?',
            [$ip]
        );

        if ($row && (int)$row['attempt_count'] >= 5) {
            return false;
        }

        // Upsert: increment existing row or insert a fresh one
        $pdo->prepare(
            'INSERT INTO php_rate_limits (ip_address, attempt_count, window_start)
             VALUES (?, 1, NOW())
             ON DUPLICATE KEY UPDATE attempt_count = attempt_count + 1'
        )->execute([$ip]);

        return true;
    } catch (Throwable $e) {
        // Fail open: never block legitimate users due to a DB error
        return true;
    }
}

// ---------------------------------------------------------------------------
// AUTHENTICATION
// ---------------------------------------------------------------------------

/**
 * Validate the Bearer token from the Authorization header against the
 * php_sessions table. Exits with HTTP 401 if absent, invalid, or expired.
 *
 * @return array{user_id: string, role: string, expires_at: string}
 */
function require_auth(): array {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (!str_starts_with($authHeader, 'Bearer ')) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required.']);
        exit;
    }

    $token = trim(substr($authHeader, 7));

    if (empty($token)) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required.']);
        exit;
    }

    try {
        $session = php_query_one(
            'SELECT user_id, role, expires_at
               FROM php_sessions
              WHERE token      = ?
                AND expires_at > NOW()
              LIMIT 1',
            [$token]
        );
    } catch (Throwable $e) {
        http_response_code(503);
        echo json_encode(['error' => 'Authentication service temporarily unavailable.']);
        exit;
    }

    if (!$session) {
        http_response_code(401);
        echo json_encode(['error' => 'Session expired or invalid. Please log in again.']);
        exit;
    }

    return $session;
}

/**
 * Like require_auth() but also enforces that the authenticated user
 * has one of the specified roles. Exits with HTTP 403 on mismatch.
 *
 * @param  string|string[] $roles
 * @return array
 */
function require_role(array|string $roles): array {
    $session = require_auth();
    $allowed = is_array($roles) ? $roles : [$roles];

    if (!in_array($session['role'], $allowed, true)) {
        http_response_code(403);
        echo json_encode(['error' => 'Insufficient permissions for this operation.']);
        exit;
    }

    return $session;
}
