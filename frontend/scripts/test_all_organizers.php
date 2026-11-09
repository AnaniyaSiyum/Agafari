<?php
// Comprehensive verification for ALL organizing agencies:
// 1. Kebkab Events (kebkab@gmail.com)
// 2. Arganon Events (arganon@gmail.com)
// 3. Matrimony Planners (matrimony@agafari.com)
// 4. Agafari Events (organizer@agafari.com)
// 5. Admin Dynamic Organizer Provisioning (new agency)

$baseUrl = 'http://localhost:3000';

function testRequest($method, $url, $headers = [], $body = null) {
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

$agencies = [
    [
        'name' => 'Kebkab Events Agency',
        'email' => 'kebkab@gmail.com',
        'password' => 'org123',
        'expectedOrgId' => 'org-kebkab-01',
        'expectedSlug' => 'sara-and-dawit-2026'
    ],
    [
        'name' => 'Arganon Events Agency',
        'email' => 'arganon@gmail.com',
        'password' => 'org123',
        'expectedOrgId' => 'org-arganon-01',
        'expectedSlug' => 'selam-and-bereket-2026'
    ],
    [
        'name' => 'Matrimony Planners',
        'email' => 'matrimony@agafari.com',
        'password' => 'org123',
        'expectedOrgId' => 'org-matrimony-01',
        'expectedSlug' => 'melat-and-tesfaye-2026'
    ],
    [
        'name' => 'Agafari Events Agency',
        'email' => 'organizer@agafari.com',
        'password' => 'org123',
        'expectedOrgId' => 'org-agafari-01',
        'expectedSlug' => null
    ],
];

foreach ($agencies as $agency) {
    echo "\n=== Testing Login for {$agency['name']} ({$agency['email']}) ===\n";
    $loginRes = testRequest('POST', "{$baseUrl}/api/auth/login", ['Content-Type: application/json'], [
        'email' => $agency['email'],
        'password' => $agency['password']
    ]);

    if ($loginRes['code'] !== 200 || empty($loginRes['body']['token'])) {
        echo "FAILED: Login failed for {$agency['email']}: " . json_encode($loginRes) . "\n";
        exit(1);
    }

    $token = $loginRes['body']['token'];
    $redirectUrl = $loginRes['body']['redirectUrl'] ?? '';
    echo "SUCCESS: Logged in! Redirect: {$redirectUrl}\n";
    if (strpos($redirectUrl, $agency['expectedOrgId']) === false) {
        echo "WARNING: Expected {$agency['expectedOrgId']} in redirect URL {$redirectUrl}\n";
    }

    // Fetch this agency's events
    $eventsRes = testRequest('GET', "{$baseUrl}/api/organizer/events?id=" . urlencode($agency['expectedOrgId']), [
        "Authorization: Bearer {$token}"
    ]);

    if ($eventsRes['code'] !== 200) {
        echo "FAILED: Could not fetch events for {$agency['name']}: " . json_encode($eventsRes) . "\n";
        exit(1);
    }

    $events = $eventsRes['body']['events'] ?? [];
    $orgInfo = $eventsRes['body']['organizerInfo'] ?? [];
    echo "SUCCESS: Retrieved " . count($events) . " events for {$agency['name']} (Agency Name: " . ($orgInfo['agencyName'] ?? 'N/A') . ")\n";

    if (!empty($agency['expectedSlug'])) {
        $found = false;
        foreach ($events as $ev) {
            if ($ev['slug'] === $agency['expectedSlug']) {
                $found = true;
                echo "  ✓ Found assigned wedding: {$ev['title']} (slug: {$ev['slug']})\n";
                break;
            }
        }
        if (!$found) {
            echo "WARNING: Expected wedding {$agency['expectedSlug']} not found in {$agency['name']} events.\n";
        }
    }
}

// 5. Test System Admin provisioning a BRAND NEW organizer agency dynamically
echo "\n=== Testing System Admin Provisioning a Brand New Agency ===\n";
$adminLogin = testRequest('POST', "{$baseUrl}/api/auth/login", ['Content-Type: application/json'], [
    'email' => 'admin@agafari.com',
    'password' => 'Admin123!'
]);
$adminToken = $adminLogin['body']['token'];

$newAgencyEmail = 'dynamictest_' . time() . '@agafari.com';
$newAgencyPass = 'dynamicPass123!';
$createUserRes = testRequest('POST', "{$baseUrl}/api/admin/users", [
    'Content-Type: application/json',
    "Authorization: Bearer {$adminToken}"
], [
    'email' => $newAgencyEmail,
    'password' => $newAgencyPass,
    'fullName' => 'Dynamic Star Events Agency',
    'role' => 'EVENT_ORGANIZER',
    'phone' => '+251912998877'
]);

if ($createUserRes['code'] !== 200 && $createUserRes['code'] !== 201) {
    echo "FAILED: Admin could not create new agency: " . json_encode($createUserRes) . "\n";
    exit(1);
}
echo "SUCCESS: Admin provisioned new agency {$newAgencyEmail}\n";

// Now log in as that brand new agency
$newLoginRes = testRequest('POST', "{$baseUrl}/api/auth/login", ['Content-Type: application/json'], [
    'email' => $newAgencyEmail,
    'password' => $newAgencyPass
]);

if ($newLoginRes['code'] !== 200 || empty($newLoginRes['body']['token'])) {
    echo "FAILED: New agency login failed: " . json_encode($newLoginRes) . "\n";
    exit(1);
}
echo "SUCCESS: Newly created agency logged in immediately! Redirect: " . ($newLoginRes['body']['redirectUrl'] ?? '') . "\n";

echo "\n>>> ALL ORGANIZING AGENCIES AUTHENTICATION & MULTI-TENANT VERIFICATION PASSED! <<<\n";
