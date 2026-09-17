<?php
declare(strict_types=1);

namespace App\Application\UseCases\Invitation;

use App\Application\Ports\GuestRepositoryInterface;
use App\Application\Ports\TicketRepositoryInterface;
use App\Application\Ports\TicketSignerInterface;
use App\Domain\Guest\GuestStatus;

final class GuestRsvp
{
    public function __construct(
        private readonly GuestRepositoryInterface $guests,
        private readonly TicketRepositoryInterface $tickets,
        private readonly TicketSignerInterface $signer,
    ) {
    }

    public function confirm(string $guestToken): array
    {
        $guest = $this->guests->findByToken($guestToken);
        if ($guest === null) {
            throw new \App\Domain\Shared\Exceptions\DomainException('Guest not found for this link.');
        }

        $guest->confirm();
        $this->guests->save($guest);

        $signature = $this->signer->sign($guest->id);
        $ticket = $this->tickets->issueFor($guest->id, $signature, $guest->headcountAllowed);

        return [
            'guest_id' => $guest->id,
            'status' => $guest->status->value,
            'qr_signature' => $ticket->signature,
        ];
    }

    public function decline(string $guestToken): array
    {
        $guest = $this->guests->findByToken($guestToken);
        if ($guest === null) {
            throw new \App\Domain\Shared\Exceptions\DomainException('Guest not found for this link.');
        }

        $guest->decline();
        $this->guests->save($guest);

        return ['guest_id' => $guest->id, 'status' => $guest->status->value];
    }
}
