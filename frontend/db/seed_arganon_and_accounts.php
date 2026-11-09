<?php
// =============================================================================
// AGAFARI — SEED ARGANON, ORGANIZERS, AND COUPLE ACCOUNTS
// =============================================================================
require_once __DIR__ . '/../php-backend/config/db.php';
$pdo = getPdoConnection();
if (!$pdo) {
    echo "DB Connection failed: " . db_last_error() . "\n";
    exit(1);
}

// 1. Clear rate limits
try {
    $pdo->exec("TRUNCATE TABLE php_rate_limits");
    echo "[✓] Cleared rate limits\n";
} catch (Exception $e) {
    echo "[!] Could not truncate rate limits: " . $e->getMessage() . "\n";
}

// 2. Ensure users.role column is VARCHAR(50)
try {
    $pdo->exec("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL DEFAULT 'GUEST'");
    echo "[✓] users.role normalized to VARCHAR(50)\n";
} catch (Exception $e) {}

// Ensure temporary_password column exists in users
try {
    $col = $pdo->query("SHOW COLUMNS FROM users LIKE 'temporary_password'")->fetch();
    if (!$col) {
        $pdo->exec("ALTER TABLE users ADD COLUMN temporary_password VARCHAR(255) NULL AFTER password_hash");
        echo "[✓] Added temporary_password column to users\n";
    }
} catch (Exception $e) {}

