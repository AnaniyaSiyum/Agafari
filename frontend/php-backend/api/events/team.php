<?php
// =============================================================================
// AGAFARI — EVENT TEAM & ROLE ASSIGNMENT CONTROLLER (PHP FOR CPANEL / DIRECTADMIN)
// Dedicated Staff Isolation, Role Management & Credential Updates
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
$event = php_query_one(
    'SELECT id, slug, title, couple_user_id, bride_name, groom_name, organizer_id 
       FROM events 
      WHERE LOWER(slug) = LOWER(?) 
      LIMIT 1',
    [$slug]
);

if (!$event) {
    http_response_code(404);
    echo json_encode(['error' => 'Event not found.']);
    exit;
}

// Check temporary_password support
$hasTempPass = false;
try {
    $col = php_query_one("SHOW COLUMNS FROM users LIKE 'temporary_password'");
    if ($col) {
        $hasTempPass = true;
    } else {
        php_execute("ALTER TABLE users ADD COLUMN temporary_password VARCHAR(255) NULL AFTER password_hash");
        $hasTempPass = true;
    }
} catch (Throwable $e) {}

$tempPassField = $hasTempPass ? 'u.temporary_password' : 'NULL AS temporary_password';

function check_team_access(array $event): array {
    $session = require_auth();
    $isSystemAdmin = in_array($session['role'], ['SYSTEM_ADMIN', 'SUPER_ADMIN', 'ADMIN'], true);
    $isEventOrganizer = in_array($session['role'], ['EVENT_ORGANIZER', 'ORGANIZER_OWNER', 'ORGANIZER'], true);
    $isCouple = ($session['user_id'] === ($event['couple_user_id'] ?? '') || in_array($session['role'], ['COUPLE', 'BRIDE_GROOM'], true));

    if (!$isSystemAdmin) {
        if ($isEventOrganizer) {
            $orgRow = php_query_one('SELECT id FROM organizers WHERE owner_user_id = ? OR id = ? LIMIT 1', [$session['user_id'], $session['user_id']]);
            $orgId = $orgRow ? $orgRow['id'] : $session['user_id'];
            if ($event['organizer_id'] !== $orgId && $event['organizer_id'] !== $session['user_id']) {
                http_response_code(403);
                echo json_encode(['error' => 'Forbidden: Not authorized for this wedding event.']);
                exit;
            }
        } elseif (!$isCouple) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden: Insufficient privileges for event team.']);
            exit;
        }
    }
    return $session;
}

