<?php
declare(strict_types=1);

namespace App\Presentation\Http;

/**
 * Deliberately tiny — no framework dependency. Routes are (method, exact path
 * or /param/ pattern) -> callable. Enough for this skeleton; swap in a real
 * router (FastRoute, Slim) once the surface grows.
 */
final class Router
{
    /** @var array<int, array{method:string, pattern:string, handler:callable}> */
    private array $routes = [];

    public function add(string $method, string $pattern, callable $handler): void
    {
        $this->routes[] = ['method' => $method, 'pattern' => $pattern, 'handler' => $handler];
    }

    public function dispatch(string $method, string $path): void
    {
        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            $params = $this->match($route['pattern'], $path);
            if ($params === null) {
                continue;
            }

            header('Content-Type: application/json');
            try {
                $result = ($route['handler'])($params);
                echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            } catch (\App\Domain\Shared\Exceptions\DomainException $e) {
                http_response_code(422);
                echo json_encode(['error' => $e->getMessage()]);
            } catch (\Throwable $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal error', 'detail' => $e->getMessage()]);
            }
            return;
        }

        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Not found']);
    }

    /** @return array<string,string>|null */
    private function match(string $pattern, string $path): ?array
    {
        $patternParts = explode('/', trim($pattern, '/'));
        $pathParts = explode('/', trim($path, '/'));

        if (count($patternParts) !== count($pathParts)) {
            return null;
        }

        $params = [];
        foreach ($patternParts as $i => $part) {
            if (str_starts_with($part, '{') && str_ends_with($part, '}')) {
                $params[trim($part, '{}')] = $pathParts[$i];
            } elseif ($part !== $pathParts[$i]) {
                return null;
            }
        }

        return $params;
    }
}
