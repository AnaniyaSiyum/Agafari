# Agafari (አጋፋሪ) — System Design & Architecture Specification

Stack: Next.js 14 (App Router) frontend · self-built PHP backend · SQL (MySQL/PostgreSQL) · Telegram Bot API · YouTube Live

---

## 1. Reconciling the role model

The product spec describes six functional roles (Lead Organizer, Gate Security, Bride & Groom, Quota Delegate, Media Moderator, Guest). The current build has a four-role table (System Admin, Main Admin, Live Recorder, Bride/Guest). These aren't in conflict — they're two different granularities. Fix: keep a **flat `roles` table** but drive actual screen/action access from a **`role_permissions`** join table (already partially in place), so you don't need a new enum every time a new function shows up.

| System role (DB enum) | Maps to product concept | Can do |
|---|---|---|
| `system_admin` | Platform owner (Hamelmal Creatives) | Manage tenants (event orgs), billing, global config |
| `main_admin` | Lead Event Organizer | Full control of one wedding: timeline, guests, quotas, analytics |
| `gate_staff` | Gate Security | QR scan screen only |
| `media_moderator` | Media Moderator | Approve/reject queue only |
| `quota_delegate` | Elders/Family | Manage their own slice of invite quota |
| `couple` | Bride & Groom | Read-only dashboard + media wall curation |
| `guest` | Guest | Public PWA link — no login, token-based |

