<?php
// DirectAdmin database credentials belong in a server-side .env file.
// Never commit database passwords to this public repository.
return [
    'host'    => getenv('MYSQL_HOST') ?: getenv('DB_HOST') ?: 'localhost',
    'port'    => getenv('MYSQL_PORT') ?: getenv('DB_PORT') ?: '3306',
    'dbname'  => getenv('MYSQL_DATABASE') ?: getenv('DB_NAME') ?: '',
    'user'    => getenv('MYSQL_USER') ?: getenv('DB_USER') ?: '',
    'pass'    => getenv('MYSQL_PASSWORD') ?: getenv('DB_PASSWORD') ?: '',
    'charset' => 'utf8mb4',
];
