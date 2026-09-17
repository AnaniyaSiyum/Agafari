<?php
declare(strict_types=1);

namespace App\Infrastructure\Persistence;

final class PdoConnection
{
    private static ?\PDO $instance = null;

    public static function get(): \PDO
    {
        if (self::$instance !== null) {
            return self::$instance;
        }

        $driver = $_ENV['DB_DRIVER'] ?? 'sqlite';

        if ($driver === 'sqlite') {
            $configured = $_ENV['DB_PATH'] ?? 'storage/database.sqlite';
            // Relative paths are resolved against the backend project root
            // (not getcwd()) so it works the same whether you start the
            // server from backend/ or anywhere else.
            $projectRoot = __DIR__ . '/../../../';
            $path = str_starts_with($configured, '/') ? $configured : $projectRoot . ltrim($configured, './');
            $pdo = new \PDO('sqlite:' . $path);
        } else {
            $host = $_ENV['DB_HOST'] ?? '127.0.0.1';
            $port = $_ENV['DB_PORT'] ?? '3306';
            $name = $_ENV['DB_NAME'] ?? 'agafari';
            $user = $_ENV['DB_USER'] ?? 'root';
            $pass = $_ENV['DB_PASS'] ?? '';
            $pdo = new \PDO("mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4", $user, $pass);
        }

        $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        self::$instance = $pdo;

        return $pdo;
    }
}
