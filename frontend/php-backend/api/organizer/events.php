<?php
// =============================================================================
// AGAFARI — ORGANIZER EVENTS API CONTROLLER (PHP FOR CPANEL / DIRECTADMIN)
// Multi-Tenant Isolation & Dynamic Agency Branding
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
// Helper: Resolve Organizer by ID, Owner User ID, or Email
// -----------------------------------------------------------------------------
// Helper: Resolve Organizer by ID, Owner User ID, or Email
// -----------------------------------------------------------------------------
function resolve_organizer(?string $rawId, ?string $rawName = null): ?array {
    if ((empty($rawId) || strtolower($rawId) === 'global' || strtolower($rawId) === 'all') && empty($rawName)) {
        return null;
    }

    $rawId = trim($rawId ?? '');
    $rawName = trim($rawName ?? '');
    $stripped = preg_replace('/^org-/', '', $rawId);
    $usrStripped = preg_replace('/^usr-/', '', $stripped);
    $nameToCheck = !empty($rawName) ? $rawName : (!empty($stripped) ? $stripped : $rawId);

    // 1. Check organizers table directly with LEFT JOIN so missing or unlinked users row doesn't drop the agency
    $sql = 'SELECT o.*, u.email, u.full_name, u.phone
            FROM organizers o
            LEFT JOIN users u ON o.owner_user_id = u.id
            WHERE o.id = ? 
               OR o.id = ? 
               OR o.id = ?
               OR o.owner_user_id = ? 
               OR o.owner_user_id = ? 
               OR o.owner_user_id = ?
               OR (LENGTH(?) > 0 AND LOWER(o.business_name) = LOWER(?))
               OR (LENGTH(?) > 0 AND LOWER(REPLACE(o.business_name, " ", "-")) = LOWER(?))
               OR (LENGTH(?) > 0 AND LOWER(u.full_name) = LOWER(?))
               OR (LENGTH(?) > 0 AND LOWER(REPLACE(u.full_name, " ", "-")) = LOWER(?))
               OR (LENGTH(?) > 0 AND LOWER(u.email) = LOWER(?))
            LIMIT 1';

    $org = php_query_one($sql, [
        $rawId, "org-{$stripped}", $stripped,
        $rawId, $stripped, "usr-{$usrStripped}",
        $nameToCheck, $nameToCheck,
        $nameToCheck, $nameToCheck,
        $nameToCheck, $nameToCheck,
        $nameToCheck, $nameToCheck,
        $rawId, $rawId
    ]);

    if ($org) {
        // Ensure business_name is clean and human-readable, not a raw ID
        if (empty($org['business_name']) || preg_match('/^(org-|usr-)?[0-9a-f]{6,}$/i', $org['business_name']) || str_starts_with($org['business_name'], 'Usr ')) {
            if (!empty($org['full_name']) && !preg_match('/^(org-|usr-)?[0-9a-f]{6,}$/i', $org['full_name'])) {
                $org['business_name'] = $org['full_name'];
            } elseif (!empty($rawName)) {
                $org['business_name'] = $rawName;
            }
        }
        return $org;
    }

    // 2. Check users table directly (by id, email, or full_name)
    $user = php_query_one(
        'SELECT id, email, full_name, phone, role FROM users 
         WHERE id = ? 
            OR id = ? 
            OR id = ?
            OR (LENGTH(?) > 0 AND LOWER(email) = LOWER(?)) 
            OR (LENGTH(?) > 0 AND LOWER(full_name) = LOWER(?))
            OR (LENGTH(?) > 0 AND LOWER(REPLACE(full_name, " ", "-")) = LOWER(?))
         LIMIT 1',
        [$rawId, $stripped, "usr-{$usrStripped}", $rawId, $rawId, $nameToCheck, $nameToCheck, $nameToCheck, $nameToCheck]
    );

    if ($user) {
        $orgRow = php_query_one('SELECT * FROM organizers WHERE owner_user_id = ? OR id = ? LIMIT 1', [$user['id'], $user['id']]);
        $bizName = !empty($rawName) ? $rawName : (!empty($user['full_name']) ? $user['full_name'] : 'Executive Event Agency');
        if ($orgRow) {
            $orgRow['email'] = $user['email'];
            $orgRow['full_name'] = $user['full_name'];
            $orgRow['phone'] = $user['phone'] ?? '';
            $orgRow['business_name'] = !empty($orgRow['business_name']) && !preg_match('/^(org-|usr-)?[0-9a-f]{6,}$/i', $orgRow['business_name']) ? $orgRow['business_name'] : $bizName;
            return $orgRow;
        }

        // Auto-provision organizers row for this user
        $orgId = 'org-' . $user['id'];
        try {
            php_execute(
                'INSERT INTO organizers (id, owner_user_id, business_name, contact_phone, created_at) VALUES (?, ?, ?, ?, NOW())',
                [$orgId, $user['id'], $bizName, $user['phone'] ?? null]
            );
        } catch (Throwable $e) {}

        return [
            'id'            => $orgId,
            'owner_user_id' => $user['id'],
            'business_name' => $bizName,
            'contact_phone' => $user['phone'] ?? '',
            'email'         => $user['email'],
            'full_name'     => $user['full_name'],
        ];
    }

    // 3. Organizer does not exist in the database
    return null;
}

