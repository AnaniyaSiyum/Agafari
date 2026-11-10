<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — PHP API ADMIN CLEAN SLATE
// Endpoint to reset the platform and remove all roles/data except System Admin
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

header('Content-Type: application/json; charset=utf-8');
send_cors_headers();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Require System Admin authentication
$adminSession = require_role(['SYSTEM_ADMIN', 'SUPER_ADMIN', 'ADMIN']);

try {
    $pdo = getPdoConnection();
    if (!$pdo) {
        throw new Exception("Database connection failure.");
    }

    $tablesToClear = [
        'post_likes',
        'media_comments',
        'media_assets',
        'wishes',
        'rsvps',
        'invitations',
        'event_staff',
        'event_locations',
        'live_streams',
        'mezmur_playlist',
        'events',
        'organizers',
        'account_requests',
    ];

    $ops = [];
    foreach ($tablesToClear as $tbl) {
        try {
            $deleted = $pdo->exec("DELETE FROM {$tbl}");
            $ops[] = "Cleared table {$tbl} ({$deleted} rows)";
        } catch (Throwable $e) {
            $ops[] = "Table {$tbl}: " . $e->getMessage();
        }
    }

    $deletedMem = $pdo->exec("DELETE FROM memberships WHERE role != 'SYSTEM_ADMIN'");
    $ops[] = "Cleared non-SYSTEM_ADMIN memberships ({$deletedMem} rows)";

    $deletedUsers = $pdo->exec("DELETE FROM users WHERE LOWER(email) != 'admin@agafari.com' AND role != 'SYSTEM_ADMIN'");
    $ops[] = "Cleared all non-SYSTEM_ADMIN users ({$deletedUsers} rows)";

    // Ensure system admin exists and is active
    $admin = $pdo->query("SELECT id, email FROM users WHERE LOWER(email) = 'admin@agafari.com'")->fetch(PDO::FETCH_ASSOC);
    if (!$admin) {
        $adminId = 'usr-admin-1';
        $adminPass = 'Admin123!';
        $adminHash = password_hash($adminPass, PASSWORD_BCRYPT);
        $pdo->prepare("
            INSERT INTO users (id, email, phone, full_name, role, password_hash, temporary_password, is_active, created_at)
            VALUES (?, 'admin@agafari.com', '+251911000000', 'System Super Admin', 'SYSTEM_ADMIN', ?, ?, 1, NOW())
        ")->execute([$adminId, $adminHash, $adminPass]);
        $ops[] = "Recreated System Super Admin account";
    } else {
        $adminId = $admin['id'];
        $pdo->prepare("UPDATE users SET role = 'SYSTEM_ADMIN', is_active = 1 WHERE id = ?")->execute([$adminId]);
        $ops[] = "Verified System Super Admin active state";
    }

    echo json_encode([
        'success' => true,
        'message' => 'Clean slate executed successfully. Only System Super Admin remains.',
        'operations' => $ops
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
