<?php
declare(strict_types=1);

namespace App\Application\Ports;

use App\Domain\Ticket\Ticket;

interface TicketRepositoryInterface
{
    public function findByGuestId(string $guestId): ?Ticket;

    public function issueFor(string $guestId, string $signature, int $headcountAllowed): Ticket;

    public function save(Ticket $ticket): void;
}
