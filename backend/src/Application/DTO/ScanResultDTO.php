<?php
declare(strict_types=1);

namespace App\Application\DTO;

use App\Domain\Ticket\TicketStatus;

final class ScanResultDTO
{
    public function __construct(
        public readonly TicketStatus $status,
        public readonly string $message,
        public readonly ?int $headcount = null,
    ) {
    }

    public function toArray(): array
    {
        return [
            'status' => $this->status->value,
            'message' => $this->message,
            'headcount' => $this->headcount,
        ];
    }
}
