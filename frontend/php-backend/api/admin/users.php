<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — PHP API ADMIN USERS (GET, POST, PATCH, DELETE)
// DirectAdmin / LiteSpeed endpoint for User & Role Management
// =============================================================================

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/middleware.php';
require_once __DIR__ . '/../../lib/uuid.php';

header('Content-Type: application/json; charset=utf-8');
send_cors_headers();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ---------------------------------------------------------------------------
// GET — List all registered users
// ---------------------------------------------------------------------------
if ($method === 'GET') {
    try {
        $rows = php_query("
            SELECT id, email, full_name, role, is_active, created_at
              FROM users
          ORDER BY created_at DESC
        ");

        $users = array_map(function ($u) {
            return [
                'id'        => $u['id'],
                'email'     => $u['email'],
                'fullName'  => $u['full_name'],
                'full_name' => $u['full_name'],
                'role'      => $u['role'],
                'status'    => ($u['is_active'] ? 'ACTIVE' : 'INACTIVE'),
                'isActive'  => (bool)$u['is_active'],
                'createdAt' => $u['created_at'],
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
    $fullName = trim($body['fullName'] ?? $body['name'] ?? '');
    $role = strtoupper(trim($body['role'] ?? 'EVENT_ORGANIZER'));
    $password = trim($body['password'] ?? 'agafari123');

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

    $userId = 'usr-' . generate_uuid();
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    try {
        php_execute(
            "INSERT INTO users (id, email, password_hash, full_name, role, is_active, created_at)
             VALUES (?, ?, ?, ?, ?, 1, NOW())",
            [$userId, $email, $passwordHash, $fullName, $role]
        );

        if ($role === 'EVENT_ORGANIZER') {
            $orgId = 'org-' . generate_uuid();
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
                'id'       => $userId,
                'email'    => $email,
                'fullName' => $fullName,
                'role'     => $role,
                'status'   => 'ACTIVE',
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

    $userId = trim($body['userId'] ?? $body['id'] ?? '');
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
    if (!empty($body['password'])) {
        $updates[] = "password_hash = ?";
        $params[] = password_hash(trim($body['password']), PASSWORD_BCRYPT);
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
        echo json_encode(['success' => true, 'message' => 'User updated successfully.']);
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
