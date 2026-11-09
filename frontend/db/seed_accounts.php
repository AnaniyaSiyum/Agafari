<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — SEED REAL USERS, ORGANIZERS & COUPLES
// Sets up authentic cryptographic credentials for Admin, Organizers, and Couples
// =============================================================================

require_once __DIR__ . '/../php-backend/config/db.php';
require_once __DIR__ . '/../php-backend/lib/auth.php';

echo "1. Normalizing users.role column to VARCHAR(50)...\n";
php_execute('ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL DEFAULT \'GUEST\'');

echo "2. Generating cryptographic hashes...\n";
$adminHash     = password_hash('Admin123!', PASSWORD_BCRYPT);
$matrimonyHash = password_hash('org123', PASSWORD_BCRYPT);
$agafariOrgHash= password_hash('Organizer123!', PASSWORD_BCRYPT);
$meltesHash    = password_hash('agafari9534', PASSWORD_BCRYPT);
$saraHash      = password_hash('agafari2026', PASSWORD_BCRYPT);
$scannerHash   = password_hash('scan123', PASSWORD_BCRYPT);
$streamerHash  = password_hash('stream123', PASSWORD_BCRYPT);
$moderatorHash = password_hash('mod123', PASSWORD_BCRYPT);

echo "3. Seeding System Admin (admin@agafari.com)...\n";
php_execute(
    "INSERT INTO users (id, email, full_name, role, password_hash, temporary_password, is_active, created_at)
     VALUES ('usr-admin-1', 'admin@agafari.com', 'System Super Admin', 'SYSTEM_ADMIN', ?, 'Admin123!', 1, NOW())
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), temporary_password = VALUES(temporary_password), role = 'SYSTEM_ADMIN'",
    [$adminHash]
);

echo "4. Seeding Matrimony Planners Organizer (matrimony@agafari.com)...\n";
php_execute(
    "INSERT INTO users (id, email, phone, full_name, role, password_hash, temporary_password, is_active, created_at)
     VALUES ('usr-org-matrimony', 'matrimony@agafari.com', '+251911223344', 'Matrimony Planners', 'EVENT_ORGANIZER', ?, 'org123', 1, NOW())
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), temporary_password = VALUES(temporary_password), role = 'EVENT_ORGANIZER', full_name = 'Matrimony Planners'",
    [$matrimonyHash]
);

php_execute(
    "INSERT INTO organizers (id, owner_user_id, business_name, contact_phone, created_at)
     VALUES ('org-matrimony-01', 'usr-org-matrimony', 'Matrimony Planners', '+251911223344', NOW())
     ON DUPLICATE KEY UPDATE business_name = 'Matrimony Planners', owner_user_id = 'usr-org-matrimony'"
);

echo "5. Seeding Agafari Events Agency Organizer (organizer@agafari.com)...\n";
php_execute(
    "INSERT INTO users (id, email, phone, full_name, role, password_hash, temporary_password, is_active, created_at)
     VALUES ('usr-org-agafari', 'organizer@agafari.com', '+251911556677', 'Agafari Events Agency', 'EVENT_ORGANIZER', ?, 'Organizer123!', 1, NOW())
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), temporary_password = VALUES(temporary_password), role = 'EVENT_ORGANIZER', full_name = 'Agafari Events Agency'",
    [$agafariOrgHash]
);

php_execute(
    "INSERT INTO organizers (id, owner_user_id, business_name, contact_phone, created_at)
     VALUES ('org-agafari-01', 'usr-org-agafari', 'Agafari Events Agency', '+251911556677', NOW())
     ON DUPLICATE KEY UPDATE business_name = 'Agafari Events Agency', owner_user_id = 'usr-org-agafari'"
);

