<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — PHP API EVENT DETAILS (GET / PATCH)
// Security fixes applied: strict CORS, auth guard on mutations, sanitized errors.
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

$slug = trim($_GET['slug'] ?? '');

if (empty($slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Event slug parameter missing.']);
    exit;
}

// ---------------------------------------------------------------------------
// GET — public read
// ---------------------------------------------------------------------------
if ($method === 'GET') {
    try {
        $event = php_query_one(
            'SELECT id, slug, title, bride_name, groom_name, event_date, start_time, second_event_date,
                    venue_name, venue_address, venue_map_url, dress_code, welcome_message, cover_image_url,
                    status, is_live, youtube_video_id, thank_you_message, thank_you_image_url,
                    template_id, template_customization_json
               FROM events
              WHERE LOWER(slug) = LOWER(?)',
            [$slug]
        );

        if (!$event) {
            http_response_code(404);
            echo json_encode(['error' => 'Event not found.']);
            exit;
        }

        $customization = json_decode($event['template_customization_json'] ?? '{}', true) ?: [];

        $formatted = [
            'id'             => $event['id'],
            'slug'           => $event['slug'],
            'title'          => $event['title'] ?: ($event['bride_name'] . ' & ' . $event['groom_name'] . "'s Wedding"),
            'brideName'      => $event['bride_name'],
            'groomName'      => $event['groom_name'],
            'eventDate'      => $event['event_date'],
            'startTime'      => $event['start_time'] ?: '14:00',
            'venueName'      => $event['venue_name'] ?: 'Wedding Venue',
            'venueAddress'   => $event['venue_address'] ?: '',
            'venueMapUrl'    => $event['venue_map_url'] ?: '',
            'dressCode'      => $event['dress_code'] ?: 'Formal Black Tie & Habesha Kemis',
            'welcomeMessage' => $event['welcome_message'] ?: 'We are overjoyed to welcome you to our special day!',
            'coverImageUrl'  => $event['cover_image_url'] ?: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
            'couplePhotoUrl' => $customization['couplePhotoUrl'] ?? ($event['cover_image_url'] ?: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800'),
            'status'         => $event['status'],
            'isLive'         => (bool) $event['is_live'],
            'youtubeVideoId' => $event['youtube_video_id'] ?: '',
            'loveStory'      => $customization['loveStory'] ?? [
                'headline'      => 'Our Journey to Forever',
                'firstMetDate'  => '2024-05-12',
                'firstMetStory' => $event['bride_name'] . ' and ' . $event['groom_name'] . ' first crossed paths on a sunny afternoon.',
                'proposalDate'  => '2025-12-25',
                'proposalStory' => 'During a weekend getaway, the proposal happened and she answered YES!',
            ],
            'programs'      => $customization['programs'] ?? [
                [
                    'id'          => 'p1',
                    'time'        => '10:00 AM',
                    'title'       => 'Holy Matrimony & Blessing',
                    'location'    => 'Holy Trinity Cathedral',
                    'description' => 'Sacred church wedding ceremony and exchange of rings.',
                ],
            ],
            'customization' => $customization,
        ];

        $locations = php_query(
            'SELECT label, address, map_url, order_index
               FROM event_locations
              WHERE event_id = ?
              ORDER BY order_index ASC',
            [$event['id']]
        );

        echo json_encode(['event' => $formatted, 'locations' => $locations]);
        exit;

    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Unable to retrieve event data.']);
        error_log('[Agafari details.php GET] ' . $e->getMessage());
    }

// ---------------------------------------------------------------------------
// PATCH / PUT — authenticated mutation
// Roles allowed: COUPLE (own event only), ORGANIZER_OWNER, SYSTEM_ADMIN, ADMIN
// ---------------------------------------------------------------------------
} elseif ($method === 'PATCH' || $method === 'PUT') {

    // Auth guard — must be authenticated with an allowed role
    $session = require_role(['COUPLE', 'ORGANIZER_OWNER', 'ORGANIZER', 'SYSTEM_ADMIN', 'ADMIN']);

    $input = json_decode(file_get_contents('php://input'), true) ?? [];

    try {
        $event = php_query_one(
            'SELECT id, couple_user_id, organizer_id, template_customization_json
               FROM events
              WHERE LOWER(slug) = LOWER(?)',
            [$slug]
        );

        if (!$event) {
            http_response_code(404);
            echo json_encode(['error' => 'Event not found.']);
            exit;
        }

        // Ownership check: COUPLEs may only edit their own event
        if ($session['role'] === 'COUPLE' && $event['couple_user_id'] !== $session['user_id']) {
            http_response_code(403);
            echo json_encode(['error' => 'You are not authorised to edit this event.']);
            exit;
        }

        // Merge customization JSON
        $currentCustomization = json_decode($event['template_customization_json'] ?? '{}', true) ?: [];
        if (isset($input['couplePhotoUrl'])) $currentCustomization['couplePhotoUrl'] = $input['couplePhotoUrl'];
        if (isset($input['loveStory']))      $currentCustomization['loveStory']      = $input['loveStory'];
        if (isset($input['programs']))       $currentCustomization['programs']        = $input['programs'];

        $sql = 'UPDATE events SET
                    bride_name                  = COALESCE(?, bride_name),
                    groom_name                  = COALESCE(?, groom_name),
                    title                       = COALESCE(?, title),
                    venue_name                  = COALESCE(?, venue_name),
                    venue_address               = COALESCE(?, venue_address),
                    venue_map_url               = COALESCE(?, venue_map_url),
                    event_date                  = COALESCE(?, event_date),
                    start_time                  = COALESCE(?, start_time),
                    dress_code                  = COALESCE(?, dress_code),
                    welcome_message             = COALESCE(?, welcome_message),
                    cover_image_url             = COALESCE(?, cover_image_url),
                    is_live                     = COALESCE(?, is_live),
                    youtube_video_id            = COALESCE(?, youtube_video_id),
                    status                      = COALESCE(?, status),
                    template_customization_json = ?
                WHERE id = ?';

        php_execute($sql, [
            $input['brideName']      ?? null,
            $input['groomName']      ?? null,
            $input['title']          ?? null,
            $input['venueName']      ?? null,
            $input['venueAddress']   ?? null,
            $input['venueMapUrl']    ?? null,
            $input['eventDate']      ?? null,
            $input['startTime']      ?? null,
            $input['dressCode']      ?? null,
            $input['welcomeMessage'] ?? null,
            $input['coverImageUrl']  ?? null,
            isset($input['isLive']) ? ($input['isLive'] ? 1 : 0) : null,
            $input['youtubeVideoId'] ?? null,
            $input['status']         ?? null,
            json_encode($currentCustomization),
            $event['id'],
        ]);

        $updated = php_query_one('SELECT * FROM events WHERE id = ?', [$event['id']]);
        echo json_encode(['success' => true, 'event' => $updated]);

    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Event update failed. Please try again later.']);
        error_log('[Agafari details.php PATCH] ' . $e->getMessage());
    }

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
}
