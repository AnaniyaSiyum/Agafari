# Agafari backend (PHP, clean architecture skeleton)

Zero-dependency skeleton — runs with just PHP 8.1+, no Composer install required
(a tiny built-in autoloader handles `App\...` classes). Composer is included
only for editors/IDEs that want proper autocomplete and PSR-4 resolution.

## Run it

```bash
cp .env.example .env
sqlite3 storage/database.sqlite < src/Infrastructure/Persistence/schema.sqlite.sql
php -S localhost:8000 -t public
```

Then:

```bash
curl http://localhost:8000/api/health
curl -X POST http://localhost:8000/api/guests/guest_demo/confirm
curl -X POST http://localhost:8000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"guestId":"guest_demo","signature":"<the qr_signature from confirm>","deviceId":"gate-1"}'
```

Scan the same guest again and you'll get `already_checked_in` — that's the
domain rule in `src/Domain/Ticket/Ticket.php` enforcing itself.

## Switch to MySQL

Set `DB_DRIVER=mysql` and the connection fields in `.env`, then:

```bash
mysql -u root -p -e "CREATE DATABASE agafari"
mysql -u root -p agafari < src/Infrastructure/Persistence/schema.mysql.sql
```

Nothing else changes — `PdoConnection` picks the driver from `.env`, and every
repository is written against the DB-agnostic `PDO` API.

## Where things live

See `/agafari-architecture.md` in the project root for the full rationale.
Short version: `Domain` = pure business rules (no framework code at all),
`Application` = use cases + the `Ports` interfaces they depend on, `Infrastructure`
= the implementations of those ports (PDO, HMAC, notification gateways),
`Presentation` = HTTP controllers + the router. Wiring between interface and
implementation happens in exactly one place: `config/container.php`.

## Extending this skeleton

- Add Telegram: implement `NotificationGatewayInterface` in
  `src/Infrastructure/Notifications/TelegramGateway.php`, bind it in
  `config/container.php` instead of `LogNotificationGateway`.
- Add the delay dispatcher, media moderation, and analytics use cases the
  same way `ScanTicket`/`GuestRsvp` are built — one class per use case in
  `src/Application/UseCases/...`, a matching repository interface in `Ports/`,
  a PDO implementation in `Infrastructure/Persistence/`.
