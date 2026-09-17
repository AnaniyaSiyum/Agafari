<?php
declare(strict_types=1);

namespace App\Infrastructure\Security;

use App\Application\Ports\TicketSignerInterface;

final class HmacTicketSigner implements TicketSignerInterface
{
    public function __construct(private readonly string $secret)
    {
    }

    public function sign(string $guestId): string
    {
        return hash_hmac('sha256', $guestId, $this->secret);
    }

    public function verify(string $guestId, string $signature): bool
    {
        return hash_equals($this->sign($guestId), $signature);
    }
}