// -----------------------------------------------------------------------------
// Helper: Format Event Object
// -----------------------------------------------------------------------------
function formatOrganizerEvent(array $ev): array {
    $brideName = $ev['bride_name'] ?? '';
    $groomName = $ev['groom_name'] ?? '';
    $title = $ev['title'] ?? ($brideName && $groomName ? "{$brideName} & {$groomName}'s Wedding" : 'Wedding Event');
    $custom = json_decode($ev['template_customization_json'] ?? '{}', true) ?: [];
    $expected = (int)($ev['expected_guests'] ?? $custom['expectedGuests'] ?? 300);
    $slug = $ev['slug'] ?? 'wedding';
    $tempPass = $ev['couple_temp_password'] ?? 'agafari2026';

    return [
        'id'                   => $ev['id'],
        'slug'                 => $slug,
        'title'                => $title,
        'brideName'            => $brideName,
        'groomName'            => $groomName,
        'bride_name'           => $brideName,
        'groom_name'           => $groomName,
        'eventDate'            => $ev['event_date'],
        'event_date'           => $ev['event_date'],
        'venueName'            => $ev['venue_name'],
        'venue_name'           => $ev['venue_name'],
        'venueAddress'         => $ev['venue_address'] ?? '',
        'venue_address'        => $ev['venue_address'] ?? '',
        'dressCode'            => $ev['dress_code'] ?? '',
        'coverImageUrl'        => $ev['cover_image_url'] ?? null,
        'status'               => $ev['status'] ?? 'COMING_SOON',
        'expectedGuests'       => $expected,
        'templateId'           => $ev['template_id'] ?? 'luxury-gold',
        'adminApprovalStatus'  => $ev['admin_approval_status'] ?? 'PENDING',
        'admin_approval_status'=> $ev['admin_approval_status'] ?? 'PENDING',
        'managedBy'            => $ev['managed_by'] ?? 'ORGANIZER',
        'organizerId'          => $ev['organizer_id'] ?? null,
        'organizerName'        => $ev['organizer_name'] ?? null,
        'couple'               => [
            'email'             => $ev['couple_email'] ?? "couple@{$slug}.com",
            'temporaryPassword' => $tempPass,
            'fullName'          => $ev['couple_full_name'] ?? "{$brideName} & {$groomName}",
        ],
        'coupleCredentials'    => [
            'email'             => $ev['couple_email'] ?? "couple@{$slug}.com",
            'temporaryPassword' => $tempPass,
        ],
        'credentials'          => [
            'couple'    => [
                'fullName'          => $ev['couple_full_name'] ?? "{$brideName} & {$groomName}",
                'email'             => $ev['couple_email'] ?? "couple@{$slug}.com",
                'temporaryPassword' => $tempPass,
                'role'              => 'BRIDE_GROOM',
            ],
            'scanner'   => [
                'fullName'          => 'Gate QR Scanner',
                'email'             => "scanner@{$slug}.com",
                'temporaryPassword' => 'scan123',
                'role'              => 'GATE_SCANNER',
            ],
            'streamer'  => [
                'fullName'          => 'Live Streamer Crew',
                'email'             => "streamer@{$slug}.com",
                'temporaryPassword' => 'stream123',
                'role'              => 'LIVE_STREAMER',
            ],
            'moderator' => [
                'fullName'          => 'Media Moderator Hub',
                'email'             => "moderator@{$slug}.com",
                'temporaryPassword' => 'mod123',
                'role'              => 'MODERATOR',
            ],
        ],
    ];
}

