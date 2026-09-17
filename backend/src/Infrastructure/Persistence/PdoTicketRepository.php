<?php
declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Application\Ports\TicketRepositoryInterface;
use App\Domain\Ticket\Ticket;

final class PdoTicketRepository implements TicketRepositoryInterface
{
    public function __construct(private readonly \PDO $pdo)
    {
    }

    public function findByGuestId(string $guestId): ?Ticket
    {
        $stmt = $this->pdo->prepare('SELECT * FROM tickets WHERE guest_id = :guest_id');
        $stmt->execute(['guest_id' => $guestId]);
        $row = $stmt->fetch();

        return $row ? $this->hydrate($row) : null;
    }

    public function issueFor(string $guestId, string $signature, int $headcountAllowed): Ticket
    {
        $id = bin2hex(random_bytes(16));
        $stmt = $this->pdo->prepare(
            'INSERT INTO tickets (id, guest_id, qr_signature, headcount_allowed) VALUES (:id, :guest_id, :sig, :headcount)'
        );
        $stmt->execute([
            'id' => $id,
            'guest_id' => $guestId,
            'sig' => $signature,
            'headcount' => $headcountAllowed,
        ]);

        return new Ticket($guestId, $signature, $headcountAllowed);
    }

    public function save(Ticket $ticket): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE tickets SET checked_in_at = :checked_in_at, checked_in_by_device = :device WHERE guest_id = :guest_id'
        );
        $stmt->execute([
            'checked_in_at' => $ticket->checkedInAt?->format('Y-m-d H:i:s'),
            'device' => $ticket->checkedInByDevice,
            'guest_id' => $ticket->guestId,
        ]);
    }

    private function hydrate(array $row): Ticket
    {
        return new Ticket(
            guestId: $row['guest_id'],
            signature: $row['qr_signature'],
            headcountAllowed: (int) $row['headcount_allowed'],
            checkedInAt: $row['checked_in_at'] ? new \DateTimeImmutable($row['checked_in_at']) : null,
            checkedInByDevice: $row['checked_in_by_device'],
        );
    }
}
