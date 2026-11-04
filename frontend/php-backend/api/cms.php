<?php

// AGAFARI (አጋፋሪ) — PHP API CMS SECTIONS (GET)

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
    $backendBase = __DIR__ . '/..';
}

require_once $backendBase . '/config/db.php';
require_once $backendBase . '/lib/middleware.php';

header('Content-Type: application/json; charset=utf-8');
send_cors_headers();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $rows = php_query("SELECT id, section_key, content_json, updated_at FROM cms_sections ORDER BY section_key ASC");
    $cmsData = [];
    foreach ($rows as $r) {
        $val = $r['content_json'];
        if (is_string($val)) {
            $decoded = json_decode($val, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $val = $decoded;
            }
        }
        $cmsData[$r['section_key']] = $val;
    }
    echo json_encode(['cms' => $cmsData, 'sections' => $rows]);
    exit;
} catch (Throwable $e) {
    $fallbackCms = [
        'memories_powered_by_agafari_card' => [
            'title' => 'Memories Powered by Agafari Card',
            'description' => 'Candid video blessings and authentic photos captured by loved ones across every table.',
            'enabled' => true,
        ],
        'packages' => [
            'silverTitle' => 'Silver Cultural Package',
            'goldTitle' => 'Gold Royal Package',
            'platTitle' => 'Platinum Executive Package',
            'enabled' => true,
        ],
        'experience_agafari_live' => [
            'title' => 'Experience Agafari Operation Live',
            'description' => 'Live interactive simulator demonstrating gate pass scanning, digital RSVPs, and video feeds.',
            'enabled' => true,
        ],
    ];
    echo json_encode(['cms' => $fallbackCms, 'note' => 'Fallback CMS']);
    exit;
}
