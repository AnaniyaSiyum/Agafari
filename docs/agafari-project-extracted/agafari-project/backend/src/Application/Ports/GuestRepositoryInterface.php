<?php
declare(strict_types=1);

namespace App\Application\Ports;

use App\Domain\Guest\Guest;

interface GuestRepositoryInterface
{
    public function findById(string $guestId): ?Guest;

    public function findByToken(string $guestToken): ?Guest;

    public function save(Guest $guest): void;
}
