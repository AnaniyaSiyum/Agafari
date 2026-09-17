<?php
declare(strict_types=1);

namespace App\Application\Ports;

interface NotificationGatewayInterface
{
    public function send(string $phone, string $message): void;
}