// Helper to upsert user
function upsert_user(PDO $pdo, array $u) {
    $hash = password_hash($u['raw_password'], PASSWORD_BCRYPT);
    $existing = $pdo->prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(?) OR id = ?");
    $existing->execute([$u['email'], $u['id']]);
    $row = $existing->fetch();

    if ($row) {
        $stmt = $pdo->prepare("
            UPDATE users 
               SET email = ?, phone = ?, full_name = ?, role = ?, 
                   password_hash = ?, temporary_password = ?, is_active = 1
             WHERE id = ?
        ");
        $stmt->execute([
            $u['email'], $u['phone'] ?? '', $u['full_name'], $u['role'],
            $hash, $u['temporary_password'] ?? $u['raw_password'],
            $row['id']
        ]);
        echo "  [Updated User] {$u['email']} ({$u['role']})\n";
        return $row['id'];
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO users (id, email, phone, full_name, role, password_hash, temporary_password, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW())
        ");
        $stmt->execute([
            $u['id'], $u['email'], $u['phone'] ?? '', $u['full_name'], $u['role'],
            $hash, $u['temporary_password'] ?? $u['raw_password']
        ]);
        echo "  [Created User] {$u['email']} ({$u['role']})\n";
        return $u['id'];
    }
}

// Helper to upsert organizer
function upsert_organizer(PDO $pdo, array $o) {
    $existing = $pdo->prepare("SELECT id FROM organizers WHERE id = ? OR owner_user_id = ?");
    $existing->execute([$o['id'], $o['owner_user_id']]);
    $row = $existing->fetch();

    if ($row) {
        $stmt = $pdo->prepare("
            UPDATE organizers 
               SET business_name = ?, contact_phone = ?, owner_user_id = ?
             WHERE id = ?
        ");
        $stmt->execute([$o['business_name'], $o['contact_phone'] ?? '', $o['owner_user_id'], $row['id']]);
        echo "  [Updated Organizer] {$o['business_name']} ({$row['id']})\n";
        return $row['id'];
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO organizers (id, owner_user_id, business_name, contact_phone, created_at)
            VALUES (?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$o['id'], $o['owner_user_id'], $o['business_name'], $o['contact_phone'] ?? '']);
        echo "  [Created Organizer] {$o['business_name']} ({$o['id']})\n";
        return $o['id'];
    }
}

// 3. Upsert Users
echo "\n--- Seeding Users ---\n";

// A. Arganon Organizer (THE ONE USER ENTERED IN SCREENSHOT)
$arganonUserId = upsert_user($pdo, [
    'id' => 'usr-org-arganon',
    'email' => 'arganon@gmail.com',
    'phone' => '+251911334455',
    'full_name' => 'Arganon Events Agency',
    'role' => 'EVENT_ORGANIZER',
    'raw_password' => 'org123',
    'temporary_password' => 'org123|Organizer123!|arganon123|agafari2026',
]);

// B. Matrimony Planners Organizer
$matrimonyUserId = upsert_user($pdo, [
    'id' => 'usr-org-matrimony',
    'email' => 'matrimony@agafari.com',
    'phone' => '+251911223344',
    'full_name' => 'Matrimony Planners',
    'role' => 'EVENT_ORGANIZER',
    'raw_password' => 'org123',
    'temporary_password' => 'org123|Organizer123!|matrimony123|agafari2026',
]);

// C. Agafari Events Agency
$agafariUserId = upsert_user($pdo, [
    'id' => 'usr-org-agafari',
    'email' => 'organizer@agafari.com',
    'phone' => '+251911556677',
    'full_name' => 'Agafari Events Agency',
    'role' => 'EVENT_ORGANIZER',
    'raw_password' => 'Organizer123!',
    'temporary_password' => 'Organizer123!|org123|agafari2026',
]);

// D. System Super Admin
upsert_user($pdo, [
    'id' => 'usr-admin-1',
    'email' => 'admin@agafari.com',
    'phone' => '+251911000000',
    'full_name' => 'System Super Admin',
    'role' => 'SYSTEM_ADMIN',
    'raw_password' => 'Admin123!',
    'temporary_password' => 'Admin123!',
]);

// E. Couple: Melat & Tesfaye
$meltesUserId = upsert_user($pdo, [
    'id' => 'usr-couple-1793456411999-779',
    'email' => 'meltes@gmail.com',
    'phone' => '+251911998877',
    'full_name' => 'Melat & Tesfaye',
    'role' => 'COUPLE',
    'raw_password' => 'agafari9534',
    'temporary_password' => 'agafari9534|org123|couple123|agafari2026',
]);

// F. Couple: Sara & Dawit
$saraUserId = upsert_user($pdo, [
    'id' => 'usr-couple-sara-dawit',
    'email' => 'couple@agafari.com',
    'phone' => '+251911888999',
    'full_name' => 'Sara & Dawit',
    'role' => 'COUPLE',
    'raw_password' => 'agafari2026',
    'temporary_password' => 'agafari2026|org123|couple123',
]);

// G. Couple: Selam & Bereket
$selamUserId = upsert_user($pdo, [
    'id' => 'usr-couple-selam-bereket',
    'email' => 'selambereket@gmail.com',
    'phone' => '+251911776655',
    'full_name' => 'Selamawit & Bereket',
    'role' => 'COUPLE',
    'raw_password' => 'agafari2026',
    'temporary_password' => 'agafari2026|org123|couple123',
]);

// 4. Upsert Organizers
echo "\n--- Seeding Organizers ---\n";
upsert_organizer($pdo, [
    'id' => 'org-arganon-01',
    'owner_user_id' => $arganonUserId,
    'business_name' => 'Arganon Events Agency',
    'contact_phone' => '+251911334455',
]);

upsert_organizer($pdo, [
    'id' => 'org-matrimony-01',
    'owner_user_id' => $matrimonyUserId,
    'business_name' => 'Matrimony Planners',
    'contact_phone' => '+251911223344',
]);

upsert_organizer($pdo, [
    'id' => 'org-agafari-01',
    'owner_user_id' => $agafariUserId,
    'business_name' => 'Agafari Events Agency',
    'contact_phone' => '+251911556677',
]);

// 5. Ensure Events exist and are properly bound
echo "\n--- Seeding Events ---\n";

// Selam & Bereket Event (Bound to Arganon Events Agency)
$stmt = $pdo->prepare("SELECT id FROM events WHERE slug = 'selam-and-bereket-2026' OR id = 'evt-selam-and-bereket-2026'");
$stmt->execute();
if (!$stmt->fetch()) {
    $ins = $pdo->prepare("
        INSERT INTO events (
            id, organizer_id, couple_user_id, title, slug,
            bride_name, groom_name, event_date, venue_name, venue_address,
            status, admin_approval_status, created_at
        ) VALUES (
            'evt-selam-and-bereket-2026', 'org-arganon-01', 'usr-couple-selam-bereket',
            'Selam & Bereket — Royal Wedding 2026', 'selam-and-bereket-2026',
            'Selamawit Tadesse', 'Bereket Assefa', '2026-12-28 14:00:00',
            'Sheraton Addis, Lalibela Grand Ballroom', 'Taitu St, Addis Ababa',
            'LIVE', 'APPROVED', NOW()
        )
    ");
    $ins->execute();
    echo "  [Created Event] Selam & Bereket (Bound to Arganon)\n";
} else {
    $upd = $pdo->prepare("UPDATE events SET organizer_id = 'org-arganon-01', couple_user_id = 'usr-couple-selam-bereket' WHERE slug = 'selam-and-bereket-2026'");
    $upd->execute();
    echo "  [Updated Event] Selam & Bereket bound to org-arganon-01\n";
}

// Melat & Tesfaye Event
$upd = $pdo->prepare("UPDATE events SET organizer_id = 'org-matrimony-01', couple_user_id = 'usr-couple-1793456411999-779' WHERE slug = 'melat-and-tesfaye-2026'");
$upd->execute();
echo "  [Updated Event] Melat & Tesfaye bound to org-matrimony-01\n";

// Sara & Dawit Event
$upd = $pdo->prepare("UPDATE events SET organizer_id = 'org-matrimony-01', couple_user_id = 'usr-couple-sara-dawit' WHERE slug = 'sara-and-dawit-2026'");
$upd->execute();
echo "  [Updated Event] Sara & Dawit bound to org-matrimony-01\n";

echo "\n[✓] ALL SEEDING AND LINKING COMPLETE!\n";
