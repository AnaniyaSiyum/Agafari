<?php
// =============================================================================
// AGAFARI — ORGANIZER EVENTS API CONTROLLER (PHP FOR CPANEL / DIRECTADMIN)
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

// -----------------------------------------------------------------------------
// GET: List all events for the organizer
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    try {
        $events = php_query(
            'SELECT e.*, 
                    u.email AS couple_email, 
                    u.temporary_password AS couple_temp_password,
                    u.full_name AS couple_full_name
             FROM events e
             LEFT JOIN users u ON u.id = e.couple_user_id
             ORDER BY e.created_at DESC'
        );

        // Format events list to match Next.js payload format
        $formatted = array_map(function($ev) {
            return [
                'id'                   => $ev['id'],
                'slug'                 => $ev['slug'],
                'title'                => $ev['title'],
                'brideName'            => $ev['bride_name'],
                'groomName'            => $ev['groom_name'],
                'eventDate'            => $ev['event_date'],
                'venueName'            => $ev['venue_name'],
                'venueAddress'         => $ev['venue_address'] ?? '',
                'dressCode'            => $ev['dress_code'] ?? '',
                'status'               => $ev['status'] ?? 'COMING_SOON',
                'expectedGuests'       => (int)($ev['expected_guests'] ?? 300),
                'templateId'           => $ev['template_id'] ?? 'luxury-gold',
                'adminApprovalStatus'  => $ev['admin_approval_status'] ?? 'APPROVED',
                'couple'               => [
                    'email'             => $ev['couple_email'] ?? '',
                    'temporaryPassword' => $ev['couple_temp_password'] ?? '',
                    'fullName'          => $ev['couple_full_name'] ?? '',
                ],
            ];
        }, $events);

        echo json_encode([
            'success'       => true,
            'events'        => $formatted,
            'organizerInfo' => [
                'agencyName'          => 'Certified Agafari Event Agency',
                'fullName'            => 'Event Organizer Admin',
                'email'               => 'organizer@agafari.com',
                'activeHostingCount'  => count($formatted),
                'hostedArchiveCount'  => 0,
            ],
        ]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to load events: ' . $e->getMessage()]);
        exit;
    }
}

// -----------------------------------------------------------------------------
// POST: Create a new wedding event
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    try {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?: $_POST;

        $brideName      = trim($body['brideName'] ?? '');
        $groomName      = trim($body['groomName'] ?? '');
        $eventDate      = trim($body['eventDate'] ?? '');
        $venueName      = trim($body['venueName'] ?? '');
        $venueAddress   = trim($body['venueAddress'] ?? '');
        $dressCode      = trim($body['dressCode'] ?? '');
        $coupleEmail    = trim($body['coupleEmail'] ?? '');
        $templateId     = trim($body['templateId'] ?? 'luxury-gold');
        $expectedGuests = max(1, (int)($body['expectedGuests'] ?? 300));
        $title          = trim($body['title'] ?? '');

        if (empty($brideName) || empty($groomName) || empty($eventDate) || empty($venueName)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields (brideName, groomName, eventDate, venueName).']);
            exit;
        }

        if (empty($title)) {
            $title = "{$brideName} & {$groomName}'s Wedding";
        }

        // Generate clean unique slug
        $baseSlug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', "{$brideName}-and-{$groomName}"));
        $baseSlug = trim($baseSlug, '-');
        $cleanSlug = $baseSlug ?: 'wedding-' . time();

        // Check if slug already exists
        $existing = php_query_one('SELECT id FROM events WHERE slug = ? LIMIT 1', [$cleanSlug]);
        if ($existing) {
            $cleanSlug .= '-' . rand(100, 999);
        }

        $targetCoupleEmail = !empty($coupleEmail) ? $coupleEmail : "couple@{$cleanSlug}.com";
        $tempPassword      = 'agafari' . rand(1000, 9999);
        $coupleFullName    = "{$brideName} & {$groomName}";
        $newEventId        = function_exists('generate_safe_id') ? generate_safe_id('evt-') : 'evt-' . substr(generate_uuid_v4(), 4);

        // Check supported role enum
        $targetRole = 'COUPLE';
        try {
            $colInfo = php_query_one("SHOW COLUMNS FROM users LIKE 'role'");
            $enumStr = $colInfo['Type'] ?? '';
            if (strpos($enumStr, 'BRIDE_GROOM') !== false && strpos($enumStr, 'COUPLE') === false) {
                $targetRole = 'BRIDE_GROOM';
            }
        } catch (Throwable $ignored) {}

        // Check or create couple user in users table
        $existingUser = php_query_one('SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1', [$targetCoupleEmail]);
        if ($existingUser) {
            $coupleUserId = $existingUser['id'];
            try {
                php_execute(
                    'UPDATE users SET role = ?, full_name = ?, password_hash = ? WHERE id = ?',
                    [$targetRole, $coupleFullName, hash_password_php($tempPassword), $coupleUserId]
                );
            } catch (Throwable $e) {}
        } else {
            $coupleUserId = function_exists('generate_safe_id') ? generate_safe_id('usr-') : 'usr-' . substr(generate_uuid_v4(), 4);
            try {
                php_execute(
                    'INSERT INTO users (id, email, password_hash, full_name, role, is_active, created_at)
                     VALUES (?, ?, ?, ?, ?, 1, NOW())',
                    [$coupleUserId, $targetCoupleEmail, hash_password_php($tempPassword), $coupleFullName, $targetRole]
                );
            } catch (Throwable $e) {
                // Fallback for tables with status instead of is_active
                php_execute(
                    'INSERT INTO users (id, email, password_hash, full_name, role)
                     VALUES (?, ?, ?, ?, ?)',
                    [$coupleUserId, $targetCoupleEmail, hash_password_php($tempPassword), $coupleFullName, $targetRole]
                );
            }
        }

        // Format date string safely
        $formattedDate = date('Y-m-d H:i:s', strtotime($eventDate));

        // Insert new wedding event
        php_execute(
            'INSERT INTO events (
                id, slug, title, managed_by, couple_user_id, template_id,
                bride_name, groom_name, event_date, venue_name, venue_address, dress_code,
                expected_guests, status, admin_approval_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $newEventId,
                $cleanSlug,
                $title,
                'ORGANIZER',
                $coupleUserId,
                $templateId,
                $brideName,
                $groomName,
                $formattedDate,
                $venueName,
                $venueAddress,
                $dressCode,
                $expectedGuests,
                'COMING_SOON',
                'APPROVED'
            ]
        );

        $createdEvent = php_query_one('SELECT * FROM events WHERE id = ?', [$newEventId]);

        http_response_code(201);
        echo json_encode([
            'success'            => true,
            'event'              => $createdEvent,
            'coupleEmail'        => $targetCoupleEmail,
            'coupleTempPassword' => $tempPassword,
        ]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Event creation failed: ' . $e->getMessage()]);
        exit;
    }
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed.']);
