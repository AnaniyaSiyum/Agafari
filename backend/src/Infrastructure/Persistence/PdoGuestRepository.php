<?php
declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Application\Ports\GuestRepositoryInterface;
use App\Domain\Guest\Guest;
use App\Domain\Guest\GuestStatus;

final class PdoGuestRepository implements GuestRepositoryInterface
{
    public function __construct(private readonly \PDO $pdo)
    {
    }

    public function findById(string $guestId): ?Guest
    {
        $stmt = $this->pdo->prepare('SELECT * FROM guests WHERE id = :id');
        $stmt->execute(['id' => $guestId]);
        $row = $stmt->fetch();

        return $row ? $this->hydrate($row) : null;
    }

    public function findByToken(string $guestToken): ?Guest
    {
        // The token is the guest id in this minimal skeleton. In production,
        // resolve a signed link (guest_id + event_id + expiry) here instead.
        return $this->findById($guestToken);
    }

    public function save(Guest $guest): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE guests SET status = :status WHERE id = :id'
        );
        $stmt->execute(['status' => $guest->status->value, 'id' => $guest->id]);
    }

    private function hydrate(array $row): Guest
    {
        return new Guest(
            id: $row['id'],
            eventId: $row['event_id'],
            quotaId: $row['quota_id'],
            phone: $row['phone'],
            status: GuestStatus::from($row['status']),
            headcountAllowed: (int) $row['headcount_allowed'],
        );
    }
}
