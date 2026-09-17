<?php
declare(strict_types=1);

namespace App\Presentation\Http\Controllers;

use App\Application\UseCases\Invitation\GuestRsvp;

final class InvitationController
{
    public function __construct(private readonly GuestRsvp $rsvp)
    {
    }

    /** POST /api/guests/{token}/confirm */
    public function confirm(array $params): array
    {
        return $this->rsvp->confirm($params['token']);
    }

    /** POST /api/guests/{token}/decline */
    public function decline(array $params): array
    {
        return $this->rsvp->decline($params['token']);
    }
}
