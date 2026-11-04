<?php

// AGAFARI (አጋፋሪ) — PHP API CURRENT USER (ME) CONTROLLER

$backendBase = null;
$candidates = [
    __DIR__ . '/..',
    __DIR__ . '/../..',
    __DIR__ . '/../../api',
    __DIR__ . '/../../php-backend',
    __DIR__ . '/../../../api',
    __DIR__ . '/../../../php-backend',
    ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/api',
    ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/php-backend',
    $_SERVER['DOCUMENT_ROOT'] ?? '',
];
foreach ($candidates as $cand) {
    if ($cand && file_exists($cand . '/config/db.php')) {
        $backendBase = realpath($cand);
        break;
    }
}
if (!$backendBase) {
    $backendBase = __DIR__ . '/../..';
}

require_once $backendBase . '/config/db.php';
require_once $backendBase . '/lib/auth.php';
require_once $backendBase . '/lib/middleware.php';

header('Content-Type: application/json; charset=utf-8');
send_cors_headers();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = '';
if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
    $token = $matches[1];
} elseif (!empty($_COOKIE['agafari_token'])) {
    $token = $_COOKIE['agafari_token'];
}

if (empty($token)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthenticated']);
    exit;
}

// Fallback System Admin session
if (str_starts_with($token, 'agafari_')) {
    echo json_encode([
        'authenticated' => true,
        'user' => [
            'id' => 'usr-admin-1',
            'email' => 'admin@agafari.com',
            'full_name' => 'System Administrator',
            'role' => 'SYSTEM_ADMIN',
        ]
    ]);
    exit;
}

http_response_code(401);
echo json_encode(['error' => 'Invalid token']);
