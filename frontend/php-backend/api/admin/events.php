<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — PHP API ADMIN EVENTS (GET, POST, PATCH, DELETE)
// DirectAdmin / LiteSpeed deployment endpoint for Super Admin Dashboard
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
// Helper: Format event for frontend Admin Dashboard expectations
// ---------------------------------------------------------------------------
function formatAdminEvent(array $e): array {
    $brideName = $e['bride_name'] ?? '';
    $groomName = $e['groom_name'] ?? '';
    $title = $e['title'] ?? ($brideName && $groomName ? "{$brideName} & {$groomName}'s Wedding" : 'Wedding Event');
    $slug = $e['slug'] ?? '';
    $coupleEmail = $e['couple_email'] ?? "couple@{$slug}.com";
    $coupleTempPassword = $e['couple_temp_password'] ?? 'agafari2026';
    
    return [
        'id'                  => $e['id'],
        'slug'                => $slug,
        'title'               => $title,
        'brideName'           => $brideName,
        'groomName'           => $groomName,
        'bride_name'          => $brideName,
        'groom_name'          => $groomName,
        'eventDate'           => $e['event_date'] ?? '',
        'event_date'          => $e['event_date'] ?? '',
        'startTime'           => $e['start_time'] ?? '14:00',
        'secondEventDate'     => $e['second_event_date'] ?? null,
        'venueName'           => $e['venue_name'] ?? '',
        'venue_name'          => $e['venue_name'] ?? '',
        'venueAddress'        => $e['venue_address'] ?? null,
        'venueMapUrl'         => $e['venue_map_url'] ?? null,
        'dressCode'           => $e['dress_code'] ?? null,
        'coverImageUrl'       => $e['cover_image_url'] ?? null,
        'status'              => $e['status'] ?? 'COMING_SOON',
        'adminApprovalStatus' => $e['admin_approval_status'] ?? 'APPROVED',
        'admin_approval_status'=> $e['admin_approval_status'] ?? 'APPROVED',
        'youtubeVideoId'      => $e['youtube_video_id'] ?? null,
        'isLive'              => (bool)($e['is_live'] ?? false),
        'is_live'             => (bool)($e['is_live'] ?? false),
        'managedBy'           => $e['managed_by'] ?? 'ADMIN',
        'organizerId'         => $e['organizer_id'] ?? null,
        'organizerName'       => $e['organizer_name'] ?? ($e['organizer_id'] ? 'Certified Organizer Agency' : 'Individual Event'),
        'coupleEmail'         => $coupleEmail,
        'createdAt'           => $e['created_at'] ?? null,
        'coupleCredentials'   => [
            'email'             => $coupleEmail,
            'temporaryPassword' => $coupleTempPassword,
        ],
        'credentials'         => [
            'couple'    => [
                'fullName'          => "{$brideName} & {$groomName}",
                'email'             => $coupleEmail,
                'temporaryPassword' => $coupleTempPassword,
                'role'              => 'BRIDE_GROOM',
            ],
            'scanner'   => [
                'fullName'          => 'Gate QR Scanner',
                'email'             => "scanner@{$slug}.com",
                'temporaryPassword' => 'scan123',
                'role'              => 'GATE_SCANNER',
            ],
            'streamer'  => [
                'fullName'          => 'Live Streamer Crew',
                'email'             => "streamer@{$slug}.com",
                'temporaryPassword' => 'stream123',
                'role'              => 'LIVE_STREAMER',
            ],
            'moderator' => [
                'fullName'          => 'Media Moderator Hub',
                'email'             => "moderator@{$slug}.com",
                'temporaryPassword' => 'mod123',
                'role'              => 'MODERATOR',
            ],
        ],
    ];
}

