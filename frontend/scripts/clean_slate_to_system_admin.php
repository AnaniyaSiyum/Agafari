<?php
require_once __DIR__ . '/../php-backend/config/db.php';

$pdo = getPdoConnection();
if (!$pdo) {
    echo "ERROR: Could not connect to MySQL database.\n";
    exit(1);
}

echo "=== INITIATING PLATFORM CLEAN SLATE: REMOVING ALL ROLES EXCEPT SYSTEM ADMIN ===\n";

$tablesToClear = [
    'post_likes',
    'media_comments',
    'media_assets',
    'wishes',
    'rsvps',
    'invitations',
    'event_staff',
    'event_locations',
    'live_streams',
    'mezmur_playlist',
    'events',
    'organizers',
    'account_requests',
];

foreach ($tablesToClear as $table) {
    try {
        $count = $pdo->exec("DELETE FROM {$table}");
        echo "Cleared table {$table} (deleted {$count} rows)\n";
    } catch (Throwable $e) {
        echo "Notice on table {$table}: " . $e->getMessage() . "\n";
    }
}

// 2. Clear non-admin memberships
try {
    $deletedMem = $pdo->exec("DELETE FROM memberships WHERE role != 'SYSTEM_ADMIN'");
    echo "Cleared non-SYSTEM_ADMIN memberships (deleted {$deletedMem} rows)\n";
} catch (Throwable $e) {
    echo "Notice on memberships: " . $e->getMessage() . "\n";
}

// 3. Clear non-admin users
try {
    $deletedUsers = $pdo->exec("DELETE FROM users WHERE LOWER(email) != 'admin@agafari.com' AND role != 'SYSTEM_ADMIN'");
    echo "Cleared all users except admin@agafari.com (deleted {$deletedUsers} rows)\n";
} catch (Throwable $e) {
    echo "Notice on users: " . $e->getMessage() . "\n";
}

// 4. Ensure System Admin exists, is ACTIVE, and has SYSTEM_ADMIN membership
$adminEmail = 'admin@agafari.com';
$adminUser = $pdo->query("SELECT id, email, role, temporary_password, password_hash FROM users WHERE LOWER(email) = 'admin@agafari.com'")->fetch(PDO::FETCH_ASSOC);

if (!$adminUser) {
    $adminId = 'usr-admin-1';
    $adminPass = 'Admin123!';
    $adminHash = password_hash($adminPass, PASSWORD_BCRYPT);
    $pdo->prepare("
        INSERT INTO users (id, email, phone, full_name, role, password_hash, temporary_password, is_active, created_at)
        VALUES (?, ?, '+251911000000', 'System Super Admin', 'SYSTEM_ADMIN', ?, ?, 1, NOW())
    ")->execute([$adminId, $adminEmail, $adminHash, $adminPass]);
    echo "Created fresh System Super Admin ({$adminEmail})\n";
} else {
    $adminId = $adminUser['id'];
    $pdo->prepare("
        UPDATE users 
        SET role = 'SYSTEM_ADMIN', is_active = 1
        WHERE id = ?
    ")->execute([$adminId]);
    echo "Verified existing System Super Admin ({$adminEmail}, ID: {$adminId})\n";
}

// Ensure membership exists for admin
$existingMem = $pdo->query("SELECT id FROM memberships WHERE user_id = '{$adminId}' AND role = 'SYSTEM_ADMIN'")->fetch(PDO::FETCH_ASSOC);
if (!$existingMem) {
    $pdo->prepare("
        INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status)
        VALUES ('mem-admin-1', ?, 'SYSTEM_ADMIN', 'PLATFORM', 'global', 'ACTIVE')
    ")->execute([$adminId]);
    echo "Created SYSTEM_ADMIN membership for {$adminId}\n";
} else {
    echo "Verified SYSTEM_ADMIN membership exists for {$adminId}\n";
}

// 5. Final verification count
$remainingUsers = $pdo->query("SELECT id, email, role, temporary_password, is_active FROM users")->fetchAll(PDO::FETCH_ASSOC);
$remainingOrgs = $pdo->query("SELECT id, business_name FROM organizers")->fetchAll(PDO::FETCH_ASSOC);
$remainingEvents = $pdo->query("SELECT id, slug, title FROM events")->fetchAll(PDO::FETCH_ASSOC);
$remainingMemberships = $pdo->query("SELECT id, role, scope_type FROM memberships")->fetchAll(PDO::FETCH_ASSOC);

echo "\n=== FINAL DATABASE STATE ===\n";
echo "Total Users remaining: " . count($remainingUsers) . "\n";
print_r($remainingUsers);
echo "Total Organizers remaining: " . count($remainingOrgs) . "\n";
echo "Total Events remaining: " . count($remainingEvents) . "\n";
echo "Total Memberships remaining: " . count($remainingMemberships) . "\n";
print_r($remainingMemberships);

echo "\nPLATFORM CLEAN SLATE COMPLETED SUCCESSFULLY!\n";