// -----------------------------------------------------------------------------
// GET: List all events for the organizer
// -----------------------------------------------------------------------------
if ($method === 'GET') {
    try {
        $session = require_auth();
        $allowedRoles = ['SYSTEM_ADMIN', 'SUPER_ADMIN', 'ADMIN', 'EVENT_ORGANIZER', 'ORGANIZER_OWNER', 'ORGANIZER'];
        if (!in_array($session['role'], $allowedRoles, true)) {
            http_response_code(403);
            echo json_encode(['error' => 'Insufficient permissions for organizer dashboard.']);
            exit;
        }

        $isAdmin = in_array($session['role'], ['SYSTEM_ADMIN', 'SUPER_ADMIN', 'ADMIN'], true);
        $rawId = trim($_GET['id'] ?? $_GET['organizerId'] ?? '');
        $nameParam = trim($_GET['name'] ?? $_GET['agencyName'] ?? '');

        // Tenant isolation: Organizers can only ever view their own events
        if (!$isAdmin) {
            $myOrg = php_query_one('SELECT id FROM organizers WHERE owner_user_id = ? OR id = ? LIMIT 1', [$session['user_id'], $session['user_id']]);
            $myOrgId = $myOrg ? $myOrg['id'] : $session['user_id'];

            if (!empty($rawId)) {
                $orgCandidate = resolve_organizer($rawId, $nameParam);
                $candidateId = $orgCandidate ? $orgCandidate['id'] : $rawId;
                if ($candidateId !== $myOrgId && $candidateId !== $session['user_id']) {
                    http_response_code(403);
                    echo json_encode(['error' => 'Forbidden: You are not authorized to view another organizer\'s events.']);
                    exit;
                }
            }
            $rawId = $myOrgId;
        }

        $isSpecificOrg = (!empty($rawId) && strtolower($rawId) !== 'global' && strtolower($rawId) !== 'all') || !empty($nameParam);
        $org = resolve_organizer($rawId, $nameParam);

        if ($isSpecificOrg && !$org) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error'   => "Organizer account with ID \"{$rawId}\" was not found."
            ]);
            exit;
        }

        // Fetch events with safe schema checking
        $hasTempPass = false;
        try {
            $col = php_query_one("SHOW COLUMNS FROM users LIKE 'temporary_password'");
            if ($col) $hasTempPass = true;
        } catch (Throwable $e) {}

        $tempPassSelect = $hasTempPass ? 'u.temporary_password AS couple_temp_password' : 'NULL AS couple_temp_password';

        if ($isSpecificOrg) {
            $orgId = $org ? $org['id'] : $rawId;
            $ownerId = $org ? ($org['owner_user_id'] ?? $orgId) : $rawId;
            $orgPrefixed = str_starts_with($ownerId, 'org-') ? $ownerId : "org-{$ownerId}";
            $rawIdVal = $rawId ?: $orgId;
            $strippedVal = preg_replace('/^org-/', '', $rawId);
            $bizNameVal = $org ? ($org['business_name'] ?? '') : $nameParam;

            $sql = "
                SELECT e.*, 
                       u.email AS couple_email, 
                       {$tempPassSelect},
                       u.full_name AS couple_full_name,
                       o.business_name AS organizer_name
                  FROM events e
             LEFT JOIN users u ON u.id = e.couple_user_id
             LEFT JOIN organizers o ON o.id = e.organizer_id
                 WHERE e.organizer_id = ?
                    OR e.organizer_id = ?
                    OR e.organizer_id = ?
                    OR e.organizer_id = ?
                    OR e.organizer_id = ?
                    OR o.owner_user_id = ?
                    OR o.owner_user_id = ?
                    OR (LENGTH(?) > 0 AND LOWER(e.organizer_id) = LOWER(?))
                    OR (LENGTH(?) > 0 AND LOWER(o.business_name) = LOWER(?))
                    OR (LENGTH(?) > 0 AND LOWER(o.business_name) = LOWER(?))
              ORDER BY e.created_at DESC
            ";
            $events = php_query($sql, [
                $orgId, $ownerId, $orgPrefixed, $rawIdVal, $strippedVal,
                $ownerId, $rawIdVal,
                $bizNameVal, $bizNameVal,
                $bizNameVal, $bizNameVal,
                $nameParam, $nameParam
            ]);
        } else {
            // Super Admin / Global view (ONLY when no specific agency ID or name was requested)
            $sql = "
                SELECT e.*, 
                       u.email AS couple_email, 
                       {$tempPassSelect},
                       u.full_name AS couple_full_name,
                       o.business_name AS organizer_name
                  FROM events e
             LEFT JOIN users u ON u.id = e.couple_user_id
             LEFT JOIN organizers o ON o.id = e.organizer_id
              ORDER BY e.created_at DESC
            ";
            $events = php_query($sql);
        }

        $formatted = array_map('formatOrganizerEvent', $events);

        // Dynamic branding values - prioritize human agency name, NEVER show raw ID
        $agencyName = '';
        if ($org) {
            $candidateName = $org['business_name'] ?? $org['full_name'] ?? '';
            if (!empty($candidateName) && !preg_match('/^(org-|usr-)?[0-9a-f]{6,}$/i', $candidateName) && !str_starts_with($candidateName, 'Usr ')) {
                $agencyName = $candidateName;
            }
        }
        if (empty($agencyName) && !empty($nameParam)) {
            $agencyName = $nameParam;
        }
        if (empty($agencyName) && !empty($org['email']) && strpos($org['email'], '@') !== false) {
            $prefix = explode('@', $org['email'])[0];
            $agencyName = ucwords(str_replace(['.', '_', '-'], ' ', $prefix));
        }
        if (empty($agencyName)) {
            $agencyName = 'Event Agency';
        }

        $fullName = $org['full_name'] ?? $agencyName;
        if (preg_match('/^(org-|usr-)?[0-9a-f]{6,}$/i', $fullName) || str_starts_with($fullName, 'Usr ')) {
            $fullName = $agencyName;
        }

        $email    = $org['email'] ?? 'organizer@agafari.com';
        $orgIdVal = $org['id'] ?? ($rawId ?: 'org-certified');

        $activeHosting = array_filter($formatted, function($e) {
            return ($e['status'] ?? '') !== 'COMPLETED' && ($e['status'] ?? '') !== 'ARCHIVED';
        });
        $hostedArchive = array_filter($formatted, function($e) {
            return ($e['status'] ?? '') === 'COMPLETED' || ($e['status'] ?? '') === 'ARCHIVED';
        });

        echo json_encode([
            'success'       => true,
            'events'        => array_values($formatted),
            'organizerInfo' => [
                'id'                 => $orgIdVal,
                'agencyName'         => $agencyName,
                'businessName'       => $agencyName,
                'companyName'        => $agencyName,
                'fullName'           => $fullName,
                'email'              => $email,
                'phone'              => $org['contact_phone'] ?? $org['phone'] ?? '',
                'activeHostingCount' => count($activeHosting),
                'hostedArchiveCount' => count($hostedArchive),
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
// POST: Create a new wedding event through the organizer agency
// -----------------------------------------------------------------------------
if ($method === 'POST') {
    try {
        $session = require_auth();
        $allowedRoles = ['SYSTEM_ADMIN', 'SUPER_ADMIN', 'ADMIN', 'EVENT_ORGANIZER', 'ORGANIZER_OWNER', 'ORGANIZER'];
        if (!in_array($session['role'], $allowedRoles, true)) {
            http_response_code(403);
            echo json_encode(['error' => 'Insufficient permissions to create wedding events.']);
            exit;
        }
        $isAdmin = in_array($session['role'], ['SYSTEM_ADMIN', 'SUPER_ADMIN', 'ADMIN'], true);

        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?: $_POST;

        $brideName      = trim($body['brideName'] ?? $body['bride_name'] ?? '');
        $groomName      = trim($body['groomName'] ?? $body['groom_name'] ?? '');
        $eventDate      = trim($body['eventDate'] ?? $body['event_date'] ?? '');
        $venueName      = trim($body['venueName'] ?? $body['venue_name'] ?? '');
        $venueAddress   = trim($body['venueAddress'] ?? $body['venue_address'] ?? '');
        $dressCode      = trim($body['dressCode'] ?? $body['dress_code'] ?? '');
        $coupleEmail    = trim($body['coupleEmail'] ?? $body['couple_email'] ?? '');
        $expectedGuests = max(1, (int)($body['expectedGuests'] ?? $body['expected_guests'] ?? 300));
        $title          = trim($body['title'] ?? '');
        $slugParam      = trim($body['slug'] ?? '');
        $rawOrgId       = trim($body['organizerId'] ?? $body['organizer_id'] ?? $_GET['id'] ?? '');

        if (!$isAdmin) {
            $myOrg = php_query_one('SELECT id FROM organizers WHERE owner_user_id = ? OR id = ? LIMIT 1', [$session['user_id'], $session['user_id']]);
            $rawOrgId = $myOrg ? $myOrg['id'] : $session['user_id'];
        }

        if (empty($brideName) || empty($groomName) || empty($venueName)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields (brideName, groomName, venueName).']);
            exit;
        }

        if (empty($title)) {
            $title = "{$brideName} & {$groomName}'s Wedding";
        }

        // 1. Resolve Organizer Record
        $nameParam = trim($body['organizerName'] ?? $body['agencyName'] ?? $_GET['name'] ?? '');
        $org = resolve_organizer($rawOrgId, $nameParam);
        $resolvedOrgId = $org ? $org['id'] : null;

        // If no organizer resolved, but rawOrgId was provided, ensure it stays bound to this agency
        if (!$resolvedOrgId && !empty($rawOrgId)) {
            $resolvedOrgId = $rawOrgId;
        }

        // Only for unauthenticated global requests with no organizer specified at all
        if (!$resolvedOrgId) {
            $firstOrg = php_query_one('SELECT id FROM organizers ORDER BY created_at ASC LIMIT 1');
            if ($firstOrg) {
                $resolvedOrgId = $firstOrg['id'];
            }
        }

        // 2. Generate clean unique slug
        if (!empty($slugParam)) {
            $cleanSlug = strtolower(preg_replace('/[^a-z0-9-]+/i', '-', $slugParam));
            $cleanSlug = trim($cleanSlug, '-');
        } else {
            $baseSlug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', "{$brideName}-and-{$groomName}"));
            $cleanSlug = trim($baseSlug, '-') ?: 'wedding-' . time();
        }

        $existing = php_query_one('SELECT id FROM events WHERE slug = ? LIMIT 1', [$cleanSlug]);
        if ($existing) {
            $cleanSlug .= '-' . rand(100, 999);
        }

        $targetCoupleEmail = !empty($coupleEmail) ? $coupleEmail : "couple@{$cleanSlug}.com";
        $tempPassword      = 'agafari2026';
        $coupleFullName    = "{$brideName} & {$groomName}";
        $newEventId        = function_exists('generate_safe_id') ? generate_safe_id('evt-') : 'evt-' . substr(generate_uuid_v4(), 4);

        // 3. Resolve supported role ENUM for couple
        $targetRole = 'COUPLE';
        try {
            $colInfo = php_query_one("SHOW COLUMNS FROM users LIKE 'role'");
            $enumStr = $colInfo['Type'] ?? '';
            if (strpos($enumStr, 'BRIDE_GROOM') !== false && strpos($enumStr, 'COUPLE') === false) {
                $targetRole = 'BRIDE_GROOM';
            }
        } catch (Throwable $ignored) {}

        // 4. Check temporary_password column support
        $hasTempPass = false;
        try {
            $col = php_query_one("SHOW COLUMNS FROM users LIKE 'temporary_password'");
            if ($col) {
                $hasTempPass = true;
            } else {
                php_execute("ALTER TABLE users ADD COLUMN temporary_password VARCHAR(255) NULL AFTER password_hash");
                $hasTempPass = true;
            }
        } catch (Throwable $ignored) {}

        $passwordHash = password_hash($tempPassword, PASSWORD_BCRYPT);

        // 5. Check or create couple user in users table
        $existingUser = php_query_one('SELECT id, role FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1', [$targetCoupleEmail]);
        if ($existingUser) {
            if (in_array(strtoupper($existingUser['role']), ['SYSTEM_ADMIN', 'SUPER_ADMIN', 'ADMIN'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Security Error: Cannot assign an administrative account as an event couple.']);
                exit;
            }
            $coupleUserId = $existingUser['id'];
            try {
                if ($hasTempPass) {
                    php_execute(
                        'UPDATE users SET full_name = ?, password_hash = ?, temporary_password = ? WHERE id = ?',
                        [$coupleFullName, $passwordHash, $tempPassword, $coupleUserId]
                    );
                } else {
                    php_execute(
                        'UPDATE users SET full_name = ?, password_hash = ? WHERE id = ?',
                        [$coupleFullName, $passwordHash, $coupleUserId]
                    );
                }
            } catch (Throwable $e) {}
        } else {
            $coupleUserId = function_exists('generate_safe_id') ? generate_safe_id('usr-') : 'usr-' . substr(generate_uuid_v4(), 4);
            try {
                if ($hasTempPass) {
                    php_execute(
                        'INSERT INTO users (id, email, password_hash, temporary_password, full_name, role, is_active, created_at)
                         VALUES (?, ?, ?, ?, ?, ?, 1, NOW())',
                        [$coupleUserId, $targetCoupleEmail, $passwordHash, $tempPassword, $coupleFullName, $targetRole]
                    );
                } else {
                    php_execute(
                        'INSERT INTO users (id, email, password_hash, full_name, role, is_active, created_at)
                         VALUES (?, ?, ?, ?, ?, 1, NOW())',
                        [$coupleUserId, $targetCoupleEmail, $passwordHash, $coupleFullName, $targetRole]
                    );
                }
            } catch (Throwable $e) {
                php_execute(
                    'INSERT INTO users (id, email, password_hash, full_name, role)
                     VALUES (?, ?, ?, ?, ?)',
                    [$coupleUserId, $targetCoupleEmail, $passwordHash, $coupleFullName, $targetRole]
                );
            }
        }

        // 6. Resolve valid template_id safely
        $validTemplateId = null;
        try {
            $tRow = php_query_one('SELECT id FROM templates ORDER BY created_at ASC LIMIT 1');
            if ($tRow) {
                $validTemplateId = $tRow['id'];
            }
        } catch (Throwable $e) {}

        // 7. Format date string safely
        $formattedDate = !empty($eventDate) ? date('Y-m-d H:i:s', strtotime($eventDate)) : date('Y-m-d 14:00:00', strtotime('+30 days'));

        // 8. Check if expected_guests column exists
        $hasExpectedGuestsCol = false;
        try {
            $col = php_query_one("SHOW COLUMNS FROM events LIKE 'expected_guests'");
            if ($col) {
                $hasExpectedGuestsCol = true;
            } else {
                php_execute("ALTER TABLE events ADD COLUMN expected_guests INT DEFAULT 300 AFTER dress_code");
                $hasExpectedGuestsCol = true;
            }
        } catch (Throwable $ignored) {}

        $customizationJson = json_encode(['expectedGuests' => $expectedGuests]);

        // 9. Insert new wedding event scoped to organizer
        if ($hasExpectedGuestsCol) {
            php_execute(
                'INSERT INTO events (
                    id, slug, title, managed_by, organizer_id, couple_user_id, template_id,
                    template_customization_json, bride_name, groom_name, event_date, venue_name, venue_address,
                    dress_code, expected_guests, status, admin_approval_status, created_at
                ) VALUES (?, ?, ?, "ORGANIZER", ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "COMING_SOON", "PENDING", NOW())',
                [
                    $newEventId,
                    $cleanSlug,
                    $title,
                    $resolvedOrgId,
                    $coupleUserId,
                    $validTemplateId,
                    $customizationJson,
                    $brideName,
                    $groomName,
                    $formattedDate,
                    $venueName,
                    $venueAddress ?: null,
                    $dressCode ?: null,
                    $expectedGuests
                ]
            );
        } else {
            php_execute(
                'INSERT INTO events (
                    id, slug, title, managed_by, organizer_id, couple_user_id, template_id,
                    template_customization_json, bride_name, groom_name, event_date, venue_name, venue_address,
                    dress_code, status, admin_approval_status, created_at
                ) VALUES (?, ?, ?, "ORGANIZER", ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "COMING_SOON", "PENDING", NOW())',
                [
                    $newEventId,
                    $cleanSlug,
                    $title,
                    $resolvedOrgId,
                    $coupleUserId,
                    $validTemplateId,
                    $customizationJson,
                    $brideName,
                    $groomName,
                    $formattedDate,
                    $venueName,
                    $venueAddress ?: null,
                    $dressCode ?: null
                ]
            );
        }

        $inserted = php_query_one(
            'SELECT e.*, 
                    u.email AS couple_email, 
                    u.full_name AS couple_full_name,
                    o.business_name AS organizer_name
               FROM events e
          LEFT JOIN users u ON u.id = e.couple_user_id
          LEFT JOIN organizers o ON o.id = e.organizer_id
              WHERE e.id = ?',
            [$newEventId]
        );

        $formattedEvent = $inserted ? formatOrganizerEvent($inserted) : [
            'id'                  => $newEventId,
            'slug'                => $cleanSlug,
            'title'               => $title,
            'brideName'           => $brideName,
            'groomName'           => $groomName,
            'eventDate'           => $formattedDate,
            'venueName'           => $venueName,
            'expectedGuests'      => $expectedGuests,
            'status'              => 'COMING_SOON',
            'adminApprovalStatus' => 'PENDING',
            'organizerId'         => $resolvedOrgId,
            'couple'              => [
                'email'             => $targetCoupleEmail,
                'temporaryPassword' => $tempPassword,
            ],
            'coupleCredentials'   => [
                'email'             => $targetCoupleEmail,
                'temporaryPassword' => $tempPassword,
            ],
        ];

        http_response_code(201);
        echo json_encode([
            'success'            => true,
            'message'            => 'Wedding licensing request submitted successfully.',
            'event'              => $formattedEvent,
            'coupleCredentials'  => [
                'email'             => $targetCoupleEmail,
                'temporaryPassword' => $tempPassword,
            ],
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