// ---------------------------------------------------------------------------
// GET — List all platform events
// ---------------------------------------------------------------------------
if ($method === 'GET') {
    try {
        $hasTempPass = false;
        try {
            $col = php_query_one("SHOW COLUMNS FROM users LIKE 'temporary_password'");
            if ($col) $hasTempPass = true;
        } catch (Throwable $e) {}

        $tempPassField = $hasTempPass ? 'u.temporary_password AS couple_temp_password' : 'NULL AS couple_temp_password';

        $sql = "
            SELECT e.*, 
                   u.email AS couple_email,
                   {$tempPassField},
                   o.business_name AS organizer_name
              FROM events e
         LEFT JOIN users u ON e.couple_user_id = u.id
         LEFT JOIN organizers o ON e.organizer_id = o.id
          ORDER BY e.created_at DESC
        ";
        $rows = php_query($sql);
        $events = array_map('formatAdminEvent', $rows);

        echo json_encode(['events' => $events]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to load events: ' . $e->getMessage()]);
        exit;
    }
}

// ---------------------------------------------------------------------------
// POST — Create a new platform wedding event (Super Admin direct creation)
// ---------------------------------------------------------------------------
if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true) ?: [];

    $brideName      = trim($body['brideName'] ?? $body['bride_name'] ?? '');
    $groomName      = trim($body['groomName'] ?? $body['groom_name'] ?? '');
    $eventDate      = trim($body['eventDate'] ?? $body['event_date'] ?? '');
    $venueName      = trim($body['venueName'] ?? $body['venue_name'] ?? '');
    $venueAddress   = trim($body['venueAddress'] ?? $body['venue_address'] ?? '');
    $dressCode      = trim($body['dressCode'] ?? $body['dress_code'] ?? '');
    $coupleEmail    = trim($body['coupleEmail'] ?? $body['couple_email'] ?? '');
    $title          = trim($body['title'] ?? '');
    $slug           = trim($body['slug'] ?? '');
    $expectedGuests = max(1, (int)($body['expectedGuests'] ?? $body['expected_guests'] ?? 300));
    $coverImageUrl  = trim($body['coverImageUrl'] ?? $body['cover_image_url'] ?? '');
    $managedBy      = strtoupper(trim($body['managedBy'] ?? 'ADMIN')) === 'ORGANIZER' ? 'ORGANIZER' : 'ADMIN';
    $rawOrgId       = trim($body['organizerId'] ?? $body['organizer_id'] ?? '');

    if (empty($brideName) || empty($groomName) || empty($venueName)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields (brideName, groomName, venueName).']);
        exit;
    }

    if (empty($title)) {
        $title = "{$brideName} & {$groomName}'s Wedding";
    }

    // Clean unique slug
    if (empty($slug)) {
        $base = strtolower(preg_replace('/[^a-z0-9]+/i', '-', "{$brideName}-and-{$groomName}"));
        $slug = trim($base, '-') ?: 'wedding-' . time();
    } else {
        $slug = strtolower(preg_replace('/[^a-z0-9-]+/i', '-', $slug));
        $slug = trim($slug, '-');
    }

    $existing = php_query_one('SELECT id FROM events WHERE slug = ? LIMIT 1', [$slug]);
    if ($existing) {
        $slug .= '-' . rand(100, 999);
    }

    $targetCoupleEmail = !empty($coupleEmail) ? $coupleEmail : "couple@{$slug}.com";
    $tempPassword      = 'agafari2026';
    $coupleFullName    = "{$brideName} & {$groomName}";
    $newEventId        = function_exists('generate_safe_id') ? generate_safe_id('evt-') : 'evt-' . substr(generate_uuid_v4(), 4);

    // Resolve couple role
    $targetRole = 'COUPLE';
    try {
        $colInfo = php_query_one("SHOW COLUMNS FROM users LIKE 'role'");
        $enumStr = $colInfo['Type'] ?? '';
        if (strpos($enumStr, 'BRIDE_GROOM') !== false && strpos($enumStr, 'COUPLE') === false) {
            $targetRole = 'BRIDE_GROOM';
        }
    } catch (Throwable $e) {}

    // Check temporary_password column support
    $hasTempPass = false;
    try {
        $col = php_query_one("SHOW COLUMNS FROM users LIKE 'temporary_password'");
        if ($col) {
            $hasTempPass = true;
        } else {
            php_execute("ALTER TABLE users ADD COLUMN temporary_password VARCHAR(255) NULL AFTER password_hash");
            $hasTempPass = true;
        }
    } catch (Throwable $ignored) {}

    // Check or create couple user
    $existingUser = php_query_one('SELECT id, role FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1', [$targetCoupleEmail]);
    if ($existingUser) {
        if (in_array(strtoupper($existingUser['role']), ['SYSTEM_ADMIN', 'SUPER_ADMIN', 'ADMIN'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Security Error: Cannot assign an administrative account as a wedding couple.']);
            exit;
        }
        $coupleUserId = $existingUser['id'];
        try {
            $hash = password_hash($tempPassword, PASSWORD_BCRYPT);
            if ($hasTempPass) {
                php_execute(
                    'UPDATE users SET full_name = ?, password_hash = ?, temporary_password = ? WHERE id = ?',
                    [$coupleFullName, $hash, $tempPassword, $coupleUserId]
                );
            } else {
                php_execute(
                    'UPDATE users SET full_name = ?, password_hash = ? WHERE id = ?',
                    [$coupleFullName, $hash, $coupleUserId]
                );
            }
        } catch (Throwable $e) {}
    } else {
        $coupleUserId = function_exists('generate_safe_id') ? generate_safe_id('usr-') : 'usr-' . substr(generate_uuid_v4(), 4);
        $hash = password_hash($tempPassword, PASSWORD_BCRYPT);
        try {
            if ($hasTempPass) {
                php_execute(
                    'INSERT INTO users (id, email, password_hash, temporary_password, full_name, role, is_active, created_at)
                     VALUES (?, ?, ?, ?, ?, ?, 1, NOW())',
                    [$coupleUserId, $targetCoupleEmail, $hash, $tempPassword, $coupleFullName, $targetRole]
                );
            } else {
                php_execute(
                    'INSERT INTO users (id, email, password_hash, full_name, role, is_active, created_at)
                     VALUES (?, ?, ?, ?, ?, 1, NOW())',
                    [$coupleUserId, $targetCoupleEmail, $hash, $coupleFullName, $targetRole]
                );
            }
        } catch (Throwable $e) {
            php_execute(
                'INSERT INTO users (id, email, password_hash, full_name, role)
                 VALUES (?, ?, ?, ?, ?)',
                [$coupleUserId, $targetCoupleEmail, $hash, $coupleFullName, $targetRole]
            );
        }
    }

    // Resolve template_id safely
    $validTemplateId = null;
    try {
        $tRow = php_query_one('SELECT id FROM templates ORDER BY created_at ASC LIMIT 1');
        if ($tRow) {
            $validTemplateId = $tRow['id'];
        }
    } catch (Throwable $e) {}

    // Resolve organizer_id safely
    $validOrgId = null;
    if (!empty($rawOrgId)) {
        try {
            $orgRow = php_query_one('SELECT id FROM organizers WHERE id = ? OR owner_user_id = ? LIMIT 1', [$rawOrgId, $rawOrgId]);
            if ($orgRow) {
                $validOrgId = $orgRow['id'];
            }
        } catch (Throwable $e) {}
    }

    $formattedDate = !empty($eventDate) ? date('Y-m-d H:i:s', strtotime($eventDate)) : date('Y-m-d 14:00:00', strtotime('+30 days'));

    // Check expected_guests column
    $hasExpectedGuestsCol = false;
    try {
        $col = php_query_one("SHOW COLUMNS FROM events LIKE 'expected_guests'");
        if ($col) {
            $hasExpectedGuestsCol = true;
        } else {
            php_execute("ALTER TABLE events ADD COLUMN expected_guests INT DEFAULT 300 AFTER dress_code");
            $hasExpectedGuestsCol = true;
        }
    } catch (Throwable $ignored) {}

    $customizationJson = json_encode(['expectedGuests' => $expectedGuests]);

    try {
        if ($hasExpectedGuestsCol) {
            php_execute(
                'INSERT INTO events (
                    id, slug, title, managed_by, organizer_id, couple_user_id, template_id,
                    template_customization_json, bride_name, groom_name, event_date, venue_name, venue_address,
                    dress_code, cover_image_url, expected_guests, status, admin_approval_status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "COMING_SOON", "APPROVED", NOW())',
                [
                    $newEventId,
                    $slug,
                    $title,
                    $managedBy,
                    $validOrgId,
                    $coupleUserId,
                    $validTemplateId,
                    $customizationJson,
                    $brideName,
                    $groomName,
                    $formattedDate,
                    $venueName,
                    $venueAddress ?: null,
                    $dressCode ?: null,
                    $coverImageUrl ?: null,
                    $expectedGuests
                ]
            );
        } else {
            php_execute(
                'INSERT INTO events (
                    id, slug, title, managed_by, organizer_id, couple_user_id, template_id,
                    template_customization_json, bride_name, groom_name, event_date, venue_name, venue_address,
                    dress_code, cover_image_url, status, admin_approval_status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "COMING_SOON", "APPROVED", NOW())',
                [
                    $newEventId,
                    $slug,
                    $title,
                    $managedBy,
                    $validOrgId,
                    $coupleUserId,
                    $validTemplateId,
                    $customizationJson,
                    $brideName,
                    $groomName,
                    $formattedDate,
                    $venueName,
                    $venueAddress ?: null,
                    $dressCode ?: null,
                    $coverImageUrl ?: null
                ]
            );
        }

        $inserted = php_query_one(
            'SELECT e.*, 
                    u.email AS couple_email,
                    o.business_name AS organizer_name
               FROM events e
          LEFT JOIN users u ON e.couple_user_id = u.id
          LEFT JOIN organizers o ON e.organizer_id = o.id
              WHERE e.id = ?',
            [$newEventId]
        );

        $orgSlugPart = $validOrgId ? "org-{$validOrgId}" : "org-{$slug}";

        http_response_code(201);
        echo json_encode([
            'success'            => true,
            'message'            => 'Wedding event created successfully.',
            'event'              => $inserted ? formatAdminEvent($inserted) : null,
            'coupleCredentials'  => [
                'email'             => $targetCoupleEmail,
                'temporaryPassword' => $tempPassword,
            ],
            'adminControlUrl'    => "/admin/event/{$slug}",
        ]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create event: ' . $e->getMessage()]);
        exit;
    }
}

