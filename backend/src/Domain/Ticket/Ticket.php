<?php
declare(strict_types=1);

namespace App\Domain\Ticket;

/**
 * A signed entry ticket tied to one guest. Pure domain entity:
 * no PDO, no HTTP, no framework. It only knows the rules of a ticket.
 */
final class Ticket
{
    public function __construct(
        public readonly string $guestId,
        public readonly string $signature,
        public readonly int $headcountAllowed,
        public ?\DateTimeImmutable $checkedInAt = null,
        public ?string $checkedInByDevice = null,
    ) {
    }

    public function isCheckedIn(): bool
    {
        return $this->checkedInAt !== null;
    }

    /**
     * Core rule from the product spec:
     * "VALID: Headcount N" unless already checked in.
     */
    public function attemptCheckIn(string $deviceId, \DateTimeImmutable $at): TicketStatus
    {
        if ($this->isCheckedIn()) {
            return TicketStatus::AlreadyCheckedIn;
        }

        if ($this->headcountAllowed < 1) {
            return TicketStatus::HeadcountExceeded;
        }

        $this->checkedInAt = $at;
        $this->checkedInByDevice = $deviceId;

        return TicketStatus::Valid;
    }
}