This is an additive change to your current schema: add `media_moderator` and `quota_delegate` as new enum values / new rows in `roles`, keep `gate_staff` in place of `live_recorder` naming (or keep `live_recorder` as an alias if you don't want a migration — see §7).

---

## 2. High-level architecture

```
[Guest / Staff / Couple browser] --HTTPS--> [Next.js PWA] --REST/JSON--> [PHP API]
                                                                              |
                                          +-----------------------------------------------+
                                          | Presentation -> Application -> Domain -> Infra |
                                          +-----------------------------------------------+
                                                                              |
                                    +----------------+----------------+----------------+
                                    |  MySQL/Postgres |  Telegram Bot  |  YouTube Live  |
                                    +----------------+----------------+----------------+
```

- **Next.js PWA** is the only client. No native app. Guests hit a signed link (`/e/{event_slug}/{guest_token}`), staff/admin log in normally.
- **PHP API** is a single stateless service, horizontally scalable, fronted by nginx. All state lives in the DB.
- **Offline QR scanning** is a PWA feature (service worker + IndexedDB), not a backend concern — the backend just needs an idempotent `check-in` endpoint that can accept a *batch* of scans with client-generated timestamps for later reconciliation.

---

## 3. Clean Architecture — why and how it applies here

Clean Architecture's rule: **dependencies point inward**. Domain knows nothing about PHP, HTTP, or SQL. This matters concretely for Agafari because:

- The **QR validation rule** ("valid unless already checked in, unless headcount allows a +1") is pure business logic — it should be testable without a database or HTTP request.
- The **delay dispatcher** (recompute every guest's expected notification) is business logic, not a controller concern.
- **Media moderation** state transitions (`pending → approved/rejected → published`) are domain rules, independent of whether the moderator is on a tablet or phone.

If today's code has SQL queries inside route handlers, that's the primary "everything" to fix — it's why business rules and infrastructure details end up tangled and hard to test or reuse (e.g. the same check-in validation is needed for the live scanner AND for a manual override screen).

---

## 4. Backend folder structure (PHP, Clean Architecture)

```
backend/
├── public/
│   └── index.php                      # single entry point, bootstraps container + router
├── src/
│   ├── Domain/                        # zero framework/DB dependencies
│   │   ├── Event/
│   │   │   ├── Event.php              # entity
│   │   │   ├── Venue.php              # value object (multi-venue: home/church/hall/melse)
│   │   │   └── Timeline.php           # entity + delay-recompute logic
│   │   ├── Guest/
│   │   │   ├── Guest.php
│   │   │   ├── GuestStatus.php        # enum: invited|confirmed|checked_in|declined
│   │   │   └── Quota.php              # delegate quota value object
│   │   ├── Ticket/
│   │   │   ├── Ticket.php             # QR ticket entity
│   │   │   └── TicketValidator.php    # pure rule: valid / already-used / headcount
│   │   ├── Media/
│   │   │   ├── MediaItem.php
│   │   │   └── ModerationStatus.php   # enum: pending|approved|rejected
│   │   ├── Feedback/
│   │   │   └── EventRating.php
│   │   └── Shared/
│   │       ├── Money.php / Id.php     # shared value objects
│   │       └── Exceptions/
│   │           ├── DomainException.php
│   │           └── InvalidTicketException.php
│   │
│   ├── Application/                   # use cases — orchestrate domain, depend on interfaces only
│   │   ├── UseCases/
│   │   │   ├── Invitation/
│   │   │   │   ├── CreateQuotaLink.php
│   │   │   │   ├── DelegateAssignsGuest.php
│   │   │   │   └── GuestRsvp.php
│   │   │   ├── CheckIn/
│   │   │   │   ├── ScanTicket.php
│   │   │   │   └── ReconcileOfflineScans.php   # batch sync from scanner cache
│   │   │   ├── Timeline/
│   │   │   │   └── DispatchDelay.php           # recompute + fan-out notifications
│   │   │   ├── Media/
│   │   │   │   ├── SubmitMedia.php
│   │   │   │   ├── ModerateMedia.php
│   │   │   │   └── PublishToWall.php
│   │   │   └── Analytics/
│   │   │       └── SubmitEventRating.php
│   │   ├── Ports/                     # interfaces the domain/app layer needs — implemented in Infra
│   │   │   ├── GuestRepositoryInterface.php
│   │   │   ├── TicketRepositoryInterface.php
│   │   │   ├── NotificationGatewayInterface.php   # Telegram/SMS/push behind one interface
│   │   │   ├── LiveStreamGatewayInterface.php      # YouTube Live behind one interface
│   │   │   └── MediaStorageInterface.php
│   │   └── DTO/
│   │       ├── ScanResultDTO.php
│   │       └── EventDashboardDTO.php
│   │
│   ├── Infrastructure/                # everything that talks to the outside world
│   │   ├── Persistence/
│   │   │   ├── PdoGuestRepository.php
│   │   │   ├── PdoTicketRepository.php
│   │   │   ├── Migrations/
│   │   │   └── Schema.sql
│   │   ├── Security/
│   │   │   ├── HmacTicketSigner.php    # HMAC-SHA256 QR signing/verification
│   │   │   └── JwtService.php
│   │   ├── Notifications/
│   │   │   ├── TelegramGateway.php
│   │   │   └── SmsGateway.php
│   │   ├── LiveStream/
│   │   │   └── YoutubeLiveGateway.php
│   │   └── Storage/
│   │       └── S3MediaStorage.php      # or local disk adapter
│   │
│   └── Presentation/                  # HTTP-facing layer
│       ├── Http/
│       │   ├── Controllers/
│       │   │   ├── InvitationController.php
│       │   │   ├── ScannerController.php
│       │   │   ├── TimelineController.php
│       │   │   ├── MediaController.php
│       │   │   └── AnalyticsController.php
│       │   ├── Middleware/
│       │   │   ├── AuthMiddleware.php          # JWT verification
│       │   │   ├── RoleMiddleware.php          # role_permissions check
│       │   │   └── RateLimitMiddleware.php
│       │   └── Routes/
│       │       └── api.php
│       └── Console/                    # CLI jobs (delay dispatch retries, scan sync worker)
│
├── config/
│   ├── container.php                   # DI wiring: bind Ports -> Infrastructure impls
│   └── roles.php                       # role_permissions matrix
├── tests/
│   ├── Unit/Domain/                    # TicketValidator, Timeline delay math — no DB needed
│   └── Integration/Application/
└── composer.json
```

**Dependency rule enforcement**: `Domain/` has no `use` statements pointing at `Infrastructure` or any PHP extension (PDO, cURL). `Application/` only depends on `Domain` + its own `Ports` interfaces. `Infrastructure` implements those `Ports`. `Presentation` wires it together via `config/container.php` and never contains business logic — a controller method should be ~5 lines: decode request → call use case → return response.

---

## 5. Frontend folder structure (Next.js App Router)

```
frontend/
├── app/
│   ├── (staff)/                        # authenticated area
│   │   ├── admin/
│   │   │   ├── events/[eventId]/
│   │   │   │   ├── timeline/page.tsx
│   │   │   │   ├── guests/page.tsx
│   │   │   │   ├── quotas/page.tsx
│   │   │   │   └── analytics/page.tsx
│   │   ├── scanner/page.tsx            # gate_staff — offline-first
│   │   └── moderation/page.tsx         # media_moderator queue
│   ├── (couple)/
│   │   └── dashboard/[eventId]/page.tsx
│   ├── (delegate)/
│   │   └── quota/[quotaId]/page.tsx
│   ├── e/[eventSlug]/[guestToken]/     # public guest PWA — no auth
│   │   ├── page.tsx                    # ticket, map, schedule
│   │   ├── upload/page.tsx             # media wall submission
│   │   └── rate/page.tsx               # post-event feedback
│   ├── layout.tsx
│   └── manifest.ts                     # PWA manifest
├── components/
│   ├── scanner/                        # ScannerCamera, OfflineQueueBadge
│   ├── timeline/
│   ├── media-wall/
│   └── shared/
├── lib/
│   ├── api/                            # typed fetch clients per bounded context
│   │   ├── invitations.ts
│   │   ├── scanner.ts
│   │   └── media.ts
│   ├── offline/
│   │   ├── serviceWorker.ts
│   │   └── scanQueue.ts                # IndexedDB queue + sync-on-reconnect
│   └── auth/
├── public/
│   └── sw.js
└── next.config.js
```

---

## 6. Data flow per feature

**Invitation & RSVP (delegated quotas)**
1. `CreateQuotaLink` (main_admin) → creates `quota` row (N slots) → generates a signed delegate link.
2. Delegate opens link, calls `DelegateAssignsGuest` per phone number → creates `guest` rows tied to `quota_id`, decrements remaining slots (domain invariant: cannot exceed quota).
3. `NotificationGatewayInterface` (Telegram/SMS) sends the guest an RSVP link.
4. Guest hits `GuestRsvp` → status `invited → confirmed`/`declined`. On confirm, a `Ticket` is generated (HMAC-signed QR) via `TicketValidator`'s companion issuer.

**Gate check-in (offline-capable)**
1. Scanner PWA caches all confirmed tickets' hashes locally after a pre-event sync.
2. On scan: check IndexedDB first for instant "valid / already used" feedback; queue the scan event locally regardless of connectivity.
3. When online, `ReconcileOfflineScans` batch-posts queued scans with client timestamps → backend applies them in timestamp order, first valid scan wins, later duplicates return `already_checked_in` — this makes double-counting impossible even if two gates go offline simultaneously and scan the same guest.

**Live delay dispatcher**
1. `DispatchDelay(eventId, minutes)` → `Timeline` entity recomputes the hall-open time and any downstream milestones (photo → hall → dinner → melse) that shift together.
2. Fan-out to all `confirmed` guests via `NotificationGatewayInterface`; failed sends are retried by a queued console job, not inline in the request (keeps the admin's "delay" tap fast).

**Community media wall**
1. Guest uploads via `SubmitMedia` → stored via `MediaStorageInterface`, status `pending`.
2. `ModerateMedia` (media_moderator) → `approved`/`rejected`.
3. `PublishToWall` pushes approved items to the hall display feed (polling or websocket — pick one; polling every 5s is enough for a media wall and avoids running a socket server).

**Post-event analytics**
1. `SubmitEventRating` per guest → aggregated into `EventDashboardDTO` for the organizer's private dashboard (avg by category: food, ambiance, coordination).

---

## 7. Database schema (core tables)

```
erDiagram
  EVENTS ||--o{ VENUES : has
  EVENTS ||--o{ QUOTAS : has
  QUOTAS ||--o{ GUESTS : allocates
  GUESTS ||--o| TICKETS : issued
  EVENTS ||--o{ TIMELINE_MILESTONES : has
  EVENTS ||--o{ MEDIA_ITEMS : has
  GUESTS ||--o{ MEDIA_ITEMS : submits
  EVENTS ||--o{ EVENT_RATINGS : has
  USERS ||--o{ ROLE_PERMISSIONS : has

  EVENTS {
    uuid id PK
    string slug
    string couple_names
    timestamp wedding_date
  }
  VENUES {
    uuid id PK
    uuid event_id FK
    string type "home|church|hall|melse"
    string gps_coords
  }
  QUOTAS {
    uuid id PK
    uuid event_id FK
    uuid delegate_user_id FK
    int slots_total
    int slots_used
  }
  GUESTS {
    uuid id PK
    uuid quota_id FK
    string phone
    string status "invited|confirmed|declined|checked_in"
    int headcount_allowed
  }
  TICKETS {
    uuid id PK
    uuid guest_id FK
    string qr_signature
    timestamp checked_in_at
    string checked_in_by_device
  }
  TIMELINE_MILESTONES {
    uuid id PK
    uuid event_id FK
    string label
    timestamp planned_at
    timestamp current_at
  }
  MEDIA_ITEMS {
    uuid id PK
    uuid event_id FK
    uuid guest_id FK
    string status "pending|approved|rejected"
    string storage_url
  }
  EVENT_RATINGS {
    uuid id PK
    uuid event_id FK
    int food
    int ambiance
    int coordination
  }
  USERS { uuid id PK, string name, string role }
  ROLE_PERMISSIONS { uuid id PK, string role, string permission_key }
```

Note on the existing "four-role" migration: rather than renaming `live_recorder` in-place, add the new roles alongside it and let `role_permissions` do the fine-grained work — cheaper than a breaking rename across existing auth code.

---

## 8. Security notes
- **JWT** for staff/admin sessions; short-lived access token + refresh token, role claim checked by `RoleMiddleware` against `role_permissions`, not hardcoded per-route checks.
- **Guest links** are not JWTs — they're signed, single-purpose tokens (guest_id + event_id + expiry, HMAC-signed) so a guest never needs an account.
- **QR tickets**: `HmacTicketSigner` signs `guest_id|event_id|issued_at`; the scanner verifies the signature offline (it only needs the shared secret, not a DB round-trip) before falling back to the local cache lookup for check-in status.

---

## 9. Priority fix list
1. Extract any SQL currently sitting inside controllers into `Infrastructure/Persistence` repositories implementing the `Ports` interfaces.
2. Isolate `TicketValidator` as a pure, dependency-free class — this is the single most reused rule (scanner, manual override, reconciliation all call it).
3. Make the offline scan queue's reconciliation idempotent by timestamp, not by "last write wins."
4. Move notification fan-out (delay dispatcher, RSVP confirmations) off the request thread into a queued job runner.
5. Replace ad-hoc role checks with the `role_permissions` matrix everywhere, including the new `media_moderator` and `quota_delegate` roles.
