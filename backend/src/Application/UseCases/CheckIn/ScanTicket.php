<?php
declare(strict_types=1);

namespace App\Application\UseCases\CheckIn;

use App\Application\DTO\ScanResultDTO;
use App\Application\Ports\TicketRepositoryInterface;
use App\Application\Ports\TicketSignerInterface;
use App\Domain\Ticket\TicketStatus;

/**
 * The single, reused rule behind the "Agafari Scanner App".
 * Called by the live gate scanner AND by any manual-override screen,
 * so the business rule only lives here once.
 */
final class ScanTicket
{
    public function __construct(
        private readonly TicketRepositoryInterface $tickets,
        private readonly TicketSignerInterface $signer,
    ) {
    }

    public function handle(string $guestId, string $signature, string $deviceId, \DateTimeImmutable $scannedAt): ScanResultDTO
    {
        if (!$this->signer->verify($guestId, $signature)) {
            return new ScanResultDTO(TicketStatus::Invalid, 'Signature does not match — possible forged or screenshotted ticket.');
        }

        $ticket = $this->tickets->findByGuestId($guestId);

        if ($ticket === null) {
            return new ScanResultDTO(TicketStatus::Invalid, 'No ticket found for this guest.');
        }

        $status = $ticket->attemptCheckIn($deviceId, $scannedAt);

        if ($status === TicketStatus::Valid) {
            $this->tickets->save($ticket);
            return new ScanResultDTO($status, 'VALID', $ticket->headcountAllowed);
        }

        if ($status === TicketStatus::AlreadyCheckedIn) {
            return new ScanResultDTO($status, 'INVALID: Already checked in.');
        }

        return new ScanResultDTO($status, 'INVALID: Headcount exceeded.');
    }
}
