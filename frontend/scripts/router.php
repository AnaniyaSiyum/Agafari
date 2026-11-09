<?php
// =============================================================================
// AGAFARI — LOCALHOST DEV & PRODUCTION EMULATION ROUTER (PORT 3000)
// Emulates Apache mod_rewrite / DirectAdmin routing for static pages & PHP API
// =============================================================================

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$docRoot = __DIR__;

// 1. Serve physical static files directly (CSS, JS, images, audio, video, etc.)
$filePath = $docRoot . $uri;
if ($uri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    // If it's a php file directly requested, let PHP execute it
    if (str_ends_with($filePath, '.php')) {
        require $filePath;
        exit;
    }
    return false; // Built-in web server serves the static asset with native MIME type
}

// 2. Route API endpoints matching .htaccess rules
if (str_starts_with($uri, '/api/')) {
    // CORS headers for local testing
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    // Rewrite rules from .htaccess:
    if (preg_match('#^/api/auth/login/?$#', $uri)) {
        require $docRoot . '/api/auth/login.php';
        exit;
    }
    if (preg_match('#^/api/auth/verify-dashboard/?$#', $uri)) {
        require $docRoot . '/api/auth/verify-dashboard.php';
        exit;
    }
    if (preg_match('#^/api/auth/me/?$#', $uri)) {
        require $docRoot . '/api/auth/me.php';
        exit;
    }
    if (preg_match('#^/api/admin/events/?$#', $uri)) {
        require $docRoot . '/api/admin/events.php';
        exit;
    }
    if (preg_match('#^/api/admin/users/?$#', $uri)) {
        require $docRoot . '/api/admin/users.php';
        exit;
    }
    if (preg_match('#^/api/organizer/events/?$#', $uri)) {
        require $docRoot . '/api/organizer/events.php';
        exit;
    }
    if (preg_match('#^/api/organizer/media/?$#', $uri)) {
        require $docRoot . '/api/organizer/media.php';
        exit;
    }
    if (preg_match('#^/api/cms/?$#', $uri)) {
        require $docRoot . '/api/cms.php';
        exit;
    }
    if (preg_match('#^/api/events/([^/]+)/team/?$#', $uri, $m)) {
        $_GET['slug'] = $m[1];
        require $docRoot . '/api/events/team.php';
        exit;
    }
    if (preg_match('#^/api/events/([^/]+)/invitations/?$#', $uri, $m)) {
        $_GET['slug'] = $m[1];
        require $docRoot . '/api/events/invitations.php';
        exit;
    }
    if (preg_match('#^/api/events/([^/]+)/media/?$#', $uri, $m)) {
        $_GET['slug'] = $m[1];
        require $docRoot . '/api/organizer/media.php';
        exit;
    }
    if (preg_match('#^/api/events/([^/]+)/quota/?$#', $uri, $m)) {
        $_GET['slug'] = $m[1];
        $_GET['action'] = 'quota';
        require $docRoot . '/api/events/details.php';
        exit;
    }
    if (preg_match('#^/api/events/([^/]+)/music/?$#', $uri, $m)) {
        $_GET['slug'] = $m[1];
        $_GET['action'] = 'music';
        require $docRoot . '/api/events/details.php';
        exit;
    }
    if (preg_match('#^/api/events/([^/]+)/?$#', $uri, $m)) {
        $_GET['slug'] = $m[1];
        require $docRoot . '/api/events/details.php';
        exit;
    }
    if (preg_match('#^/api/qr/([^/]+)/?$#', $uri, $m)) {
        $_GET['code'] = $m[1];
        require $docRoot . '/api/qr/scan.php';
        exit;
    }

    // Direct php file under api/
    $directPhp = $docRoot . preg_replace('#\?.*$#', '', $uri);
    if (!str_ends_with($directPhp, '.php')) {
        $directPhp .= '.php';
    }
    if (file_exists($directPhp)) {
        require $directPhp;
        exit;
    }

    http_response_code(404);
    echo json_encode(['error' => 'API endpoint not found', 'path' => $uri]);
    exit;
}

// 3. Clean URLs for static HTML pages (matching .htaccess order)
$cleanUri = trim($uri, '/');

// Try exact file candidates:
$candidates = [
    $docRoot . '/' . $cleanUri . '.html',
    $docRoot . '/' . $cleanUri . '/index.html',
    $docRoot . '/' . $cleanUri . '/dashboard.html',
];

foreach ($candidates as $cand) {
    if (file_exists($cand) && is_file($cand)) {
        header('Content-Type: text/html; charset=utf-8');
        readfile($cand);
        exit;
    }
}

// 4. Sub-routes for staff & crew:
if (preg_match('#^([^/]+)/([^/]+)/couple/?$#', $cleanUri, $m)) {
    $_GET['org'] = $m[1];
    $_GET['slug'] = $m[2];
    header('Content-Type: text/html; charset=utf-8');
    readfile($docRoot . '/couple/dashboard.html');
    exit;
}
if (preg_match('#^([^/]+)/([^/]+)/scanner/?$#', $cleanUri, $m)) {
    $_GET['org'] = $m[1];
    $_GET['slug'] = $m[2];
    header('Content-Type: text/html; charset=utf-8');
    readfile($docRoot . '/scanner/index.html');
    exit;
}
if (preg_match('#^([^/]+)/([^/]+)/live-streamer/?$#', $cleanUri, $m)) {
    $_GET['org'] = $m[1];
    $_GET['slug'] = $m[2];
    header('Content-Type: text/html; charset=utf-8');
    readfile($docRoot . '/live-streamer/index.html');
    exit;
}
if (preg_match('#^([^/]+)/([^/]+)/moderation/?$#', $cleanUri, $m)) {
    $_GET['org'] = $m[1];
    $_GET['slug'] = $m[2];
    header('Content-Type: text/html; charset=utf-8');
    readfile($docRoot . '/moderation/index.html');
    exit;
}
// /:org/:slug -> dedicated event page or couple dashboard
if (preg_match('#^([^/]+)/([^/]+)/?$#', $cleanUri, $m)) {
    $_GET['org'] = $m[1];
    $_GET['slug'] = $m[2];
    header('Content-Type: text/html; charset=utf-8');
    readfile($docRoot . '/couple/dashboard.html');
    exit;
}

// 5. Fallback: index.html
if (file_exists($docRoot . '/index.html')) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($docRoot . '/index.html');
    exit;
}

http_response_code(404);
echo "404 Not Found";
