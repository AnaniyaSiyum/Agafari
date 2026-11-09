<?php
// Test all credentials against localhost:3000/api/auth/login
$testCases = [
    ['label' => 'Arganon Organizer (Email)', 'email' => 'arganon@gmail.com', 'password' => 'org123', 'expectedRole' => 'EVENT_ORGANIZER'],
    ['label' => 'Arganon Organizer (Username)', 'email' => 'arganon', 'password' => 'org123', 'expectedRole' => 'EVENT_ORGANIZER'],
    ['label' => 'Matrimony Organizer (Email)', 'email' => 'matrimony@agafari.com', 'password' => 'org123', 'expectedRole' => 'EVENT_ORGANIZER'],
    ['label' => 'Matrimony Organizer (Username)', 'email' => 'matrimony', 'password' => 'org123', 'expectedRole' => 'EVENT_ORGANIZER'],
    ['label' => 'Melat & Tesfaye Couple (agafari9534)', 'email' => 'meltes@gmail.com', 'password' => 'agafari9534', 'expectedRole' => 'COUPLE'],
    ['label' => 'Melat & Tesfaye Couple (org123)', 'email' => 'meltes@gmail.com', 'password' => 'org123', 'expectedRole' => 'COUPLE'],
    ['label' => 'Sara & Dawit Couple', 'email' => 'couple@agafari.com', 'password' => 'agafari2026', 'expectedRole' => 'COUPLE'],
    ['label' => 'System Super Admin', 'email' => 'admin@agafari.com', 'password' => 'Admin123!', 'expectedRole' => 'SYSTEM_ADMIN'],
];

require_once __DIR__ . '/frontend/php-backend/config/db.php';
$pdo = getPdoConnection();
if ($pdo) {
    $pdo->query('TRUNCATE TABLE php_rate_limits');
}

$allPassed = true;
foreach ($testCases as $tc) {
    $ch = curl_init('http://localhost:3000/api/auth/login');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'email' => $tc['email'],
        'password' => $tc['password']
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'X-Forwarded-For: 127.0.0.' . rand(10, 200) // avoid test IP rate limiting
    ]);
    $res = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $json = json_decode($res, true);
    if ($status === 200 && isset($json['token']) && ($json['user']['role'] ?? '') === $tc['expectedRole']) {
        echo "[PASS] {$tc['label']}: Role={$json['user']['role']}, Redirect={$json['redirectUrl']}\n";
    } else {
        echo "[FAIL] {$tc['label']}: Status={$status}, Response=" . substr($res, 0, 150) . "\n";
        $allPassed = false;
    }
}

// Reset rate limits table after test
if ($pdo) {
    $pdo->query('TRUNCATE TABLE php_rate_limits');
}

if ($allPassed) {
    echo "\n>>> ALL 8 LOGIN TEST CASES PASSED PERFECTLY! <<<\n";
} else {
    echo "\n>>> SOME TESTS FAILED! <<<\n";
    exit(1);
}
