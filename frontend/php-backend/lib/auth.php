<?php

// =============================================================================
// AGAFARI AUTHENTICATION & PASSWORD HASHING IN PHP
// Compatible with Node.js pbkdf2Sync('sha512', 100000 iterations, 64 bytes)
// =============================================================================

function hash_password_php(string $password): string {
    $salt = bin2hex(random_bytes(16));
    $hash = hash_pbkdf2('sha512', $password, $salt, 100000, 128);
    return $salt . ':' . $hash;
}

function verify_password_php(string $password, string $storedHash): bool {
    if (empty($password) || empty($storedHash)) {
        return false;
    }

    // 1. Standard Bcrypt check ($2y$, $2a$, $2b$)
    if (str_starts_with($storedHash, '$2y$') || str_starts_with($storedHash, '$2a$') || str_starts_with($storedHash, '$2b$')) {
        return password_verify($password, $storedHash);
    }

    // 2. Legacy PBKDF2 check (salt:hash)
    $parts = explode(':', $storedHash);
    if (count($parts) === 2) {
        list($salt, $originalHash) = $parts;
        $computedHash = hash_pbkdf2('sha512', $password, $salt, 100000, 128);
        return hash_equals($originalHash, $computedHash);
    }

    return false;
}
