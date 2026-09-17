<?php
declare(strict_types=1);

// --- tiny PSR-4-ish autoloader: App\Foo\Bar -> src/Foo/Bar.php ---
// (Skeleton runs with zero Composer install. Swap for the composer
// autoloader once you add real dependencies via `composer install`.)
spl_autoload_register(function (string $class): void {
    if (!str_starts_with($class, 'App\\')) {
        return;
    }
    $relative = substr($class, strlen('App\\'));
    $path = __DIR__ . '/../src/' . str_replace('\\', '/', $relative) . '.php';
    if (is_file($path)) {
        require $path;
    }
});

// --- minimal .env loader (no external dependency) ---
$envPath = __DIR__ . '/../.env';
if (is_file($envPath)) {
    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}

use App\Presentation\Http\Router;

$controllers = require __DIR__ . '/../config/container.php';

$router = new Router();
$router->add('GET', '/api/health', fn () => $controllers['health']->check());
$router->add('POST', '/api/scan', fn () => $controllers['scanner']->scan());
$router->add('POST', '/api/scan/batch', fn () => $controllers['scanner']->batch());
$router->add('POST', '/api/guests/{token}/confirm', fn ($p) => $controllers['invitation']->confirm($p));
$router->add('POST', '/api/guests/{token}/decline', fn ($p) => $controllers['invitation']->decline($p));

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$router->dispatch($_SERVER['REQUEST_METHOD'], $path);
