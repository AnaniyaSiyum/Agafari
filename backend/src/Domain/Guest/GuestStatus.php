<?php
declare(strict_types=1);

namespace App\Domain\Guest;

enum GuestStatus: string
{
    case Invited = 'invited';
    case Confirmed = 'confirmed';
    case Declined = 'declined';
    case CheckedIn = 'checked_in';
}
