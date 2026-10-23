<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — PHP API AUTH LOGIN CONTROLLER FOR CPANEL / LITESPEED
// =============================================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';

$rawBody = file_get_contents('php://input');
$input = json_decode($rawBody, true) ?: $_POST;

$identifier = trim($input['email'] ?? $input['identifier'] ?? $input['username'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($identifier) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Email/Username and password are required.'
    ]);
    exit;
}

try {
    // 1. Query user by email, phone, or id
    $user = php_query_one(
        'SELECT id, email, phone, full_name, role, password_hash, is_active FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(phone) = LOWER(?) OR id = ? LIMIT 1',
        [$identifier, $identifier, $identifier]
    );

    if (!$user || empty($user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials.']);
        exit;
    }

    // 2. Check password against bcrypt or legacy PBKDF2 hash
    if (!verify_password_php($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials.']);
        exit;
    }

    // 3. Check active state
    if (isset($user['is_active']) && !$user['is_active']) {
        http_response_code(403);
        echo json_encode(['error' => 'Account is suspended or inactive.']);
        exit;
    }

    // 4. Resolve couple/event slug if couple
    $eventSlug = null;
    if ($user['role'] === 'COUPLE') {
        $event = php_query_one(
            'SELECT slug FROM events WHERE couple_user_id = ? OR id = ? LIMIT 1',
            [$user['id'], $user['id']]
        );
        if ($event) {
            $eventSlug = $event['slug'];
        }
    }

    // 5. Generate session token
    unset($user['password_hash']);
    $token = 'agafari_' . bin2hex(random_bytes(16)) . '_' . time();

    // 6. Resolve destination
    $redirectUrl = '/admin/dashboard';
    if ($user['role'] === 'SUPER_ADMIN' || $user['role'] === 'ADMIN') {
        $redirectUrl = '/admin/dashboard';
    } elseif ($user['role'] === 'ORGANIZER') {
        $redirectUrl = '/organizer/dashboard';
    } elseif ($user['role'] === 'COUPLE') {
        $redirectUrl = $eventSlug ? "/event/{$eventSlug}/couple" : '/couple/dashboard';
    } elseif ($user['role'] === 'GATE_SCANNER' || $user['role'] === 'SCANNER') {
        $redirectUrl = '/scanner';
    } elseif ($user['role'] === 'LIVE_STREAMER') {
        $redirectUrl = '/live-streamer';
    } elseif ($user['role'] === 'MODERATOR' || $user['role'] === 'MEDIA_MODERATOR') {
        $redirectUrl = '/moderation';
    }

    if ($eventSlug) {
        $user['eventSlug'] = $eventSlug;
    }

    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => $user,
        'redirectUrl' => $redirectUrl
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database connection or query error during login: ' . $e->getMessage()
    ]);
}
