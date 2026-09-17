<?php
declare(strict_types=1);

namespace App\Domain\Guest;

final class Guest
{
    public function __construct(
        public readonly string $id,
        public readonly string $eventId,
        public readonly ?string $quotaId,
        public readonly string $phone,
        public GuestStatus $status,
        public readonly int $headcountAllowed = 1,
    ) {
    }

    public function confirm(): void
    {
        if ($this->status === GuestStatus::Declined) {
            throw new \App\Domain\Shared\Exceptions\DomainException(
                'A declined guest cannot be re-confirmed automatically; ask them to RSVP again.'
            );
        }
        $this->status = GuestStatus::Confirmed;
    }

    public function decline(): void
    {
        $this->status = GuestStatus::Declined;
    }
}