// ---------------------------------------------------------------------------
// PATCH — Approve, reject, or update event
// ---------------------------------------------------------------------------
if ($method === 'PATCH') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true) ?: [];

    $eventId = trim($body['eventId'] ?? $body['id'] ?? '');
    if (empty($eventId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing eventId.']);
        exit;
    }

    $allowedFields = [
        'adminApprovalStatus' => 'admin_approval_status',
        'status'              => 'status',
        'title'               => 'title',
        'venueName'           => 'venue_name',
        'venueAddress'        => 'venue_address',
        'isLive'              => 'is_live',
        'youtubeVideoId'      => 'youtube_video_id',
    ];

    $updates = [];
    $params = [];

    foreach ($allowedFields as $jsonKey => $dbCol) {
        if (array_key_exists($jsonKey, $body)) {
            $val = $body[$jsonKey];
            if ($dbCol === 'is_live') {
                $val = $val ? 1 : 0;
            }
            $updates[] = "{$dbCol} = ?";
            $params[] = $val;
        }
    }

    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid fields provided to update.']);
        exit;
    }

    $params[] = $eventId;
    $sql = "UPDATE events SET " . implode(', ', $updates) . ", updated_at = NOW() WHERE id = ?";

    try {
        php_execute($sql, $params);
        $updated = php_query_one("SELECT * FROM events WHERE id = ?", [$eventId]);

        echo json_encode([
            'success' => true,
            'message' => 'Event updated successfully.',
            'event'   => $updated ? formatAdminEvent($updated) : null,
        ]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update event: ' . $e->getMessage()]);
        exit;
    }
}

