<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — PHP API AUTH LOGIN CONTROLLER FOR CPANEL / LITESPEED
// Security fixes applied: strict CORS, sanitized errors, no ID login vector,
// rate limiting, and persistent session storage in php_sessions table.
// =============================================================================

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/middleware.php';

header('Content-Type: application/json; charset=utf-8');
send_cors_headers();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit;
}

// ---------------------------------------------------------------------------
// Rate limiting: max 5 login attempts per IP per 15 minutes
// ---------------------------------------------------------------------------
$clientIp = $_SERVER['HTTP_X_FORWARDED_FOR']
    ? explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]
    : ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
$clientIp = trim($clientIp);

if (!check_login_rate_limit($clientIp)) {
    http_response_code(429);
    header('Retry-After: 900'); // 15 minutes in seconds
    echo json_encode(['error' => 'Too many login attempts. Please try again in 15 minutes.']);
    exit;
}

// ---------------------------------------------------------------------------
// Parse input
// ---------------------------------------------------------------------------
$rawBody = file_get_contents('php://input');
$input   = json_decode($rawBody, true) ?: $_POST;

// Accept email or phone — NOT raw ID (removes UUID login vector)
$identifier = trim($input['email'] ?? $input['identifier'] ?? $input['username'] ?? '');
$password   = $input['password'] ?? '';

if (empty($identifier) || empty($password)) {
    http_response_code(400);
    // Generic message — no enumeration hint
    echo json_encode(['error' => 'Invalid credentials.']);
    exit;
}

// ---------------------------------------------------------------------------
// Database lookup & verification
// ---------------------------------------------------------------------------
try {
    // Query by email OR phone only — no raw `id = ?` to prevent UUID bypass
    $user = php_query_one(
        'SELECT id, email, phone, full_name, role, password_hash, is_active
           FROM users
          WHERE LOWER(email) = LOWER(?)
             OR LOWER(phone) = LOWER(?)
          LIMIT 1',
        [$identifier, $identifier]
    );

    // Timing-safe: always run verify_password_php to prevent user enumeration
    $dummyHash   = '$2y$10$invalidhashusedfortimingprotection00000000000000000000';
    $hashToCheck = $user['password_hash'] ?? $dummyHash;
    $verified    = verify_password_php($password, $hashToCheck);

    if (!$user || !$verified) {
        http_response_code(401);
        // Identical error regardless of whether user exists (no enumeration)
        echo json_encode(['error' => 'Invalid credentials.']);
        exit;
    }

    // Account active check
    if (isset($user['is_active']) && !$user['is_active']) {
        http_response_code(403);
        echo json_encode(['error' => 'Account is suspended or inactive.']);
        exit;
    }

    // Resolve event slug for COUPLE role
    $eventSlug = null;
    if ($user['role'] === 'COUPLE') {
        $event = php_query_one(
            'SELECT slug FROM events WHERE couple_user_id = ? LIMIT 1',
            [$user['id']]
        );
        if ($event) {
            $eventSlug = $event['slug'];
        }
    }

    // Remove password hash before returning any user data
    unset($user['password_hash']);

    // Generate a cryptographically random session token
    $token  = 'agafari_' . bin2hex(random_bytes(32));
    $expiry = date('Y-m-d H:i:s', strtotime('+24 hours'));

    // Persist session to php_sessions table
    try {
        $pdo = getPdoConnection();
        $pdo->prepare(
            'INSERT INTO php_sessions (token, user_id, role, ip_address, expires_at)
             VALUES (?, ?, ?, ?, ?)'
        )->execute([$token, $user['id'], $user['role'], $clientIp, $expiry]);
    } catch (Throwable $e) {
        // Non-fatal: still return the token; client can retry if session check fails
    }

    // Determine redirect destination
    $redirectUrl = '/login';
    switch ($user['role']) {
        case 'SUPER_ADMIN':
        case 'SYSTEM_ADMIN':
        case 'ADMIN':
            $redirectUrl = '/admin/dashboard';
            break;
        case 'ORGANIZER_OWNER':
        case 'ORGANIZER':
            $redirectUrl = '/organizer/dashboard';
            break;
        case 'COUPLE':
            $redirectUrl = $eventSlug ? "/event/{$eventSlug}/couple" : '/couple/dashboard';
            break;
        case 'GATE_SCANNER':
        case 'SCANNER':
            $redirectUrl = '/scanner';
            break;
        case 'LIVE_STREAMER':
            $redirectUrl = '/live-streamer';
            break;
        case 'MODERATOR':
        case 'MEDIA_MODERATOR':
            $redirectUrl = '/moderation';
            break;
    }

    if ($eventSlug) {
        $user['eventSlug'] = $eventSlug;
    }

    echo json_encode([
        'success'     => true,
        'token'       => $token,
        'user'        => $user,
        'redirectUrl' => $redirectUrl,
    ]);

} catch (Throwable $e) {
    // Sanitized error — no internal DB details exposed to the client
    http_response_code(500);
    echo json_encode(['error' => 'Login service is temporarily unavailable. Please try again later.']);
    // Log the actual error server-side (error_log goes to cPanel error_log)
    error_log('[Agafari login.php] ' . $e->getMessage());
}
