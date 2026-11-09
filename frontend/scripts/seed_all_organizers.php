<?php
require_once __DIR__ . '/../php-backend/config/db.php';

$pdo = getPdoConnection();
if (!$pdo) {
    echo "ERROR: Could not connect to MySQL database.\n";
    exit(1);
}

// 1. Ensure temporary_password column exists in users table
try {
    $col = php_query_one("SHOW COLUMNS FROM users LIKE 'temporary_password'");
    if (!$col) {
        php_execute("ALTER TABLE users ADD COLUMN temporary_password VARCHAR(255) DEFAULT NULL AFTER password_hash");
        echo "Added temporary_password column to users.\n";
    }
} catch (Throwable $e) {
    echo "temporary_password column check: " . $e->getMessage() . "\n";
}

// 2. Define standard organizing agencies
$organizers = [
    [
        'userId' => 'usr-org-kebkab',
        'email' => 'kebkab@gmail.com',
        'altEmail' => 'kebkab@agafari.com',
        'phone' => '+251911111111',
        'fullName' => 'Kebkab Events Agency',
        'orgId' => 'org-kebkab-01',
        'bizName' => 'Kebkab Events Agency',
        'pass' => 'org123',
        'eventSlug' => 'sara-and-dawit-2026'
    ],
    [
        'userId' => 'usr-org-arganon',
        'email' => 'arganon@gmail.com',
        'altEmail' => 'arganon@agafari.com',
        'phone' => '+251911334455',
        'fullName' => 'Arganon Events Agency',
        'orgId' => 'org-arganon-01',
        'bizName' => 'Arganon Events Agency',
        'pass' => 'org123',
        'eventSlug' => 'selam-and-bereket-2026'
    ],
    [
        'userId' => 'usr-org-matrimony',
        'email' => 'matrimony@agafari.com',
        'altEmail' => 'matrimony@gmail.com',
        'phone' => '+251911223344',
        'fullName' => 'Matrimony Planners',
        'orgId' => 'org-matrimony-01',
        'bizName' => 'Matrimony Planners',
        'pass' => 'org123',
        'eventSlug' => 'melat-and-tesfaye-2026'
    ],
    [
        'userId' => 'usr-org-agafari',
        'email' => 'organizer@agafari.com',
        'altEmail' => 'organizer@gmail.com',
        'phone' => '+251911556677',
        'fullName' => 'Agafari Events Agency',
        'orgId' => 'org-agafari-01',
        'bizName' => 'Agafari Events Agency',
        'pass' => 'org123',
        'eventSlug' => null
    ],
];

foreach ($organizers as $org) {
    $hash = password_hash($org['pass'], PASSWORD_BCRYPT);
    $tempPass = "{$org['pass']}|Organizer123!|agafari2026";

    // Upsert primary email user
    $existing = php_query_one("SELECT id FROM users WHERE email = ? LIMIT 1", [$org['email']]);
    if ($existing) {
        php_execute(
            "UPDATE users 
                SET full_name = ?, role = 'EVENT_ORGANIZER', password_hash = ?, temporary_password = ?, is_active = 1 
              WHERE id = ?",
            [$org['fullName'], $hash, $tempPass, $existing['id']]
        );
        $userId = $existing['id'];
        echo "Updated existing user {$org['email']} (ID: {$userId})\n";
    } else {
        $userId = $org['userId'];
        php_execute(
            "INSERT INTO users (id, email, phone, full_name, role, password_hash, temporary_password, is_active, created_at)
             VALUES (?, ?, ?, ?, 'EVENT_ORGANIZER', ?, ?, 1, NOW())",
            [$userId, $org['email'], $org['phone'], $org['fullName'], $hash, $tempPass]
        );
        echo "Inserted user {$org['email']} (ID: {$userId})\n";
    }

    // Upsert alt email user if specified
    if (!empty($org['altEmail'])) {
        $altExisting = php_query_one("SELECT id FROM users WHERE email = ? LIMIT 1", [$org['altEmail']]);
        if (!$altExisting) {
            $altId = $userId . '-alt';
            php_execute(
                "INSERT INTO users (id, email, phone, full_name, role, password_hash, temporary_password, is_active, created_at)
                 VALUES (?, ?, ?, ?, 'EVENT_ORGANIZER', ?, ?, 1, NOW())",
                [$altId, $org['altEmail'], $org['phone'], $org['fullName'], $hash, $tempPass]
            );
            echo "Inserted alt email user {$org['altEmail']} (ID: {$altId})\n";
        }
    }

    // Upsert organizer record
    $existingOrg = php_query_one("SELECT id FROM organizers WHERE id = ? OR owner_user_id = ? LIMIT 1", [$org['orgId'], $userId]);
    if ($existingOrg) {
        php_execute(
            "UPDATE organizers 
                SET business_name = ?, owner_user_id = ?, contact_phone = ? 
              WHERE id = ?",
            [$org['bizName'], $userId, $org['phone'], $existingOrg['id']]
        );
        echo "Updated organizer {$org['bizName']} (ID: {$existingOrg['id']})\n";
    } else {
        php_execute(
            "INSERT INTO organizers (id, owner_user_id, business_name, contact_phone, created_at)
             VALUES (?, ?, ?, ?, NOW())",
            [$org['orgId'], $userId, $org['bizName'], $org['phone']]
        );
        echo "Inserted organizer {$org['bizName']} (ID: {$org['orgId']})\n";
    }

    // Link demo wedding if defined
    if (!empty($org['eventSlug'])) {
        php_execute(
            "UPDATE events SET organizer_id = ? WHERE slug = ?",
            [$org['orgId'], $org['eventSlug']]
        );
        echo "Linked event {$org['eventSlug']} -> {$org['orgId']}\n";
    }
}

echo "All organizers seeded and verified successfully!\n";
