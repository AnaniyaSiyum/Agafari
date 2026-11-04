<?php

// =============================================================================
// RFC 4122 v4 UUID GENERATOR IN PHP
// =============================================================================

function generate_uuid_v4(): string {
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10

    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function generate_uuid(): string {
    return generate_uuid_v4();
}

/**
 * Returns a 36-char prefixed or raw UUID that safely fits VARCHAR(36)
 */
function generate_safe_id(string $prefix = ''): string {
    $uuid = generate_uuid_v4();
    if (empty($prefix)) {
        return $uuid;
    }
    $len = strlen($prefix);
    return $prefix . substr($uuid, $len);
}
