<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — PHP API QR GATE SCANNER CHECK-IN (POST)
// DirectAdmin / LiteSpeed endpoint for Gate Ticket Validation
// =============================================================================

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/middleware.php';

header('Content-Type: application/json; charset=utf-8');
send_cors_headers();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true) ?: [];

$codeFromUrl = trim($_GET['code'] ?? '');
$inviteCode = trim($body['inviteCode'] ?? $body['code'] ?? $codeFromUrl);
$eventId = trim($body['eventId'] ?? '');
$admitCount = max(1, (int)($body['admitCount'] ?? 1));

if (empty($inviteCode)) {
    http_response_code(400);
    echo json_encode(['result' => 'INVALID', 'message' => 'Invite code / ticket code is missing.']);
    exit;
}

try {
    if (!empty($eventId)) {
        $invitation = php_query_one(
            "SELECT * FROM invitations WHERE (UPPER(invite_code) = UPPER(?) OR id = ?) AND event_id = ?",
            [$inviteCode, $inviteCode, $eventId]
        );
    } else {
        $invitation = php_query_one(
            "SELECT * FROM invitations WHERE UPPER(invite_code) = UPPER(?) OR id = ?",
            [$inviteCode, $inviteCode]
        );
    }

    if (!$invitation) {
        http_response_code(404);
        echo json_encode([
            'result'  => 'INVALID',
            'message' => 'Invalid ticket. No matching invitation found for this event.',
        ]);
        exit;
    }

    $maxAllowed = (int)$invitation['max_guests'];
    $currentScanned = (int)$invitation['scanned_count'];

    if ($currentScanned >= $maxAllowed) {
        echo json_encode([
            'result'        => 'ALREADY_CHECKED_IN',
            'message'       => "Ticket already fully admitted ({$currentScanned}/{$maxAllowed} guests).",
            'attendee'      => [
                'guestName'    => $invitation['guest_name'],
                'tableNumber'  => $invitation['table_number'],
                'maxGuests'    => $maxAllowed,
                'scannedCount' => $currentScanned,
                'lastScannedAt'=> $invitation['scanned_at'],
            ],
        ]);
        exit;
    }

    $newScanned = min($maxAllowed, $currentScanned + $admitCount);

    php_execute(
        "UPDATE invitations 
            SET is_scanned = 1, 
                scanned_count = ?, 
                scanned_at = NOW(), 
                updated_at = NOW() 
          WHERE id = ?",
        [$newScanned, $invitation['id']]
    );

    echo json_encode([
        'result'   => 'SUCCESS',
        'message'  => "Admitted {$admitCount} guest(s) for {$invitation['guest_name']}.",
        'attendee' => [
            'id'           => $invitation['id'],
            'guestName'    => $invitation['guest_name'],
            'tableNumber'  => $invitation['table_number'],
            'maxGuests'    => $maxAllowed,
            'scannedCount' => $newScanned,
            'scannedAt'    => date('Y-m-d H:i:s'),
        ],
    ]);
    exit;
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['result' => 'ERROR', 'message' => 'Failed to process check-in: ' . $e->getMessage()]);
    exit;
}
