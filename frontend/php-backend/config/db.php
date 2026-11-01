<?php

// =============================================================================
// AGAFARI (አጋፋሪ) WEDDING PLATFORM — PHP PDO DATABASE CONNECTION
// Replaces PostgreSQL pg Pool with PDO (MySQL / MariaDB / SQLite driver)
// =============================================================================

// ---------------------------------------------------------------------------
// Environment & Database Configuration Loader
// ---------------------------------------------------------------------------
function getDbConfig(): array {
    static $envLoaded = false;
    if (!$envLoaded) {
        $envPaths = [
            __DIR__ . '/../../.env',
            __DIR__ . '/../.env',
            __DIR__ . '/.env',
            (__SERVER_DOC_ROOT() ? __SERVER_DOC_ROOT() . '/.env' : null),
        ];
        foreach ($envPaths as $p) {
            if ($p && file_exists($p) && is_readable($p)) {
                $lines = file($p, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                if (is_array($lines)) {
                    foreach ($lines as $line) {
                        $line = trim($line);
                        if ($line === '' || str_starts_with($line, '#')) continue;
                        $parts = explode('=', $line, 2);
                        if (count($parts) === 2) {
                            $k = trim($parts[0]);
                            $v = trim(trim($parts[1]), '"\'');
                            if (!getenv($k)) {
                                putenv("{$k}={$v}");
                                $_ENV[$k] = $v;
                            }
                        }
                    }
                }
                break;
            }
        }
        $envLoaded = true;
    }

    // DirectAdmin / cPanel / LiteSpeed custom config file support
    $customConfig = __DIR__ . '/db_config.php';
    if (file_exists($customConfig)) {
        $custom = include $customConfig;
        if (is_array($custom)) {
            $defaults = [
                'host' => 'localhost',
                'port' => '3306',
                'dbname' => 'agafari',
                'user' => 'root',
                'pass' => '',
                'charset' => 'utf8mb4'
            ];
            return array_merge($defaults, $custom);
        }
    }

    $host = getenv('MYSQL_HOST') ?: getenv('DB_HOST') ?: 'localhost';
    $port = getenv('MYSQL_PORT') ?: getenv('DB_PORT') ?: '3306';
    $dbname = getenv('MYSQL_DATABASE') ?: getenv('DB_NAME') ?: getenv('DB_DATABASE') ?: 'agafari';
    $user = getenv('MYSQL_USER') ?: getenv('DB_USER') ?: getenv('DB_USERNAME') ?: 'root';
    $pass = getenv('MYSQL_PASSWORD') ?: getenv('DB_PASSWORD') ?: '';

    return compact('host', 'port', 'dbname', 'user', 'pass');
}

function __SERVER_DOC_ROOT(): ?string {
    return $_SERVER['DOCUMENT_ROOT'] ?? null;
}

function getPdoConnection(): ?PDO {
    static $pdo = null;
    static $attempted = false;

    if ($pdo !== null) {
        return $pdo;
    }
    if ($attempted) {
        return null;
    }

    $attempted = true;
    $cfg = getDbConfig();
    
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::ATTR_TIMEOUT            => 4,
    ];

    // Try primary host first, then fallback between localhost and 127.0.0.1
    $hosts = [$cfg['host']];
    if ($cfg['host'] === 'localhost') {
        $hosts[] = '127.0.0.1';
    } elseif ($cfg['host'] === '127.0.0.1') {
        $hosts[] = 'localhost';
    }

    $lastError = '';
    foreach ($hosts as $h) {
        try {
            $dsn = "mysql:host={$h};port={$cfg['port']};dbname={$cfg['dbname']};charset=utf8mb4";
            $pdo = new PDO($dsn, $cfg['user'], $cfg['pass'], $options);
            return $pdo;
        } catch (Throwable $e) {
            $lastError = $e->getMessage();
        }
    }

    error_log('[Agafari DB] MySQL connection failed (' . $cfg['host'] . '/' . $cfg['dbname'] . '): ' . $lastError);
    return null;
}

/**
 * Execute a parameterized SELECT query returning an array of rows
 */
function php_query(string $sql, array $params = []): array {
    $pdo = getPdoConnection();
    if (!$pdo) {
        return [];
    }
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Throwable $e) {
        error_log('[Agafari DB query] ' . $e->getMessage());
        return [];
    }
}

/**
 * Execute a parameterized SELECT query returning a single row or null
 */
function php_query_one(string $sql, array $params = []): ?array {
    $rows = php_query($sql, $params);
    return $rows[0] ?? null;
}

/**
 * Execute an INSERT / UPDATE / DELETE statement
 */
function php_execute(string $sql, array $params = []): int {
    $pdo = getPdoConnection();
    if (!$pdo) {
        return 0;
    }
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    } catch (Throwable $e) {
        error_log('[Agafari DB execute] ' . $e->getMessage());
        return 0;
    }
}

/**
 * Execute multi-statement operations in a PDO transaction
 */
function php_with_transaction(callable $fn) {
    $pdo = getPdoConnection();
    $pdo->beginTransaction();
    try {
        $result = $fn($pdo);
        $pdo->commit();
        return $result;
    } catch (Throwable $err) {
        $pdo->rollBack();
        throw $err;
    }
}
