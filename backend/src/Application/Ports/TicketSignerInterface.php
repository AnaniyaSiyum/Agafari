<?php
declare(strict_types=1);

namespace App\Application\Ports;

interface TicketSignerInterface
{
    public function sign(string $guestId): string;

    public function verify(string $guestId, string $signature): bool;
}
