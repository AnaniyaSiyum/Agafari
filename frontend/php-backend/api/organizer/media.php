<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — PHP API ORGANIZER MEDIA (GET, POST, DELETE)
// DirectAdmin / LiteSpeed endpoint for Media Wall & Gallery
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
// GET — Retrieve media assets
// ---------------------------------------------------------------------------
if ($method === 'GET') {
    $eventId = trim($_GET['eventId'] ?? $_GET['id'] ?? '');
    $slug = trim($_GET['slug'] ?? '');

    try {
        if (!empty($slug)) {
            $ev = php_query_one("SELECT id FROM events WHERE LOWER(slug) = LOWER(?)", [$slug]);
            if ($ev) $eventId = $ev['id'];
        }

        if (!empty($eventId)) {
            $rows = php_query(
                "SELECT * FROM media_assets WHERE event_id = ? ORDER BY created_at DESC",
                [$eventId]
            );
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

    $id = 'med-' . generate_uuid();

    try {
        php_execute(
            "INSERT INTO media_assets (id, event_id, uploader_name, media_type, category, cdn_url, caption, status, created_at)
             VALUES (?, ?, ?, ?, 'WISHES', ?, ?, 'APPROVED', NOW())",
            [$id, $eventId ?: 'global', $uploaderName, $mediaType, $cdnUrl, $caption]
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