// -----------------------------------------------------------------------------
// GET: List all staff & roles assigned to this event + couple credentials
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    try {
        $session = check_team_access($event);

        $staffRows = php_query(
            "SELECT es.id, es.role, es.created_at, 
                    u.id AS user_id, u.full_name, u.email, {$tempPassField}
             FROM event_staff es
             JOIN users u ON u.id = es.user_id
             WHERE es.event_id = ?
             ORDER BY es.role, u.full_name",
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

        // Resolve couple info
        $coupleUser = null;
        if (!empty($event['couple_user_id'])) {
            $coupleUser = php_query_one(
                "SELECT id, email, full_name, {$tempPassField} FROM users WHERE id = ? LIMIT 1",
                [$event['couple_user_id']]
            );
        }

        $coupleData = [
            'userId'            => $coupleUser['id'] ?? $event['couple_user_id'] ?? null,
            'fullName'          => $coupleUser['full_name'] ?? ($event['bride_name'] . ' & ' . $event['groom_name']),
            'email'             => $coupleUser['email'] ?? "couple@{$slug}.com",
            'temporaryPassword' => $coupleUser['temporary_password'] ?? 'agafari2026',
            'role'              => 'BRIDE_GROOM',
        ];

        echo json_encode([
            'success' => true,
            'staff'   => $team,
            'team'    => $team,
            'couple'  => $coupleData,
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
        $session = check_team_access($event);

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
        $user = php_query_one('SELECT id, email, role FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1', [$email]);
        if ($user && in_array(strtoupper($user['role']), ['SYSTEM_ADMIN', 'SUPER_ADMIN', 'ADMIN'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Security Error: Cannot assign an administrative account to event staff.']);
            exit;
        }
        if (!$user) {
            $newUserId = function_exists('generate_safe_id') ? generate_safe_id('usr-') : 'usr-' . substr(generate_uuid_v4(), 4);
            $hash = password_hash($tempPassword, PASSWORD_BCRYPT);
            try {
                if ($hasTempPass) {
                    php_execute(
                        'INSERT INTO users (id, email, password_hash, temporary_password, full_name, role, is_active, created_at)
                         VALUES (?, ?, ?, ?, ?, ?, 1, NOW())',
                        [$newUserId, $email, $hash, $tempPassword, $fullName, $role]
                    );
                } else {
                    php_execute(
                        'INSERT INTO users (id, email, password_hash, full_name, role, is_active, created_at)
                         VALUES (?, ?, ?, ?, ?, 1, NOW())',
                        [$newUserId, $email, $hash, $fullName, $role]
                    );
                }
            } catch (Throwable $e) {
                php_execute(
                    'INSERT INTO users (id, email, password_hash, full_name, role)
                     VALUES (?, ?, ?, ?, ?)',
                    [$newUserId, $email, $hash, $fullName, $role]
                );
            }
            $userId = $newUserId;
        } else {
            $userId = $user['id'];
            if (!empty($password)) {
                $hash = password_hash($tempPassword, PASSWORD_BCRYPT);
                if ($hasTempPass) {
                    php_execute(
                        'UPDATE users SET password_hash = ?, temporary_password = ? WHERE id = ?',
                        [$hash, $tempPassword, $userId]
                    );
                } else {
                    php_execute(
                        'UPDATE users SET password_hash = ? WHERE id = ?',
                        [$hash, $userId]
                    );
                }
            }
        }

        // Check if already assigned this role for this event
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
        $assignedBy = $event['organizer_id'] ?? 'SYSTEM_ADMIN';
        php_execute(
            'INSERT INTO event_staff (id, event_id, user_id, role, assigned_by)
             VALUES (?, ?, ?, ?, ?)',
            [$newStaffId, $event['id'], $userId, $role, $assignedBy]
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
// PATCH: Update staff or couple credentials
// -----------------------------------------------------------------------------
if ($method === 'PATCH') {
    try {
        $session = check_team_access($event);

        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?: [];

        $userId   = trim($body['userId'] ?? '');
        $email    = strtolower(trim($body['email'] ?? ''));
        $password = trim($body['password'] ?? '');
        $role     = trim($body['role'] ?? '');

        if (empty($userId)) {
            http_response_code(400);
            echo json_encode(['error' => 'userId is required.']);
            exit;
        }

        $user = php_query_one('SELECT id, email, role FROM users WHERE id = ? LIMIT 1', [$userId]);
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found.']);
            exit;
        }

        if (in_array(strtoupper($user['role'] ?? ''), ['SYSTEM_ADMIN', 'SUPER_ADMIN', 'ADMIN'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Security Error: Cannot modify credentials of an administrative account.']);
            exit;
        }

        // Update email if provided
        if (!empty($email) && $email !== $user['email']) {
            php_execute('UPDATE users SET email = ? WHERE id = ?', [$email, $userId]);
        }

        // Update password if provided
        if (!empty($password) && strlen($password) >= 4) {
            $hash = password_hash($password, PASSWORD_BCRYPT);
            if ($hasTempPass) {
                php_execute(
                    'UPDATE users SET password_hash = ?, temporary_password = ? WHERE id = ?',
                    [$hash, $password, $userId]
                );
            } else {
                php_execute(
                    'UPDATE users SET password_hash = ? WHERE id = ?',
                    [$hash, $userId]
                );
            }
        }

        // Update staff role if provided and applicable
        if (!empty($role)) {
            php_execute(
                'UPDATE event_staff SET role = ? WHERE event_id = ? AND user_id = ?',
                [$role, $event['id'], $userId]
            );
        }

        echo json_encode([
            'success' => true,
            'message' => 'Credentials updated successfully.',
        ]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update credentials: ' . $e->getMessage()]);
        exit;
    }
}

// -----------------------------------------------------------------------------
// DELETE: Remove staff role assignment
// -----------------------------------------------------------------------------
if ($method === 'DELETE') {
    try {
        $session = check_team_access($event);

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
