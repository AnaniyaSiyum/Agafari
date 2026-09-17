<?php
declare(strict_types=1);

namespace App\Domain\Ticket;

enum TicketStatus: string
{
    case Valid = 'valid';
    case AlreadyCheckedIn = 'already_checked_in';
    case HeadcountExceeded = 'headcount_exceeded';
    case Invalid = 'invalid';
}
