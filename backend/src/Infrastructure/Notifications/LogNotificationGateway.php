<?php
declare(strict_types=1);

namespace App\Infrastructure\Notifications;

use App\Application\Ports\NotificationGatewayInterface;

/**
 * Skeleton stand-in for TelegramGateway / SmsGateway. Swap this binding in
 * config/container.php once you plug in the real Telegram Bot API client.
 */
final class LogNotificationGateway implements NotificationGatewayInterface
{
    public function send(string $phone, string $message): void
    {
        error_log("[notify] to={$phone} message={$message}");
    }
}
