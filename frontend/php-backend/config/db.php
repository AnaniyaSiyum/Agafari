<?php

// =============================================================================
// AGAFARI (አጋፋሪ) WEDDING PLATFORM — PHP PDO DATABASE CONNECTION
// Replaces PostgreSQL pg Pool with PDO (MySQL / MariaDB / SQLite driver)
// =============================================================================

function getPdoConnection(): PDO {
    static $pdo = null;

    if ($pdo === null) {
        $host = getenv('MYSQL_HOST') ?: '127.0.0.1';
        $port = getenv('MYSQL_PORT') ?: '3306';
        $dbname = getenv('MYSQL_DATABASE') ?: 'agafari';
        $user = getenv('MYSQL_USER') ?: 'root';
        $pass = getenv('MYSQL_PASSWORD') ?: '';
        
        $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
        
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            // Fallback: If MySQL host fails, fallback to SQLite database file
            $sqlitePath = __DIR__ . '/../../db/agafari.sqlite';
            $pdo = new PDO("sqlite:{$sqlitePath}", null, null, $options);
        }
    }

    return $pdo;
}

/**
 * Execute a parameterized SELECT query returning an array of rows
 */
function php_query(string $sql, array $params = []): array {
    $pdo = getPdoConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
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
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->rowCount();
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
