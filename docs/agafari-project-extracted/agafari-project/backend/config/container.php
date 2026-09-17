<?php
declare(strict_types=1);

use App\Application\UseCases\CheckIn\ReconcileOfflineScans;
use App\Application\UseCases\CheckIn\ScanTicket;
use App\Application\UseCases\Invitation\GuestRsvp;
use App\Infrastructure\Persistence\PdoConnection;
use App\Infrastructure\Persistence\PdoGuestRepository;
use App\Infrastructure\Persistence\PdoTicketRepository;
use App\Infrastructure\Security\HmacTicketSigner;
use App\Presentation\Http\Controllers\HealthController;
use App\Presentation\Http\Controllers\InvitationController;
use App\Presentation\Http\Controllers\ScannerController;

/**
 * Manual DI wiring: Ports (interfaces) -> Infrastructure implementations.
 * This is the ONLY file that should know both an interface and its
 * concrete implementation at the same time.
 */
return (function (): array {
    $pdo = PdoConnection::get();

    $guestRepo = new PdoGuestRepository($pdo);
    $ticketRepo = new PdoTicketRepository($pdo);
    $signer = new HmacTicketSigner($_ENV['TICKET_SECRET'] ?? 'change-me-in-.env');

    $scanTicket = new ScanTicket($ticketRepo, $signer);
    $reconcile = new ReconcileOfflineScans($scanTicket);
    $rsvp = new GuestRsvp($guestRepo, $ticketRepo, $signer);

    return [
        'health' => new HealthController(),
        'scanner' => new ScannerController($scanTicket, $reconcile),
        'invitation' => new InvitationController($rsvp),
    ];
})();
