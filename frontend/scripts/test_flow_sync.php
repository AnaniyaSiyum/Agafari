<?php
// Test verification for handwritten flow:
// 1. System Admin Login
// 2. Arganon Organizer Login
// 3. Dynamic Organizer Events Fetch
// 4. Admin Event Creation under Arganon
// 5. Organizer Live Sync Verification
// 6. Admin Event Deletion (Cascading)
// 7. Verify wedding immediately disappears from Organizer

$baseUrl = 'http://localhost:3000';

function makeRequest($method, $url, $headers = [], $body = null) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    if (!empty($headers)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }
    if ($body !== null) {
        $json = is_string($body) ? $body : json_encode($body);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
    }
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $code, 'body' => json_decode($res, true) ?: $res];
}

echo "=== TEST 1: System Admin Login ===\n";
$adminLogin = makeRequest('POST', "{$baseUrl}/api/auth/login", ['Content-Type: application/json'], [
    'email' => 'admin@agafari.com',
    'password' => 'Admin123!'
]);
if ($adminLogin['code'] !== 200 || empty($adminLogin['body']['token'])) {
    echo "FAILED: Admin login failed. " . json_encode($adminLogin) . "\n";
    exit(1);
}
$adminToken = $adminLogin['body']['token'];
echo "SUCCESS: Admin authenticated. redirectUrl: " . ($adminLogin['body']['redirectUrl'] ?? '') . "\n";

echo "\n=== TEST 2: Arganon Organizer Login ===\n";
$orgLogin = makeRequest('POST', "{$baseUrl}/api/auth/login", ['Content-Type: application/json'], [
    'email' => 'arganon@gmail.com',
    'password' => 'org123'
]);
if ($orgLogin['code'] !== 200 || empty($orgLogin['body']['token'])) {
    echo "FAILED: Arganon login failed. " . json_encode($orgLogin) . "\n";
    exit(1);
}
$orgToken = $orgLogin['body']['token'];
$orgRedirect = $orgLogin['body']['redirectUrl'] ?? '';
echo "SUCCESS: Arganon authenticated. Redirect: {$orgRedirect}\n";
assert(strpos($orgRedirect, '/organizer/dashboard') !== false, "Must redirect to organizer dashboard");

echo "\n=== TEST 3: Fetch Arganon Live Events ===\n";
$orgEventsRes = makeRequest('GET', "{$baseUrl}/api/organizer/events?id=org-arganon-01", [
    "Authorization: Bearer {$orgToken}"
]);
if ($orgEventsRes['code'] !== 200) {
    echo "FAILED: Could not fetch organizer events. " . json_encode($orgEventsRes) . "\n";
    exit(1);
}
$initialCount = count($orgEventsRes['body']['events'] ?? []);
echo "SUCCESS: Fetched {$initialCount} events for Arganon Agency.\n";

echo "\n=== TEST 4: Admin Creates Live Wedding under Arganon ===\n";
$testSlug = 'flow-test-wedding-' . time();
$createRes = makeRequest('POST', "{$baseUrl}/api/admin/events", [
    'Content-Type: application/json',
    "Authorization: Bearer {$adminToken}"
], [
    'title' => 'Flow Test & Verification Wedding',
    'slug' => $testSlug,
    'bride_name' => 'Sara',
    'groom_name' => 'Michael',
    'event_date' => '2026-12-25',
    'venue_name' => 'Sheraton Addis',
    'expected_guests' => 500,
    'organizer_id' => 'org-arganon-01',
    'admin_approval_status' => 'APPROVED',
    'status' => 'LIVE'
]);
if ($createRes['code'] !== 200 && $createRes['code'] !== 201) {
    echo "FAILED: Admin could not create event. " . json_encode($createRes) . "\n";
    exit(1);
}
echo "SUCCESS: Event created under Arganon with slug {$testSlug}\n";

echo "\n=== TEST 5: Verify Live Event Appears in Arganon Dashboard API ===\n";
$orgEventsAfterAdd = makeRequest('GET', "{$baseUrl}/api/organizer/events?id=org-arganon-01", [
    "Authorization: Bearer {$orgToken}"
]);
$eventsList = $orgEventsAfterAdd['body']['events'] ?? [];
$foundInOrg = false;
$createdEventId = null;
foreach ($eventsList as $ev) {
    if ($ev['slug'] === $testSlug) {
        $foundInOrg = true;
        $createdEventId = $ev['id'];
        break;
    }
}
if (!$foundInOrg) {
    echo "FAILED: New event did not appear live in Arganon Dashboard!\n";
    exit(1);
}
echo "SUCCESS: New wedding (ID: {$createdEventId}) is LIVE in Arganon Dashboard.\n";

echo "\n=== TEST 6: Admin Removes the Wedding Event ===\n";
$deleteRes = makeRequest('DELETE', "{$baseUrl}/api/admin/events?eventId={$createdEventId}", [
    "Authorization: Bearer {$adminToken}"
]);
if ($deleteRes['code'] !== 200) {
    echo "FAILED: Admin deletion failed. " . json_encode($deleteRes) . "\n";
    exit(1);
}
echo "SUCCESS: Admin deleted event {$createdEventId}: " . json_encode($deleteRes['body']) . "\n";

echo "\n=== TEST 7: Verify Wedding Disappeared from Arganon Dashboard ===\n";
$orgEventsAfterDelete = makeRequest('GET', "{$baseUrl}/api/organizer/events?id=org-arganon-01", [
    "Authorization: Bearer {$orgToken}"
]);
$remainingEvents = $orgEventsAfterDelete['body']['events'] ?? [];
$stillPresent = false;
foreach ($remainingEvents as $ev) {
    if ($ev['slug'] === $testSlug || $ev['id'] === $createdEventId) {
        $stillPresent = true;
        break;
    }
}
if ($stillPresent) {
    echo "FAILED: Deleted event is STILL visible in Arganon Dashboard!\n";
    exit(1);
}
echo "SUCCESS: Deleted wedding has IMMEDIATELY DISAPPEARED from Arganon Dashboard!\n";
echo "\n>>> ALL FLOW AND CASCADE DELETION TESTS PASSED COMPLETELY! <<<\n";
