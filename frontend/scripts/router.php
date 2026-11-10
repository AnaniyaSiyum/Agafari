<?php
// =============================================================================
// AGAFARI — LOCALHOST DEV & PRODUCTION EMULATION ROUTER (PORT 3000)
// Emulates Apache mod_rewrite / DirectAdmin routing for static pages & PHP API
// =============================================================================

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$docRoot = __DIR__;

// Security Guard: Block direct access to sensitive config files, database scripts, and hidden paths
if (
    preg_match('#^/(config|db|\.git)/#i', $uri) ||
    preg_match('#\.(ini|env|sql|log|sh|bak|cfg|conf)$#i', $uri) ||
    preg_match('#/(db_config|db)\.php$#i', $uri)
) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo "403 Forbidden: Access denied.";
    exit;
}

// 1. Serve physical static files directly (CSS, JS, images, audio, video, etc.)
$filePath = $docRoot . $uri;
if ($uri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    // If it's a php file directly requested, only permit if inside api/
    if (str_ends_with($filePath, '.php')) {
        $realPath = realpath($filePath);
        $realApi = realpath($docRoot . '/api');
        if ($realPath && $realApi && str_starts_with($realPath, $realApi)) {
            require $filePath;
            exit;
        }
        http_response_code(403);
        header('Content-Type: text/plain; charset=utf-8');
        echo "403 Forbidden: Direct script execution not allowed.";
        exit;
    }
    return false; // Built-in web server serves the static asset with native MIME type
}

// 2. Route API endpoints matching .htaccess rules
if (str_starts_with($uri, '/api/')) {
    // Safe CORS handling
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin) || preg_match('#^https?://([a-z0-9-]+\.)?agafari\.com$#', $origin)) {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Access-Control-Allow-Credentials: true');
    } else {
        header('Access-Control-Allow-Origin: https://agafari.com');
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
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
    if (preg_match('#^/api/system-admin/users/([^/]+)/credentials/?$#', $uri, $m)) {
        $_GET['id'] = $m[1];
        $_GET['userId'] = $m[1];
        require $docRoot . '/api/admin/users.php';
        exit;
    }
    if (preg_match('#^/api/admin/users/([^/]+)/password/?$#', $uri, $m)) {
        $_GET['id'] = $m[1];
        $_GET['userId'] = $m[1];
        require $docRoot . '/api/admin/users.php';
        exit;
    }
    if (preg_match('#^/api/system-admin/users/?$#', $uri)) {
        require $docRoot . '/api/admin/users.php';
        exit;
    }
    if (preg_match('#^/api/system-admin/self-credentials/?$#', $uri)) {
        require $docRoot . '/api/admin/users.php';
        exit;
    }
    if (preg_match('#^/api/admin/clean-slate/?$#', $uri)) {
        require $docRoot . '/api/admin/clean-slate.php';
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
// /:org/:slug -> dedicated event control page
if (preg_match('#^([^/]+)/([^/]+)/?$#', $cleanUri, $m)) {
    $_GET['org'] = $m[1];
    $_GET['slug'] = $m[2];
    header('Content-Type: text/html; charset=utf-8');
    if (file_exists($docRoot . '/event/control.html')) {
        readfile($docRoot . '/event/control.html');
    } else {
        readfile($docRoot . '/index.html');
    }
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
