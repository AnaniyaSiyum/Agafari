<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required.']);
    exit;
}

try {
    $user = php_query_one(
        'SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE LOWER(email) = LOWER(?)',
        [$email]
    );

    if (!$user || !verify_password_php($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password.']);
        exit;
    }

    if (!$user['is_active']) {
        http_response_code(403);
        echo json_encode(['error' => 'Account is suspended.']);
        exit;
    }

    unset($user['password_hash']);
    $user['token'] = 'token_' . $user['id'] . '_' . time();

    echo json_encode([
        'success' => true,
        'user' => $user
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error during login.']);
}
