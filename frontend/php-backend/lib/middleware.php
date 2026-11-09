<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — PHP BACKEND MIDDLEWARE
// Shared CORS, authentication, and rate-limiting helpers.
// =============================================================================

$cfgCand = [
    __DIR__ . '/../config/db.php',
    __DIR__ . '/../../config/db.php',
    __DIR__ . '/../../api/config/db.php',
    __DIR__ . '/../../php-backend/config/db.php',
    ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/config/db.php',
    ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/api/config/db.php',
    ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/php-backend/config/db.php',
];
$cfgLoaded = false;
foreach ($cfgCand as $f) {
    if ($f && file_exists($f)) {
        require_once $f;
        $cfgLoaded = true;
        break;
    }
}
if (!$cfgLoaded) {
    require_once __DIR__ . '/../config/db.php';
}

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
 * Validate origin against trusted domains
 */
function is_allowed_origin(string $origin): bool {
    if (empty($origin)) return false;
    $parsed = parse_url($origin);
    $host = strtolower($parsed['host'] ?? '');
    $port = $parsed['port'] ?? null;

    if ($host === 'agafari.com' || str_ends_with($host, '.agafari.com')) {
        return true;
    }
    if (($host === 'localhost' || $host === '127.0.0.1') && ($port === 3000 || $port === 3001 || $port === null)) {
        return true;
    }
    return false;
}

/**
 * Emit strict CORS headers. Only trusted origins receive Access-Control-Allow-Credentials: true.
 */
function send_cors_headers(): void {
    $requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (!empty($requestOrigin) && is_allowed_origin($requestOrigin)) {
        header("Access-Control-Allow-Origin: {$requestOrigin}");
        header('Access-Control-Allow-Credentials: true');
        header('Vary: Origin');
    } else {
        header("Access-Control-Allow-Origin: https://agafari.com");
    }

    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');

    // Security response headers
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('Referrer-Policy: strict-origin-when-cross-origin');

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
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
 * Extract auth token from Authorization header (Bearer) or agafari_token cookie.
 */
function get_auth_token(): ?string {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
        return trim($matches[1]);
    }
    if (!empty($_COOKIE['agafari_token'])) {
        return trim($_COOKIE['agafari_token']);
    }
    return null;
}

/**
 * Return current session array or null if unauthenticated / expired.
 */
function get_authenticated_user(): ?array {
    $token = get_auth_token();
    if (empty($token)) {
        return null;
    }

    try {
        return php_query_one(
            'SELECT user_id, role, expires_at
               FROM php_sessions
              WHERE token      = ?
                AND expires_at > NOW()
              LIMIT 1',
            [$token]
        );
    } catch (Throwable $e) {
        return null;
    }
}

/**
 * Validate the token against php_sessions table. Exits with HTTP 401 if absent or expired.
 *
 * @return array{user_id: string, role: string, expires_at: string}
 */
function require_auth(): array {
    $session = get_authenticated_user();

    if (!$session) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required. Please log in again.']);
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
