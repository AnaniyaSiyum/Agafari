<?php
// =============================================================================
// AGAFARI — EVENT TEAM & ROLE ASSIGNMENT CONTROLLER (PHP FOR CPANEL / DIRECTADMIN)
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
require_once $backendBase . '/lib/auth.php';
require_once $backendBase . '/lib/middleware.php';
require_once $backendBase . '/lib/uuid.php';

header('Content-Type: application/json; charset=utf-8');
send_cors_headers();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$slug = trim($_GET['slug'] ?? '');
if (empty($slug)) {
    // Attempt parsing from REQUEST_URI
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (preg_match('#/api/events/([^/?]+)/team#', $uri, $m)) {
        $slug = $m[1];
    }
}

if (empty($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Event slug is required.']);
    exit;
}

// Resolve event
$event = php_query_one('SELECT id, slug, title FROM events WHERE LOWER(slug) = LOWER(?) LIMIT 1', [$slug]);
if (!$event) {
    http_response_code(404);
    echo json_encode(['error' => 'Event not found.']);
    exit;
}

// -----------------------------------------------------------------------------
// GET: List all staff & roles assigned to this event
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    try {
        $staffRows = php_query(
            'SELECT es.id, es.role, es.created_at, 
                    u.id AS user_id, u.full_name, u.email, u.temporary_password
             FROM event_staff es
             JOIN users u ON u.id = es.user_id
             WHERE es.event_id = ?
             ORDER BY es.role, u.full_name',
            [$event['id']]
        );

        $team = array_map(function($r) {
            return [
                'id'                => $r['id'],
                'role'              => $r['role'],
                'userId'            => $r['user_id'],
                'fullName'          => $r['full_name'],
                'email'             => $r['email'],
                'temporaryPassword' => $r['temporary_password'] ?? '',
                'createdAt'         => $r['created_at'],
            ];
        }, $staffRows);

        echo json_encode([
            'success' => true,
            'team'    => $team,
        ]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to load team: ' . $e->getMessage()]);
        exit;
    }
}

// -----------------------------------------------------------------------------
// POST: Create and assign a staff role
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    try {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?: $_POST;

        $email    = strtolower(trim($body['email'] ?? ''));
        $fullName = trim($body['fullName'] ?? '');
        $role     = trim($body['role'] ?? '');
        $password = trim($body['password'] ?? '');

        $validRoles = ['GATE_SCANNER', 'LIVE_STREAMER', 'CONTENT_MODERATOR', 'QUOTA_DELEGATE'];
        if (empty($email) || empty($fullName) || !in_array($role, $validRoles)) {
            http_response_code(400);
            echo json_encode(['error' => 'Valid role (GATE_SCANNER, LIVE_STREAMER, CONTENT_MODERATOR), email, and full name are required.']);
            exit;
        }

        $tempPassword = !empty($password) && strlen($password) >= 4
            ? $password
            : 'agafari' . rand(1000, 9999);

        // Check if user exists
        $user = php_query_one('SELECT id, email FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1', [$email]);
        if (!$user) {
            $newUserId = function_exists('generate_safe_id') ? generate_safe_id('usr-') : 'usr-' . substr(generate_uuid_v4(), 4);
            try {
                php_execute(
                    'INSERT INTO users (id, email, password_hash, full_name, role, is_active, created_at)
                     VALUES (?, ?, ?, ?, ?, 1, NOW())',
                    [$newUserId, $email, hash_password_php($tempPassword), $fullName, $role]
                );
            } catch (Throwable $e) {
                php_execute(
                    'INSERT INTO users (id, email, password_hash, full_name, role)
                     VALUES (?, ?, ?, ?, ?)',
                    [$newUserId, $email, hash_password_php($tempPassword), $fullName, $role]
                );
            }
            $userId = $newUserId;
        } else {
            $userId = $user['id'];
            if (!empty($password)) {
                php_execute(
                    'UPDATE users SET password_hash = ?, temporary_password = ? WHERE id = ?',
                    [hash_password_php($tempPassword), $tempPassword, $userId]
                );
            }
        }

        // Check if already assigned this role
        $existing = php_query_one(
            'SELECT id FROM event_staff WHERE event_id = ? AND user_id = ? AND role = ? LIMIT 1',
            [$event['id'], $userId, $role]
        );
        if ($existing) {
            http_response_code(400);
            echo json_encode(['error' => 'This user is already assigned to this role for this event.']);
            exit;
        }

        $newStaffId = 'staff-' . time() . '-' . rand(100, 999);
        php_execute(
            'INSERT INTO event_staff (id, event_id, user_id, role, assigned_by)
             VALUES (?, ?, ?, ?, ?)',
            [$newStaffId, $event['id'], $userId, $role, 'SYSTEM_ADMIN']
        );

        http_response_code(201);
        echo json_encode([
            'success'           => true,
            'assignment'        => [
                'id'        => $newStaffId,
                'eventId'   => $event['id'],
                'userId'    => $userId,
                'fullName'  => $fullName,
                'email'     => $email,
                'role'      => $role,
            ],
            'temporaryPassword' => $tempPassword,
        ]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Role assignment failed: ' . $e->getMessage()]);
        exit;
    }
}

// -----------------------------------------------------------------------------
// DELETE: Remove staff role assignment
// -----------------------------------------------------------------------------
if ($method === 'DELETE') {
    try {
        $staffId = trim($_GET['staffId'] ?? '');
        $userId  = trim($_GET['userId'] ?? '');

        if (!empty($staffId)) {
            php_execute('DELETE FROM event_staff WHERE id = ? AND event_id = ?', [$staffId, $event['id']]);
        } elseif (!empty($userId)) {
            php_execute('DELETE FROM event_staff WHERE user_id = ? AND event_id = ?', [$userId, $event['id']]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Missing staffId or userId to remove.']);
            exit;
        }

        echo json_encode(['success' => true]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Staff removal failed: ' . $e->getMessage()]);
        exit;
    }
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed.']);
