<?php
declare(strict_types=1);

namespace App\Application\UseCases\CheckIn;

/**
 * Accepts a batch of scans queued by an offline scanner and applies them
 * in client-timestamp order, so simultaneous offline gates never double-count
 * the same guest once they reconnect.
 */
final class ReconcileOfflineScans
{
    public function __construct(private readonly ScanTicket $scanTicket)
    {
    }

    /**
     * @param array<int, array{guestId:string, signature:string, deviceId:string, scannedAt:string}> $queuedScans
     * @return array<int, array>
     */
    public function handle(array $queuedScans): array
    {
        usort($queuedScans, fn($a, $b) => strcmp($a['scannedAt'], $b['scannedAt']));

        $results = [];
        foreach ($queuedScans as $scan) {
            $result = $this->scanTicket->handle(
                $scan['guestId'],
                $scan['signature'],
                $scan['deviceId'],
                new \DateTimeImmutable($scan['scannedAt']),
            );
            $results[] = $result->toArray();
        }

        return $results;
    }
}