echo "6. Seeding Melat & Tesfaye Couple (meltes@gmail.com)...\n";
php_execute(
    "INSERT INTO users (id, email, phone, full_name, role, password_hash, temporary_password, is_active, created_at)
     VALUES ('usr-couple-1793456411999-779', 'meltes@gmail.com', '+251911000779', 'Melat & Tesfaye', 'COUPLE', ?, 'agafari9534', 1, NOW())
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), temporary_password = VALUES(temporary_password), role = 'COUPLE', full_name = 'Melat & Tesfaye'",
    [$meltesHash]
);

echo "7. Seeding Sara & Dawit Couple (couple@agafari.com)...\n";
php_execute(
    "INSERT INTO users (id, email, phone, full_name, role, password_hash, temporary_password, is_active, created_at)
     VALUES ('usr-couple-sara-dawit', 'couple@agafari.com', '+251911888999', 'Sara & Dawit', 'COUPLE', ?, 'agafari2026', 1, NOW())
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), temporary_password = VALUES(temporary_password), role = 'COUPLE', full_name = 'Sara & Dawit'",
    [$saraHash]
);

echo "8. Seeding Event Staff (Scanner, Streamer, Moderator)...\n";
php_execute(
    "INSERT INTO users (id, email, full_name, role, password_hash, temporary_password, is_active, created_at)
     VALUES ('usr-scanner-1', 'scanner@agafari.com', 'Gate QR Scanner', 'GATE_SCANNER', ?, 'scan123', 1, NOW())
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), temporary_password = VALUES(temporary_password), role = 'GATE_SCANNER'",
    [$scannerHash]
);

php_execute(
    "INSERT INTO users (id, email, full_name, role, password_hash, temporary_password, is_active, created_at)
     VALUES ('usr-streamer-1', 'streamer@agafari.com', 'Live Streamer Crew', 'LIVE_STREAMER', ?, 'stream123', 1, NOW())
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), temporary_password = VALUES(temporary_password), role = 'LIVE_STREAMER'",
    [$streamerHash]
);

php_execute(
    "INSERT INTO users (id, email, full_name, role, password_hash, temporary_password, is_active, created_at)
     VALUES ('usr-moderator-1', 'moderator@agafari.com', 'Content Moderator', 'MODERATOR', ?, 'mod123', 1, NOW())
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), temporary_password = VALUES(temporary_password), role = 'MODERATOR'",
    [$moderatorHash]
);

echo "9. Linking Events to Organizers and Couples...\n";
php_execute(
    "UPDATE events 
        SET organizer_id = 'org-matrimony-01', 
            couple_user_id = 'usr-couple-1793456411999-779', 
            managed_by = 'ORGANIZER'
      WHERE id = 'evt-melat-and-tesfaye-2026' OR slug = 'melat-and-tesfaye-2026'"
);

$saraEvt = php_query_one("SELECT id FROM events WHERE slug = 'sara-and-dawit-2026'");
if (!$saraEvt) {
    php_execute(
        "INSERT INTO events (id, slug, title, managed_by, organizer_id, couple_user_id, bride_name, groom_name, event_date, start_time, venue_name, venue_address, status, admin_approval_status, expected_guests, created_at)
         VALUES ('evt-sara-and-dawit-2026', 'sara-and-dawit-2026', 'Sara & Dawit — Royal Wedding 2026', 'ORGANIZER', 'org-matrimony-01', 'usr-couple-sara-dawit', 'Sara Kebede', 'Dawit Haile', '2026-12-20', '09:00', 'Sheraton Addis — Grand Ballroom', 'Taitu Street, Addis Ababa', 'COMING_SOON', 'APPROVED', 300, NOW())"
    );
} else {
    php_execute(
        "UPDATE events 
            SET organizer_id = 'org-matrimony-01', 
                couple_user_id = 'usr-couple-sara-dawit', 
                managed_by = 'ORGANIZER'
          WHERE slug = 'sara-and-dawit-2026'"
    );
}

echo "SUCCESS: All real users, organizers, and couples successfully seeded!\n";
