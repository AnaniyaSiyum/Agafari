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
    $parts = explode(':', $storedHash);
    if (count($parts) !== 2) {
        return false;
    }
    list($salt, $originalHash) = $parts;
    $computedHash = hash_pbkdf2('sha512', $password, $salt, 100000, 128);
    return hash_equals($originalHash, $computedHash);
}
