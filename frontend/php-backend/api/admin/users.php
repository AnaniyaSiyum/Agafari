<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — PHP API ADMIN USERS (GET, POST, PATCH, DELETE)
// DirectAdmin / LiteSpeed endpoint for User & Role Management
// =============================================================================

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
require_once $backendBase . '/lib/middleware.php';
require_once $backendBase . '/lib/uuid.php';

header('Content-Type: application/json; charset=utf-8');
send_cors_headers();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Require System Admin authentication
$adminSession = require_role(['SYSTEM_ADMIN', 'SUPER_ADMIN', 'ADMIN']);

// ---------------------------------------------------------------------------
// GET — List all registered users
// ---------------------------------------------------------------------------
if ($method === 'GET') {
    try {
        $rows = php_query("
            SELECT u.id, u.email, u.full_name, u.role, u.is_active, u.created_at,
                   o.id AS organizer_id, o.business_name
              FROM users u
         LEFT JOIN organizers o ON o.owner_user_id = u.id
          ORDER BY u.created_at DESC
        ");

        $users = array_map(function ($u) {
            $orgId = $u['organizer_id'] ?? ($u['role'] === 'EVENT_ORGANIZER' ? 'org-' . $u['id'] : null);
            return [
                'id'          => $u['id'],
                'email'       => $u['email'],
                'fullName'    => $u['full_name'],
                'full_name'   => $u['full_name'],
                'companyName' => $u['business_name'] ?? $u['full_name'],
                'role'        => $u['role'],
                'status'      => ($u['is_active'] ? 'ACTIVE' : 'INACTIVE'),
                'isActive'    => (bool)$u['is_active'],
                'organizerId' => $orgId,
                'createdAt'   => $u['created_at'],
            ];
        }, $rows);

        echo json_encode(['users' => $users]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to load users: ' . $e->getMessage()]);
        exit;
    }
}

// ---------------------------------------------------------------------------
// POST — Create a new user (Organizer, Admin, Staff)
// ---------------------------------------------------------------------------
if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true) ?: [];

    $email = strtolower(trim($body['email'] ?? ''));
    $fullName = trim($body['fullName'] ?? $body['name'] ?? $body['companyName'] ?? '');
    $role = strtoupper(trim($body['role'] ?? 'EVENT_ORGANIZER'));
    $password = trim($body['password'] ?? 'agafari123');
    $description = trim($body['description'] ?? '');

    if (empty($email) || empty($fullName)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and full name are required.']);
        exit;
    }

    $existing = php_query_one("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", [$email]);
    if ($existing) {
        http_response_code(409);
        echo json_encode(['error' => 'A user with this email address already exists.']);
        exit;
    }

    // Check supported ENUM values for role to prevent SQL truncation errors
    $targetRole = $role;
    try {
        $colInfo = php_query_one("SHOW COLUMNS FROM users LIKE 'role'");
        $enumStr = $colInfo['Type'] ?? '';
        if ($targetRole === 'EVENT_ORGANIZER' && strpos($enumStr, 'EVENT_ORGANIZER') === false && strpos($enumStr, 'ORGANIZER_OWNER') !== false) {
            $targetRole = 'ORGANIZER_OWNER';
        } elseif ($targetRole === 'ORGANIZER_OWNER' && strpos($enumStr, 'ORGANIZER_OWNER') === false && strpos($enumStr, 'EVENT_ORGANIZER') !== false) {
            $targetRole = 'EVENT_ORGANIZER';
        }
    } catch (Throwable $ignored) {}

    $userId = function_exists('generate_safe_id') ? generate_safe_id('usr-') : 'usr-' . substr(generate_uuid_v4(), 4);
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $orgId = null;

    try {
        php_execute(
            "INSERT INTO users (id, email, password_hash, temporary_password, full_name, role, is_active, created_at)
             VALUES (?, ?, ?, ?, ?, ?, 1, NOW())",
            [$userId, $email, $passwordHash, $password, $fullName, $targetRole]
        );

        if ($role === 'EVENT_ORGANIZER' || $role === 'ORGANIZER_OWNER' || $targetRole === 'EVENT_ORGANIZER' || $targetRole === 'ORGANIZER_OWNER') {
            $orgId = function_exists('generate_safe_id') ? generate_safe_id('org-') : 'org-' . substr(generate_uuid_v4(), 4);
            php_execute(
                "INSERT INTO organizers (id, owner_user_id, business_name, contact_phone, created_at)
                 VALUES (?, ?, ?, ?, NOW())",
                [$orgId, $userId, $fullName, $body['phone'] ?? null]
            );
        }

        echo json_encode([
            'success' => true,
            'message' => 'User created successfully.',
            'user'    => [
                'id'          => $userId,
                'email'       => $email,
                'fullName'    => $fullName,
                'companyName' => $fullName,
                'description' => $description ?: "Official certified event management partner ({$fullName}).",
                'role'        => $role,
                'status'      => 'ACTIVE',
                'organizerId' => $orgId ?: "org-{$userId}",
            ],
            'temporaryPassword' => $password,
        ]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create user: ' . $e->getMessage()]);
        exit;
    }
}

// ---------------------------------------------------------------------------
// PATCH — Update user (Role, Status, Password)
// ---------------------------------------------------------------------------
if ($method === 'PATCH') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true) ?: [];

    $userId = trim($body['userId'] ?? $body['id'] ?? $_GET['id'] ?? $_GET['userId'] ?? '');
    if (empty($userId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing userId.']);
        exit;
    }

    $updates = [];
    $params = [];

    if (!empty($body['fullName'])) {
        $updates[] = "full_name = ?";
        $params[] = trim($body['fullName']);
    }
    if (!empty($body['role'])) {
        $updates[] = "role = ?";
        $params[] = strtoupper(trim($body['role']));
    }
    if (isset($body['isActive'])) {
        $updates[] = "is_active = ?";
        $params[] = $body['isActive'] ? 1 : 0;
    }
    $newPass = trim($body['newPassword'] ?? $body['password'] ?? '');
    if (!empty($newPass)) {
        $updates[] = "password_hash = ?";
        $params[] = password_hash($newPass, PASSWORD_BCRYPT);
        $updates[] = "temporary_password = ?";
        $params[] = $newPass;
    }

    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid fields provided to update.']);
        exit;
    }

    $params[] = $userId;
    $sql = "UPDATE users SET " . implode(', ', $updates) . ", updated_at = NOW() WHERE id = ?";

    try {
        php_execute($sql, $params);
        $updatedUser = php_query_one("SELECT id, email, full_name, role, is_active, temporary_password FROM users WHERE id = ?", [$userId]);
        echo json_encode([
            'success'           => true,
            'message'           => 'User updated successfully.',
            'user'              => $updatedUser,
            'temporaryPassword' => $newPass ?: ($updatedUser['temporary_password'] ?? null),
        ]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update user: ' . $e->getMessage()]);
        exit;
    }
}

// ---------------------------------------------------------------------------
// DELETE — Delete user
// ---------------------------------------------------------------------------
if ($method === 'DELETE') {
    $userId = trim($_GET['id'] ?? $_GET['userId'] ?? '');
    if (empty($userId)) {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?: [];
        $userId = trim($body['id'] ?? $body['userId'] ?? '');
    }

    if (empty($userId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing userId.']);
        exit;
    }

    try {
        php_execute("DELETE FROM users WHERE id = ?", [$userId]);
        echo json_encode(['success' => true, 'message' => 'User deleted successfully.']);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete user: ' . $e->getMessage()]);
        exit;
    }
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
