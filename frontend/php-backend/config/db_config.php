<?php
// =============================================================================
// AGAFARI DIRECTADMIN / CPANEL DATABASE CONFIGURATION
// Enter your database credentials created in DirectAdmin MySQL Management
// =============================================================================

return [
    'host'     => getenv('MYSQL_HOST') ?: 'localhost',
    'port'     => getenv('MYSQL_PORT') ?: '3306',
    'dbname'   => getenv('MYSQL_DATABASE') ?: 'agafari',
    'user'     => getenv('MYSQL_USER') ?: 'root',
    'pass'     => getenv('MYSQL_PASSWORD') ?: '',
];
