<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — PHP API ORGANIZER MEDIA (GET, POST, DELETE)
// DirectAdmin / LiteSpeed endpoint for Media Wall & Gallery
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

// ---------------------------------------------------------------------------
// GET — Retrieve media assets
// ---------------------------------------------------------------------------
if ($method === 'GET') {
    $rawId = trim($_GET['eventId'] ?? $_GET['id'] ?? '');
    $slug  = trim($_GET['slug'] ?? '');

    try {
        if (!empty($slug)) {
            $ev = php_query_one("SELECT id FROM events WHERE LOWER(slug) = LOWER(?)", [$slug]);
            if ($ev) $rawId = $ev['id'];
        }

        if (!empty($rawId)) {
            $stripped = preg_replace('/^org-/', '', $rawId);

            // 1. First check if it is a specific event_id
            $isEvent = php_query_one("SELECT id FROM events WHERE id = ? LIMIT 1", [$rawId]);
            if ($isEvent) {
                $rows = php_query(
                    "SELECT * FROM media_assets WHERE event_id = ? ORDER BY created_at DESC",
                    [$rawId]
                );
            } else {
                // 2. Otherwise scope by organizer's events
                $rows = php_query(
                    "SELECT m.* 
                       FROM media_assets m 
                       JOIN events e ON e.id = m.event_id 
                      WHERE e.organizer_id = ? 
                         OR e.organizer_id = ? 
                         OR e.organizer_id = ?
                   ORDER BY m.created_at DESC",
                    [$rawId, $stripped, "org-{$stripped}"]
                );
            }
        } else {
            $rows = php_query("SELECT * FROM media_assets ORDER BY created_at DESC LIMIT 100");
        }

        $assets = array_map(function ($m) {
            return [
                'id'            => $m['id'],
                'eventId'       => $m['event_id'],
                'uploaderName'  => $m['uploader_name'] ?? 'Guest',
                'mediaType'     => $m['media_type'] ?? 'IMAGE',
                'category'      => $m['category'] ?? 'WISHES',
                'cdnUrl'        => $m['cdn_url'],
                'thumbnailUrl'  => $m['thumbnail_url'] ?? $m['cdn_url'],
                'caption'       => $m['caption'] ?? '',
                'status'        => $m['status'] ?? 'APPROVED',
                'isFeatured'    => (bool)($m['is_featured'] ?? false),
                'createdAt'     => $m['created_at'],
            ];
        }, $rows);

        echo json_encode(['mediaAssets' => $assets]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to load media: ' . $e->getMessage()]);
        exit;
    }
}

// ---------------------------------------------------------------------------
// POST — Add / Upload media asset
// ---------------------------------------------------------------------------
if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true) ?: [];

    $eventId = trim($body['eventId'] ?? '');
    $cdnUrl = trim($body['cdnUrl'] ?? $body['url'] ?? '');
    $uploaderName = trim($body['uploaderName'] ?? 'Guest');
    $mediaType = strtoupper(trim($body['mediaType'] ?? 'IMAGE'));
    $caption = trim($body['caption'] ?? '');

    if (empty($cdnUrl)) {
        http_response_code(400);
        echo json_encode(['error' => 'Media URL (cdnUrl) is required.']);
        exit;
    }

    $session = get_authenticated_user();
    $privilegedRoles = ['SYSTEM_ADMIN', 'SUPER_ADMIN', 'ADMIN', 'EVENT_ORGANIZER', 'COUPLE', 'MODERATOR', 'MEDIA_MODERATOR'];
    $isPrivileged = $session && in_array($session['role'] ?? '', $privilegedRoles, true);
    $status = $isPrivileged ? 'APPROVED' : 'PENDING';

    $id = function_exists('generate_safe_id') ? generate_safe_id('med-') : 'med-' . substr(generate_uuid_v4(), 4);

    try {
        php_execute(
            "INSERT INTO media_assets (id, event_id, uploader_name, media_type, category, cdn_url, caption, status, created_at)
             VALUES (?, ?, ?, ?, 'WISHES', ?, ?, ?, NOW())",
            [$id, $eventId ?: 'global', $uploaderName, $mediaType, $cdnUrl, $caption, $status]
        );

        echo json_encode([
            'success' => true,
            'message' => 'Media asset added successfully.',
            'media'   => [
                'id'           => $id,
                'eventId'      => $eventId,
                'cdnUrl'       => $cdnUrl,
                'uploaderName' => $uploaderName,
                'caption'      => $caption,
                'status'       => $status,
            ],
        ]);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add media: ' . $e->getMessage()]);
        exit;
    }
}

// ---------------------------------------------------------------------------
// DELETE — Delete media asset
// ---------------------------------------------------------------------------
if ($method === 'DELETE') {
    $session = require_auth();
    $allowedRoles = ['SYSTEM_ADMIN', 'SUPER_ADMIN', 'ADMIN', 'EVENT_ORGANIZER', 'COUPLE', 'MODERATOR', 'MEDIA_MODERATOR'];
    if (!in_array($session['role'] ?? '', $allowedRoles, true)) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden: insufficient permissions to delete media.']);
        exit;
    }

    $id = trim($_GET['id'] ?? '');
    if (empty($id)) {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?: [];
        $id = trim($body['id'] ?? '');
    }

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing media id.']);
        exit;
    }

    // Tenant authorization check
    if (!in_array($session['role'] ?? '', ['SYSTEM_ADMIN', 'SUPER_ADMIN', 'ADMIN'], true)) {
        $asset = php_query_one(
            "SELECT m.id, m.event_id, e.organizer_id, e.couple_user_id 
               FROM media_assets m 
          LEFT JOIN events e ON e.id = m.event_id 
              WHERE m.id = ? LIMIT 1",
            [$id]
        );
        if (!$asset) {
            http_response_code(404);
            echo json_encode(['error' => 'Media asset not found.']);
            exit;
        }

        $userId = $session['user_id'] ?? '';
        $isOwner = (!empty($asset['organizer_id']) && ($asset['organizer_id'] === $userId || $asset['organizer_id'] === 'org-' . $userId))
                || (!empty($asset['couple_user_id']) && $asset['couple_user_id'] === $userId);

        if (!$isOwner) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden: not authorized to delete this media asset.']);
            exit;
        }
    }

    try {
        php_execute("DELETE FROM media_assets WHERE id = ?", [$id]);
        echo json_encode(['success' => true, 'message' => 'Media deleted successfully.']);
        exit;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete media: ' . $e->getMessage()]);
        exit;
    }
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
