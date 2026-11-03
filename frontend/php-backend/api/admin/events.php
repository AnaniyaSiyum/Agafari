<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — PHP API ADMIN EVENTS (GET, POST, PATCH, DELETE)
// DirectAdmin / LiteSpeed deployment endpoint for Super Admin Dashboard
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
// Helper: Format event for frontend Admin Dashboard expectations
// ---------------------------------------------------------------------------
function formatAdminEvent(array $e): array {
    $brideName = $e['bride_name'] ?? '';
    $groomName = $e['groom_name'] ?? '';
    $title = $e['title'] ?? ($brideName && $groomName ? "{$brideName} & {$groomName}'s Wedding" : 'Wedding Event');
    
    return [
        'id'                  => $e['id'],
        'slug'                => $e['slug'],
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
        'coupleEmail'         => $e['couple_email'] ?? null,
        'createdAt'           => $e['created_at'] ?? null,
    ];
}

// ---------------------------------------------------------------------------
// GET — List all platform events
// ---------------------------------------------------------------------------
if ($method === 'GET') {
    try {
        $sql = "
            SELECT e.*, 
                   u.email AS couple_email,
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
        php_execute("DELETE FROM events WHERE id = ?", [$eventId]);
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
