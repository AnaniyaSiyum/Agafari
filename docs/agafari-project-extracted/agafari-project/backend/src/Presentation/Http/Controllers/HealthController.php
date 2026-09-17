<?php
declare(strict_types=1);

namespace App\Presentation\Http\Controllers;

final class HealthController
{
    public function check(): array
    {
        return ['status' => 'ok', 'service' => 'agafari-api'];
    }
}