// ---------------------------------------------------------------------------
// DELETE — Remove event
// ---------------------------------------------------------------------------
if ($method === 'DELETE') {
    $eventId = trim($_GET['id'] ?? $_GET['eventId'] ?? '');
    if (empty($eventId)) {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?: [];
        $eventId = trim($body['id'] ?? $body['eventId'] ?? '');
    }

    if (empty($eventId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing eventId.']);
        exit;
    }

    try {
        $eventRow = php_query_one("SELECT id, slug FROM events WHERE id = ? OR slug = ? LIMIT 1", [$eventId, $eventId]);
        if (!$eventRow) {
            http_response_code(404);
            echo json_encode(['error' => 'Event not found.']);
            exit;
        }
        $actualEventId = $eventRow['id'];

        php_with_transaction(function() use ($actualEventId) {
            $tablesWithEventId = [
                'quota_groups',
                'event_staff',
                'invitations',
                'rsvps',
                'wishes',
                'media_assets',
                'live_streams',
                'mezmur_songs',
                'event_locations',
                'gate_scan_logs'
            ];
            foreach ($tablesWithEventId as $tbl) {
                try {
                    php_execute("DELETE FROM `{$tbl}` WHERE event_id = ?", [$actualEventId]);
                } catch (Throwable $ignored) {
                    // Table might not exist or columns might vary
                }
            }
            php_execute("DELETE FROM events WHERE id = ?", [$actualEventId]);
        });

        echo json_encode(['success' => true, 'message' => 'Event deleted successfully.']);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete event: ' . $e->getMessage()]);
        exit;
    }
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
