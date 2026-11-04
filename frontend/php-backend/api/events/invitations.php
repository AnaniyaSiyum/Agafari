<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — PHP API EVENT INVITATIONS & RSVPS (GET, POST, DELETE)
// DirectAdmin / LiteSpeed endpoint for Guest List & QR Tickets
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

$slug = trim($_GET['slug'] ?? '');
if (empty($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing event slug.']);
    exit;
}

$event = php_query_one("SELECT id, slug, title FROM events WHERE LOWER(slug) = LOWER(?)", [$slug]);
if (!$event) {
    http_response_code(404);
    echo json_encode(['error' => 'Event not found.']);
    exit;
}
$eventId = $event['id'];

// ---------------------------------------------------------------------------
// GET — Retrieve guest invitations
// ---------------------------------------------------------------------------
if ($method === 'GET') {
    try {
        $rows = php_query(
            "SELECT * FROM invitations WHERE event_id = ? ORDER BY created_at DESC",
            [$eventId]
        );

        $invitations = array_map(function ($inv) {
            return [
                'id'           => $inv['id'],
                'eventId'      => $inv['event_id'],
                'inviteCode'   => $inv['invite_code'],
                'invite_code'  => $inv['invite_code'],
                'guestName'    => $inv['guest_name'],
                'guest_name'   => $inv['guest_name'],
                'guestPhone'   => $inv['guest_phone'],
                'maxGuests'    => (int)$inv['max_guests'],
                'max_guests'   => (int)$inv['max_guests'],
                'tableNumber'  => $inv['table_number'],
                'rsvpStatus'   => $inv['rsvp_status'],
                'rsvp_status'  => $inv['rsvp_status'],
                'attendingCount'=> (int)($inv['attending_headcount'] ?? 0),
                'isScanned'    => (bool)$inv['is_scanned'],
                'is_scanned'   => (bool)$inv['is_scanned'],
                'scannedCount' => (int)$inv['scanned_count'],
                'qrCodeUrl'    => $inv['qr_code_url'],
                'createdAt'    => $inv['created_at'],
            ];
        }, $rows);

        echo json_encode(['invitations' => $invitations]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to load invitations: ' . $e->getMessage()]);
        exit;
    }
}

// ---------------------------------------------------------------------------
// POST — Create guest invitation / ticket
// ---------------------------------------------------------------------------
if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true) ?: [];

    $guestName = trim($body['guestName'] ?? $body['name'] ?? '');
    $guestPhone = trim($body['guestPhone'] ?? $body['phone'] ?? '');
    $maxGuests = max(1, (int)($body['maxGuests'] ?? 1));
    $tableNumber = trim($body['tableNumber'] ?? '');

    if (empty($guestName)) {
        http_response_code(400);
        echo json_encode(['error' => 'Guest name is required.']);
        exit;
    }

    $id = function_exists('generate_safe_id') ? generate_safe_id('inv-') : 'inv-' . substr(generate_uuid_v4(), 4);
    $inviteCode = strtoupper(substr(md5(uniqid((string)mt_rand(), true)), 0, 8));
    $qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" . urlencode($inviteCode);

    try {
        php_execute(
            "INSERT INTO invitations (id, event_id, invite_code, invite_type, guest_name, guest_phone, max_guests, table_number, rsvp_status, qr_code_url, created_at)
             VALUES (?, ?, ?, 'CARD', ?, ?, ?, ?, 'PENDING', ?, NOW())",
            [$id, $eventId, $inviteCode, $guestName, $guestPhone ?: null, $maxGuests, $tableNumber ?: null, $qrUrl]
        );

        echo json_encode([
            'success'    => true,
            'message'    => 'Invitation created successfully.',
            'invitation' => [
                'id'          => $id,
                'eventId'     => $eventId,
                'inviteCode'  => $inviteCode,
                'guestName'   => $guestName,
                'maxGuests'   => $maxGuests,
                'tableNumber' => $tableNumber,
                'qrCodeUrl'   => $qrUrl,
                'rsvpStatus'  => 'PENDING',
            ],
        ]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create invitation: ' . $e->getMessage()]);
        exit;
    }
}

// ---------------------------------------------------------------------------
// DELETE — Delete guest invitation
// ---------------------------------------------------------------------------
if ($method === 'DELETE') {
    $id = trim($_GET['id'] ?? '');
    if (empty($id)) {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?: [];
        $id = trim($body['id'] ?? '');
    }

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing invitation id.']);
        exit;
    }

    try {
        php_execute("DELETE FROM invitations WHERE id = ? AND event_id = ?", [$id, $eventId]);
        echo json_encode(['success' => true, 'message' => 'Invitation deleted successfully.']);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete invitation: ' . $e->getMessage()]);
        exit;
    }
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
