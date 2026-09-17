<?php
declare(strict_types=1);

namespace App\Presentation\Http\Controllers;

use App\Application\UseCases\CheckIn\ReconcileOfflineScans;
use App\Application\UseCases\CheckIn\ScanTicket;

final class ScannerController
{
    public function __construct(
        private readonly ScanTicket $scanTicket,
        private readonly ReconcileOfflineScans $reconcile,
    ) {
    }

    /** POST /api/scan  { guestId, signature, deviceId } */
    public function scan(): array
    {
        $body = $this->body();
        $result = $this->scanTicket->handle(
            $body['guestId'] ?? '',
            $body['signature'] ?? '',
            $body['deviceId'] ?? 'unknown-device',
            new \DateTimeImmutable(),
        );

        return $result->toArray();
    }

    /** POST /api/scan/batch  { scans: [{guestId, signature, deviceId, scannedAt}] } */
    public function batch(): array
    {
        $body = $this->body();
        $results = $this->reconcile->handle($body['scans'] ?? []);

        return ['results' => $results];
    }

    private function body(): array
    {
        $raw = file_get_contents('php://input') ?: '{}';
        return json_decode($raw, true) ?? [];
    }
}
