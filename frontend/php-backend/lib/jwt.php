<?php

// =============================================================================
// AGAFARI (አጋፋሪ) — RFC 7519 JSON WEB TOKEN (JWT) ENGINE (HS256)
// Complete interoperability with Next.js crypto.createHmac('sha256', JWT_SECRET)
// =============================================================================

if (!function_exists('base64url_encode')) {
    function base64url_encode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}

if (!function_exists('base64url_decode')) {
    function base64url_decode(string $data): string {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(strtr($data, '-_', '+/'));
    }
}

/**
 * Shared JWT HMAC-SHA256 Secret Key
 */
function jwt_get_secret(): string {
    $secret = getenv('JWT_SECRET') ?: ($_ENV['JWT_SECRET'] ?? '');
    if (empty($secret)) {
        // Shared fallback secret matching frontend/src/config/env.ts
        $secret = 'agafari_super_secret_jwt_key_2026_change_in_production_32bytes';
    }
    return $secret;
}

/**
 * Sign an RFC 7519 JSON Web Token using HS256 algorithm.
 *
 * @param array $payload Claims (sub, email, role, organizerId, eventSlug, etc.)
 * @param int   $expiresInSeconds Expiration window (default: 86400 = 24 hours)
 * @return string Standard JWT (header.payload.signature)
 */
function jwt_sign(array $payload, int $expiresInSeconds = 86400): string {
    $header = [
        'alg' => 'HS256',
        'typ' => 'JWT',
    ];

    $now = time();
    $payload['iss'] = $payload['iss'] ?? 'https://agafari.com';
    $payload['iat'] = $payload['iat'] ?? $now;
    $payload['exp'] = $payload['exp'] ?? ($now + $expiresInSeconds);

    $encodedHeader = base64url_encode(json_encode($header, JSON_UNESCAPED_SLASHES));
    $encodedPayload = base64url_encode(json_encode($payload, JSON_UNESCAPED_SLASHES));

    $secret = jwt_get_secret();
    $rawSignature = hash_hmac('sha256', "{$encodedHeader}.{$encodedPayload}", $secret, true);
    $encodedSignature = base64url_encode($rawSignature);

    return "{$encodedHeader}.{$encodedPayload}.{$encodedSignature}";
}

/**
 * Verify and decode an RFC 7519 JSON Web Token.
 * Validates HS256 signature with constant-time equality check and checks expiration.
 *
 * @param string $token
 * @return array|null Returns decoded payload array or null if signature/expiry is invalid
 */
function jwt_verify(string $token): ?array {
    $token = trim($token);
    if (empty($token)) {
        return null;
    }

    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    list($encodedHeader, $encodedPayload, $encodedSignature) = $parts;

    $secret = jwt_get_secret();
    $expectedRawSignature = hash_hmac('sha256', "{$encodedHeader}.{$encodedPayload}", $secret, true);
    $expectedSignature = base64url_encode($expectedRawSignature);

    // Constant-time comparison to prevent timing attacks
    if (!hash_equals($expectedSignature, $encodedSignature)) {
        return null;
    }

    $payloadJson = base64url_decode($encodedPayload);
    if (!$payloadJson) {
        return null;
    }

    $payload = json_decode($payloadJson, true);
    if (!is_array($payload)) {
        return null;
    }

    // Expiration check (exp claim)
    if (isset($payload['exp']) && (int)$payload['exp'] < time()) {
        return null;
    }

    return $payload;
}
