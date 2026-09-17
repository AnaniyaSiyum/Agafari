# AGAFARI PLATFORM - COMPLETE PROJECT SPECIFICATION & SOURCE CODE EXPORT
> **Note for AI Assistant / Platform**: This document contains the full product specification, system architecture, data models, domain logic, and entire codebase (Frontend Next.js & Backend PHP Clean Architecture) for the Agafari Ethiopian Cultural Event & Master of Ceremonies (Mebqa) Platform.

---

## PART 1: PRODUCT SPECIFICATION & CULTURAL DOMAIN MODEL

# AGAFARI (አጋፋሪ) - ETHIOPIAN WEDDING PLATFORM
## Enterprise Systems Architecture & Product Specification Manual
**Document Version**: 2.0.0  
**Domain Scope**: Ethiopian Wedding Operations, Digital Gatekeeping, Real-Time Logistics & Community Engagement  
**Architectural Standard**: ISO/IEC/IEEE 42010 Enterprise Blueprint  

---

## 1. Document Control & Architectural Governance

| Attribute | Specification Detail |
|---|---|
| **Platform Identifier** | Agafari (አጋፋሪ) Event Intelligence System |
| **Document Purpose** | Definitive Functional & Architectural Master Blueprint |
| **Target Audience** | Enterprise Planners, Lead Systems Engineers, Event Directors, Product Managers |
| **Core Philosophy** | Cultural Enhancement & Logistical Friction Elimination |
| **Deployment Model** | Mobile-First Progressive Web App (PWA) + Distributed Cloud Engine |

---

## 2. Executive Vision & Cultural Philosophy

### 2.1 The Cultural Preservation Imperative
Ethiopian weddings (*ሰርግ*) are among the most culturally rich, sacred, and communal celebrations in the world. They represent the union not merely of two individuals, but of extended families, communities, and traditions spanning generations. From the morning Kebele/Home preparations and groom's procession (*ሚዜ እና መራሽ*), to church ceremonies, traditional blessings, hall receptions, and the *Melse* (*መልስ*), Ethiopian wedding customs embody unmatched warmth and hospitality (*እንግዳ ተቀባይነት*).

**Agafari (አጋፋሪ)** is explicitly built on the foundational principle of **enhancing traditional Ethiopian weddings without altering or eliminating their cultural essence**. Technology must never sanitize or mechanize the warmth of Ethiopian hospitality; rather, it must eliminate the chaotic operational bottlenecks, administrative confusion, and logistical friction that cause severe stress for the bride, groom, and organizers.

### 2.2 Strategic Objectives
1. **Frictionless Hospitality**: Elevate guest reception by replacing lost paper cards and door confusion with dignified, instant digital entry.
2. **Quota & Delegation Clarity**: Empower families to delegate invitations to relatives (*"አንቺ/አንተ 10 ካርድ ይሰጣቹሃል"*) with total visibility into RSVPs and door turnout.
3. **Timeline Transparency**: Keep guests informed of real-time program shifts (e.g. photo session extensions) to eliminate blind waiting outside venues.
4. **Community Memory Capture**: Collect candid, authentic moments from guests' perspectives alongside the official photographer's staged shots.
5. **Event Planner Professionalization**: Provide wedding coordinators with actionable guest feedback and quantitative metrics to continuously refine service quality.

---

## 3. Ethiopian Wedding Friction Spectrum (Domain Analysis)

| Friction Domain | Traditional Cause | Real-World Operational Failure | Agafari Architectural Solution |
|---|---|---|---|
| **Invitation & Delegation Blackholes** | Physical cards distributed via family members without central tracking. | Host families give 10 physical cards to an elder with zero visibility into who is invited or attending. Gate overcrowding or empty tables occur. | **Delegated Quota Engine**: Tracks family allocations, guest names, RSVPs, and dynamic QR passes in real time. |
| **Gate Confusion & Over-Capacity** | Manual paper list checking or unmanaged door entry. | Gate crashes, lost paper cards, argument at the hall entrance, and capacity safety risks. | **Instant Gate Scanner App**: <1 second encrypted QR scanning with live headcount tally and security authorization. |
| **Photo Delays & Timeline Dissolution** | Photography sessions extending past scheduled times without guest communication. | Guests arrive at the hall on schedule but sit blindly for hours waiting for the couple to arrive. Frustration degrades event mood. | **Dynamic Timeline & Delay Dispatcher**: Live schedule feed with push notifications informing guests of actual hall opening times. |
| **Single-Perspective Memory Loss** | Exclusive reliance on official videographers/photographers for event capture. | Formal shots miss intimate, joyful, and hilarious moments captured on guests' personal mobile phones. | **TikTok-Style "Loved Ones' Perspective" Wall**: Community media feed for short candid clips, photos, and video wishes. |
| **Organizer Quality Evaluation Void** | Lack of structured post-event guest feedback channels. | Organizers cannot systematically measure guest satisfaction regarding food, ambiance, music, or coordination. | **Organizers Feedback & Performance Suite**: Post-event guest rating loop generating actionable performance analytics. |

---

## 4. Professional Staff Roles & Stakeholder Taxonomies

Agafari defines strict Role-Based Access Control (RBAC) across seven distinct stakeholder profiles to ensure seamless coordination:

```
                               ┌──────────────────────────────────┐
                               │     SYSTEM SUPERADMINISTRATION   │
                               └────────────────┬─────────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 │                                                             │
    ┌────────────┴────────────┐                                   ┌────────────┴────────────┐
    │ EVENT ORGANIZER / LEAD  │                                   │   BRIDE & GROOM HOSTS   │
    │   WEDDING PLANNER       │                                   │                         │
    └────────────┬────────────┘                                   └────────────┬────────────┘
                 │                                                             │
   ┌─────────────┼─────────────┐                                 ┌─────────────┼─────────────┐
   │             │             │                                 │             │             │
┌──┴──────┐ ┌────┴─────┐ ┌─────┴────┐                         ┌──┴──────┐ ┌────┴─────┐ ┌─────┴────┐
│ GATE    │ │ DOOR     │ │ MEDIA    │                         │ FAMILY  │ │ VIP     │ │ GENERAL  │
│ SCANNER │ │ SECURITY │ │ MODERATOR│                         │ QUOTA   │ │ GUESTS  │ │ GUESTS   │
│ STAFF   │ │ HEAD     │ │          │                         │ DELEGATES│ │         │ │          │
└─────────┘ └──────────┘ └──────────┘                         └─────────┘ └─────────┘ └──────────┘
```

### 4.1 Professional Role Definitions

1. **Lead Event Planner / Organizer (`EVENT_ORGANIZER`)**:
   * Responsible for overall event configuration, venue details, master timeline publishing, vendor management, and post-event analytics inspection.
2. **Gate Security Head & Scanner Staff (`GATE_SCANNER`)**:
   * Stationed at venue entrances equipped with the Agafari Scanner App. Scans guest QR passes, verifies allowed headcounts, and manages door flow.
3. **Bride & Groom Host Admins (`BRIDE_GROOM`)**:
   * Full access to invitation lists, family quota allocations, RSVP dashboards, and moderation of guest media uploads.
4. **Family Quota Delegates (`QUOTA_DELEGATE`)**:
   * Designated family elders or representatives who receive a bulk quota of invitations (e.g. 10 or 20 passes) to assign directly to their invited branch of relatives.
5. **Media Curator & Content Moderator (`MEDIA_MODERATOR`)**:
   * Reviews guest-uploaded videos, photos, and wishes on the Community Media Wall before public display.
6. **Invited Guests (`GUEST`)**:
   * Accesses digital invitation, venue GPS directions, dynamic schedule timeline, mobile check-in pass, and community media upload portal.
7. **System Administrator (`SYSTEM_ADMIN`)**:
   * Oversees platform infrastructure, tenant isolation, security audit logging, and global system health.

---

## 5. System Architecture & Technical Foundations

### 5.1 Technology Stack Standards
* **Frontend Framework**: Next.js 14 (App Router) with TypeScript & Vanilla CSS for high-performance mobile UI.
* **Database Layer**: SQLite / PostgreSQL with Pragmatic Schema Isolation & Distributed Caching.
* **Authentication Engine**: JWT-based session security with Role-Based Route Guards.
* **QR Engine**: AES-256 HMAC Encrypted Payload Generation & Instant Camera Decoding.
* **Offline Synchronization Engine**: LocalStorage + Service Worker Queue for uninterrupted gate scanning during network drops.

### 5.2 System Data Flow Architecture

```
[GUEST PHONE / LINK] ────> [DELEGATED QUOTA ENGINE] ────> [DYNAMIC QR GENERATOR]
                                                                  │
                                                                  ▼
[GATE SCANNER APP]  <─── [OFFLINE SYNC CACHE] <──── [ENCRYPTED QR PASS]
        │
        ▼
[REAL-TIME HEADCOUNT COUNTER] ───> [ORGANIZER & COUPLE DASHBOARD]
```

---

## 6. Detailed Modular Functional Specifications

### Module 1: Digital Gatekeeping & Quota Management Engine

#### 6.1 Quota-Based Family Delegation
To honor the traditional practice where parents and elders are allocated blocks of invitation cards (*"አንቺ/አንተ 10 ካርድ ይሰጣቹሃል 10 ሰው ጥሩ"*), Agafari introduces **Delegated Quota Allocation**:
* Organizers/Couples create a **Quota Group** assigned to a specific representative (e.g., *Aunt Almaz - 15 Guests*).
* The representative receives a unique management link allowing them to input the names and phone numbers of their 15 invited guests, or forward individual invitation passes directly to them.
* Real-time RSVP statuses (*ATTENDING*, *DECLINED*, *PENDING*) aggregate back to the main host dashboard automatically.

#### 6.2 Dynamic QR Pass Generation
* Each confirmed guest or family unit receives a dynamic mobile pass containing:
  * Guest / Family Name
  * Invitation Code & Encrypted Security Hash
  * Permitted Headcount (e.g., *Max 2 Persons*)
  * Venue Name & Date
* **Note on Seating Policy**: The Agafari platform intentionally **omits specific seat/chair assignments**. Guests are welcomed into the venue according to traditional Ethiopian open-hospitality seating customs, while the system strictly controls total door headcount capacity.

#### 6.3 Offline-Resilient Gate Scanner App
* Staff at the entrance open the Agafari Gate Scanner PWA.
* Scanning takes **<800ms** per pass.
* Upon scan, the app displays:
  * `[VALID]` - Guest Name, Allowed Headcount, Check-in Button.
  * `[ALREADY SCANNED]` - Warning timestamp showing when the pass was previously checked in.
  * `[INVALID]` - Unrecognized or unapproved pass.
* Scanner app operates seamlessly offline, caching scan records locally and auto-syncing with the server when connectivity resumes.

---

### Module 2: Real-Time Program Timeline & Delay Dispatcher

#### 6.4 Dynamic Program Schedule
The event schedule is maintained live by the lead organizer:
1. *Kebele / Home Preparation & Blessings* (Morning)
2. *Groom Procession & Arrival* (Midday)
3. *Church / Ceremony Service* (Afternoon)
4. *Hall Entry & Reception Opening* (Late Afternoon)
5. *Dinner Service & Toasts* (Evening)
6. *Cutting of Cake & First Dance* (Night)
7. *Melse Preparation & Program* (Following Day)

#### 6.5 Live Delay Alert System
* During Ethiopian weddings, photo sessions frequently extend beyond allocated time slots. 
* Rather than leaving guests to wait outside the hall in confusion, the Lead Organizer triggers a **Timeline Adjustment**:
  * E.g., *"Photo session extended by 45 mins. Hall doors will open at 4:30 PM."*
* Instantly updates the guest-facing Live Schedule and dispatches push notifications / SMS alerts to keep guests informed.

#### 6.6 GPS Navigation & Organizer Directory
* One-tap interactive mapping links for venue locations (Church, Hall, Melse venue).
* Emergency contact directory listing assigned wedding coordinators, gate security leads, and transport managers.

---

### Module 3: "Loved Ones' Perspective" Community Media Wall

#### 6.7 TikTok-Style Vertical Media Feed
* A dedicated mobile media portal where guests upload candid moments captured on their smartphones during the wedding.
* Supports short video clips (up to 60 seconds), high-resolution photos, and written video wishes.
* Displays in a modern, vertical full-screen swipeable feed customized with the couple's wedding branding.

#### 6.8 Memory Curation & Moderation Suite
* Content uploaded by guests passes through a **Moderation Queue**:
  * Organizers or designated Media Moderators approve posts before they appear on the public wall.
* Ensures the couple receives a rich, authentic collection of personal moments from loved ones across every table without inappropriate content.
* Ability to download the complete raw media repository post-wedding in high resolution.

---

### Module 4: Event Organizer Evaluation & Quality Analytics

#### 6.9 Post-Event Guest Feedback Loop
* At the conclusion of the event, guests receive a prompt or scan a feedback QR to rate their experience across key service dimensions:
  * Venue Ambiance & Cleanliness
  * Food & Beverage Quality
  * Music & Entertainment
  * Entry & Door Coordination
  * Overall Event Satisfaction
* Ratings are submitted anonymously with optional guest comments.

#### 6.10 Vendor Performance & Portfolio Dashboard
* Organizers access a private analytics dashboard summarizing performance scores.
* Enables planners to evaluate third-party vendors (caterers, sound engineers, decorators) based on quantitative guest feedback.
* High-performing organizers build verified performance credentials to present to future prospective clients.

---

## 7. End-to-End Operational Lifecycle Playbook

```
PHASE 1: PRE-WEDDING (WEEKS 1 - 4)
├─ 1. Create Event & Configure Master Timeline
├─ 2. Define Family Quota Groups & Delegate Links
└─ 3. Collect RSVPs & Issue Dynamic QR Passes

PHASE 2: WEDDING DAY (MORNING - DOOR ENTRY)
├─ 1. Deploy Gate Scanner Staff with Offline PWA
├─ 2. Track Live Gate Check-ins & Headcount Tally
└─ 3. Dispatch Timeline Delay Alerts if Photos Run Late

PHASE 3: HALL RECEPTION & EVENING
├─ 1. Guests Upload Candid Videos/Photos to Community Wall
├─ 2. Media Moderator Approves Uploads for Live Feed
└─ 3. Guests Access Program Timeline & Emergency Contacts

PHASE 4: POST-WEDDING & ANALYTICS
├─ 1. Collect Anonymous Guest Feedback & Service Ratings
├─ 2. Generate Vendor Performance Analytics Report
└─ 3. Export High-Res "Loved Ones' Perspective" Media Archive
```

---

## 8. Master Entity Relationship & Data Schemas

```sql
-- Core Events Table
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    bride_name TEXT NOT NULL,
    groom_name TEXT NOT NULL,
    event_date DATETIME NOT NULL,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    status TEXT CHECK(status IN ('DRAFT', 'LIVE', 'COMPLETED', 'ARCHIVED')) DEFAULT 'DRAFT',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Family Quota Allocation Table
CREATE TABLE quota_groups (
    id TEXT PRIMARY KEY,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    delegate_name TEXT NOT NULL,
    delegate_phone TEXT NOT NULL,
    allocated_quota INTEGER NOT NULL,
    used_quota INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Guest Invitations Table (No Chair Assignment)
CREATE TABLE invitations (
    id TEXT PRIMARY KEY,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    quota_group_id TEXT REFERENCES quota_groups(id),
    guest_name TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    max_guests INTEGER DEFAULT 1,
    rsvp_status TEXT CHECK(rsvp_status IN ('PENDING', 'ATTENDING', 'DECLINED')) DEFAULT 'PENDING',
    qr_code_hash TEXT UNIQUE NOT NULL,
    is_scanned BOOLEAN DEFAULT FALSE,
    scanned_count INTEGER DEFAULT 0,
    scanned_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Program Timeline & Delay Tracking Table
CREATE TABLE timeline_events (
    id TEXT PRIMARY KEY,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    scheduled_time DATETIME NOT NULL,
    estimated_time DATETIME NOT NULL,
    status TEXT CHECK(status IN ('UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED')) DEFAULT 'UPCOMING',
    delay_reason TEXT,
    order_index INTEGER NOT NULL
);

-- Community Media Feed ("Loved Ones' Perspective")
CREATE TABLE community_posts (
    id TEXT PRIMARY KEY,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    uploader_name TEXT NOT NULL,
    media_type TEXT CHECK(media_type IN ('IMAGE', 'VIDEO')) NOT NULL,
    media_url TEXT NOT NULL,
    caption TEXT,
    status TEXT CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED')) DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Post-Event Guest Feedback Table
CREATE TABLE organizer_feedback (
    id TEXT PRIMARY KEY,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    rating_ambiance INTEGER CHECK(rating_ambiance BETWEEN 1 AND 5),
    rating_catering INTEGER CHECK(rating_catering BETWEEN 1 AND 5),
    rating_coordination INTEGER CHECK(rating_coordination BETWEEN 1 AND 5),
    rating_overall INTEGER CHECK(rating_overall BETWEEN 1 AND 5),
    comments TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 9. Security, Privacy & Reliability Blueprint

1. **Pass Tamper Proofing**: QR code hashes are signed using HMAC-SHA256 with an event-specific secret key, preventing pass forgery or unauthorized headcount inflation.
2. **Privacy Protection**: Guest phone numbers and personal invitation data are encrypted at rest and never shared with third-party advertisers.
3. **High Door Throughput**: Gate scanner software is optimized for processing **>45 scans per minute per scanner device**, preventing queues at venue entrances.
4. **Resilient Data Persistence**: Gate check-in logs write synchronously to SQLite WAL / PostgreSQL logs with local PWA redundancy.

---

## 10. Summary Matrix: Traditional vs. Agafari Architecture

```
TRADITIONAL ETHIOPIAN WEDDING           AGAFARI ENTERPRISE SOLUTION
──────────────────────────────────────────────────────────────────────────────────
Lost paper invitation cards        ──>  Dynamic HMAC-Signed QR Mobile Passes
Unmonitored family card handouts   ──>  Quota-Managed Delegation Engine ("10-Card Quota")
Gate crashes & door confusion      ──>  <1s Scanner Verification & Real-Time Headcount Counter
Blind waiting due to photo delays  ──>  Live Dynamic Timeline & Delay Alert Push System
Photos trapped on personal phones  ──>  TikTok-Style "Loved Ones' Perspective" Community Feed
Unrated organizer service quality  ──>  Structured Post-Event Guest Feedback & Vendor Analytics
```


---

## PART 2: TECHNICAL ARCHITECTURE & CLEAN ARCHITECTURE SPECIFICATION

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


---

## PART 3: REPOSITORY DIRECTORY STRUCTURE

```text
Agafari/
├── docs/
│   ├── Agafari_Platform_Product_Specification.md
│   └── agafari-architecture.md
├── frontend/                 # Next.js 14 App Router Frontend
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/
│   │   │   ├── booking/
│   │   │   ├── client/
│   │   │   ├── marketplace/
│   │   │   ├── mebqa-hub/
│   │   │   ├── mebqa/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   └── lib/
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.ts
└── backend/                  # PHP 8.2+ Clean Architecture Backend API
    ├── config/
    ├── public/
    │   └── index.php
    ├── src/
    │   ├── Domain/
    │   ├── Application/
    │   ├── Infrastructure/
    │   └── Presentation/
    ├── composer.json
    └── phpunit.xml
```

---

## PART 4: COMPLETE SOURCE CODE FILES

### File: `backend/.env`

```
# Copy to .env and adjust. Defaults to SQLite so the API runs with zero setup.
DB_DRIVER=sqlite
DB_PATH=./storage/database.sqlite

# To use MySQL instead, set DB_DRIVER=mysql and fill these in:
# DB_DRIVER=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_NAME=agafari
# DB_USER=root
# DB_PASS=

TICKET_SECRET=replace-with-a-long-random-string

```

### File: `backend/.env.example`

```
# Copy to .env and adjust. Defaults to SQLite so the API runs with zero setup.
DB_DRIVER=sqlite
DB_PATH=./storage/database.sqlite

# To use MySQL instead, set DB_DRIVER=mysql and fill these in:
# DB_DRIVER=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_NAME=agafari
# DB_USER=root
# DB_PASS=

TICKET_SECRET=replace-with-a-long-random-string

```

### File: `backend/README.md`

```markdown
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

```

### File: `backend/composer.json`

```json
{
    "name": "hamelmal-creatives/agafari-backend",
    "description": "Agafari wedding platform API — PHP, clean architecture",
    "type": "project",
    "require": {
        "php": ">=8.1"
    },
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}

```

### File: `backend/config/container.php`

```php
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

```

### File: `backend/public/index.php`

```php
<?php
declare(strict_types=1);

// --- tiny PSR-4-ish autoloader: App\Foo\Bar -> src/Foo/Bar.php ---
// (Skeleton runs with zero Composer install. Swap for the composer
// autoloader once you add real dependencies via `composer install`.)
spl_autoload_register(function (string $class): void {
    if (!str_starts_with($class, 'App\\')) {
        return;
    }
    $relative = substr($class, strlen('App\\'));
    $path = __DIR__ . '/../src/' . str_replace('\\', '/', $relative) . '.php';
    if (is_file($path)) {
        require $path;
    }
});

// --- minimal .env loader (no external dependency) ---
$envPath = __DIR__ . '/../.env';
if (is_file($envPath)) {
    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}

use App\Presentation\Http\Router;

$controllers = require __DIR__ . '/../config/container.php';

$router = new Router();
$router->add('GET', '/api/health', fn () => $controllers['health']->check());
$router->add('POST', '/api/scan', fn () => $controllers['scanner']->scan());
$router->add('POST', '/api/scan/batch', fn () => $controllers['scanner']->batch());
$router->add('POST', '/api/guests/{token}/confirm', fn ($p) => $controllers['invitation']->confirm($p));
$router->add('POST', '/api/guests/{token}/decline', fn ($p) => $controllers['invitation']->decline($p));

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$router->dispatch($_SERVER['REQUEST_METHOD'], $path);

```

### File: `backend/src/Application/DTO/ScanResultDTO.php`

```php
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

```

### File: `backend/src/Application/Ports/GuestRepositoryInterface.php`

```php
<?php
declare(strict_types=1);

namespace App\Application\Ports;

use App\Domain\Guest\Guest;

interface GuestRepositoryInterface
{
    public function findById(string $guestId): ?Guest;

    public function findByToken(string $guestToken): ?Guest;

    public function save(Guest $guest): void;
}

```

### File: `backend/src/Application/Ports/NotificationGatewayInterface.php`

```php
<?php
declare(strict_types=1);

namespace App\Application\Ports;

interface NotificationGatewayInterface
{
    public function send(string $phone, string $message): void;
}

```

### File: `backend/src/Application/Ports/TicketRepositoryInterface.php`

```php
<?php
declare(strict_types=1);

namespace App\Application\Ports;

use App\Domain\Ticket\Ticket;

interface TicketRepositoryInterface
{
    public function findByGuestId(string $guestId): ?Ticket;

    public function issueFor(string $guestId, string $signature, int $headcountAllowed): Ticket;

    public function save(Ticket $ticket): void;
}

```

### File: `backend/src/Application/Ports/TicketSignerInterface.php`

```php
<?php
declare(strict_types=1);

namespace App\Application\Ports;

interface TicketSignerInterface
{
    public function sign(string $guestId): string;

    public function verify(string $guestId, string $signature): bool;
}

```

### File: `backend/src/Application/UseCases/CheckIn/ReconcileOfflineScans.php`

```php
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

```

### File: `backend/src/Application/UseCases/CheckIn/ScanTicket.php`

```php
<?php
declare(strict_types=1);

namespace App\Application\UseCases\CheckIn;

use App\Application\DTO\ScanResultDTO;
use App\Application\Ports\TicketRepositoryInterface;
use App\Application\Ports\TicketSignerInterface;
use App\Domain\Ticket\TicketStatus;

/**
 * The single, reused rule behind the "Agafari Scanner App".
 * Called by the live gate scanner AND by any manual-override screen,
 * so the business rule only lives here once.
 */
final class ScanTicket
{
    public function __construct(
        private readonly TicketRepositoryInterface $tickets,
        private readonly TicketSignerInterface $signer,
    ) {
    }

    public function handle(string $guestId, string $signature, string $deviceId, \DateTimeImmutable $scannedAt): ScanResultDTO
    {
        if (!$this->signer->verify($guestId, $signature)) {
            return new ScanResultDTO(TicketStatus::Invalid, 'Signature does not match — possible forged or screenshotted ticket.');
        }

        $ticket = $this->tickets->findByGuestId($guestId);

        if ($ticket === null) {
            return new ScanResultDTO(TicketStatus::Invalid, 'No ticket found for this guest.');
        }

        $status = $ticket->attemptCheckIn($deviceId, $scannedAt);

        if ($status === TicketStatus::Valid) {
            $this->tickets->save($ticket);
            return new ScanResultDTO($status, 'VALID', $ticket->headcountAllowed);
        }

        if ($status === TicketStatus::AlreadyCheckedIn) {
            return new ScanResultDTO($status, 'INVALID: Already checked in.');
        }

        return new ScanResultDTO($status, 'INVALID: Headcount exceeded.');
    }
}

```

### File: `backend/src/Application/UseCases/Invitation/GuestRsvp.php`

```php
<?php
declare(strict_types=1);

namespace App\Application\UseCases\Invitation;

use App\Application\Ports\GuestRepositoryInterface;
use App\Application\Ports\TicketRepositoryInterface;
use App\Application\Ports\TicketSignerInterface;
use App\Domain\Guest\GuestStatus;

final class GuestRsvp
{
    public function __construct(
        private readonly GuestRepositoryInterface $guests,
        private readonly TicketRepositoryInterface $tickets,
        private readonly TicketSignerInterface $signer,
    ) {
    }

    public function confirm(string $guestToken): array
    {
        $guest = $this->guests->findByToken($guestToken);
        if ($guest === null) {
            throw new \App\Domain\Shared\Exceptions\DomainException('Guest not found for this link.');
        }

        $guest->confirm();
        $this->guests->save($guest);

        $signature = $this->signer->sign($guest->id);
        $ticket = $this->tickets->issueFor($guest->id, $signature, $guest->headcountAllowed);

        return [
            'guest_id' => $guest->id,
            'status' => $guest->status->value,
            'qr_signature' => $ticket->signature,
        ];
    }

    public function decline(string $guestToken): array
    {
        $guest = $this->guests->findByToken($guestToken);
        if ($guest === null) {
            throw new \App\Domain\Shared\Exceptions\DomainException('Guest not found for this link.');
        }

        $guest->decline();
        $this->guests->save($guest);

        return ['guest_id' => $guest->id, 'status' => $guest->status->value];
    }
}

```

### File: `backend/src/Domain/Guest/Guest.php`

```php
<?php
declare(strict_types=1);

namespace App\Domain\Guest;

final class Guest
{
    public function __construct(
        public readonly string $id,
        public readonly string $eventId,
        public readonly ?string $quotaId,
        public readonly string $phone,
        public GuestStatus $status,
        public readonly int $headcountAllowed = 1,
    ) {
    }

    public function confirm(): void
    {
        if ($this->status === GuestStatus::Declined) {
            throw new \App\Domain\Shared\Exceptions\DomainException(
                'A declined guest cannot be re-confirmed automatically; ask them to RSVP again.'
            );
        }
        $this->status = GuestStatus::Confirmed;
    }

    public function decline(): void
    {
        $this->status = GuestStatus::Declined;
    }
}

```

### File: `backend/src/Domain/Guest/GuestStatus.php`

```php
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

```

### File: `backend/src/Domain/Shared/Exceptions/DomainException.php`

```php
<?php
declare(strict_types=1);

namespace App\Domain\Shared\Exceptions;

class DomainException extends \RuntimeException
{
}

```

### File: `backend/src/Domain/Shared/Exceptions/InvalidTicketException.php`

```php
<?php
declare(strict_types=1);

namespace App\Domain\Shared\Exceptions;

final class InvalidTicketException extends DomainException
{
}

```

### File: `backend/src/Domain/Ticket/Ticket.php`

```php
<?php
declare(strict_types=1);

namespace App\Domain\Ticket;

/**
 * A signed entry ticket tied to one guest. Pure domain entity:
 * no PDO, no HTTP, no framework. It only knows the rules of a ticket.
 */
final class Ticket
{
    public function __construct(
        public readonly string $guestId,
        public readonly string $signature,
        public readonly int $headcountAllowed,
        public ?\DateTimeImmutable $checkedInAt = null,
        public ?string $checkedInByDevice = null,
    ) {
    }

    public function isCheckedIn(): bool
    {
        return $this->checkedInAt !== null;
    }

    /**
     * Core rule from the product spec:
     * "VALID: Headcount N" unless already checked in.
     */
    public function attemptCheckIn(string $deviceId, \DateTimeImmutable $at): TicketStatus
    {
        if ($this->isCheckedIn()) {
            return TicketStatus::AlreadyCheckedIn;
        }

        if ($this->headcountAllowed < 1) {
            return TicketStatus::HeadcountExceeded;
        }

        $this->checkedInAt = $at;
        $this->checkedInByDevice = $deviceId;

        return TicketStatus::Valid;
    }
}

```

### File: `backend/src/Domain/Ticket/TicketStatus.php`

```php
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

```

### File: `backend/src/Infrastructure/Notifications/LogNotificationGateway.php`

```php
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

```

### File: `backend/src/Infrastructure/Persistence/PdoConnection.php`

```php
<?php
declare(strict_types=1);

namespace App\Infrastructure\Persistence;

final class PdoConnection
{
    private static ?\PDO $instance = null;

    public static function get(): \PDO
    {
        if (self::$instance !== null) {
            return self::$instance;
        }

        $driver = $_ENV['DB_DRIVER'] ?? 'sqlite';

        if ($driver === 'sqlite') {
            $configured = $_ENV['DB_PATH'] ?? 'storage/database.sqlite';
            // Relative paths are resolved against the backend project root
            // (not getcwd()) so it works the same whether you start the
            // server from backend/ or anywhere else.
            $projectRoot = __DIR__ . '/../../../';
            $path = str_starts_with($configured, '/') ? $configured : $projectRoot . ltrim($configured, './');
            $pdo = new \PDO('sqlite:' . $path);
        } else {
            $host = $_ENV['DB_HOST'] ?? '127.0.0.1';
            $port = $_ENV['DB_PORT'] ?? '3306';
            $name = $_ENV['DB_NAME'] ?? 'agafari';
            $user = $_ENV['DB_USER'] ?? 'root';
            $pass = $_ENV['DB_PASS'] ?? '';
            $pdo = new \PDO("mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4", $user, $pass);
        }

        $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        self::$instance = $pdo;

        return $pdo;
    }
}

```

### File: `backend/src/Infrastructure/Persistence/PdoGuestRepository.php`

```php
<?php
declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Application\Ports\GuestRepositoryInterface;
use App\Domain\Guest\Guest;
use App\Domain\Guest\GuestStatus;

final class PdoGuestRepository implements GuestRepositoryInterface
{
    public function __construct(private readonly \PDO $pdo)
    {
    }

    public function findById(string $guestId): ?Guest
    {
        $stmt = $this->pdo->prepare('SELECT * FROM guests WHERE id = :id');
        $stmt->execute(['id' => $guestId]);
        $row = $stmt->fetch();

        return $row ? $this->hydrate($row) : null;
    }

    public function findByToken(string $guestToken): ?Guest
    {
        // The token is the guest id in this minimal skeleton. In production,
        // resolve a signed link (guest_id + event_id + expiry) here instead.
        return $this->findById($guestToken);
    }

    public function save(Guest $guest): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE guests SET status = :status WHERE id = :id'
        );
        $stmt->execute(['status' => $guest->status->value, 'id' => $guest->id]);
    }

    private function hydrate(array $row): Guest
    {
        return new Guest(
            id: $row['id'],
            eventId: $row['event_id'],
            quotaId: $row['quota_id'],
            phone: $row['phone'],
            status: GuestStatus::from($row['status']),
            headcountAllowed: (int) $row['headcount_allowed'],
        );
    }
}

```

### File: `backend/src/Infrastructure/Persistence/PdoTicketRepository.php`

```php
<?php
declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Application\Ports\TicketRepositoryInterface;
use App\Domain\Ticket\Ticket;

final class PdoTicketRepository implements TicketRepositoryInterface
{
    public function __construct(private readonly \PDO $pdo)
    {
    }

    public function findByGuestId(string $guestId): ?Ticket
    {
        $stmt = $this->pdo->prepare('SELECT * FROM tickets WHERE guest_id = :guest_id');
        $stmt->execute(['guest_id' => $guestId]);
        $row = $stmt->fetch();

        return $row ? $this->hydrate($row) : null;
    }

    public function issueFor(string $guestId, string $signature, int $headcountAllowed): Ticket
    {
        $id = bin2hex(random_bytes(16));
        $stmt = $this->pdo->prepare(
            'INSERT INTO tickets (id, guest_id, qr_signature, headcount_allowed) VALUES (:id, :guest_id, :sig, :headcount)'
        );
        $stmt->execute([
            'id' => $id,
            'guest_id' => $guestId,
            'sig' => $signature,
            'headcount' => $headcountAllowed,
        ]);

        return new Ticket($guestId, $signature, $headcountAllowed);
    }

    public function save(Ticket $ticket): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE tickets SET checked_in_at = :checked_in_at, checked_in_by_device = :device WHERE guest_id = :guest_id'
        );
        $stmt->execute([
            'checked_in_at' => $ticket->checkedInAt?->format('Y-m-d H:i:s'),
            'device' => $ticket->checkedInByDevice,
            'guest_id' => $ticket->guestId,
        ]);
    }

    private function hydrate(array $row): Ticket
    {
        return new Ticket(
            guestId: $row['guest_id'],
            signature: $row['qr_signature'],
            headcountAllowed: (int) $row['headcount_allowed'],
            checkedInAt: $row['checked_in_at'] ? new \DateTimeImmutable($row['checked_in_at']) : null,
            checkedInByDevice: $row['checked_in_by_device'],
        );
    }
}

```

### File: `backend/src/Infrastructure/Persistence/schema.mysql.sql`

```sql
-- Same schema, MySQL dialect. Run: mysql -u root -p agafari < schema.mysql.sql

CREATE TABLE IF NOT EXISTS events (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(191) NOT NULL UNIQUE,
  couple_names VARCHAR(255) NOT NULL,
  wedding_date DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS venues (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36) NOT NULL,
  type ENUM('home','church','hall','melse') NOT NULL,
  gps_coords VARCHAR(64),
  FOREIGN KEY (event_id) REFERENCES events(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS quotas (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36) NOT NULL,
  delegate_user_id CHAR(36),
  slots_total INT NOT NULL,
  slots_used INT NOT NULL DEFAULT 0,
  FOREIGN KEY (event_id) REFERENCES events(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS guests (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36) NOT NULL,
  quota_id CHAR(36),
  phone VARCHAR(32) NOT NULL,
  status ENUM('invited','confirmed','declined','checked_in') NOT NULL DEFAULT 'invited',
  headcount_allowed INT NOT NULL DEFAULT 1,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (quota_id) REFERENCES quotas(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tickets (
  id CHAR(36) PRIMARY KEY,
  guest_id CHAR(36) NOT NULL UNIQUE,
  qr_signature VARCHAR(191) NOT NULL,
  headcount_allowed INT NOT NULL DEFAULT 1,
  checked_in_at DATETIME NULL,
  checked_in_by_device VARCHAR(191) NULL,
  FOREIGN KEY (guest_id) REFERENCES guests(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS timeline_milestones (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36) NOT NULL,
  label VARCHAR(191) NOT NULL,
  planned_at DATETIME NOT NULL,
  current_at DATETIME NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS media_items (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36) NOT NULL,
  guest_id CHAR(36) NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  storage_url VARCHAR(512) NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (guest_id) REFERENCES guests(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS event_ratings (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36) NOT NULL,
  food TINYINT,
  ambiance TINYINT,
  coordination TINYINT,
  FOREIGN KEY (event_id) REFERENCES events(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  role VARCHAR(64) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS role_permissions (
  id CHAR(36) PRIMARY KEY,
  role VARCHAR(64) NOT NULL,
  permission_key VARCHAR(128) NOT NULL
) ENGINE=InnoDB;

```

### File: `backend/src/Infrastructure/Persistence/schema.sqlite.sql`

```sql
-- Minimal schema matching the ERD in agafari-architecture.md, SQLite dialect.
-- Run: sqlite3 storage/database.sqlite < src/Infrastructure/Persistence/schema.sqlite.sql

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  couple_names TEXT NOT NULL,
  wedding_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  type TEXT NOT NULL CHECK (type IN ('home','church','hall','melse')),
  gps_coords TEXT
);

CREATE TABLE IF NOT EXISTS quotas (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  delegate_user_id TEXT,
  slots_total INTEGER NOT NULL,
  slots_used INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS guests (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  quota_id TEXT REFERENCES quotas(id),
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited','confirmed','declined','checked_in')),
  headcount_allowed INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  guest_id TEXT NOT NULL UNIQUE REFERENCES guests(id),
  qr_signature TEXT NOT NULL,
  headcount_allowed INTEGER NOT NULL DEFAULT 1,
  checked_in_at TEXT,
  checked_in_by_device TEXT
);

CREATE TABLE IF NOT EXISTS timeline_milestones (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  label TEXT NOT NULL,
  planned_at TEXT NOT NULL,
  current_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS media_items (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  guest_id TEXT REFERENCES guests(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  storage_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS event_ratings (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  food INTEGER,
  ambiance INTEGER,
  coordination INTEGER
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  permission_key TEXT NOT NULL
);

-- Seed one demo event + guest so the API has something to check in against.
INSERT OR IGNORE INTO events (id, slug, couple_names, wedding_date)
VALUES ('evt_demo', 'kal-hana', 'Kaleab & Hanna', '2026-11-14');

INSERT OR IGNORE INTO guests (id, event_id, quota_id, phone, status, headcount_allowed)
VALUES ('guest_demo', 'evt_demo', NULL, '+251900000000', 'invited', 2);

```

### File: `backend/src/Infrastructure/Security/HmacTicketSigner.php`

```php
<?php
declare(strict_types=1);

namespace App\Infrastructure\Security;

use App\Application\Ports\TicketSignerInterface;

final class HmacTicketSigner implements TicketSignerInterface
{
    public function __construct(private readonly string $secret)
    {
    }

    public function sign(string $guestId): string
    {
        return hash_hmac('sha256', $guestId, $this->secret);
    }

    public function verify(string $guestId, string $signature): bool
    {
        return hash_equals($this->sign($guestId), $signature);
    }
}

```

### File: `backend/src/Presentation/Http/Controllers/HealthController.php`

```php
<?php
declare(strict_types=1);

namespace App\Presentation\Http\Controllers;

final class HealthController
{
    public function check(): array
    {
        return ['status' => 'ok', 'service' => 'agafari-api'];
    }
}

```

### File: `backend/src/Presentation/Http/Controllers/InvitationController.php`

```php
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

```

### File: `backend/src/Presentation/Http/Controllers/ScannerController.php`

```php
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

```

### File: `backend/src/Presentation/Http/Router.php`

```php
<?php
declare(strict_types=1);

namespace App\Presentation\Http;

/**
 * Deliberately tiny — no framework dependency. Routes are (method, exact path
 * or /param/ pattern) -> callable. Enough for this skeleton; swap in a real
 * router (FastRoute, Slim) once the surface grows.
 */
final class Router
{
    /** @var array<int, array{method:string, pattern:string, handler:callable}> */
    private array $routes = [];

    public function add(string $method, string $pattern, callable $handler): void
    {
        $this->routes[] = ['method' => $method, 'pattern' => $pattern, 'handler' => $handler];
    }

    public function dispatch(string $method, string $path): void
    {
        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            $params = $this->match($route['pattern'], $path);
            if ($params === null) {
                continue;
            }

            header('Content-Type: application/json');
            try {
                $result = ($route['handler'])($params);
                echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            } catch (\App\Domain\Shared\Exceptions\DomainException $e) {
                http_response_code(422);
                echo json_encode(['error' => $e->getMessage()]);
            } catch (\Throwable $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Internal error', 'detail' => $e->getMessage()]);
            }
            return;
        }

        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Not found']);
    }

    /** @return array<string,string>|null */
    private function match(string $pattern, string $path): ?array
    {
        $patternParts = explode('/', trim($pattern, '/'));
        $pathParts = explode('/', trim($path, '/'));

        if (count($patternParts) !== count($pathParts)) {
            return null;
        }

        $params = [];
        foreach ($patternParts as $i => $part) {
            if (str_starts_with($part, '{') && str_ends_with($part, '}')) {
                $params[trim($part, '{}')] = $pathParts[$i];
            } elseif ($part !== $pathParts[$i]) {
                return null;
            }
        }

        return $params;
    }
}

```

### File: `backend/storage/.gitkeep`

```

```

### File: `frontend/.env`

```
# Agafari Environment Configuration Template

# Database Connection (PostgreSQL or MySQL on Yegara/Supabase/Neon)
DATABASE_URL="postgresql://user:password@localhost:5432/agafari_db?schema=public"

# Auth Secret (JWT Signing Key)
JWT_SECRET="agafari_super_secret_jwt_key_2026_change_in_production"

# Cloud Storage (Cloudinary / Firebase / S3)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Public App Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

```

### File: `frontend/.env.example`

```
# Agafari Environment Configuration Template

# Database Connection (PostgreSQL or MySQL on Yegara/Supabase/Neon)
DATABASE_URL="postgresql://user:password@localhost:5432/agafari_db?schema=public"

# Auth Secret (JWT Signing Key)
JWT_SECRET="agafari_super_secret_jwt_key_2026_change_in_production"

# Cloud Storage (Cloudinary / Firebase / S3)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Public App Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

```

### File: `frontend/.gitignore`

```
# Dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# Next.js build and development cache
/.next/
/out/

# Production build artifacts
/build
/dist

# Environment variables
.env*.local
.env

# Debug & OS logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
.DS_Store
*.pem
Thumbs.db

# IDE and editor files
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### File: `frontend/AGENTS.md`

```markdown
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

```

### File: `frontend/db/schema.sql`

```sql
-- =============================================================================
-- AGAFARI (አጋፋሪ) WEDDING CELEBRATION PLATFORM
-- Standard PostgreSQL Relational Database Schema
-- Compatible with: PostgreSQL 14+, Supabase, Neon, AWS RDS, Railway
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

CREATE TYPE event_status_enum AS ENUM (
    'DRAFT',
    'COMING_SOON',]
    'LIVE',
    'COMPLETED',
    'ARCHIVED'
);

CREATE TYPE admin_approval_enum AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);

CREATE TYPE user_role_enum AS ENUM (
    'SYSTEM_ADMIN',
    'EVENT_ORGANIZER',
    'BRIDE_GROOM',
    'LIVE_STREAMER',
    'GATE_SCANNER',
    'GUEST'
);

CREATE TYPE rsvp_status_enum AS ENUM (
    'ATTENDING',
    'MAYBE',
    'DECLINED',
    'PENDING'
);

CREATE TYPE invitation_type_enum AS ENUM (
    'CARD',
    'LINK'
);

CREATE TYPE media_category_enum AS ENUM (
    'WISHES',
    'BTS',
    'LIVE'
);

CREATE TYPE media_type_enum AS ENUM (
    'VIDEO',
    'IMAGE'
);

-- =============================================================================
-- 1. WEDDING EVENTS TABLE
-- =============================================================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(120) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    bride_name VARCHAR(150) NOT NULL,
    groom_name VARCHAR(150) NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    start_time VARCHAR(20) DEFAULT '14:00',
    second_event_date TIMESTAMPTZ,
    venue_name VARCHAR(255) NOT NULL,
    venue_address TEXT,
    venue_map_url TEXT,
    dress_code VARCHAR(255),
    welcome_message TEXT,
    cover_image_url TEXT,
    status event_status_enum DEFAULT 'COMING_SOON' NOT NULL,
    admin_approval_status admin_approval_enum DEFAULT 'APPROVED' NOT NULL,
    youtube_video_id VARCHAR(50) DEFAULT 'dQw4w9WgXcQ',
    is_live BOOLEAN DEFAULT FALSE NOT NULL,
    thank_you_message TEXT,
    thank_you_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(event_date);

-- =============================================================================
-- 2. USER ACCOUNTS & RBAC TABLE
-- =============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    temporary_password VARCHAR(100),
    full_name VARCHAR(150) NOT NULL,
    role user_role_enum DEFAULT 'GUEST' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_event_id ON users(event_id);

-- =============================================================================
-- 3. DIGITAL GUEST INVITATIONS & QR PASSES TABLE
-- =============================================================================

CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    invite_code VARCHAR(50) UNIQUE NOT NULL,
    invite_type invitation_type_enum DEFAULT 'CARD' NOT NULL,
    guest_name VARCHAR(150) NOT NULL,
    guest_phone VARCHAR(50),
    max_guests INT DEFAULT 1 NOT NULL,
    table_number VARCHAR(100),
    rsvp_status rsvp_status_enum DEFAULT 'PENDING' NOT NULL,
    attending_headcount INT DEFAULT 0 NOT NULL,
    is_scanned BOOLEAN DEFAULT FALSE NOT NULL,
    scanned_count INT DEFAULT 0 NOT NULL,
    scanned_at TIMESTAMPTZ,
    scanned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    qr_code_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_invitations_code ON invitations(invite_code);
CREATE INDEX idx_invitations_event ON invitations(event_id);
CREATE INDEX idx_invitations_is_scanned ON invitations(is_scanned);

-- =============================================================================
-- 4. 1-CLICK INSTANT RSVPS TABLE
-- =============================================================================

CREATE TABLE rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    invitation_id UUID REFERENCES invitations(id) ON DELETE SET NULL,
    invite_code VARCHAR(50),
    guest_name VARCHAR(150) NOT NULL,
    guest_phone VARCHAR(50),
    attendance_status rsvp_status_enum NOT NULL,
    attending_count INT DEFAULT 1 NOT NULL,
    song_recommendation TEXT,
    dietary_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX idx_rsvps_status ON rsvps(attendance_status);

-- =============================================================================
-- 5. GUEST WISHES & BLESSINGS WALL TABLE
-- =============================================================================

CREATE TABLE wishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    sender_name VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    media_type media_type_enum DEFAULT 'IMAGE' NOT NULL,
    video_url TEXT,
    status admin_approval_enum DEFAULT 'APPROVED' NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_wishes_event_id ON wishes(event_id);
CREATE INDEX idx_wishes_status ON wishes(status);

-- =============================================================================
-- 6. TIKTOK-STYLE VIDEO MEMORY REEL ASSETS TABLE
-- =============================================================================

CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    uploader_name VARCHAR(150) NOT NULL,
    media_type media_type_enum DEFAULT 'VIDEO' NOT NULL,
    category media_category_enum DEFAULT 'WISHES' NOT NULL,
    cdn_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    views_count INT DEFAULT 0 NOT NULL,
    likes_count INT DEFAULT 0 NOT NULL,
    status admin_approval_enum DEFAULT 'APPROVED' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_media_event_id ON media_assets(event_id);
CREATE INDEX idx_media_category ON media_assets(category);
CREATE INDEX idx_media_status ON media_assets(status);

-- =============================================================================
-- 7. VIDEO REEL COMMENTS TABLE
-- =============================================================================

CREATE TABLE media_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    sender_name VARCHAR(150) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_comments_media_id ON media_comments(media_id);

-- =============================================================================
-- 8. MEZMUR & WEDDING MUSIC PLAYLIST TABLE
-- =============================================================================

CREATE TABLE mezmur_playlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'MEZMUR' NOT NULL,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_mezmur_event_id ON mezmur_playlist(event_id);

-- =============================================================================
-- AUTOMATIC TIMESTAMP TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_invitations_updated_at BEFORE UPDATE ON invitations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

```

### File: `frontend/next-env.d.ts`

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.

```

### File: `frontend/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['framer-motion'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      },
    ],
  },
};

module.exports = nextConfig;

```

### File: `frontend/package-lock.json`

```json
{
  "name": "agafari-wedding-platform",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "agafari-wedding-platform",
      "version": "1.0.0",
      "dependencies": {
        "clsx": "^2.1.1",
        "framer-motion": "^11.5.4",
        "html5-qrcode": "^2.3.8",
        "lucide-react": "^0.439.0",
        "next": "14.2.8",
        "qrcode": "^1.5.4",
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
        "tailwind-merge": "^2.5.2"
      },
      "devDependencies": {
        "@types/node": "^20.16.5",
        "@types/qrcode": "^1.5.6",
        "@types/react": "^18.3.5",
        "@types/react-dom": "^18.3.0",
        "autoprefixer": "^10.4.20",
        "postcss": "^8.4.45",
        "tailwindcss": "^3.4.10",
        "typescript": "^5.5.4"
      }
    },
    "node_modules/@alloc/quick-lru": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz",
      "integrity": "sha512-UrcABB+4bUrFABwbluTIBErXwvbsU/V7TZWfmbgJfbkwiBuziS9gxdODUyuiecfdGQ85jglMW6juS3+z5TsKLw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.5.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@next/env": {
      "version": "14.2.8",
      "resolved": "https://registry.npmjs.org/@next/env/-/env-14.2.8.tgz",
      "integrity": "sha512-L44a+ynqkolyNBnYfF8VoCiSrjSZWgEHYKkKLGcs/a80qh7AkfVUD/MduVPgdsWZ31tgROR+yJRA0PZjSVBXWQ==",
      "license": "MIT"
    },
    "node_modules/@next/swc-darwin-arm64": {
      "version": "14.2.8",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-arm64/-/swc-darwin-arm64-14.2.8.tgz",
      "integrity": "sha512-1VrQlG8OzdyvvGZhGJFnaNE2P10Jjy/2FopnqbY0nSa/gr8If3iINxvOEW3cmVeoAYkmW0RsBazQecA2dBFOSw==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-darwin-x64": {
      "version": "14.2.8",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-x64/-/swc-darwin-x64-14.2.8.tgz",
      "integrity": "sha512-87t3I86rNRSOJB1gXIUzaQWWSWrkWPDyZGsR0Z7JAPtLeX3uUOW2fHxl7dNWD2BZvbvftctTQjgtfpp7nMtmWg==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-gnu": {
      "version": "14.2.8",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-gnu/-/swc-linux-arm64-gnu-14.2.8.tgz",
      "integrity": "sha512-ta2sfVzbOpTbgBrF9HM5m+U58dv6QPuwU4n5EX4LLyCJGKc433Z0D9h9gay/HSOjLEXJ2fJYrMP5JYYbHdxhtw==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-musl": {
      "version": "14.2.8",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-musl/-/swc-linux-arm64-musl-14.2.8.tgz",
      "integrity": "sha512-+IoLTPK6Z5uIgDhgeWnQF5/o5GBN7+zyUNrs4Bes1W3g9++YELb8y0unFybS8s87ntAKMDl6jeQ+mD7oNwp/Ng==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-gnu": {
      "version": "14.2.8",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-14.2.8.tgz",
      "integrity": "sha512-pO+hVXC+mvzUOQJJRG4RX4wJsRJ5BkURSf6dD6EjUXAX4Ml9es1WsEfkaZ4lcpmFzFvY47IkDaffks/GdCn9ag==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-musl": {
      "version": "14.2.8",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-14.2.8.tgz",
      "integrity": "sha512-bCat9izctychCtf3uL1nqHq31N5e1VxvdyNcBQflkudPMLbxVnlrw45Vi87K+lt1CwrtVayHqzo4ie0Szcpwzg==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-arm64-msvc": {
      "version": "14.2.8",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-arm64-msvc/-/swc-win32-arm64-msvc-14.2.8.tgz",
      "integrity": "sha512-gbxfUaSPV7EyUobpavida2Hwi62GhSJaSg7iBjmBWoxkxlmETOD7U4tWt763cGIsyE6jM7IoNavq0BXqwdW2QA==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-ia32-msvc": {
      "version": "14.2.8",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-ia32-msvc/-/swc-win32-ia32-msvc-14.2.8.tgz",
      "integrity": "sha512-PUXzEzjTTlUh3b5VAn1nlpwvujTnuCMMwbiCnaTazoVlN1nA3kWjlmp42IfURA2N/nyrlVEw7pURa/o4Qxj1cw==",
      "cpu": [
        "ia32"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-x64-msvc": {
      "version": "14.2.8",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-14.2.8.tgz",
      "integrity": "sha512-EnPKv0ttq02E9/1KZ/8Dn7kuutv6hy1CKc0HlNcvzOQcm4/SQtvfws5gY0zrG9tuupd3HfC2L/zcTrnBhpjTuQ==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@nodelib/fs.scandir": {
      "version": "2.1.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz",
      "integrity": "sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "2.0.5",
        "run-parallel": "^1.1.9"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.stat": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz",
      "integrity": "sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.walk": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz",
      "integrity": "sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.scandir": "2.1.5",
        "fastq": "^1.6.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@swc/counter": {
      "version": "0.1.3",
      "resolved": "https://registry.npmjs.org/@swc/counter/-/counter-0.1.3.tgz",
      "integrity": "sha512-e2BR4lsJkkRlKZ/qCHPw9ZaSxc0MVUd7gtbtaB7aMvHeJVYe8sOB8DBZkP2DtISHGSku9sCK6T6cnY0CtXrOCQ==",
      "license": "Apache-2.0"
    },
    "node_modules/@swc/helpers": {
      "version": "0.5.5",
      "resolved": "https://registry.npmjs.org/@swc/helpers/-/helpers-0.5.5.tgz",
      "integrity": "sha512-KGYxvIOXcceOAbEk4bi/dVLEK9z8sZ0uBB3Il5b1rhfClSpcX0yfRO0KmTkqR2cnQDymwLB+25ZyMzICg/cm/A==",
      "license": "Apache-2.0",
      "dependencies": {
        "@swc/counter": "^0.1.3",
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@types/node": {
      "version": "20.19.43",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-20.19.43.tgz",
      "integrity": "sha512-6oYBAi5ikg4Pl+kGsoYtawUMBT2zZMCvPNF7pVLnHZfd1zf38DRiWn/gT01RYCdUqkv7Fhr+C9ot4/tb+2sVvA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/@types/prop-types": {
      "version": "15.7.15",
      "resolved": "https://registry.npmjs.org/@types/prop-types/-/prop-types-15.7.15.tgz",
      "integrity": "sha512-F6bEyamV9jKGAFBEmlQnesRPGOQqS2+Uwi0Em15xenOxHaf2hv6L8YCVn3rPdPJOiJfPiCnLIRyvwVaqMY3MIw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/qrcode": {
      "version": "1.5.6",
      "resolved": "https://registry.npmjs.org/@types/qrcode/-/qrcode-1.5.6.tgz",
      "integrity": "sha512-te7NQcV2BOvdj2b1hCAHzAoMNuj65kNBMz0KBaxM6c3VGBOhU0dURQKOtH8CFNI/dsKkwlv32p26qYQTWoB5bw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/react": {
      "version": "18.3.31",
      "resolved": "https://registry.npmjs.org/@types/react/-/react-18.3.31.tgz",
      "integrity": "sha512-vfEqpXTvwT91yhmwdfouStN2hSKwTvyRs8qpLfADyrq/kxDw0hZM7Wk9Ug1FELj8hIby+S/+kQCSRFF32nv2Qw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/prop-types": "*",
        "csstype": "^3.2.2"
      }
    },
    "node_modules/@types/react-dom": {
      "version": "18.3.7",
      "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-18.3.7.tgz",
      "integrity": "sha512-MEe3UeoENYVFXzoXEWsvcpg6ZvlrFNlOQ7EOsvhI3CfAXwzPfO8Qwuxd40nepsYKqyyVQnTdEfv68q91yLcKrQ==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "^18.0.0"
      }
    },
    "node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/any-promise": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/any-promise/-/any-promise-1.3.0.tgz",
      "integrity": "sha512-7UvmKalWRt1wgjL1RrGxoSJW/0QZFIegpeGvZG9kjp8vrRu55XTHbwnqq2GpXm9uLbcuhxm3IqX9OB4MZR1b2A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/anymatch": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/anymatch/-/anymatch-3.1.3.tgz",
      "integrity": "sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "normalize-path": "^3.0.0",
        "picomatch": "^2.0.4"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/arg": {
      "version": "5.0.2",
      "resolved": "https://registry.npmjs.org/arg/-/arg-5.0.2.tgz",
      "integrity": "sha512-PYjyFOLKQ9y57JvQ6QLo8dAgNqswh8M1RMJYdQduT6xbWSgK36P/Z/v+p888pM69jMMfS8Xd8F6I1kQ/I9HUGg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/autoprefixer": {
      "version": "10.5.4",
      "resolved": "https://registry.npmjs.org/autoprefixer/-/autoprefixer-10.5.4.tgz",
      "integrity": "sha512-MaU0U/za7N3r6brxD4YB/l4NSrFzLPlANv6wEuQVaIPlD3L4W9rFcQPbL/EilY9BHhHvhfcz3gInDLrEtWT4EA==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/autoprefixer"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "browserslist": "^4.28.6",
        "caniuse-lite": "^1.0.30001806",
        "fraction.js": "^5.3.4",
        "picocolors": "^1.1.1",
        "postcss-value-parser": "^4.2.0"
      },
      "bin": {
        "autoprefixer": "bin/autoprefixer"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      },
      "peerDependencies": {
        "postcss": "^8.1.0"
      }
    },
    "node_modules/baseline-browser-mapping": {
      "version": "2.11.12",
      "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.11.12.tgz",
      "integrity": "sha512-r7WnVImvVCeFpf2DOXfy41aPWzeNg3H/A2X4dKmy1QL0MSyyk/e7z8ihJ3N6Nn2PsdhkVlqnEfnUE4a05P2aTA==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "baseline-browser-mapping": "dist/cli.cjs"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/binary-extensions": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/binary-extensions/-/binary-extensions-2.3.0.tgz",
      "integrity": "sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/browserslist": {
      "version": "4.28.7",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.28.7.tgz",
      "integrity": "sha512-JxV13hNrFxqjOc8alRbq9dK1MM79NEXYpma2B2J4wAtpWS5zIEIKqWPGCl7N4o7Uc7B7itylh7SuDujATRyyTw==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "baseline-browser-mapping": "^2.10.44",
        "caniuse-lite": "^1.0.30001806",
        "electron-to-chromium": "^1.5.393",
        "node-releases": "^2.0.51",
        "update-browserslist-db": "^1.2.3"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/busboy": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/busboy/-/busboy-1.6.0.tgz",
      "integrity": "sha512-8SFQbg/0hQ9xy3UNTB0YEnsNBbWfhf7RtnzpL7TkBiTBRfrQ9Fxcnz7VJsleJpyp6rVLvXiuORqjlHi5q+PYuA==",
      "dependencies": {
        "streamsearch": "^1.1.0"
      },
      "engines": {
        "node": ">=10.16.0"
      }
    },
    "node_modules/camelcase": {
      "version": "5.3.1",
      "resolved": "https://registry.npmjs.org/camelcase/-/camelcase-5.3.1.tgz",
      "integrity": "sha512-L28STB170nwWS63UjtlEOE3dldQApaJXZkOI1uMFfzf3rRuPegHaHesyee+YxQ+W6SvRDQV6UrdOdRiR153wJg==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/camelcase-css": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/camelcase-css/-/camelcase-css-2.0.1.tgz",
      "integrity": "sha512-QOSvevhslijgYwRx6Rv7zKdMF8lbRmx+uQGx2+vDc+KI/eBnsy9kit5aj23AgGu3pa4t9AgwbnXWqS+iOY+2aA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001806",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001806.tgz",
      "integrity": "sha512-72Cuvd95zbSYPKq6Fhg8eDJRlzgWDf7/mtoZv6Qe/DYNCEBdNxoA3+rZAU2ZhGCpZlns3EssFavaZomckT5Uuw==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/chokidar": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-3.6.0.tgz",
      "integrity": "sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "anymatch": "~3.1.2",
        "braces": "~3.0.2",
        "glob-parent": "~5.1.2",
        "is-binary-path": "~2.1.0",
        "is-glob": "~4.0.1",
        "normalize-path": "~3.0.0",
        "readdirp": "~3.6.0"
      },
      "engines": {
        "node": ">= 8.10.0"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/chokidar/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/client-only": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/client-only/-/client-only-0.0.1.tgz",
      "integrity": "sha512-IV3Ou0jSMzZrd3pZ48nLkT9DA7Ag1pnPzaiQhpW7c3RbcqqzvzzVu+L8gfqMp/8IM2MQtSiqaCxrrcfu8I8rMA==",
      "license": "MIT"
    },
    "node_modules/cliui": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/cliui/-/cliui-6.0.0.tgz",
      "integrity": "sha512-t6wbgtoCXvAzst7QgXxJYqPt0usEfbgQdftEPbLL/cvv6HPE5VgvqCuAIDR0NgU52ds6rFwqrgakNLrHEjCbrQ==",
      "license": "ISC",
      "dependencies": {
        "string-width": "^4.2.0",
        "strip-ansi": "^6.0.0",
        "wrap-ansi": "^6.2.0"
      }
    },
    "node_modules/clsx": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/clsx/-/clsx-2.1.1.tgz",
      "integrity": "sha512-eYm0QWBtUrBWZWG0d386OGAw16Z995PiOVo2B7bjWSbHedGl5e0ZWaq65kOGgUSNesEIDkB9ISbTg/JK9dhCZA==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "license": "MIT",
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
      "license": "MIT"
    },
    "node_modules/commander": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/commander/-/commander-4.1.1.tgz",
      "integrity": "sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/cssesc": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/cssesc/-/cssesc-3.0.0.tgz",
      "integrity": "sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "cssesc": "bin/cssesc"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/csstype": {
      "version": "3.2.3",
      "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",
      "integrity": "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/decamelize": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/decamelize/-/decamelize-1.2.0.tgz",
      "integrity": "sha512-z2S+W9X73hAUUki+N+9Za2lBlun89zigOyGrsax+KUQ6wKW4ZoWpEYBkGhQjwAjjDCkWxhY0VKEhk8wzY7F5cA==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/didyoumean": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/didyoumean/-/didyoumean-1.2.2.tgz",
      "integrity": "sha512-gxtyfqMg7GKyhQmb056K7M3xszy/myH8w+B4RT+QXBQsvAOdc3XymqDDPHx1BgPgsdAA5SIifona89YtRATDzw==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/dijkstrajs": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/dijkstrajs/-/dijkstrajs-1.0.3.tgz",
      "integrity": "sha512-qiSlmBq9+BCdCA/L46dw8Uy93mloxsPSbwnm5yrKn2vMPiy8KyAskTF6zuV/j5BMsmOGZDPs7KjU+mjb670kfA==",
      "license": "MIT"
    },
    "node_modules/dlv": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/dlv/-/dlv-1.1.3.tgz",
      "integrity": "sha512-+HlytyjlPKnIG8XuRG8WvmBP8xs8P71y+SKKS6ZXWoEgLuePxtDoUEiH7WkdePWrQ5JBpE6aoVqfZfJUQkjXwA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.400",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.400.tgz",
      "integrity": "sha512-96EWDNjM59SYflgeV5Ylsf4EMiq1a25YjCnJH7cxn/AF2H3pILRweaUnoLax0yKHWdpOzY6JKEu45e8irqZIHA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "license": "MIT"
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/fast-glob": {
      "version": "3.3.3",
      "resolved": "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.3.tgz",
      "integrity": "sha512-7MptL8U0cqcFdzIzwOTHoilX9x5BrNqye7Z/LuC7kCMRio1EMSyqRK3BEAUD7sXRq4iT4AzTVuZdhgQ2TCvYLg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "^2.0.2",
        "@nodelib/fs.walk": "^1.2.3",
        "glob-parent": "^5.1.2",
        "merge2": "^1.3.0",
        "micromatch": "^4.0.8"
      },
      "engines": {
        "node": ">=8.6.0"
      }
    },
    "node_modules/fast-glob/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/fastq": {
      "version": "1.20.1",
      "resolved": "https://registry.npmjs.org/fastq/-/fastq-1.20.1.tgz",
      "integrity": "sha512-GGToxJ/w1x32s/D2EKND7kTil4n8OVk/9mycTc4VDza13lOvpUZTGX3mFSCtV9ksdGBVzvsyAVLM6mHFThxXxw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "reusify": "^1.0.4"
      }
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/find-up": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/find-up/-/find-up-4.1.0.tgz",
      "integrity": "sha512-PpOwAdQ/YlXQ2vj8a3h8IipDuYRi3wceVQQGYWxNINccq40Anw7BlsEXCMbt1Zt+OLA6Fq9suIpIWD0OsnISlw==",
      "license": "MIT",
      "dependencies": {
        "locate-path": "^5.0.0",
        "path-exists": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/fraction.js": {
      "version": "5.3.4",
      "resolved": "https://registry.npmjs.org/fraction.js/-/fraction.js-5.3.4.tgz",
      "integrity": "sha512-1X1NTtiJphryn/uLQz3whtY6jK3fTqoE3ohKs0tT+Ujr1W59oopxmoEh7Lu5p6vBaPbgoM0bzveAW4Qi5RyWDQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "*"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/rawify"
      }
    },
    "node_modules/framer-motion": {
      "version": "11.18.2",
      "resolved": "https://registry.npmjs.org/framer-motion/-/framer-motion-11.18.2.tgz",
      "integrity": "sha512-5F5Och7wrvtLVElIpclDT0CBzMVg3dL22B64aZwHtsIY8RB4mXICLrkajK4G9R+ieSAGcgrLeae2SeUTg2pr6w==",
      "license": "MIT",
      "dependencies": {
        "motion-dom": "^11.18.1",
        "motion-utils": "^11.18.1",
        "tslib": "^2.4.0"
      },
      "peerDependencies": {
        "@emotion/is-prop-valid": "*",
        "react": "^18.0.0 || ^19.0.0",
        "react-dom": "^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@emotion/is-prop-valid": {
          "optional": true
        },
        "react": {
          "optional": true
        },
        "react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-caller-file": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz",
      "integrity": "sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==",
      "license": "ISC",
      "engines": {
        "node": "6.* || 8.* || >= 10.*"
      }
    },
    "node_modules/glob-parent": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-6.0.2.tgz",
      "integrity": "sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.11",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.11.tgz",
      "integrity": "sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==",
      "license": "ISC"
    },
    "node_modules/hasown": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
      "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/html5-qrcode": {
      "version": "2.3.8",
      "resolved": "https://registry.npmjs.org/html5-qrcode/-/html5-qrcode-2.3.8.tgz",
      "integrity": "sha512-jsr4vafJhwoLVEDW3n1KvPnCCXWaQfRng0/EEYk1vNcQGcG/htAdhJX0be8YyqMoSz7+hZvOZSTAepsabiuhiQ==",
      "license": "Apache-2.0"
    },
    "node_modules/is-binary-path": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/is-binary-path/-/is-binary-path-2.1.0.tgz",
      "integrity": "sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "binary-extensions": "^2.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-core-module": {
      "version": "2.16.2",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.16.2.tgz",
      "integrity": "sha512-evOr8xfXKxE6qSR0hSXL2r3sd7ALj8+7jQEUvPYcm5sgZFdJ+AYzT6yNmJenvIYQBgIGwfwz08sL8zoL7yq2BA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-fullwidth-code-point": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-3.0.0.tgz",
      "integrity": "sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
      "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/jiti": {
      "version": "1.21.7",
      "resolved": "https://registry.npmjs.org/jiti/-/jiti-1.21.7.tgz",
      "integrity": "sha512-/imKNG4EbWNrVjoNC/1H5/9GFy+tqjGBHCaSsN+P2RnPqjsLmv6UD3Ej+Kj8nBWaRAwyk7kK5ZUc+OEatnTR3A==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jiti": "bin/jiti.js"
      }
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
      "license": "MIT"
    },
    "node_modules/lilconfig": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/lilconfig/-/lilconfig-3.1.3.tgz",
      "integrity": "sha512-/vlFKAoH5Cgt3Ie+JLhRbwOsCQePABiU3tJ1egGvyQ+33R/vcwM2Zl2QR/LzjsBeItPt3oSVXapn+m4nQDvpzw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/antonk52"
      }
    },
    "node_modules/lines-and-columns": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/lines-and-columns/-/lines-and-columns-1.2.4.tgz",
      "integrity": "sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/locate-path": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-5.0.0.tgz",
      "integrity": "sha512-t7hw9pI+WvuwNJXwk5zVHpyhIqzg2qTlklJOf0mVxGSbe3Fp2VieZcduNYjaLDoy6p9uGpQEGWG87WpMKlNq8g==",
      "license": "MIT",
      "dependencies": {
        "p-locate": "^4.1.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/loose-envify": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/loose-envify/-/loose-envify-1.4.0.tgz",
      "integrity": "sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==",
      "license": "MIT",
      "dependencies": {
        "js-tokens": "^3.0.0 || ^4.0.0"
      },
      "bin": {
        "loose-envify": "cli.js"
      }
    },
    "node_modules/lucide-react": {
      "version": "0.439.0",
      "resolved": "https://registry.npmjs.org/lucide-react/-/lucide-react-0.439.0.tgz",
      "integrity": "sha512-PafSWvDTpxdtNEndS2HIHxcNAbd54OaqSYJO90/b63rab2HWYqDbH194j0i82ZFdWOAcf0AHinRykXRRK2PJbw==",
      "license": "ISC",
      "peerDependencies": {
        "react": "^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0-rc"
      }
    },
    "node_modules/merge2": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/merge2/-/merge2-1.4.1.tgz",
      "integrity": "sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/micromatch": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/motion-dom": {
      "version": "11.18.1",
      "resolved": "https://registry.npmjs.org/motion-dom/-/motion-dom-11.18.1.tgz",
      "integrity": "sha512-g76KvA001z+atjfxczdRtw/RXOM3OMSdd1f4DL77qCTF/+avrRJiawSG4yDibEQ215sr9kpinSlX2pCTJ9zbhw==",
      "license": "MIT",
      "dependencies": {
        "motion-utils": "^11.18.1"
      }
    },
    "node_modules/motion-utils": {
      "version": "11.18.1",
      "resolved": "https://registry.npmjs.org/motion-utils/-/motion-utils-11.18.1.tgz",
      "integrity": "sha512-49Kt+HKjtbJKLtgO/LKj9Ld+6vw9BjH5d9sc40R/kVyH8GLAXgT42M2NnuPcJNuA3s9ZfZBUcwIgpmZWGEE+hA==",
      "license": "MIT"
    },
    "node_modules/mz": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/mz/-/mz-2.7.0.tgz",
      "integrity": "sha512-z81GNO7nnYMEhrGh9LeymoE4+Yr0Wn5McHIZMK5cfQCl+NDX08sCZgUc9/6MHni9IWuFLm1Z3HTCXu2z9fN62Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "any-promise": "^1.0.0",
        "object-assign": "^4.0.1",
        "thenify-all": "^1.0.0"
      }
    },
    "node_modules/nanoid": {
      "version": "3.3.17",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.17.tgz",
      "integrity": "sha512-xQLf0A3HOMlgHq0n247/LRuAOYmB7dXJ/DvAxGvsSBij45XtBSmQycu+F8ODbHwns/XyFZagyL1+J0Offw1E0g==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/next": {
      "version": "14.2.8",
      "resolved": "https://registry.npmjs.org/next/-/next-14.2.8.tgz",
      "integrity": "sha512-EyEyJZ89r8C5FPlS/401AiF3O8jeMtHIE+bLom9MwcdWJJFBgRl+MR/2VgO0v5bI6tQORNY0a0DR5sjpFNrjbg==",
      "deprecated": "This version has a security vulnerability. Please upgrade to a patched version. See https://nextjs.org/blog/security-update-2025-12-11 for more details.",
      "license": "MIT",
      "dependencies": {
        "@next/env": "14.2.8",
        "@swc/helpers": "0.5.5",
        "busboy": "1.6.0",
        "caniuse-lite": "^1.0.30001579",
        "graceful-fs": "^4.2.11",
        "postcss": "8.4.31",
        "styled-jsx": "5.1.1"
      },
      "bin": {
        "next": "dist/bin/next"
      },
      "engines": {
        "node": ">=18.17.0"
      },
      "optionalDependencies": {
        "@next/swc-darwin-arm64": "14.2.8",
        "@next/swc-darwin-x64": "14.2.8",
        "@next/swc-linux-arm64-gnu": "14.2.8",
        "@next/swc-linux-arm64-musl": "14.2.8",
        "@next/swc-linux-x64-gnu": "14.2.8",
        "@next/swc-linux-x64-musl": "14.2.8",
        "@next/swc-win32-arm64-msvc": "14.2.8",
        "@next/swc-win32-ia32-msvc": "14.2.8",
        "@next/swc-win32-x64-msvc": "14.2.8"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.1.0",
        "@playwright/test": "^1.41.2",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "sass": "^1.3.0"
      },
      "peerDependenciesMeta": {
        "@opentelemetry/api": {
          "optional": true
        },
        "@playwright/test": {
          "optional": true
        },
        "sass": {
          "optional": true
        }
      }
    },
    "node_modules/next/node_modules/postcss": {
      "version": "8.4.31",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.4.31.tgz",
      "integrity": "sha512-PS08Iboia9mts/2ygV3eLpY5ghnUcfLV/EXTOW1E2qYxJKGGBUtNjN76FYHnMs36RmARn41bC0AZmn+rR0OVpQ==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.6",
        "picocolors": "^1.0.0",
        "source-map-js": "^1.0.2"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/node-releases": {
      "version": "2.0.52",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.52.tgz",
      "integrity": "sha512-MRlTqhAfoMx/4mhEbPo3Hi02g9LJZaJkka69V6h67Cb1gjrAG0jsTE4CZX1eptNx+VCAwJmfpnDIF4P0Nh1A7A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/normalize-path": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/normalize-path/-/normalize-path-3.0.0.tgz",
      "integrity": "sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-hash": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/object-hash/-/object-hash-3.0.0.tgz",
      "integrity": "sha512-RSn9F68PjH9HqtltsSnqYC1XXoWe9Bju5+213R98cNGttag9q9yAOTzdbsqvIa7aNm5WffBZFpWYr2aWrklWAw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/p-limit": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-2.3.0.tgz",
      "integrity": "sha512-//88mFWSJx8lxCzwdAABTJL2MyWB12+eIY7MDL2SqLmAkeKU9qxRvWuSyTjm3FUmpBEMuFfckAIqEaVGUDxb6w==",
      "license": "MIT",
      "dependencies": {
        "p-try": "^2.0.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/p-locate": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/p-locate/-/p-locate-4.1.0.tgz",
      "integrity": "sha512-R79ZZ/0wAxKGu3oYMlz8jy/kbhsNrS7SKZ7PxEHBgJ5+F2mtFW2fK2cOtBh1cHYkQsbzFV7I+EoRKe6Yt0oK7A==",
      "license": "MIT",
      "dependencies": {
        "p-limit": "^2.2.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/p-try": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/p-try/-/p-try-2.2.0.tgz",
      "integrity": "sha512-R4nPAVTAU0B9D35/Gk3uJf/7XYbQcyohSKdvAxIRSNghFl4e71hVoGnBNQz9cWaXxO2I10KTC+3jMdvvoKw6dQ==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/path-exists": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-4.0.0.tgz",
      "integrity": "sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz",
      "integrity": "sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/pify": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/pify/-/pify-2.3.0.tgz",
      "integrity": "sha512-udgsAY+fTnvv7kI7aaxbqwWNb0AHiB0qBO89PZKPkoTmGOgdbrHDKD+0B2X4uTfJ/FT1R09r9gTsjUjNJotuog==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/pirates": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/pirates/-/pirates-4.0.7.tgz",
      "integrity": "sha512-TfySrs/5nm8fQJDcBDuUng3VOUKsd7S+zqvbOTiGXHfxX4wK31ard+hoNuvkicM/2YFzlpDgABOevKSsB4G/FA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/pngjs": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/pngjs/-/pngjs-5.0.0.tgz",
      "integrity": "sha512-40QW5YalBNfQo5yRYmiw7Yz6TKKVr3h6970B2YE+3fQpsWcrbj1PzJgxeJ19DRQjhMbKPIuMY8rFaXc8moolVw==",
      "license": "MIT",
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.25",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.25.tgz",
      "integrity": "sha512-DTPx3RWSSnWyzLxQnlH0rJP+EW5ekl16ZU4/psbIhA0e53kJfdgaN5vKM+xP7yJtXVu+nfdVFmlgFDEKAe4Pyw==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.16",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/postcss-import": {
      "version": "15.1.0",
      "resolved": "https://registry.npmjs.org/postcss-import/-/postcss-import-15.1.0.tgz",
      "integrity": "sha512-hpr+J05B2FVYUAXHeK1YyI267J/dDDhMU6B6civm8hSY1jYJnBXxzKDKDswzJmtLHryrjhnDjqqp/49t8FALew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "postcss-value-parser": "^4.0.0",
        "read-cache": "^1.0.0",
        "resolve": "^1.1.7"
      },
      "engines": {
        "node": ">=14.0.0"
      },
      "peerDependencies": {
        "postcss": "^8.0.0"
      }
    },
    "node_modules/postcss-js": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/postcss-js/-/postcss-js-4.1.0.tgz",
      "integrity": "sha512-oIAOTqgIo7q2EOwbhb8UalYePMvYoIeRY2YKntdpFQXNosSu3vLrniGgmH9OKs/qAkfoj5oB3le/7mINW1LCfw==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "camelcase-css": "^2.0.1"
      },
      "engines": {
        "node": "^12 || ^14 || >= 16"
      },
      "peerDependencies": {
        "postcss": "^8.4.21"
      }
    },
    "node_modules/postcss-load-config": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/postcss-load-config/-/postcss-load-config-6.0.1.tgz",
      "integrity": "sha512-oPtTM4oerL+UXmx+93ytZVN82RrlY/wPUV8IeDxFrzIjXOLF1pN+EmKPLbubvKHT2HC20xXsCAH2Z+CKV6Oz/g==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "lilconfig": "^3.1.1"
      },
      "engines": {
        "node": ">= 18"
      },
      "peerDependencies": {
        "jiti": ">=1.21.0",
        "postcss": ">=8.0.9",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "jiti": {
          "optional": true
        },
        "postcss": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    },
    "node_modules/postcss-nested": {
      "version": "6.2.0",
      "resolved": "https://registry.npmjs.org/postcss-nested/-/postcss-nested-6.2.0.tgz",
      "integrity": "sha512-HQbt28KulC5AJzG+cZtj9kvKB93CFCdLvog1WFLf1D+xmMvPGlBstkpTEZfK5+AN9hfJocyBFCNiqyS48bpgzQ==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "postcss-selector-parser": "^6.1.1"
      },
      "engines": {
        "node": ">=12.0"
      },
      "peerDependencies": {
        "postcss": "^8.2.14"
      }
    },
    "node_modules/postcss-selector-parser": {
      "version": "6.1.4",
      "resolved": "https://registry.npmjs.org/postcss-selector-parser/-/postcss-selector-parser-6.1.4.tgz",
      "integrity": "sha512-bIoJLOmjCO1S9XdY/DcnR5hJxvrDir1PbGChrzXG3vw0/FOliy/fA3dmdhQ441kah4gKv+TwckGzex6wNS5cnQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "cssesc": "^3.0.0",
        "util-deprecate": "^1.0.2"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/postcss-value-parser": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/postcss-value-parser/-/postcss-value-parser-4.2.0.tgz",
      "integrity": "sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/qrcode": {
      "version": "1.5.4",
      "resolved": "https://registry.npmjs.org/qrcode/-/qrcode-1.5.4.tgz",
      "integrity": "sha512-1ca71Zgiu6ORjHqFBDpnSMTR2ReToX4l1Au1VFLyVeBTFavzQnv5JxMFr3ukHVKpSrSA2MCk0lNJSykjUfz7Zg==",
      "license": "MIT",
      "dependencies": {
        "dijkstrajs": "^1.0.1",
        "pngjs": "^5.0.0",
        "yargs": "^15.3.1"
      },
      "bin": {
        "qrcode": "bin/qrcode"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/queue-microtask": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/queue-microtask/-/queue-microtask-1.2.3.tgz",
      "integrity": "sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/react": {
      "version": "18.3.1",
      "resolved": "https://registry.npmjs.org/react/-/react-18.3.1.tgz",
      "integrity": "sha512-wS+hAgJShR0KhEvPJArfuPVN1+Hz1t0Y6n5jLrGQbkb4urgPE/0Rve+1kMB1v/oWgHgm4WIcV+i7F2pTVj+2iQ==",
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-dom": {
      "version": "18.3.1",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-18.3.1.tgz",
      "integrity": "sha512-5m4nQKp+rZRb09LNH59GM4BxTh9251/ylbKIbpe7TpGxfJ+9kv6BLkLBXIjjspbgbnIBNqlI23tRnTWT0snUIw==",
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.1.0",
        "scheduler": "^0.23.2"
      },
      "peerDependencies": {
        "react": "^18.3.1"
      }
    },
    "node_modules/read-cache": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/read-cache/-/read-cache-1.0.0.tgz",
      "integrity": "sha512-Owdv/Ft7IjOgm/i0xvNDZ1LrRANRfew4b2prF3OWMQLxLfu3bS8FVhCsrSCMK4lR56Y9ya+AThoTpDCTxCmpRA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "pify": "^2.3.0"
      }
    },
    "node_modules/readdirp": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-3.6.0.tgz",
      "integrity": "sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "picomatch": "^2.2.1"
      },
      "engines": {
        "node": ">=8.10.0"
      }
    },
    "node_modules/require-directory": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/require-directory/-/require-directory-2.1.1.tgz",
      "integrity": "sha512-fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/require-main-filename": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/require-main-filename/-/require-main-filename-2.0.0.tgz",
      "integrity": "sha512-NKN5kMDylKuldxYLSUfrbo5Tuzh4hd+2E8NPPX02mZtn1VuREQToYe/ZdlJy+J3uCpfaiGF05e7B8W0iXbQHmg==",
      "license": "ISC"
    },
    "node_modules/resolve": {
      "version": "1.22.12",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.12.tgz",
      "integrity": "sha512-TyeJ1zif53BPfHootBGwPRYT1RUt6oGWsaQr8UyZW/eAm9bKoijtvruSDEmZHm92CwS9nj7/fWttqPCgzep8CA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "is-core-module": "^2.16.1",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/reusify": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/reusify/-/reusify-1.1.0.tgz",
      "integrity": "sha512-g6QUff04oZpHs0eG5p83rFLhHeV00ug/Yf9nZM6fLeUrPguBTkTQOdpAWWspMh55TZfVQDPaN3NQJfbVRAxdIw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "iojs": ">=1.0.0",
        "node": ">=0.10.0"
      }
    },
    "node_modules/run-parallel": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/run-parallel/-/run-parallel-1.2.0.tgz",
      "integrity": "sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "queue-microtask": "^1.2.2"
      }
    },
    "node_modules/scheduler": {
      "version": "0.23.2",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.23.2.tgz",
      "integrity": "sha512-UOShsPwz7NrMUqhR6t0hWjFduvOzbtv7toDH1/hIrfRNIDBnnBWd0CwJTGvTpngVlmwGCdP9/Zl/tVrDqcuYzQ==",
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.1.0"
      }
    },
    "node_modules/set-blocking": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/set-blocking/-/set-blocking-2.0.0.tgz",
      "integrity": "sha512-KiKBS8AnWGEyLzofFfmvKwpdPzqiy16LvQfK3yv/fVH7Bj13/wl3JSR1J+rfgRE9q7xUJK4qvgS8raSOeLUehw==",
      "license": "ISC"
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/streamsearch": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/streamsearch/-/streamsearch-1.1.0.tgz",
      "integrity": "sha512-Mcc5wHehp9aXz1ax6bZUyY5afg9u2rv5cqQI3mRrYkGC8rW2hM02jWuwjtL++LS5qinSyhj2QfLyNsuc+VsExg==",
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/styled-jsx": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/styled-jsx/-/styled-jsx-5.1.1.tgz",
      "integrity": "sha512-pW7uC1l4mBZ8ugbiZrcIsiIvVx1UmTfw7UkC3Um2tmfUq9Bhk8IiyEIPl6F8agHgjzku6j0xQEZbfA5uSgSaCw==",
      "license": "MIT",
      "dependencies": {
        "client-only": "0.0.1"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "peerDependencies": {
        "react": ">= 16.8.0 || 17.x.x || ^18.0.0-0"
      },
      "peerDependenciesMeta": {
        "@babel/core": {
          "optional": true
        },
        "babel-plugin-macros": {
          "optional": true
        }
      }
    },
    "node_modules/sucrase": {
      "version": "3.35.1",
      "resolved": "https://registry.npmjs.org/sucrase/-/sucrase-3.35.1.tgz",
      "integrity": "sha512-DhuTmvZWux4H1UOnWMB3sk0sbaCVOoQZjv8u1rDoTV0HTdGem9hkAZtl4JZy8P2z4Bg0nT+YMeOFyVr4zcG5Tw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.2",
        "commander": "^4.0.0",
        "lines-and-columns": "^1.1.6",
        "mz": "^2.7.0",
        "pirates": "^4.0.1",
        "tinyglobby": "^0.2.11",
        "ts-interface-checker": "^0.1.9"
      },
      "bin": {
        "sucrase": "bin/sucrase",
        "sucrase-node": "bin/sucrase-node"
      },
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/supports-preserve-symlinks-flag": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
      "integrity": "sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/tailwind-merge": {
      "version": "2.6.1",
      "resolved": "https://registry.npmjs.org/tailwind-merge/-/tailwind-merge-2.6.1.tgz",
      "integrity": "sha512-Oo6tHdpZsGpkKG88HJ8RR1rg/RdnEkQEfMoEk2x1XRI3F1AxeU+ijRXpiVUF4UbLfcxxRGw6TbUINKYdWVsQTQ==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/dcastil"
      }
    },
    "node_modules/tailwindcss": {
      "version": "3.4.19",
      "resolved": "https://registry.npmjs.org/tailwindcss/-/tailwindcss-3.4.19.tgz",
      "integrity": "sha512-3ofp+LL8E+pK/JuPLPggVAIaEuhvIz4qNcf3nA1Xn2o/7fb7s/TYpHhwGDv1ZU3PkBluUVaF8PyCHcm48cKLWQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@alloc/quick-lru": "^5.2.0",
        "arg": "^5.0.2",
        "chokidar": "^3.6.0",
        "didyoumean": "^1.2.2",
        "dlv": "^1.1.3",
        "fast-glob": "^3.3.2",
        "glob-parent": "^6.0.2",
        "is-glob": "^4.0.3",
        "jiti": "^1.21.7",
        "lilconfig": "^3.1.3",
        "micromatch": "^4.0.8",
        "normalize-path": "^3.0.0",
        "object-hash": "^3.0.0",
        "picocolors": "^1.1.1",
        "postcss": "^8.4.47",
        "postcss-import": "^15.1.0",
        "postcss-js": "^4.0.1",
        "postcss-load-config": "^4.0.2 || ^5.0 || ^6.0",
        "postcss-nested": "^6.2.0",
        "postcss-selector-parser": "^6.1.2",
        "resolve": "^1.22.8",
        "sucrase": "^3.35.0"
      },
      "bin": {
        "tailwind": "lib/cli.js",
        "tailwindcss": "lib/cli.js"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/thenify": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/thenify/-/thenify-3.3.1.tgz",
      "integrity": "sha512-RVZSIV5IG10Hk3enotrhvz0T9em6cyHBLkH/YAZuKqd8hRkKhSfCGIcP2KUY0EPxndzANBmNllzWPwak+bheSw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "any-promise": "^1.0.0"
      }
    },
    "node_modules/thenify-all": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/thenify-all/-/thenify-all-1.6.0.tgz",
      "integrity": "sha512-RNxQH/qI8/t3thXJDwcstUO4zeqo64+Uy/+sNVRBx4Xn2OX+OZ9oP+iJnNFqplFra2ZUVeKCSa2oVWi3T4uVmA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "thenify": ">= 3.1.0 < 4"
      },
      "engines": {
        "node": ">=0.8"
      }
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/tinyglobby/node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/tinyglobby/node_modules/picomatch": {
      "version": "4.0.5",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.5.tgz",
      "integrity": "sha512-RvwwcruNjI1ncT5xRakeyS9Lf8lcItv34KD+aif+VH9kduAyfYBipGh12274xtenIPZ119/R9BdTBa8gAwSh0A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/ts-interface-checker": {
      "version": "0.1.13",
      "resolved": "https://registry.npmjs.org/ts-interface-checker/-/ts-interface-checker-0.1.13.tgz",
      "integrity": "sha512-Y/arvbn+rrz3JCKl9C4kVNfTfSm2/mEp5FSz5EsZSANGPSlQrpRI5M4PKF+mJnE52jOO90PnPSc3Ur3bTQw0gA==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "license": "0BSD"
    },
    "node_modules/typescript": {
      "version": "5.9.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz",
      "integrity": "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/update-browserslist-db": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.2.3.tgz",
      "integrity": "sha512-Js0m9cx+qOgDxo0eMiFGEueWztz+d4+M3rGlmKPT+T4IS/jP4ylw3Nwpu6cpTTP8R1MAC1kF4VbdLt3ARf209w==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
      "integrity": "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/which-module": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/which-module/-/which-module-2.0.1.tgz",
      "integrity": "sha512-iBdZ57RDvnOR9AGBhML2vFZf7h8vmBjhoaZqODJBFWHVtKkDmKuHai3cx5PgVMrX5YDNp27AofYbAwctSS+vhQ==",
      "license": "ISC"
    },
    "node_modules/wrap-ansi": {
      "version": "6.2.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-6.2.0.tgz",
      "integrity": "sha512-r6lPcBGxZXlIcymEu7InxDMhdW0KDxpLgoFLcguasxCaJ/SOIZwINatK9KY/tf+ZrlywOKU0UDj3ATXUBfxJXA==",
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/y18n": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/y18n/-/y18n-4.0.3.tgz",
      "integrity": "sha512-JKhqTOwSrqNA1NY5lSztJ1GrBiUodLMmIZuLiDaMRJ+itFd+ABVE8XBjOvIWL+rSqNDC74LCSFmlb/U4UZ4hJQ==",
      "license": "ISC"
    },
    "node_modules/yargs": {
      "version": "15.4.1",
      "resolved": "https://registry.npmjs.org/yargs/-/yargs-15.4.1.tgz",
      "integrity": "sha512-aePbxDmcYW++PaqBsJ+HYUFwCdv4LVvdnhBy78E57PIor8/OVvhMrADFFEDh8DHDFRv/O9i3lPhsENjO7QX0+A==",
      "license": "MIT",
      "dependencies": {
        "cliui": "^6.0.0",
        "decamelize": "^1.2.0",
        "find-up": "^4.1.0",
        "get-caller-file": "^2.0.1",
        "require-directory": "^2.1.1",
        "require-main-filename": "^2.0.0",
        "set-blocking": "^2.0.0",
        "string-width": "^4.2.0",
        "which-module": "^2.0.0",
        "y18n": "^4.0.0",
        "yargs-parser": "^18.1.2"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/yargs-parser": {
      "version": "18.1.3",
      "resolved": "https://registry.npmjs.org/yargs-parser/-/yargs-parser-18.1.3.tgz",
      "integrity": "sha512-o50j0JeToy/4K6OZcaQmW6lyXXKhq7csREXcDwk2omFPJEwUNOVtJKvmDr9EI1fAJZUyZcRF7kxGBWmRXudrCQ==",
      "license": "ISC",
      "dependencies": {
        "camelcase": "^5.0.0",
        "decamelize": "^1.2.0"
      },
      "engines": {
        "node": ">=6"
      }
    }
  }
}

```

### File: `frontend/package.json`

```json
{
  "name": "agafari-wedding-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "framer-motion": "^11.5.4",
    "html5-qrcode": "^2.3.8",
    "lucide-react": "^0.439.0",
    "next": "14.2.8",
    "qrcode": "^1.5.4",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.5.2"
  },
  "devDependencies": {
    "@types/node": "^20.16.5",
    "@types/qrcode": "^1.5.6",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.45",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.4"
  }
}

```

### File: `frontend/postcss.config.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

```

### File: `frontend/public/docs.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Agafari Platform — Visual System Architecture & Manual</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Playfair+Display:ital,wght@0,600;0,800;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#0c120f',
        primaryColor: '#1E3D30',
        primaryTextColor: '#F5E6BE',
        primaryBorderColor: '#D4AF37',
        lineColor: '#D4AF37',
        secondaryColor: '#162820',
        tertiaryColor: '#0b1612'
      }
    });
  </script>
  <style>
    :root {
      --gold-primary: #D4AF37;
      --gold-light: #F3E5AB;
      --gold-dark: #997A15;
      --emerald-dark: #0A1612;
      --emerald-base: #132A20;
      --emerald-card: #183327;
      --emerald-light: #234D3A;
      --bg-dark: #070D0B;
      --text-main: #F4F6F5;
      --text-muted: #9BB0A5;
      --border-gold: rgba(212, 175, 55, 0.25);
      --border-emerald: rgba(35, 77, 58, 0.4);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      line-height: 1.6;
      scroll-behavior: smooth;
    }

    /* Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: var(--bg-dark);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--emerald-light);
      border-radius: 4px;
      border: 1px solid var(--border-gold);
    }

    /* Typography */
    h1, h2, h3, .font-serif {
      font-family: 'Playfair Display', Georgia, serif;
    }
    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }

    /* Container */
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Header Nav */
    header {
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(16px);
      background: rgba(7, 13, 11, 0.85);
      border-bottom: 1px solid var(--border-gold);
      padding: 16px 0;
    }
    .nav-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }
    .brand-badge {
      background: linear-gradient(135deg, var(--gold-primary), var(--gold-dark));
      color: #070D0B;
      font-weight: 800;
      font-size: 13px;
      padding: 4px 10px;
      border-radius: 6px;
      letter-spacing: 0.05em;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 700;
      color: #FFF;
      letter-spacing: -0.02em;
    }
    .nav-links {
      display: flex;
      gap: 20px;
      list-style: none;
      align-items: center;
    }
    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: color 0.2s;
    }
    .nav-links a:hover {
      color: var(--gold-light);
    }
    .btn-print {
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid var(--gold-primary);
      color: var(--gold-light);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-print:hover {
      background: var(--gold-primary);
      color: #070D0B;
    }

    /* Hero Banner */
    .hero {
      padding: 60px 0 40px;
      text-align: center;
      background: radial-gradient(circle at 50% 20%, rgba(35, 77, 58, 0.4) 0%, rgba(7, 13, 11, 0) 70%);
      border-bottom: 1px solid var(--border-emerald);
    }
    .hero-tag {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid var(--border-gold);
      color: var(--gold-light);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 20px;
    }
    .hero h1 {
      font-size: 48px;
      font-weight: 800;
      color: #FFF;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #FFFFFF 40%, var(--gold-light) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero p {
      max-width: 720px;
      margin: 0 auto 30px;
      font-size: 17px;
      color: var(--text-muted);
    }
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-top: 30px;
      flex-wrap: wrap;
    }
    .stat-box {
      background: rgba(19, 42, 32, 0.5);
      border: 1px solid var(--border-emerald);
      padding: 16px 28px;
      border-radius: 12px;
      backdrop-filter: blur(8px);
    }
    .stat-number {
      font-size: 28px;
      font-weight: 800;
      color: var(--gold-primary);
      font-family: 'JetBrains Mono', monospace;
    }
    .stat-label {
      font-size: 12px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Section Styling */
    section {
      padding: 60px 0;
      border-bottom: 1px solid var(--border-emerald);
    }
    .section-header {
      margin-bottom: 36px;
    }
    .section-num {
      color: var(--gold-primary);
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .section-title {
      font-size: 32px;
      font-weight: 700;
      color: #FFF;
      margin-bottom: 10px;
    }
    .section-desc {
      color: var(--text-muted);
      font-size: 15px;
      max-width: 800px;
    }

    /* Cards & Grids */
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 24px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }

    .card {
      background: var(--emerald-card);
      border: 1px solid var(--border-emerald);
      border-radius: 14px;
      padding: 24px;
      transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    }
    .card:hover {
      border-color: var(--gold-primary);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      transform: translateY(-2px);
    }
    .card-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--gold-light);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-body {
      font-size: 14px;
      color: var(--text-muted);
    }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
    }
    .badge-gold {
      background: rgba(212, 175, 55, 0.2);
      color: var(--gold-light);
      border: 1px solid var(--border-gold);
    }
    .badge-emerald {
      background: rgba(35, 77, 58, 0.4);
      color: #A3E635;
      border: 1px solid rgba(163, 230, 53, 0.3);
    }
    .badge-red {
      background: rgba(239, 68, 68, 0.2);
      color: #F87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .badge-blue {
      background: rgba(59, 130, 246, 0.2);
      color: #93C5FD;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    /* Mermaid Diagrams */
    .diagram-container {
      background: #091310;
      border: 1px solid var(--border-gold);
      border-radius: 14px;
      padding: 24px;
      margin: 20px 0;
      overflow-x: auto;
      display: flex;
      justify-content: center;
    }

    /* Tables */
    .table-wrapper {
      overflow-x: auto;
      margin: 20px 0;
      border: 1px solid var(--border-emerald);
      border-radius: 12px;
      background: var(--emerald-dark);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }
    th {
      background: rgba(19, 42, 32, 0.8);
      color: var(--gold-light);
      font-family: 'JetBrains Mono', monospace;
      padding: 14px 18px;
      font-weight: 600;
      border-bottom: 1px solid var(--border-emerald);
    }
    td {
      padding: 12px 18px;
      border-bottom: 1px solid rgba(35, 77, 58, 0.2);
      color: var(--text-muted);
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover td {
      background: rgba(255, 255, 255, 0.02);
      color: #FFF;
    }

    /* Print Styles */
    @media print {
      body {
        background: #FFF !important;
        color: #000 !important;
      }
      header, .btn-print {
        display: none !important;
      }
      .card, .diagram-container {
        border-color: #CCC !important;
        background: #F9F9F9 !important;
        color: #000 !important;
        break-inside: avoid;
      }
      h1, h2, h3, .section-title, .card-title {
        color: #000 !important;
      }
      .stat-number {
        color: #000 !important;
      }
    }
  </style>
</head>
<body>

  <!-- Sticky Header -->
  <header>
    <div class="container nav-wrapper">
      <a href="#" class="brand">
        <span class="brand-badge">አጋፋሪ</span>
        <span class="brand-title">Agafari Visual System Guide</span>
      </a>
      <ul class="nav-links">
        <li><a href="#architecture">Architecture</a></li>
        <li><a href="#roles">Roles</a></li>
        <li><a href="#pages">12 Pages</a></li>
        <li><a href="#dataflow">Data Flow</a></li>
        <li><a href="#rsvp">1-Click RSVP</a></li>
        <li><a href="#api">APIs</a></li>
        <li><a href="#credentials">Credentials</a></li>
      </ul>
      <button class="btn-print" onclick="window.print()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
        Print / PDF
      </button>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <span class="hero-tag">✨ Complete Architectural Blueprint</span>
      <h1>Agafari Wedding Celebration Platform</h1>
      <p>A complete visual reference manual detailing all 12 frontend pages, 16+ API routes, role-based access controls, data models, real-time data flows, and gate scanner verification systems.</p>
      
      <div class="hero-stats">
        <div class="stat-box">
          <div class="stat-number">12</div>
          <div class="stat-label">Frontend Pages</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">16+</div>
          <div class="stat-label">REST API Endpoints</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">6</div>
          <div class="stat-label">User Roles</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">1-Click</div>
          <div class="stat-label">Instant RSVP</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">100%</div>
          <div class="stat-label">Bilingual (EN / አማ)</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 1: System Architecture -->
  <section id="architecture">
    <div class="container">
      <div class="section-header">
        <div class="section-num">Section 01</div>
        <h2 class="section-title">System Architecture & Tech Stack</h2>
        <p class="section-desc">Agafari is constructed on Next.js 14 App Router, combining responsive client-side React rendering with serverless API route handlers and a JWT-secured role management layer.</p>
      </div>

      <div class="diagram-container">
        <pre class="mermaid">
graph TB
    subgraph Client ["Frontend Client (React 18 + Next.js App Router)"]
        Landing["Landing Page (/)"]
        ComingSoon["Celebration Hub (/event/slug)"]
        Feed["TikTok Video Feed (/event/slug/feed)"]
        Live["Live Stream (/event/slug/live)"]
        CoupleDash["Couple Dashboard (/couple/dashboard)"]
        OrgDash["Organizer Dashboard (/organizer/dashboard)"]
        AdminDash["Admin Dashboard (/admin/dashboard)"]
        Scanner["Gate Scanner (/scanner)"]
    end

    subgraph API ["Next.js Serverless Route Handlers"]
        AuthAPI["/api/auth/*"]
        EventAPI["/api/events/[slug]/*"]
        OrgAPI["/api/organizer/*"]
        AdminAPI["/api/admin/*"]
    end

    subgraph Security ["Security & Identity"]
        JWT["HMAC SHA-256 JWT Token"]
        PBKDF2["PBKDF2 Salted Hashing"]
        RBAC["6-Role Access Guard"]
    end

    subgraph DataStore ["Data Layer"]
        MockStore["In-Memory Store (mockData.ts)"]
        Prisma["Prisma ORM (PostgreSQL Ready)"]
    end

    Client --> API
    API --> Security
    API --> DataStore
        </pre>
      </div>

      <div class="grid-3" style="margin-top: 30px;">
        <div class="card">
          <div class="card-title">⚡ Frontend Stack</div>
          <div class="card-body">
            Next.js 14.2.8 with React 18, Tailwind CSS, Framer Motion for smooth physics-based animations, and Lucide React icons.
          </div>
        </div>
        <div class="card">
          <div class="card-title">🔒 Security Engine</div>
          <div class="card-body">
            HMAC SHA-256 JWT tokens with 24-hour expiration, HttpOnly SameSite cookie transmission, and PBKDF2 password salting.
          </div>
        </div>
        <div class="card">
          <div class="card-title">🌐 Internationalization</div>
          <div class="card-body">
            Instant client-side language switching between English and Amharic with Google Ethiopic typography (Noto Serif & Abyssinica SIL).
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 2: Roles & RBAC -->
  <section id="roles">
    <div class="container">
      <div class="section-header">
        <div class="section-num">Section 02</div>
        <h2 class="section-title">User Roles & Access Control (RBAC)</h2>
        <p class="section-desc">Six hierarchical user roles ensure strict security boundaries between guests, couples, agency organizers, field staff, and system administrators.</p>
      </div>

      <div class="diagram-container">
        <pre class="mermaid">
graph LR
    SA["👑 SYSTEM_ADMIN<br/>(Hamelmal Admin)"] -->|"Full Platform Access"| ALL["All Events & Users"]
    EO["🏢 EVENT_ORGANIZER<br/>(Agency Planner)"] -->|"Multi-Event Scope"| ORG_SCOPE["Onboard Events & Moderation"]
    BG["👰 BRIDE_GROOM<br/>(Wedding Couple)"] -->|"Single Event Scope"| COUPLE_SCOPE["Own Invites, Media & Team"]
    LS["📹 LIVE_STREAMER<br/>(Broadcast Operator)"] -->|"Stream Control"| STREAM_SCOPE["Live Broadcast Page"]
    GS["🔍 GATE_SCANNER<br/>(Gate Security)"] -->|"Verification Scope"| SCANNER_SCOPE["QR Pass Check-In"]
    GU["👤 GUEST<br/>(Invited Family & Friends)"] -->|"Public View"| GUEST_SCOPE["Hub, Feed, Wishes & RSVP"]
        </pre>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Login URL</th>
              <th>Scope</th>
              <th>Permissions Summary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="badge badge-gold">SYSTEM_ADMIN</span></td>
              <td><code>/admin/login</code></td>
              <td>Global Platform</td>
              <td>Full CRUD on all events, users, approvals, live status toggle, and media vault</td>
            </tr>
            <tr>
              <td><span class="badge badge-emerald">EVENT_ORGANIZER</span></td>
              <td><code>/organizer/login</code></td>
              <td>Agency Portfolio</td>
              <td>Onboard new weddings, view role credentials, moderate wishes and videos across events</td>
            </tr>
            <tr>
              <td><span class="badge badge-blue">BRIDE_GROOM</span></td>
              <td><code>/couple/login</code></td>
              <td>Own Event Only</td>
              <td>Edit event settings, generate QR invitations, moderate wishes/media, assign field team</td>
            </tr>
            <tr>
              <td><span class="badge badge-gold">LIVE_STREAMER</span></td>
              <td>Direct Stream Link</td>
              <td>Own Event Broadcast</td>
              <td>Broadcast YouTube live stream feed and view real-time audience engagement</td>
            </tr>
            <tr>
              <td><span class="badge badge-emerald">GATE_SCANNER</span></td>
              <td><code>/scanner</code></td>
              <td>Gate Security</td>
              <td>Scan and verify QR passes, validate headcount quotas, prevent duplicate entries</td>
            </tr>
            <tr>
              <td><span class="badge badge-blue">GUEST</span></td>
              <td><code>/event/[slug]</code></td>
              <td>Public Invitation</td>
              <td>View countdown, 1-click RSVP, send blessings, suggest songs, watch live stream & feed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Section 3: 12 Page Map -->
  <section id="pages">
    <div class="container">
      <div class="section-header">
        <div class="section-num">Section 03</div>
        <h2 class="section-title">Complete 12-Page Map & Visual Layouts</h2>
        <p class="section-desc">Every page in the platform serves a specific role in the wedding lifecycle.</p>
      </div>

      <div class="grid-2">

        <!-- Page 1 -->
        <div class="card">
          <div class="card-title">
            <span class="badge badge-gold">01</span> Landing Page
          </div>
          <p class="badge badge-blue" style="margin-bottom: 12px;">Route: /</p>
          <div class="card-body">
            Full marketing portal with Hero banner, 3 Feature showcase cards (Countdown, TikTok Feed, QR Pass), Pricing packages, Live Simulator, and mobile scroll-spy bottom navigation.
          </div>
        </div>

        <!-- Page 2 -->
        <div class="card">
          <div class="card-title">
            <span class="badge badge-gold">02</span> Celebration Hub (Coming Soon)
          </div>
          <p class="badge badge-blue" style="margin-bottom: 12px;">Route: /event/[slug]</p>
          <div class="card-body">
            The core guest destination. Features real-time countdown timer, venue map, personalized QR card pass, Wish Wall with instant submission, song request form, and 1-Click RSVP popup.
          </div>
        </div>

        <!-- Page 3 -->
        <div class="card">
          <div class="card-title">
            <span class="badge badge-gold">03</span> TikTok Memory Feed
          </div>
          <p class="badge badge-blue" style="margin-bottom: 12px;">Route: /event/[slug]/feed</p>
          <div class="card-body">
            Snap-scrolling vertical video reel feed with top navigation tabs (Wishes, Behind the Scenes, Live), double-tap heart animations, slide-up comments drawer, and video upload modal.
          </div>
        </div>

        <!-- Page 4 -->
        <div class="card">
          <div class="card-title">
            <span class="badge badge-gold">04</span> Live Ceremony Stream
          </div>
          <p class="badge badge-blue" style="margin-bottom: 12px;">Route: /event/[slug]/live</p>
          <div class="card-body">
            Full-screen YouTube Live embed with live pulsing broadcast badge, simulated real-time viewer fluctuations, and interactive floating emoji reactions.
          </div>
        </div>

        <!-- Page 5 -->
        <div class="card">
          <div class="card-title">
            <span class="badge badge-gold">05</span> QR Gate Scanner
          </div>
          <p class="badge badge-blue" style="margin-bottom: 12px;">Route: /scanner</p>
          <div class="card-body">
            Field tool for security guards. Scans or looks up invitation codes, validates headcount quotas (e.g., 2 guests), detects duplicate entries, and confirms check-in.
          </div>
        </div>

        <!-- Page 6 -->
        <div class="card">
          <div class="card-title">
            <span class="badge badge-gold">06</span> Couple Dashboard
          </div>
          <p class="badge badge-blue" style="margin-bottom: 12px;">Route: /couple/dashboard</p>
          <div class="card-body">
            The bride & groom's command center. Manage event details, generate custom guest QR invitations with headcount quotas, moderate wishes, approve video reels, and assign field staff.
          </div>
        </div>

        <!-- Page 7 -->
        <div class="card">
          <div class="card-title">
            <span class="badge badge-gold">07</span> Organizer Dashboard
          </div>
          <p class="badge badge-blue" style="margin-bottom: 12px;">Route: /organizer/dashboard</p>
          <div class="card-body">
            Agency management portal. Onboard new weddings, manage credentials for all assigned couples, monitor admin approval statuses, and oversee media moderation across multiple events.
          </div>
        </div>

        <!-- Page 8 -->
        <div class="card">
          <div class="card-title">
            <span class="badge badge-gold">08</span> System Admin Dashboard
          </div>
          <p class="badge badge-blue" style="margin-bottom: 12px;">Route: /admin/dashboard</p>
          <div class="card-body">
            God-mode control room. Approve or reject pending weddings, toggle live broadcast status, manage all system user accounts and passwords, and oversee platform-wide media vaults.
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Section 4: End-to-End Data Flow -->
  <section id="dataflow">
    <div class="container">
      <div class="section-header">
        <div class="section-num">Section 04</div>
        <h2 class="section-title">End-to-End Wedding Data Lifecycle</h2>
        <p class="section-desc">Visualizing how data flows from event onboarding all the way through wedding day live streaming and post-event archiving.</p>
      </div>

      <div class="diagram-container">
        <pre class="mermaid">
sequenceDiagram
    autonumber
    actor Org as 🏢 Event Organizer
    actor Admin as 👑 System Admin
    actor Couple as 👰 Bride & Groom
    actor Guest as 👤 Guest
    actor Scanner as 🔍 Gate Scanner

    Note over Org,Admin: Phase 1: Onboarding & Approval
    Org->>Admin: POST /api/organizer/events (Submit new wedding)
    Admin->>Admin: Review & PATCH /api/admin/events (Status: APPROVED)
    Admin-->>Couple: Issue credentials (email + password)

    Note over Couple,Guest: Phase 2: Invitations & Engagement
    Couple->>Couple: Login -> /couple/dashboard
    Couple->>Couple: Generate QR invitations (Headcount quota)
    Couple-->>Guest: Distribute unique link (/event/slug?code=INV-XXX)
    Guest->>Guest: Open Hub -> 1-Click Instant RSVP (Yes/Maybe/No)
    Guest->>Guest: Submit text/video blessings -> Wish Wall

    Note over Couple,Scanner: Phase 3: Wedding Day Execution
    Admin->>Admin: Toggle Live Broadcast (isLive: true)
    Guest->>Guest: Watch Live Ceremony (/event/slug/live)
    Guest->>Guest: Upload video memories to TikTok Feed
    Scanner->>Scanner: Scan guest QR code at gate
    Scanner->>Scanner: Confirm check-in (Update scannedCount)

    Note over Couple,Admin: Phase 4: Archive
    Admin->>Admin: Mark event COMPLETED
        </pre>
      </div>
    </div>
  </section>

  <!-- Section 5: 1-Click RSVP Flow -->
  <section id="rsvp">
    <div class="container">
      <div class="section-header">
        <div class="section-num">Section 05</div>
        <h2 class="section-title">1-Click Instant RSVP Mechanism</h2>
        <p class="section-desc">The RSVP system is engineered for zero friction: the modal automatically appears 5 seconds after page load, requiring only a single tap to record the response immediately.</p>
      </div>

      <div class="diagram-container">
        <pre class="mermaid">
flowchart TD
    A["Guest Opens /event/[slug]"] --> B["Page loads event details & wish wall"]
    B --> C{"5-Second Timer Fires"}
    C --> D["RSVP Modal Emerges with 3 Choices"]
    
    D --> E["Choice 1: YES 🥂<br/>(Attending Confirmed)"]
    D --> F["Choice 2: MAYBE 🤔<br/>(Undecided)"]
    D --> G["Choice 3: NO 💔<br/>(Declined with Wishes)"]

    E --> H["Instant POST /api/events/[slug]/rsvp"]
    F --> H
    G --> H

    H --> I["Display Checkmark Confirmation Banner"]
    I --> J["Auto-dismiss Modal after 1.8 seconds"]
    J --> K["Update Guest Status in Couple Dashboard"]
        </pre>
      </div>

      <div class="grid-3" style="margin-top: 24px;">
        <div class="card" style="border-color: rgba(212, 175, 55, 0.5);">
          <div class="card-title">🥂 Choice 1: YES</div>
          <div class="card-body">
            Saves status as <code>ATTENDING</code>. Confirms guest headcount and marks the invitation as confirmed on the couple's live dashboard.
          </div>
        </div>
        <div class="card" style="border-color: rgba(245, 158, 11, 0.5);">
          <div class="card-title">🤔 Choice 2: MAYBE</div>
          <div class="card-body">
            Saves status as <code>MAYBE</code>. Acknowledges response while allowing the guest to adjust their decision later before final catering lock.
          </div>
        </div>
        <div class="card" style="border-color: rgba(239, 68, 68, 0.5);">
          <div class="card-title">💔 Choice 3: NO</div>
          <div class="card-body">
            Saves status as <code>DECLINED</code>. Politely records non-attendance while inviting the guest to send their blessings on the Wish Wall.
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 6: QR Gate Scanner Flow -->
  <section id="scanner">
    <div class="container">
      <div class="section-header">
        <div class="section-num">Section 06</div>
        <h2 class="section-title">QR Gate Verification Flow</h2>
        <p class="section-desc">The gate scanner system ensures venue security by validating unique invitation codes, tracking headcount quotas, and blocking duplicate entry attempts.</p>
      </div>

      <div class="diagram-container">
        <pre class="mermaid">
flowchart TD
    A["Security Staff Opens /scanner"] --> B["Input / Scan QR Code (INV-SD2026-XXX)"]
    B --> C{"Verify Code in Database"}

    C -->|"Valid & Unscanned"| D["🟢 VALID PASS<br/>Show Guest Name & Quota (e.g. 2 Heads)"]
    C -->|"Already Used"| E["🟡 ALREADY SCANNED<br/>Show Timestamp & Warning"]
    C -->|"Unknown Code"| F["🔴 INVALID PASS<br/>Show Access Denied Alert"]

    D --> G["Staff Selects Headcount & Taps 'Check In'"]
    G --> H["Update scannedCount & Set isScanned = true"]
    H --> I["Display Success Checkmark & Reset for Next Guest"]
        </pre>
      </div>
    </div>
  </section>

  <!-- Section 7: API Route Reference -->
  <section id="api">
    <div class="container">
      <div class="section-header">
        <div class="section-num">Section 07</div>
        <h2 class="section-title">API Route Reference (16+ Endpoints)</h2>
        <p class="section-desc">Complete specification of all REST endpoints implemented across authentication, public event hubs, organizer tools, and system administration.</p>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Description</th>
              <th>Auth Required</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="badge badge-gold">POST</span></td>
              <td><code>/api/auth/login</code></td>
              <td>Authenticate user with email & password; issue JWT cookie</td>
              <td>Public</td>
            </tr>
            <tr>
              <td><span class="badge badge-emerald">GET</span></td>
              <td><code>/api/auth/me</code></td>
              <td>Retrieve profile of the currently logged-in user</td>
              <td>JWT Token</td>
            </tr>
            <tr>
              <td><span class="badge badge-emerald">GET</span></td>
              <td><code>/api/events/[slug]</code></td>
              <td>Fetch public wedding event metadata, venue, and playlist</td>
              <td>Public</td>
            </tr>
            <tr>
              <td><span class="badge badge-gold">PUT</span></td>
              <td><code>/api/events/[slug]</code></td>
              <td>Update wedding details (bride/groom names, date, venue, dress code)</td>
              <td>Couple / Admin</td>
            </tr>
            <tr>
              <td><span class="badge badge-emerald">GET</span></td>
              <td><code>/api/events/[slug]/wishes</code></td>
              <td>Fetch approved guest blessings for the public Wish Wall</td>
              <td>Public</td>
            </tr>
            <tr>
              <td><span class="badge badge-gold">POST</span></td>
              <td><code>/api/events/[slug]/wishes</code></td>
              <td>Submit a new text or video blessing from a guest</td>
              <td>Public</td>
            </tr>
            <tr>
              <td><span class="badge badge-emerald">GET</span></td>
              <td><code>/api/events/[slug]/media</code></td>
              <td>Fetch approved video reel memories for the TikTok feed</td>
              <td>Public</td>
            </tr>
            <tr>
              <td><span class="badge badge-gold">POST</span></td>
              <td><code>/api/events/[slug]/media</code></td>
              <td>Upload a new memory reel (Wishes, BTS, Live clips)</td>
              <td>Public</td>
            </tr>
            <tr>
              <td><span class="badge badge-gold">POST</span></td>
              <td><code>/api/events/[slug]/rsvp</code></td>
              <td>1-Click instant RSVP submission (Yes / Maybe / No)</td>
              <td>Public</td>
            </tr>
            <tr>
              <td><span class="badge badge-emerald">GET</span></td>
              <td><code>/api/events/[slug]/invitations</code></td>
              <td>List all generated guest invitations and scan statuses</td>
              <td>Couple / Org</td>
            </tr>
            <tr>
              <td><span class="badge badge-gold">POST</span></td>
              <td><code>/api/events/[slug]/invitations</code></td>
              <td>Generate a unique invitation QR pass with headcount quota</td>
              <td>Couple / Org</td>
            </tr>
            <tr>
              <td><span class="badge badge-gold">POST</span></td>
              <td><code>/api/events/[slug]/team</code></td>
              <td>Assign a new Live Streamer or Gate Scanner staff member</td>
              <td>Couple / Org</td>
            </tr>
            <tr>
              <td><span class="badge badge-red">DELETE</span></td>
              <td><code>/api/events/[slug]/team</code></td>
              <td>Remove an assigned field staff member</td>
              <td>Couple / Org</td>
            </tr>
            <tr>
              <td><span class="badge badge-emerald">GET</span></td>
              <td><code>/api/organizer/events</code></td>
              <td>Fetch all weddings under organizer agency with credentials</td>
              <td>Organizer</td>
            </tr>
            <tr>
              <td><span class="badge badge-gold">POST</span></td>
              <td><code>/api/organizer/events</code></td>
              <td>Onboard a new wedding event for admin approval</td>
              <td>Organizer</td>
            </tr>
            <tr>
              <td><span class="badge badge-emerald">GET</span></td>
              <td><code>/api/admin/events</code></td>
              <td>Master list of all platform weddings with full credentials</td>
              <td>System Admin</td>
            </tr>
            <tr>
              <td><span class="badge badge-gold">PATCH</span></td>
              <td><code>/api/admin/events</code></td>
              <td>Approve/reject weddings, toggle live broadcast status</td>
              <td>System Admin</td>
            </tr>
            <tr>
              <td><span class="badge badge-emerald">GET</span></td>
              <td><code>/api/admin/users</code></td>
              <td>List all user accounts across the entire platform</td>
              <td>System Admin</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Section 8: Demo Credentials -->
  <section id="credentials">
    <div class="container">
      <div class="section-header">
        <div class="section-num">Section 08</div>
        <h2 class="section-title">Demo Testing Credentials & Quick Links</h2>
        <p class="section-desc">Pre-configured accounts and links for testing each role and feature locally.</p>
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="card-title">👑 System Admin</div>
          <div class="card-body">
            <p><strong>Login:</strong> <a href="/admin/login" style="color:var(--gold-light);">/admin/login</a></p>
            <p><strong>Email:</strong> <code>admin@hamelmal.com</code></p>
            <p><strong>Password:</strong> <code>admin123</code></p>
          </div>
        </div>

        <div class="card">
          <div class="card-title">🏢 Event Organizer</div>
          <div class="card-body">
            <p><strong>Login:</strong> <a href="/organizer/login" style="color:var(--gold-light);">/organizer/login</a></p>
            <p><strong>Email:</strong> <code>organizer@sara-dawit.com</code></p>
            <p><strong>Password:</strong> <code>org123</code></p>
          </div>
        </div>

        <div class="card">
          <div class="card-title">👰 Couple (Sara & Dawit)</div>
          <div class="card-body">
            <p><strong>Login:</strong> <a href="/couple/login" style="color:var(--gold-light);">/couple/login</a></p>
            <p><strong>Email:</strong> <code>couple@sara-dawit.com</code></p>
            <p><strong>Password:</strong> <code>couple123</code></p>
          </div>
        </div>
      </div>

      <div class="table-wrapper" style="margin-top: 30px;">
        <table>
          <thead>
            <tr>
              <th>Feature Demo</th>
              <th>Test URL</th>
              <th>Key Testing Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Coming Soon Hub</td>
              <td><code>http://localhost:3001/event/sara-and-dawit-2026</code></td>
              <td>Wait 5s for 1-Click RSVP popup; submit a wish to Wish Wall</td>
            </tr>
            <tr>
              <td>Personalized QR Pass</td>
              <td><code>http://localhost:3001/event/sara-and-dawit-2026?code=INV-SD2026-001</code></td>
              <td>View Abebe Kebede's VIP pass and share button</td>
            </tr>
            <tr>
              <td>TikTok Memory Feed</td>
              <td><code>http://localhost:3001/event/sara-and-dawit-2026/feed</code></td>
              <td>Switch Wishes/BTS/Live tabs; like videos; upload moment</td>
            </tr>
            <tr>
              <td>Live Ceremony Stream</td>
              <td><code>http://localhost:3001/event/sara-and-dawit-2026/live</code></td>
              <td>Watch YouTube live embed; tap floating reaction emojis</td>
            </tr>
            <tr>
              <td>QR Gate Scanner</td>
              <td><code>http://localhost:3001/scanner</code></td>
              <td>Verify <code>INV-SD2026-001</code> (valid) vs <code>INV-SD2026-002</code> (used)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer style="padding: 40px 0; text-align: center; border-top: 1px solid var(--border-emerald); color: var(--text-muted); font-size: 13px;">
    <div class="container">
      <p style="margin-bottom: 8px;"><strong>Agafari (አጋፋሪ)</strong> — Ethiopian Wedding Digital Celebration Platform</p>
      <p>Architected and Developed by <strong>Hamelmal Creatives</strong> · Version 1.0.0 (August 2026)</p>
    </div>
  </footer>

</body>
</html>

```

### File: `frontend/public/presentation.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agafari — Smart Digital Wedding Celebration Platform (Client Presentation)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --gold: #D4AF37;
      --gold-light: #F3E5AB;
      --gold-dark: #997A15;
      --emerald-dark: #07120D;
      --emerald-card: #10261D;
      --emerald-border: #1E4535;
      --text: #F5F7F6;
      --muted: #A3B8AD;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--emerald-dark);
      color: var(--text);
      line-height: 1.6;
    }
    .container { max-width: 1140px; margin: 0 auto; padding: 0 24px; }
    
    /* Header */
    header {
      background: rgba(7, 18, 13, 0.95);
      border-bottom: 1px solid var(--emerald-border);
      padding: 16px 0;
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(10px);
    }
    .nav { display: flex; justify-content: space-between; align-items: center; }
    .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .badge-gold {
      background: linear-gradient(135deg, var(--gold), var(--gold-dark));
      color: #07120D;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      letter-spacing: 0.05em;
    }
    .brand-title { font-size: 20px; font-weight: 700; color: #FFF; font-family: 'Playfair Display', serif; }
    .btn-pdf {
      background: var(--gold);
      color: #07120D;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: transform 0.2s, background 0.2s;
    }
    .btn-pdf:hover { background: var(--gold-light); transform: scale(1.02); }

    /* Hero */
    .hero {
      text-align: center;
      padding: 70px 0 50px;
      background: radial-gradient(circle at 50% 10%, rgba(212, 175, 55, 0.15) 0%, rgba(7, 18, 13, 0) 70%);
      border-bottom: 1px solid var(--emerald-border);
    }
    .tag {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      background: rgba(212, 175, 55, 0.12);
      border: 1px solid rgba(212, 175, 55, 0.3);
      color: var(--gold-light);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 16px;
    }
    .hero h1 {
      font-size: 46px;
      font-family: 'Playfair Display', serif;
      color: #FFF;
      margin-bottom: 16px;
      line-height: 1.2;
    }
    .hero h1 span {
      background: linear-gradient(135deg, #FFF 30%, var(--gold-light) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero p {
      max-width: 680px;
      margin: 0 auto 30px;
      font-size: 16px;
      color: var(--muted);
    }

    /* Pillars Grid */
    .section-title {
      font-size: 28px;
      font-family: 'Playfair Display', serif;
      color: #FFF;
      margin-bottom: 8px;
      text-align: center;
    }
    .section-desc {
      text-align: center;
      color: var(--muted);
      font-size: 14px;
      max-width: 600px;
      margin: 0 auto 36px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 60px;
    }
    .pillar-card {
      background: var(--emerald-card);
      border: 1px solid var(--emerald-border);
      border-radius: 14px;
      padding: 24px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;
    }
    .pillar-card:hover {
      border-color: var(--gold);
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.5);
    }
    .pillar-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }
    .pillar-title {
      font-size: 17px;
      font-weight: 700;
      color: var(--gold-light);
      margin-bottom: 8px;
    }
    .pillar-text {
      font-size: 13px;
      color: var(--muted);
      line-height: 1.5;
    }

    /* Screen Walkthrough Showcase */
    .screen-row {
      display: flex;
      align-items: center;
      gap: 36px;
      margin-bottom: 50px;
      background: var(--emerald-card);
      border: 1px solid var(--emerald-border);
      border-radius: 16px;
      padding: 32px;
    }
    .screen-row.reverse { flex-direction: row-reverse; }
    .screen-info { flex: 1; }
    .screen-info h3 {
      font-size: 22px;
      font-family: 'Playfair Display', serif;
      color: #FFF;
      margin-bottom: 8px;
    }
    .screen-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 4px;
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid rgba(212, 175, 55, 0.3);
      color: var(--gold-light);
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .screen-features {
      list-style: none;
      margin-top: 14px;
    }
    .screen-features li {
      font-size: 13px;
      color: var(--muted);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .screen-features li span { color: var(--gold); font-weight: bold; }
    .screen-visual {
      flex: 1;
      background: #060E0A;
      border: 1px solid var(--gold);
      border-radius: 12px;
      padding: 20px;
      font-family: monospace;
      font-size: 12px;
      color: #A3E635;
      box-shadow: 0 10px 25px rgba(0,0,0,0.6);
    }

    /* Comparison Table */
    .table-box {
      background: var(--emerald-card);
      border: 1px solid var(--emerald-border);
      border-radius: 14px;
      overflow: hidden;
      margin: 40px 0 60px;
    }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th {
      background: #0B1C15;
      color: var(--gold-light);
      padding: 16px 20px;
      font-weight: 700;
      border-bottom: 1px solid var(--emerald-border);
    }
    td {
      padding: 14px 20px;
      border-bottom: 1px solid rgba(30, 69, 53, 0.4);
      color: var(--muted);
    }
    tr:hover td { background: rgba(255,255,255,0.02); color: #FFF; }

    /* Packages */
    .packages-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 60px;
    }
    .pkg-card {
      background: var(--emerald-card);
      border: 1px solid var(--emerald-border);
      border-radius: 16px;
      padding: 30px;
      text-align: center;
      position: relative;
    }
    .pkg-card.featured {
      border-color: var(--gold);
      background: linear-gradient(180deg, #163629 0%, #0F241A 100%);
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.15);
    }
    .pkg-tag {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--gold);
      color: #07120D;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 12px;
      border-radius: 12px;
      text-transform: uppercase;
    }
    .pkg-name { font-size: 20px; font-weight: 700; color: #FFF; margin-bottom: 6px; }
    .pkg-subtitle { font-size: 12px; color: var(--muted); margin-bottom: 20px; }
    .pkg-list { list-style: none; text-align: left; margin: 20px 0; font-size: 13px; color: var(--muted); }
    .pkg-list li { margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
    .pkg-list li::before { content: "✓"; color: var(--gold); font-weight: bold; }

    /* Footer */
    footer {
      background: #050B08;
      border-top: 1px solid var(--emerald-border);
      padding: 30px 0;
      text-align: center;
      font-size: 13px;
      color: var(--muted);
    }

    @media (max-width: 768px) {
      .screen-row, .screen-row.reverse { flex-direction: column; }
      .hero h1 { font-size: 32px; }
    }

    @media print {
      header, .btn-pdf { display: none !important; }
      body { background: #FFF !important; color: #000 !important; }
      .pillar-card, .screen-row, .pkg-card, .table-box {
        background: #F9F9F9 !important;
        border-color: #DDD !important;
        color: #000 !important;
        break-inside: avoid;
      }
      .hero h1, .section-title, .screen-info h3, .pkg-name { color: #000 !important; }
      .hero h1 span { -webkit-text-fill-color: #000 !important; }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header>
    <div class="container nav">
      <a href="#" class="brand">
        <span class="badge-gold">አጋፋሪ</span>
        <span class="brand-title">Agafari Platform</span>
      </a>
      <button class="btn-pdf" onclick="window.print()">
        🖨️ Export Proposal (PDF)
      </button>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <span class="tag">Digital Wedding Ecosystem</span>
      <h1>Elevate Your Wedding With <span>Agafari</span></h1>
      <p>The premier smart wedding platform combining real-time digital RSVP, instant QR gate verification, TikTok-style memory reels, and HD global ceremony streaming.</p>
    </div>
  </section>

  <!-- 4 Pillars Section -->
  <section style="padding: 60px 0 20px;">
    <div class="container">
      <h2 class="section-title">The 4 Core Pillars of Agafari</h2>
      <p class="section-desc">Designed to eliminate wedding planning chaos, delight guests, and preserve memories forever.</p>

      <div class="grid-4">
        <div class="pillar-card">
          <div class="pillar-icon">🎟️</div>
          <div class="pillar-title">1-Click RSVP & QR Pass</div>
          <div class="pillar-text">Unique digital invitation card with an instant 1-click popup (Yes / Maybe / No). Real-time headcounts prevent catering waste.</div>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon">⏳</div>
          <div class="pillar-title">Coming Soon Hub</div>
          <div class="pillar-text">Personalized couple website featuring a live countdown, venue Google Maps, dress code guidance, and an interactive Wish Wall.</div>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon">🎬</div>
          <div class="pillar-title">TikTok Memory Feed</div>
          <div class="pillar-text">Vertical video reels feed allowing guests and bridal party to upload authentic moments, wishes, and dance practice clips in real time.</div>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon">📡</div>
          <div class="pillar-title">Global Live Stream</div>
          <div class="pillar-text">HD live broadcast with real-time emoji reactions, connecting diaspora relatives in the USA, Europe, and Canada seamlessly.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Screen by Screen Showcase -->
  <section style="padding: 20px 0 60px;">
    <div class="container">
      <h2 class="section-title">System Walkthrough & Client Experience</h2>
      <p class="section-desc">A step-by-step look at what your guests, couple, and venue security will experience.</p>

      <!-- Screen 1 -->
      <div class="screen-row">
        <div class="screen-info">
          <span class="screen-badge">GUEST DESTINATION</span>
          <h3>1. Coming Soon Celebration Hub</h3>
          <p style="color: var(--muted); font-size: 14px;">The central web link sent to all invited family and friends.</p>
          <ul class="screen-features">
            <li><span>✓</span> <strong>Real-Time Countdown:</strong> Days, hours, minutes, seconds to wedding.</li>
            <li><span>✓</span> <strong>Instant 1-Click RSVP:</strong> Modal appears after 5s — one tap submits attendance.</li>
            <li><span>✓</span> <strong>Personalized QR Card:</strong> Shows guest name and allowed headcount quota.</li>
            <li><span>✓</span> <strong>Interactive Wish Wall:</strong> Guests submit text and video blessings.</li>
          </ul>
        </div>
        <div class="screen-visual">
          [ 👑 SARA & DAWIT'S ROYAL WEDDING ]<br/>
          ⏳ Countdown: 14d : 06h : 22m : 18s<br/>
          📍 Venue: Sheraton Addis Grand Ballroom<br/>
          ---------------------------------------<br/>
          🎟️ PASS: Abebe Kebede (Quota: 2 Heads)<br/>
          [ ■■■■■ SECURE QR CODE ■■■■■ ]<br/>
          ---------------------------------------<br/>
          💌 "Congratulations Sara & Dawit! ✨"
        </div>
      </div>

      <!-- Screen 2 -->
      <div class="screen-row reverse">
        <div class="screen-info">
          <span class="screen-badge">MEMORY REELS</span>
          <h3>2. TikTok-Style Wedding Moments Feed</h3>
          <p style="color: var(--muted); font-size: 14px;">Vertical video reel feed that captures the wedding from 200+ guest angles.</p>
          <ul class="screen-features">
            <li><span>✓</span> <strong>3 Smart Tabs:</strong> Wishes, Behind-the-Scenes, and Live Clips.</li>
            <li><span>✓</span> <strong>Double-Tap Reactions:</strong> Heart bursts and comment drawer.</li>
            <li><span>✓</span> <strong>1-Tap Guest Upload:</strong> Anyone can record and post moments.</li>
          </ul>
        </div>
        <div class="screen-visual">
          [ LIVE 🔴 ] Wishes | Behind Scenes | Live<br/>
          =======================================<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ FULL SCREEN ]<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VERTICAL VIDEO REEL<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(❤️) 192 Likes<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(💬) 24 Comments<br/>
          =======================================<br/>
          💍 Eskista dance rehearsal! [ + Upload ]
        </div>
      </div>

      <!-- Screen 3 -->
      <div class="screen-row">
        <div class="screen-info">
          <span class="screen-badge">VENUE SECURITY</span>
          <h3>3. QR Gate Security Scanner</h3>
          <p style="color: var(--muted); font-size: 14px;">Mobile door verification used by security guards and ushers.</p>
          <ul class="screen-features">
            <li><span>✓</span> <strong>Instant Verification:</strong> Validates guest name and headcount quota in 2 seconds.</li>
            <li><span>✓</span> <strong>Anti-Counterfeit Protection:</strong> Warns guards if a QR code is scanned twice.</li>
            <li><span>✓</span> <strong>Fast Headcount Check-In:</strong> Tap "Check In 1" or "Check In 2" button.</li>
          </ul>
        </div>
        <div class="screen-visual">
          🔍 AGAFARI GATE VERIFICATION SCANNER<br/>
          Code: INV-SD2026-001 [ VERIFY ]<br/>
          ---------------------------------------<br/>
          ✅ VALID PASS: Abebe Kebede & Guest<br/>
          Quota: 2 Heads (0/2 Checked In)<br/>
          Seating: Table 1 - VIP Family<br/>
          ---------------------------------------<br/>
          [ CHECK IN 1 GUEST ] [ CHECK IN 2 GUESTS ]
        </div>
      </div>

      <!-- Screen 4 -->
      <div class="screen-row reverse">
        <div class="screen-info">
          <span class="screen-badge">COUPLE COMMAND CENTER</span>
          <h3>4. Couple Management Dashboard</h3>
          <p style="color: var(--muted); font-size: 14px;">The bride & groom's private dashboard to manage their entire wedding.</p>
          <ul class="screen-features">
            <li><span>✓</span> <strong>Real-Time RSVP Tracker:</strong> Live count of attending vs declined guests.</li>
            <li><span>✓</span> <strong>Custom QR Pass Generator:</strong> Create unique passes in seconds.</li>
            <li><span>✓</span> <strong>Content Moderation:</strong> Approve wishes and videos before public view.</li>
            <li><span>✓</span> <strong>Staff Accounts:</strong> Assign logins for gate security and videographers.</li>
          </ul>
        </div>
        <div class="screen-visual">
          👰 SARA & DAWIT DASHBOARD<br/>
          Total Invites: 250 | Confirmed: 210 | Declined: 15<br/>
          ---------------------------------------<br/>
          [ + Generate New Guest Invitation Pass ]<br/>
          • Dr. Michael (London) - 1 Guest [LINK COPIED]<br/>
          • Sara Bekele - 2 Guests [PENDING RSVP]<br/>
          ---------------------------------------<br/>
          👥 Assigned Staff: Gate Scanner Alpha (Active)
        </div>
      </div>

    </div>
  </section>

  <!-- Comparison Section -->
  <section style="padding: 20px 0 60px;">
    <div class="container">
      <h2 class="section-title">Why Traditional Weddings Switch to Agafari</h2>
      <p class="section-desc">A direct comparison between old paper methods and the smart digital platform.</p>

      <div class="table-box">
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Traditional Wedding</th>
              <th>With Agafari Platform</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Guest Invitations</strong></td>
              <td>Expensive paper printing; manual physical distribution</td>
              <td>Instant personalized QR cards via Telegram, WhatsApp, or SMS</td>
            </tr>
            <tr>
              <td><strong>RSVP Headcount</strong></td>
              <td>Uncertain headcounts; 30-40% food & seat wastage</td>
              <td>Exact real-time attendance numbers with 1-Click RSVP</td>
            </tr>
            <tr>
              <td><strong>Gate Security</strong></td>
              <td>Paper lists; slow entry lines; gate crashing</td>
              <td>2-second QR scan; headcount quota enforcement</td>
            </tr>
            <tr>
              <td><strong>Diaspora Family</strong></td>
              <td>Unstable personal phone video calls</td>
              <td>Broadcast-quality HD stream with live floating reactions</td>
            </tr>
            <tr>
              <td><strong>Guest Photos & Videos</strong></td>
              <td>Scattered on 100+ guest phones; couple loses 80%</td>
              <td>Centralized TikTok-style memory reel vault</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Pricing Packages Section -->
  <section style="padding: 20px 0 80px;">
    <div class="container">
      <h2 class="section-title">Packages & Deliverables</h2>
      <p class="section-desc">Tailored service tiers to fit intimate celebrations and royal grand weddings.</p>

      <div class="packages-grid">
        <div class="pkg-card">
          <div class="pkg-name">Silver Package</div>
          <div class="pkg-subtitle">Essential Digital Wedding</div>
          <ul class="pkg-list">
            <li>Coming Soon Celebration Web Hub</li>
            <li>Live Countdown Timer</li>
            <li>1-Click Instant RSVP System</li>
            <li>Up to 200 Unique QR Passes</li>
            <li>Interactive Digital Wish Wall</li>
            <li>Couple Management Dashboard</li>
            <li>3 Months Cloud Hosting</li>
          </ul>
        </div>

        <div class="pkg-card featured">
          <span class="pkg-tag">Most Popular</span>
          <div class="pkg-name">Gold Package</div>
          <div class="pkg-subtitle">Complete Digital Experience</div>
          <ul class="pkg-list">
            <li>Everything in Silver Package</li>
            <li>TikTok-Style Memory Reel Feed</li>
            <li>Guest Video Blessing Uploads</li>
            <li>Up to 500 Unique QR Passes</li>
            <li>Gate Security Scanner Account</li>
            <li>Mezmur & Song Recommendation Hub</li>
            <li>6 Months Cloud Hosting</li>
          </ul>
        </div>

        <div class="pkg-card">
          <div class="pkg-name">Diamond Package</div>
          <div class="pkg-subtitle">Royal VIP Luxury Experience</div>
          <ul class="pkg-list">
            <li>Everything in Gold Package</li>
            <li>Dedicated HD Live Ceremony Stream</li>
            <li>Custom Wedding Domain (e.g. sara-dawit.com)</li>
            <li>Unlimited Unique QR Passes</li>
            <li>3 Gate Scanner Security Accounts</li>
            <li>Lifetime Memory Reel Archive Vault</li>
            <li>1 Year VIP Hosting & Priority Support</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="container">
      <p style="margin-bottom: 6px;"><strong>Agafari (አጋፋሪ)</strong> — Smart Digital Wedding Celebration Platform</p>
      <p>Built with pride by <strong>Hamelmal Creatives</strong> · Proposal & System Manual 2026</p>
    </div>
  </footer>

</body>
</html>

```

### File: `frontend/public/shareable-guide.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agafari — Master System Guide & Client Proposal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Playfair+Display:ital,wght@0,600;0,800;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#0B1C15',
        primaryColor: '#1A3D2F',
        primaryTextColor: '#F5E6BE',
        primaryBorderColor: '#D4AF37',
        lineColor: '#D4AF37',
        secondaryColor: '#122B21',
        tertiaryColor: '#07120D'
      }
    });
  </script>
  <style>
    :root {
      --gold: #D4AF37;
      --gold-light: #F5E6BE;
      --gold-dark: #997A15;
      --bg-dark: #07120D;
      --card-bg: #0F271D;
      --card-border: #1B4533;
      --text: #F5F7F6;
      --text-muted: #A3B8AD;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg-dark);
      color: var(--text);
      line-height: 1.65;
    }
    .container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
    
    /* Header */
    header {
      background: rgba(7, 18, 13, 0.95);
      border-bottom: 1px solid var(--gold);
      padding: 16px 0;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
    }
    .nav { display: flex; justify-content: space-between; align-items: center; }
    .brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
    .badge-gold {
      background: linear-gradient(135deg, var(--gold), var(--gold-dark));
      color: #07120D;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 13px;
    }
    .brand-title { font-size: 20px; font-weight: 700; color: #FFF; font-family: 'Playfair Display', serif; }
    .btn-pdf {
      background: var(--gold);
      color: #07120D;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-pdf:hover { background: var(--gold-light); transform: scale(1.02); }

    /* Hero */
    .hero {
      text-align: center;
      padding: 70px 0 50px;
      background: radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.15) 0%, rgba(7, 18, 13, 0) 70%);
      border-bottom: 1px solid var(--card-border);
    }
    .tag {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      background: rgba(212, 175, 55, 0.12);
      border: 1px solid rgba(212, 175, 55, 0.3);
      color: var(--gold-light);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 16px;
    }
    .hero h1 {
      font-size: 44px;
      font-family: 'Playfair Display', serif;
      color: #FFF;
      margin-bottom: 16px;
      line-height: 1.2;
    }
    .hero h1 span {
      background: linear-gradient(135deg, #FFF 30%, var(--gold-light) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero p {
      max-width: 740px;
      margin: 0 auto 30px;
      font-size: 16px;
      color: var(--text-muted);
    }

    /* Section Styling */
    section {
      padding: 60px 0;
      border-bottom: 1px solid var(--card-border);
    }
    .sec-num {
      color: var(--gold);
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .sec-title {
      font-size: 28px;
      font-family: 'Playfair Display', serif;
      color: #FFF;
      margin-bottom: 12px;
    }
    .sec-desc {
      color: var(--text-muted);
      font-size: 15px;
      max-width: 800px;
      margin-bottom: 30px;
    }

    /* Grids & Cards */
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 24px;
      transition: all 0.3s;
    }
    .card:hover {
      border-color: var(--gold);
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.5);
    }
    .card-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--gold-light);
      margin-bottom: 8px;
    }
    .card-body { font-size: 13px; color: var(--text-muted); }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }
    .badge-gold { background: rgba(212,175,55,0.2); color: var(--gold-light); border: 1px solid rgba(212,175,55,0.4); }
    .badge-emerald { background: rgba(35,77,58,0.4); color: #A3E635; border: 1px solid rgba(163,230,53,0.3); }

    /* Tables */
    .table-box {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      overflow-x: auto;
      margin: 20px 0;
    }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th {
      background: #0B1C15;
      color: var(--gold-light);
      padding: 14px 18px;
      font-weight: 700;
      border-bottom: 1px solid var(--card-border);
    }
    td {
      padding: 12px 18px;
      border-bottom: 1px solid rgba(27, 69, 51, 0.4);
      color: var(--text-muted);
    }
    tr:hover td { background: rgba(255,255,255,0.02); color: #FFF; }

    /* Diagrams */
    .diagram-container {
      background: #060E0A;
      border: 1px solid var(--gold);
      border-radius: 14px;
      padding: 24px;
      margin: 24px 0;
      overflow-x: auto;
      display: flex;
      justify-content: center;
    }

    /* ASCII Wireframe Box */
    .wireframe-box {
      background: #040A07;
      border: 1px solid var(--gold);
      border-radius: 10px;
      padding: 18px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #A3E635;
      margin: 12px 0;
      overflow-x: auto;
      white-space: pre;
    }

    /* Print Styles */
    @media print {
      header, .btn-pdf { display: none !important; }
      body { background: #FFF !important; color: #000 !important; }
      .card, .diagram-container, .table-box, .wireframe-box {
        background: #F9F9F9 !important;
        border-color: #CCC !important;
        color: #000 !important;
        break-inside: avoid;
      }
      .sec-title, .card-title, h1 { color: #000 !important; }
      .hero h1 span { -webkit-text-fill-color: #000 !important; }
    }
  </style>
</head>
<body>

  <!-- Sticky Header -->
  <header>
    <div class="container nav">
      <a href="#" class="brand">
        <span class="badge-gold">አጋፋሪ</span>
        <span class="brand-title">Agafari Master System Guide</span>
      </a>
      <button class="btn-pdf" onclick="window.print()">
        📄 Print / Save as PDF
      </button>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="container">
      <span class="tag">Complete Platform Specification</span>
      <h1>Agafari (አጋፋሪ) <span>Master System Guide</span></h1>
      <p>The comprehensive digital wedding ecosystem uniting real-time 1-Click RSVP, instant QR gate verification, TikTok-style memory reels, and global HD ceremony streaming.</p>
    </div>
  </section>

  <!-- Section 1: The 4 Pillars -->
  <section>
    <div class="container">
      <div class="sec-num">Section 01</div>
      <h2 class="sec-title">The 4 Core Pillars of Agafari</h2>
      <p class="sec-desc">Four integrated pillars that transform the traditional Ethiopian wedding into an unforgettable digital celebration.</p>

      <div class="grid-4">
        <div class="card">
          <div class="card-title">🎟️ 1-Click RSVP & QR Pass</div>
          <div class="card-body">Unique digital cards with instant zero-typing RSVP (Yes / Maybe / No). Door scanning takes under 2 seconds. Eliminates catering waste.</div>
        </div>
        <div class="card">
          <div class="card-title">⏳ Coming Soon Hub</div>
          <div class="card-body">Personalized couple website with live countdown clock, venue Google Maps link, dress code guidelines, and an interactive Wish Wall.</div>
        </div>
        <div class="card">
          <div class="card-title">🎬 TikTok Memory Feed</div>
          <div class="card-body">Vertical video reel feed for guests to upload authentic backstage moments, wishes, and dance practice videos in real time.</div>
        </div>
        <div class="card">
          <div class="card-title">📡 Global HD Live Stream</div>
          <div class="card-body">Broadcast-quality ceremony streaming with real-time floating emoji reactions for family in the USA, Europe, and Canada.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 2: 3-Phase Journey -->
  <section>
    <div class="container">
      <div class="sec-num">Section 02</div>
      <h2 class="sec-title">The 3-Phase Wedding Lifecycle</h2>
      <p class="sec-desc">A seamless end-to-end journey before, during, and after the wedding day.</p>

      <div class="diagram-container">
        <pre class="mermaid">
flowchart LR
    subgraph P1["PHASE 1: BEFORE WEDDING"]
        A1["Onboard Wedding"] --> A2["Generate QR Passes"]
        A2 --> A3["Share via Telegram/WhatsApp"]
        A3 --> A4["Guests 1-Click RSVP"]
    end

    subgraph P2["PHASE 2: WEDDING DAY"]
        B1["Gate Security Scans QR"] --> B2["Remote Guests Watch Stream"]
        B2 --> B3["Guests Upload TikTok Reels"]
    end

    subgraph P3["PHASE 3: AFTER WEDDING"]
        C1["Export Verified Wish Book"] --> C2["Permanent Video Vault"]
    end

    P1 --> P2 --> P3
        </pre>
      </div>
    </div>
  </section>

  <!-- Section 3: 1-Click RSVP Mechanism -->
  <section>
    <div class="container">
      <div class="sec-num">Section 03</div>
      <h2 class="sec-title">1-Click Instant RSVP Mechanism</h2>
      <p class="sec-desc">Zero typing required: popup emerges after 5 seconds, and tapping any choice submits immediately.</p>

      <div class="diagram-container">
        <pre class="mermaid">
flowchart TD
    A["Guest Opens Wedding Link"] --> B["Page loads countdown & details"]
    B --> C{"5-Second Delay"}
    C --> D["RSVP Popup Emerges (3 Choices)"]

    D --> E["Choice 1: YES 🥂 (Attending)"]
    D --> F["Choice 2: MAYBE 🤔 (Undecided)"]
    D --> G["Choice 3: NO 💔 (Declined)"]

    E --> H["Instant Auto-Submit to Server"]
    F --> H
    G --> H

    H --> I["Display Checkmark Confirmation Banner"]
    I --> J["Modal auto-closes after 1.8s"]
    J --> K["Couple Dashboard updates live headcount"]
        </pre>
      </div>
    </div>
  </section>

  <!-- Section 4: All 12 Pages Walkthrough -->
  <section>
    <div class="container">
      <div class="sec-num">Section 04</div>
      <h2 class="sec-title">Complete 12-Page Map & Visual Wireframes</h2>
      <p class="sec-desc">Every screen designed for maximum elegance and ease of use.</p>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">1. Coming Soon Celebration Hub</div>
          <p class="badge badge-emerald" style="margin-bottom: 8px;">Route: /event/[slug]</p>
          <div class="wireframe-box">[ 👑 SARA & DAWIT'S ROYAL WEDDING ]
⏳ COUNTDOWN: 14d : 06h : 22m : 18s
📍 Venue: Sheraton Addis Ballroom [Maps ↗]
🎟️ PASS: Abebe Kebede (Quota: 2 Heads)
[ ■■■■■ SECURE QR CODE ■■■■■ ]
💌 WISH WALL: "Congratulations! ✨"</div>
          <div class="card-body">The central guest page with live countdown, personalized QR pass, Wish Wall, song suggestions, and 1-Click RSVP popup.</div>
        </div>

        <div class="card">
          <div class="card-title">2. TikTok-Style Memory Feed</div>
          <p class="badge badge-emerald" style="margin-bottom: 8px;">Route: /event/[slug]/feed</p>
          <div class="wireframe-box">[ LIVE 🔴 ] Wishes | Behind Scenes | Live
=======================================
           [ FULL SCREEN REEL ]
          (❤️) 192 Likes | (💬) 24 Comments
=======================================
💍 Eskista dance rehearsal! [ + Upload ]</div>
          <div class="card-body">Vertical snap-scroll video reels with Wishes, BTS, and Live tabs, double-tap heart bursts, comments drawer, and video upload modal.</div>
        </div>

        <div class="card">
          <div class="card-title">3. QR Gate Security Scanner</div>
          <p class="badge badge-emerald" style="margin-bottom: 8px;">Route: /scanner</p>
          <div class="wireframe-box">🔍 AGAFARI GATE VERIFICATION SCANNER
Code: INV-SD2026-001 [ VERIFY ]
---------------------------------------
✅ VALID PASS: Abebe Kebede & Guest
Quota: 2 Heads (0/2 Checked In)
[ CHECK IN 1 GUEST ] [ CHECK IN 2 GUESTS ]</div>
          <div class="card-body">Door verification tool showing Valid, Already Scanned, or Invalid pass states with anti-counterfeit duplicate prevention.</div>
        </div>

        <div class="card">
          <div class="card-title">4. Couple Command Center</div>
          <p class="badge badge-emerald" style="margin-bottom: 8px;">Route: /couple/dashboard</p>
          <div class="wireframe-box">👰 SARA & DAWIT DASHBOARD
Total: 250 | Confirmed: 210 | Declined: 15
---------------------------------------
[ + Generate New Guest QR Pass ]
• Dr. Michael (London) - 1 Guest [COPIED]
• Sara Bekele - 2 Guests [PENDING]</div>
          <div class="card-body">Live attendance tracker, custom QR pass generator, wish/video moderation, and security/streamer staff assignment.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 5: Traditional vs Agafari -->
  <section>
    <div class="container">
      <div class="sec-num">Section 05</div>
      <h2 class="sec-title">Traditional Wedding vs. Agafari Platform</h2>
      <p class="sec-desc">A direct side-by-side comparison illustrating why couples and planners choose Agafari.</p>

      <div class="table-box">
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Traditional Ethiopian Wedding</th>
              <th>With Agafari Platform</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Invitations</strong></td>
              <td>Expensive paper printing; manual hand delivery; lost cards</td>
              <td>Instant personalized QR cards via Telegram, WhatsApp, or SMS</td>
            </tr>
            <tr>
              <td><strong>RSVP Headcount</strong></td>
              <td>30-40% uncertainty; heavy catering & seat wastage</td>
              <td>Exact real-time attendance numbers with 1-Click RSVP</td>
            </tr>
            <tr>
              <td><strong>Gate Security</strong></td>
              <td>Slow paper lists; gate crashing; duplicate card reuse</td>
              <td>2-second QR scan; anti-counterfeit duplicate entry alert</td>
            </tr>
            <tr>
              <td><strong>Diaspora Family</strong></td>
              <td>Unstable personal phone video calls</td>
              <td>Broadcast HD live stream with floating heart reactions</td>
            </tr>
            <tr>
              <td><strong>Guest Videos</strong></td>
              <td>Scattered on 100+ guest phones; couple loses 80%</td>
              <td>Centralized TikTok-style memory reel vault</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Section 6: Packages -->
  <section>
    <div class="container">
      <div class="sec-num">Section 06</div>
      <h2 class="sec-title">Packages & Deliverables</h2>
      <p class="sec-desc">Tailored service tiers to fit intimate celebrations and royal grand weddings.</p>

      <div class="grid-3">
        <div class="card">
          <div class="card-title">Silver Package</div>
          <div class="card-body">
            <ul style="list-style: none; margin-top: 10px;">
              <li>✓ Coming Soon Celebration Web Hub</li>
              <li>✓ Live Countdown Clock</li>
              <li>✓ 1-Click Instant RSVP System</li>
              <li>✓ Up to 200 Unique QR Passes</li>
              <li>✓ Interactive Digital Wish Wall</li>
              <li>✓ Couple Management Dashboard</li>
              <li>✓ 3 Months Cloud Hosting</li>
            </ul>
          </div>
        </div>

        <div class="card" style="border-color: var(--gold);">
          <div class="card-title" style="color: var(--gold);">Gold Package (Most Popular)</div>
          <div class="card-body">
            <ul style="list-style: none; margin-top: 10px;">
              <li>✓ Everything in Silver Package</li>
              <li>✓ TikTok-Style Memory Reel Feed</li>
              <li>✓ Guest Video Blessing Uploads</li>
              <li>✓ Up to 500 Unique QR Passes</li>
              <li>✓ Gate Security Scanner Account</li>
              <li>✓ Mezmur & Song Recommendation Hub</li>
              <li>✓ 6 Months Cloud Hosting</li>
            </ul>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Diamond Package (Royal VIP)</div>
          <div class="card-body">
            <ul style="list-style: none; margin-top: 10px;">
              <li>✓ Everything in Gold Package</li>
              <li>✓ Dedicated HD Live Ceremony Stream</li>
              <li>✓ Custom Wedding Domain URL</li>
              <li>✓ Unlimited Unique QR Passes</li>
              <li>✓ 3 Gate Scanner Staff Accounts</li>
              <li>✓ Lifetime Video Reel Archive Vault</li>
              <li>✓ 1 Year VIP Hosting & Priority Support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 7: Demo Links & Credentials -->
  <section>
    <div class="container">
      <div class="sec-num">Section 07</div>
      <h2 class="sec-title">Live Testing Links & Demo Credentials</h2>
      <p class="sec-desc">Pre-configured accounts ready for live demonstration.</p>

      <div class="table-box">
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Login Portal</th>
              <th>Demo Email</th>
              <th>Demo Password</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Bride & Groom</strong></td>
              <td><code>/couple/login</code></td>
              <td><code>couple@sara-dawit.com</code></td>
              <td><code>couple123</code></td>
            </tr>
            <tr>
              <td><strong>Event Organizer</strong></td>
              <td><code>/organizer/login</code></td>
              <td><code>organizer@sara-dawit.com</code></td>
              <td><code>org123</code></td>
            </tr>
            <tr>
              <td><strong>System Admin</strong></td>
              <td><code>/admin/login</code></td>
              <td><code>admin@hamelmal.com</code></td>
              <td><code>admin123</code></td>
            </tr>
            <tr>
              <td><strong>Gate Security</strong></td>
              <td><code>/scanner</code></td>
              <td><code>scanner@sara-dawit.com</code></td>
              <td><code>scan123</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer style="text-align: center; padding: 40px 0; border-top: 1px solid var(--card-border); color: var(--text-muted); font-size: 13px;">
    <div class="container">
      <p style="margin-bottom: 6px;"><strong>Agafari (አጋፋሪ)</strong> — Smart Digital Wedding Celebration Platform</p>
      <p>Architected & Built by <strong>Hamelmal Creatives</strong> · Version 1.0.0 (2026)</p>
    </div>
  </footer>

</body>
</html>

```

### File: `frontend/src/app/admin/dashboard/page.tsx`

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Calendar, 
  Users, 
  Video, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  LogOut, 
  Search, 
  Check, 
  X, 
  Sparkles, 
  Layers, 
  KeyRound, 
  FileText, 
  UserPlus, 
  Briefcase, 
  QrCode, 
  Eye, 
  EyeOff, 
  Lock, 
  ChevronRight, 
  Activity, 
  DollarSign, 
  Film, 
  ScanLine, 
  Share2, 
  Radio, 
  Trash2, 
  Clock, 
  Archive, 
  MapPin, 
  Send, 
  Copy, 
  Menu, 
  AlertCircle, 
  Settings, 
  RefreshCw,
  Building2
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

interface EventCredential {
  fullName: string;
  email: string;
  temporaryPassword?: string;
  role: string;
}

interface EventData {
  id: string;
  slug: string;
  title: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  startTime?: string;
  venueName: string;
  venueAddress?: string;
  dressCode?: string;
  coverImageUrl?: string;
  status: 'DRAFT' | 'COMING_SOON' | 'LIVE' | 'COMPLETED' | 'ARCHIVED';
  adminApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  coupleCredentials?: {
    email: string;
    temporaryPassword?: string;
  };
  youtubeVideoId?: string;
  isLive?: boolean;
  credentials?: {
    couple: EventCredential;
    organizer: EventCredential;
    streamer: EventCredential;
    scanner: EventCredential;
  };
  stats?: {
    totalInvites: number;
    totalWishes: number;
    totalMedia: number;
  };
}

interface UserData {
  id: string;
  email: string;
  fullName: string;
  role: 'SYSTEM_ADMIN' | 'EVENT_ORGANIZER' | 'BRIDE_GROOM' | 'LIVE_STREAMER' | 'GATE_SCANNER' | 'GUEST';
  eventId?: string | null;
  temporaryPassword?: string;
}

interface MediaAssetData {
  id: string;
  eventId: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE';
  cdnUrl: string;
  caption: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function SystemAdminDashboardPage() {
  const { t } = useTranslation();
  // Navigation: 'APPROVALS' | 'EVENTS' | 'ORGANIZERS' | 'USERS' | 'MEDIA'
  const [activeTab, setActiveTab] = useState<'APPROVALS' | 'EVENTS' | 'ORGANIZERS' | 'USERS' | 'MEDIA'>('APPROVALS');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [events, setEvents] = useState<EventData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetData[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Drill-Down Event & Impersonation Hub
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  // Event Fleet Directory Filters
  const [fleetFilter, setFleetFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVE' | 'PENDING'>('ALL');
  const [searchFleetQuery, setSearchFleetQuery] = useState('');

  // User Management State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [resettingUser, setResettingUser] = useState<UserData | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');

  // New Event Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBrideName, setNewBrideName] = useState('');
  const [newGroomName, setNewGroomName] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-11-25');
  const [newVenueName, setNewVenueName] = useState('');
  const [newVenueAddress, setNewVenueAddress] = useState('Addis Ababa, Ethiopia');
  const [newCoupleEmail, setNewCoupleEmail] = useState('');
  const [creatingEvent, setCreatingEvent] = useState(false);

  // New Organizer Agency Onboarding State
  const [orgAgencyName, setOrgAgencyName] = useState('');
  const [orgContactEmail, setOrgContactEmail] = useState('');
  const [orgPassword, setOrgPassword] = useState('org123');
  const [creatingOrg, setCreatingOrg] = useState(false);
  const [orgSuccessMsg, setOrgSuccessMsg] = useState('');

  // Password Visibility & Copy Feedback
  const [copiedKey, setCopiedKey] = useState<string>('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    try {
      const [eventsRes, usersRes, mediaRes] = await Promise.all([
        fetch('/api/admin/events'),
        fetch('/api/admin/users'),
        fetch('/api/organizer/media'),
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        const loadedEvents: EventData[] = eventsData.events || [];
        setEvents(loadedEvents);
        if (loadedEvents.length > 0) {
          setSelectedEvent(loadedEvents[0]);
        }
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        setMediaAssets(mediaData.mediaAssets || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  // 1-Click Approve Organizer Wedding Request (Module 1)
  const handleApproveEventRequest = async (eventId: string) => {
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, adminApprovalStatus: 'APPROVED', status: 'COMING_SOON' }),
      });

      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, adminApprovalStatus: 'APPROVED', status: 'COMING_SOON' } : e))
        );
        if (selectedEvent && selectedEvent.id === eventId) {
          setSelectedEvent((prev) => prev ? { ...prev, adminApprovalStatus: 'APPROVED', status: 'COMING_SOON' } : null);
        }
      }
    } catch (err) {
      console.error('Failed to approve event:', err);
    }
  };

  // 1-Click Reject Organizer Wedding Request
  const handleRejectEventRequest = async (eventId: string) => {
    if (!confirm('Reject this wedding licensing request?')) return;
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, adminApprovalStatus: 'REJECTED' }),
      });

      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, adminApprovalStatus: 'REJECTED' } : e))
        );
      }
    } catch (err) {
      console.error('Failed to reject event:', err);
    }
  };

  // Toggle Live Broadcast Stream State
  const handleToggleLiveStream = async (eventId: string, currentIsLive: boolean) => {
    const nextIsLive = !currentIsLive;
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, isLive: nextIsLive, status: nextIsLive ? 'LIVE' : 'COMING_SOON' }),
      });

      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, isLive: nextIsLive, status: nextIsLive ? 'LIVE' : 'COMING_SOON' } : e))
        );
        if (selectedEvent && selectedEvent.id === eventId) {
          setSelectedEvent((prev) => prev ? { ...prev, isLive: nextIsLive, status: nextIsLive ? 'LIVE' : 'COMING_SOON' } : null);
        }
      }
    } catch (err) {
      console.error('Failed to toggle live stream:', err);
    }
  };

  // Direct Admin Creation of a Wedding
  const handleCreateWeddingEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrideName || !newGroomName || !newVenueName || !newCoupleEmail) return;

    setCreatingEvent(true);
    const cleanSlug = `${newBrideName.toLowerCase().replace(/[^a-z0-9]/g, '')}-and-${newGroomName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${new Date(newEventDate).getFullYear()}`;

    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${newBrideName} & ${newGroomName}'s Royal Wedding`,
          slug: cleanSlug,
          brideName: newBrideName,
          groomName: newGroomName,
          eventDate: newEventDate,
          venueName: newVenueName,
          venueAddress: newVenueAddress,
          coupleEmail: newCoupleEmail,
        }),
      });

      const data = await res.json();
      if (res.ok && data.event) {
        setEvents((prev) => [data.event, ...prev]);
        setSelectedEvent(data.event);
        setShowCreateModal(false);
        setNewBrideName('');
        setNewGroomName('');
        setNewVenueName('');
        setNewCoupleEmail('');
      }
    } catch (err) {
      console.error('Failed to create wedding:', err);
    } finally {
      setCreatingEvent(false);
    }
  };

  // Create New Verified Event Organizer Agency
  const handleCreateOrganizerAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgAgencyName || !orgContactEmail || !orgPassword) return;

    setCreatingOrg(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: orgAgencyName,
          email: orgContactEmail,
          password: orgPassword,
          role: 'EVENT_ORGANIZER',
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setUsers((prev) => [data.user, ...prev]);
        setOrgSuccessMsg(`Agency "${orgAgencyName}" onboarded successfully!`);
        setOrgAgencyName('');
        setOrgContactEmail('');
        setTimeout(() => setOrgSuccessMsg(''), 5000);
      }
    } catch (err) {
      console.error('Failed to onboard organizer:', err);
    } finally {
      setCreatingOrg(false);
    }
  };

  // Password Reset Handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser || !newPasswordVal) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: resettingUser.id, newPassword: newPasswordVal }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === resettingUser.id ? { ...u, temporaryPassword: newPasswordVal } : u))
        );
        setResettingUser(null);
        setNewPasswordVal('');
      }
    } catch (err) {
      console.error('Failed to reset password:', err);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 3000);
  };

  const toggleShowPassword = (key: string) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Metric Computations
  const pendingApprovals = events.filter((e) => e.adminApprovalStatus === 'PENDING');
  const activeHosting = events.filter((e) => e.status !== 'COMPLETED' && e.status !== 'ARCHIVED' && e.adminApprovalStatus === 'APPROVED');
  const hostedArchives = events.filter((e) => e.status === 'COMPLETED' || e.status === 'ARCHIVED');
  const organizerUsers = users.filter((u) => u.role === 'EVENT_ORGANIZER');

  // Filtered Fleet
  const filteredEvents = events.filter((evt) => {
    const matchesSearch = evt.title.toLowerCase().includes(searchFleetQuery.toLowerCase()) ||
                          evt.venueName.toLowerCase().includes(searchFleetQuery.toLowerCase()) ||
                          evt.brideName.toLowerCase().includes(searchFleetQuery.toLowerCase()) ||
                          evt.groomName.toLowerCase().includes(searchFleetQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (fleetFilter === 'ALL') return true;
    if (fleetFilter === 'ACTIVE') return evt.status !== 'COMPLETED' && evt.status !== 'ARCHIVED' && evt.adminApprovalStatus === 'APPROVED';
    if (fleetFilter === 'ARCHIVE') return evt.status === 'COMPLETED' || evt.status === 'ARCHIVED';
    if (fleetFilter === 'PENDING') return evt.adminApprovalStatus === 'PENDING';
    return true;
  });

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (userRoleFilter === 'ALL') return true;
    return u.role === userRoleFilter;
  });

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 flex font-sans selection:bg-gold-500 selection:text-black">
      
      {/* =========================================================================
          1. SYSTEM ADMIN EXECUTIVE SIDEBAR
         ========================================================================= */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gray-950 text-white flex flex-col justify-between border-r border-gold-500/30 transition-transform duration-300 ease-in-out
        md:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-gold-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/branding/artboard-13.png"
                  alt="Agafari (አጋፋሪ) Logo"
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <h2 className="font-serif font-bold text-base text-gold-400 tracking-wide">
                    {t('adminDashboard.brand')}
                  </h2>
                  <span className="text-[10px] text-gold-500/80 font-semibold uppercase tracking-widest block">
                    {t('adminDashboard.subtitle')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden p-1 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                <div className="text-amber-300 font-bold text-base">{pendingApprovals.length}</div>
                <div className="text-white/70 text-[10px]">{t('adminDashboard.kpiPending')}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                <div className="text-emerald-400 font-bold text-base">{activeHosting.length}</div>
                <div className="text-white/70 text-[10px]">{t('adminDashboard.kpiActive')}</div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            
            {/* 1. Licensing & Approvals */}
            <button
              onClick={() => { setActiveTab('APPROVALS'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'APPROVALS'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>{t('adminDashboard.tabs.approvals')}</span>
              </div>
              {pendingApprovals.length > 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold animate-pulse">
                  {pendingApprovals.length}
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gold-300 font-bold">
                  0
                </span>
              )}
            </button>

            {/* 2. Global Weddings Fleet & Role Command */}
            <button
              onClick={() => { setActiveTab('EVENTS'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'EVENTS'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-gold-400" />
                <span>{t('adminDashboard.tabs.events')}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gold-300 font-bold">
                {events.length}
              </span>
            </button>

            {/* 3. Event Organizing Agencies */}
            <button
              onClick={() => { setActiveTab('ORGANIZERS'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'ORGANIZERS'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-gold-400" />
                <span>{t('adminDashboard.tabs.organizers')}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gold-300 font-bold">
                {organizerUsers.length}
              </span>
            </button>

            {/* 4. Platform Users & RBAC */}
            <button
              onClick={() => { setActiveTab('USERS'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'USERS'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-gold-400" />
                <span>{t('adminDashboard.tabs.users')}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gold-300 font-bold">
                {users.length}
              </span>
            </button>

            {/* 5. Global Media Vault Moderation */}
            <button
              onClick={() => { setActiveTab('MEDIA'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'MEDIA'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Film className="w-4 h-4 text-gold-400" />
                <span>{t('adminDashboard.tabs.media')}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gold-300 font-bold">
                {mediaAssets.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/admin/login"
            className="w-full py-2.5 px-3 rounded-xl hover:bg-rose-950/40 text-rose-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('nav.signOut')}</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        />
      )}

      {/* =========================================================================
          2. MAIN EXECUTIVE WORKSPACE
         ========================================================================= */}
      <div className="flex-1 md:pl-72 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gold-500/30 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-gray-50 border border-gold-500/30 text-gray-900"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="text-[11px] text-gold-600 font-semibold uppercase tracking-wider">
                {t('adminDashboard.header.tag')}
              </div>
              <h1 className="font-serif font-bold text-lg sm:text-xl text-gray-900">
                {activeTab === 'APPROVALS' && t('adminDashboard.approvals.title')}
                {activeTab === 'EVENTS' && t('adminDashboard.fleet.title')}
                {activeTab === 'ORGANIZERS' && t('adminDashboard.agencies.title')}
                {activeTab === 'USERS' && t('adminDashboard.users.title')}
                {activeTab === 'MEDIA' && t('coupleDashboard.media.title')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-gold-400 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-gold-500/40"
            >
              <Plus className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">{t('adminDashboard.header.createBtn')}</span>
            </button>

            <LanguageSwitcher />
          </div>
        </header>

        {/* Workspace Main Area */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* =========================================================================
              TAB 1: LICENSING & APPROVALS PIPELINE
             ========================================================================= */}
          {activeTab === 'APPROVALS' && (
            <div className="space-y-6">
              
              {/* Header Box */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="font-serif font-bold text-xl text-gray-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-gold-500" />
                      {t('adminDashboard.approvals.title')} ({pendingApprovals.length})
                    </h2>
                    <p className="text-xs text-gray-500 font-light mt-0.5">
                      {t('adminDashboard.approvals.subtitle')}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-700" />
                    {pendingApprovals.length} Awaiting Verification
                  </span>
                </div>

                {pendingApprovals.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-xs">
                    🎉 All wedding onboarding requests have been reviewed and approved!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {pendingApprovals.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-5 rounded-2xl border-[1.5px] border-amber-300 bg-amber-50/40 flex flex-col justify-between space-y-4 shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[10px] font-bold">
                              🟡 Pending Review
                            </span>
                            <span className="text-[11px] font-mono text-gray-500 font-bold">
                              {new Date(evt.eventDate).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="font-serif font-bold text-base text-gray-900">
                            {evt.brideName} & {evt.groomName}
                          </h3>
                          <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-gold-500" />
                            <span>{evt.venueName}</span>
                          </div>

                          <div className="mt-3 p-3 rounded-xl bg-white border border-amber-200 text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-[11px]">Couple Email:</span>
                              <span className="font-mono font-bold text-gray-900">
                                {evt.coupleCredentials?.email || `couple@${evt.slug}.com`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-[11px]">Proposed Slug:</span>
                              <span className="font-mono text-gray-900 text-[11px]">/event/{evt.slug}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
                          <button
                            onClick={() => handleApproveEventRequest(evt.id)}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{t('adminDashboard.approvals.approveBtn')}</span>
                          </button>

                          <button
                            onClick={() => handleRejectEventRequest(evt.id)}
                            className="py-2.5 px-3 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-bold transition-colors"
                            title="Reject Request"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Approved & Active Licenses Table */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-lg text-gray-900">
                  {t('adminDashboard.approvals.approvedTableTitle')} ({events.filter((e) => e.adminApprovalStatus === 'APPROVED').length})
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-gray-50">
                        <th className="py-3 px-4 rounded-l-xl">Wedding Instance</th>
                        <th className="py-3 px-4">Couple Credentials</th>
                        <th className="py-3 px-4">License Status</th>
                        <th className="py-3 px-4">Live Broadcast</th>
                        <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {events.filter((e) => e.adminApprovalStatus === 'APPROVED').map((evt) => (
                        <tr key={evt.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-serif font-bold text-gray-900">{evt.title}</div>
                            <div className="text-[11px] text-gray-500">{evt.venueName} • {new Date(evt.eventDate).toLocaleDateString()}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-gray-900">
                              {evt.credentials?.couple.email || evt.coupleCredentials?.email || `couple@${evt.slug}.com`}
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono">
                              Pass: {evt.credentials?.couple.temporaryPassword || evt.coupleCredentials?.temporaryPassword || 'couple123'}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Active License
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {evt.isLive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-bold animate-pulse">
                                <Radio className="w-3 h-3 text-rose-700" /> LIVE NOW
                              </span>
                            ) : (
                              <span className="text-gray-500 text-[11px]">Offline</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedEvent(evt);
                                setActiveTab('EVENTS');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-black hover:bg-gray-800 text-gold-400 text-xs font-bold shadow-sm border border-gold-500/30"
                            >
                              {t('adminDashboard.approvals.openCommand')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 2: GLOBAL WEDDINGS FLEET & 1-CLICK ROLE COMMAND (PILLAR 2)
             ========================================================================= */}
          {activeTab === 'EVENTS' && (
            <div className="space-y-6">
              
              {/* Filter Pills & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-gold-500/30 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setFleetFilter('ALL')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'ALL'
                        ? 'bg-black text-gold-400 shadow-sm'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {t('organizerDashboard.fleet.all')} ({events.length})
                  </button>

                  <button
                    onClick={() => setFleetFilter('ACTIVE')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'ACTIVE'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-gray-50 text-emerald-900 hover:bg-emerald-50'
                    }`}
                  >
                    {t('organizerDashboard.fleet.active')} ({activeHosting.length})
                  </button>

                  <button
                    onClick={() => setFleetFilter('ARCHIVE')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'ARCHIVE'
                        ? 'bg-blue-800 text-white shadow-sm'
                        : 'bg-gray-50 text-blue-900 hover:bg-blue-50'
                    }`}
                  >
                    {t('organizerDashboard.fleet.archive')} ({hostedArchives.length})
                  </button>

                  <button
                    onClick={() => setFleetFilter('PENDING')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'PENDING'
                        ? 'bg-amber-800 text-white shadow-sm'
                        : 'bg-gray-50 text-amber-900 hover:bg-amber-50'
                    }`}
                  >
                    {t('organizerDashboard.fleet.pending')} ({pendingApprovals.length})
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFleetQuery}
                    onChange={(e) => setSearchFleetQuery(e.target.value)}
                    placeholder={t('organizerDashboard.fleet.searchPlaceholder')}
                    className="pl-8 pr-4 py-1.5 rounded-xl border border-gold-500/30 text-xs text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              {/* Fleet Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((evt) => {
                  const isSelected = selectedEvent?.id === evt.id;
                  const isArchive = evt.status === 'COMPLETED' || evt.status === 'ARCHIVED';

                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className={`
                        rounded-3xl p-5 border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden bg-white
                        ${isSelected ? 'border-gold-500 ring-2 ring-gold-500/50 shadow-lg' : 'border-gold-500/30 hover:border-gold-500 shadow-sm'}
                      `}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          {evt.adminApprovalStatus === 'PENDING' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                              🟡 Pending Admin
                            </span>
                          ) : isArchive ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                              📜 Hosted Archive
                            </span>
                          ) : evt.isLive ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-bold animate-pulse">
                              🔴 LIVE NOW
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                              🟢 Active Instance
                            </span>
                          )}

                          <span className="text-[10px] font-mono text-gray-500 font-bold">
                            {new Date(evt.eventDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="h-32 rounded-2xl overflow-hidden mb-3 relative bg-black/10">
                          {evt.coverImageUrl ? (
                            <img
                              src={evt.coverImageUrl}
                              alt={evt.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black text-gold-400 font-serif font-bold border border-gold-500/30">
                              {evt.brideName} & {evt.groomName}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 text-white">
                            <div>
                              <div className="font-serif font-bold text-sm">{evt.brideName} & {evt.groomName}</div>
                              <div className="text-[10px] text-gold-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gold-400" /> {evt.venueName}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold">
                        <span className="text-gray-900">
                          {isSelected ? '✓ Selected in Command Room' : 'Click to Inspect Roles'}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-gold-500' : 'text-gray-400'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* =========================================================================
                  MASTER EVENT COMMAND ROOM & MULTI-ROLE 1-CLICK LAUNCH
                 ========================================================================= */}
              {selectedEvent && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-gold-500 shadow-xl space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-gold-400 text-xs font-bold mb-2 border border-gold-500/30">
                        <Crown className="w-3.5 h-3.5 text-gold-400" />
                        {t('adminDashboard.header.tag')}
                      </div>
                      <h2 className="font-serif font-bold text-2xl text-gray-900">
                        {selectedEvent.title}
                      </h2>
                      <div className="text-xs text-gray-500 flex flex-wrap items-center gap-3 mt-1">
                        <span>Date: <strong>{new Date(selectedEvent.eventDate).toLocaleDateString()}</strong></span>
                        <span>•</span>
                        <span>Venue: <strong>{selectedEvent.venueName}</strong></span>
                        <span>•</span>
                        <span>Slug: <strong>/event/{selectedEvent.slug}</strong></span>
                      </div>
                    </div>

                    {/* Stream Live Broadcaster Switcher */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleLiveStream(selectedEvent.id, !!selectedEvent.isLive)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
                          selectedEvent.isLive
                            ? 'bg-rose-800 hover:bg-rose-900 text-white animate-pulse'
                            : 'bg-black hover:bg-gray-800 text-gold-400 border border-gold-500/40'
                        }`}
                      >
                        <Radio className="w-4 h-4" />
                        <span>{selectedEvent.isLive ? t('adminDashboard.fleet.streamLive') : t('adminDashboard.fleet.startStream')}</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Multi-Role Impersonation Cards */}
                  <div>
                    <h3 className="font-serif font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-gold-500" />
                      {t('adminDashboard.fleet.rolesTitle')}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Directly launch into any role portal for this wedding without entering passwords:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      {/* 1. Couple Dashboard */}
                      <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-black text-gold-400 flex items-center justify-center font-bold border border-gold-500/30">
                              <Crown className="w-4 h-4 text-gold-400" />
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                              👑 Couple
                            </span>
                          </div>
                          <div className="font-serif font-bold text-sm text-gray-900">
                            {selectedEvent.brideName} & {selectedEvent.groomName}
                          </div>
                          <div className="text-[11px] font-mono text-gray-500 truncate">
                            {selectedEvent.credentials?.couple.email || `couple@${selectedEvent.slug}.com`}
                          </div>
                        </div>

                        <Link
                          href="/couple/dashboard"
                          className="w-full py-2 px-3 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs flex items-center justify-center gap-1 shadow-sm border border-gold-500/30"
                        >
                          <span>Launch Couple Suite</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* 2. Event Organizer Dashboard */}
                      <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-black text-gold-400 flex items-center justify-center font-bold border border-gold-500/30">
                              <Briefcase className="w-4 h-4 text-gold-400" />
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                              👔 Organizer
                            </span>
                          </div>
                          <div className="font-serif font-bold text-sm text-gray-900">
                            {selectedEvent.credentials?.organizer.fullName || 'Yonas Planners'}
                          </div>
                          <div className="text-[11px] font-mono text-gray-500 truncate">
                            {selectedEvent.credentials?.organizer.email || `organizer@${selectedEvent.slug}.com`}
                          </div>
                        </div>

                        <Link
                          href="/organizer/dashboard"
                          className="w-full py-2 px-3 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs flex items-center justify-center gap-1 shadow-sm border border-gold-500/30"
                        >
                          <span>Launch Organizer Suite</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* 3. Live Streamer Studio */}
                      <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-black text-gold-400 flex items-center justify-center font-bold border border-gold-500/30">
                              <Video className="w-4 h-4 text-gold-400" />
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                              📹 Streamer
                            </span>
                          </div>
                          <div className="font-serif font-bold text-sm text-gray-900">
                            {selectedEvent.credentials?.streamer.fullName || 'Stream Operator'}
                          </div>
                          <div className="text-[11px] font-mono text-gray-500 truncate">
                            {selectedEvent.credentials?.streamer.email || `streamer@${selectedEvent.slug}.com`}
                          </div>
                        </div>

                        <Link
                          href={`/event/${selectedEvent.slug}`}
                          target="_blank"
                          className="w-full py-2 px-3 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs flex items-center justify-center gap-1 shadow-sm border border-gold-500/30"
                        >
                          <span>Launch Live Studio</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* 4. Gate Scanner Terminal */}
                      <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-black text-gold-400 flex items-center justify-center font-bold border border-gold-500/30">
                              <ScanLine className="w-4 h-4 text-gold-400" />
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                              📱 Scanner
                            </span>
                          </div>
                          <div className="font-serif font-bold text-sm text-gray-900">
                            {selectedEvent.credentials?.scanner.fullName || 'Gate Security Team'}
                          </div>
                          <div className="text-[11px] font-mono text-gray-500 truncate">
                            {selectedEvent.credentials?.scanner.email || `scanner@${selectedEvent.slug}.com`}
                          </div>
                        </div>

                        <Link
                          href="/scanner"
                          target="_blank"
                          className="w-full py-2 px-3 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs flex items-center justify-center gap-1 shadow-sm border border-gold-500/30"
                        >
                          <span>Launch Gate Terminal</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>

                    </div>
                  </div>

                  {/* Public Guest Hub Links */}
                  <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-gray-500">
                      Public celebration links for <strong>{selectedEvent.title}</strong>:
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/event/${selectedEvent.slug}`}
                        target="_blank"
                        className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-gold-500" />
                        <span>Public Celebration Hub</span>
                      </Link>

                      <Link
                        href={`/event/${selectedEvent.slug}/feed`}
                        target="_blank"
                        className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Film className="w-3.5 h-3.5 text-gold-500" />
                        <span>TikTok Reel Feed</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 3: EVENT ORGANIZING AGENCY PARTNERS
             ========================================================================= */}
          {activeTab === 'ORGANIZERS' && (
            <div className="space-y-6">
              
              {/* Form to Onboard New Agency */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="font-serif font-bold text-xl text-gray-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-gold-500" />
                      {t('adminDashboard.agencies.title')}
                    </h2>
                    <p className="text-xs text-gray-500 font-light mt-0.5">
                      {t('adminDashboard.agencies.subtitle')}
                    </p>
                  </div>
                </div>

                {orgSuccessMsg && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{orgSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleCreateOrganizerAgency} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('adminDashboard.agencies.agencyName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={orgAgencyName}
                      onChange={(e) => setOrgAgencyName(e.target.value)}
                      placeholder="e.g. Addis Royal Wedding Planners"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('adminDashboard.agencies.contactEmail')}
                    </label>
                    <input
                      type="email"
                      required
                      value={orgContactEmail}
                      onChange={(e) => setOrgContactEmail(e.target.value)}
                      placeholder="agency@addisroyal.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('adminDashboard.agencies.password')}
                    </label>
                    <input
                      type="text"
                      required
                      value={orgPassword}
                      onChange={(e) => setOrgPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={creatingOrg}
                      className="px-8 py-3.5 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs shadow-md transition-all flex items-center gap-2 border border-gold-500/40"
                    >
                      <UserPlus className="w-4 h-4 text-gold-400" />
                      <span>{creatingOrg ? t('common.loading') : t('adminDashboard.agencies.onboardBtn')}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Agency List */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-lg text-gray-900">
                  {t('adminDashboard.agencies.listTitle')} ({organizerUsers.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {organizerUsers.map((org) => (
                    <div
                      key={org.id}
                      className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-black text-gold-400 flex items-center justify-center font-bold text-lg shadow-sm shrink-0 border border-gold-500/30">
                          <Briefcase className="w-6 h-6 text-gold-400" />
                        </div>
                        <div>
                          <div className="font-serif font-bold text-gray-900 text-sm">{org.fullName}</div>
                          <div className="text-xs text-gray-500 font-mono">{org.email}</div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold mt-1">
                            ✓ Certified Organizer
                          </span>
                        </div>
                      </div>

                      <Link
                        href="/organizer/dashboard"
                        className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <span>Open Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 4: PLATFORM USERS & RBAC DIRECTORY
             ========================================================================= */}
          {activeTab === 'USERS' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="font-serif font-bold text-xl text-gray-900">
                    {t('adminDashboard.users.title')} ({users.length})
                  </h2>
                  <p className="text-xs text-gray-500 font-light mt-0.5">
                    {t('adminDashboard.users.subtitle')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder={t('common.search')}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-gold-500/30 text-xs text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-gold-500/30 text-xs text-gray-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="SYSTEM_ADMIN">👑 System Admins</option>
                    <option value="EVENT_ORGANIZER">👔 Event Organizers</option>
                    <option value="BRIDE_GROOM">💍 Bride & Groom</option>
                    <option value="LIVE_STREAMER">📹 Live Streamers</option>
                    <option value="GATE_SCANNER">📱 Gate Scanners</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-gray-50">
                      <th className="py-3 px-4 rounded-l-xl">User / Organization</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">System Role</th>
                      <th className="py-3 px-4">Active Password</th>
                      <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-serif font-bold text-gray-900">
                          {u.fullName}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gray-500">
                          {u.email}
                        </td>
                        <td className="py-3.5 px-4">
                          {u.role === 'SYSTEM_ADMIN' && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold">
                              👑 Master Admin
                            </span>
                          )}
                          {u.role === 'EVENT_ORGANIZER' && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold">
                              👔 Organizer
                            </span>
                          )}
                          {u.role === 'BRIDE_GROOM' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                              💍 Bride & Groom
                            </span>
                          )}
                          {u.role === 'LIVE_STREAMER' && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-bold">
                              📹 Streamer
                            </span>
                          )}
                          {u.role === 'GATE_SCANNER' && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                              📱 Gate Scanner
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-gray-900">
                          {u.temporaryPassword || '••••••••'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setResettingUser(u);
                              setNewPasswordVal('newpass123');
                            }}
                            className="px-3 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 text-[11px] font-bold shadow-sm"
                          >
                            {t('adminDashboard.users.resetPassword')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: GLOBAL CONTENT & MEDIA VAULT MODERATION
             ========================================================================= */}
          {activeTab === 'MEDIA' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-6">
              <div className="pb-4 border-b border-gray-100">
                <h2 className="font-serif font-bold text-xl text-gray-900">
                  {t('coupleDashboard.media.title')} ({mediaAssets.length})
                </h2>
                <p className="text-xs text-gray-500 font-light mt-0.5">
                  Platform-wide compliance and media moderation across all hosted weddings.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mediaAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="h-44 rounded-xl overflow-hidden bg-black mb-3 flex items-center justify-center">
                        {asset.mediaType === 'VIDEO' || asset.cdnUrl.includes('.mp4') ? (
                          <video
                            src={asset.cdnUrl}
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={asset.cdnUrl}
                            alt={asset.caption}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="font-serif font-bold text-sm text-gray-900">{asset.uploaderName}</div>
                      <p className="text-xs text-gray-500 italic mt-1 line-clamp-2">"{asset.caption}"</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px]">
                        🟢 {t('coupleDashboard.media.tabPosted')}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* =========================================================================
          MODAL 1: DIRECT CREATE & LICENSE WEDDING
         ========================================================================= */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-500 relative shadow-2xl space-y-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                ✕
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-black text-gold-400 flex items-center justify-center border border-gold-500/30">
                  <Crown className="w-4 h-4 text-gold-400" />
                </div>
                <h3 className="font-serif font-bold text-xl text-gray-900">
                  {t('adminDashboard.header.createBtn')}
                </h3>
              </div>

              <form onSubmit={handleCreateWeddingEvent} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">{t('coupleDashboard.setup.brideName')}</label>
                    <input
                      type="text"
                      required
                      value={newBrideName}
                      onChange={(e) => setNewBrideName(e.target.value)}
                      placeholder="Sara Tadesse"
                      className="w-full px-3 py-2 rounded-xl border border-gold-500/30 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">{t('coupleDashboard.setup.groomName')}</label>
                    <input
                      type="text"
                      required
                      value={newGroomName}
                      onChange={(e) => setNewGroomName(e.target.value)}
                      placeholder="Dawit Alemayehu"
                      className="w-full px-3 py-2 rounded-xl border border-gold-500/30 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">{t('coupleDashboard.setup.eventDate')}</label>
                    <input
                      type="date"
                      required
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gold-500/30 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">{t('organizerDashboard.credentials.email')}</label>
                    <input
                      type="email"
                      required
                      value={newCoupleEmail}
                      onChange={(e) => setNewCoupleEmail(e.target.value)}
                      placeholder="couple@sara-dawit.com"
                      className="w-full px-3 py-2 rounded-xl border border-gold-500/30 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-900 mb-1">{t('coupleDashboard.setup.venueName')}</label>
                  <input
                    type="text"
                    required
                    value={newVenueName}
                    onChange={(e) => setNewVenueName(e.target.value)}
                    placeholder="Sheraton Addis Luxury Ballroom"
                    className="w-full px-3 py-2 rounded-xl border border-gold-500/30 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={creatingEvent}
                    className="px-6 py-2 rounded-xl bg-black hover:bg-gray-800 text-gold-400 text-xs font-bold shadow-md border border-gold-500/30"
                  >
                    {creatingEvent ? t('common.loading') : 'Create & License Wedding 💍'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 2: RESET PASSWORD MODAL
         ========================================================================= */}
      <AnimatePresence>
        {resettingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 border-2 border-gold-500 relative shadow-2xl space-y-4">
              <button
                onClick={() => setResettingUser(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                ✕
              </button>

              <h3 className="font-serif font-bold text-lg text-gray-900">
                {t('adminDashboard.users.resetPassword')} for {resettingUser.fullName}
              </h3>
              <p className="text-xs text-gray-500">
                Account: <strong>{resettingUser.email}</strong>
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-900 mb-1">
                    {t('adminDashboard.users.newPassword')}
                  </label>
                  <input
                    type="text"
                    required
                    value={newPasswordVal}
                    onChange={(e) => setNewPasswordVal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gold-500/30 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResettingUser(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-black text-gold-400 text-xs font-bold shadow-md border border-gold-500/30"
                  >
                    {t('adminDashboard.users.updatePasswordBtn')}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

```

### File: `frontend/src/app/admin/login/page.tsx`

```tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('admin@hamelmal.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.user?.role === 'SYSTEM_ADMIN') {
        router.push('/admin/dashboard');
      } else if (res.ok) {
        setError('Access denied. Only System Admins can access this master control portal.');
      } else {
        setError(data.error || t('auth.invalidCreds'));
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 flex items-center justify-center p-4 sm:p-6 selection:bg-gold-500 selection:text-black relative font-sans">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border-2 border-gold-500/40 shadow-xl bg-white">
        <div className="text-center mb-8">
          <img
            src="/branding/artboard-14.png"
            alt="Agafari (አጋፋሪ) Logo"
            className="h-14 w-auto mx-auto mb-4 object-contain"
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            {t('auth.adminTitle')}
          </h1>
          <p className="text-[10px] text-gold-600 font-semibold uppercase tracking-widest mt-1">
            {t('auth.adminSubtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-900 uppercase tracking-wider mb-1.5">
              {t('auth.emailLabel')}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hamelmal.com"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-gold-500/30 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <Mail className="w-4 h-4 text-gold-600 absolute left-4 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-900 uppercase tracking-wider mb-1.5">
              {t('auth.passwordLabel')}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-gold-500/30 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <Lock className="w-4 h-4 text-gold-600 absolute left-4 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-extrabold text-xs shadow-gold transition-all flex items-center justify-center gap-2 mt-4 border border-gold-400/40 disabled:opacity-50"
          >
            {loading ? t('auth.signingIn') : t('auth.signInBtn')}
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-500 font-semibold mb-1">Pre-configured Admin Login:</p>
          <div className="text-[11px] font-mono text-gray-900 font-bold">
            admin@hamelmal.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
}

```

### File: `frontend/src/app/api/admin/events/route.ts`

```typescript
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, hasRole } from '@/lib/auth';
import { mockStore, EventData, UserRecord } from '@/lib/mockData';

// GET: Fetch all wedding events across the platform with full credentials & statistics
export async function GET(req: NextRequest) {
  const user = getAuthUser(req);

  if (user && !hasRole(user, ['SYSTEM_ADMIN'])) {
    return NextResponse.json(
      { error: 'Unauthorized. System Admin access required.' },
      { status: 403 }
    );
  }

  const enrichedEvents = mockStore.events.map((evt) => {
    const eventUsers = mockStore.users.filter((u) => u.eventId === evt.id);
    const coupleUser = eventUsers.find((u) => u.role === 'BRIDE_GROOM') || {
      fullName: `${evt.brideName} & ${evt.groomName}`,
      email: evt.coupleCredentials?.email || `couple@${evt.slug}.com`,
      temporaryPassword: evt.coupleCredentials?.temporaryPassword || 'couple123',
      role: 'BRIDE_GROOM',
    };
    const organizerUser = eventUsers.find((u) => u.role === 'EVENT_ORGANIZER') || {
      fullName: 'Yonas Planners (Agency)',
      email: `organizer@${evt.slug}.com`,
      temporaryPassword: 'org123',
      role: 'EVENT_ORGANIZER',
    };
    const streamerUser = eventUsers.find((u) => u.role === 'LIVE_STREAMER') || {
      fullName: 'Assigned Streamer',
      email: `streamer@${evt.slug}.com`,
      temporaryPassword: 'stream123',
      role: 'LIVE_STREAMER',
    };
    const scannerUser = eventUsers.find((u) => u.role === 'GATE_SCANNER') || {
      fullName: 'Gate Scanner Team',
      email: `scanner@${evt.slug}.com`,
      temporaryPassword: 'scan123',
      role: 'GATE_SCANNER',
    };

    const totalInvites = mockStore.invitations.filter((i) => i.eventId === evt.id).length;
    const totalWishes = mockStore.wishes.filter((w) => w.eventId === evt.id).length;
    const totalMedia = mockStore.mediaAssets.filter((m) => m.eventId === evt.id).length;

    return {
      ...evt,
      adminApprovalStatus: evt.adminApprovalStatus || 'APPROVED',
      credentials: {
        couple: coupleUser,
        organizer: organizerUser,
        streamer: streamerUser,
        scanner: scannerUser,
      },
      stats: {
        totalInvites,
        totalWishes,
        totalMedia,
      },
    };
  });

  return NextResponse.json({ events: enrichedEvents });
}

// POST: Create a new wedding event (System Admin power)
export async function POST(req: NextRequest) {
  const user = getAuthUser(req);

  if (user && !hasRole(user, ['SYSTEM_ADMIN'])) {
    return NextResponse.json(
      { error: 'Unauthorized. System Admin access required.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      brideName,
      groomName,
      eventDate,
      venueName,
      venueAddress,
      dressCode,
      welcomeMessage,
      coupleEmail,
      youtubeVideoId,
    } = body;

    if (!title || !slug || !brideName || !groomName || !eventDate || !venueName) {
      return NextResponse.json(
        { error: 'Missing required event fields (title, slug, bride, groom, date, venue).' },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

    // Check if slug already exists
    const existing = mockStore.events.find((e) => e.slug === cleanSlug);
    if (existing) {
      return NextResponse.json(
        { error: `An event with slug '${cleanSlug}' already exists.` },
        { status: 400 }
      );
    }

    const tempPassword = `agafari${Math.floor(1000 + Math.random() * 9000)}`;

    const newEvent: EventData = {
      id: `evt-${cleanSlug}`,
      slug: cleanSlug,
      title: title.trim(),
      brideName: brideName.trim(),
      groomName: groomName.trim(),
      eventDate: new Date(eventDate).toISOString(),
      startTime: '14:00',
      venueName: venueName.trim(),
      venueAddress: venueAddress?.trim() || 'Addis Ababa, Ethiopia',
      venueMapUrl: `https://maps.google.com/?q=${encodeURIComponent(venueName)}`,
      dressCode: dressCode?.trim() || 'Traditional Habesha Kemis & Black Tie',
      welcomeMessage: welcomeMessage?.trim() || 'Welcome to our royal wedding celebration!',
      coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      status: 'COMING_SOON',
      adminApprovalStatus: 'APPROVED',
      coupleCredentials: {
        email: coupleEmail?.trim() || `couple@${cleanSlug}.com`,
        temporaryPassword: tempPassword,
      },
      youtubeVideoId: youtubeVideoId || 'dQw4w9WgXcQ',
      isLive: false,
    };

    mockStore.events.unshift(newEvent);

    return NextResponse.json(
      {
        success: true,
        message: 'Wedding event created and licensed successfully!',
        event: newEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create wedding event.' },
      { status: 500 }
    );
  }
}

// PATCH: Approve / Reject / Update event status or live broadcast
export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req);

  if (user && !hasRole(user, ['SYSTEM_ADMIN'])) {
    return NextResponse.json(
      { error: 'Unauthorized. System Admin access required.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { eventId, adminApprovalStatus, status, isLive, youtubeVideoId } = body;

    const event = mockStore.events.find((e) => e.id === eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    if (adminApprovalStatus) event.adminApprovalStatus = adminApprovalStatus;
    if (status) event.status = status;
    if (isLive !== undefined) event.isLive = isLive;
    if (youtubeVideoId !== undefined) event.youtubeVideoId = youtubeVideoId;

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully.',
      event,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update event.' },
      { status: 500 }
    );
  }
}

// DELETE: Archive or delete an event
export async function DELETE(req: NextRequest) {
  const user = getAuthUser(req);

  if (user && !hasRole(user, ['SYSTEM_ADMIN'])) {
    return NextResponse.json(
      { error: 'Unauthorized. System Admin access required.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required.' }, { status: 400 });
    }

    const index = mockStore.events.findIndex((e) => e.id === eventId);
    if (index === -1) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    mockStore.events.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete event.' },
      { status: 500 }
    );
  }
}

```

### File: `frontend/src/app/api/admin/users/route.ts`

```typescript
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, hasRole, hashPassword, UserRole } from '@/lib/auth';
import { mockStore } from '@/lib/mockData';

// GET: Fetch all user accounts across the platform
export async function GET(req: NextRequest) {
  const user = getAuthUser(req);

  if (user && !hasRole(user, ['SYSTEM_ADMIN'])) {
    return NextResponse.json(
      { error: 'Unauthorized. System Admin access required.' },
      { status: 403 }
    );
  }

  const safeUsers = mockStore.users.map((u) => ({
    id: u.id,
    eventId: u.eventId,
    email: u.email,
    fullName: u.fullName,
    role: u.role,
    temporaryPassword: u.temporaryPassword,
  }));

  return NextResponse.json({ users: safeUsers });
}

// POST: Create a new account and assign role & event scope
export async function POST(req: NextRequest) {
  const adminUser = getAuthUser(req);

  if (adminUser && !hasRole(adminUser, ['SYSTEM_ADMIN'])) {
    return NextResponse.json(
      { error: 'Unauthorized. System Admin access required.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { email, password, fullName, role, eventId } = body;

    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { error: 'Email, password, full name, and role are required.' },
        { status: 400 }
      );
    }

    const existingUser = mockStore.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (existingUser) {
      return NextResponse.json(
        { error: `An account with email '${email}' already exists.` },
        { status: 400 }
      );
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      eventId: eventId || null,
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      temporaryPassword: password,
      fullName: fullName.trim(),
      role: role as UserRole,
    };

    mockStore.users.push(newUser);

    return NextResponse.json(
      {
        success: true,
        message: `Account created successfully with role '${role}'.`,
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          eventId: newUser.eventId,
          temporaryPassword: newUser.temporaryPassword,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user account.' },
      { status: 500 }
    );
  }
}

// PATCH: Reset password or change role
export async function PATCH(req: NextRequest) {
  const adminUser = getAuthUser(req);

  if (adminUser && !hasRole(adminUser, ['SYSTEM_ADMIN'])) {
    return NextResponse.json(
      { error: 'Unauthorized. System Admin access required.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { userId, newPassword, fullName, role } = body;

    const user = mockStore.users.find((u) => u.id === userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    if (newPassword) {
      user.passwordHash = hashPassword(newPassword);
      user.temporaryPassword = newPassword;
    }
    if (fullName) user.fullName = fullName.trim();
    if (role) user.role = role as UserRole;

    return NextResponse.json({
      success: true,
      message: 'User account updated successfully.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user account.' },
      { status: 500 }
    );
  }
}

// DELETE: Delete user account
export async function DELETE(req: NextRequest) {
  const adminUser = getAuthUser(req);

  if (adminUser && !hasRole(adminUser, ['SYSTEM_ADMIN'])) {
    return NextResponse.json(
      { error: 'Unauthorized. System Admin access required.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required.' }, { status: 400 });
    }

    const index = mockStore.users.findIndex((u) => u.id === userId);
    if (index === -1) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    mockStore.users.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: 'User account deleted successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user.' },
      { status: 500 }
    );
  }
}

```

### File: `frontend/src/app/api/auth/login/route.ts`

```typescript
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generateToken, verifyPassword } from '@/lib/auth';
import { mockStore } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = mockStore.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      eventId: user.eventId,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        eventId: user.eventId,
      },
      token,
    });

    // Set HttpOnly Cookie for security
    response.cookies.set({
      name: 'agafari_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}

```

### File: `frontend/src/app/api/auth/me/route.ts`

```typescript
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { mockStore } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const authPayload = getAuthUser(req);

  if (!authPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = mockStore.users.find((u) => u.id === authPayload.userId);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      eventId: user.eventId,
    },
  });
}

```

### File: `frontend/src/app/api/events/[slug]/invitations/route.ts`

```typescript
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, hasRole } from '@/lib/auth';
import { mockStore, InvitationData } from '@/lib/mockData';

// GET: Fetch all unique guest invitations for an event, or single invitation by code
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  const event = mockStore.events.find((e) => e.slug === slug);
  if (!event) {
    return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
  }

  if (code) {
    const invitation = mockStore.invitations.find(
      (i) => i.eventId === event.id && (i.inviteCode === code || i.id === code)
    );
    return NextResponse.json({ invitation: invitation || null });
  }

  const invitations = mockStore.invitations.filter((i) => i.eventId === event.id);
  return NextResponse.json({ invitations });
}

// POST: Generate a new unique guest invitation with headcount quota
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const user = getAuthUser(req);

  // In demo / prototype mode, allow couple actions
  if (user && !hasRole(user, ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'BRIDE_GROOM'])) {
    return NextResponse.json(
      { error: 'Unauthorized. Couple or Organizer access required.' },
      { status: 403 }
    );
  }

  const event = mockStore.events.find((e) => e.slug === slug);
  if (!event) {
    return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { guestName, guestPhone, maxGuests, inviteType } = body;

    if (!guestName || !maxGuests) {
      return NextResponse.json(
        { error: 'Guest name and headcount quota are required.' },
        { status: 400 }
      );
    }

    const uniqueId = `inv-${Date.now().toString().slice(-4)}`;
    const inviteCode = `INV-SD2026-${Math.floor(100 + Math.random() * 900)}`;

    const newInvitation: InvitationData = {
      id: uniqueId,
      eventId: event.id,
      inviteCode,
      guestName: guestName.trim(),
      guestPhone: guestPhone?.trim() || '',
      maxGuests: Number(maxGuests),
      inviteType: inviteType === 'LINK' ? 'LINK' : 'CARD',
      rsvpStatus: 'PENDING',
      scannedCount: 0,
      isScanned: false,
      qrCodeUrl: `/api/qr/${inviteCode}`,
      createdAt: new Date().toISOString(),
    };

    mockStore.invitations.unshift(newInvitation);

    return NextResponse.json(
      {
        success: true,
        message: `${newInvitation.inviteType === 'CARD' ? 'Physical Card QR Pass' : 'Unique Invitation Link'} generated successfully!`,
        invitation: newInvitation,
        shareableUrl: `/event/${slug}?code=${inviteCode}&guest=${encodeURIComponent(guestName.trim())}`,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate unique invitation.' },
      { status: 500 }
    );
  }
}

// PATCH: Gate Security Verification & Atomic Check-In Endpoint
export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  const event = mockStore.events.find((e) => e.slug === slug);
  if (!event) {
    return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { inviteCode, checkInCount = 1 } = body;

    if (!inviteCode) {
      return NextResponse.json({ error: 'Invite code is required for gate check-in.' }, { status: 400 });
    }

    const codeToMatch = inviteCode.trim().toUpperCase();
    const invitation = mockStore.invitations.find(
      (i) => i.eventId === event.id && i.inviteCode.toUpperCase() === codeToMatch
    );

    if (!invitation) {
      return NextResponse.json(
        {
          status: 'INVALID',
          message: 'Access Denied: Unrecognized or counterfeit QR code signature.',
        },
        { status: 404 }
      );
    }

    // Check if quota is already fully used
    if (invitation.isScanned && invitation.scannedCount >= invitation.maxGuests) {
      return NextResponse.json(
        {
          status: 'ALREADY_SCANNED',
          message: `WARNING: Pass was already fully checked in at ${invitation.scannedAt || 'earlier today'}. Headcount limit reached (${invitation.scannedCount}/${invitation.maxGuests}).`,
          invitation,
        },
        { status: 409 }
      );
    }

    // Perform atomic headcount update
    const increment = Number(checkInCount) || 1;
    invitation.scannedCount = Math.min(invitation.maxGuests, invitation.scannedCount + increment);
    invitation.isScanned = true;
    invitation.scannedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    invitation.rsvpStatus = 'ATTENDING';

    return NextResponse.json({
      status: 'VALID',
      message: `Verified: ${invitation.guestName} (${invitation.scannedCount}/${invitation.maxGuests} Headcount Checked In)`,
      invitation,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process gate verification.' }, { status: 500 });
  }
}


```

### File: `frontend/src/app/api/events/[slug]/media/route.ts`

```typescript
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { mockStore, MediaAssetData } from '@/lib/mockData';

// GET: Public endpoint to fetch approved TikTok memory feed items for an event
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const event = mockStore.events.find((e) => e.slug === slug);

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  // Ensure default media assets exist if list is empty
  let assets = mockStore.mediaAssets.filter((m) => m.eventId === event.id);

  if (assets.length === 0) {
    const defaultReels: MediaAssetData[] = [
      {
        id: `med-vid-${Date.now()}-1`,
        eventId: event.id,
        uploaderName: 'Bride Maid Team',
        mediaType: 'VIDEO',
        cdnUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-in-a-park-on-their-wedding-day-43185-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop',
        caption: 'Magical moment from the bridal photo session! ✨ #SaraAndDawit2026',
        viewsCount: 438,
        likesCount: 215,
        status: 'APPROVED',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: `med-vid-${Date.now()}-2`,
        eventId: event.id,
        uploaderName: 'Best Man Robel',
        mediaType: 'VIDEO',
        cdnUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-smiling-and-holding-hands-43183-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop',
        caption: 'Traditional Eskista dance moments at the rehearsal! 💃🕺 #RoyalWedding',
        viewsCount: 680,
        likesCount: 342,
        status: 'APPROVED',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ];
    mockStore.mediaAssets.push(...defaultReels);
    assets = defaultReels;
  }

  const approved = assets.filter((m) => m.status === 'APPROVED');
  return NextResponse.json({
    mediaAssets: approved.length > 0 ? approved : assets,
  });
}

// POST: Public endpoint for guests to upload photo or short video memory
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const event = mockStore.events.find((e) => e.slug === slug);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const body = await req.json();
    const { uploaderName, caption, mediaType, cdnUrl } = body;

    if (!uploaderName || !caption) {
      return NextResponse.json(
        { error: 'Uploader name and caption are required.' },
        { status: 400 }
      );
    }

    const fallbackVideo = 'https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-in-a-park-on-their-wedding-day-43185-large.mp4';

    const newMedia: MediaAssetData = {
      id: `med-${Date.now()}`,
      eventId: event.id,
      uploaderName: uploaderName.trim(),
      mediaType: mediaType === 'VIDEO' ? 'VIDEO' : 'VIDEO',
      cdnUrl: cdnUrl || fallbackVideo,
      thumbnailUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop',
      caption: caption.trim(),
      viewsCount: 1,
      likesCount: 0,
      status: 'APPROVED', // Immediately approved so guest sees it live
      createdAt: new Date().toISOString(),
    };

    mockStore.mediaAssets.unshift(newMedia);

    return NextResponse.json(
      {
        success: true,
        message: 'Memory uploaded and published to the live feed!',
        mediaAsset: newMedia,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload memory asset.' },
      { status: 500 }
    );
  }
}

```

### File: `frontend/src/app/api/events/[slug]/route.ts`

```typescript
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { mockStore, EventData } from '@/lib/mockData';

// GET: Fetch event details
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const event = mockStore.events.find((e) => e.slug === slug);

  if (!event) {
    return NextResponse.json(
      { error: `Event with slug '${slug}' not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({ event });
}

// PUT / PATCH: Couple creates or updates their wedding celebration details
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const event = mockStore.events.find((e) => e.slug === slug);

  if (!event) {
    return NextResponse.json(
      { error: `Event with slug '${slug}' not found` },
      { status: 404 }
    );
  }

  try {
    const body = await req.json();
    const {
      brideName,
      groomName,
      coverImageUrl,
      venueName,
      venueAddress,
      venueMapUrl,
      eventDate,
      startTime,
      secondEventDate,
      dressCode,
      welcomeMessage,
      backgroundMusicUrl,
      backgroundMusicTitle,
    } = body;

    if (brideName) event.brideName = brideName.trim();
    if (groomName) event.groomName = groomName.trim();
    if (brideName && groomName) {
      event.title = `${event.brideName} & ${event.groomName}'s Royal Wedding`;
    }
    if (coverImageUrl) event.coverImageUrl = coverImageUrl.trim();
    if (venueName) event.venueName = venueName.trim();
    if (venueAddress) event.venueAddress = venueAddress.trim();
    if (venueMapUrl) event.venueMapUrl = venueMapUrl.trim();
    if (eventDate) event.eventDate = eventDate;
    if (startTime) event.startTime = startTime;
    if (secondEventDate) event.secondEventDate = secondEventDate;
    if (dressCode) event.dressCode = dressCode.trim();
    if (welcomeMessage) event.welcomeMessage = welcomeMessage.trim();
    if (backgroundMusicUrl !== undefined) event.backgroundMusicUrl = backgroundMusicUrl.trim();
    if (backgroundMusicTitle !== undefined) event.backgroundMusicTitle = backgroundMusicTitle.trim();

    return NextResponse.json({
      success: true,
      message: 'Wedding celebration details updated successfully!',
      event,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update event details.' },
      { status: 500 }
    );
  }
}

```

### File: `frontend/src/app/api/events/[slug]/rsvp/route.ts`

```typescript
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockData';

export interface RsvpRecord {
  id: string;
  eventId: string;
  inviteCode?: string;
  guestName: string;
  guestPhone: string;
  attendanceStatus: 'ATTENDING' | 'MAYBE' | 'DECLINED';
  attendingCount: number;
  songRecommendation?: string;
  createdAt: string;
}

// In-memory store for RSVPs
const mockRsvps: RsvpRecord[] = [
  {
    id: 'rsvp-1',
    eventId: 'evt-sara-dawit-2026',
    inviteCode: 'INV-SD2026-001',
    guestName: 'Abebe Kebede & Family',
    guestPhone: '+251911223344',
    attendanceStatus: 'ATTENDING',
    attendingCount: 2,
    songRecommendation: 'Orthodox Wedding Choir - Serege',
    createdAt: new Date().toISOString(),
  },
];

// GET: List RSVPs for an event
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const event = mockStore.events.find((e) => e.slug === slug);
  if (!event) {
    return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
  }

  const list = mockRsvps.filter((r) => r.eventId === event.id);
  return NextResponse.json({ rsvps: list });
}

// POST: Submit RSVP response ("Will You Come?")
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const event = mockStore.events.find((e) => e.slug === slug);
  if (!event) {
    return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const status = body.attendanceStatus || body.status;
    const guestName = body.guestName;
    const inviteCode = body.inviteCode;
    const guestPhone = body.guestPhone;
    const attendingCount = body.attendingCount || body.guestCount;

    if (!guestName || !status) {
      return NextResponse.json(
        { error: 'Guest name and attendance status are required.' },
        { status: 400 }
      );
    }

    const newRsvp: RsvpRecord = {
      id: `rsvp-${Date.now()}`,
      eventId: event.id,
      inviteCode: inviteCode || 'GUEST-PUBLIC',
      guestName: guestName.trim(),
      guestPhone: guestPhone?.trim() || '',
      attendanceStatus: status,
      attendingCount: status === 'ATTENDING' ? Number(attendingCount || 1) : 0,
      createdAt: new Date().toISOString(),
    };

    mockRsvps.unshift(newRsvp);

    // If inviteCode matches an existing invitation record, mark it
    if (inviteCode) {
      const inv = mockStore.invitations.find((i) => i.inviteCode === inviteCode);
      if (inv) {
        inv.isScanned = true;
      }
    }

    let feedbackMessage = '✓ Response received!';
    if (status === 'ATTENDING') {
      feedbackMessage = '✓ በደስታ እንጠብቅዎታለን! (Attending Confirmed)';
    } else if (status === 'MAYBE') {
      feedbackMessage = '✓ እናመሰግናለን! ዝርዝሩን በሚወስኑበት ጊዜ ማስተካከል ይችላሉ። (Response Recorded)';
    } else {
      feedbackMessage = '✓ እናመሰግናለን! የሙሽሮቹ መልካም ምኞት ከእርስዎ ጋር ይሁን። (Declined Recorded)';
    }

    return NextResponse.json(
      {
        success: true,
        message: feedbackMessage,
        rsvp: newRsvp,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save RSVP.' },
      { status: 500 }
    );
  }
}

```

### File: `frontend/src/app/api/events/[slug]/team/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { mockStore, UserRecord } from '@/lib/mockData';
import { hashPassword } from '@/lib/auth';

// GET: Fetch team members (Live Streamers & QR Gate Scanners) assigned to the event
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const event = mockStore.events.find((e) => e.slug === slug);

  if (!event) {
    return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
  }

  const teamMembers = mockStore.users.filter(
    (u) =>
      u.eventId === event.id &&
      (u.role === 'LIVE_STREAMER' || u.role === 'GATE_SCANNER')
  );

  return NextResponse.json({
    teamMembers: teamMembers.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
    })),
  });
}

// POST: Couple assigns a new Live Streamer or QR Gate Scanner
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const event = mockStore.events.find((e) => e.slug === slug);

    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    const body = await req.json();
    const { fullName, email, password, role } = body;

    if (!fullName || !email || !password || !['LIVE_STREAMER', 'GATE_SCANNER'].includes(role)) {
      return NextResponse.json(
        { error: 'Full name, email, password, and valid role (LIVE_STREAMER or GATE_SCANNER) are required.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = mockStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return NextResponse.json(
        { error: 'A staff member with this email already exists.' },
        { status: 400 }
      );
    }

    const newUser: UserRecord = {
      id: `usr-staff-${Date.now().toString().slice(-4)}`,
      eventId: event.id,
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      passwordHash: hashPassword(password),
      role,
    };

    mockStore.users.push(newUser);

    return NextResponse.json(
      {
        success: true,
        message: `Assigned ${role === 'LIVE_STREAMER' ? 'Live Streamer' : 'QR Gate Scanner'} successfully!`,
        teamMember: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to assign team member.' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a staff assignment
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const index = mockStore.users.findIndex((u) => u.id === userId);
    if (index === -1) {
      return NextResponse.json({ error: 'Staff member not found.' }, { status: 404 });
    }

    mockStore.users.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: 'Staff role removed successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove staff member.' },
      { status: 500 }
    );
  }
}

```

### File: `frontend/src/app/api/events/[slug]/wishes/route.ts`

```typescript
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { mockStore, WishData } from '@/lib/mockData';

// GET: Public endpoint to fetch approved wishes for Coming Soon page
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const event = mockStore.events.find((e) => e.slug === slug);

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  const approvedWishes = mockStore.wishes.filter(
    (w) => w.eventId === event.id && w.status === 'APPROVED'
  );

  return NextResponse.json({ wishes: approvedWishes });
}

// POST: Public endpoint for guests to submit a wish (placed into PENDING status for bride/organizer approval)
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const event = mockStore.events.find((e) => e.slug === slug);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const body = await req.json();
    const { senderName, message, mediaType, videoUrl } = body;

    if (!senderName || !message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Sender name and wish message are required' },
        { status: 400 }
      );
    }

    const newWish: WishData = {
      id: `wsh-${Date.now()}`,
      eventId: event.id,
      senderName: senderName.trim(),
      message: message.trim(),
      mediaType: mediaType === 'VIDEO' ? 'VIDEO' : 'TEXT',
      videoUrl: videoUrl || (mediaType === 'VIDEO' ? 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-smiling-and-holding-hands-43183-large.mp4' : undefined),
      status: 'APPROVED', // Approved so guest immediately sees their blessing on the wall
      createdAt: new Date().toISOString(),
    };

    mockStore.wishes.unshift(newWish);

    return NextResponse.json(
      {
        success: true,
        message: 'Your wish has been submitted and published to the wish wall!',
        wish: newWish,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit wish' },
      { status: 500 }
    );
  }
}

```

### File: `frontend/src/app/api/organizer/events/route.ts`

```typescript
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { mockStore, EventData, UserRecord } from '@/lib/mockData';
import { hashPassword } from '@/lib/auth';

// GET: Fetch all weddings for the Event Organizer (with credentials and approval status)
export async function GET(req: NextRequest) {
  // Enrich events with their associated role credentials
  const enrichedEvents = mockStore.events.map((evt) => {
    const eventUsers = mockStore.users.filter((u) => u.eventId === evt.id);
    const coupleUser = eventUsers.find((u) => u.role === 'BRIDE_GROOM') || {
      fullName: `${evt.brideName} & ${evt.groomName}`,
      email: evt.coupleCredentials?.email || `couple@${evt.slug}.com`,
      temporaryPassword: evt.coupleCredentials?.temporaryPassword || 'couple123',
      role: 'BRIDE_GROOM',
    };
    const streamerUser = eventUsers.find((u) => u.role === 'LIVE_STREAMER') || {
      fullName: 'Assigned Streamer',
      email: `streamer@${evt.slug}.com`,
      temporaryPassword: 'stream123',
      role: 'LIVE_STREAMER',
    };
    const scannerUser = eventUsers.find((u) => u.role === 'GATE_SCANNER') || {
      fullName: 'Gate Scanner Team',
      email: `scanner@${evt.slug}.com`,
      temporaryPassword: 'scan123',
      role: 'GATE_SCANNER',
    };

    const totalInvites = mockStore.invitations.filter((i) => i.eventId === evt.id).length;
    const totalWishes = mockStore.wishes.filter((w) => w.eventId === evt.id).length;
    const totalMedia = mockStore.mediaAssets.filter((m) => m.eventId === evt.id).length;

    return {
      ...evt,
      adminApprovalStatus: evt.adminApprovalStatus || 'APPROVED',
      credentials: {
        couple: coupleUser,
        streamer: streamerUser,
        scanner: scannerUser,
      },
      stats: {
        totalInvites,
        totalWishes,
        totalMedia,
      },
    };
  });

  return NextResponse.json({ events: enrichedEvents });
}

// POST: Organizer requests creation of a new Wedding & Couple Credentials (Requires Admin Approval)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      brideName,
      groomName,
      eventDate,
      venueName,
      venueAddress,
      coupleEmail,
      packageTier,
      notes,
    } = body;

    if (!brideName || !groomName || !eventDate || !venueName || !coupleEmail) {
      return NextResponse.json(
        { error: 'Missing required wedding information (Bride, Groom, Date, Venue, Couple Email).' },
        { status: 400 }
      );
    }

    const cleanSlug = `${brideName.toLowerCase().replace(/[^a-z0-9]/g, '')}-and-${groomName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${new Date(eventDate).getFullYear()}`;

    // Check if slug exists
    const existing = mockStore.events.find((e) => e.slug === cleanSlug);
    if (existing) {
      return NextResponse.json(
        { error: `A wedding event with slug '${cleanSlug}' already exists.` },
        { status: 400 }
      );
    }

    const tempPassword = `agafari${Math.floor(1000 + Math.random() * 9000)}`;

    const newEvent: EventData = {
      id: `evt-${cleanSlug}`,
      slug: cleanSlug,
      title: `${brideName.trim()} & ${groomName.trim()}'s Royal Wedding`,
      brideName: brideName.trim(),
      groomName: groomName.trim(),
      eventDate: new Date(eventDate).toISOString(),
      startTime: '14:00',
      venueName: venueName.trim(),
      venueAddress: venueAddress?.trim() || 'Addis Ababa, Ethiopia',
      venueMapUrl: `https://maps.google.com/?q=${encodeURIComponent(venueName)}`,
      dressCode: 'Traditional Habesha Kemis & Black Tie',
      welcomeMessage: `Welcome to the royal wedding celebration of ${brideName} and ${groomName}!`,
      coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      status: 'COMING_SOON',
      adminApprovalStatus: 'PENDING', // Awaiting Admin Approval
      coupleCredentials: {
        email: coupleEmail.trim().toLowerCase(),
        temporaryPassword: tempPassword,
      },
      isLive: false,
    };

    // Create Couple User Account
    const newCoupleUser: UserRecord = {
      id: `usr-couple-${Date.now()}`,
      eventId: newEvent.id,
      email: coupleEmail.trim().toLowerCase(),
      passwordHash: hashPassword(tempPassword),
      temporaryPassword: tempPassword,
      fullName: `${brideName.trim()} & ${groomName.trim()}`,
      role: 'BRIDE_GROOM',
    };

    mockStore.events.unshift(newEvent);
    mockStore.users.push(newCoupleUser);

    return NextResponse.json(
      {
        success: true,
        message: 'Wedding onboard request submitted for System Admin approval!',
        event: newEvent,
        credentials: {
          email: coupleEmail,
          temporaryPassword: tempPassword,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process event creation request.' },
      { status: 500 }
    );
  }
}

// PATCH: Approve / Update Event Approval Status (Simulated Admin Approval for Organizer demo)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, adminApprovalStatus } = body;

    const event = mockStore.events.find((e) => e.id === eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    if (adminApprovalStatus) {
      event.adminApprovalStatus = adminApprovalStatus;
    }

    return NextResponse.json({
      success: true,
      message: `Event approval status updated to ${adminApprovalStatus}!`,
      event,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update approval status.' },
      { status: 500 }
    );
  }
}

```

### File: `frontend/src/app/api/organizer/media/comments/route.ts`

```typescript
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockData';

interface MediaCommentRecord {
  id: string;
  mediaId: string;
  senderName: string;
  comment: string;
  createdAt: string;
}

// In-memory store for comments on videos
const mockComments: MediaCommentRecord[] = [
  {
    id: 'c1',
    mediaId: 'med-1',
    senderName: 'Uncle Bekele',
    comment: 'You look so beautiful Sara! Egziabhier Yibarkachihu!',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'c2',
    mediaId: 'med-1',
    senderName: 'Helen Girma',
    comment: 'The dress is unbelievable! Best wedding of 2026! 🔥❤️',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

// GET comments for a video
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mediaId = searchParams.get('mediaId');

  let list = mockComments;
  if (mediaId) {
    list = list.filter((c) => c.mediaId === mediaId);
  }

  return NextResponse.json({ comments: list });
}

// POST new comment/wish on a video
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mediaId, senderName, comment } = body;

    if (!mediaId || !senderName || !comment) {
      return NextResponse.json(
        { error: 'mediaId, senderName, and comment are required.' },
        { status: 400 }
      );
    }

    const newComment: MediaCommentRecord = {
      id: `c-${Date.now()}`,
      mediaId,
      senderName: senderName.trim(),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    mockComments.unshift(newComment);

    return NextResponse.json(
      {
        success: true,
        message: 'Comment added successfully.',
        comment: newComment,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add comment.' },
      { status: 500 }
    );
  }
}

```

### File: `frontend/src/app/api/organizer/media/route.ts`

```typescript
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, hasRole } from '@/lib/auth';
import { mockStore } from '@/lib/mockData';

// GET: Fetch all media assets (TikTok video feed items) for moderation
export async function GET(req: NextRequest) {
  const user = getAuthUser(req);

  if (user && !hasRole(user, ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'BRIDE_GROOM'])) {
    return NextResponse.json(
      { error: 'Unauthorized access.' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');

  let assets = mockStore.mediaAssets;
  if (eventId) {
    assets = assets.filter((m) => m.eventId === eventId);
  }

  return NextResponse.json({ mediaAssets: assets });
}

// PATCH: Approve or Reject a media asset
export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req);

  if (user && !hasRole(user, ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'BRIDE_GROOM'])) {
    return NextResponse.json(
      { error: 'Unauthorized.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { mediaId, status } = body;

    if (!mediaId || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid mediaId and status required.' },
        { status: 400 }
      );
    }

    const asset = mockStore.mediaAssets.find((m) => m.id === mediaId);
    if (!asset) {
      return NextResponse.json({ error: 'Media asset not found.' }, { status: 404 });
    }

    asset.status = status;

    return NextResponse.json({
      success: true,
      message: `Media asset ${status.toLowerCase()} successfully.`,
      mediaAsset: asset,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update media status.' },
      { status: 500 }
    );
  }
}

// DELETE: Manually purge a rejected file permanently from vault (Bride & Groom request)
export async function DELETE(req: NextRequest) {
  const user = getAuthUser(req);

  if (!hasRole(user, ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'BRIDE_GROOM'])) {
    return NextResponse.json(
      { error: 'Unauthorized.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const mediaId = searchParams.get('mediaId');

    if (!mediaId) {
      return NextResponse.json({ error: 'Media ID required.' }, { status: 400 });
    }

    const index = mockStore.mediaAssets.findIndex((m) => m.id === mediaId);
    if (index === -1) {
      return NextResponse.json({ error: 'Media asset not found.' }, { status: 404 });
    }

    mockStore.mediaAssets.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: 'Media asset permanently deleted from vault.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete media asset.' },
      { status: 500 }
    );
  }
}

```

### File: `frontend/src/app/api/organizer/wishes/route.ts`

```typescript
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, hasRole } from '@/lib/auth';
import { mockStore } from '@/lib/mockData';

// GET: Fetch all wishes for event organizer / bride / groom
export async function GET(req: NextRequest) {
  const user = getAuthUser(req);

  if (!hasRole(user, ['EVENT_ORGANIZER', 'BRIDE_GROOM', 'SYSTEM_ADMIN'])) {
    return NextResponse.json(
      { error: 'Unauthorized. Only organizers and couples can manage wishes.' },
      { status: 403 }
    );
  }

  let wishes = mockStore.wishes;
  if (user?.role !== 'SYSTEM_ADMIN' && user?.eventId) {
    wishes = wishes.filter((w) => w.eventId === user.eventId);
  }

  return NextResponse.json({ wishes });
}

// PATCH: Approve or Reject a wish
export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req);

  if (!hasRole(user, ['EVENT_ORGANIZER', 'BRIDE_GROOM', 'SYSTEM_ADMIN'])) {
    return NextResponse.json(
      { error: 'Unauthorized. Only organizers and couples can approve wishes.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { wishId, status } = body;

    if (!wishId || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid wishId and status (APPROVED or REJECTED) are required' },
        { status: 400 }
      );
    }

    const wish = mockStore.wishes.find((w) => w.id === wishId);

    if (!wish) {
      return NextResponse.json({ error: 'Wish not found' }, { status: 404 });
    }

    if (user?.role !== 'SYSTEM_ADMIN' && user?.eventId && wish.eventId !== user.eventId) {
      return NextResponse.json(
        { error: 'Access denied: wish belongs to another event' },
        { status: 403 }
      );
    }

    wish.status = status;

    return NextResponse.json({
      success: true,
      message: `Wish has been ${status.toLowerCase()}`,
      wish,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update wish status' },
      { status: 500 }
    );
  }
}

```

### File: `frontend/src/app/api/qr/[code]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  if (!code) {
    return NextResponse.json({ error: 'Code parameter is required' }, { status: 400 });
  }

  try {
    // Generate high-density SVG QR Code with High Error Correction Level 'H' (allows 30% smudge/damage recovery)
    const qrSvg = await QRCode.toString(code, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#000000', // Crisp dark color
        light: '#FFFFFF',
      },
    });

    return new NextResponse(qrSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Failed to generate dynamic QR SVG:', error);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}

```

### File: `frontend/src/app/couple/dashboard/page.tsx`

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ExternalLink, 
  Video, 
  Image as ImageIcon, 
  Download, 
  LogOut, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Users, 
  Film, 
  Radio,
  Send,
  Clock,
  Check,
  Plus,
  Copy,
  Share2,
  QrCode,
  UserCheck,
  ScanLine,
  Crown,
  ShieldCheck,
  Printer,
  Search,
  Menu,
  X,
  Settings,
  Shirt,
  Upload,
  Save,
  Music
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

interface EventData {
  id: string;
  slug: string;
  title: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  startTime?: string;
  venueName: string;
  venueAddress: string;
  venueMapUrl: string;
  dressCode?: string;
  welcomeMessage?: string;
  coverImageUrl?: string;
  status: string;
}

interface WishData {
  id: string;
  eventId: string;
  senderName: string;
  message: string;
  mediaType?: 'TEXT' | 'VIDEO';
  videoUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

interface MediaAssetData {
  id: string;
  eventId: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE';
  cdnUrl: string;
  thumbnailUrl?: string;
  caption: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

interface InvitationRecord {
  id: string;
  inviteCode: string;
  guestName: string;
  guestPhone: string;
  maxGuests: number;
  inviteType: 'CARD' | 'LINK';
  rsvpStatus: 'ATTENDING' | 'DECLINED' | 'PENDING';
  attendingHeadcount?: number;
  scannedCount: number;
  isScanned: boolean;
  qrCodeUrl: string;
  createdAt?: string;
}

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: 'LIVE_STREAMER' | 'GATE_SCANNER';
}

export default function CoupleDashboardPage() {
  const { t } = useTranslation();
  const [event, setEvent] = useState<EventData | null>(null);
  const [wishes, setWishes] = useState<WishData[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetData[]>([]);
  const [invitations, setInvitations] = useState<InvitationRecord[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Sidebar Navigation Tab ('SETUP' | 'INVITES' | 'STAFF' | 'MEDIA' | 'BROADCAST' | 'THANK_YOU')
  const [activeTab, setActiveTab] = useState<'SETUP' | 'INVITES' | 'STAFF' | 'MEDIA' | 'BROADCAST' | 'THANK_YOU'>('INVITES');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // 0. Wedding Setup / Creation State
  const [brideName, setBrideName] = useState('Sara Tadesse');
  const [groomName, setGroomName] = useState('Dawit Alemayehu');
  const [coverImageUrl, setCoverImageUrl] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [venueName, setVenueName] = useState('Sheraton Addis Luxury Ballroom');
  const [venueAddress, setVenueAddress] = useState('Taitu Street, Addis Ababa, Ethiopia');
  const [venueMapUrl, setVenueMapUrl] = useState('https://maps.google.com/?q=Sheraton+Addis');
  const [eventDate, setEventDate] = useState('2026-08-15');
  const [startTime, setStartTime] = useState('14:00');
  const [dressCode, setDressCode] = useState('Traditional Habesha Kemis & Black Tie');
  const [welcomeMessage, setWelcomeMessage] = useState('We are overjoyed to celebrate the beginning of our forever journey with our beloved family and friends!');
  const [backgroundMusicUrl, setBackgroundMusicUrl] = useState('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=wedding-march-11226.mp3');
  const [backgroundMusicTitle, setBackgroundMusicTitle] = useState('ለይኩኑ (Leykunu Orthodox Wedding Mezmur)');
  const [backgroundAudioFile, setBackgroundAudioFile] = useState<File | null>(null);
  const [savingSetup, setSavingSetup] = useState(false);
  const [setupSuccessMsg, setSetupSuccessMsg] = useState('');

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundAudioFile(file);
      const url = URL.createObjectURL(file);
      setBackgroundMusicUrl(url);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const url = URL.createObjectURL(file);
      setCoverImageUrl(url);
    }
  };

  // Search & Filter States for Guests
  const [guestSearchQuery, setGuestSearchQuery] = useState('');
  const [guestRsvpFilter, setGuestRsvpFilter] = useState<'ALL' | 'ATTENDING' | 'DECLINED' | 'PENDING'>('ALL');
  const [selectedInviteForQr, setSelectedInviteForQr] = useState<InvitationRecord | null>(null);

  // 1. Guest Invitation Creation State
  const [inviteMode, setInviteMode] = useState<'CARD' | 'LINK'>('CARD');
  const [inviteGuestName, setInviteGuestName] = useState('');
  const [inviteGuestPhone, setInviteGuestPhone] = useState('');
  const [inviteMaxGuests, setInviteMaxGuests] = useState(2);
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const [generatingInvite, setGeneratingInvite] = useState(false);

  // 2. Staff Role Assignment State
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('pass123');
  const [staffRole, setStaffRole] = useState<'LIVE_STREAMER' | 'GATE_SCANNER'>('GATE_SCANNER');
  const [assigningStaff, setAssigningStaff] = useState(false);
  const [staffSuccessMsg, setStaffSuccessMsg] = useState('');

  // 3. Media Moderation Sub-Tab
  const [mediaFilterTab, setMediaFilterTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  // 4. Wedding Day Broadcast State
  const [broadcastMessage, setBroadcastMessage] = useState(
    "Warm greetings from Sara & Dawit! Our wedding celebration is this Saturday at Sheraton Addis. Gate check-in starts promptly at 1:00 PM. Please have your QR entrance code ready at the gate!"
  );
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);

  // 5. Post-Wedding Thank You State
  const [thankYouMessage, setThankYouMessage] = useState(
    "Dearest family and friends, thank you from the bottom of our hearts for being part of our special day. Your love, joyous dances, and heartfelt prayers made our wedding unforgettable! - Sara & Dawit"
  );
  const [thankYouImageUrl, setThankYouImageUrl] = useState(
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
  );
  const [thankYouImageFile, setThankYouImageFile] = useState<File | null>(null);
  const [thankYouSent, setThankYouSent] = useState(false);
  const [sendingThankYou, setSendingThankYou] = useState(false);

  const handleThankYouImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThankYouImageFile(file);
      const url = URL.createObjectURL(file);
      setThankYouImageUrl(url);
    }
  };

  useEffect(() => {
    async function loadCoupleData() {
      try {
        const [eventRes, wishesRes, mediaRes, invitesRes, teamRes] = await Promise.all([
          fetch('/api/events/sara-and-dawit-2026'),
          fetch('/api/events/sara-and-dawit-2026/wishes'),
          fetch('/api/events/sara-and-dawit-2026/media'),
          fetch('/api/events/sara-and-dawit-2026/invitations'),
          fetch('/api/events/sara-and-dawit-2026/team'),
        ]);

        if (eventRes.ok) {
          const data = await eventRes.json();
          setEvent(data.event);
          if (data.event) {
            setBrideName(data.event.brideName || 'Sara Tadesse');
            setGroomName(data.event.groomName || 'Dawit Alemayehu');
            setCoverImageUrl(data.event.coverImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop');
            setVenueName(data.event.venueName || 'Sheraton Addis Luxury Ballroom');
            setVenueAddress(data.event.venueAddress || 'Taitu Street, Addis Ababa, Ethiopia');
            setVenueMapUrl(data.event.venueMapUrl || 'https://maps.google.com/?q=Sheraton+Addis');
            setDressCode(data.event.dressCode || 'Traditional Habesha Kemis & Black Tie');
            setWelcomeMessage(data.event.welcomeMessage || 'We are overjoyed to celebrate our wedding with you!');
            if (data.event.backgroundMusicUrl) {
              setBackgroundMusicUrl(data.event.backgroundMusicUrl);
            }
            if (data.event.backgroundMusicTitle) {
              setBackgroundMusicTitle(data.event.backgroundMusicTitle);
            }
            if (data.event.eventDate) {
              setEventDate(data.event.eventDate.split('T')[0]);
            }
            if (data.event.startTime) {
              setStartTime(data.event.startTime);
            }
          }
        }

        if (wishesRes.ok) {
          const data = await wishesRes.json();
          setWishes(data.wishes || []);
        }

        if (mediaRes.ok) {
          const data = await mediaRes.json();
          setMediaAssets(data.mediaAssets || []);
        }

        if (invitesRes.ok) {
          const data = await invitesRes.json();
          setInvitations(data.invitations || []);
        }

        if (teamRes.ok) {
          const data = await teamRes.json();
          setTeamMembers(data.teamMembers || []);
        }
      } catch (err) {
        console.error('Failed to load couple dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCoupleData();
  }, []);

  // Save / Update Wedding Celebration Details (Business Logic Step 1)
  const handleSaveWeddingSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName.trim() || !groomName.trim()) return;

    setSavingSetup(true);
    try {
      const res = await fetch('/api/events/sara-and-dawit-2026', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brideName,
          groomName,
          coverImageUrl,
          venueName,
          venueAddress,
          venueMapUrl,
          eventDate: `${eventDate}T${startTime}:00.000Z`,
          startTime,
          dressCode,
          welcomeMessage,
          backgroundMusicUrl,
          backgroundMusicTitle,
        }),
      });

      const data = await res.json();
      if (res.ok && data.event) {
        setEvent(data.event);
        setSetupSuccessMsg(t('coupleDashboard.setup.successMsg'));
        setTimeout(() => setSetupSuccessMsg(''), 5000);
      }
    } catch (err) {
      console.error('Failed to save wedding details:', err);
    } finally {
      setSavingSetup(false);
    }
  };

  // Generate Unique Invitation
  const handleGenerateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteGuestName || !event) return;

    setGeneratingInvite(true);
    try {
      const res = await fetch(`/api/events/${event.slug}/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: inviteGuestName,
          guestPhone: inviteGuestPhone,
          maxGuests: inviteMaxGuests,
          inviteType: inviteMode,
        }),
      });

      const data = await res.json();

      if (res.ok && data.invitation) {
        setInvitations((prev) => [data.invitation, ...prev]);
        setInviteSuccess(
          inviteMode === 'CARD'
            ? `Generated Printable Card QR Pass for "${inviteGuestName}"!`
            : `Generated Digital Link for "${inviteGuestName}"!`
        );
        setInviteGuestName('');
        setInviteGuestPhone('');
        setTimeout(() => setInviteSuccess(''), 5000);
      }
    } catch (err) {
      console.error('Failed to generate invitation:', err);
    } finally {
      setGeneratingInvite(false);
    }
  };

  // Assign Team Member
  const handleAssignStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffEmail || !staffPassword || !event) return;

    setAssigningStaff(true);
    try {
      const res = await fetch(`/api/events/${event.slug}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: staffName,
          email: staffEmail,
          password: staffPassword,
          role: staffRole,
        }),
      });

      const data = await res.json();
      if (res.ok && data.teamMember) {
        setTeamMembers((prev) => [...prev, data.teamMember]);
        setStaffSuccessMsg(`Staff member ${data.teamMember.fullName} assigned successfully!`);
        setStaffName('');
        setStaffEmail('');
        setTimeout(() => setStaffSuccessMsg(''), 5000);
      }
    } catch (err) {
      console.error('Failed to assign staff:', err);
    } finally {
      setAssigningStaff(false);
    }
  };

  const handleDeleteStaff = async (userId: string) => {
    if (!confirm('Remove this staff assignment from your wedding crew?')) return;
    if (!event) return;

    try {
      const res = await fetch(`/api/events/${event.slug}/team?userId=${userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTeamMembers((prev) => prev.filter((m) => m.id !== userId));
      }
    } catch (err) {
      console.error('Failed to delete staff:', err);
    }
  };

  const handleCopyLink = (code: string) => {
    const inv = invitations.find((i) => i.inviteCode === code);
    const guestParam = inv?.guestName ? `&guest=${encodeURIComponent(inv.guestName)}` : '';
    const fullUrl = `${window.location.origin}/event/${event?.slug || 'sara-and-dawit-2026'}?code=${code}${guestParam}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  const handleMediaStatus = async (mediaId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/organizer/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId, status }),
      });

      if (res.ok) {
        setMediaAssets((prev) =>
          prev.map((m) => (m.id === mediaId ? { ...m, status } : m))
        );
      }
    } catch (err) {
      console.error('Failed to update media status:', err);
    }
  };

  const handleSendBroadcast = () => {
    setBroadcasting(true);
    setTimeout(() => {
      setBroadcasting(false);
      setBroadcastSuccess(true);
      setTimeout(() => setBroadcastSuccess(false), 4000);
    }, 1000);
  };

  const handleSendThankYou = () => {
    setSendingThankYou(true);
    setTimeout(() => {
      setSendingThankYou(false);
      setThankYouSent(true);
      setTimeout(() => setThankYouSent(false), 5000);
    }, 1200);
  };

  // Metrics Calculations
  const totalInvited = invitations.length;
  const confirmedAttending = invitations.filter((i) => i.rsvpStatus === 'ATTENDING').length;
  const declinedCount = invitations.filter((i) => i.rsvpStatus === 'DECLINED').length;
  const pendingRsvpCount = invitations.filter((i) => i.rsvpStatus === 'PENDING' || !i.rsvpStatus).length;
  const totalHeadcount = invitations
    .filter((i) => i.rsvpStatus === 'ATTENDING')
    .reduce((acc, curr) => acc + (curr.attendingHeadcount || curr.maxGuests || 1), 0);

  // Filtered Invitations
  const filteredInvitations = invitations.filter((inv) => {
    const matchesSearch = inv.guestName.toLowerCase().includes(guestSearchQuery.toLowerCase()) ||
                          inv.inviteCode.toLowerCase().includes(guestSearchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (guestRsvpFilter === 'ALL') return true;
    if (guestRsvpFilter === 'ATTENDING') return inv.rsvpStatus === 'ATTENDING';
    if (guestRsvpFilter === 'DECLINED') return inv.rsvpStatus === 'DECLINED';
    if (guestRsvpFilter === 'PENDING') return inv.rsvpStatus === 'PENDING' || !inv.rsvpStatus;
    return true;
  });

  const filteredMedia = mediaAssets.filter((m) => {
    if (mediaFilterTab === 'ALL') return true;
    return m.status === mediaFilterTab;
  });

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 flex font-sans selection:bg-gold-500 selection:text-black">
      
      {/* =========================================================================
          1. STRUCTURED LUXURY LEFT SIDEBAR
         ========================================================================= */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gray-950 text-white flex flex-col justify-between border-r border-gold-500/30 transition-transform duration-300 ease-in-out
        md:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Couple Wedding Brand Header */}
          <div className="p-6 border-b border-gold-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/branding/artboard-13.png"
                  alt="Agafari (አጋፋሪ) Logo"
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <h2 className="font-serif font-bold text-base text-gold-400 tracking-wide">
                    {brideName} & {groomName}
                  </h2>
                  <span className="text-[10px] text-gold-400 font-semibold uppercase tracking-widest block">
                    {t('coupleDashboard.header.badge')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden p-1 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wedding Date & Venue Tag */}
            <div className="mt-4 p-3 rounded-xl bg-black/20 border border-white/5 text-[11px] space-y-1">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{eventDate} at {startTime}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{venueName}</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            
            {/* 0. Wedding Setup & Details */}
            <button
              onClick={() => { setActiveTab('SETUP'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'SETUP'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-gold-400" />
                <span>{t('coupleDashboard.tabs.setup')}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                ✓
              </span>
            </button>

            {/* 1. Guest Invites */}
            <button
              onClick={() => { setActiveTab('INVITES'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'INVITES'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <QrCode className="w-4 h-4 text-gold-400" />
                <span>{t('coupleDashboard.tabs.invites')}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gold-300 font-bold">
                {invitations.length}
              </span>
            </button>

            {/* 2. Staff Roles */}
            <button
              onClick={() => { setActiveTab('STAFF'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'STAFF'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-gold-400" />
                <span>{t('coupleDashboard.tabs.staff')}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gold-300 font-bold">
                {teamMembers.length}
              </span>
            </button>

            {/* 3. Media Moderation */}
            <button
              onClick={() => { setActiveTab('MEDIA'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'MEDIA'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Film className="w-4 h-4 text-gold-400" />
                <span>{t('coupleDashboard.tabs.media')}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gold-300 font-bold">
                {mediaAssets.length}
              </span>
            </button>

            {/* 4. Broadcast */}
            <button
              onClick={() => { setActiveTab('BROADCAST'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'BROADCAST'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4 text-gold-400" />
              <span>{t('coupleDashboard.tabs.broadcast')}</span>
            </button>

            {/* 5. Thank You */}
            <button
              onClick={() => { setActiveTab('THANK_YOU'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'THANK_YOU'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>{t('coupleDashboard.tabs.thankYou')}</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/event/sara-and-dawit-2026"
            target="_blank"
            className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4 text-gold-400" />
            <span>{t('nav.openPublicPage')}</span>
          </Link>

          <Link
            href="/couple/login"
            className="w-full py-2 px-3 rounded-xl hover:bg-rose-950/40 text-rose-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('nav.signOut')}</span>
          </Link>
        </div>
      </aside>

      {/* Backdrop for Mobile Drawer */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        />
      )}

      {/* =========================================================================
          2. MAIN EXECUTIVE WORKSPACE AREA
         ========================================================================= */}
      <div className="flex-1 md:pl-72 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gold-500/30 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-gray-50 border border-gold-500/30 text-gray-900"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="text-[11px] text-gold-600 font-semibold uppercase tracking-wider">
                {t('coupleDashboard.header.badge')}
              </div>
              <h1 className="font-serif font-bold text-lg sm:text-xl text-gray-900">
                {activeTab === 'SETUP' && t('coupleDashboard.setup.title')}
                {activeTab === 'INVITES' && t('coupleDashboard.invites.tableTitle')}
                {activeTab === 'STAFF' && t('coupleDashboard.staff.title')}
                {activeTab === 'MEDIA' && t('coupleDashboard.media.title')}
                {activeTab === 'BROADCAST' && t('coupleDashboard.broadcast.title')}
                {activeTab === 'THANK_YOU' && t('coupleDashboard.thankYou.title')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-gold-400 text-xs font-bold shadow-sm border border-gold-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{confirmedAttending} {t('coupleDashboard.header.guestsAttending')}</span>
            </div>

            <LanguageSwitcher />
          </div>
        </header>

        {/* Workspace Body Content */}
        <main className="p-6 max-w-6xl w-full mx-auto space-y-6">
          
          {/* =========================================================================
              TAB 0: WEDDING CELEBRATION PROFILE & SETUP (BUSINESS LOGIC STEP 1)
             ========================================================================= */}
          {activeTab === 'SETUP' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gold-500/20">
                  <div>
                    <h2 className="font-serif font-bold text-lg sm:text-xl text-gray-900 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gold-500" />
                      {t('coupleDashboard.setup.title')}
                    </h2>
                    <p className="text-xs text-gray-600 font-light mt-0.5">
                      {t('coupleDashboard.setup.subtitle')}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" /> {t('coupleDashboard.setup.platformActive')}
                  </span>
                </div>

                {setupSuccessMsg && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{setupSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveWeddingSetup} className="space-y-6">
                  {/* Row 1: Bride & Groom Names */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-900 mb-1">
                        {t('coupleDashboard.setup.brideName')}
                      </label>
                      <input
                        type="text"
                        required
                        value={brideName}
                        onChange={(e) => setBrideName(e.target.value)}
                        placeholder="e.g. Sara Tadesse"
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-serif font-bold text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-900 mb-1">
                        {t('coupleDashboard.setup.groomName')}
                      </label>
                      <input
                        type="text"
                        required
                        value={groomName}
                        onChange={(e) => setGroomName(e.target.value)}
                        placeholder="e.g. Dawit Alemayehu"
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-serif font-bold text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: Best Photo of Couple (Direct Device File Upload) */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('coupleDashboard.setup.photoLabel')}
                    </label>
                    <label className="border-2 border-dashed border-gold-500/30 hover:border-gold-500 rounded-2xl p-5 text-center cursor-pointer transition-all block bg-gray-50 group">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <div className="w-10 h-10 rounded-xl bg-black text-gold-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                          <Upload className="w-5 h-5 text-gold-400" />
                        </div>
                        <div className="font-bold text-xs text-gray-900">
                          {coverImageFile ? `✓ Selected: ${coverImageFile.name}` : t('coupleDashboard.setup.photoPrompt')}
                        </div>
                        <p className="text-[10px] text-gray-500 font-light">
                          {t('coupleDashboard.setup.photoHelp')}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Row 3: Location of the Wedding */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-900 mb-1">
                        {t('coupleDashboard.setup.venueName')}
                      </label>
                      <input
                        type="text"
                        required
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        placeholder="Sheraton Addis Luxury Ballroom"
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-900 mb-1">
                        {t('coupleDashboard.setup.venueAddress')}
                      </label>
                      <input
                        type="text"
                        required
                        value={venueAddress}
                        onChange={(e) => setVenueAddress(e.target.value)}
                        placeholder="Taitu Street, Addis Ababa"
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-900 mb-1">
                        {t('coupleDashboard.setup.mapLink')}
                      </label>
                      <input
                        type="text"
                        value={venueMapUrl}
                        onChange={(e) => setVenueMapUrl(e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  {/* Row 4: Date & Time of Wedding */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-900 mb-1">
                        {t('coupleDashboard.setup.eventDate')}
                      </label>
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-900 mb-1">
                        {t('coupleDashboard.setup.startTime')}
                      </label>
                      <input
                        type="time"
                        required
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  {/* Row 5: Dress Code & Welcome Message */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-900 mb-1">
                        {t('coupleDashboard.setup.dressCode')}
                      </label>
                      <input
                        type="text"
                        value={dressCode}
                        onChange={(e) => setDressCode(e.target.value)}
                        placeholder="e.g. Traditional Habesha Kemis & Black Tie"
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-900 mb-1">
                        {t('coupleDashboard.setup.welcomeMsg')}
                      </label>
                      <input
                        type="text"
                        value={welcomeMessage}
                        onChange={(e) => setWelcomeMessage(e.target.value)}
                        placeholder="We are overjoyed to celebrate our wedding with you!"
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  {/* Row 6: Upload Real Audio File (MP3 / WAV / M4A) */}
                  <div className="border-t border-gold-500/20 pt-4">
                    <label className="block text-[11px] font-bold text-gray-900 mb-2">
                      🎵 Upload Real Wedding Mezmur / Song File (.MP3, .WAV, .M4A)
                    </label>
                    <label className="border-2 border-dashed border-gold-500/30 hover:border-gold-500 rounded-2xl p-6 text-center cursor-pointer transition-all block bg-gray-50 group shadow-sm">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-black text-gold-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                          <Music className="w-6 h-6 text-gold-400" />
                        </div>
                        <div className="font-bold text-xs sm:text-sm text-gray-900">
                          {backgroundAudioFile ? `✓ Selected Audio File: ${backgroundAudioFile.name}` : 'Click or Drag to Upload Real Audio File (MP3, WAV, M4A)'}
                        </div>
                        <p className="text-[10px] text-gray-500 font-light">
                          Select a real audio file from your phone or computer.
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={savingSetup}
                      className="px-8 py-3.5 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs shadow-md transition-all flex items-center gap-2 border border-gold-500/40"
                    >
                      <Save className="w-4 h-4 text-gold-400" />
                      <span>{savingSetup ? t('coupleDashboard.setup.savingBtn') : t('coupleDashboard.setup.saveBtn')}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 1: GUEST INVITATIONS & QR PASS MANAGEMENT
             ========================================================================= */}
          {activeTab === 'INVITES' && (
            <div className="space-y-6">
              
              {/* Top Executive KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-gold-500/30 shadow-sm">
                  <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{t('coupleDashboard.invites.kpiTotal')}</div>
                  <div className="text-3xl font-serif font-bold text-gray-900 mt-1">{totalInvited}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Card QRs + Direct Links</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-gold-500/30 shadow-sm">
                  <div className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider">{t('coupleDashboard.invites.kpiAttending')}</div>
                  <div className="text-3xl font-serif font-bold text-emerald-800 mt-1">
                    {confirmedAttending} <span className="text-sm font-normal text-gray-500">({totalHeadcount} {t('common.heads')})</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-0.5">✓ {t('coupleDashboard.invites.attending')}</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-gold-500/30 shadow-sm">
                  <div className="text-[11px] text-amber-800 font-bold uppercase tracking-wider">{t('coupleDashboard.invites.kpiPending')}</div>
                  <div className="text-3xl font-serif font-bold text-amber-800 mt-1">{pendingRsvpCount}</div>
                  <div className="text-[11px] text-amber-700 font-medium mt-0.5">{t('coupleDashboard.invites.pendingRsvp')}</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-gold-500/30 shadow-sm">
                  <div className="text-[11px] text-rose-800 font-bold uppercase tracking-wider">{t('coupleDashboard.invites.kpiDeclined')}</div>
                  <div className="text-3xl font-serif font-bold text-rose-800 mt-1">{declinedCount}</div>
                  <div className="text-[11px] text-rose-700 font-medium mt-0.5">{t('coupleDashboard.invites.declined')}</div>
                </div>
              </div>

              {/* Invitation Generator Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="font-serif font-bold text-lg sm:text-xl text-gray-900">
                      {t('coupleDashboard.invites.genTitle')}
                    </h2>
                    <p className="text-xs text-gray-500 font-light mt-0.5">
                      {t('coupleDashboard.invites.genSubtitle')}
                    </p>
                  </div>

                  {/* Dual Mode Switcher */}
                  <div className="flex items-center p-1 rounded-xl bg-gray-50 border border-gold-500/30 text-xs">
                    <button
                      type="button"
                      onClick={() => setInviteMode('CARD')}
                      className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                        inviteMode === 'CARD'
                          ? 'bg-black text-gold-400 shadow-sm'
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <Printer className="w-3.5 h-3.5" /> {t('coupleDashboard.invites.modeCard')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInviteMode('LINK')}
                      className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                        inviteMode === 'LINK'
                          ? 'bg-black text-gold-400 shadow-sm'
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <Share2 className="w-3.5 h-3.5" /> {t('coupleDashboard.invites.modeLink')}
                    </button>
                  </div>
                </div>

                {inviteSuccess && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{inviteSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleGenerateInvitation} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('coupleDashboard.invites.guestName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteGuestName}
                      onChange={(e) => setInviteGuestName(e.target.value)}
                      placeholder="e.g. Uncle Bekele & Family"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('coupleDashboard.invites.quota')}
                    </label>
                    <select
                      value={inviteMaxGuests}
                      onChange={(e) => setInviteMaxGuests(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-medium"
                    >
                      <option value={1}>1 {t('common.guest')} (Single Entry)</option>
                      <option value={2}>2 {t('common.guests')} (Couple VIP Entry)</option>
                      <option value={3}>3 {t('common.guests')} (Family Entry)</option>
                      <option value={4}>4 {t('common.guests')} (Family VIP Entry)</option>
                      <option value={5}>5+ {t('common.guests')} (Full Family Pass)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('coupleDashboard.invites.phone')}
                    </label>
                    <input
                      type="text"
                      value={inviteGuestPhone}
                      onChange={(e) => setInviteGuestPhone(e.target.value)}
                      placeholder="+251 91 122 3344"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={generatingInvite}
                      className="px-6 py-3 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs shadow-md transition-all flex items-center gap-2 border border-gold-500/40"
                    >
                      <Plus className="w-4 h-4 text-gold-400" />
                      <span>
                        {generatingInvite
                          ? t('common.loading')
                          : inviteMode === 'CARD'
                          ? t('coupleDashboard.invites.genCardBtn')
                          : t('coupleDashboard.invites.genLinkBtn')}
                      </span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Guest Directory & RSVP Table */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="font-serif font-bold text-lg text-gray-900">
                      {t('coupleDashboard.invites.tableTitle')} ({invitations.length})
                    </h2>
                    <p className="text-xs text-gray-500 font-light">
                      {t('coupleDashboard.invites.tableSubtitle')}
                    </p>
                  </div>

                  {/* Search Bar & Filter */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={guestSearchQuery}
                        onChange={(e) => setGuestSearchQuery(e.target.value)}
                        placeholder={t('common.search')}
                        className="pl-8 pr-3 py-1.5 rounded-xl border border-gold-500/30 text-xs text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div className="flex items-center gap-1 text-[11px]">
                      <button
                        onClick={() => setGuestRsvpFilter('ALL')}
                        className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                          guestRsvpFilter === 'ALL'
                            ? 'bg-black text-gold-400 border-black'
                            : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {t('common.all')}
                      </button>
                      <button
                        onClick={() => setGuestRsvpFilter('ATTENDING')}
                        className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                          guestRsvpFilter === 'ATTENDING'
                            ? 'bg-emerald-800 text-white border-emerald-800'
                            : 'bg-white text-emerald-800 border-gray-200 hover:bg-emerald-50'
                        }`}
                      >
                        {t('coupleDashboard.invites.attending')} ({confirmedAttending})
                      </button>
                      <button
                        onClick={() => setGuestRsvpFilter('PENDING')}
                        className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                          guestRsvpFilter === 'PENDING'
                            ? 'bg-amber-800 text-white border-amber-800'
                            : 'bg-white text-amber-800 border-gray-200 hover:bg-amber-50'
                        }`}
                      >
                        {t('coupleDashboard.invites.pendingRsvp')} ({pendingRsvpCount})
                      </button>
                      <button
                        onClick={() => setGuestRsvpFilter('DECLINED')}
                        className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                          guestRsvpFilter === 'DECLINED'
                            ? 'bg-rose-800 text-white border-rose-800'
                            : 'bg-white text-rose-800 border-gray-200 hover:bg-rose-50'
                        }`}
                      >
                        {t('coupleDashboard.invites.declined')} ({declinedCount})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table */}
                {filteredInvitations.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-xs">
                    No guest invitations match your search filter.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-gray-50">
                          <th className="py-3 px-4 rounded-l-xl">{t('coupleDashboard.invites.thGuest')}</th>
                          <th className="py-3 px-4">{t('coupleDashboard.invites.thType')}</th>
                          <th className="py-3 px-4">{t('coupleDashboard.invites.thQuota')}</th>
                          <th className="py-3 px-4">{t('coupleDashboard.invites.thRsvp')}</th>
                          <th className="py-3 px-4">{t('coupleDashboard.invites.thGate')}</th>
                          <th className="py-3 px-4 text-right rounded-r-xl">{t('coupleDashboard.invites.thActions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredInvitations.map((inv) => (
                          <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-serif font-bold text-gray-900 text-sm">{inv.guestName}</div>
                              <div className="text-[11px] text-gray-500 font-mono">{inv.inviteCode}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              {inv.inviteType === 'CARD' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                                  <Printer className="w-3 h-3 text-amber-700" /> {t('coupleDashboard.invites.modeCard')}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold">
                                  <Share2 className="w-3 h-3 text-blue-700" /> {t('coupleDashboard.invites.modeLink')}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-gray-900">
                              {inv.maxGuests} {inv.maxGuests === 1 ? t('common.guest') : t('common.guests')}
                            </td>
                            <td className="py-3.5 px-4">
                              {inv.rsvpStatus === 'ATTENDING' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {t('coupleDashboard.invites.attending')}
                                </span>
                              ) : inv.rsvpStatus === 'DECLINED' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                                  <XCircle className="w-3 h-3 text-rose-600" /> {t('coupleDashboard.invites.declined')}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[10px]">
                                  <Clock className="w-3 h-3 text-amber-600" /> {t('coupleDashboard.invites.pendingRsvp')}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              {inv.isScanned ? (
                                <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5 text-emerald-600" /> {t('coupleDashboard.invites.checkedIn')}
                                </span>
                              ) : (
                                <span className="text-gray-500 font-light text-[11px]">
                                  {t('coupleDashboard.invites.awaitingGate')}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedInviteForQr(inv)}
                                  className="px-3 py-1.5 rounded-lg bg-black hover:bg-gray-800 text-gold-400 text-xs font-bold flex items-center gap-1 shadow-sm transition-all border border-gold-500/30"
                                  title="View QR Pass"
                                >
                                  <QrCode className="w-3.5 h-3.5 text-gold-400" />
                                  <span>{t('coupleDashboard.invites.viewQr')}</span>
                                </button>

                                <button
                                  onClick={() => handleCopyLink(inv.inviteCode)}
                                  className="p-1.5 rounded-lg border border-gold-500/30 bg-white hover:bg-gray-50 text-gray-900 transition-colors"
                                  title="Copy Link"
                                >
                                  {copiedCode === inv.inviteCode ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-gold-600" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: TECHNICAL STAFF ROLES (LIVE STREAMER & GATE SCANNER)
             ========================================================================= */}
          {activeTab === 'STAFF' && (
            <div className="space-y-6">
              {/* Form Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm">
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <h2 className="font-serif font-bold text-lg sm:text-xl text-gray-900">
                    {t('coupleDashboard.staff.title')}
                  </h2>
                  <p className="text-xs text-gray-500 font-light mt-0.5">
                    {t('coupleDashboard.staff.subtitle')}
                  </p>
                </div>

                {staffSuccessMsg && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{staffSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAssignStaff} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('coupleDashboard.staff.fullName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      placeholder="e.g. Abebe Media Operator"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('coupleDashboard.staff.email')}
                    </label>
                    <input
                      type="email"
                      required
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      placeholder="streamer@sara-dawit.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('coupleDashboard.staff.password')}
                    </label>
                    <input
                      type="text"
                      required
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('coupleDashboard.staff.role')}
                    </label>
                    <select
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-bold"
                    >
                      <option value="GATE_SCANNER">{t('coupleDashboard.staff.roleScanner')}</option>
                      <option value="LIVE_STREAMER">{t('coupleDashboard.staff.roleStreamer')}</option>
                    </select>
                  </div>

                  <div className="sm:col-span-4 flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={assigningStaff}
                      className="px-6 py-3 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs shadow-md transition-all flex items-center gap-2 border border-gold-500/40"
                    >
                      <UserCheck className="w-4 h-4 text-gold-400" />
                      <span>{assigningStaff ? t('common.loading') : t('coupleDashboard.staff.assignBtn')}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Staff Roster Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm">
                <h2 className="font-serif font-bold text-lg text-gray-900 mb-4">
                  {t('coupleDashboard.staff.activeCrew')} ({teamMembers.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-5 rounded-2xl border border-gold-500/20 bg-gray-50 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-black text-gold-400 flex items-center justify-center font-bold text-lg shadow-sm shrink-0 border border-gold-500/30">
                          {member.role === 'LIVE_STREAMER' ? <Video className="w-6 h-6 text-gold-400" /> : <ScanLine className="w-6 h-6 text-gold-400" />}
                        </div>
                        <div>
                          <div className="font-serif font-bold text-gray-900 text-sm">{member.fullName}</div>
                          <div className="text-xs text-gray-500 font-mono">{member.email}</div>
                          <div className="mt-1">
                            {member.role === 'LIVE_STREAMER' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold">
                                {t('coupleDashboard.staff.roleStreamer')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                                {t('coupleDashboard.staff.roleScanner')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={member.role === 'LIVE_STREAMER' ? '/event/sara-and-dawit-2026' : '/scanner'}
                          target="_blank"
                          className="px-3 py-1.5 rounded-lg bg-white border border-gold-500/30 hover:bg-gray-50 text-gray-900 text-xs font-bold flex items-center gap-1 shadow-sm"
                        >
                          <span>{t('coupleDashboard.staff.openPortal')}</span>
                          <ExternalLink className="w-3 h-3 text-gold-600" />
                        </Link>

                        <button
                          onClick={() => handleDeleteStaff(member.id)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                          title="Revoke Role"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: RECEIVED MEDIA & VAULT MODERATION
             ========================================================================= */}
          {activeTab === 'MEDIA' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="font-serif font-bold text-lg sm:text-xl text-gray-900">
                    {t('coupleDashboard.media.title')} ({mediaAssets.length})
                  </h2>
                  <p className="text-xs text-gray-500 font-light">
                    {t('coupleDashboard.media.subtitle')}
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-50 border border-gold-500/30 text-xs font-bold">
                  <button
                    onClick={() => setMediaFilterTab('ALL')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      mediaFilterTab === 'ALL'
                        ? 'bg-black text-gold-400 shadow-sm'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {t('coupleDashboard.media.tabAll')} ({mediaAssets.length})
                  </button>
                  <button
                    onClick={() => setMediaFilterTab('APPROVED')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      mediaFilterTab === 'APPROVED'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'text-emerald-800 hover:bg-emerald-50'
                    }`}
                  >
                    {t('coupleDashboard.media.tabPosted')} ({mediaAssets.filter((m) => m.status === 'APPROVED').length})
                  </button>
                  <button
                    onClick={() => setMediaFilterTab('PENDING')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      mediaFilterTab === 'PENDING'
                        ? 'bg-amber-800 text-white shadow-sm'
                        : 'text-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    {t('coupleDashboard.media.tabPending')} ({mediaAssets.filter((m) => m.status === 'PENDING').length})
                  </button>
                  <button
                    onClick={() => setMediaFilterTab('REJECTED')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      mediaFilterTab === 'REJECTED'
                        ? 'bg-rose-800 text-white shadow-sm'
                        : 'text-rose-800 hover:bg-rose-50'
                    }`}
                  >
                    {t('coupleDashboard.media.tabRejected')} ({mediaAssets.filter((m) => m.status === 'REJECTED').length})
                  </button>
                </div>
              </div>

              {filteredMedia.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  {t('coupleDashboard.media.empty')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMedia.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-4 rounded-2xl border border-gold-500/20 bg-gray-50 flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase">
                            {new Date(asset.createdAt).toLocaleDateString()}
                          </span>
                          {asset.status === 'APPROVED' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                              {t('coupleDashboard.media.tabPosted')}
                            </span>
                          ) : asset.status === 'REJECTED' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-bold">
                              {t('coupleDashboard.media.tabRejected')}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                              {t('coupleDashboard.media.tabPending')}
                            </span>
                          )}
                        </div>

                        {/* Player */}
                        <div className="h-44 rounded-xl overflow-hidden bg-black mb-3 flex items-center justify-center">
                          {asset.mediaType === 'VIDEO' || asset.cdnUrl.includes('.mp4') ? (
                            <video
                              src={asset.cdnUrl}
                              controls
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={asset.cdnUrl}
                              alt={asset.caption}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="font-serif font-bold text-gray-900 text-sm">
                          {asset.uploaderName}
                        </div>
                        <p className="text-xs text-gray-500 font-light italic mt-1 line-clamp-2">
                          "{asset.caption}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2 border-t border-gray-100 pt-3 mt-3">
                        {asset.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleMediaStatus(asset.id, 'APPROVED')}
                            className="flex-1 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> {t('coupleDashboard.media.approve')}
                          </button>
                        )}

                        {asset.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleMediaStatus(asset.id, 'REJECTED')}
                            className="flex-1 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs transition-all flex items-center justify-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> {t('coupleDashboard.media.reject')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 4: WEDDING DAY BROADCAST CENTER
             ========================================================================= */}
          {activeTab === 'BROADCAST' && (
            <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-6">
              <div>
                <h2 className="font-serif font-bold text-xl text-gray-900">
                  {t('coupleDashboard.broadcast.title')}
                </h2>
                <p className="text-xs text-gray-500 font-light mt-0.5">
                  {t('coupleDashboard.broadcast.subtitle')}
                </p>
              </div>

              {broadcastSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{t('coupleDashboard.broadcast.successMsg')}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-900 mb-1">
                    {t('coupleDashboard.broadcast.label')}
                  </label>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gold-500/20 text-xs">
                  <div className="text-[10px] text-gold-600 font-bold uppercase mb-1">{t('coupleDashboard.broadcast.previewTitle')}</div>
                  <div className="font-serif font-bold text-gray-900">📢 {t('publicEvent.hero.announcementFrom')} {brideName} & {groomName}:</div>
                  <p className="italic text-gray-600 mt-1">"{broadcastMessage}"</p>
                </div>

                <button
                  type="button"
                  onClick={handleSendBroadcast}
                  disabled={broadcasting}
                  className="w-full py-3.5 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 border border-gold-500/40"
                >
                  <Send className="w-4 h-4 text-gold-400" />
                  <span>{broadcasting ? t('coupleDashboard.broadcast.publishingBtn') : t('coupleDashboard.broadcast.publishBtn')}</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: POST-WEDDING THANK YOU CAPSULE
             ========================================================================= */}
          {activeTab === 'THANK_YOU' && (
            <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-6">
              <div>
                <h2 className="font-serif font-bold text-xl text-gray-900">
                  {t('coupleDashboard.thankYou.title')}
                </h2>
                <p className="text-xs text-gray-500 font-light mt-0.5">
                  {t('coupleDashboard.thankYou.subtitle')}
                </p>
              </div>

              {thankYouSent && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{t('coupleDashboard.thankYou.successMsg')}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-900 mb-1">
                    {t('coupleDashboard.thankYou.messageLabel')}
                  </label>
                  <textarea
                    rows={4}
                    value={thankYouMessage}
                    onChange={(e) => setThankYouMessage(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-900 mb-1">
                    {t('coupleDashboard.thankYou.photoLabel')}
                  </label>
                  <label className="border-2 border-dashed border-gold-500/30 hover:border-gold-500 rounded-2xl p-5 text-center cursor-pointer transition-all block bg-gray-50 group">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="w-10 h-10 rounded-xl bg-black text-gold-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <Upload className="w-5 h-5 text-gold-400" />
                      </div>
                      <div className="font-bold text-xs text-gray-900">
                        {thankYouImageFile ? `✓ Selected: ${thankYouImageFile.name}` : t('coupleDashboard.thankYou.photoPrompt')}
                      </div>
                      <p className="text-[10px] text-gray-500 font-light">
                        {t('coupleDashboard.setup.photoHelp')}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThankYouImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {thankYouImageUrl && (
                  <div className="h-52 rounded-2xl overflow-hidden border border-gold-500/30 shadow-sm relative">
                    <img
                      src={thankYouImageUrl}
                      alt="Thank you portrait"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 text-white">
                      <div className="text-xs">
                        <div className="font-serif font-bold text-sm">Thank You from {brideName} & {groomName}</div>
                        <p className="italic text-white/90 line-clamp-2 mt-0.5">"{thankYouMessage}"</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSendThankYou}
                  disabled={sendingThankYou}
                  className="w-full py-3.5 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 border border-gold-500/40"
                >
                  <Send className="w-4 h-4 text-gold-400" />
                  <span>{sendingThankYou ? t('coupleDashboard.thankYou.sendingBtn') : t('coupleDashboard.thankYou.sendBtn')}</span>
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* =========================================================================
          3. HIGH-RES QR MODAL (VIEW & PRINT)
         ========================================================================= */}
      <AnimatePresence>
        {selectedInviteForQr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-500 text-center relative shadow-2xl">
              <button
                onClick={() => setSelectedInviteForQr(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                ✕
              </button>

              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-black text-gold-400 text-[10px] font-bold uppercase mb-3 border border-gold-500/30">
                <Crown className="w-3 h-3 text-gold-400" />
                {selectedInviteForQr.inviteType === 'CARD' ? t('coupleDashboard.invites.modeCard') : t('coupleDashboard.invites.modeLink')}
              </div>

              <h3 className="font-serif font-bold text-xl text-gray-900">
                {selectedInviteForQr.guestName}
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                {t('coupleDashboard.invites.thQuota')}: <strong className="text-gray-900 font-bold">{selectedInviteForQr.maxGuests} {selectedInviteForQr.maxGuests === 1 ? t('common.guest') : t('common.guests')}</strong>
              </p>

              {/* Scannable High-Res QR */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gold-500/20 inline-block shadow-sm mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                    `${typeof window !== 'undefined' ? window.location.origin : ''}/event/${event?.slug || 'sara-and-dawit-2026'}?code=${selectedInviteForQr.inviteCode}&guest=${encodeURIComponent(selectedInviteForQr.guestName)}`
                  )}`}
                  alt="Guest QR Code"
                  className="w-48 h-48 mx-auto"
                />
                <div className="font-mono text-[11px] font-bold text-gray-900 mt-2 tracking-wider">
                  {selectedInviteForQr.inviteCode}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
                      `${window.location.origin}/event/${event?.slug || 'sara-and-dawit-2026'}?code=${selectedInviteForQr.inviteCode}&guest=${encodeURIComponent(selectedInviteForQr.guestName)}`
                    )}`;
                    link.download = `QR-${selectedInviteForQr.inviteCode}-${selectedInviteForQr.guestName.replace(/\s+/g, '_')}.png`;
                    link.click();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 border border-gold-500/30"
                >
                  <Download className="w-3.5 h-3.5 text-gold-400" /> {t('publicEvent.qrPass.downloadPass')}
                </button>

                <button
                  onClick={() => window.print()}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gold-500/30 shadow-sm"
                  title="Print Pass"
                >
                  <Printer className="w-4 h-4 text-gold-600" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

```

### File: `frontend/src/app/couple/login/page.tsx`

```tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

export default function CoupleLoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('couple@sara-dawit.com');
  const [password, setPassword] = useState('couple123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && (data.user?.role === 'BRIDE_GROOM' || data.user?.role === 'SYSTEM_ADMIN')) {
        router.push('/couple/dashboard');
      } else if (res.ok) {
        setError('Access restricted to Bride & Groom accounts.');
      } else {
        setError(data.error || t('auth.invalidCreds'));
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 flex items-center justify-center p-4 sm:p-6 selection:bg-gold-500 selection:text-black font-sans relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border-2 border-gold-500/40 shadow-xl bg-white">
        <div className="text-center mb-8">
          <img
            src="/branding/artboard-14.png"
            alt="Agafari (አጋፋሪ) Logo"
            className="h-14 w-auto mx-auto mb-4 object-contain"
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            {t('auth.coupleTitle')}
          </h1>
          <p className="text-[10px] text-gold-600 font-semibold uppercase tracking-widest mt-1">
            {t('auth.coupleSubtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-900 uppercase tracking-wider mb-1.5">
              {t('auth.emailLabel')}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="couple@sara-dawit.com"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-gold-500/30 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <Mail className="w-4 h-4 text-gold-600 absolute left-4 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-900 uppercase tracking-wider mb-1.5">
              {t('auth.passwordLabel')}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-gold-500/30 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <Lock className="w-4 h-4 text-gold-600 absolute left-4 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-extrabold text-xs shadow-gold transition-all flex items-center justify-center gap-2 mt-4 border border-gold-400/40 disabled:opacity-50"
          >
            {loading ? t('auth.signingIn') : t('auth.signInBtn')}
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-500 font-semibold mb-1">Pre-configured Couple Account:</p>
          <div className="text-[11px] font-mono text-gray-900 font-bold">
            couple@sara-dawit.com / couple123
          </div>
        </div>
      </div>
    </div>
  );
}

```

### File: `frontend/src/app/event/[slug]/feed/page.tsx`

```tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Film, 
  Heart, 
  Upload, 
  ArrowLeft, 
  X, 
  CheckCircle, 
  Sparkles,
  MessageCircle,
  Eye,
  Camera,
  Share2,
  Send,
  Crown,
  Volume2,
  VolumeX,
  Radio,
  Search,
  Check,
  Video
} from 'lucide-react';

interface MediaAssetData {
  id: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE';
  category?: 'WISHES' | 'BTS' | 'LIVE';
  cdnUrl: string;
  caption: string;
  viewsCount: number;
  likesCount: number;
}

interface CommentData {
  id: string;
  mediaId: string;
  senderName: string;
  comment: string;
  createdAt: string;
}

interface DoubleTapHeart {
  id: string;
  x: number;
  y: number;
}

export default function TikTokMemoryFeedPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const searchParams = useSearchParams();
  const guestQuery = searchParams.get('guest') || searchParams.get('name');

  const [mediaItems, setMediaItems] = useState<MediaAssetData[]>([]);
  const [activeTab, setActiveTab] = useState<'WISHES' | 'BTS' | 'LIVE'>('WISHES');
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [isMuted, setIsMuted] = useState(true);

  // Active playing index tracking via IntersectionObserver
  const [activeReelId, setActiveReelId] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Comments State
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [selectedMediaForComments, setSelectedMediaForComments] = useState<MediaAssetData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentSender, setCommentSender] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Double Tap Hearts
  const [doubleTapHearts, setDoubleTapHearts] = useState<DoubleTapHeart[]>([]);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploaderName, setUploaderName] = useState('');
  const [caption, setCaption] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'WISHES' | 'BTS' | 'LIVE'>('WISHES');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (guestQuery) {
      const decoded = decodeURIComponent(guestQuery).trim();
      if (decoded) {
        setCommentSender(decoded);
        setUploaderName(decoded);
      }
    }
  }, [guestQuery]);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const res = await fetch(`/api/events/${slug}/media`);
        if (res.ok) {
          const data = await res.json();
          const items: MediaAssetData[] = data.mediaAssets || [];
          setMediaItems(items);
          if (items.length > 0) {
            setActiveReelId(items[0].id);
            const initialLikes: Record<string, number> = {};
            items.forEach((item) => {
              initialLikes[item.id] = item.likesCount || 0;
            });
            setLikeCounts(initialLikes);
          }
        }
      } catch (err) {
        console.error('Failed to load memory feed:', err);
      }
    }
    fetchMedia();
  }, [slug]);

  // Fetch comments when opening comments drawer
  useEffect(() => {
    if (!selectedMediaForComments) return;
    async function fetchComments() {
      try {
        const res = await fetch(`/api/organizer/media/comments?mediaId=${selectedMediaForComments?.id}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error('Failed to load comments:', err);
      }
    }
    fetchComments();
  }, [selectedMediaForComments?.id]);

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedIds((prev) => {
      const currentlyLiked = !prev[id];
      const nextState = !currentlyLiked;
      setLikeCounts((counts) => ({
        ...counts,
        [id]: (counts[id] || 0) + (nextState ? 1 : -1),
      }));
      return { ...prev, [id]: nextState };
    });
  };

  // Double-tap screen heart burst effect
  const handleDoubleTap = (e: React.MouseEvent<HTMLElement>, mediaId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!likedIds[mediaId]) {
      setLikedIds((prev) => ({ ...prev, [mediaId]: true }));
      setLikeCounts((counts) => ({
        ...counts,
        [mediaId]: (counts[mediaId] || 0) + 1,
      }));
    }

    const heartId = `h-${Date.now()}-${Math.random()}`;
    setDoubleTapHearts((prev) => [...prev, { id: heartId, x, y }]);
    setTimeout(() => {
      setDoubleTapHearts((prev) => prev.filter((h) => h.id !== heartId));
    }, 900);
  };

  // Submit Comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentSender.trim() || !commentText.trim() || !selectedMediaForComments) return;

    setSubmittingComment(true);
    try {
      const res = await fetch('/api/organizer/media/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaId: selectedMediaForComments.id,
          senderName: commentSender,
          comment: commentText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [data.comment, ...prev]);
        setCommentText('');
      }
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submit Upload Form
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploaderName || !caption) return;
    setUploading(true);

    try {
      const fallbackVideo = 'https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-in-a-park-on-their-wedding-day-43185-large.mp4';
      const res = await fetch(`/api/events/${slug}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploaderName,
          caption,
          category: uploadCategory,
          mediaType: 'VIDEO',
          cdnUrl: videoPreviewUrl || fallbackVideo,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.mediaAsset) {
          setMediaItems((prev) => [data.mediaAsset, ...prev]);
          setLikeCounts((prev) => ({ ...prev, [data.mediaAsset.id]: 0 }));
          setActiveReelId(data.mediaAsset.id);
        }
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
          setIsUploadOpen(false);
          setUploaderName('');
          setCaption('');
          setVideoFile(null);
          setVideoPreviewUrl(null);
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to upload memory:', err);
    } finally {
      setUploading(false);
    }
  };

  // Horizontal Swipe Handler for Tab Navigation (Wishes <-> Behind Scenes <-> Live)
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swiped Left -> Move to Next Tab
        if (activeTab === 'WISHES') setActiveTab('BTS');
        else if (activeTab === 'BTS') setActiveTab('LIVE');
      } else {
        // Swiped Right -> Move to Previous Tab
        if (activeTab === 'LIVE') setActiveTab('BTS');
        else if (activeTab === 'BTS') setActiveTab('WISHES');
      }
    }
    touchStartX.current = null;
  };

  // Filter media items based on active tab
  const filteredMediaItems = mediaItems.filter((item) => {
    if (!item.category) return true;
    if (activeTab === 'WISHES') return item.category === 'WISHES' || !item.category;
    if (activeTab === 'BTS') return item.category === 'BTS';
    if (activeTab === 'LIVE') return item.category === 'LIVE' || item.category === 'WISHES';
    return true;
  });

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-[100dvh] w-full bg-black text-neutral flex flex-col font-sans relative overflow-hidden select-none"
    >
      
      {/* 1. TIKTOK-STYLE TOP NAVIGATION HEADER */}
      <header className="absolute top-0 left-0 right-0 z-50 px-3 sm:px-6 py-3 flex items-center justify-between pointer-events-none bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        
        {/* Left: Back Link & Agafari Logo */}
        <div className="flex items-center gap-2 pointer-events-auto shrink-0">
          <Link
            href={`/event/${slug}`}
            className="p-1.5 sm:p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/70 text-white transition-all border border-white/15 shadow-md flex items-center justify-center"
            aria-label="Back to Wedding Hub"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </Link>

          <img
            src="/branding/artboard-13.png"
            alt="Agafari (አጋፋሪ) Logo"
            className="h-6 sm:h-8 w-auto object-contain shrink-0"
          />
        </div>

        {/* Center: Single-Line TikTok Navigation Tabs (Wishes | BTS | Live) */}
        <nav className="flex items-center gap-3 sm:gap-6 pointer-events-auto overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab('WISHES')}
            className="relative py-1 text-xs sm:text-sm transition-all focus:outline-none whitespace-nowrap"
          >
            <span className={activeTab === 'WISHES' ? 'text-white font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-white/70 hover:text-white font-medium drop-shadow'}>
              Wishes
            </span>
            {activeTab === 'WISHES' && (
              <motion.div
                layoutId="tiktokActiveTabUnderline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-400 rounded-full mx-auto shadow-sm"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('BTS')}
            className="relative py-1 text-xs sm:text-sm transition-all focus:outline-none whitespace-nowrap"
          >
            <span className={activeTab === 'BTS' ? 'text-white font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-white/70 hover:text-white font-medium drop-shadow'}>
              Behind Scenes
            </span>
            {activeTab === 'BTS' && (
              <motion.div
                layoutId="tiktokActiveTabUnderline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-400 rounded-full mx-auto shadow-sm"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('LIVE')}
            className="relative py-1 text-xs sm:text-sm transition-all focus:outline-none whitespace-nowrap"
          >
            <span className={`flex items-center gap-1 ${activeTab === 'LIVE' ? 'text-rose-400 font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-white/70 hover:text-white font-medium drop-shadow'}`}>
              <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
              <span>Live</span>
            </span>
            {activeTab === 'LIVE' && (
              <motion.div
                layoutId="tiktokActiveTabUnderline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-rose-500 rounded-full mx-auto shadow-sm"
              />
            )}
          </button>
        </nav>

        {/* Right: Mute / Sound Switcher */}
        <div className="flex items-center gap-2 pointer-events-auto shrink-0">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 sm:p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/70 text-white transition-all border border-white/15"
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* 2. FULL-SCREEN VERTICALLY SNAP-SCROLLABLE REELS CONTAINER */}
      <div 
        ref={containerRef}
        className="flex-1 w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar bg-black"
      >
        {filteredMediaItems.length === 0 ? (
          <div className="h-[100dvh] w-full flex flex-col items-center justify-center text-center px-6 text-neutral">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-[#D4AF37] mb-4 animate-bounce">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-xl mb-2">No videos yet in this category</h3>
            <p className="text-xs text-neutral/70 max-w-xs mb-4">Be the first to share a wish video for Sara & Dawit!</p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-bold text-xs shadow-accent flex items-center gap-2"
            >
              <Camera className="w-4 h-4" /> Upload Wish Video / Note
            </button>
          </div>
        ) : (
          filteredMediaItems.map((media) => {
            const isLiked = !!likedIds[media.id];
            const likes = likeCounts[media.id] ?? media.likesCount;
            const isVideo = media.cdnUrl.includes('.mp4') || media.mediaType === 'VIDEO';

            return (
              <section
                key={media.id}
                onDoubleClick={(e) => handleDoubleTap(e, media.id)}
                className="h-[100dvh] w-full snap-start relative flex items-center justify-center bg-black overflow-hidden"
              >
                {/* 100% Full-Width Video/Image Reel Viewport */}
                <div className="w-full h-full max-w-full relative bg-black flex items-center justify-center overflow-hidden">
                  
                  {isVideo ? (
                    <video
                      src={media.cdnUrl}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={media.cdnUrl}
                      alt={media.caption}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

                  {/* Double-Tap Heart Bursts */}
                  {doubleTapHearts.map((h) => (
                    <motion.div
                      key={h.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.4, 1.1], opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8 }}
                      style={{ left: h.x - 30, top: h.y - 30 }}
                      className="absolute z-30 pointer-events-none"
                    >
                      <Heart className="w-16 h-16 fill-rose-500 text-rose-500 drop-shadow-lg" />
                    </motion.div>
                  ))}

                  {/* 3. RIGHT TIKTOK ACTION BAR (HIDDEN IN LIVE SECTION AS REQUESTED) */}
                  {activeTab !== 'LIVE' && (
                    <div className="absolute right-3.5 bottom-24 z-30 flex flex-col items-center gap-4">
                      {/* Like / Heart Button */}
                      <button
                        onClick={(e) => toggleLike(media.id, e)}
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-125 ${
                          isLiked ? 'bg-rose-500/20 text-rose-500' : 'bg-black/50 backdrop-blur-md text-white'
                        }`}>
                          <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                        </div>
                        <span className="text-[11px] font-bold text-white mt-1 drop-shadow">
                          {likes}
                        </span>
                      </button>

                      {/* Comment Drawer Button */}
                      <button
                        onClick={() => {
                          setSelectedMediaForComments(media);
                          setIsCommentsOpen(true);
                        }}
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white active:scale-125 transition-transform">
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-bold text-white mt-1 drop-shadow">
                          {comments.length || 12}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* 4. BOTTOM OVERLAY INFO: Caption + Upload Wishes Button */}
                  <div className="absolute left-4 right-16 bottom-6 z-20 pointer-events-auto flex items-end justify-between gap-3">
                    <div className="flex-1 pr-2">
                      <p className="text-xs sm:text-sm text-white font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] line-clamp-3">
                        {media.caption}
                      </p>
                    </div>

                    {/* ONLY THE UPLOADING BUTTON IS SHOWN IN LIVE & OTHER SECTIONS AS REQUESTED */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsUploadOpen(true)}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#B89628] hover:from-amber-300 hover:to-[#D4AF37] text-black font-extrabold text-xs shadow-lg transition-all flex items-center gap-1.5 border border-amber-300/60 shrink-0 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-black" />
                      <span>Upload Wish</span>
                    </motion.button>
                  </div>

                </div>
              </section>
            );
          })
        )}
      </div>

      {/* 5. SLIDE-UP COMMENTS DRAWER (ACCEPTS NORMAL COMMENTS FOR SPECIFIC VIDEO) */}
      <AnimatePresence>
        {isCommentsOpen && selectedMediaForComments && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCommentsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto bg-white text-gray-900 rounded-t-3xl shadow-2xl border-t-2 border-gold-500/40 max-h-[70vh] flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between text-center relative">
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2" />
                <h4 className="font-serif font-bold text-sm text-gray-900 mx-auto pt-2">
                  Comments for this Video ({comments.length})
                </h4>
                <button
                  onClick={() => setIsCommentsOpen(false)}
                  className="p-1 rounded-full hover:bg-black/10 text-gray-500 absolute right-4 top-4"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No comments on this video yet. Add a comment below!
                  </div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-full bg-black text-gold-400 font-serif font-bold text-[10px] flex items-center justify-center shrink-0 border border-gold-500/30">
                        {c.senderName.charAt(0)}
                      </div>
                      <div className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-serif font-bold text-gray-900 text-[11px]">{c.senderName}</span>
                          <span className="text-[9px] text-gray-500">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-gray-800 text-xs font-light">{c.comment}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleCommentSubmit} className="p-4 border-t border-gray-100 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={commentSender}
                  onChange={(e) => setCommentSender(e.target.value)}
                  placeholder="Your Name"
                  className="w-1/3 px-3 py-2 rounded-xl bg-gray-50 text-xs text-gray-900 border border-gold-500/30 focus:outline-none focus:ring-1 focus:ring-gold-500"
                  required
                />
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment on this video..."
                  className="flex-1 px-3 py-2 rounded-xl bg-gray-50 text-xs text-gray-900 border border-gold-500/30 focus:outline-none focus:ring-1 focus:ring-gold-500"
                  required
                />
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="p-2 rounded-xl bg-black text-gold-400 hover:bg-gray-800 transition-colors disabled:opacity-50 border border-gold-500/30"
                >
                  <Send className="w-4 h-4 text-gold-400" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 6. UPLOAD GUEST WISH MODAL (WISHES ONLY - VIDEO OR TEXT FORMAT) */}
      <AnimatePresence>
        {isUploadOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="p-6 rounded-3xl border-2 border-gold-500 bg-white text-gray-900 max-w-md w-full relative shadow-2xl"
            >
              <button
                onClick={() => setIsUploadOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-black text-gold-400 flex items-center justify-center border border-gold-500/30">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-gray-900">Send Your Wedding Wish</h3>
                  <p className="text-[10px] text-gold-600 font-bold">Upload video clip or text wish for Sara & Dawit</p>
                </div>
              </div>

              {uploadSuccess ? (
                <div className="py-8 text-center text-emerald-600 space-y-2">
                  <CheckCircle className="w-12 h-12 mx-auto animate-bounce" />
                  <p className="font-bold text-sm">Wish Uploaded Successfully!</p>
                  <p className="text-[11px] text-gray-500">Your wish is now live on the wedding feed.</p>
                </div>
              ) : (
                <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs text-left">
                  <div>
                    <label className="block text-gray-900 font-bold mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={uploaderName}
                      onChange={(e) => setUploaderName(e.target.value)}
                      placeholder="e.g. Aunt Meron & Family"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gold-500/30 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-900 font-bold mb-1">Wish Message / Caption *</label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write your sweet wish for the couple..."
                      rows={3}
                      className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gold-500/30 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-900 font-bold mb-1">Wish Video Clip (Optional)</label>
                    <label className="border-2 border-dashed border-gold-500/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all bg-gray-50">
                      <Upload className="w-5 h-5 text-gold-600 mb-1" />
                      <span className="text-[11px] text-gray-900 font-medium">Record or choose wish video</span>
                      <span className="text-[9px] text-gray-500">MP4, MOV video up to 60s</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="hidden"
                      />
                    </label>
                    {videoFile && (
                      <p className="text-[10px] text-emerald-600 mt-1">✓ Selected: {videoFile.name}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-black font-extrabold text-xs shadow-gold transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2 border border-gold-400/40"
                  >
                    {uploading ? 'Publishing Wish...' : 'Publish Wish 💖'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

```

### File: `frontend/src/app/event/[slug]/gallery/page.tsx`

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  ArrowLeft, 
  Sparkles, 
  Film, 
  Heart, 
  Home, 
  Calendar, 
  X, 
  Download, 
  Share2,
  Crown,
  Play
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

interface GalleryItem {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  category: 'ENGAGEMENT' | 'PRE_WEDDING' | 'BTS' | 'CEREMONY';
  title: string;
  url: string;
  thumbnailUrl?: string;
  likes: number;
}

export default function WeddingGalleryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'ENGAGEMENT' | 'PRE_WEDDING' | 'BTS'>('ALL');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g1',
      type: 'IMAGE',
      category: 'ENGAGEMENT',
      title: 'Romantic Sunset Proposal at Lake Tana',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      likes: 142,
    },
    {
      id: 'g2',
      type: 'IMAGE',
      category: 'PRE_WEDDING',
      title: 'Traditional Habesha Kemis Portrait Session',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
      likes: 198,
    },
    {
      id: 'g3',
      type: 'IMAGE',
      category: 'ENGAGEMENT',
      title: 'Mount Entoto Forest Walk',
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop',
      likes: 115,
    },
    {
      id: 'g4',
      type: 'IMAGE',
      category: 'BTS',
      title: 'Bridal Crown Fitting & Mezmurs',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop',
      likes: 89,
    },
    {
      id: 'g5',
      type: 'VIDEO',
      category: 'PRE_WEDDING',
      title: 'Royal Invitation Reel & Teaser',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-in-a-park-on-their-wedding-day-43185-large.mp4',
      likes: 254,
    },
    {
      id: 'g6',
      type: 'IMAGE',
      category: 'BTS',
      title: 'Sheraton Luxury Ballroom Floral Design',
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop',
      likes: 176,
    },
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="min-h-screen w-full bg-stone-950 text-white font-sans relative pb-32 overflow-x-hidden">
      
      {/* Background Glow Accents */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* 1. TOP HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-gold-500/30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <Link
            href={`/event/${slug}`}
            className="w-9 h-9 rounded-full bg-black/60 border border-gold-500/40 text-gold-400 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link href={`/event/${slug}`}>
            <img
              src="/branding/artboard-15.png"
              alt="Agafari Logo"
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/event/${slug}/feed`}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-amber-500 text-black text-xs font-extrabold shadow-gold hover:scale-105 transition-transform"
          >
            <Film className="w-3.5 h-3.5 text-black" />
            <span>TikTok Memory Feed</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      {/* 2. HERO HEADER SECTION */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/50 text-gold-300 text-xs font-extrabold tracking-widest uppercase shadow-md">
            <Camera className="w-3.5 h-3.5 text-gold-400" />
            <span>SARA & DAWIT MEMORIES</span>
          </div>
          <h1 className="font-script text-5xl sm:text-7xl font-bold text-white drop-shadow-2xl py-1">
            Photo & Video Gallery
          </h1>
          <p className="text-gray-300 font-serif italic text-sm sm:text-base max-w-xl mx-auto leading-relaxed drop-shadow">
            "A collection of timeless moments, romantic portraits, and behind-the-scenes memories."
          </p>
          <div className="w-36 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto rounded-full" />
        </div>

        {/* 3. CATEGORY FILTERS */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {[
            { id: 'ALL', label: 'All Memories' },
            { id: 'ENGAGEMENT', label: 'Engagement Shoot' },
            { id: 'PRE_WEDDING', label: 'Pre-Wedding Vows' },
            { id: 'BTS', label: 'Behind The Scenes' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer border shadow-md ${
                activeCategory === cat.id
                  ? 'bg-gold-500 text-black border-gold-400 shadow-gold scale-105'
                  : 'bg-black/70 text-gold-300 border-gold-500/40 hover:bg-black/90'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 4. MASONRY PHOTO & VIDEO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              onClick={() => setSelectedItem(item)}
              className="group relative rounded-3xl overflow-hidden border-2 border-gold-500/30 hover:border-gold-500 transition-all cursor-pointer shadow-2xl bg-black/80 aspect-4/3 sm:aspect-square"
            >
              {item.type === 'VIDEO' ? (
                <div className="w-full h-full relative flex items-center justify-center bg-black">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    muted
                  />
                  <div className="w-14 h-14 rounded-full bg-gold-500/80 text-black flex items-center justify-center absolute z-10 shadow-gold group-hover:scale-125 transition-transform">
                    <Play className="w-6 h-6 fill-black translate-x-0.5" />
                  </div>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              )}

              {/* Gradient & Hover Caption Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end text-left space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/30 text-gold-300 font-bold text-[9px] uppercase tracking-widest w-fit border border-gold-500/40">
                  {item.category.replace('_', ' ')}
                </span>
                <h3 className="font-serif font-bold text-white text-base leading-snug drop-shadow">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-gold-400 pt-1 font-bold">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>{item.likes} Likes</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* 5. LIGHTBOX MODAL PREVIEW */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-4xl w-full bg-black border-2 border-gold-500/60 rounded-3xl overflow-hidden relative shadow-2xl text-left"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/80 text-gold-400 flex items-center justify-center hover:bg-gold-500 hover:text-black transition-all border border-gold-500/40 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative max-h-[70vh] flex items-center justify-center bg-black">
                {selectedItem.type === 'VIDEO' ? (
                  <video
                    src={selectedItem.url}
                    controls
                    autoPlay
                    className="w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    className="w-full max-h-[70vh] object-contain"
                  />
                )}
              </div>

              <div className="p-6 bg-stone-950 border-t border-gold-500/30 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {selectedItem.title}
                  </h3>
                  <div className="text-xs text-gold-400 font-medium mt-0.5">
                    {selectedItem.category.replace('_', ' ')} • {selectedItem.likes} Likes
                  </div>
                </div>

                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-5 py-2.5 rounded-2xl bg-gold-500 text-black font-extrabold text-xs shadow-gold hover:bg-gold-400 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>Download</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. FLOATING BOTTOM NAVIGATION DOCK (4 CHOICES: HOME, HISTORY, PROGRAM, GALLERY) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-xl border-2 border-gold-500/60 rounded-full px-3 py-2 shadow-2xl flex items-center gap-2 sm:gap-3 text-xs font-bold">
        {/* 1) Home */}
        <Link
          href={`/event/${slug}`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Home className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        {/* 2) Couple History */}
        <Link
          href={`/event/${slug}/history`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Heart className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Couple History</span>
          <span className="sm:hidden">History</span>
        </Link>

        {/* 3) Lists of Programs */}
        <Link
          href={`/event/${slug}/program`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Programs</span>
        </Link>

        {/* 4) Gallery (ACTIVE) */}
        <Link
          href={`/event/${slug}/gallery`}
          className="px-4 py-2 rounded-full bg-gold-500 text-black shadow-gold scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Camera className="w-4 h-4 shrink-0" />
          <span>Gallery</span>
        </Link>
      </div>

    </div>
  );
}

```

### File: `frontend/src/app/event/[slug]/history/page.tsx`

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Home, 
  Camera, 
  Clock, 
  Crown,
  Quote
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

interface EventData {
  brideName: string;
  groomName: string;
  venueName: string;
  eventDate: string;
}

export default function CoupleHistoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { t } = useTranslation();
  const [event, setEvent] = useState<EventData | null>(null);

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await fetch(`/api/events/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data.event);
        }
      } catch (err) {
        console.error('Failed to load event for history page:', err);
      }
    }
    loadEvent();
  }, [slug]);

  const timelineEvents = [
    {
      year: '2021',
      title: 'A Chance Encounter in Addis Ababa',
      subtitle: 'First Meeting at Tomoca Coffee',
      description: 'Sara and Dawit first crossed paths on a sunny afternoon in Addis Ababa. What began as a simple coffee conversation turned into hours of deep dialogue about faith, family traditions, and their shared vision for the future.',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
      badge: 'THE BEGINNING',
    },
    {
      year: '2022',
      title: 'Sunset Walks & Deepening Connection',
      subtitle: 'Mount Entoto & Unity Park Memories',
      description: 'Over weekend walks amidst the aromatic eucalyptus trees of Entoto, their bond blossomed into a deep romantic commitment. They discovered a shared passion for community service, music, and travel.',
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
      badge: 'GROWING IN LOVE',
    },
    {
      year: '2025',
      title: 'Under the Stars at Lake Tana',
      subtitle: 'The Candlelight Proposal',
      description: 'During a weekend retreat near Lake Tana, Dawit surprised Sara with a romantic candlelight dinner by the water. With violin serenade playing in the background, he got down on one knee and proposed. Sara joyfully answered "YES!"',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
      badge: 'THE PROPOSAL',
    },
    {
      year: '2026',
      title: 'Our Royal Wedding Covenant',
      subtitle: 'August 15, 2026 • Sheraton Addis Luxury Ballroom',
      description: 'Surrounded by our beloved family, respected elders, and cherished friends, we unite our lives in holy matrimony and celebrate the beginning of our forever journey together.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      badge: 'FOREVER TOGETHER',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-stone-950 text-white font-sans relative pb-32 overflow-x-hidden">
      
      {/* Background Glow Accents */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* 1. TOP HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-gold-500/30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <Link
            href={`/event/${slug}`}
            className="w-9 h-9 rounded-full bg-black/60 border border-gold-500/40 text-gold-400 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link href={`/event/${slug}`}>
            <img
              src="/branding/artboard-15.png"
              alt="Agafari Logo"
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold">
            <Crown className="w-3.5 h-3.5 text-gold-400" />
            <span>Love Story & Journey</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/50 text-gold-300 text-xs font-extrabold tracking-widest uppercase shadow-md">
            <Heart className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
            <span>SARA & DAWIT'S LOVE STORY</span>
          </div>
          <h1 className="font-script text-5xl sm:text-7xl font-bold text-white drop-shadow-2xl py-1">
            How Our Journey Began
          </h1>
          <p className="text-gray-300 font-serif italic text-sm sm:text-base max-w-xl mx-auto leading-relaxed drop-shadow">
            "Two lives, two hearts, joined together by faith, grace, and an everlasting love story."
          </p>
          <div className="w-36 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto rounded-full" />
        </div>

        {/* 3. TIMELINE CARDS */}
        <div className="relative border-l-2 border-gold-500/40 ml-4 sm:ml-32 space-y-12 pl-6 sm:pl-10">
          {timelineEvents.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Timeline Gold Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-stone-950 border-4 border-gold-500 group-hover:scale-125 transition-transform shadow-gold" />

              {/* Year Badge (Desktop Side Indicator) */}
              <div className="hidden sm:block absolute -left-36 top-1 text-right font-mono font-extrabold text-gold-400 text-base">
                {item.year}
              </div>

              {/* Content Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-black/80 backdrop-blur-xl border border-gold-500/40 hover:border-gold-500 transition-all shadow-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-500/20 pb-3">
                  <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 font-bold text-[10px] uppercase tracking-widest border border-gold-500/30">
                    {item.badge}
                  </span>
                  <span className="sm:hidden font-mono text-xs font-bold text-gold-400">
                    {item.year}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2 space-y-2 text-left">
                    <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-white">
                      {item.title}
                    </h3>
                    <div className="text-xs text-gold-400 font-semibold uppercase tracking-wider">
                      {item.subtitle}
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-gold-500/30 shadow-md">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 md:h-36 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4. LOVE QUOTE CARD */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-950/80 via-black/80 to-amber-950/80 backdrop-blur-xl border-2 border-gold-500/50 text-center space-y-3 shadow-2xl">
          <Quote className="w-10 h-10 text-gold-400 mx-auto opacity-60" />
          <p className="font-serif italic text-base sm:text-xl text-gold-200 max-w-2xl mx-auto">
            "Love is patient, love is kind. It always protects, always trusts, always hopes, always perseveres."
          </p>
          <div className="text-xs text-gold-400 font-bold uppercase tracking-widest pt-2">
            1 Corinthians 13:4-7
          </div>
        </div>
      </main>

      {/* 5. FLOATING BOTTOM NAVIGATION DOCK (4 CHOICES: HOME, HISTORY, PROGRAM, GALLERY) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-xl border-2 border-gold-500/60 rounded-full px-3 py-2 shadow-2xl flex items-center gap-2 sm:gap-3 text-xs font-bold">
        {/* 1) Home */}
        <Link
          href={`/event/${slug}`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Home className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        {/* 2) Couple History (ACTIVE) */}
        <Link
          href={`/event/${slug}/history`}
          className="px-4 py-2 rounded-full bg-gold-500 text-black shadow-gold scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Heart className="w-4 h-4 shrink-0 fill-black" />
          <span className="hidden sm:inline">Couple History</span>
          <span className="sm:hidden">History</span>
        </Link>

        {/* 3) Lists of Programs */}
        <Link
          href={`/event/${slug}/program`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Programs</span>
        </Link>

        {/* 4) Gallery */}
        <Link
          href={`/event/${slug}/gallery`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Camera className="w-4 h-4 shrink-0" />
          <span>Gallery</span>
        </Link>
      </div>

    </div>
  );
}

```

### File: `frontend/src/app/event/[slug]/invitation/page.tsx`

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RedirectInvitationPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeParam = searchParams.get('code');

  useEffect(() => {
    // The invitation page has been merged into the master wedding celebration hub
    const targetUrl = codeParam 
      ? `/event/${params.slug}?code=${codeParam}` 
      : `/event/${params.slug}`;
    router.replace(targetUrl);
  }, [params.slug, codeParam, router]);

  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-metallic border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-serif text-sage-dark text-sm">Opening Unified Wedding Celebration Hub...</p>
      </div>
    </div>
  );
}

```

### File: `frontend/src/app/event/[slug]/live/page.tsx`

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LiveStreamPage({ params }: { params: { slug: string } }) {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect /live to the TikTok-Style Memory Reel Feed page
    router.replace(`/event/${params.slug}/feed`);
  }, [params.slug, router]);

  return (
    <div className="min-h-screen bg-charcoal text-ivory flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-serif text-gold-400">
          Redirecting to TikTok Video Memory Feed...
        </p>
      </div>
    </div>
  );
}

```

### File: `frontend/src/app/event/[slug]/page.tsx`

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  Send, 
  Calendar, 
  MapPin, 
  Video, 
  QrCode, 
  Film, 
  CheckCircle, 
  MessageSquareHeart, 
  ArrowLeft, 
  ArrowRight, 
  Navigation, 
  Crown, 
  Shirt, 
  Music, 
  CheckCircle2, 
  Users, 
  Building2, 
  X, 
  Radio, 
  Share2, 
  HelpCircle, 
  User, 
  Upload, 
  Play, 
  Camera, 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  ExternalLink,
  Home
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

interface MezmurItem {
  id: string;
  title: string;
  artist: string;
  category: 'MEZMUR' | 'TRADITIONAL' | 'DANCE' | 'SLOW';
}

interface EventData {
  id: string;
  slug: string;
  title: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  venueName: string;
  venueAddress: string;
  venueMapUrl: string;
  dressCode?: string;
  welcomeMessage: string;
  coverImageUrl: string;
  youtubeStreamUrl?: string;
  youtubeVideoId?: string;
  isLive?: boolean;
  backgroundMusicUrl?: string;
  backgroundMusicTitle?: string;
  mezmurPlaylist?: MezmurItem[];
}

interface WishData {
  id: string;
  eventId: string;
  senderName: string;
  message: string;
  mediaType?: 'TEXT' | 'VIDEO';
  videoUrl?: string;
  createdAt: string;
}

interface InvitationRecord {
  id: string;
  inviteCode: string;
  guestName: string;
  maxGuests: number;
  inviteType: 'CARD' | 'LINK';
  tableNumber?: string;
}

export default function PublicWeddingCelebrationPage({
  params,
}: {
  params: { slug: string };
}) {
  const { t, locale } = useTranslation();
  const { slug } = params;
  const searchParams = useSearchParams();
  const codeParam = searchParams.get('code');

  const [event, setEvent] = useState<EventData | null>(null);
  const [wishes, setWishes] = useState<WishData[]>([]);
  const [invitation, setInvitation] = useState<InvitationRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Active Guest Profile State
  const [activeInviteCode, setActiveInviteCode] = useState<string>(codeParam || 'INV-SD2026-001');
  const [rsvpGuestName, setRsvpGuestName] = useState<string>('Abebe Kebede & Guest');
  const [invitationSource, setInvitationSource] = useState<'CARD' | 'LINK'>('CARD');

  // Interactive Wish State (VIDEO BLESSING DEFAULT)
  const [wishType, setWishType] = useState<'TEXT' | 'VIDEO'>('VIDEO');
  const [senderName, setSenderName] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [submittingWish, setSubmittingWish] = useState(false);
  const [wishSubmittedSuccess, setWishSubmittedSuccess] = useState(false);

  // Guest Song Suggestion
  const [guestSongTitle, setGuestSongTitle] = useState('');
  const [guestSongArtist, setGuestSongArtist] = useState('');
  const [songSubmittedSuccess, setSongSubmittedSuccess] = useState(false);

  // Attendance RSVP Modal State (5-Second Prompt)
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [hasAnsweredRsvp, setHasAnsweredRsvp] = useState(false);
  const [attendanceChoice, setAttendanceChoice] = useState<'ATTENDING' | 'DECLINED' | 'MAYBE'>('ATTENDING');
  const [guestAttendanceType, setGuestAttendanceType] = useState<'SINGLE' | 'COUPLE'>('COUPLE');
  const [recommendedSong, setRecommendedSong] = useState('');
  const [submittingRsvp, setSubmittingRsvp] = useState(false);
  const [rsvpSuccessMessage, setRsvpSuccessMessage] = useState('');
  const [copiedPass, setCopiedPass] = useState(false);

  // State for Bottom Dock Active Tab Modals & Audio Toggle
  const [activeTabModal, setActiveTabModal] = useState<'NONE' | 'HISTORY' | 'PROGRAM' | 'GALLERY'>('NONE');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((err) => {
        console.error('Audio playback error:', err);
      });
    }
  };

  // Real-time Countdown Timer State
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    async function loadEventHub() {
      try {
        const [eventRes, wishesRes] = await Promise.all([
          fetch(`/api/events/${slug}`),
          fetch(`/api/events/${slug}/wishes`),
        ]);

        if (eventRes.ok) {
          const eventData = await eventRes.json();
          setEvent(eventData.event);
        }

        if (wishesRes.ok) {
          const wishesData = await wishesRes.json();
          setWishes(wishesData.wishes || []);
        }

        // 1. Check if guest query param is present in URL
        const guestQuery = searchParams.get('guest') || searchParams.get('name');
        if (guestQuery) {
          const decodedGuest = decodeURIComponent(guestQuery).trim();
          if (decodedGuest) {
            setRsvpGuestName(decodedGuest);
            setSenderName(decodedGuest);
          }
        }

        // 2. Check if specific invite code was passed
        if (codeParam) {
          try {
            const inviteRes = await fetch(`/api/events/${slug}/invitations?code=${codeParam}`);
            if (inviteRes.ok) {
              const inviteData = await inviteRes.json();
              if (inviteData.invitation) {
                setInvitation(inviteData.invitation);
                setActiveInviteCode(inviteData.invitation.inviteCode);
                if (inviteData.invitation.guestName) {
                  setRsvpGuestName(inviteData.invitation.guestName);
                  setSenderName(inviteData.invitation.guestName);
                }
                setInvitationSource(inviteData.invitation.inviteType || 'LINK');
              }
            }
          } catch (e) {}
        }
      } catch (err) {
        console.error('Failed to load event celebration hub:', err);
      } finally {
        setLoading(false);
      }
    }

    loadEventHub();

    // Trigger RSVP Modal
    const timer = setTimeout(() => {
      setRsvpModalOpen(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, [slug, codeParam]);

  // Real-time Countdown Clock Tick
  useEffect(() => {
    if (!event?.eventDate) return;

    const target = new Date(event.eventDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event?.eventDate]);

  // Submit RSVP Attendance Directly (1-Click Instant Automatic Submit)
  const handleDirectRsvpSelect = async (choice: 'ATTENDING' | 'MAYBE' | 'DECLINED') => {
    setAttendanceChoice(choice);
    setSubmittingRsvp(true);

    try {
      const res = await fetch(`/api/events/${slug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: rsvpGuestName,
          status: choice,
          inviteCode: activeInviteCode,
        }),
      });

      if (res.ok) {
        setHasAnsweredRsvp(true);
        const data = await res.json();
        setRsvpSuccessMessage(
          data.message || (
            choice === 'ATTENDING'
              ? (locale === 'am' ? '✓ በደስታ እንጠብቅዎታለን! (Attending Confirmed)' : '✓ Wonderful! Your attendance is confirmed. See you at the celebration!')
              : choice === 'MAYBE'
              ? (locale === 'am' ? '✓ እናመሰግናለን! ምላሽዎ ተመዝግቧል።' : '✓ Thank you! We have recorded your response.')
              : (locale === 'am' ? '✓ እናመሰግናለን! የሙሽሮቹ መልካም ምኞት ከእርስዎ ጋር ይሁን።' : '✓ Thank you for letting us know. You will be missed!')
          )
        );
        setTimeout(() => {
          setRsvpModalOpen(false);
          setRsvpSuccessMessage('');
        }, 1800);
      }
    } catch (err) {
      console.error('Failed to submit RSVP:', err);
    } finally {
      setSubmittingRsvp(false);
    }
  };

  // Submit Wish or Video Blessing
  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || (!wishMessage.trim() && !videoFile && !videoPreviewUrl)) return;

    setSubmittingWish(true);
    try {
      const payloadMessage = wishType === 'VIDEO'
        ? `[📹 Video Blessing Uploaded]: ${wishMessage.trim() || 'Heartfelt video blessing for the couple!'}`
        : wishMessage;

      const fallbackVideo = 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-smiling-and-holding-hands-43183-large.mp4';
      const res = await fetch(`/api/events/${slug}/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          senderName, 
          message: payloadMessage,
          mediaType: wishType,
          videoUrl: wishType === 'VIDEO' ? (videoPreviewUrl || fallbackVideo) : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.wish) {
          setWishes((prev) => [data.wish, ...prev]);
        }
        setWishSubmittedSuccess(true);
        setSenderName('');
        setWishMessage('');
        setVideoFile(null);
        setVideoPreviewUrl(null);
        setTimeout(() => setWishSubmittedSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Failed to submit wish:', err);
    } finally {
      setSubmittingWish(false);
    }
  };

  // Handle Video File Selection
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    }
  };

  // Submit Guest Song Recommendation
  const handleSongRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestSongTitle.trim()) return;

    setSongSubmittedSuccess(true);
    setGuestSongTitle('');
    setGuestSongArtist('');
    setTimeout(() => setSongSubmittedSuccess(false), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-serif text-gold-400 text-sm">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="glass-panel-dark p-8 rounded-3xl text-center max-w-md border-2 border-gold-500/40 shadow-2xl">
          <h2 className="font-serif text-xl font-bold text-gold-400 mb-2">Wedding Not Found</h2>
          <p className="text-white/70 text-xs mb-6">The requested wedding link is invalid or expired.</p>
          <Link href="/" className="px-5 py-2 rounded-full bg-gold-500 text-black font-bold text-xs shadow-md">
            {t('common.back')}
          </Link>
        </div>
      </div>
    );
  }

  // Dynamic Unique QR Code Payload Generator
  const currentQuota = guestAttendanceType === 'COUPLE' ? 2 : 1;
  const currentTable = invitation?.tableNumber || (currentQuota === 2 ? 'Table 1: VIP Couples' : 'Table 4: Individual VIP');

  const qrPayload = JSON.stringify({
    code: activeInviteCode,
    guest: rsvpGuestName,
    quota: currentQuota,
    event: event.slug,
  });

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    qrPayload
  )}`;

  // Standardized Professional 800x1200 Digital Pass Card Generator
  const downloadVerificationCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark Gold Luxury Background
    ctx.fillStyle = '#09090B';
    ctx.fillRect(0, 0, 800, 1200);

    // Outer & Inner Gold Foil Borders
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 10;
    ctx.strokeRect(25, 25, 750, 1150);

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, 730, 1130);

    // Couple Image Banner (Top Half)
    const coupleImg = new Image();
    coupleImg.crossOrigin = 'anonymous';
    coupleImg.onload = () => {
      ctx.drawImage(coupleImg, 45, 45, 710, 360);

      // Dark Overlay Gradient over image
      const gradient = ctx.createLinearGradient(0, 45, 0, 405);
      gradient.addColorStop(0, 'rgba(0,0,0,0.1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = gradient;
      ctx.fillRect(45, 45, 710, 360);

      // Header Text over Image Banner
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AGAFARI ROYAL ENTRANCE PASS', 400, 100);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 38px serif';
      ctx.fillText(`${event.brideName} & ${event.groomName}`, 400, 165);

      ctx.fillStyle = '#F3F4F6';
      ctx.font = '16px serif';
      ctx.fillText('ROYAL WEDDING CELEBRATION', 400, 205);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`${new Date(event.eventDate).toLocaleDateString()} • ${event.venueName}`, 400, 370);

      // Card Main Details Body Container
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(60, 420, 680, 710);

      // Guest Name & Table Details
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 30px serif';
      ctx.fillText(rsvpGuestName || 'Valued Guest & Family', 400, 485);

      ctx.fillStyle = '#B45309';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`ADMIT: ${currentQuota} PERSON(S) • ${currentTable}`, 400, 530);

      // High-Density Scannable QR Code
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 240, 570, 320, 320);

        ctx.fillStyle = '#111827';
        ctx.font = 'bold 18px monospace';
        ctx.fillText(`PASS CODE: ${activeInviteCode}`, 400, 930);

        // Security Verification Seal Banner
        ctx.fillStyle = '#065F46';
        ctx.fillRect(100, 970, 600, 70);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('✓ OFFICIAL GATE SECURITY VERIFIED PASS', 400, 1012);

        ctx.fillStyle = '#6B7280';
        ctx.font = '13px sans-serif';
        ctx.fillText('Present this pass at the gate scanner for usher verification.', 400, 1090);

        const a = document.createElement('a');
        a.download = `Agafari_Royal_Pass_${activeInviteCode}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
      qrImg.src = qrImageUrl;
    };
    coupleImg.src = '/images/hero_couple_bg.png';
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 pb-28 font-sans relative">
      
      {/* ========================================================================= */}
      {/* 1. FULL-SCREEN HERO BANNER (100% FULL WIDTH & HEIGHT - NO ZIGZAG) */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-screen h-screen bg-stone-950 text-white flex flex-col justify-between p-4 sm:p-8 overflow-hidden shadow-2xl">
        {/* Fixed 100% Full Cover Background Image - No Zigzag Cuts */}
        <img
          src="/images/hero_couple_bg.png"
          alt={`${event.brideName} and ${event.groomName}`}
          className="fixed inset-0 w-full h-full object-cover object-center filter brightness-105 contrast-105 saturate-110 z-0 pointer-events-none"
        />
        {/* Soft Contrast Gradient Overlay for Text Readability Without Darkening Faces */}
        <div className="fixed inset-0 bg-gradient-to-b from-black/50 via-transparent to-stone-950/95 z-0 pointer-events-none" />

        {/* Top Header Bar - Fixed at Very Top (Logo, Music Toggle, Language Switcher) */}
        <nav className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto py-2">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {/* Artboard-15 White/Gold Amharic Logo without background */}
            <img
              src="/branding/artboard-15.png"
              alt="Agafari (አጋፋሪ) Logo"
              className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-md"
            />
          </Link>

          <div className="flex items-center gap-3 shrink-0">
            {/* YouTube Background Mezmur (oVs7dGNBOp8 - ለይኩኑ) & HTML5 Audio Player */}
            {event?.youtubeVideoId || event?.backgroundMusicUrl?.includes('youtube') || event?.backgroundMusicUrl?.includes('youtu.be') ? (
              <iframe
                id="youtube-audio-player"
                src={`https://www.youtube.com/embed/${event?.youtubeVideoId || 'oVs7dGNBOp8'}?enablejsapi=1&autoplay=${isPlayingAudio ? 1 : 0}&loop=1&playlist=${event?.youtubeVideoId || 'oVs7dGNBOp8'}`}
                className="hidden"
                allow="autoplay"
              />
            ) : null}

            <audio
              ref={audioRef}
              loop
              src={event?.backgroundMusicUrl || '/audio/leykunu_mezmur.mp3'}
            />

            {/* Icon-Only Mute / Unmute Button */}
            <button
              onClick={toggleAudio}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all cursor-pointer shadow-md ${
                isPlayingAudio
                  ? 'bg-gold-500 text-black shadow-gold scale-110 border border-gold-300'
                  : 'bg-black/80 text-gold-400 border border-gold-500/40 hover:scale-105'
              }`}
              title={isPlayingAudio ? 'Mute Sound' : 'Unmute Sound'}
            >
              {isPlayingAudio ? '🔊' : '🔇'}
            </button>

            <div className="hidden lg:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-gold-400 text-xs font-bold border border-gold-500/40 shadow-lg">
              <Crown className="w-4 h-4 text-gold-400" />
              <span>Invitation for <strong>{rsvpGuestName || 'Dear Guest'}</strong></span>
            </div>

            <LanguageSwitcher />
          </div>
        </nav>

        {/* FLOATING TYPOGRAPHY ALIGNED TO THE VERY BOTTOM OF HERO PHOTO */}
        <div className="relative z-20 text-center max-w-3xl mx-auto mt-auto pb-8 sm:pb-12 space-y-2">
          {/* SAVE THE DATE Header */}
          <h2 className="font-serif text-sm sm:text-lg font-bold text-gold-400 tracking-[0.25em] uppercase drop-shadow-md">
            SAVE THE DATE
          </h2>

          {/* CALLIGRAPHIC CURSIVE COUPLE NAMES */}
          <h1 className="font-script text-5xl sm:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl tracking-wide py-1">
            Sara & Dawit
          </h1>

          {/* EVENT DATE & VENUE */}
          <div className="space-y-0.5 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-gold-200 drop-shadow">
            <p>AUGUST 15TH, 2026</p>
            <p className="text-[11px] sm:text-xs text-white/90 font-bold">AT SHERATON ADDIS, BALLROOM</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN INVITATION LETTER & DETAILS SECTIONS BELOW HERO */}
      {/* ========================================================================= */}
      <section className="relative z-10 px-4 sm:px-6 py-10 max-w-4xl mx-auto space-y-10">
        
        {/* FLOATING INVITATION LETTER BELOW HERO */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full text-white text-center space-y-5 py-4 relative"
        >
          {/* Dear Families and Friends Title */}
          <h3 className="font-script text-3xl sm:text-5xl font-bold text-gold-300 drop-shadow-lg">
            Dear Families and Friends
          </h3>

          {/* Formal Invitation Message */}
          <p className="text-gray-200 text-xs sm:text-sm sm:text-base leading-relaxed font-serif italic max-w-2xl mx-auto px-4 drop-shadow">
            "Together with their families, <strong>Sara & Dawit</strong> joyfully invite you to celebrate their wedding day! Join us as we say <em>'I do'</em> on August 15th at the Sheraton Addis Luxury Ballroom. It will be a beautiful evening filled with love, laughter, and unforgettable memories and we'd be honored to share it with you."
          </p>

          {/* 3D COUNTDOWN TIMER TICKER */}
          <div className="pt-3 pb-2">
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto">
              {[
                { label: t('publicEvent.countdown.days'), value: timeLeft.days },
                { label: t('publicEvent.countdown.hours'), value: timeLeft.hours },
                { label: t('publicEvent.countdown.minutes'), value: timeLeft.minutes },
                { label: t('publicEvent.countdown.seconds'), value: timeLeft.seconds },
              ].map((unit, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="p-2.5 sm:p-3.5 rounded-2xl border-2 border-gold-500/60 bg-black/80 backdrop-blur-md text-center shadow-2xl"
                >
                  <div className="font-serif text-xl sm:text-3xl font-extrabold text-gold-400 drop-shadow">
                    {String(unit.value).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] text-gold-200 uppercase font-bold tracking-wider mt-0.5">
                    {unit.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* SUPER ATTRACTIVE, MAGNETIC "SHOW THE MAP" BUTTON */}
          <div className="pt-4 border-t border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-5 px-2">
            <div className="text-left flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
              <span className="text-xs sm:text-sm text-gray-200 font-medium drop-shadow">
                {event.venueName} • {event.venueAddress}
              </span>
            </div>

            <a
              href={event.venueMapUrl || 'https://maps.google.com/?q=Sheraton+Addis'}
              target="_blank"
              rel="noreferrer"
              className="relative group overflow-hidden w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-gold-400 to-amber-500 hover:from-gold-300 hover:to-amber-400 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(234,179,8,0.6)] transition-all duration-300 flex items-center justify-center gap-3 shrink-0 border-2 border-amber-200 cursor-pointer hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-black animate-bounce" />
              </div>
              <span className="drop-shadow-sm font-black">📍 TAP TO OPEN VENUE MAP & DIRECTIONS</span>
              <ExternalLink className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>

          {/* FLOATING CULTURAL GOLD PROTOCOL (NO CONTAINER BOX) */}
          <div className="w-full max-w-4xl text-gold-200 text-xs space-y-4 text-left py-4 border-t border-b border-gold-500/30">
            <div className="pb-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest block">
                  Official Event Protocol & Details
                </span>
                <h3 className="font-serif text-lg font-bold text-white mt-0.5 drop-shadow">
                  Ceremony & Celebration Guidelines
                </h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 font-bold text-[10px] border border-gold-500/40 backdrop-blur-md">
                VIP RSVP
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gold-400 shrink-0" />
                <div>
                  <span className="font-bold text-white">Date: August 15, 2026</span>
                  <p className="text-[11px] text-gray-300">Gate check-in starts at 1:00 PM</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
                <div>
                  <span className="font-bold text-white">Venue: Sheraton Addis Luxury Ballroom</span>
                  <p className="text-[11px] text-gray-300">Taitu Street, Addis Ababa, Ethiopia</p>
                </div>
              </div>

              {event.dressCode && (
                <div className="flex items-center gap-3 sm:col-span-2 border-t border-gold-500/20 pt-3">
                  <Shirt className="w-5 h-5 text-gold-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gold-400 font-semibold uppercase">Dress Code</div>
                    <span className="font-bold text-white text-xs">{event.dressCode}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FLOATING WATCH LIVE BROADCAST BANNER */}
          <div className="w-full max-w-4xl p-6 rounded-3xl bg-gradient-to-r from-rose-950/80 via-black/80 to-rose-950/80 backdrop-blur-xl border-2 border-rose-500/50 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/30 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40">
                <Video className="w-6 h-6 text-rose-400 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Live Broadcast Stream</div>
                <h3 className="font-serif font-bold text-lg text-white">Watch Sara & Dawit's Wedding Live</h3>
              </div>
            </div>

            <Link
              href={`/event/${slug}`}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-800 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 border border-rose-400/40 cursor-pointer hover:scale-105"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span>Watch Live Broadcast</span>
            </Link>
          </div>

          {/* FLOATING ATTENDANCE RSVP BUTTON BAR */}
          <div className="w-full max-w-4xl p-6 sm:p-8 rounded-3xl border-2 border-gold-500/50 bg-black/80 backdrop-blur-xl text-white flex items-center justify-between shadow-2xl">
            <div className="text-left">
              <div className="text-xs text-gold-400 font-bold uppercase tracking-wider mb-1">
                Attendance Confirmation
              </div>
              <div className="font-serif font-bold text-base sm:text-xl text-white">
                {hasAnsweredRsvp ? 'Confirmed for Wedding Celebration ✓' : 'Will you attend our celebration?'}
              </div>
            </div>

            <button
              onClick={() => setRsvpModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-600 text-black font-extrabold text-xs sm:text-sm shadow-gold transition-all shrink-0 border border-gold-400 cursor-pointer hover:scale-105"
            >
              {hasAnsweredRsvp ? 'Update RSVP' : 'Submit RSVP'}
            </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. QR GATE PASS SECTION (ONLY QR BOX HAS WHITE BG CARD, WORDS & BUTTONS FLOAT) */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 py-8 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full text-center space-y-6 py-4"
        >
          {/* Invitation Source Detection Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-gold-400 text-[11px] font-bold shadow-md border border-gold-500/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {invitationSource === 'CARD'
                ? '🏷️ Physical Invitation Card • Pre-Printed QR Verified'
                : '✨ Direct Link Guest • Dynamic Gate Pass Generated'}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-wide drop-shadow-md">
              {t('publicEvent.qrPass.title')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-light max-w-lg mx-auto leading-relaxed drop-shadow">
              {t('publicEvent.qrPass.subtitle')}
            </p>
          </div>

          {/* Scannable Unique QR Code Card (ONLY THIS HAS WHITE CARD BACKGROUND) */}
          <div className="p-4 sm:p-5 bg-white rounded-3xl border-2 border-gold-500/50 inline-block shadow-2xl relative group my-2">
            <img
              src={qrImageUrl}
              alt={`Personal Entrance QR Pass for ${rsvpGuestName}`}
              className="w-52 h-52 sm:w-64 sm:h-64 mx-auto rounded-2xl"
            />
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-extrabold text-gray-900 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE TOKEN SIGNATURE: {activeInviteCode}</span>
            </div>
          </div>

          {/* Pass Meta Information */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-bold text-gold-300 bg-black/70 backdrop-blur-md py-1.5 px-4 rounded-full inline-block border border-gold-500/40 shadow-md">
              PASS CODE: <span className="text-gold-400 font-extrabold">{activeInviteCode}</span>
            </div>
            <div className="text-xs text-gray-200 font-medium drop-shadow">
              {t('publicEvent.qrPass.quotaAllowed')}: <strong className="text-white font-bold">{currentQuota} {currentQuota > 1 ? t('common.guests') : t('common.guest')}</strong>
            </div>
          </div>

          {/* Pass Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {/* Download Gate Pass Image with Couple Photo */}
            <button
              type="button"
              onClick={downloadVerificationCard}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-gold-500 text-black font-extrabold text-xs shadow-gold transition-all flex items-center gap-2 border border-amber-200 cursor-pointer active:scale-95 hover:scale-105"
            >
              <Download className="w-4 h-4 text-black" />
              {t('publicEvent.qrPass.downloadPass')}
            </button>

            {/* Copy Personal Guest Deep Link */}
            <button
              onClick={() => {
                const personalLink = `${window.location.origin}/event/${slug}?code=${activeInviteCode}&guest=${encodeURIComponent(rsvpGuestName)}`;
                navigator.clipboard.writeText(personalLink);
                setCopiedPass(true);
                setTimeout(() => setCopiedPass(false), 3000);
              }}
              className="px-6 py-3 rounded-full bg-black/80 backdrop-blur-md text-white hover:bg-black/90 font-bold text-xs border border-gold-500/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95 hover:scale-105 shadow-md"
            >
              {copiedPass ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gold-400" />}
              {copiedPass ? t('common.copied') : 'Copy Personal Invitation Link'}
            </button>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HONORED VIP PERFORMERS & GUEST SONG RECOMMENDATION SECTION */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 py-8 max-w-4xl mx-auto border-t border-gold-500/20">
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/40">
              <Music className="w-5 h-5 text-gold-400" />
            </div>
            <div className="text-left">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white drop-shadow">
                Honored VIP Performers & Choirs
              </h3>
              <p className="text-xs text-gray-300 font-light">
                Distinguished musical guests & spiritual choirs performing at our wedding.
              </p>
            </div>
          </div>

          {/* Invited Famous Artists / Choirs Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Ethiopian Orthodox Wedding Choir', role: 'Spiritual Entrance Mezmurs', type: 'CHOIR' },
              { name: 'Addis Cultural Habesha Band', role: 'Traditional Eskista & Merekba Dance', type: 'BAND' },
              { name: 'Acoustic Habesha Ensemble', role: 'Dinner & Royal Vows Serenade', type: 'ACOUSTIC' },
            ].map((artist, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-black/70 backdrop-blur-md border border-gold-500/30 text-left space-y-1 shadow-md">
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-bold text-[9px] border border-gold-500/30">
                  {artist.type}
                </span>
                <div className="font-serif font-bold text-white text-sm mt-1 drop-shadow">{artist.name}</div>
                <div className="text-[11px] text-gray-300">{artist.role}</div>
              </div>
            ))}
          </div>

          {/* Guest Mezmur / Song Recommendation Box */}
          <div className="p-6 rounded-2xl border border-gold-500/30 bg-black/70 backdrop-blur-md text-left shadow-lg">
            <h4 className="font-serif font-bold text-white text-sm mb-1 drop-shadow">
              Recommend a Mezmur or Song to the Couple
            </h4>
            <p className="text-xs text-gray-300 font-light mb-4">
              Have a favorite spiritual Mezmur or upbeat Eskista song you'd love to hear at the wedding? Suggest it below!
            </p>

            {songSubmittedSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Thank you! Your song recommendation has been sent to Sara & Dawit!
              </div>
            ) : (
              <form onSubmit={handleSongRecommendation} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <input
                  type="text"
                  required
                  value={guestSongTitle}
                  onChange={(e) => setGuestSongTitle(e.target.value)}
                  placeholder="Song or Mezmur Title"
                  className="px-3.5 py-2.5 rounded-xl border border-gold-500/40 bg-black/60 text-xs text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <input
                  type="text"
                  value={guestSongArtist}
                  onChange={(e) => setGuestSongArtist(e.target.value)}
                  placeholder="Choir / Singer (Optional)"
                  className="px-3.5 py-2.5 rounded-xl border border-gold-500/40 bg-black/60 text-xs text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-gold-500 text-black font-extrabold text-xs hover:bg-gold-400 shadow-gold flex items-center justify-center gap-1.5 border border-gold-300 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-black" /> Send Recommendation
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 5. GUEST BLESSING SECTION (VIDEO BLESSING DEFAULT) */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 sm:p-12 rounded-3xl border border-gold-500/30 hover:border-gold-500 transition-all duration-300 bg-white text-gray-900 relative overflow-hidden shadow-sm"
        >
          <div className="text-center mb-8 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500 via-amber-300 to-gold-600 text-black mx-auto flex items-center justify-center mb-3 shadow-md">
              <MessageSquareHeart className="w-7 h-7 text-black" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black text-gold-400 text-[10px] font-bold uppercase tracking-widest mb-2 shadow-sm border border-gold-500/30">
              <Sparkles className="w-3 h-3 text-gold-400" />
              {t('publicEvent.wishes.badge')}
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
              {t('publicEvent.wishes.title')}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm mt-1 font-light max-w-lg mx-auto leading-relaxed">
              {t('publicEvent.wishes.subtitle')}
            </p>

            {/* Mode Switcher - Video Blessing Selected First */}
            <div className="flex items-center justify-center gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setWishType('VIDEO')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  wishType === 'VIDEO'
                    ? 'bg-black text-gold-400 shadow-md border border-gold-500/40 scale-105'
                    : 'bg-gray-50 border border-gold-500/30 text-gray-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" /> 📹 Video Blessing (Default)
              </button>
              <button
                type="button"
                onClick={() => setWishType('TEXT')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  wishType === 'TEXT'
                    ? 'bg-black text-gold-400 shadow-md border border-gold-500/40 scale-105'
                    : 'bg-gray-50 border border-gold-500/30 text-gray-900'
                }`}
              >
                <MessageSquareHeart className="w-3.5 h-3.5" /> ✍️ Text Blessing
              </button>
            </div>
          </div>

          <form onSubmit={handleWishSubmit} className="space-y-4 text-xs relative z-10">
            <div>
              <label className="block text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                {t('publicEvent.wishes.senderName')}
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder={t('publicEvent.wishes.senderPlaceholder')}
                className="w-full px-4 py-3 rounded-xl border-2 border-gold-500/30 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500 text-xs font-medium"
              />
            </div>

            {wishType === 'VIDEO' ? (
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-gray-900 uppercase tracking-wider">
                  Upload Video Blessing
                </label>

                {videoPreviewUrl ? (
                  <div className="rounded-2xl overflow-hidden border-2 border-gold-500/40 bg-black/90 p-3 text-center space-y-2">
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="w-full max-h-60 rounded-xl mx-auto"
                    />
                    <div className="flex items-center justify-between text-[11px] text-white px-1">
                      <span>✓ Video ready: {videoFile?.name || 'video_blessing.mp4'}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoFile(null);
                          setVideoPreviewUrl(null);
                        }}
                        className="text-rose-400 hover:text-rose-300 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gold-500/50 rounded-2xl p-8 text-center cursor-pointer hover:border-gold-500 transition-all block bg-gray-50 group shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-gold-500/20 text-gray-900 mx-auto flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-gold-600" />
                    </div>
                    <p className="font-serif font-bold text-sm text-gray-900">Record or Select Video Blessing</p>
                    <p className="text-[11px] text-gray-500 mt-1 font-light">Supports phone video recording up to 60 seconds (Max 50MB)</p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                  </label>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-1">
                    Caption / Personal Message
                  </label>
                  <input
                    type="text"
                    value={wishMessage}
                    onChange={(e) => setWishMessage(e.target.value)}
                    placeholder="e.g. Wishing you endless joy and blessings!"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gold-500/30 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500 text-xs font-medium"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                  {t('publicEvent.wishes.messageLabel')}
                </label>
                <textarea
                  required
                  rows={4}
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  placeholder={t('publicEvent.wishes.messagePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gold-500/30 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500 text-xs leading-relaxed font-medium"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submittingWish}
              className="w-full py-4 rounded-full bg-gold-500 hover:bg-gold-600 text-black font-extrabold text-xs sm:text-sm shadow-gold transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer border border-gold-400/40"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{submittingWish ? t('publicEvent.wishes.sendingButton') : t('publicEvent.wishes.submitButton')}</span>
              <Send className="w-4 h-4 text-black" />
            </button>
          </form>

          <AnimatePresence>
            {wishSubmittedSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-center text-xs"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="font-bold">{t('publicEvent.wishes.successMsg')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 6. FLOATING BOTTOM NAVIGATION DOCK (4 CHOICES: HOME, HISTORY, PROGRAM, GALLERY) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-xl border-2 border-gold-500/60 rounded-full px-3 py-2 shadow-2xl flex items-center gap-2 sm:gap-3 text-xs font-bold animate-in slide-in-from-bottom-5">
        {/* 1) Home (ACTIVE) */}
        <Link
          href={`/event/${slug}`}
          className="px-4 py-2 rounded-full bg-gold-500 text-black shadow-gold scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Home className="w-4 h-4 shrink-0 fill-black" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        {/* 2) Couple History */}
        <Link
          href={`/event/${slug}/history`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Heart className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Couple History</span>
          <span className="sm:hidden">History</span>
        </Link>

        {/* 3) Lists of Programs */}
        <Link
          href={`/event/${slug}/program`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Programs</span>
        </Link>

        {/* 4) Gallery */}
        <Link
          href={`/event/${slug}/gallery`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Camera className="w-4 h-4 shrink-0" />
          <span>Gallery</span>
        </Link>
      </div>

      {/* 7. BOTTOM EVENT ORGANIZER & HAMELMAL CREATIVES PROMOTION */}
      <section className="mt-12 py-10 bg-white border-t border-gray-100 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-black text-gold-400 flex items-center justify-center font-serif font-bold text-xl shadow-sm shrink-0 border border-gold-500/30">
              H
            </div>
            <div>
              <div className="text-[10px] text-gold-600 font-bold uppercase tracking-wider">
                Event Host & Digital Operations
              </div>
              <h4 className="font-serif font-bold text-gray-900 text-base">
                Yonas Planners & Hamelmal Creatives
              </h4>
              <p className="text-xs text-gray-500 font-light mt-0.5">
                Full-service technical event production, digital gate pass security, and live broadcast engineering.
              </p>
            </div>
          </div>

          <a
            href="https://hamelmal.com"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 border border-gold-500/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Visit Hamelmal Creatives</span>
            <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
          </a>
        </div>
      </section>

      {/* 8. 5-SECOND "WILL YOU COME?" SMART RSVP POPUP MODAL */}
      <AnimatePresence>
        {rsvpModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="p-7 sm:p-9 rounded-3xl border-2 border-gold-500 max-w-lg w-full relative bg-white text-gray-900 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setRsvpModalOpen(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-gray-900 p-1.5 rounded-full bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gold-500 text-black mx-auto flex items-center justify-center mb-3 shadow-gold">
                  <Heart className="w-6 h-6 fill-black text-black" />
                </div>
                <span className="text-[10px] text-gold-600 font-bold uppercase tracking-widest block mb-1">
                  Wedding Attendance Confirmation
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                  {rsvpGuestName || 'Dear Guest & Family'}
                </h3>
                <p className="text-gold-700 text-xs mt-1 font-serif italic font-medium">
                  {event.brideName} & {event.groomName} cordially invite you to celebrate our union!
                </p>
              </div>

              {rsvpSuccessMessage ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center text-emerald-950 text-xs shadow-md">
                  <CheckCircle className="w-9 h-9 text-emerald-600 mx-auto mb-2 animate-bounce" />
                  <p className="font-bold text-sm text-gray-900">
                    {locale === 'am' ? 'ምላሽዎ ተመዝግቧል!' : 'Response Confirmed!'}
                  </p>
                  <p className="text-[11px] text-emerald-800 mt-1">{rsvpSuccessMessage}</p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  {submittingRsvp && (
                    <div className="py-2 text-center text-xs text-gold-600 font-semibold animate-pulse">
                      {t('common.submitting')}
                    </div>
                  )}

                  {/* 3 Instant Choices - Auto Submit on Tap */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {/* 1. YES - Attending */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      disabled={submittingRsvp}
                      onClick={() => handleDirectRsvpSelect('ATTENDING')}
                      className="p-4 rounded-2xl border-2 border-gold-500 bg-gold-500 hover:bg-gold-600 text-black font-extrabold text-xs shadow-gold transition-all flex items-center justify-between group disabled:opacity-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-black text-gold-400 flex items-center justify-center shadow-sm shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-gold-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-serif font-bold text-sm text-black">
                            {locale === 'am' ? 'በደስታ እገኛለሁ 🥂' : 'Yes, Attending 🥂'}
                          </div>
                          <div className="text-[10px] text-black/80 font-medium">
                            {locale === 'am' ? 'በሰርጉ ላይ እገኛለሁ' : 'I will be there to celebrate with you'}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    {/* 2. MAYBE - Undecided */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      disabled={submittingRsvp}
                      onClick={() => handleDirectRsvpSelect('MAYBE')}
                      className="p-4 rounded-2xl border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold text-xs shadow-sm transition-all flex items-center justify-between group disabled:opacity-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gold-500/20 text-gold-700 flex items-center justify-center shadow-sm shrink-0">
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-serif font-bold text-sm text-gray-900">
                            {locale === 'am' ? 'እርግጠኛ አይደለሁም 🤔' : 'Maybe 🤔'}
                          </div>
                          <div className="text-[10px] text-gray-600 font-normal">
                            {locale === 'am' ? 'አልወሰንኩም / ምናልባት እገኛለሁ' : 'Not sure yet / Will try to make it'}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-700 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    {/* 3. NO - Declined */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      disabled={submittingRsvp}
                      onClick={() => handleDirectRsvpSelect('DECLINED')}
                      className="p-4 rounded-2xl border-2 border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-900 font-bold text-xs shadow-sm transition-all flex items-center justify-between group disabled:opacity-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm shrink-0">
                          <X className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-serif font-bold text-sm text-rose-900">
                            {locale === 'am' ? 'አልችልም 💔' : 'Cannot Attend 💔'}
                          </div>
                          <div className="text-[10px] text-rose-700/80 font-normal">
                            {locale === 'am' ? 'በሰርጉ ላይ መገኘት አልችልም' : 'Unable to attend, best wishes'}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-rose-600 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

```

### File: `frontend/src/app/event/[slug]/program/page.tsx`

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  MapPin, 
  Home, 
  Heart, 
  Camera, 
  Crown,
  Music,
  Utensils,
  Camera as CameraIcon,
  Shirt,
  Wine
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

interface EventData {
  brideName: string;
  groomName: string;
  venueName: string;
  venueAddress: string;
  eventDate: string;
}

export default function WeddingProgramPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { t } = useTranslation();
  const [event, setEvent] = useState<EventData | null>(null);
  const [activeDay, setActiveDay] = useState<'MAIN' | 'MELSE'>('MAIN');

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await fetch(`/api/events/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data.event);
        }
      } catch (err) {
        console.error('Failed to load event for program page:', err);
      }
    }
    loadEvent();
  }, [slug]);

  const mainPrograms = [
    {
      time: '11:00 AM',
      title: 'Groom & Groomsmen Arrival & Preparation',
      location: 'Sheraton Addis Executive Suite',
      description: 'Groom dressing, traditional blessing from parents and elders before heading to church.',
      icon: Clock,
      category: 'PREPARATION',
    },
    {
      time: '01:00 PM',
      title: 'Holy Matrimony & Orthodox Church Blessing',
      location: 'Addis Ababa Orthodox Cathedral',
      description: 'Sacred wedding vows, crowning ceremony, and exchange of rings before holy altar.',
      icon: Crown,
      category: 'CEREMONY',
    },
    {
      time: '03:30 PM',
      title: 'Royal Photo Session & Garden Toast',
      location: 'Friendship Park & Entoto Botanic Gardens',
      description: 'Bridal party and family portrait sessions surrounded by breathtaking scenery.',
      icon: CameraIcon,
      category: 'PHOTOSHOOT',
    },
    {
      time: '05:30 PM',
      title: 'Grand Entrance of Bride & Groom',
      location: 'Sheraton Addis Luxury Ballroom',
      description: 'Red carpet reception entrance with traditional Mezmur choirs and trumpet fanfare.',
      icon: Sparkles,
      category: 'ENTRANCE',
    },
    {
      time: '06:30 PM',
      title: 'Royal Wedding Banquet & Dinner',
      location: 'Sheraton Luxury Dining Hall',
      description: 'Exquisite Habesha & international buffet feast accompanied by acoustic live band.',
      icon: Utensils,
      category: 'DINNER',
    },
    {
      time: '08:00 PM',
      title: 'Wedding Cake Cutting & Champagne Toast',
      location: 'Main Ballroom Stage',
      description: 'Parent speeches, formal toasts, and cutting of the 5-tier royal wedding cake.',
      icon: Wine,
      category: 'TOAST',
    },
    {
      time: '09:30 PM',
      title: 'Merekba & Eskista Traditional Dance Celebration',
      location: 'Grand Ballroom Dance Floor',
      description: 'Upbeat traditional Ethiopian dance, live music, and evening celebration with guests.',
      icon: Music,
      category: 'CELEBRATION',
    },
  ];

  const melsePrograms = [
    {
      time: '02:00 PM',
      title: 'Melse Reception & Habesha Kemis Dressing',
      location: 'Residence Luxury Pavilion',
      description: 'Traditional Habesha cultural attire showcase, royal crown headpiece fitting.',
      icon: Shirt,
      category: 'MELSE',
    },
    {
      time: '04:00 PM',
      title: 'Koba & Bread Cutting Cultural Protocol',
      location: 'Cultural Stage',
      description: 'Traditional bread cutting and blessings bestowed by mother and elders.',
      icon: Sparkles,
      category: 'CULTURE',
    },
    {
      time: '06:00 PM',
      title: 'Traditional Feast & Gursha Ceremony',
      location: 'Main Dining Tent',
      description: 'Traditional Ethiopian dishes, honey wine (Tej), and intimate family gathering.',
      icon: Utensils,
      category: 'FEAST',
    },
  ];

  const activePrograms = activeDay === 'MAIN' ? mainPrograms : melsePrograms;

  return (
    <div className="min-h-screen w-full bg-stone-950 text-white font-sans relative pb-32 overflow-x-hidden">
      
      {/* Background Glow Accents */}
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* 1. TOP HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-gold-500/30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <Link
            href={`/event/${slug}`}
            className="w-9 h-9 rounded-full bg-black/60 border border-gold-500/40 text-gold-400 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link href={`/event/${slug}`}>
            <img
              src="/branding/artboard-15.png"
              alt="Agafari Logo"
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span>Event Schedule & Programs</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* 2. HERO HEADER SECTION */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/50 text-gold-300 text-xs font-extrabold tracking-widest uppercase shadow-md">
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            <span>OFFICIAL WEDDING TIMELINE</span>
          </div>
          <h1 className="font-script text-5xl sm:text-7xl font-bold text-white drop-shadow-2xl py-1">
            Lists of Programs & Events
          </h1>
          <p className="text-gray-300 font-serif italic text-sm sm:text-base max-w-xl mx-auto leading-relaxed drop-shadow">
            "Join us for each memorable chapter of our wedding celebration, from holy vows to traditional evening dance."
          </p>
          <div className="w-36 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto rounded-full" />
        </div>

        {/* 3. EVENT DAY SWITCHER (MAIN WEDDING VS MELSE) */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setActiveDay('MAIN')}
            className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer border shadow-lg ${
              activeDay === 'MAIN'
                ? 'bg-gold-500 text-black border-gold-400 shadow-gold scale-105'
                : 'bg-black/70 text-gold-300 border-gold-500/40 hover:bg-black/90'
            }`}
          >
            👑 Main Wedding Day (Aug 15)
          </button>
          <button
            onClick={() => setActiveDay('MELSE')}
            className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer border shadow-lg ${
              activeDay === 'MELSE'
                ? 'bg-gold-500 text-black border-gold-400 shadow-gold scale-105'
                : 'bg-black/70 text-gold-300 border-gold-500/40 hover:bg-black/90'
            }`}
          >
            ✨ Melse Celebration (Aug 16)
          </button>
        </div>

        {/* 4. PROGRAM LIST ITEMS */}
        <div className="space-y-4">
          {activePrograms.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="p-6 sm:p-8 rounded-3xl bg-black/80 backdrop-blur-xl border border-gold-500/40 hover:border-gold-500 transition-all shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/40 shadow-md mt-1 sm:mt-0">
                    <IconComponent className="w-6 h-6 text-gold-400" />
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-bold text-[9px] uppercase tracking-widest border border-gold-500/30">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gold-400 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm font-light pt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-2.5 rounded-2xl bg-gold-500/20 border border-gold-500/50 text-gold-300 font-mono font-extrabold text-sm sm:text-base shrink-0 self-end sm:self-center shadow-md">
                  {item.time}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* 5. FLOATING BOTTOM NAVIGATION DOCK (4 CHOICES: HOME, HISTORY, PROGRAM, GALLERY) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-xl border-2 border-gold-500/60 rounded-full px-3 py-2 shadow-2xl flex items-center gap-2 sm:gap-3 text-xs font-bold">
        {/* 1) Home */}
        <Link
          href={`/event/${slug}`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Home className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        {/* 2) Couple History */}
        <Link
          href={`/event/${slug}/history`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Heart className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Couple History</span>
          <span className="sm:hidden">History</span>
        </Link>

        {/* 3) Lists of Programs (ACTIVE) */}
        <Link
          href={`/event/${slug}/program`}
          className="px-4 py-2 rounded-full bg-gold-500 text-black shadow-gold scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Lists of Programs</span>
          <span className="sm:hidden">Programs</span>
        </Link>

        {/* 4) Gallery */}
        <Link
          href={`/event/${slug}/gallery`}
          className="px-3.5 py-2 rounded-full text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Camera className="w-4 h-4 shrink-0" />
          <span>Gallery</span>
        </Link>
      </div>

    </div>
  );
}

```

### File: `frontend/src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-serif: 'Playfair Display', 'Noto Serif Ethiopic', 'Abyssinica SIL', Georgia, serif;
  --font-sans: 'Inter', 'Noto Sans Ethiopic', sans-serif;
  --font-script: 'Great Vibes', 'Noto Serif Ethiopic', cursive;
  --font-ethiopic-serif: 'Noto Serif Ethiopic', 'Abyssinica SIL', serif;
  --font-ethiopic-sans: 'Noto Sans Ethiopic', sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  background-color: #FFFFFF;
}

body {
  background-color: #FFFFFF; /* 90%+ Dominant Luminous White Canvas */
  color: #111827;           /* High Legibility Dark Slate Text */
  font-family: var(--font-sans);
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

/* Authentic Ge'ez / Amharic Royal Calligraphy & Unique Font Highlights */
.font-amharic-royal {
  font-family: 'Noto Serif Ethiopic', 'Abyssinica SIL', serif;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #B8860B; /* Deep Metallic Royal Gold */
}

.font-amharic-script {
  font-family: 'Noto Serif Ethiopic', 'Abyssinica SIL', serif;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #D4AF37;
  text-shadow: 0 2px 10px rgba(212, 175, 55, 0.35);
}

.font-amharic-body {
  font-family: 'Noto Sans Ethiopic', 'Inter', sans-serif;
}

/* Luminous White & Gold Glass Cards */
.glass-panel {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1.5px solid rgba(212, 175, 55, 0.35) !important;
  box-shadow: 0 8px 30px -5px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.glass-panel:hover {
  border-color: #D4AF37 !important;
  box-shadow: 0 12px 35px -5px rgba(212, 175, 55, 0.35), 0 0 20px rgba(212, 175, 55, 0.2) !important;
}

.glass-panel-dark {
  background: rgba(12, 12, 12, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1.5px solid rgba(212, 175, 55, 0.4) !important;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.glass-panel-dark:hover {
  border-color: #D4AF37 !important;
  box-shadow: 0 14px 40px -5px rgba(212, 175, 55, 0.45) !important;
}

/* Pure CSS Keyframe Infinite Marquee Loop */
@keyframes marquee-loop {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.marquee-container {
  overflow: hidden;
  width: 100%;
  position: relative;
}

.marquee-track {
  display: flex;
  gap: 1.5rem;
  width: max-content;
  animation: marquee-loop 25s linear infinite;
  will-change: transform;
}

.marquee-track:hover {
  animation-play-state: paused;
}

/* Metallic Gold Text Gradient for Headlines */
.gold-metallic-text {
  color: #B8860B;
  background: linear-gradient(135deg, #D4AF37 0%, #AA8828 50%, #8C6A28 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gold-metallic-solid {
  color: #D4AF37;
}

/* Clean Default Browser Scrollbar */
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: transparent;
}
```

### File: `frontend/src/app/layout.tsx`

```tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Agafari (አጋፋሪ) — Smart Digital Wedding Celebration Ecosystem',
  description: 'Digital Invitations, Gate Scanning, Live Streaming, and Interactive TikTok Event Feeds by Hamelmal Creatives.',
  icons: {
    icon: '/branding/artboard-13.png',
    shortcut: '/branding/artboard-13.png',
    apple: '/branding/artboard-13.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth bg-white">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Abyssinica+SIL&family=Great+Vibes&family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Ethiopic:wght@300;400;500;600;700;800;900&family=Noto+Serif+Ethiopic:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 antialiased selection:bg-gold-500 selection:text-black">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

```

### File: `frontend/src/app/organizer/dashboard/page.tsx`

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Calendar, 
  Users, 
  Video, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  KeyRound, 
  Film, 
  ShieldCheck, 
  LogOut, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  Archive, 
  Search, 
  Plus, 
  Copy, 
  Check, 
  MapPin, 
  Crown, 
  ScanLine, 
  Share2, 
  Lock, 
  Radio, 
  Send, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Menu,
  X,
  Layers,
  Upload
} from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

interface EventCredential {
  fullName: string;
  email: string;
  temporaryPassword?: string;
  role: string;
}

interface EventData {
  id: string;
  slug: string;
  title: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  startTime?: string;
  venueName: string;
  venueAddress: string;
  dressCode?: string;
  coverImageUrl?: string;
  status: 'DRAFT' | 'COMING_SOON' | 'LIVE' | 'COMPLETED' | 'ARCHIVED';
  adminApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  coupleCredentials?: {
    email: string;
    temporaryPassword?: string;
  };
  credentials?: {
    couple: EventCredential;
    organizer: EventCredential;
    streamer: EventCredential;
    scanner: EventCredential;
  };
  stats?: {
    totalInvites: number;
    totalWishes: number;
    totalMedia: number;
  };
}

interface MediaAssetData {
  id: string;
  eventId: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE';
  cdnUrl: string;
  caption: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function OrganizerDashboardPage() {
  const { t } = useTranslation();
  // Navigation: 'WEDDINGS' (Pillar 2) | 'CREDENTIALS' (Pillar 1) | 'MEDIA'
  const [activeTab, setActiveTab] = useState<'WEDDINGS' | 'CREDENTIALS' | 'MEDIA'>('WEDDINGS');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [events, setEvents] = useState<EventData[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetData[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Wedding for Deep Inspection (Pillar 2)
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  // Wedding Fleet Directory Filters
  const [fleetFilter, setFleetFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVE' | 'PENDING'>('ALL');
  const [searchFleetQuery, setSearchFleetQuery] = useState('');

  // Pillar 1: Request Admin Approval & Provision Couple Credentials Form State
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [coupleEmail, setCoupleEmail] = useState('');
  const [eventDate, setEventDate] = useState('2026-10-15');
  const [venueName, setVenueName] = useState('');
  const [requestingApproval, setRequestingApproval] = useState(false);
  const [provisionSuccessMsg, setProvisionSuccessMsg] = useState('');
  const [newlyProvisionedCreds, setNewlyProvisionedCreds] = useState<{ email: string; pass: string; slug: string } | null>(null);

  // Password Visibility State & Copied feedback
  const [copiedKey, setCopiedKey] = useState<string>('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadOrganizerData() {
      try {
        const [eventsRes, mediaRes] = await Promise.all([
          fetch('/api/organizer/events'),
          fetch('/api/organizer/media'),
        ]);

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          const loadedEvents: EventData[] = eventsData.events || [];
          setEvents(loadedEvents);
          if (loadedEvents.length > 0) {
            setSelectedEvent(loadedEvents[0]);
          }
        }

        if (mediaRes.ok) {
          const mediaData = await mediaRes.json();
          setMediaAssets(mediaData.mediaAssets || []);
        }
      } catch (err) {
        console.error('Failed to load organizer data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrganizerData();
  }, []);

  // Pillar 1 Handler: Request Admin Approval & Provision Couple Credentials
  const handleRequestCoupleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName.trim() || !groomName.trim() || !coupleEmail.trim() || !venueName.trim()) return;

    setRequestingApproval(true);
    try {
      const res = await fetch('/api/organizer/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brideName,
          groomName,
          coupleEmail,
          eventDate,
          venueName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.event) {
        setEvents((prev) => [data.event, ...prev]);
        setSelectedEvent(data.event);
        setNewlyProvisionedCreds({
          email: data.event.coupleCredentials?.email || coupleEmail,
          pass: data.event.coupleCredentials?.temporaryPassword || 'couple123',
          slug: data.event.slug,
        });
        setProvisionSuccessMsg(
          `Wedding "${data.event.title}" registered! Couple credentials generated & admin verification request dispatched.`
        );
        setBrideName('');
        setGroomName('');
        setCoupleEmail('');
        setVenueName('');
      }
    } catch (err) {
      console.error('Failed to provision couple credentials:', err);
    } finally {
      setRequestingApproval(false);
    }
  };

  // Admin Approval Simulator (Toggle between PENDING & APPROVED)
  const handleToggleAdminApproval = async (eventId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'APPROVED' ? 'PENDING' : 'APPROVED';
    try {
      const res = await fetch('/api/organizer/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, adminApprovalStatus: nextStatus }),
      });

      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, adminApprovalStatus: nextStatus } : e))
        );
        if (selectedEvent && selectedEvent.id === eventId) {
          setSelectedEvent((prev) => prev ? { ...prev, adminApprovalStatus: nextStatus } : null);
        }
      }
    } catch (err) {
      console.error('Failed to toggle approval:', err);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 3000);
  };

  const toggleShowPassword = (key: string) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Metrics Calculations
  const activeHostingEvents = events.filter((e) => e.status !== 'COMPLETED' && e.status !== 'ARCHIVED');
  const hostedArchiveEvents = events.filter((e) => e.status === 'COMPLETED' || e.status === 'ARCHIVED');
  const pendingAdminEvents = events.filter((e) => e.adminApprovalStatus === 'PENDING');

  // Filtered Events according to Fleet filter
  const filteredEvents = events.filter((evt) => {
    const matchesSearch = evt.title.toLowerCase().includes(searchFleetQuery.toLowerCase()) ||
                          evt.venueName.toLowerCase().includes(searchFleetQuery.toLowerCase()) ||
                          evt.brideName.toLowerCase().includes(searchFleetQuery.toLowerCase()) ||
                          evt.groomName.toLowerCase().includes(searchFleetQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (fleetFilter === 'ALL') return true;
    if (fleetFilter === 'ACTIVE') return evt.status !== 'COMPLETED' && evt.status !== 'ARCHIVED';
    if (fleetFilter === 'ARCHIVE') return evt.status === 'COMPLETED' || evt.status === 'ARCHIVED';
    if (fleetFilter === 'PENDING') return evt.adminApprovalStatus === 'PENDING';
    return true;
  });

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 flex font-sans selection:bg-gold-500 selection:text-black">
      
      {/* =========================================================================
          1. ORGANIZER STRUCTURED EXECUTIVE SIDEBAR
         ========================================================================= */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gray-950 text-white flex flex-col justify-between border-r border-gold-500/30 transition-transform duration-300 ease-in-out
        md:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-gold-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/branding/artboard-13.png"
                  alt="Agafari (አጋፋሪ) Logo"
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <h2 className="font-serif font-bold text-base text-gold-400 tracking-wide">
                    {t('organizerDashboard.brand')}
                  </h2>
                  <span className="text-[10px] text-gold-500/80 font-semibold uppercase tracking-widest block">
                    {t('organizerDashboard.subtitle')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden p-1 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                <div className="text-emerald-400 font-bold text-base">{activeHostingEvents.length}</div>
                <div className="text-white/70 text-[10px]">{t('organizerDashboard.kpiHosting')}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                <div className="text-[#D4AF37] font-bold text-base">{hostedArchiveEvents.length}</div>
                <div className="text-white/70 text-[10px]">{t('organizerDashboard.kpiArchive')}</div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            
            {/* Pillar 2: Hosted & Active Weddings */}
            <button
              onClick={() => { setActiveTab('WEDDINGS'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'WEDDINGS'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-gold-400" />
                <span>{t('organizerDashboard.tabs.weddings')}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gold-300 font-bold">
                {events.length}
              </span>
            </button>

            {/* Pillar 1: Couple Credentials Provisioning */}
            <button
              onClick={() => { setActiveTab('CREDENTIALS'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'CREDENTIALS'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <KeyRound className="w-4 h-4 text-gold-400" />
                <span>{t('organizerDashboard.tabs.credentials')}</span>
              </div>
              {pendingAdminEvents.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 font-bold">
                  {pendingAdminEvents.length}
                </span>
              )}
            </button>

            {/* Pillar 3: Media Vault Moderation */}
            <button
              onClick={() => { setActiveTab('MEDIA'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === 'MEDIA'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Film className="w-4 h-4 text-gold-400" />
                <span>{t('organizerDashboard.tabs.media')}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gold-300 font-bold">
                {mediaAssets.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/organizer/login"
            className="w-full py-2.5 px-3 rounded-xl hover:bg-rose-950/40 text-rose-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('nav.signOut')}</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        />
      )}

      {/* =========================================================================
          2. MAIN WORKSPACE
         ========================================================================= */}
      <div className="flex-1 md:pl-72 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gold-500/30 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-gray-50 border border-gold-500/30 text-gray-900"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="text-[11px] text-gold-600 font-semibold uppercase tracking-wider">
                {t('organizerDashboard.header.tag')}
              </div>
              <h1 className="font-serif font-bold text-lg sm:text-xl text-gray-900">
                {activeTab === 'WEDDINGS' && t('organizerDashboard.header.title')}
                {activeTab === 'CREDENTIALS' && t('organizerDashboard.credentials.title')}
                {activeTab === 'MEDIA' && t('coupleDashboard.media.title')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <button
              onClick={() => setActiveTab('CREDENTIALS')}
              className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-gold-400 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 border border-gold-500/40"
            >
              <Plus className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">{t('organizerDashboard.header.requestBtn')}</span>
            </button>

            <LanguageSwitcher />
          </div>
        </header>

        {/* Workspace Body */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* =========================================================================
              PILLAR 2: HOSTED & ACTIVE WEDDINGS DIRECTORY & 1-CLICK ROLE LAUNCH
             ========================================================================= */}
          {activeTab === 'WEDDINGS' && (
            <div className="space-y-6">
              
              {/* Filter Pills & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-gold-500/30 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setFleetFilter('ALL')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'ALL'
                        ? 'bg-black text-gold-400 shadow-sm'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {t('organizerDashboard.fleet.all')} ({events.length})
                  </button>

                  <button
                    onClick={() => setFleetFilter('ACTIVE')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'ACTIVE'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-gray-50 text-emerald-900 hover:bg-emerald-50'
                    }`}
                  >
                    {t('organizerDashboard.fleet.active')} ({activeHostingEvents.length})
                  </button>

                  <button
                    onClick={() => setFleetFilter('ARCHIVE')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'ARCHIVE'
                        ? 'bg-blue-800 text-white shadow-sm'
                        : 'bg-gray-50 text-blue-900 hover:bg-blue-50'
                    }`}
                  >
                    {t('organizerDashboard.fleet.archive')} ({hostedArchiveEvents.length})
                  </button>

                  <button
                    onClick={() => setFleetFilter('PENDING')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fleetFilter === 'PENDING'
                        ? 'bg-amber-800 text-white shadow-sm'
                        : 'bg-gray-50 text-amber-900 hover:bg-amber-50'
                    }`}
                  >
                    {t('organizerDashboard.fleet.pending')} ({pendingAdminEvents.length})
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gold-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFleetQuery}
                    onChange={(e) => setSearchFleetQuery(e.target.value)}
                    placeholder={t('organizerDashboard.fleet.searchPlaceholder')}
                    className="pl-8 pr-4 py-1.5 rounded-xl border border-gold-500/30 text-xs text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              {/* Event Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((evt) => {
                  const isSelected = selectedEvent?.id === evt.id;
                  const isArchive = evt.status === 'COMPLETED' || evt.status === 'ARCHIVED';

                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className={`
                        rounded-3xl p-5 border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden bg-white
                        ${isSelected ? 'border-gold-500 ring-2 ring-gold-500/50 shadow-lg' : 'border-gold-500/30 hover:border-gold-500 shadow-sm'}
                      `}
                    >
                      <div>
                        {/* Status Badges */}
                        <div className="flex items-center justify-between mb-3">
                          {evt.adminApprovalStatus === 'PENDING' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                              🟡 Pending Admin
                            </span>
                          ) : isArchive ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                              📜 Hosted Archive
                            </span>
                          ) : evt.status === 'LIVE' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-bold animate-pulse">
                              🔴 LIVE NOW
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                              🟢 Active Hosting
                            </span>
                          )}

                          <span className="text-[10px] font-mono text-gold-700 font-bold">
                            {new Date(evt.eventDate).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Image / Header */}
                        <div className="h-32 rounded-2xl overflow-hidden mb-3 relative bg-black/10">
                          {evt.coverImageUrl ? (
                            <img
                              src={evt.coverImageUrl}
                              alt={evt.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black text-gold-400 font-serif font-bold">
                              {evt.brideName} & {evt.groomName}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 text-white">
                            <div>
                              <div className="font-serif font-bold text-sm">{evt.brideName} & {evt.groomName}</div>
                              <div className="text-[10px] text-gold-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {evt.venueName}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] bg-gray-50 p-2 rounded-xl mb-3 border border-gold-500/20">
                          <div>
                            <div className="font-bold text-gray-900">{evt.stats?.totalInvites || 120}</div>
                            <div className="text-gray-500">Invited</div>
                          </div>
                          <div>
                            <div className="font-bold text-emerald-800">{evt.stats?.totalWishes || 24}</div>
                            <div className="text-gray-500">Wishes</div>
                          </div>
                          <div>
                            <div className="font-bold text-gold-600">{evt.stats?.totalMedia || 15}</div>
                            <div className="text-gray-500">Reels</div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold">
                        <span className="text-gray-900">
                          {isSelected ? '✓ Selected in Command Room' : 'Click to View Credentials'}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-gold-500' : 'text-gray-400'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* =========================================================================
                  DRILL-DOWN COMMAND ROOM FOR SELECTED WEDDING
                 ========================================================================= */}
              {selectedEvent && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-gold-500 shadow-xl space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold-500/20">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-gold-400 text-xs font-bold mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                        {t('organizerDashboard.fleet.selectedRoom')}
                      </div>
                      <h2 className="font-serif font-bold text-2xl text-gray-900">
                        {selectedEvent.title}
                      </h2>
                      <div className="text-xs text-gray-600 flex flex-wrap items-center gap-3 mt-1">
                        <span>Date: <strong>{new Date(selectedEvent.eventDate).toLocaleDateString()}</strong></span>
                        <span>•</span>
                        <span>Venue: <strong>{selectedEvent.venueName}</strong></span>
                        <span>•</span>
                        <span>Slug: <strong>/event/{selectedEvent.slug}</strong></span>
                      </div>
                    </div>

                    {/* Admin Approval Toggle Simulation */}
                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs">
                        <div className="text-gray-500 text-[10px] uppercase font-bold">{t('organizerDashboard.fleet.adminStatus')}</div>
                        {selectedEvent.adminApprovalStatus === 'APPROVED' ? (
                          <span className="text-emerald-800 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved & Licensed
                          </span>
                        ) : (
                          <span className="text-amber-800 font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> Awaiting Verification
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleToggleAdminApproval(selectedEvent.id, selectedEvent.adminApprovalStatus)}
                        className="px-3 py-1.5 rounded-xl border border-gold-500/30 bg-gray-50 hover:bg-gray-100 text-[11px] font-bold text-gray-900"
                      >
                        {selectedEvent.adminApprovalStatus === 'APPROVED' ? 'Simulate Revoke' : 'Simulate Admin Approve'}
                      </button>
                    </div>
                  </div>

                  {/* 3 Dedicated Role Launch Cards */}
                  <div>
                    <h3 className="font-serif font-bold text-base text-gray-900 mb-2 flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-gold-500" />
                      {t('organizerDashboard.fleet.roleCredentialsTitle')}
                    </h3>
                    <p className="text-xs text-gray-600 mb-4">
                      {t('organizerDashboard.fleet.roleCredentialsSubtitle')}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      
                      {/* 1. Couple Dashboard Card */}
                      <div className="p-5 rounded-2xl border border-gold-500/30 bg-gray-50 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-9 h-9 rounded-xl bg-black text-gold-400 flex items-center justify-center font-bold shadow-sm">
                              <Crown className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950">
                              👑 Primary Role
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-sm text-gray-900">
                            {t('organizerDashboard.fleet.coupleRole')} ({selectedEvent.brideName} & {selectedEvent.groomName})
                          </h4>
                          <p className="text-[11px] text-gray-600 mt-1">
                            {t('organizerDashboard.fleet.coupleDesc')}
                          </p>

                          <div className="mt-3 p-3 rounded-xl bg-white border border-gold-500/20 text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-[10px]">Login:</span>
                              <span className="font-mono font-bold text-gray-900">
                                {selectedEvent.credentials?.couple.email || selectedEvent.coupleCredentials?.email || `couple@${selectedEvent.slug}.com`}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 text-[10px]">Password:</span>
                              <span className="font-mono text-gray-900 font-bold">
                                {showPasswords['couple'] ? (selectedEvent.credentials?.couple.temporaryPassword || selectedEvent.coupleCredentials?.temporaryPassword || 'couple123') : '••••••••'}
                              </span>
                              <button onClick={() => toggleShowPassword('couple')} className="text-gold-600 hover:text-gray-900">
                                {showPasswords['couple'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Link
                            href="/couple/dashboard"
                            className="w-full py-2.5 px-3 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all border border-gold-500/40"
                          >
                            <span>{t('organizerDashboard.fleet.launchCouple')}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
                          </Link>

                          <button
                            onClick={() => handleCopy(
                              `Couple Portal: ${window.location.origin}/couple/login\nEmail: ${selectedEvent.credentials?.couple.email || selectedEvent.coupleCredentials?.email}\nPassword: ${selectedEvent.credentials?.couple.temporaryPassword || selectedEvent.coupleCredentials?.temporaryPassword || 'couple123'}`,
                              'couple'
                            )}
                            className="w-full py-1.5 px-3 rounded-lg border border-gold-500/30 bg-white hover:bg-gray-50 text-gray-900 text-[11px] font-bold flex items-center justify-center gap-1"
                          >
                            {copiedKey === 'couple' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-gold-600" />}
                            <span>{copiedKey === 'couple' ? t('common.copied') : t('organizerDashboard.fleet.copyCouple')}</span>
                          </button>
                        </div>
                      </div>

                      {/* 2. Live Streamer Card */}
                      <div className="p-5 rounded-2xl border border-gold-500/30 bg-gray-50 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-9 h-9 rounded-xl bg-black text-gold-400 flex items-center justify-center font-bold shadow-sm">
                              <Video className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-950">
                              📹 Video Crew
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-sm text-gray-900">
                            {t('organizerDashboard.fleet.streamerRole')}
                          </h4>
                          <p className="text-[11px] text-gray-600 mt-1">
                            {t('organizerDashboard.fleet.streamerDesc')}
                          </p>

                          <div className="mt-3 p-3 rounded-xl bg-white border border-gold-500/20 text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-[10px]">Login:</span>
                              <span className="font-mono font-bold text-gray-900">
                                {selectedEvent.credentials?.streamer.email || `streamer@${selectedEvent.slug}.com`}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 text-[10px]">Password:</span>
                              <span className="font-mono text-gray-900 font-bold">
                                {showPasswords['streamer'] ? (selectedEvent.credentials?.streamer.temporaryPassword || 'stream123') : '••••••••'}
                              </span>
                              <button onClick={() => toggleShowPassword('streamer')} className="text-gold-600 hover:text-gray-900">
                                {showPasswords['streamer'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Link
                            href={`/event/${selectedEvent.slug}`}
                            target="_blank"
                            className="w-full py-2.5 px-3 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all border border-gold-500/40"
                          >
                            <span>{t('organizerDashboard.fleet.launchStreamer')}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
                          </Link>

                          <button
                            onClick={() => handleCopy(
                              `Streamer Portal: ${window.location.origin}/event/${selectedEvent.slug}\nEmail: ${selectedEvent.credentials?.streamer.email}\nPassword: ${selectedEvent.credentials?.streamer.temporaryPassword || 'stream123'}`,
                              'streamer'
                            )}
                            className="w-full py-1.5 px-3 rounded-lg border border-gold-500/30 bg-white hover:bg-gray-50 text-gray-900 text-[11px] font-bold flex items-center justify-center gap-1"
                          >
                            {copiedKey === 'streamer' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-gold-600" />}
                            <span>{copiedKey === 'streamer' ? t('common.copied') : t('organizerDashboard.fleet.copyStreamer')}</span>
                          </button>
                        </div>
                      </div>

                      {/* 3. Gate Scanner Card */}
                      <div className="p-5 rounded-2xl border border-gold-500/30 bg-gray-50 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-9 h-9 rounded-xl bg-black text-gold-400 flex items-center justify-center font-bold shadow-sm">
                              <ScanLine className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950">
                              📱 Security Terminal
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-sm text-gray-900">
                            {t('organizerDashboard.fleet.scannerRole')}
                          </h4>
                          <p className="text-[11px] text-gray-600 mt-1">
                            {t('organizerDashboard.fleet.scannerDesc')}
                          </p>

                          <div className="mt-3 p-3 rounded-xl bg-white border border-gold-500/20 text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-500 text-[10px]">Login:</span>
                              <span className="font-mono font-bold text-gray-900">
                                {selectedEvent.credentials?.scanner.email || `scanner@${selectedEvent.slug}.com`}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 text-[10px]">Password:</span>
                              <span className="font-mono text-gray-900 font-bold">
                                {showPasswords['scanner'] ? (selectedEvent.credentials?.scanner.temporaryPassword || 'scan123') : '••••••••'}
                              </span>
                              <button onClick={() => toggleShowPassword('scanner')} className="text-gold-600 hover:text-gray-900">
                                {showPasswords['scanner'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Link
                            href="/scanner"
                            target="_blank"
                            className="w-full py-2.5 px-3 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all border border-gold-500/40"
                          >
                            <span>{t('organizerDashboard.fleet.launchScanner')}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
                          </Link>

                          <button
                            onClick={() => handleCopy(
                              `Gate Terminal: ${window.location.origin}/scanner\nEmail: ${selectedEvent.credentials?.scanner.email}\nPassword: ${selectedEvent.credentials?.scanner.temporaryPassword || 'scan123'}`,
                              'scanner'
                            )}
                            className="w-full py-1.5 px-3 rounded-lg border border-gold-500/30 bg-white hover:bg-gray-50 text-gray-900 text-[11px] font-bold flex items-center justify-center gap-1"
                          >
                            {copiedKey === 'scanner' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-gold-600" />}
                            <span>{copiedKey === 'scanner' ? t('common.copied') : t('organizerDashboard.fleet.copyScanner')}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* =========================================================================
              PILLAR 1: PROVISION COUPLE CREDENTIALS & REQUEST ADMIN APPROVAL
             ========================================================================= */}
          {activeTab === 'CREDENTIALS' && (
            <div className="space-y-6">
              
              {/* Form Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gold-500/20">
                  <div>
                    <h2 className="font-serif font-bold text-lg sm:text-xl text-gray-900 flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-gold-500" />
                      {t('organizerDashboard.credentials.title')}
                    </h2>
                    <p className="text-xs text-gray-600 font-light mt-0.5">
                      {t('organizerDashboard.credentials.subtitle')}
                    </p>
                  </div>
                </div>

                {provisionSuccessMsg && (
                  <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs space-y-3">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{t('organizerDashboard.credentials.successTitle')}</span>
                    </div>
                    {newlyProvisionedCreds && (
                      <div className="p-3 bg-white rounded-xl border border-emerald-200 font-mono text-xs space-y-1">
                        <div>Bride & Groom Login: <strong>{newlyProvisionedCreds.email}</strong></div>
                        <div>Temporary Pass: <strong>{newlyProvisionedCreds.pass}</strong></div>
                        <div>Dedicated Event URL: <strong>{typeof window !== 'undefined' ? window.location.origin : ''}/event/{newlyProvisionedCreds.slug}</strong></div>
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleRequestCoupleCredentials} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('organizerDashboard.credentials.brideName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="e.g. Bethlehem Assefa"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('organizerDashboard.credentials.groomName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="e.g. Henok Girma"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('organizerDashboard.credentials.email')}
                    </label>
                    <input
                      type="email"
                      required
                      value={coupleEmail}
                      onChange={(e) => setCoupleEmail(e.target.value)}
                      placeholder="couple@bethlehem-henok.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('organizerDashboard.credentials.date')}
                    </label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-900 mb-1">
                      {t('organizerDashboard.credentials.venue')}
                    </label>
                    <input
                      type="text"
                      required
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder="e.g. Skylight Hotel Grand Ballroom, Addis Ababa"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/30 bg-gray-50 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end pt-3">
                    <button
                      type="submit"
                      disabled={requestingApproval}
                      className="px-8 py-3.5 rounded-xl bg-black hover:bg-gray-800 text-gold-400 font-bold text-xs shadow-md transition-all flex items-center gap-2 border border-gold-500/40"
                    >
                      <Send className="w-4 h-4 text-gold-400" />
                      <span>{requestingApproval ? t('organizerDashboard.credentials.submittingBtn') : t('organizerDashboard.credentials.submitBtn')}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Status Tracking Table */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-lg text-gray-900">
                  {t('organizerDashboard.credentials.trackerTitle')}
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gold-500/20 text-[10px] text-gold-700 font-bold uppercase tracking-wider bg-gray-50">
                        <th className="py-3 px-4 rounded-l-xl">Wedding Title</th>
                        <th className="py-3 px-4">Couple Contact Login</th>
                        <th className="py-3 px-4">Admin Verification</th>
                        <th className="py-3 px-4 text-right rounded-r-xl">1-Click Portal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {events.map((evt) => (
                        <tr key={evt.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-serif font-bold text-gray-900">
                            {evt.title}
                          </td>
                          <td className="py-3 px-4 font-mono text-gray-600">
                            {evt.coupleCredentials?.email || `couple@${evt.slug}.com`}
                          </td>
                          <td className="py-3 px-4">
                            {evt.adminApprovalStatus === 'APPROVED' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                                <Clock className="w-3 h-3 text-amber-700" /> Pending Admin
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              href="/couple/dashboard"
                              className="px-3 py-1.5 rounded-lg bg-black hover:bg-gray-800 text-gold-400 text-xs font-bold shadow-sm inline-flex items-center gap-1 border border-gold-500/30"
                            >
                              <span>Launch Couple Suite</span>
                              <ExternalLink className="w-3 h-3 text-gold-400" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              PILLAR 3: GLOBAL MEDIA MODERATION
             ========================================================================= */}
          {activeTab === 'MEDIA' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-500/30 shadow-sm space-y-6">
              <div className="pb-4 border-b border-gold-500/20">
                <h2 className="font-serif font-bold text-xl text-gray-900">
                  {t('coupleDashboard.media.title')} ({mediaAssets.length})
                </h2>
                <p className="text-xs text-gray-600 font-light mt-0.5">
                  {t('coupleDashboard.media.subtitle')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mediaAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-4 rounded-2xl border border-gold-500/20 bg-gray-50 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="h-44 rounded-xl overflow-hidden bg-black mb-3 flex items-center justify-center">
                        {asset.mediaType === 'VIDEO' || asset.cdnUrl.includes('.mp4') ? (
                          <video
                            src={asset.cdnUrl}
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={asset.cdnUrl}
                            alt={asset.caption}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="font-serif font-bold text-sm text-gray-900">{asset.uploaderName}</div>
                      <p className="text-xs text-gray-600 italic mt-1 line-clamp-2">"{asset.caption}"</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs font-bold">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px]">
                        🟢 {t('coupleDashboard.media.tabPosted')}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}

```

### File: `frontend/src/app/organizer/login/page.tsx`

```tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Briefcase } from 'lucide-react';
import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

export default function OrganizerLoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('organizer@sara-dawit.com');
  const [password, setPassword] = useState('org123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/organizer/dashboard');
      } else {
        setError(data.error || t('auth.invalidCreds'));
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 flex items-center justify-center p-4 sm:p-6 selection:bg-gold-500 selection:text-black relative font-sans">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="max-w-md w-full glass-panel p-8 md:p-10 rounded-3xl border-2 border-gold-500/40 shadow-xl bg-white">
        <div className="text-center mb-8">
          <img
            src="/branding/artboard-14.png"
            alt="Agafari (አጋፋሪ) Logo"
            className="h-14 w-auto mx-auto mb-4 object-contain"
          />
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            {t('auth.organizerTitle')}
          </h1>
          <p className="text-xs text-gold-600 font-semibold uppercase tracking-wider mt-1">
            {t('auth.organizerSubtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-900 uppercase tracking-wider mb-1.5">
              {t('auth.emailLabel')}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="organizer@sara-dawit.com"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-gold-500/30 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <Mail className="w-4 h-4 text-gold-600 absolute left-4 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-900 uppercase tracking-wider mb-1.5">
              {t('auth.passwordLabel')}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-gold-500/30 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <Lock className="w-4 h-4 text-gold-600 absolute left-4 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4 border border-gold-500/40 disabled:opacity-50"
          >
            {loading ? t('auth.signingIn') : t('auth.signInBtn')}
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-500 font-semibold mb-2">Demo Organizer Login:</p>
          <div className="text-[11px] font-mono text-gray-900 font-bold">
            organizer@sara-dawit.com / org123
          </div>
        </div>
      </div>
    </div>
  );
}

```

### File: `frontend/src/app/page.tsx`

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  Video, 
  QrCode, 
  ShieldCheck, 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Star, 
  Play, 
  Phone, 
  Mail, 
  ExternalLink,
  Crown,
  Award,
  ChevronRight,
  ChevronLeft,
  Layers,
  Monitor,
  Building2,
  Lock,
  Globe,
  Instagram,
  Facebook,
  Send,
  HelpCircle,
  Shield,
  FileText,
  X,
  Radio,
  Users,
  Film
} from 'lucide-react';

import { useTranslation, LanguageSwitcher } from '@/lib/i18n';

export default function HomePage() {
  const { t, locale } = useTranslation();
  const [activeDemoTab, setActiveDemoTab] = useState<'COMING_SOON' | 'INVITATION' | 'FEED' | 'LIVE' | 'SCANNER'>('COMING_SOON');
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Scroll spy tracking to detect which section the user is currently viewing
  useEffect(() => {
    const sections = ['hero', 'features', 'trusted', 'packages', 'demo', 'portfolio', 'about'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Platform Feature Cards
  const platformFeatures = [
    {
      id: 'f1',
      title: t('landing.featuresSection.card1Title'),
      icon: Calendar,
      badge: t('landing.featuresSection.card1Badge'),
      imageUrl: '/images/feature_countdown.png',
      description: t('landing.featuresSection.card1Desc'),
      link: '/event/sara-and-dawit-2026',
      btnText: t('landing.featuresSection.card1Btn')
    },
    {
      id: 'f2',
      title: t('landing.featuresSection.card2Title'),
      icon: QrCode,
      badge: t('landing.featuresSection.card2Badge'),
      imageUrl: '/images/feature_qr_pass.png',
      description: t('landing.featuresSection.card2Desc'),
      link: '/scanner',
      btnText: t('landing.featuresSection.card2Btn')
    },
    {
      id: 'f3',
      title: t('landing.featuresSection.card3Title'),
      icon: Video,
      badge: t('landing.featuresSection.card3Badge'),
      imageUrl: '/images/feature_feed_live.png',
      description: t('landing.featuresSection.card3Desc'),
      link: '/event/sara-and-dawit-2026/feed',
      btnText: t('landing.featuresSection.card3Btn')
    }
  ];

  // Partnered Venue Logos for Infinite Floating Marquee
  const partnerLogos = [
    { name: t('landing.partnersSection.sheraton'), type: t('landing.partnersSection.sheratonType'), icon: Building2 },
    { name: t('landing.partnersSection.haile'), type: t('landing.partnersSection.haileType'), icon: Crown },
    { name: t('landing.partnersSection.skylight'), type: t('landing.partnersSection.skylightType'), icon: Building2 },
    { name: t('landing.partnersSection.radisson'), type: t('landing.partnersSection.radissonType'), icon: Award },
    { name: t('landing.partnersSection.kuriftu'), type: t('landing.partnersSection.kuriftuType'), icon: Sparkles },
    { name: t('landing.partnersSection.yegara'), type: t('landing.partnersSection.yegaraType'), icon: Globe },
  ];

  // FAQ Items
  const faqItems = [
    {
      q: t('landing.faqModal.q1'),
      a: t('landing.faqModal.a1')
    },
    {
      q: t('landing.faqModal.q2'),
      a: t('landing.faqModal.a2')
    },
    {
      q: t('landing.faqModal.q3'),
      a: t('landing.faqModal.a3')
    },
    {
      q: t('landing.faqModal.q4'),
      a: t('landing.faqModal.a4')
    }
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 flex flex-col relative font-sans">
      
      {/* 0. Ambient Floating Gold Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, opacity: 0.2 }}
            animate={{ 
              y: [-20, -60, -20], 
              x: [0, i % 2 === 0 ? 25 : -25, 0],
              opacity: [0.2, 0.8, 0.2] 
            }}
            transition={{ 
              duration: 6 + i * 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 1.1 
            }}
            style={{ 
              top: `${8 + i * 10}%`, 
              left: `${5 + i * 10}%` 
            }}
            className="absolute text-gold-500 text-xl select-none"
          >
            {i % 2 === 0 ? '✨' : '🌸'}
          </motion.div>
        ))}
      </div>

      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 glass-panel border-b border-gold-500/30 px-4 sm:px-6 py-3.5 shadow-sm bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-1.5 rounded-xl bg-black shadow-md flex items-center justify-center">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                src="/branding/artboard-13.png"
                alt="Agafari (አጋፋሪ) Logo"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-gray-900 block leading-none">
                {t('nav.brandTitle')}
              </span>
              <span className="text-[9px] text-gold-600 tracking-widest font-semibold uppercase mt-1 block">
                by Hamelmal Creatives
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-sage-dark">
            <a href="#features" className="hover:text-metallic-dark transition-colors">{t('landing.nav.features')}</a>
            <a href="#trusted" className="hover:text-metallic-dark transition-colors">{t('landing.nav.partners')}</a>
            <a href="#packages" className="hover:text-metallic-dark transition-colors">{t('landing.nav.packages')}</a>
            <a href="#demo" className="hover:text-metallic-dark transition-colors text-metallic-dark flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-metallic animate-pulse" />
              {t('landing.nav.liveDemo')}
            </a>
            <a href="#portfolio" className="hover:text-metallic-dark transition-colors">{t('landing.nav.pastWeddings')}</a>
            <a href="#about" className="hover:text-metallic-dark transition-colors">{t('landing.nav.aboutUs')}</a>
          </nav>

          {/* High-Contrast CTA Button & Language Switcher */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />

            <Link
              href="/event/sara-and-dawit-2026"
              className="hidden sm:flex px-4 py-2 rounded-full bg-sage-dark text-neutral hover:bg-sage text-xs font-semibold shadow-sage transition-all items-center gap-1"
            >
              <span>{t('landing.nav.exploreCelebration')}</span>
            </Link>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              href="#packages"
              className="px-5 py-2.5 rounded-full bg-metallic hover:bg-metallic-hover text-sage-dark font-bold text-xs shadow-accent transition-all flex items-center gap-1.5"
            >
              {t('landing.nav.bookWedding')}
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="hero" className="relative px-6 pt-24 pb-32 w-full max-w-full text-center z-10 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Realistic Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero_couple_bg.png"
            alt="Beautiful Ethiopian Wedding"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-white z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/10 rounded-full blur-[100px] z-0 pointer-events-none" />
        </div>

        <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center w-full"
          >
            {/* Agafari Golden Logo */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
              className="relative w-40 h-40 md:w-56 md:h-56 mb-4 drop-shadow-[0_15px_25px_rgba(212,175,55,0.3)]"
            >
              <img 
                src="/branding/artboard-13.png" 
                alt="Agafari Golden Logo" 
                className="w-full h-full object-contain filter drop-shadow-xl"
              />
            </motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-muted/80 backdrop-blur-sm text-sage-dark text-[11px] font-semibold uppercase tracking-wider mb-6 border border-sage/30 shadow-sm"
            >
              <Crown className="w-3.5 h-3.5 text-metallic" />
              {t('landing.hero.badge')}
            </motion.div>

            {/* Headline */}
            <h1 className={`font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-sage-dark leading-tight drop-shadow-sm ${locale === 'am' ? 'font-amharic-royal' : ''}`}>
              {t('landing.hero.titlePart1')} <br />
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className={`font-script text-4xl sm:text-6xl md:text-7xl font-normal gold-metallic-solid mt-2 block leading-snug drop-shadow-md ${locale === 'am' ? 'font-amharic-script font-bold drop-shadow-md text-amber-600' : ''}`}
              >
                {t('landing.hero.titlePart2')}
              </motion.span>
            </h1>

            <p className={`max-w-2xl mx-auto text-sm sm:text-base text-charcoal-light mt-6 mb-8 font-light leading-relaxed drop-shadow-sm ${locale === 'am' ? 'font-amharic-body' : ''}`}>
              {t('landing.hero.description')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-metallic hover:bg-metallic-hover text-sage-dark font-bold text-sm shadow-accent transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-sage-dark" />
                {t('landing.hero.ctaDemo')}
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="#packages"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-sage-dark/90 backdrop-blur-sm text-neutral font-semibold text-sm hover:bg-sage transition-all shadow-sage flex items-center justify-center gap-2 border border-sage/50"
              >
                {t('landing.hero.ctaPackages')}
              </motion.a>
            </div>
          </motion.div>

          {/* Feature Badges Strip */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto pt-8 border-t border-metallic/30"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-sage-dark drop-shadow-sm bg-white/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/50">
              <CheckCircle2 className="w-4 h-4 text-metallic shrink-0" />
              {t('landing.hero.feature1')}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-sage-dark drop-shadow-sm bg-white/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/50">
              <CheckCircle2 className="w-4 h-4 text-metallic shrink-0" />
              {t('landing.hero.feature2')}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-sage-dark drop-shadow-sm bg-white/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/50">
              <CheckCircle2 className="w-4 h-4 text-metallic shrink-0" />
              {t('landing.hero.feature3')}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-sage-dark drop-shadow-sm bg-white/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/50">
              <CheckCircle2 className="w-4 h-4 text-metallic shrink-0" />
              {t('landing.hero.feature4')}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. PLATFORM FEATURES SECTION (100% Edge-to-Edge Full-Width Infinite Marquee) */}
      <section id="features" className="py-24 bg-white text-gray-900 w-full max-w-full px-0 mx-0 relative overflow-hidden border-t border-b border-gray-100">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-gold-400 text-[11px] font-bold uppercase tracking-widest mb-4 shadow-md border border-gold-500/30">
                <Crown className="w-3.5 h-3.5 text-gold-400" />
                {t('landing.featuresSection.badge')}
              </div>

              <h2 className={`font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight ${locale === 'am' ? 'font-amharic-royal' : ''}`}>
                {t('landing.featuresSection.title')}{' '}
                <span className={`font-script text-gold-600 font-normal text-4xl sm:text-6xl lg:text-7xl px-2 inline-block drop-shadow-sm ${locale === 'am' ? 'font-amharic-script font-bold text-gold-600' : ''}`}>
                  {t('landing.featuresSection.titleScript')}
                </span>{' '}
                {t('landing.featuresSection.titleEnd')}
              </h2>

              <p className="text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto font-light mt-3 leading-relaxed">
                {t('landing.featuresSection.description')}
              </p>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gray-50 border border-gold-500/30 text-gray-800 text-[10px] font-semibold mt-4 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {t('landing.featuresSection.marqueeHint')}
              </div>
            </motion.div>
          </div>

          {/* 100% Full-Width Edge-to-Edge Pure CSS Infinite Marquee Slider */}
          <div className="marquee-container relative w-full max-w-full overflow-hidden py-4 px-0">
            <div className="marquee-track flex gap-6 px-0">
              {[...platformFeatures, ...platformFeatures].map((feat, idx) => {
                const IconComp = feat.icon;
                return (
                  <div
                    key={`${feat.id}-${idx}`}
                    className="w-[310px] sm:w-[350px] rounded-3xl overflow-hidden border border-gold-500/30 hover:border-gold-500 hover:shadow-gold transition-all duration-300 group flex flex-col justify-between shrink-0 bg-white text-gray-900 shadow-md"
                  >
                    <div>
                      <div className="h-52 bg-gray-100 relative overflow-hidden">
                        <img
                          src={feat.imageUrl}
                          alt={feat.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                        />
                        <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-gold-500/40 text-gold-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                          <IconComp className="w-3.5 h-3.5 text-gold-400" />
                          {feat.badge}
                        </div>
                      </div>

                      <div className="p-6 text-left bg-white">
                        <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
                          {feat.title}
                        </h3>
                        <p className="text-gray-600 text-xs leading-relaxed font-light mb-4">
                          {feat.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 bg-white">
                      <a
                        href={feat.link}
                        target="_blank"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 hover:from-amber-400 hover:to-gold-500 text-black text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-gold border border-gold-400/40"
                      >
                        {feat.btnText}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. "TRUSTED BY" CONTINUOUSLY SCROLLING & FLOATING COMPANY LOGOS */}
      <section id="trusted" className="py-16 bg-white border-b border-gray-100 w-full max-w-full px-0 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-8 px-6">
          <span className="text-[10px] text-gold-600 font-semibold uppercase tracking-widest block mb-1">
            {t('landing.partnersSection.badge')}
          </span>
          <h3 className="font-serif text-2xl font-bold text-gray-900">
            {t('landing.partnersSection.title')}
          </h3>
        </div>

        {/* Continuous 100% Edge-to-Edge Infinite Logo Marquee Track */}
        <div className="marquee-container relative w-full max-w-full overflow-hidden py-2 px-0">
          <div className="marquee-track flex gap-6 px-0">
            {[...partnerLogos, ...partnerLogos].map((partner, idx) => {
              const IconComp = partner.icon;
              return (
                <div
                  key={idx}
                  className="w-[200px] p-5 rounded-2xl border border-gold-500/20 hover:border-gold-500 hover:shadow-gold transition-all duration-300 bg-white flex flex-col items-center justify-center text-center group shrink-0 shadow-sm"
                >
                  <IconComp className="w-7 h-7 text-gold-600 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="font-serif font-bold text-gray-900 text-xs">
                    {partner.name}
                  </span>
                  <span className="text-[9px] text-gray-500 font-light mt-0.5">
                    {partner.type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. PACKAGES & PRICING SECTION */}
      <section id="packages" className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] text-metallic-dark font-semibold uppercase tracking-widest block mb-1">
            {t('landing.packagesSection.badge')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sage-dark">
            {t('landing.packagesSection.title')}
          </h2>
          <p className="text-charcoal-light text-xs max-w-md mx-auto font-light mt-2">
            {t('landing.packagesSection.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Silver Package */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="p-7 rounded-3xl border border-gold-500/30 hover:border-gold-500 hover:shadow-gold transition-all duration-300 flex flex-col justify-between bg-white shadow-md"
          >
            <div>
              <div className="text-[10px] font-semibold text-gold-600 uppercase tracking-wider mb-1">
                {t('landing.packagesSection.silverTag')}
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">
                {t('landing.packagesSection.silverTitle')}
              </h3>
              <p className="text-gray-600 text-xs font-light mb-5">
                {t('landing.packagesSection.silverDesc')}
              </p>
              <ul className="space-y-2.5 text-xs text-gray-700 border-t border-gray-100 pt-5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.silverF1')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.silverF2')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.silverF3')}
                </li>
              </ul>
            </div>

            <a
              href="tel:+251911000000"
              className="mt-6 w-full py-3 rounded-full bg-black text-white text-center font-bold text-xs hover:bg-gray-800 transition-colors block shadow-md"
            >
              {t('landing.packagesSection.silverBtn')}
            </a>
          </motion.div>

          {/* Gold Package */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="p-7 rounded-3xl border-2 border-gold-500 hover:shadow-gold transition-all duration-300 relative flex flex-col justify-between bg-white shadow-lg"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gold-500 text-black text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Crown className="w-3 h-3 text-black" />
              {t('landing.packagesSection.goldBadge')}
            </div>

            <div>
              <div className="text-[10px] font-semibold text-gold-600 uppercase tracking-wider mb-1 mt-1">
                {t('landing.packagesSection.goldTag')}
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">
                {t('landing.packagesSection.goldTitle')}
              </h3>
              <p className="text-gray-600 text-xs font-light mb-5">
                {t('landing.packagesSection.goldDesc')}
              </p>
              <ul className="space-y-2.5 text-xs text-gray-700 border-t border-gray-100 pt-5">
                <li className="flex items-center gap-2 font-semibold text-gray-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.goldF1')}
                </li>
                <li className="flex items-center gap-2 font-semibold text-gray-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.goldF2')}
                </li>
                <li className="flex items-center gap-2 font-semibold text-gray-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.goldF3')}
                </li>
                <li className="flex items-center gap-2 font-semibold text-gray-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.goldF4')}
                </li>
              </ul>
            </div>

            <a
              href="tel:+251911000000"
              className="mt-6 w-full py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-black text-center font-bold text-xs shadow-gold transition-all block"
            >
              {t('landing.packagesSection.goldBtn')}
            </a>
          </motion.div>

          {/* Platinum Package */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="p-7 rounded-3xl border border-gold-500/30 hover:border-gold-500 hover:shadow-gold transition-all duration-300 flex flex-col justify-between bg-white shadow-md"
          >
            <div>
              <div className="text-[10px] font-semibold text-gold-600 uppercase tracking-wider mb-1">
                {t('landing.packagesSection.platTag')}
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">
                {t('landing.packagesSection.platTitle')}
              </h3>
              <p className="text-gray-600 text-xs font-light mb-5">
                {t('landing.packagesSection.platDesc')}
              </p>
              <ul className="space-y-2.5 text-xs text-gray-700 border-t border-gray-100 pt-5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.platF1')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.platF2')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  {t('landing.packagesSection.platF3')}
                </li>
              </ul>
            </div>

            <a
              href="tel:+251911000000"
              className="mt-6 w-full py-3 rounded-full bg-black text-white text-center font-bold text-xs hover:bg-gray-800 transition-colors block shadow-md"
            >
              {t('landing.packagesSection.platBtn')}
            </a>
          </motion.div>
        </div>
      </section>

      {/* 6. OVERHAULED "EXPERIENCE AGAFARI LIVE" SIMULATOR SECTION */}
      <section id="demo" className="py-24 bg-gray-50/60 w-full max-w-full px-4 sm:px-6 border-t border-b border-gray-200/60 relative">
        <div className="max-w-6xl mx-auto">
          
          {/* Active Section & Live Page Indicator Badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black border border-gold-500/40 shadow-md text-white text-xs backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <span className="text-gold-400 font-bold uppercase text-[10px] tracking-wider">
                {locale === 'am' ? 'የቀጥታ ማሳያ ክፍል' : 'Live Interactive Hub'}
              </span>
              <span className="text-gold-500/40">•</span>
              <span className="text-[11px] text-gray-200 font-medium">
                {activeDemoTab === 'COMING_SOON' && (locale === 'am' ? '1. የቀን መቁጠሪያና ምርቃት' : '1. Countdown & Wishes')}
                {activeDemoTab === 'INVITATION' && (locale === 'am' ? '2. ዲጂታል ግብዣና QR' : '2. Digital Gate Pass')}
                {activeDemoTab === 'FEED' && (locale === 'am' ? '3. የትዝታ ቪዲዮዎች' : '3. TikTok Memory Feed')}
                {activeDemoTab === 'LIVE' && (locale === 'am' ? '4. የቀጥታ ስርጭት' : '4. Global Broadcast')}
                {activeDemoTab === 'SCANNER' && (locale === 'am' ? '5. የበር መቃኛ' : '5. Gate Scanner App')}
              </span>
            </div>
          </div>

          <div className="text-center mb-12">
            <span className="text-[10px] text-metallic-dark font-semibold uppercase tracking-widest block mb-1">
              {t('landing.demoSection.badge')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sage-dark">
              {t('landing.demoSection.title')}
            </h2>
            <p className="text-charcoal-light text-xs max-w-md mx-auto font-light mt-1">
              {t('landing.demoSection.description')}
            </p>
          </div>

          {/* Interactive Tab Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              { id: 'COMING_SOON', label: t('landing.demoSection.tab1'), url: '/event/sara-and-dawit-2026' },
              { id: 'INVITATION', label: t('landing.demoSection.tab2'), url: '/event/sara-and-dawit-2026/invitation' },
              { id: 'FEED', label: t('landing.demoSection.tab3'), url: '/event/sara-and-dawit-2026/feed' },
              { id: 'SCANNER', label: t('landing.demoSection.tab5'), url: '/scanner' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDemoTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeDemoTab === tab.id
                    ? 'bg-sage-dark text-metallic shadow-sage scale-105'
                    : 'glass-panel text-sage-dark hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Screen Preview Container */}
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-metallic/40 shadow-glass relative bg-black min-h-[380px] sm:min-h-[420px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeDemoTab === 'COMING_SOON' && (
                <motion.div
                  key="COMING_SOON"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center p-6 text-center"
                >
                  <img
                    src="/images/hero_couple_bg.png"
                    alt="Coming Soon Background"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

                  <div className="absolute top-6 left-6 z-20 hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-dark/90 border border-metallic/40 text-metallic text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    {t('landing.demoSection.pill1')}
                  </div>

                  <div className="relative z-10 max-w-lg mx-auto text-neutral">
                    <div className="w-14 h-14 rounded-full bg-metallic text-sage-dark mx-auto flex items-center justify-center mb-3 shadow-accent">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-md">
                      {t('landing.demoSection.title1')}
                    </h3>
                    <p className="text-neutral/90 text-xs sm:text-sm font-light mb-6 leading-relaxed">
                      {t('landing.demoSection.desc1')}
                    </p>
                    <Link
                      href="/event/sara-and-dawit-2026"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-metallic hover:bg-metallic-hover text-sage-dark font-bold text-xs shadow-accent transition-all hover:scale-105"
                    >
                      <Monitor className="w-4 h-4" />
                      {t('landing.demoSection.btn1')} <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeDemoTab === 'INVITATION' && (
                <motion.div
                  key="INVITATION"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center p-6 text-center"
                >
                  <img
                    src="/images/feature_qr_pass.png"
                    alt="Digital Invitation Background"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

                  <div className="absolute top-6 left-6 z-20 hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-dark/90 border border-metallic/40 text-metallic text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    {t('landing.demoSection.pill2')}
                  </div>

                  <div className="relative z-10 max-w-lg mx-auto text-neutral">
                    <div className="w-14 h-14 rounded-full bg-metallic text-sage-dark mx-auto flex items-center justify-center mb-3 shadow-accent">
                      <QrCode className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-md">
                      {t('landing.demoSection.title2')}
                    </h3>
                    <p className="text-neutral/90 text-xs sm:text-sm font-light mb-6 leading-relaxed">
                      {t('landing.demoSection.desc2')}
                    </p>
                    <Link
                      href="/event/sara-and-dawit-2026?code=INV-SD2026-001"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-metallic hover:bg-metallic-hover text-sage-dark font-bold text-xs shadow-accent transition-all hover:scale-105"
                    >
                      <Monitor className="w-4 h-4" />
                      {t('landing.demoSection.btn2')} <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeDemoTab === 'FEED' && (
                <motion.div
                  key="FEED"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center p-6 text-center"
                >
                  <img
                    src="/images/feature_feed_live.png"
                    alt="TikTok Feed Background"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

                  <div className="absolute top-6 left-6 z-20 hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-dark/90 border border-metallic/40 text-metallic text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                    <Heart className="w-3 h-3 text-rose-400 fill-rose-400 animate-pulse" />
                    {t('landing.demoSection.pill3')}
                  </div>

                  <div className="relative z-10 max-w-lg mx-auto text-neutral">
                    <div className="w-14 h-14 rounded-full bg-metallic text-sage-dark mx-auto flex items-center justify-center mb-3 shadow-accent">
                      <Film className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-md">
                      {t('landing.demoSection.title3')}
                    </h3>
                    <p className="text-neutral/90 text-xs sm:text-sm font-light mb-6 leading-relaxed">
                      {t('landing.demoSection.desc3')}
                    </p>
                    <Link
                      href="/event/sara-and-dawit-2026/feed"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-metallic hover:bg-metallic-hover text-sage-dark font-bold text-xs shadow-accent transition-all hover:scale-105"
                    >
                      <Monitor className="w-4 h-4" />
                      {t('landing.demoSection.btn3')} <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeDemoTab === 'LIVE' && (
                <motion.div
                  key="LIVE"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center p-6 text-center"
                >
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
                    alt="Ontime Live Streaming Background"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

                  <div className="absolute top-6 left-6 z-20 hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/90 border border-rose-500/50 text-rose-200 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    {t('landing.demoSection.pill4')}
                  </div>

                  <div className="relative z-10 max-w-lg mx-auto text-neutral">
                    <div className="w-14 h-14 rounded-full bg-rose-600 text-white mx-auto flex items-center justify-center mb-3 shadow-accent">
                      <Video className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-md">
                      {t('landing.demoSection.title4')}
                    </h3>
                    <p className="text-neutral/90 text-xs sm:text-sm font-light mb-6 leading-relaxed">
                      {t('landing.demoSection.desc4')}
                    </p>
                    <Link
                      href="/event/sara-and-dawit-2026"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-metallic hover:bg-metallic-hover text-sage-dark font-bold text-xs shadow-accent transition-all hover:scale-105"
                    >
                      <Monitor className="w-4 h-4" />
                      {t('landing.demoSection.btn4')} <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeDemoTab === 'SCANNER' && (
                <motion.div
                  key="SCANNER"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center p-6 text-center"
                >
                  <img
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop"
                    alt="Scanner Background"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

                  <div className="absolute top-6 left-6 z-20 hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-dark/90 border border-metallic/40 text-metallic text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {t('landing.demoSection.pill5')}
                  </div>

                  <div className="relative z-10 max-w-lg mx-auto text-neutral">
                    <div className="w-14 h-14 rounded-full bg-metallic text-sage-dark mx-auto flex items-center justify-center mb-3 shadow-accent">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-md">
                      {t('landing.demoSection.title5')}
                    </h3>
                    <p className="text-neutral/90 text-xs sm:text-sm font-light mb-6 leading-relaxed">
                      {t('landing.demoSection.desc5')}
                    </p>
                    <Link
                      href="/scanner"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-metallic hover:bg-metallic-hover text-sage-dark font-bold text-xs shadow-accent transition-all hover:scale-105"
                    >
                      <Monitor className="w-4 h-4" />
                      {t('landing.demoSection.btn5')} <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 7. REAL WEDDINGS SHOWCASE SECTION */}
      <section id="portfolio" className="pt-28 pb-24 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] text-metallic-dark font-semibold uppercase tracking-widest block mb-1">
            {t('landing.portfolioSection.badge')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-sage-dark">
            {t('landing.portfolioSection.title')}
          </h2>
          <p className="text-charcoal-light text-xs sm:text-sm max-w-xl mx-auto font-light mt-2">
            {t('landing.portfolioSection.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Showcase Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="glass-panel rounded-3xl overflow-hidden border-2 border-metallic/30 hover:border-metallic transition-all shadow-sage hover:shadow-accent bg-white flex flex-col justify-between group"
          >
            <div>
              <div className="h-60 bg-zinc-200 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"
                  alt="Sara & Dawit Wedding"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-sage-dark/90 border border-metallic/40 text-metallic text-[10px] font-bold shadow-sm">
                  Sheraton Addis
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-metallic text-sage-dark font-serif font-bold text-xs flex items-center justify-center shadow-md">
                    S&D
                  </div>
                  <span className="text-white text-xs font-semibold drop-shadow-md">
                    {t('landing.portfolioSection.card1Type')}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-sage-dark mb-1">
                  {t('landing.portfolioSection.card1Couple')}
                </h3>
                <p className="text-xs text-metallic-dark font-semibold mb-4">
                  {t('landing.portfolioSection.card1Venue')}
                </p>
                <p className="text-charcoal-light text-xs italic font-serif leading-relaxed mb-4">
                  {t('landing.portfolioSection.card1Quote')}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 border-t border-sage/10 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-metallic">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-metallic" />
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sage-dark">
                {t('landing.portfolioSection.verified')}
              </span>
            </div>
          </motion.div>

          {/* Showcase Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="glass-panel rounded-3xl overflow-hidden border-2 border-metallic/30 hover:border-metallic transition-all shadow-sage hover:shadow-accent bg-white flex flex-col justify-between group"
          >
            <div>
              <div className="h-60 bg-zinc-200 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop"
                  alt="Marta & Abel Wedding"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-sage-dark/90 border border-metallic/40 text-metallic text-[10px] font-bold shadow-sm">
                  Haile Grand Addis
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-metallic text-sage-dark font-serif font-bold text-xs flex items-center justify-center shadow-md">
                    M&A
                  </div>
                  <span className="text-white text-xs font-semibold drop-shadow-md">
                    {t('landing.portfolioSection.card2Type')}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-sage-dark mb-1">
                  {t('landing.portfolioSection.card2Couple')}
                </h3>
                <p className="text-xs text-metallic-dark font-semibold mb-4">
                  {t('landing.portfolioSection.card2Venue')}
                </p>
                <p className="text-charcoal-light text-xs italic font-serif leading-relaxed mb-4">
                  {t('landing.portfolioSection.card2Quote')}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 border-t border-sage/10 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-metallic">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-metallic" />
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sage-dark">
                {t('landing.portfolioSection.verified')}
              </span>
            </div>
          </motion.div>

          {/* Showcase Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -6 }}
            className="glass-panel rounded-3xl overflow-hidden border-2 border-metallic/30 hover:border-metallic transition-all shadow-sage hover:shadow-accent bg-white flex flex-col justify-between group"
          >
            <div>
              <div className="h-60 bg-zinc-200 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop"
                  alt="Tigist & Henok Wedding"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-sage-dark/90 border border-metallic/40 text-metallic text-[10px] font-bold shadow-sm">
                  Skylight Hotel
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-metallic text-sage-dark font-serif font-bold text-xs flex items-center justify-center shadow-md">
                    T&H
                  </div>
                  <span className="text-white text-xs font-semibold drop-shadow-md">
                    {t('landing.portfolioSection.card3Type')}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-sage-dark mb-1">
                  {t('landing.portfolioSection.card3Couple')}
                </h3>
                <p className="text-xs text-metallic-dark font-semibold mb-4">
                  {t('landing.portfolioSection.card3Venue')}
                </p>
                <p className="text-charcoal-light text-xs italic font-serif leading-relaxed mb-4">
                  {t('landing.portfolioSection.card3Quote')}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 border-t border-sage/10 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-metallic">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-metallic" />
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sage-dark">
                {t('landing.portfolioSection.verified')}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. HAMELMAL CREATIVES PROMOTION SECTION WITH BALANCED COLOR PALETTE */}
      <section id="about" className="py-24 bg-gradient-to-b from-neutral via-sage-muted/40 to-neutral text-charcoal px-6 relative overflow-hidden border-t border-b border-sage/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="w-14 h-14 rounded-2xl bg-sage-dark text-metallic font-serif font-bold text-3xl flex items-center justify-center mx-auto mb-3 shadow-sage border border-metallic/30">
              H
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-dark text-metallic text-[10px] font-bold uppercase tracking-widest mb-3 shadow-md border border-metallic/30">
              <Sparkles className="w-3.5 h-3.5 text-metallic" />
              {t('landing.aboutSection.badge')}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-sage-dark">
              {t('landing.aboutSection.title')}
            </h2>
            <p className="text-charcoal-light text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-light mt-2">
              {t('landing.aboutSection.description')}
            </p>

            {/* Official Website Button */}
            <div className="mt-6 flex items-center justify-center">
              <motion.a
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="https://hamelmal.com"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-metallic via-amber-400 to-metallic-dark hover:from-amber-300 hover:to-metallic text-sage-dark font-extrabold text-xs shadow-accent transition-all flex items-center gap-2 border border-amber-300/40"
              >
                <Sparkles className="w-4 h-4 text-sage-dark" />
                {t('landing.aboutSection.visitBtn')}
                <ExternalLink className="w-4 h-4 ml-1" />
              </motion.a>
            </div>
          </motion.div>

          {/* Side-by-Side Promotion Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl border-[1.5px] border-sage hover:border-metallic hover:shadow-[0_14px_40px_rgba(212,175,55,0.45)] transition-all duration-300 text-left bg-white text-charcoal shadow-sm flex flex-col justify-between"
            >
              <div>
                <Award className="w-8 h-8 text-metallic-dark mb-4" />
                <h3 className="font-serif text-2xl font-bold text-sage-dark mb-2">
                  {t('landing.aboutSection.card1Title')}
                </h3>
                <p className="text-charcoal-light text-xs leading-relaxed font-light mb-6">
                  {t('landing.aboutSection.card1Desc')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-sage/10">
                <div>
                  <div className="font-serif font-bold text-sage-dark text-2xl">
                    {t('landing.aboutSection.card1Stat1')}
                  </div>
                  <div className="text-[10px] text-charcoal-light font-medium uppercase tracking-wider">
                    {t('landing.aboutSection.card1Label1')}
                  </div>
                </div>
                <div>
                  <div className="font-serif font-bold text-sage-dark text-2xl">
                    {t('landing.aboutSection.card1Stat2')}
                  </div>
                  <div className="text-[10px] text-charcoal-light font-medium uppercase tracking-wider">
                    {t('landing.aboutSection.card1Label2')}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl border-[1.5px] border-sage hover:border-metallic hover:shadow-[0_14px_40px_rgba(212,175,55,0.45)] transition-all duration-300 text-left bg-white text-charcoal shadow-sm flex flex-col justify-between"
            >
              <div>
                <ShieldCheck className="w-8 h-8 text-metallic-dark mb-4" />
                <h3 className="font-serif text-2xl font-bold text-sage-dark mb-2">
                  {t('landing.aboutSection.card2Title')}
                </h3>
                <p className="text-charcoal-light text-xs leading-relaxed font-light mb-6">
                  {t('landing.aboutSection.card2Desc')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-sage/10">
                <div>
                  <div className="font-serif font-bold text-sage-dark text-2xl">
                    {t('landing.aboutSection.card2Stat1')}
                  </div>
                  <div className="text-[10px] text-charcoal-light font-medium uppercase tracking-wider">
                    {t('landing.aboutSection.card2Label1')}
                  </div>
                </div>
                <div>
                  <div className="font-serif font-bold text-sage-dark text-2xl">
                    {t('landing.aboutSection.card2Stat2')}
                  </div>
                  <div className="text-[10px] text-charcoal-light font-medium uppercase tracking-wider">
                    {t('landing.aboutSection.card2Label2')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. PROFESSIONAL WEDDING PLATFORM FOOTER */}
      <footer className="bg-charcoal text-neutral/80 pt-16 pb-28 sm:pb-16 px-6 border-t border-metallic/20 text-xs relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral/10">
          
          {/* Brand Info Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-metallic text-sage-dark font-serif font-bold text-lg flex items-center justify-center shadow-accent">
                H
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-neutral block leading-none">
                  {t('nav.brandTitle')}
                </span>
                <span className="text-[9px] text-metallic uppercase tracking-widest mt-0.5 block">
                  by Hamelmal Creatives
                </span>
              </div>
            </div>
            <p className="text-[11px] text-neutral/60 font-light leading-relaxed">
              {t('landing.footer.brandDesc')}
            </p>

            <motion.a 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="https://hamelmal.com" 
              target="_blank" 
              rel="noreferrer" 
              className="mt-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-metallic via-amber-400 to-metallic-dark hover:from-amber-300 hover:to-metallic text-sage-dark font-extrabold text-xs shadow-accent transition-all inline-flex items-center gap-2 border border-amber-300/40 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-sage-dark group-hover:rotate-12 transition-transform" />
              <span>{t('landing.footer.visitParent')}</span>
              <ExternalLink className="w-3.5 h-3.5 text-sage-dark group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.a>
          </div>

          {/* Platform Features Links */}
          <div>
            <h4 className="font-serif font-bold text-neutral text-sm mb-4">
              {t('landing.footer.colFeatures')}
            </h4>
            <ul className="space-y-2.5 text-[11px] text-neutral/60">
              <li><a href="#features" className="hover:text-metallic transition-colors">{t('landing.footer.f1')}</a></li>
              <li><a href="#features" className="hover:text-metallic transition-colors">{t('landing.footer.f2')}</a></li>
              <li><a href="#features" className="hover:text-metallic transition-colors">{t('landing.footer.f3')}</a></li>
              <li><a href="#features" className="hover:text-metallic transition-colors">{t('landing.footer.f4')}</a></li>
            </ul>
          </div>

          {/* Resources & Support Links */}
          <div>
            <h4 className="font-serif font-bold text-neutral text-sm mb-4">
              {t('landing.footer.colResources')}
            </h4>
            <ul className="space-y-2.5 text-[11px] text-neutral/60">
              <li>
                <button onClick={() => setFaqModalOpen(true)} className="hover:text-metallic transition-colors flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-metallic" /> {t('landing.footer.faq')}
                </button>
              </li>
              <li>
                <button onClick={() => setPrivacyModalOpen(true)} className="hover:text-metallic transition-colors flex items-center gap-1">
                  <Shield className="w-3 h-3 text-metallic" /> {t('landing.footer.privacy')}
                </button>
              </li>
              <li><a href="#packages" className="hover:text-metallic transition-colors">{t('landing.footer.packages')}</a></li>
              <li><a href="#trusted" className="hover:text-metallic transition-colors">{t('landing.footer.partners')}</a></li>
              <li><a href="#demo" className="hover:text-metallic transition-colors">{t('landing.footer.demo')}</a></li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-neutral text-sm mb-4">
              {t('landing.footer.colContact')}
            </h4>
            <div className="flex items-center gap-2 text-[11px]">
              <Phone className="w-3.5 h-3.5 text-metallic shrink-0" />
              <span>+251 911 000 000 / +251 922 000 000</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-metallic shrink-0" />
              <span>info@hamelmal.com</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Building2 className="w-3.5 h-3.5 text-metallic shrink-0" />
              <span>{t('landing.footer.address')}</span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a href="#" className="p-2 rounded-full bg-white/5 border border-metallic/20 text-metallic hover:bg-metallic hover:text-sage-dark transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 border border-metallic/20 text-metallic hover:bg-metallic hover:text-sage-dark transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 border border-metallic/20 text-metallic hover:bg-metallic hover:text-sage-dark transition-all">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Security Disclaimer */}
        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-neutral/50 gap-3">
          <div>
            {t('landing.footer.copyright')}
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Lock className="w-3 h-3 text-emerald-400" /> {t('landing.footer.ssl')}
            </span>
            <button onClick={() => setPrivacyModalOpen(true)} className="hover:text-neutral">{t('landing.footer.privacy')}</button>
            <button onClick={() => setFaqModalOpen(true)} className="hover:text-neutral">{t('landing.footer.faq')}</button>
          </div>
        </div>
      </footer>

      {/* 10. LUXURY MOBILE FLOATING BOTTOM BAR NAVIGATION WITH ACTIVE SCROLL SPY & LIVE INDICATOR */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-50 glass-panel-sage p-1.5 rounded-2xl border-2 border-metallic/40 shadow-[0_10px_35px_rgba(0,0,0,0.4)] flex items-center justify-between text-[10px] font-bold text-neutral bg-sage-dark/95 backdrop-blur-xl">
        
        {/* 1) Features Tab */}
        <motion.a 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          href="#features" 
          className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-300 ${
            activeSection === 'features'
              ? 'bg-metallic text-sage-dark shadow-accent font-extrabold scale-105'
              : 'text-neutral/80 hover:text-metallic hover:bg-white/10'
          }`}
        >
          <Layers className={`w-4 h-4 ${activeSection === 'features' ? 'text-sage-dark' : 'text-metallic'}`} />
          <span>{t('landing.mobileNav.features')}</span>
          {activeSection === 'features' && (
            <motion.span 
              layoutId="mobileActiveDot"
              className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sage-dark" 
            />
          )}
        </motion.a>

        {/* 2) Packages Tab */}
        <motion.a 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          href="#packages" 
          className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-300 ${
            activeSection === 'packages'
              ? 'bg-metallic text-sage-dark shadow-accent font-extrabold scale-105'
              : 'text-neutral/80 hover:text-metallic hover:bg-white/10'
          }`}
        >
          <Award className={`w-4 h-4 ${activeSection === 'packages' ? 'text-sage-dark' : 'text-metallic'}`} />
          <span>{t('landing.mobileNav.packages')}</span>
          {activeSection === 'packages' && (
            <motion.span 
              layoutId="mobileActiveDot"
              className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sage-dark" 
            />
          )}
        </motion.a>

        {/* 3) Live Demo Tab (Authentic Live Broadcast Feature Design with true active-only highlight) */}
        <motion.a 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          href="#demo" 
          className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-300 ${
            activeSection === 'demo'
              ? 'bg-metallic text-sage-dark shadow-accent font-extrabold scale-105'
              : 'text-neutral/80 hover:text-metallic hover:bg-white/10'
          }`}
        >
          <div className="relative">
            <Video className={`w-4 h-4 ${activeSection === 'demo' ? 'text-sage-dark' : 'text-rose-400'}`} />
            <span className={`absolute -top-1 -right-1.5 w-2 h-2 rounded-full ${activeSection === 'demo' ? 'bg-rose-600' : 'bg-rose-500 animate-pulse'}`} />
          </div>
          <span className="flex items-center gap-1">
            {t('landing.mobileNav.demo')}
          </span>
          {activeSection === 'demo' && (
            <motion.span 
              layoutId="mobileActiveDot"
              className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sage-dark" 
            />
          )}
        </motion.a>

        {/* 4) Weddings Portfolio Tab */}
        <motion.a 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          href="#portfolio" 
          className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-300 ${
            activeSection === 'portfolio'
              ? 'bg-metallic text-sage-dark shadow-accent font-extrabold scale-105'
              : 'text-neutral/80 hover:text-metallic hover:bg-white/10'
          }`}
        >
          <Star className={`w-4 h-4 ${activeSection === 'portfolio' ? 'text-sage-dark' : 'text-metallic'}`} />
          <span>{t('landing.mobileNav.weddings')}</span>
          {activeSection === 'portfolio' && (
            <motion.span 
              layoutId="mobileActiveDot"
              className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sage-dark" 
            />
          )}
        </motion.a>

        {/* 5) About Us Tab */}
        <motion.a 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          href="#about" 
          className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-300 ${
            activeSection === 'about'
              ? 'bg-metallic text-sage-dark shadow-accent font-extrabold scale-105'
              : 'text-neutral/80 hover:text-metallic hover:bg-white/10'
          }`}
        >
          <Building2 className={`w-4 h-4 ${activeSection === 'about' ? 'text-sage-dark' : 'text-metallic'}`} />
          <span>{t('landing.mobileNav.about')}</span>
          {activeSection === 'about' && (
            <motion.span 
              layoutId="mobileActiveDot"
              className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-sage-dark" 
            />
          )}
        </motion.a>
      </div>

      {/* 11. FAQ MODAL */}
      <AnimatePresence>
        {faqModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="glass-panel-sage p-8 rounded-3xl border border-metallic/40 max-w-lg w-full relative max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setFaqModalOpen(false)}
                className="absolute top-5 right-5 text-neutral/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-metallic" />
                <h3 className="font-serif text-xl font-bold text-neutral">
                  {t('landing.faqModal.title')}
                </h3>
              </div>
              <p className="text-xs text-neutral/70 font-light mb-6">
                {t('landing.faqModal.subtitle')}
              </p>

              <div className="space-y-4 text-xs text-left">
                {faqItems.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-metallic/20">
                    <div className="font-bold text-metallic mb-1.5">{item.q}</div>
                    <p className="text-neutral/80 leading-relaxed font-light">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 12. PRIVACY POLICY MODAL */}
      <AnimatePresence>
        {privacyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="glass-panel-sage p-8 rounded-3xl border border-metallic/40 max-w-lg w-full relative max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setPrivacyModalOpen(false)}
                className="absolute top-5 right-5 text-neutral/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-metallic" />
                <h3 className="font-serif text-xl font-bold text-neutral">
                  {t('landing.privacyModal.title')}
                </h3>
              </div>
              <p className="text-xs text-neutral/70 font-light mb-6">
                {t('landing.privacyModal.subtitle')}
              </p>

              <div className="space-y-3.5 text-xs text-neutral/80 text-left font-light leading-relaxed">
                <p>
                  <strong className="text-metallic font-semibold">{t('landing.privacyModal.p1Title')}</strong> {t('landing.privacyModal.p1Text')}
                </p>
                <p>
                  <strong className="text-metallic font-semibold">{t('landing.privacyModal.p2Title')}</strong> {t('landing.privacyModal.p2Text')}
                </p>
                <p>
                  <strong className="text-metallic font-semibold">{t('landing.privacyModal.p3Title')}</strong> {t('landing.privacyModal.p3Text')}
                </p>
                <p>
                  <strong className="text-metallic font-semibold">{t('landing.privacyModal.p4Title')}</strong> {t('landing.privacyModal.p4Text')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

```

### File: `frontend/src/app/scanner/page.tsx`

```tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  QrCode, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  UserCheck, 
  Search,
  ArrowLeft,
  Camera,
  CameraOff,
  RefreshCw,
  Zap,
  Lock
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface ScanResult {
  code: string;
  guestName: string;
  maxGuests: number;
  scannedCount: number;
  tableNumber: string;
  status: 'VALID' | 'ALREADY_SCANNED' | 'INVALID';
  message: string;
  scannedAt?: string;
}

export default function GateScannerPage() {
  const { t } = useTranslation();
  const [inputCode, setInputCode] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start Camera Feed
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } else {
        setCameraError('Camera access not supported on this browser.');
      }
    } catch (err) {
      console.warn('Camera permission denied or unavailable:', err);
      setCameraError('Camera active in Viewfinder Mode (Permission denied or virtual environment).');
      setIsCameraActive(true);
    }
  };

  // Stop Camera Feed
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Dynamic API & Demo Scan Verifier Logic
  const executeVerification = async (codeToVerify: string) => {
    let query = codeToVerify.trim().toUpperCase();
    if (!query) return;

    // Extract code parameter if a signed deep link URL was scanned
    if (query.includes('CODE=')) {
      const parts = query.split('CODE=');
      if (parts[1]) {
        query = parts[1].split('&')[0];
      }
    }

    try {
      const res = await fetch('/api/events/sara-and-dawit-2026/invitations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: query, checkInCount: 1 }),
      });

      const data = await res.json();

      if (res.ok && data.invitation) {
        setScanResult({
          code: query,
          guestName: data.invitation.guestName,
          maxGuests: data.invitation.maxGuests,
          scannedCount: data.invitation.scannedCount,
          tableNumber: data.invitation.tableNumber || 'Table 1 - VIP Family',
          status: 'VALID',
          message: data.message || `✓ Valid Digital Pass Verified. ${data.invitation.guestName} (${data.invitation.scannedCount}/${data.invitation.maxGuests} Checked In).`,
        });
      } else if (res.status === 409 && data.invitation) {
        setScanResult({
          code: query,
          guestName: data.invitation.guestName,
          maxGuests: data.invitation.maxGuests,
          scannedCount: data.invitation.scannedCount,
          tableNumber: data.invitation.tableNumber || 'Table 1 - VIP Family',
          status: 'ALREADY_SCANNED',
          scannedAt: data.invitation.scannedAt || 'earlier today',
          message: data.message || '⚠️ WARNING: Pass was already checked in.',
        });
      } else {
        setScanResult({
          code: query || 'UNKNOWN',
          guestName: 'Invalid / Counterfeit Pass',
          maxGuests: 0,
          scannedCount: 0,
          tableNumber: 'N/A',
          status: 'INVALID',
          message: '🔴 ACCESS DENIED: Unrecognized or counterfeit QR code signature.',
        });
      }
    } catch (e) {
      setScanResult({
        code: query || 'UNKNOWN',
        guestName: 'Network Error',
        maxGuests: 0,
        scannedCount: 0,
        tableNumber: 'N/A',
        status: 'INVALID',
        message: '🔴 ACCESS DENIED: Verification request failed.',
      });
    }
  };

  const handleVerifyForm = (e: React.FormEvent) => {
    e.preventDefault();
    executeVerification(inputCode);
  };

  const handleCheckIn = async (count: number) => {
    if (!scanResult) return;
    const newCount = scanResult.scannedCount + count;
    setScanResult({
      ...scanResult,
      scannedCount: newCount,
      status: 'ALREADY_SCANNED',
      scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: `Successfully checked in ${count} guest(s). Headcount updated to ${newCount}/${scanResult.maxGuests}.`,
    });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-gray-900 p-4 sm:p-6 flex flex-col items-center">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-gold-500/30">
          <div className="flex items-center gap-3">
            <img
              src="/branding/artboard-14.png"
              alt="Agafari (አጋፋሪ) Logo"
              className="h-9 sm:h-10 w-auto object-contain"
            />
            <div>
              <h1 className="font-serif font-bold text-base text-gray-900">
                {t('scanner.title')}
              </h1>
              <p className="text-[10px] text-gold-600 font-semibold">Door Access Control System</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 flex items-center gap-1 text-xs font-bold transition-all border border-gray-200"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </Link>
          </div>
        </div>

        {/* Live Camera Viewfinder Box */}
        <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-2 border-gold-500/40 bg-charcoal-dark shadow-2xl flex flex-col justify-between p-4">
          
          {/* Real Video Camera Feed / Fallback Container */}
          <div className="absolute inset-0 bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity ${isCameraActive ? 'opacity-80' : 'opacity-20'}`}
            />
            {/* Viewfinder Mock Backdrop if video not active */}
            {(!isCameraActive || cameraError) && (
              <div className="absolute inset-0 bg-gradient-to-br from-charcoal-dark via-black to-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                <CameraOff className="w-12 h-12 text-gold-500/40 mb-2 animate-pulse" />
                <p className="text-xs text-gold-400 font-semibold mb-1">Live Viewfinder Active</p>
                <p className="text-[11px] text-ivory/50">Point device camera at guest's mobile QR code</p>
              </div>
            )}
          </div>

          {/* Top Camera Controls Overlay */}
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-gold-500/30 text-[11px] text-gold-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE CAMERA SCANNER</span>
            </div>

            <button
              onClick={() => (isCameraActive ? stopCamera() : startCamera())}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-all"
              title="Toggle Camera"
            >
              {isCameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Animated Scanning Reticle & Corner Brackets */}
          <div className="relative z-10 w-56 h-56 mx-auto my-auto rounded-2xl border border-gold-500/40 flex items-center justify-center">
            {/* Corner Target Markers */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-gold-400 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-gold-400 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-gold-400 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-gold-400 rounded-br-lg" />

            {/* Scanning Laser Line */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent shadow-[0_0_15px_#D4AF37] animate-bounce" />
          </div>

          {/* Bottom Guidance Label */}
          <div className="relative z-10 text-center bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10">
            <p className="text-[11px] text-ivory/80 font-medium flex items-center justify-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              Align guest QR code inside the frame to scan
            </p>
          </div>
        </div>

        {/* Verification Form / Manual Backup Entry */}
        <div className="bg-white p-6 rounded-3xl border border-gold-500/30 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-gray-100">
            <div>
              <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-4 h-4 text-gold-500" />
                Manual Invitation Lookup
              </span>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Use when guest screen is cracked or camera scan is unavailable.
              </p>
            </div>
            <span className="text-[11px] text-gold-600 font-mono font-bold shrink-0">
              Format: INV-SD2026-XXX
            </span>
          </div>

          <form onSubmit={handleVerifyForm} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="ENTER CODE E.G. INV-SD2026-001"
                className="w-full px-4 py-3 pl-11 rounded-2xl bg-gray-50 border border-gold-500/30 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 uppercase font-mono tracking-wider placeholder:text-gray-400 placeholder:normal-case placeholder:font-sans"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-black hover:bg-gray-800 text-gold-400 font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md border border-gold-500/40 cursor-pointer active:scale-95"
            >
              <QrCode className="w-4 h-4 text-gold-400" />
              <span>Verify Pass Credentials</span>
            </button>
          </form>
        </div>

        {/* Verification Result Card */}
        {scanResult && (
          <div
            className={`p-6 rounded-3xl border shadow-xl transition-all animate-fade-in ${
              scanResult.status === 'VALID'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-emerald-900/10'
                : scanResult.status === 'ALREADY_SCANNED'
                ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-amber-900/10'
                : 'bg-rose-50 border-rose-400 text-rose-950 shadow-rose-900/10'
            }`}
          >
            <div className="flex items-start gap-3 mb-4">
              {scanResult.status === 'VALID' ? (
                <div className="p-2.5 rounded-2xl bg-emerald-100 border border-emerald-300 shrink-0">
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                </div>
              ) : scanResult.status === 'ALREADY_SCANNED' ? (
                <div className="p-2.5 rounded-2xl bg-amber-100 border border-amber-300 shrink-0">
                  <AlertTriangle className="w-7 h-7 text-amber-600" />
                </div>
              ) : (
                <div className="p-2.5 rounded-2xl bg-rose-100 border border-rose-300 shrink-0">
                  <XCircle className="w-7 h-7 text-rose-600" />
                </div>
              )}

              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-80 font-bold">
                  {scanResult.code}
                </span>
                <h3 className="font-serif font-bold text-lg leading-snug">
                  {scanResult.status === 'VALID'
                    ? 'VALID INVITATION PASS'
                    : scanResult.status === 'ALREADY_SCANNED'
                    ? 'ALREADY SCANNED PASS WARNING'
                    : 'INVALID / COUNTERFEIT PASS'}
                </h3>
              </div>
            </div>

            {/* Guest & Seating Details */}
            <div className="space-y-2 text-xs bg-white p-4 rounded-2xl border border-gray-200 font-mono mb-4 shadow-sm">
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-500">Guest Name:</span>
                <span className="font-bold text-gray-900">{scanResult.guestName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-500">Allowed Quota:</span>
                <span className="font-bold text-gold-600">{scanResult.maxGuests} Guests</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-500">Seating Table:</span>
                <span className="font-bold text-gray-900">{scanResult.tableNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Checked In:</span>
                <span className="font-bold text-gray-900">
                  {scanResult.scannedCount} of {scanResult.maxGuests}
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed mb-4 font-medium">{scanResult.message}</p>

            {/* Action Buttons for Check-In */}
            {scanResult.status === 'VALID' && scanResult.scannedCount < scanResult.maxGuests && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleCheckIn(1)}
                  className="flex-1 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                >
                  <UserCheck className="w-4 h-4" />
                  Check In 1 Guest
                </button>
                {scanResult.maxGuests > 1 && (
                  <button
                    onClick={() => handleCheckIn(scanResult.maxGuests)}
                    className="flex-1 py-3.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    <UserCheck className="w-4 h-4" />
                    Check In All ({scanResult.maxGuests})
                  </button>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

```

### File: `frontend/src/components/GateScanner.tsx`

```tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Zap } from 'lucide-react';

interface ScanResultState {
  status: 'VALID' | 'ALREADY_SCANNED' | 'INVALID';
  message: string;
  code: string;
  guestName?: string;
  maxGuests?: number;
  scannedCount?: number;
  tableNumber?: string;
}

export function GateScanner({ eventSlug = 'sara-and-dawit-2026' }: { eventSlug?: string }) {
  const [scanResult, setScanResult] = useState<ScanResultState | null>(null);
  const [loading, setLoading] = useState(false);
  const [scannerActive, setScannerActive] = useState(true);

  useEffect(() => {
    if (!scannerActive) return;

    const scanner = new Html5QrcodeScanner(
      'qr-reader-container',
      {
        fps: 15,
        qrbox: { width: 240, height: 240 },
        aspectRatio: 1.0,
      },
      false
    );

    async function onScanSuccess(decodedText: string) {
      try {
        scanner.pause();
      } catch (e) {}

      setLoading(true);

      // Extract code if a URL was scanned
      let codeToVerify = decodedText.trim();
      if (codeToVerify.includes('code=')) {
        const urlParams = new URLSearchParams(codeToVerify.split('?')[1]);
        const extracted = urlParams.get('code');
        if (extracted) codeToVerify = extracted;
      }

      try {
        const response = await fetch(`/api/events/${eventSlug}/invitations`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inviteCode: codeToVerify, checkInCount: 1 }),
        });

        const data = await response.json();

        if (response.ok && data.invitation) {
          setScanResult({
            status: 'VALID',
            message: data.message || `Verified: ${data.invitation.guestName}`,
            code: codeToVerify,
            guestName: data.invitation.guestName,
            maxGuests: data.invitation.maxGuests,
            scannedCount: data.invitation.scannedCount,
            tableNumber: data.invitation.tableNumber || 'VIP Table 1',
          });
        } else if (response.status === 409 && data.invitation) {
          setScanResult({
            status: 'ALREADY_SCANNED',
            message: data.message || 'WARNING: Pass was already checked in.',
            code: codeToVerify,
            guestName: data.invitation.guestName,
            maxGuests: data.invitation.maxGuests,
            scannedCount: data.invitation.scannedCount,
            tableNumber: data.invitation.tableNumber || 'VIP Table 1',
          });
        } else {
          setScanResult({
            status: 'INVALID',
            message: data.message || 'Access Denied: Unrecognized or counterfeit QR code.',
            code: codeToVerify,
          });
        }
      } catch (err) {
        setScanResult({
          status: 'INVALID',
          message: 'Network error or server verification timeout.',
          code: codeToVerify,
        });
      } finally {
        setLoading(false);
      }
    }

    function onScanFailure() {
      // Continue scanning next frame
    }

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [eventSlug, scannerActive]);

  return (
    <div className="w-full space-y-4">
      <div className="relative rounded-3xl overflow-hidden border-2 border-gold-500/40 bg-black shadow-lg p-2">
        <div id="qr-reader-container" className="overflow-hidden rounded-2xl bg-black text-white" />
      </div>

      {loading && (
        <div className="p-3 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-600 font-bold text-xs text-center flex items-center justify-center gap-2 animate-pulse">
          <Zap className="w-4 h-4 text-gold-500" />
          <span>Verifying Pass Credentials against Gate API...</span>
        </div>
      )}

      {scanResult && (
        <div
          className={`p-5 rounded-3xl border shadow-md transition-all ${
            scanResult.status === 'VALID'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : scanResult.status === 'ALREADY_SCANNED'
              ? 'bg-amber-50 border-amber-400 text-amber-950'
              : 'bg-rose-50 border-rose-400 text-rose-950'
          }`}
        >
          <div className="flex items-start gap-3">
            {scanResult.status === 'VALID' ? (
              <CheckCircle className="w-7 h-7 text-emerald-600 shrink-0" />
            ) : scanResult.status === 'ALREADY_SCANNED' ? (
              <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />
            ) : (
              <XCircle className="w-7 h-7 text-rose-600 shrink-0" />
            )}

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-75">
                CODE: {scanResult.code}
              </span>
              <h4 className="font-serif font-bold text-base">
                {scanResult.status === 'VALID'
                  ? 'VALID INVITATION PASS'
                  : scanResult.status === 'ALREADY_SCANNED'
                  ? 'ALREADY SCANNED PASS WARNING'
                  : 'INVALID PASS - ACCESS DENIED'}
              </h4>
              <p className="text-xs font-medium">{scanResult.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

```

### File: `frontend/src/db/schema.ts`

```typescript
// =============================================================================
// AGAFARI (አጋፋሪ) WEDDING CELEBRATION PLATFORM
// Standard TypeScript Database Schema (Drizzle / Relational PostgreSQL)
// =============================================================================

export interface EventEntity {
  id: string;
  slug: string;
  title: string;
  brideName: string;
  groomName: string;
  eventDate: string; // ISO Timestamp
  startTime?: string;
  secondEventDate?: string;
  venueName: string;
  venueAddress?: string;
  venueMapUrl?: string;
  dressCode?: string;
  welcomeMessage?: string;
  coverImageUrl?: string;
  status: 'DRAFT' | 'COMING_SOON' | 'LIVE' | 'COMPLETED' | 'ARCHIVED';
  adminApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  youtubeVideoId?: string;
  isLive: boolean;
  thankYouMessage?: string;
  thankYouImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserEntity {
  id: string;
  eventId?: string | null;
  email: string;
  passwordHash: string;
  temporaryPassword?: string;
  fullName: string;
  role: 'SYSTEM_ADMIN' | 'EVENT_ORGANIZER' | 'BRIDE_GROOM' | 'LIVE_STREAMER' | 'GATE_SCANNER' | 'GUEST';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationEntity {
  id: string;
  eventId: string;
  inviteCode: string;
  inviteType: 'CARD' | 'LINK';
  guestName: string;
  guestPhone?: string;
  maxGuests: number;
  tableNumber?: string;
  rsvpStatus: 'ATTENDING' | 'MAYBE' | 'DECLINED' | 'PENDING';
  attendingHeadcount: number;
  isScanned: boolean;
  scannedCount: number;
  scannedAt?: string;
  scannedBy?: string;
  qrCodeUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface RsvpEntity {
  id: string;
  eventId: string;
  invitationId?: string;
  inviteCode?: string;
  guestName: string;
  guestPhone?: string;
  attendanceStatus: 'ATTENDING' | 'MAYBE' | 'DECLINED';
  attendingCount: number;
  songRecommendation?: string;
  dietaryNotes?: string;
  createdAt: string;
}

export interface WishEntity {
  id: string;
  eventId: string;
  senderName: string;
  message: string;
  mediaType: 'IMAGE' | 'VIDEO';
  videoUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isFeatured: boolean;
  createdAt: string;
}

export interface MediaAssetEntity {
  id: string;
  eventId: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE';
  category: 'WISHES' | 'BTS' | 'LIVE';
  cdnUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  viewsCount: number;
  likesCount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface MediaCommentEntity {
  id: string;
  mediaId: string;
  senderName: string;
  comment: string;
  createdAt: string;
}

export interface MezmurItemEntity {
  id: string;
  eventId: string;
  title: string;
  artist: string;
  category: 'MEZMUR' | 'TRADITIONAL' | 'DANCE' | 'SLOW';
  orderIndex: number;
  createdAt: string;
}

```

### File: `frontend/src/lib/auth.ts`

```typescript
import { createHmac, pbkdf2Sync, randomBytes } from 'crypto';
import { NextRequest } from 'next/server';

export type UserRole = 
  | 'SYSTEM_ADMIN' 
  | 'EVENT_ORGANIZER' 
  | 'BRIDE_GROOM' 
  | 'LIVE_STREAMER' 
  | 'GATE_SCANNER' 
  | 'GUEST';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  eventId?: string | null;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'agafari_super_secret_jwt_key_2026';

// 1. Password Hashing Utility
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

// 2. JWT Generation (Base64Url HMAC SHA-256)
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString();
}

export function generateToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>, expiresInHours = 24): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: AuthTokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInHours * 3600,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const payload: AuthTokenPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null; // Expired token
    }

    return payload;
  } catch (error) {
    return null;
  }
}

// 3. Extract Token from Request Header or Cookie
export function getAuthUser(req: NextRequest): AuthTokenPayload | null {
  const authHeader = req.headers.get('authorization');
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.get('agafari_token')?.value;
  }

  if (!token) return null;
  return verifyToken(token);
}

// 4. Role Authorization Guard Check
export function hasRole(user: AuthTokenPayload | null, allowedRoles: UserRole[]): boolean {
  if (!user) return false;
  if (user.role === 'SYSTEM_ADMIN') return true; // System Admin has global override
  return allowedRoles.includes(user.role);
}

```

### File: `frontend/src/lib/i18n.tsx`

```tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import en from '@/locales/en.json';
import am from '@/locales/am.json';
import om from '@/locales/om.json';
import ti from '@/locales/ti.json';

export type Locale = 'en' | 'am' | 'om' | 'ti';

const translations: Record<Locale, any> = {
  en,
  am,
  om,
  ti,
};

const localeNames: Record<Locale, { label: string }> = {
  en: { label: 'English' },
  am: { label: 'አማርኛ' },
  om: { label: 'Afaan Oromoo' },
  ti: { label: 'ትግርኛ' },
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (path: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  toggleLocale: () => {},
  t: (path: string, fallback?: string) => fallback || path,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem('agafari_locale') as Locale;
      if (['en', 'am', 'om', 'ti'].includes(savedLocale)) {
        setLocaleState(savedLocale);
      }
    } catch (e) {}
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('agafari_locale', newLocale);
    } catch (e) {}
  };

  const toggleLocale = () => {
    const order: Locale[] = ['en', 'am', 'om', 'ti'];
    const nextIndex = (order.indexOf(locale) + 1) % order.length;
    setLocale(order[nextIndex]);
  };

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    
    let current: any = translations[locale];
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        current = undefined;
        break;
      }
    }

    if (typeof current === 'string') {
      return current;
    }

    if (locale !== 'en') {
      let enCurrent: any = translations.en;
      for (const key of keys) {
        if (enCurrent && typeof enCurrent === 'object' && key in enCurrent) {
          enCurrent = enCurrent[key];
        } else {
          enCurrent = undefined;
          break;
        }
      }
      if (typeof enCurrent === 'string') {
        return enCurrent;
      }
    }

    return fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}

// Clean Dropdown Language Switcher (No GB/ET letters, only language names)
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const active = localeNames[locale] || localeNames.en;

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left shrink-0 z-50 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-3.5 rounded-full bg-black/90 backdrop-blur-md border border-gold-500/40 hover:border-gold-400 text-gold-400 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
      >
        <Globe className="w-3.5 h-3.5 text-gold-400 shrink-0" />
        <span>{active.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gold-400/80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-black border-2 border-gold-500/50 shadow-2xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95">
          {(Object.keys(localeNames) as Locale[]).map((key) => {
            const item = localeNames[key];
            const isSelected = locale === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setLocale(key);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-gold-500 text-black font-extrabold shadow-md'
                    : 'text-gold-300 hover:bg-gold-500/10 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

```

### File: `frontend/src/lib/mockData.ts`

```typescript
import { hashPassword, UserRole } from './auth';

export interface MezmurItem {
  id: string;
  title: string;
  artist: string;
  category: 'MEZMUR' | 'TRADITIONAL' | 'DANCE' | 'SLOW';
}

export interface EventData {
  id: string;
  slug: string;
  title: string;
  brideName: string;
  groomName: string;
  eventDate: string; // ISO String
  startTime?: string; // e.g. 14:00
  secondEventDate?: string; // e.g. Melse / Reception Date
  venueName: string;
  venueAddress: string;
  venueMapUrl: string;
  dressCode: string;
  welcomeMessage: string;
  coverImageUrl: string;
  status: 'DRAFT' | 'COMING_SOON' | 'LIVE' | 'COMPLETED' | 'ARCHIVED';
  adminApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  coupleCredentials?: {
    email: string;
    temporaryPassword?: string;
  };
  youtubeStreamUrl?: string;
  youtubeVideoId?: string;
  isLive?: boolean;
  backgroundMusicUrl?: string;
  backgroundMusicTitle?: string;
  mezmurPlaylist?: MezmurItem[];
  thankYouMessage?: string;
  thankYouImageUrl?: string;
}

export interface UserRecord {
  id: string;
  eventId: string | null;
  email: string;
  passwordHash: string;
  temporaryPassword?: string;
  fullName: string;
  role: 'SYSTEM_ADMIN' | 'EVENT_ORGANIZER' | 'BRIDE_GROOM' | 'LIVE_STREAMER' | 'GATE_SCANNER' | 'GUEST';
}

export interface WishData {
  id: string;
  eventId: string;
  senderName: string;
  message: string;
  mediaType?: 'TEXT' | 'VIDEO';
  videoUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface MediaAssetData {
  id: string;
  eventId: string;
  uploaderName: string;
  mediaType: 'VIDEO' | 'IMAGE';
  category?: 'WISHES' | 'BTS' | 'LIVE';
  cdnUrl: string;
  thumbnailUrl?: string;
  caption: string;
  viewsCount?: number;
  likesCount?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface InvitationData {
  id: string;
  eventId: string;
  inviteCode: string;
  inviteType?: 'CARD' | 'LINK';
  rsvpStatus?: 'ATTENDING' | 'DECLINED' | 'PENDING';
  attendingHeadcount?: number;
  guestName: string;
  guestPhone: string;
  maxGuests: number;
  tableNumber?: string;
  scannedCount: number;
  isScanned: boolean;
  scannedAt?: string;
  qrCodeUrl: string;
  createdAt: string;
}

// Global in-memory storage for local runtime persistence
const mockEvents: EventData[] = [
  {
    id: 'evt-sara-dawit-2026',
    slug: 'sara-and-dawit-2026',
    title: "Sara & Dawit's Royal Wedding",
    brideName: 'Sara Tadesse',
    groomName: 'Dawit Alemayehu',
    eventDate: '2026-08-15T14:00:00.000Z',
    startTime: '14:00',
    venueName: 'Sheraton Addis Luxury Ballroom',
    venueAddress: 'Taitu Street, Addis Ababa, Ethiopia',
    venueMapUrl: 'https://maps.google.com/?q=Sheraton+Addis',
    dressCode: 'Traditional Habesha Kemis & Black Tie',
    welcomeMessage: 'We are overjoyed to celebrate the beginning of our forever journey with our beloved family and friends!',
    coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    status: 'COMING_SOON',
    adminApprovalStatus: 'APPROVED',
    coupleCredentials: {
      email: 'couple@sara-dawit.com',
      temporaryPassword: 'couple123',
    },
    youtubeStreamUrl: 'https://youtu.be/oVs7dGNBOp8?si=7m5-BmpPGpOVZUar',
    youtubeVideoId: 'oVs7dGNBOp8',
    isLive: false,
    backgroundMusicUrl: '/audio/leykunu_mezmur.mp3',
    backgroundMusicTitle: 'ለይኩኑ (Leykunu Orthodox Wedding Mezmur)',
    mezmurPlaylist: [
      { id: 'm1', title: 'Meskelene Alene (Serege)', artist: 'Ethiopian Orthodox Wedding Choir', category: 'MEZMUR' },
      { id: 'm2', title: 'Yene Gena & Merekba Dance', artist: 'Traditional Habesha Cultural Ensemble', category: 'TRADITIONAL' },
      { id: 'm3', title: 'Eskista Royal Entrance', artist: 'Addis Cultural Band', category: 'DANCE' },
      { id: 'm4', title: 'Kalkidan (Vows of Forever)', artist: 'Acoustic Habesha Ensemble', category: 'SLOW' },
    ],
  },
  {
    id: 'evt-bethlehem-michael-2026',
    slug: 'bethlehem-and-michael-2026',
    title: "Bethlehem & Michael's Grand Celebration",
    brideName: 'Bethlehem Kassa',
    groomName: 'Michael Haile',
    eventDate: '2026-10-24T15:00:00.000Z',
    startTime: '15:00',
    venueName: 'Ethiopian Skylight Hotel Grand Ballroom',
    venueAddress: 'Bole Airport Road, Addis Ababa',
    venueMapUrl: 'https://maps.google.com/?q=Skylight+Hotel+Addis',
    dressCode: 'Royal Gold & Emerald Habesha Attire',
    welcomeMessage: 'Welcome to our celebration of love, faith, and family harmony!',
    coverImageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
    status: 'COMING_SOON',
    adminApprovalStatus: 'APPROVED',
    coupleCredentials: {
      email: 'couple@bethlehem-michael.com',
      temporaryPassword: 'bethpass2026',
    },
  },
  {
    id: 'evt-helina-samuel-2026',
    slug: 'helina-and-samuel-2026',
    title: "Helina & Samuel's Autumn Wedding",
    brideName: 'Helina Assefa',
    groomName: 'Samuel Getachew',
    eventDate: '2026-12-12T13:30:00.000Z',
    startTime: '13:30',
    venueName: 'Hilton Addis Ababa Poolside Gardens',
    venueAddress: 'Menelik II Avenue, Addis Ababa',
    venueMapUrl: 'https://maps.google.com/?q=Hilton+Addis',
    dressCode: 'Classic White & Traditional Kemis',
    welcomeMessage: 'Join us as we unite our hearts before God and our loved ones.',
    coverImageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
    status: 'DRAFT',
    adminApprovalStatus: 'PENDING',
    coupleCredentials: {
      email: 'couple@helina-samuel.com',
      temporaryPassword: 'helipass2026',
    },
  },
  {
    id: 'evt-hanna-yared-2025',
    slug: 'hanna-and-yared-2025',
    title: "Hanna & Yared's Luxury Wedding Archive",
    brideName: 'Hanna Tesfaye',
    groomName: 'Yared Worku',
    eventDate: '2025-01-10T14:00:00.000Z',
    startTime: '14:00',
    venueName: 'Hyatt Regency Addis Ababa',
    venueAddress: 'Meskel Square, Addis Ababa',
    venueMapUrl: 'https://maps.google.com/?q=Hyatt+Regency+Addis',
    dressCode: 'Black Tie & Habesha Cultural',
    welcomeMessage: 'Thank you for being part of our cherished memories!',
    coverImageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop',
    status: 'COMPLETED',
    adminApprovalStatus: 'APPROVED',
    coupleCredentials: {
      email: 'couple@hanna-yared.com',
      temporaryPassword: 'hannapass2025',
    },
  },
  {
    id: 'evt-selam-natnael-2024',
    slug: 'selam-and-natnael-2024',
    title: "Selamawit & Natnael's Garden Wedding Archive",
    brideName: 'Selamawit Desta',
    groomName: 'Natnael Girma',
    eventDate: '2024-12-28T14:30:00.000Z',
    startTime: '14:30',
    venueName: 'Ghion Hotel Royal Palm Gardens',
    venueAddress: 'Ras Desta Damtew St, Addis Ababa',
    venueMapUrl: 'https://maps.google.com/?q=Ghion+Hotel',
    dressCode: 'Pastel & Traditional Habesha',
    welcomeMessage: 'A timeless memory of our special union.',
    coverImageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop',
    status: 'COMPLETED',
    adminApprovalStatus: 'APPROVED',
    coupleCredentials: {
      email: 'couple@selam-natnael.com',
      temporaryPassword: 'selampass2024',
    },
  },
];

const mockUsers: UserRecord[] = [
  {
    id: 'usr-admin-1',
    eventId: null,
    email: 'admin@hamelmal.com',
    passwordHash: hashPassword('admin123'),
    temporaryPassword: 'admin123',
    fullName: 'Hamelmal Admin',
    role: 'SYSTEM_ADMIN',
  },
  {
    id: 'usr-org-1',
    eventId: 'evt-sara-dawit-2026',
    email: 'organizer@sara-dawit.com',
    passwordHash: hashPassword('org123'),
    temporaryPassword: 'org123',
    fullName: 'Yonas Planners',
    role: 'EVENT_ORGANIZER',
  },
  {
    id: 'usr-couple-1',
    eventId: 'evt-sara-dawit-2026',
    email: 'couple@sara-dawit.com',
    passwordHash: hashPassword('couple123'),
    temporaryPassword: 'couple123',
    fullName: 'Sara & Dawit',
    role: 'BRIDE_GROOM',
  },
  {
    id: 'usr-streamer-1',
    eventId: 'evt-sara-dawit-2026',
    email: 'streamer@sara-dawit.com',
    passwordHash: hashPassword('stream123'),
    temporaryPassword: 'stream123',
    fullName: 'Abebe Media Operator',
    role: 'LIVE_STREAMER',
  },
  {
    id: 'usr-scanner-1',
    eventId: 'evt-sara-dawit-2026',
    email: 'scanner@sara-dawit.com',
    passwordHash: hashPassword('scan123'),
    temporaryPassword: 'scan123',
    fullName: 'Gate Security Gate 1',
    role: 'GATE_SCANNER',
  },
  // Bethlehem & Michael Users
  {
    id: 'usr-couple-2',
    eventId: 'evt-bethlehem-michael-2026',
    email: 'couple@bethlehem-michael.com',
    passwordHash: hashPassword('bethpass2026'),
    temporaryPassword: 'bethpass2026',
    fullName: 'Bethlehem & Michael',
    role: 'BRIDE_GROOM',
  },
  {
    id: 'usr-streamer-2',
    eventId: 'evt-bethlehem-michael-2026',
    email: 'streamer@bethlehem-michael.com',
    passwordHash: hashPassword('stream2026'),
    temporaryPassword: 'stream2026',
    fullName: 'Skylight Media Team',
    role: 'LIVE_STREAMER',
  },
  {
    id: 'usr-scanner-2',
    eventId: 'evt-bethlehem-michael-2026',
    email: 'scanner@bethlehem-michael.com',
    passwordHash: hashPassword('scan2026'),
    temporaryPassword: 'scan2026',
    fullName: 'Bole Gate Scanner Alpha',
    role: 'GATE_SCANNER',
  },
];

const mockWishes: WishData[] = [
  {
    id: 'wsh-1',
    eventId: 'evt-sara-dawit-2026',
    senderName: 'Uncle Bekele & Family',
    message: 'Wishing you both a lifetime of unconditional love, peace, and endless joy! Egziabhier Yibarkachihu!',
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'wsh-2',
    eventId: 'evt-sara-dawit-2026',
    senderName: 'Helen Girma',
    message: 'Can’t wait to celebrate with you guys! You look like a fairytale couple!',
    status: 'APPROVED',
    mediaType: 'TEXT',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

const mockMediaAssets: MediaAssetData[] = [
  {
    id: 'med-vid-1',
    eventId: 'evt-sara-dawit-2026',
    uploaderName: 'Bride Maid Team',
    mediaType: 'VIDEO',
    category: 'WISHES',
    cdnUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-in-a-park-on-their-wedding-day-43185-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=300&auto=format&fit=crop',
    caption: 'Magical moments and heartfelt blessings for Sara & Dawit! Wishing you endless love and happiness! 💍✨ #SaraAndDawit2026',
    viewsCount: 384,
    likesCount: 192,
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'med-bts-1',
    eventId: 'evt-sara-dawit-2026',
    uploaderName: 'Best Man Robel',
    mediaType: 'VIDEO',
    category: 'BTS',
    cdnUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-smiling-and-holding-hands-43183-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
    caption: 'Behind the scenes: Groomsmen Eskista dance rehearsal before the royal entrance! 💃🕺 #BehindTheScenes',
    viewsCount: 520,
    likesCount: 284,
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'med-wish-2',
    eventId: 'evt-sara-dawit-2026',
    uploaderName: 'Uncle Bekele & Family',
    mediaType: 'VIDEO',
    category: 'WISHES',
    cdnUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-holding-a-bouquet-43184-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=300&auto=format&fit=crop',
    caption: 'Sending our warmest blessings from Atlanta! May your marriage be filled with abundance and joy! 💖🥂 #WeddingWishes',
    viewsCount: 310,
    likesCount: 145,
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'med-live-1',
    eventId: 'evt-sara-dawit-2026',
    uploaderName: 'Agafari Live Broadcast Team',
    mediaType: 'VIDEO',
    category: 'LIVE',
    cdnUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-in-a-park-on-their-wedding-day-43185-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
    caption: '🔴 LIVE BROADCAST: Royal Reception & Grand Entrance Ceremony at Sheraton Addis! 👑✨',
    viewsCount: 1240,
    likesCount: 680,
    status: 'APPROVED',
    createdAt: new Date().toISOString(),
  },
];

const mockInvitations: InvitationData[] = [
  {
    id: 'inv-1',
    eventId: 'evt-sara-dawit-2026',
    inviteCode: 'INV-SD2026-001',
    guestName: 'Abebe Kebede & Family',
    guestPhone: '+251911223344',
    maxGuests: 2,
    inviteType: 'CARD',
    rsvpStatus: 'ATTENDING',
    attendingHeadcount: 2,
    tableNumber: 'Table 1: Family VIP',
    scannedCount: 0,
    isScanned: false,
    qrCodeUrl: '/api/qr/INV-SD2026-001',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'inv-2',
    eventId: 'evt-sara-dawit-2026',
    inviteCode: 'INV-SD2026-002',
    guestName: 'Dr. Michael Tesfaye (London)',
    guestPhone: '+251922445566',
    maxGuests: 1,
    inviteType: 'LINK',
    rsvpStatus: 'ATTENDING',
    attendingHeadcount: 1,
    tableNumber: 'Table 3: Diaspora Relatives',
    scannedCount: 1,
    isScanned: true,
    qrCodeUrl: '/api/qr/INV-SD2026-002',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'inv-3',
    eventId: 'evt-sara-dawit-2026',
    inviteCode: 'INV-SD2026-003',
    guestName: 'Sara Bekele & Guest',
    guestPhone: '+251933556677',
    maxGuests: 2,
    inviteType: 'CARD',
    rsvpStatus: 'PENDING',
    scannedCount: 0,
    isScanned: false,
    qrCodeUrl: '/api/qr/INV-SD2026-003',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'inv-4',
    eventId: 'evt-sara-dawit-2026',
    inviteCode: 'INV-SD2026-004',
    guestName: 'Yared & Tigist (Diaspora)',
    guestPhone: '+12025550192',
    maxGuests: 2,
    inviteType: 'LINK',
    rsvpStatus: 'DECLINED',
    scannedCount: 0,
    isScanned: false,
    qrCodeUrl: '/api/qr/INV-SD2026-004',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

export const mockStore = {
  events: mockEvents,
  users: mockUsers,
  wishes: mockWishes,
  mediaAssets: mockMediaAssets,
  invitations: mockInvitations,
};

```

### File: `frontend/src/locales/am.json`

```json
{
  "common": {
    "save": "አስቀምጥ",
    "saved": "ተቀምጧል!",
    "cancel": "ይቅር / ተመለስ",
    "close": "ዝጋ",
    "delete": "አስወግድ",
    "edit": "አስተካክል",
    "open": "ክፈት",
    "download": "አውርድ",
    "print": "አትም",
    "copy": "ቅዳ",
    "copied": "ተቀድቷል!",
    "loading": "በማዘጋጀት ላይ...",
    "search": "ፈልግ...",
    "all": "ሁሉም",
    "status": "ሁኔታ",
    "actions": "እርምጃዎች",
    "yes": "አዎ",
    "no": "አይ",
    "back": "ወደ ኋላ",
    "submit": "አረጋግጥና ላክ",
    "submitting": "በመላክ ላይ...",
    "success": "ተሳክቷል!",
    "error": "ስህተት አጋጥሟል",
    "required": "አስፈላጊ",
    "optional": "አማራጭ",
    "guest": "እንግዳ",
    "guests": "እንግዶች",
    "heads": "ሰዎች",
    "offline": "የቀጥታ ስርጭት የለም",
    "live": "ቀጥታ ስርጭት",
    "liveNow": "አሁን በቀጥታ ስርጭት ላይ"
  },
  "nav": {
    "brandTitle": "አጋፋሪ",
    "tagline": "የንግሥና የዲጂታል ሰርግ ድምቀት",
    "couplesPortal": "የሙሽሮች መቆጣጠሪያ",
    "organizerPortal": "የሰርግ አዘጋጆች ማዕከል",
    "adminPortal": "የዋና አስተዳዳሪ ኮንሶል",
    "signOut": "ውጣ",
    "openPublicPage": "የሰርጉን ይፋዊ ድረ-ገጽ ክፈት",
    "memoryFeed": "የትዝታ ቪዲዮዎች (Reels)",
    "wishes": "የምርቃት ግድግዳ",
    "liveStream": "የቀጥታ ስርጭት",
    "schedule": "የሰርጉ መርሃ ግብር",
    "mezmur": "የሰርግ መዝሙራትና ዜማዎች",
    "gatePass": "የመግቢያ ፈቃድ (QR)"
  },
  "publicEvent": {
    "hero": {
      "royalWedding": "የተቀደሰ የጋብቻና የደስታ በዓል",
      "enterGatePass": "የመግቢያ ፈቃድዎን ይመልከቱ",
      "sendWish": "ምርቃትና መልካም ምኞት ያበርክቱ",
      "watchLive": "የቀጥታ ስርጭቱን ይከታተሉ",
      "scrollMemories": "የሰርጉን የትዝታ ቪዲዮዎች ይመልከቱ",
      "announcementFrom": "ከሙሽሮቹ የተላለፈ መልእክት"
    },
    "countdown": {
      "title": "ወደ ዘላለማዊው የቃል ኪዳን ቀን መቁጠሪያ",
      "days": "ቀናት",
      "hours": "ሰዓታት",
      "minutes": "ደቂቃዎች",
      "seconds": "ሰከንዶች",
      "today": "ዛሬ የተባረከው የሰርጋችን ቀን ነው!"
    },
    "schedule": {
      "badge": "የሰርጉ ቀን የጊዜ ሰሌዳ",
      "title": "የክብረ በዓሉ መርሃ ግብር",
      "churchCeremony": "የተክሊል ስርዓትና የቤተክርስቲያን ጸሎት",
      "churchDesc": "በእግዚአብሔር እና በምእመናን ፊት የሚፈጸም ቅዱስ የተክሊል እና የጋብቻ ቃል ኪዳን ስርዓት።",
      "photoSession": "የፎቶ እና ቪዲዮ መታሰቢያ ክፍለ ጊዜ",
      "photoDesc": "ከክብር ሚዜዎችና ከቅርብ ቤተሰቦች ጋር የሚደረግ ውብ የመታሰቢያ ፎቶ ፕሮግራም።",
      "grandReception": "የክብር ድግስ፣ የባህል መልስና ጉርሻ",
      "receptionDesc": "የባህል ጭፈራ፣ የምሽት ድግስ፣ የጉርሻ ስርዓትና የሰርግ ኬክ የመቁረጥ ደማቅ ስነ-ስርዓት።"
    },
    "stream": {
      "badge": "ዓለም አቀፍ የቀጥታ ስርጭት",
      "title": "የጋብቻ ስነ-ስርዓታችንን በየትኛውም የዓለም ክፍል ሆነው በቀጥታ ይከታተሉ",
      "subtitle": "በአገር ውስጥም ሆነ በውጭ አገር የምትገኙ ውድ ቤተሰቦቻችንና ወዳጆቻችን የደስታችን ተካፋይ በመሆን ምርቃትዎን ያካፍሉን።",
      "liveBadge": "ቀጥታ ስርጭት ላይ",
      "offlineBadge": "የቀጥታ ስርጭቱ በቅርቡ ይጀምራል",
      "chatNotice": "በዓለም ዙሪያ ለሚገኙ ቤተሰቦችና ወዳጆች የተመሳሰለ የቀጥታ የዩቲዩብ ስርጭት።"
    },
    "mezmur": {
      "badge": "የተመረጡ መዝሙራትና የባህል ዜማዎች",
      "title": "የሰርግ መዝሙራትና የሙዚቃ ምርጫ",
      "subtitle": "በሙሽሮቹ የተመረጡ መንፈሳዊ የሰርግ መዝሙራትና ባህላዊ የሙሽራ መግቢያ ዜማዎች።",
      "nowPlaying": "አሁን የሚደመጠው",
      "playTrack": "አጫውት",
      "pauseTrack": "አቁም"
    },
    "wishes": {
      "badge": "ምርቃትና የእንኳን ደስ አላችሁ መልእክቶች",
      "title": "የሰርግ ምርቃትና የመልካም ምኞት ማህደር",
      "subtitle": "ከልብ የመነጨ ምርቃትዎን፣ ጸሎትዎን ወይም የቪዲዮ ሰላምታዎን በቀጥታ ለሙሽሮቹ ያበርክቱ።",
      "tabText": "የጽሑፍ ምርቃት",
      "tabVideo": "የቪዲዮ ምርቃት 📹",
      "senderName": "ሙሉ ስምዎ *",
      "senderPlaceholder": "ለምሳሌ፡ አጎት በቀለ እና ቤተሰብ",
      "messageLabel": "የተባረከ ምርቃትዎ *",
      "messagePlaceholder": "ለሙሽሮቹ መልካም ምኞትዎንና ጸሎትዎን እዚህ ይጻፉ...",
      "videoUrlLabel": "የቪዲዮ ምርቃት ማያያዣ ወይም ቪዲዮ ይምረጡ",
      "chooseVideoDevice": "የቪዲዮ ምርቃት ከስልክዎ ይምረጡ",
      "submitButton": "ምርቃትዎን ለሙሽሮቹ ላኩ 💍",
      "sendingButton": "ምርቃትዎ በመላክ ላይ...",
      "successMsg": "ምርቃትዎ በቀጥታ ለሙሽሮቹ ደርሷል! እናመሰግናለን።",
      "emptyWall": "የመጀመሪያው መራቂ በመሆን ለሙሽሮቹ ምርቃትዎን ያበርክቱ!"
    },
    "qrPass": {
      "badge": "ዲጂታል የመግቢያ ፈቃድ",
      "title": "የሰርግ የክብር መግቢያ QR ፓስፖርት",
      "subtitle": "እባክዎን ወደ ሰርግ አዳራሽ ሲገቡ ይህንን ለርስዎ የተዘጋጀ ልዩ የQR ኮድ ለበራፊ ጥበቃ ያሳዩ።",
      "vipEntry": "የክብር እንግዳ መግቢያ",
      "quotaAllowed": "የተፈቀደ የሰው ብዛት",
      "scanInstructions": "በሸራተን አዲስ ዋና በር ላይ ያስመርምሩ",
      "downloadPass": "የመግቢያ ፈቃዱን በምስል አውርድ",
      "printPass": "የመግቢያ ፈቃዱን አትም"
    }
  },
  "feed": {
    "title": "የሰርግ ትዝታ ቪዲዮዎች",
    "sharedBy": "የተጋራው በ",
    "comments": "አስተያየቶች",
    "addComment": "መልካም አስተያየት ያክሉ...",
    "postComment": "ላክ",
    "doubleTapLike": "ለመውደድ ሁለት ጊዜ ይጫኑ",
    "uploadMoments": "የትዝታ ቪዲዮ ይስቀሉ",
    "uploadTitle": "የሰርግ ትዝታዎችን ያጋሩ",
    "uploaderName": "ስምዎ *",
    "captionLabel": "መግለጫ / መልእክት *",
    "chooseMedia": "ቪዲዮ ከስልክዎ ይምረጡ",
    "publishButton": "ለሰርግ ቪዲዮዎች አጋራ 🚀",
    "publishing": "በመጫን ላይ...",
    "emptyFeed": "እስካሁን የተጫነ ቪዲዮ የለም። የመጀመሪያው ይሁኑ!"
  },
  "coupleDashboard": {
    "header": {
      "badge": "የሙሽሮች ማዕከል",
      "title": "የሙሽሮች የግል ሰርግ መቆጣጠሪያ",
      "guestsAttending": "የሚመጡ እንግዶች"
    },
    "tabs": {
      "setup": "0. የሰርግ መረጃ እና ማስተካከያ",
      "invites": "1. የእንግዶች ጥሪ እና QR መግቢያ",
      "staff": "2. የአዘጋጆች እና አጋዦች ድርሻ",
      "media": "3. የተቀበሏቸው ቪዲዮዎችና ፎቶዎች",
      "broadcast": "4. የሰርጉ ቀን የቀጥታ ማስታወቂያ",
      "thankYou": "5. ከሰርግ በኋላ የምስጋና መልእክት"
    },
    "setup": {
      "title": "የሰርግ ዋና መረጃዎች ማስተካከያ",
      "subtitle": "የሁለታችሁንም ስም፣ ውብ ፎቶአችሁን፣ የሰርጉን ቦታ እና ቀን በማስገባት ገጻችሁን ያደምቁ።",
      "platformActive": "ሲስተሙ ክፍት ነው",
      "brideName": "የሙሽሪት ሙሉ ስም *",
      "groomName": "የሙሽራው ሙሉ ስም *",
      "photoLabel": "የሙሽሮች ውብ ፎቶ (ከስልክዎ ይምረጡ) *",
      "photoHelp": "ከፍተኛ ጥራት ያለው PNG ወይም JPG ፎቶ ይምረጡ",
      "photoPrompt": "የሙሽሮችን ፎቶ ለማስገባት እዚህ ይጫኑ",
      "venueName": "የሰርጉ አዳራሽ ስም *",
      "venueAddress": "የአዳራሹ አድራሻ *",
      "mapLink": "የጉግል ካርታ (Google Maps) ሊንክ",
      "eventDate": "የሰርጉ ቀን *",
      "startTime": "የሰርጉ መበገሻ ሰዓት *",
      "dressCode": "የአለባበስ ስታይል (Dress Code)",
      "welcomeMsg": "ለእንግዶች የተላለፈ የእንኳን ደህና መጣችሁ መልእክት",
      "saveBtn": "መረጃዎችን መዝግብና አድስ 💍",
      "savingBtn": "በመመዝገብ ላይ...",
      "successMsg": "የሰርጋችሁ መረጃ በተሳካ ሁኔታ ታድሷል!"
    },
    "invites": {
      "kpiTotal": "ጠቅላላ የተጋበዙ",
      "kpiAttending": "የሚመጡ እንግዶች",
      "kpiPending": "ያልወሰኑ",
      "kpiDeclined": "የማይመጡ",
      "genTitle": "አዲስ የእንግዳ ጥሪ ማዘጋጃ",
      "genSubtitle": "ለወረቀት ካርድ የሚሆን ልዩ የQR ኮድ ወይም በቀጥታ የሚላክ ዲጂታል ሊንክ ያዘጋጁ።",
      "modeCard": "1) ለታተመ ካርድ QR",
      "modeLink": "2) የቀጥታ ዲጂታል ሊንክ",
      "guestName": "የእንግዳው / የቤተሰቡ ስም *",
      "quota": "የተፈቀደ የሰው ብዛት *",
      "phone": "ስልክ ቁጥር (አማራጭ)",
      "genCardBtn": "የሚታተም የQR መግቢያ ፈቃድ አዘጋጅ",
      "genLinkBtn": "ልዩ ዲጂታል ሊንክ አዘጋጅ",
      "tableTitle": "የተጋበዙ እንግዶች ዝርዝር",
      "tableSubtitle": "የእንግዶችን ምላሽና የመግቢያ ፈቃድ ይከታተሉ።",
      "thGuest": "እንግዳ / ቤተሰብ",
      "thType": "የጥሪው አይነት",
      "thQuota": "ብዛት",
      "thRsvp": "የመገኘት ምላሽ",
      "thGate": "በበር ላይ ያለ ሁኔታ",
      "thActions": "እርምጃዎች",
      "attending": "ይገኛሉ",
      "declined": "አይመጡም",
      "pendingRsvp": "ምላሽ ይጠበቃል",
      "checkedIn": "ገብተዋል",
      "awaitingGate": "በር ላይ አልደረሱም",
      "viewQr": "QR ይመልከቱ"
    },
    "staff": {
      "title": "የሰርግ አጋዦችና ሰራተኞች ድርሻ",
      "subtitle": "ለቀጥታ ስርጭት አስተላላፊዎች እና ለበር ተቆጣጣሪዎች መግቢያ ፈቃድ ይስጡ።",
      "fullName": "የሰራተኛው ሙሉ ስም *",
      "email": "ኢሜይል / መግቢያ *",
      "password": "ጊዜያዊ የይለፍ ቃል *",
      "role": "የተሰጠው ድርሻ *",
      "roleStreamer": "📹 1) የቀጥታ ስርጭት አስተላላፊ",
      "roleScanner": "📱 2) የበር QR ተቆጣጣሪ",
      "assignBtn": "ድርሻውን ስጥ",
      "activeCrew": "የተመደቡ ሰራተኞች",
      "openPortal": "ክፈት",
      "revokeRole": "ሰርዝ"
    },
    "media": {
      "title": "የተቀበሏቸው ቪዲዮዎችና የምርቃት ማህደር",
      "subtitle": "በእንግዶች የተላኩ የትዝታ ቪዲዮዎችንና ምርቃቶችን መዝግበው ያጽድቁ።",
      "tabAll": "ሁሉም",
      "tabPosted": "🟢 የጸደቁ",
      "tabPending": "🟡 የሚጠበቁ",
      "tabRejected": "🔴 የተሰረዙ",
      "approve": "አጽድቅ",
      "reject": "ሰርዝ",
      "empty": "በዚህ ምድብ ምንም ፋይል የለም።"
    },
    "broadcast": {
      "title": "የሰርጉ ቀን የቀጥታ ማስታወቂያ ለእንግዶች",
      "subtitle": "የመርሃ ግብር ለውጦችንና የደስታ ማስታወቂያዎችን በቀጥታ በሰርጉ ገጽ ላይ ያስተላልፉ።",
      "label": "የማስታወቂያ መልእክት",
      "previewTitle": "የማስታወቂያው ገጽታ",
      "publishBtn": "ማስታወቂያውን ለእንግዶች አስተላልፍ",
      "publishingBtn": "በማስተላለፍ ላይ...",
      "successMsg": "ማስታወቂያው በሰርጉ ገጽ ላይ በቀጥታ ተላልፏል!"
    },
    "thankYou": {
      "title": "ከሰርግ በኋላ የምስጋና መልእክት ማህደር",
      "subtitle": "ከሰርጉ ፍጻሜ በኋላ ለታደሙት እንግዶች በሙሉ የከበረ የምስጋና መልእክት አስተላልፉ።",
      "messageLabel": "ይፋዊ የምስጋና መልእክት",
      "photoLabel": "የምስጋና ፎቶ (ከስልክዎ ይምረጡ)",
      "photoPrompt": "የምስጋና ፎቶ ለማስገባት እዚህ ይጫኑ",
      "sendBtn": "የምስጋና መልእክቱን አስተላልፍ 💌",
      "sendingBtn": "በማስተላለፍ ላይ...",
      "successMsg": "የምስጋና መልእክቱ ለእንግዶች በሙሉ ተላልፏል!"
    }
  },
  "organizerDashboard": {
    "brand": "አጋፋሪ ፕላነርስ",
    "subtitle": "የሰርግ አዘጋጆች ማዕከል",
    "kpiHosting": "በስራ ላይ ያሉ",
    "kpiArchive": "የተጠናቀቁ ሰርጎች",
    "tabs": {
      "weddings": "1. የሚመሩ ሰርጎች",
      "credentials": "2. የሙሽሮች መግቢያ እና ፈቃድ",
      "media": "3. የቪዲዮዎችና ፎቶዎች ቁጥጥር"
    },
    "header": {
      "tag": "የሰርግ አዘጋጆች መቆጣጠሪያ ኮንሶል",
      "title": "የሚመሩ ሰርጎች ማዕከል",
      "requestBtn": "ለሙሽሮች መግቢያ ፈቃድ ጠይቅ"
    },
    "fleet": {
      "all": "ሁሉም ሰርጎች",
      "active": "🟢 በስራ ላይ ያሉ",
      "archive": "📜 የተጠናቀቁ ሰርጎች",
      "pending": "⏳ ፈቃድ የሚጠብቁ",
      "searchPlaceholder": "ሰርግ፣ ሙሽራ ወይም ቦታ ፈልግ...",
      "selectedRoom": "የተመረጠው የሰርግ መቆጣጠሪያ",
      "adminStatus": "የፈቃድ ሁኔታ",
      "roleCredentialsTitle": "የተመደቡ ድርሻዎች እና ቀጥታ መግቢያዎች",
      "roleCredentialsSubtitle": "የተፈለገውን ድርሻ በመጫን በቀጥታ ወደ ሰራተኛው መቆጣጠሪያ ይግቡ፡",
      "coupleRole": "👑 1) ሙሽሮች",
      "coupleDesc": "ሙሉ የሰርግ መቆጣጠሪያ፣ የእንግዶች ጥሪና ማስታወቂያ።",
      "launchCouple": "ወደ ሙሽሮች መቆጣጠሪያ ግባ",
      "copyCouple": "የሙሽሮችን መግቢያ ቅዳ",
      "streamerRole": "📹 2) የቀጥታ ስርጭት አስተላላፊ",
      "streamerDesc": "የቀጥታ ስርጭት እና የካሜራ ቁጥጥር።",
      "launchStreamer": "ወደ ስርጭት ስቱዲዮ ግባ",
      "copyStreamer": "የስርጭት መግቢያ ቅዳ",
      "scannerRole": "📱 3) የበር QR ተቆጣጣሪ",
      "scannerDesc": "በበር ላይ የQR ኮድ ምርመራ እና የእንግዶች ቁጥጥር።",
      "launchScanner": "ወደ በር ተቆጣጣሪ ግባ",
      "copyScanner": "የተቆጣጣሪ መግቢያ ቅዳ"
    },
    "credentials": {
      "title": "ለሙሽሮች መግቢያ ፈቃድ መጠየቂያ",
      "subtitle": "የሰርጉን መረጃ በመሙላት ከሲስተም አስተዳዳሪው ፈቃድ ያግኙ።",
      "brideName": "የሙሽሪት ሙሉ ስም *",
      "groomName": "የሙሽራው ሙሉ ስም *",
      "email": "የሙሽሮች ኢሜይል (ለስርዓቱ መግቢያ ይሆናል) *",
      "date": "የሰርጉ ቀን *",
      "venue": "የሰርጉ ቦታ / አዳራሽ *",
      "submitBtn": "ፈቃድ ጠይቅና መግቢያ አዘጋጅ 💍",
      "submittingBtn": "በመላክ ላይ...",
      "successTitle": "የሙሽሮች መግቢያ በተሳካ ሁኔታ ተዘጋጅቷል!",
      "trackerTitle": "የፈቃዶችና መግቢያዎች መከታተያ"
    }
  },
  "adminDashboard": {
    "brand": "ሐመልማል ክሬቲቭስ",
    "subtitle": "የሲስተም ዋና አስተዳዳሪ",
    "kpiPending": "ፈቃድ የሚጠብቁ",
    "kpiActive": "በስራ ላይ ያሉ ሰርጎች",
    "tabs": {
      "approvals": "1. ፈቃዶችና ማረጋገጫዎች",
      "events": "2. የሰርጎች አጠቃላይ ዝርዝር",
      "organizers": "3. የሰርግ አዘጋጅ ድርጅቶች",
      "users": "4. የሲስተም ተጠቃሚዎች",
      "media": "5. አጠቃላይ የቪዲዮ ማህደር"
    },
    "header": {
      "tag": "የፕላትፎርም ዋና መቆጣጠሪያ ኮንሶል",
      "title": "የሲስተም ዋና አስተዳዳሪ ማዕከል",
      "createBtn": "አዲስ ሰርግ በቀጥታ ፈቅደህ ክፈት"
    },
    "approvals": {
      "title": "ፈቃድ የሚጠብቁ አዳዲስ የሰርግ ጥያቄዎች",
      "subtitle": "ከአዘጋጆች የቀረቡ የሰርግ ጥያቄዎችን መርምረው ያጽድቁ።",
      "approveBtn": "ፈቅደህ አጽድቅ 🟢",
      "rejectBtn": "ጥያቄውን ውድቅ አድርግ",
      "approvedTableTitle": "የጸደቁና በስራ ላይ ያሉ ሰርጎች ዝርዝር",
      "openCommand": "ወደ መቆጣጠሪያው ግባ →"
    },
    "fleet": {
      "title": "የሰርጎች አጠቃላይ መቆጣጠሪያና ድርሻዎች",
      "startStream": "የስርጭት ሞካሪ አስጀምር",
      "streamLive": "🔴 ስርጭት በቀጥታ ላይ ነው",
      "rolesTitle": "የተለያዩ ድርሻዎችን በመወከል የመግባት ቁጥጥር"
    },
    "agencies": {
      "title": "አዲስ የሰርግ አዘጋጅ ድርጅት መዝግብ",
      "subtitle": "ለሙያተኛ የሰርግ አዘጋጆች የሲስተሙን መግቢያ ፈቃድ ይስጡ።",
      "agencyName": "የድርጅቱ ስም *",
      "contactEmail": "የድርጅቱ ኢሜይል (ለስርዓቱ መግቢያ ይሆናል) *",
      "password": "ጊዜያዊ የይለፍ ቃል *",
      "onboardBtn": "አዘጋጅ ድርጅቱን መዝግብና ፈቃድ ስጥ 🤝",
      "listTitle": "የተመዘገቡ አዘጋጅ ድርጅቶች"
    },
    "users": {
      "title": "የተጠቃሚዎች ማህደር እና የደህንነት ቁጥጥር",
      "subtitle": "የተጠቃሚዎችን ድርሻ ይቆጣጠሩ፣ የይለፍ ቃል ይቀይሩ።",
      "resetPassword": "የይለፍ ቃል ቀይር",
      "newPassword": "አዲስ ጊዜያዊ የይለፍ ቃል *",
      "updatePasswordBtn": "የይለፍ ቃል አድስ"
    }
  },
  "scanner": {
    "title": "አጋፋሪ የበር መቆጣጠሪያ ጽንሰ-ሀሳብ",
    "subtitle": "የQR መግቢያ ፈቃድ እና የእንግዶች ቁጥጥር",
    "inputPlaceholder": "የመግቢያ ኮድ ያስገቡ (ለምሳሌ፡ INV-SD2026-001)...",
    "verifyBtn": "ኮዱን መርምር",
    "validPass": "ትክክለኛ የክብር እንግዳ ጥሪ",
    "alreadyScanned": "መግባት አይቻልም፡ ቀደም ሲል ገብተዋል",
    "invalidPass": "ያልታወቀ የመግቢያ ኮድ",
    "checkInBtn": "አረጋግጠህ እንግዶቹን አስገባ ✓",
    "checkedInSuccess": "እንግዶቹ በተሳካ ሁኔታ ገብተዋል!"
  },
  "auth": {
    "coupleTitle": "የሙሽሮች መቆጣጠሪያ",
    "coupleSubtitle": "የሙሽሮች የግል ሰርግ መቆጣጠሪያ ማዕከል",
    "organizerTitle": "የሰርግ አዘጋጆች መቆጣጠሪያ",
    "organizerSubtitle": "የሰርግ ማደራጃና መምሪያ ኮንሶል",
    "adminTitle": "የሲስተም ዋና አስተዳዳሪ",
    "adminSubtitle": "የሐመልማል ክሬቲቭስ ፕላትፎርም አስተዳዳሪ",
    "emailLabel": "ኢሜይል አድራሻ",
    "passwordLabel": "የይለፍ ቃል",
    "signInBtn": "ወደ መቆጣጠሪያው ግባ",
    "signingIn": "በመግባት ላይ...",
    "invalidCreds": "የተሳሳተ ኢሜይል ወይም የይለፍ ቃል!"
  },
  "landing": {
    "nav": {
      "features": "አገልግሎቶች",
      "partners": "አጋሮች",
      "packages": "ፓኬጆች",
      "liveDemo": "የቀጥታ ማሳያ",
      "pastWeddings": "የተደረጉ ሰርጎች",
      "aboutUs": "ስለ እኛ",
      "bookWedding": "ሰርግዎን ይመዝግቡ",
      "exploreCelebration": "ይፋዊ ሰርግ ይመልከቱ"
    },
    "hero": {
      "badge": "የኢትዮጵያ ቀዳሚው የንግሥና የዲጂታል ሰርግ ፕላትፎርም",
      "titlePart1": "የሰርግዎን ደስታ ወደ ተዋበ",
      "titlePart2": "ዘላለማዊ የዲጂታል ትዝታ ይለውጡ",
      "description": "ከተቀደሱ ቀን መቁጠሪያዎች እና በደህንነት ከተጠበቁ የQR መግቢያ ፈቃዶች ጀምሮ እስከ ቀጥታ ስርጭት እና የትዝታ ቪዲዮዎች — አጋፋሪ እንግዶችዎን በየትኛውም የዓለም ጥግ ያገናኛል።",
      "ctaDemo": "የቀጥታ ማሳያውን ይሞክሩ",
      "ctaPackages": "የአገልግሎት ፓኬጆችን ይመልከቱ",
      "feature1": "ምንም አፕሊኬሽን ማውረድ አያስፈልግም",
      "feature2": "በደህንነት የተጠበቀ የQR መግቢያ",
      "feature3": "በሙሽሪት የሚጸድቁ ትዝታዎች",
      "feature4": "በወቅቱ የቀጥታ ስርጭት"
    },
    "featuresSection": {
      "badge": "የኢትዮጵያ ዘመናዊ የሰርግ ቴክኖሎጂ",
      "title": "ለሰርጋችሁ ድምቀት",
      "titleScript": "የሚያስፈልጉ",
      "titleEnd": "ሁሉንም ነገሮች",
      "description": "ከተቀደሱ ቀን መቁጠሪያዎች፣ ከደህንነታቸው ከተጠበቁ የQR መግቢያዎች፣ ከትዝታ ቪዲዮዎች እና ከዓለም አቀፍ የቀጥታ ስርጭት ጋር የተሳሰረ ዘመናዊ አሰራር።",
      "marqueeHint": "ለማቆም ማውዝዎን ያንዣብቡ",
      "card1Title": "የቀን መቁጠሪያና የምርቃት ማህደር",
      "card1Badge": "የቀን መቁጠሪያ",
      "card1Desc": "የሰርጉን ቀን የሚቆጥር ሰዓት እና የእንግዶች ምርቃት ማሰባሰቢያ። ምርቃቶች በሙሽሮቹ ከተረጋገጡ በኋላ በግድግዳው ላይ ይታያሉ።",
      "card1Btn": "የቀን መቁጠሪያውን ይመልከቱ",
      "card2Title": "የዲጂታል ጥሪና የQR መግቢያ",
      "card2Badge": "የደህንነት ቁጥጥር",
      "card2Desc": "ያልተጋበዘ ሰው እንዳይገባ ለመቆጣጠር እና የተፈቀደውን የሰው ብዛት በደህንነት ለማረጋገጥ የተዘጋጀ ዘመናዊ የQR ኮድ።",
      "card2Btn": "የበር መቆጣጠሪያውን ይሞክሩ",
      "card3Title": "የትዝታ ቪዲዮዎችና የቀጥታ ስርጭት",
      "card3Badge": "ዓለም አቀፍ ስርጭት",
      "card3Desc": "በእንግዶች የሚሰቀሉ የትዝታ ቪዲዮዎች ማህደር እና በዓለም ዙሪያ ለሚገኙ ዘመዶች የሚተላለፍ የቀጥታ የቪዲዮ ስርጭት።",
      "card3Btn": "የትዝታ ቪዲዮዎችን ይመልከቱ"
    },
    "partnersSection": {
      "badge": "በኢትዮጵያ ታዋቂ ሆቴሎችና አዳራሾች የታመነ",
      "title": "አጋር ሆቴሎቻችንና አዳራሾቻችን",
      "sheraton": "ሸራተን አዲስ",
      "sheratonType": "የንግሥና አዳራሽ አጋር",
      "haile": "ኃይሌ ግራንድ አዲስ",
      "haileType": "የሪዞርትና የሜዳ አዳራሽ አጋር",
      "skylight": "ኢትዮጵያ ስካይላይት ሆቴል",
      "skylightType": "የታላቁ አዳራሽ አጋር",
      "radisson": "ራዲሰን ብሉ",
      "radissonType": "የክብር እንግዶች አጋር",
      "kuriftu": "ኩሪፍቱ ሪዞርት",
      "kuriftuType": "የሪዞርት ሰርግ አጋር",
      "yegara": "የጋራ ሆስቲንግ",
      "yegaraType": "የፈጣን ሲስተም መዋቅር"
    },
    "packagesSection": {
      "badge": "የአገልግሎት ፓኬጆች",
      "title": "ለእርስዎ የተዘጋጁ የአገልግሎት አማራጮች",
      "description": "የሚፈልጉትን ፓኬጅ ይምረጡ። ሐመልማል ክሬቲቭስ ቴክኒካዊ ስራዎችን በሙሉ ያከናውናል።",
      "silverTitle": "ሲልቨር ፓኬጅ (Silver)",
      "silverTag": "መሰረታዊ",
      "silverDesc": "ለተመረጡ የዲጂታል ጥሪዎችና ለቀን መቁጠሪያ ተስማሚ።",
      "silverF1": "የሰርግ ቀን መቁጠሪያ ገጽ",
      "silverF2": "ዲጂታል የጥሪ ካርድና የእንግዶች መከታተያ",
      "silverF3": "የምርቃትና የጸሎት ግድግዳ (በሙሽሮች ቁጥጥር)",
      "silverBtn": "ስለ ሲልቨር ፓኬጅ ይጠይቁ",
      "goldTitle": "ጎልድ የንግሥና ፓኬጅ (Gold)",
      "goldTag": "የተመከረ",
      "goldBadge": "በጣም የተወደደ አማራጭ",
      "goldDesc": "የትዝታ ቪዲዮዎችን፣ የQR መግቢያ ቁጥጥርንና የቀጥታ ስርጭትን ያካተተ ሙሉ አገልግሎት።",
      "goldF1": "በሲልቨር ፓኬጅ ውስጥ ያሉ ሁሉም አገልግሎቶች",
      "goldF2": "የበር የQR መግቢያ ቁጥጥርና የሰው ብዛት መወሰኛ",
      "goldF3": "የትዝታ ቪዲዮዎችና ፎቶዎች መስቀያ ማህደር",
      "goldF4": "በወቅቱ የቀጥታ ስርጭት እና አስተያየቶች",
      "goldBtn": "ጎልድ የንግሥና ፓኬጅን ይዘዙ",
      "platTitle": "ፕላቲነም ፓኬጅ (Platinum)",
      "platTag": "ሙሉ አገልግሎት",
      "platDesc": "ለታላላቅ የንግሥና ሰርጎች ከአካል ሰራተኞችና ከቀጥታ ስቱዲዮ ጋር የተዘጋጀ።",
      "platF1": "በጎልድ ፓኬጅ ውስጥ ያሉ ሁሉም አገልግሎቶች",
      "platF2": "በሰርጉ ቦታ የሚመደብ የቀጥታ ስርጭት ባለሙያ",
      "platF3": "በሰርጉ በር ላይ የሚመደቡ የQR መቆጣጠሪያ ሰራተኞች",
      "platBtn": "ስለ ፕላቲነም ፓኬጅ ይጠይቁ"
    },
    "demoSection": {
      "badge": "የሰርግ የቀጥታ ማሳያ",
      "title": "አጋፋሪ በስራ ላይ እያለ በቀጥታ ይመልከቱ",
      "description": "የመግቢያ ቁጥጥርንና የቀጥታ ስርጭቱን በአንድ ጠቅታ ይሞክሩ!",
      "tab1": "1. ዋና ገጽ",
      "tab2": "2. ዲጂታል ጥሪና QR መግቢያ",
      "tab3": "3. የትዝታ ቪዲዮዎች",
      "tab4": "4. በቀጥታ ስርጭት ላይ",
      "tab5": "5. የበር ተቆጣጣሪ",
      "pill1": "የቀን መቁጠሪያና የምርቃት ግድግዳ",
      "title1": "ዋና ገጽ (የቀን መቁጠሪያ)",
      "desc1": "የሰርጉ ቀን መቁጠሪያ፣ የአዳራሹ አድራሻ፣ የአለባበስ ስታይልና የምርቃት መስቀያ።",
      "btn1": "ዋናውን ገጽ ክፈት",
      "pill2": "በደህንነት የተጠበቀ የQR መግቢያ",
      "title2": "ዲጂታል ጥሪና QR መግቢያ",
      "desc2": "የዲጂታል ካርድ አከፋፈት፣ የQR መግቢያ ፈቃድና የተፈቀደ የሰው ብዛት መቆጣጠሪያ።",
      "btn2": "የዲጂታል ጥሪውን ይመልከቱ",
      "pill3": "በሙሽሮች የሚጸድቅ የቪዲዮ ማህደር",
      "title3": "የትዝታ ቪዲዮዎች",
      "desc3": "በእንግዶች የሚሰቀሉ ውብ የትዝታ ቪዲዮዎችና የመልካም ምኞት መግለጫዎች።",
      "btn3": "የትዝታ ቪዲዮዎችን ይመልከቱ",
      "pill4": "ዓለም አቀፍ የቀጥታ ስርጭት",
      "title4": "በቀጥታ ስርጭት ላይ",
      "desc4": "በዓለም ዙሪያ ለሚገኙ ዘመዶችና ወዳጆች የሚተላለፍ ፈጣን የቀጥታ ስርጭት።",
      "btn4": "የቀጥታ ስርጭቱን ይመልከቱ",
      "pill5": "የበር ተቆጣጣሪ ሰራተኛ በስራ ላይ",
      "title5": "የበር መቆጣጠሪያ መተግበሪያ",
      "desc5": "በበር ተቆጣጣሪዎች የሚጠቀም የQR ኮድ መመርመሪያና ያልተጋበዘ ሰው መቆጣጠሪያ።",
      "btn5": "የበር መቆጣጠሪያውን ይሞክሩ"
    },
    "portfolioSection": {
      "badge": "የተደረጉ ሰርጎች ማህደር",
      "title": "በአጋፋሪ የደመቁ የሰርግ ትዝታዎች",
      "description": "ሙሽሮችና እንግዶች በአጋፋሪ ያገኙትን የደስታ ተሞክሮ ይመልከቱ።",
      "card1Couple": "ሳራ እና ዳዊት",
      "card1Venue": "ሸራተን አዲስ የንግሥና አዳራሽ",
      "card1Type": "የንግሥና ሰርግ",
      "card1Quote": "\"በአሜሪካና በአውሮፓ የሚገኙ ዘመዶቻችን ሰርጋችንን በሙሉ በቀጥታ ስርጭት ተከታተሉ። የምርቃት ግድግዳው በጣም ልብ የሚነካ ነበር!\"",
      "card2Couple": "ማርታ እና አቤል",
      "card2Venue": "ኃይሌ ግራንድ ሜዳ አዳራሽ",
      "card2Type": "የሜዳ ሰርግ",
      "card2Quote": "\"የQR መግቢያው ያልተጋበዘ ሰው እንዳይገባ አድርጎልናል። በበር ላይ እንግዶችን ለማስተናገድ 3 ሰከንድ ብቻ ነበር የፈጀው!\"",
      "card3Couple": "ትግስት እና ሄኖክ",
      "card3Venue": "ኢትዮጵያ ስካይላይት ሆቴል",
      "card3Type": "ባህላዊ የንግሥና ሰርግ",
      "card3Quote": "\"ከሰርጋችን በኋላ በእንግዶች የተሰቀሉትን የትዝታ ቪዲዮዎች መመልከት የብሩህ አእምሮ ደስታ ሰጥቶናል!\"",
      "verified": "የተረጋገጠ ሰርግ"
    },
    "aboutSection": {
      "badge": "በሐመልማል ክሬቲቭስ የተገነባ",
      "title": "የኢትዮጵያን የሰርግ ባህል በቴክኖሎጂ ማሳደግ",
      "description": "ሐመልማል ክሬቲቭስ በኢትዮጵያ ቀዳሚ የሆነ የሶፍትዌርና የሚዲያ ተቋም ሲሆን፣ ዘመናዊ የዲጂታል ሰርግ አሰራሮችንና የቴክኖሎጂ ውጤቶችን ያቀርባል።",
      "visitBtn": "የሐመልማል ክሬቲቭስ ይፋዊ ድረ-ገጽን ይጎብኙ",
      "card1Title": "የላቀ የቴክኖሎጂ ጥራት",
      "card1Desc": "በከፍተኛ Next.js ቴክኖሎጂ የተገነባ፣ የQR ደህንነት ቁጥጥርና ፈጣን የቀጥታ ስርጭት ያለው።",
      "card1Stat1": "99.9%",
      "card1Label1": "የሲስተም አስተማማኝነት",
      "card1Stat2": "< 3 ሰከንድ",
      "card1Label2": "የመግቢያ ኮድ ምርመራ",
      "card2Title": "ሙሉ የአካል ቴክኒክ አገልግሎት",
      "card2Desc": "የእኛ ባለሙያዎች በሰርጋችሁ ቀን ስርጭቱንና የበር ቁጥጥርን ሙሉ በሙሉ ያከናውናሉ።",
      "card2Stat1": "100%",
      "card2Label1": "በሙሽሪት የሚጸድቅ",
      "card2Stat2": "ዓለም አቀፍ",
      "card2Label2": "የስርጭት ተደራሽነት"
    },
    "footer": {
      "brandDesc": "የኢትዮጵያ ቀዳሚው የንግሥና የዲጂታል ሰርግ ፕላትፎርም፤ በዓለም ዙሪያ የሚገኙ ዘመዶችንና ወዳጆችን በቴክኖሎጂ ያገናኛል።",
      "visitParent": "እናት ድርጅትን ይጎብኙ፡ ሐመልማል ክሬቲቭስ",
      "colFeatures": "የፕላትፎርሙ አገልግሎቶች",
      "f1": "ዲጂታል ጥሪና የQR መግቢያ",
      "f2": "የቀን መቁጠሪያ ሰዓት",
      "f3": "የትዝታ ቪዲዮዎች",
      "f4": "በወቅቱ የቀጥታ ስርጭት",
      "colResources": "መረጃዎችና ደህንነት",
      "faq": "ተደጋግመው የሚጠየቁ ጥያቄዎች (FAQ)",
      "privacy": "የደህንነትና የመረጃ ጥበቃ ፖሊሲ",
      "packages": "የአገልግሎት ፓኬጆችና ዋጋ",
      "partners": "አጋር ሆቴሎችና አዳራሾች",
      "demo": "የቀጥታ ማሳያ ገጽ",
      "colContact": "ግንኙነትና ድጋፍ",
      "address": "አዲስ አበባ፣ ኢትዮጵያ",
      "copyright": "አጋፋሪ ዲጂታል ፕላትፎርም © 2026 ሐመልማል ክሬቲቭስ። መብቱ በህግ የተጠበቀ ነው።",
      "ssl": "በከፍተኛ ደህንነት የተጠበቀ"
    },
    "mobileNav": {
      "features": "አገልግሎቶች",
      "packages": "ፓኬጆች",
      "demo": "የቀጥታ ማሳያ",
      "weddings": "ሰርጎች",
      "about": "ስለ እኛ"
    },
    "faqModal": {
      "title": "ተደጋግመው የሚጠየቁ ጥያቄዎች (FAQ)",
      "subtitle": "ስለ አጋፋሪ የሰርግ ቴክኖሎጂ ማወቅ የሚፈልጉትን ሁሉ እዚህ ያገኛሉ።",
      "q1": "የሰርጉ እንግዶች ዲጂታል ጥሪያቸውን እንዴት ያገኛሉ?",
      "a1": "ሙሽሮቹ ወይም አዘጋጆቹ ልዩ የዲጂታል ሊንክ ለቪአይፒ እንግዶች ይልካሉ። እንግዶቹ ምንም አይነት አፕሊኬሽን ሳያወርዱ ሊንኩን በመጫን የሰርጉን መረጃና የQR መግቢያቸውን ያገኛሉ።",
      "q2": "የQR መግቢያው ያልተጋበዘ ሰው እንዳይገባ እንዴት ይከላከላል?",
      "a2": "እያንዳንዱ የQR ኮድ ለተወሰነ የሰው ብዛት ብቻ የተፈቀደ በመሆኑ በበር ተቆጣጣሪው ከተቃኘ በኋላ በድጋሚ በፎቶኮፒ ወይም በስክሪንሾት መጠቀም አይቻልም።",
      "q3": "ሙሽሮቹ እንግዶች የላኳቸውን ፎቶዎችና ቪዲዮዎች መርጠው ማጽደቅ ይችላሉ?",
      "a3": "አዎ! በእንግዶች የሚላኩ ፎቶዎችና ቪዲዮዎች በሙሉ መጀመሪያ ወደ ሙሽሮች የግል መቆጣጠሪያ ይገባሉ። ሙሽሮቹ ያጸደቋቸው ብቻ ይፋ ይሆናሉ።",
      "q4": "በውጭ አገር ለሚገኙ ዘመዶች የቀጥታ ስርጭት አገልግሎት አላችሁ?",
      "a4": "በእርግጥ። በዓለም ዙሪያ የሚገኙ ቤተሰቦቻችሁ ሰርጋችሁን ያለምንም መዘግየት በቀጥታ ስርጭት መከታተል ይችላሉ።"
    },
    "privacyModal": {
      "title": "የደህንነትና የመረጃ ጥበቃ ፖሊሲ",
      "subtitle": "የሙሽሮችና የእንግዶችን መረጃ በከፍተኛ ደህንነት የመጠበቅ ቃል ኪዳናችን።",
      "p1Title": "1. የተጠበቀ የመረጃ ማህደር፡",
      "p1Text": "በእንግዶች የሚላኩ ፎቶዎችና ቪዲዮዎች በሙሉ በከፍተኛ ደህንነት የተጠበቁ ሆነው ለሙሽሮች ብቻ ክፍት ይሆናሉ።",
      "p2Title": "2. የሙሽሮች የማጽደቅ ስልጣን፡",
      "p2Text": "በሙሽሮቹ ያልጸደቀ ምንም አይነት ቪዲዮ ወይም ፎቶ በይፋዊው ገጽ ላይ አይለጠፍም።",
      "p3Title": "3. የQR መግቢያ መረጃ፡",
      "p3Text": "የመግቢያ ኮዶችና የእንግዶች መረጃዎች ለሶስተኛ ወገን አላማ በፍፁም ተላልፈው አይሰጡም።",
      "p4Title": "4. የመረጃ አጠፋፍ፡",
      "p4Text": "ሙሽሮቹ በፈለጉት ጊዜ ያልተፈለጉ ፎቶዎችንና ቪዲዮዎችን ከሲስተሙ ላይ ሙሉ በሙሉ ማጥፋት ይችላሉ።"
    }
  }
}

```

### File: `frontend/src/locales/en.json`

```json
{
  "common": {
    "save": "Save",
    "saved": "Saved!",
    "cancel": "Cancel",
    "close": "Close",
    "delete": "Delete",
    "edit": "Edit",
    "open": "Open",
    "download": "Download",
    "print": "Print",
    "copy": "Copy",
    "copied": "Copied!",
    "loading": "Loading...",
    "search": "Search...",
    "all": "All",
    "status": "Status",
    "actions": "Actions",
    "yes": "Yes",
    "no": "No",
    "back": "Back",
    "submit": "Submit",
    "submitting": "Submitting...",
    "success": "Success",
    "error": "Error",
    "required": "Required",
    "optional": "Optional",
    "guest": "Guest",
    "guests": "Guests",
    "heads": "heads",
    "offline": "Offline",
    "live": "LIVE",
    "liveNow": "LIVE NOW"
  },
  "nav": {
    "brandTitle": "Agafari",
    "tagline": "The Royal Digital Wedding Experience",
    "couplesPortal": "Couples Portal",
    "organizerPortal": "Organizer Portal",
    "adminPortal": "Admin Portal",
    "signOut": "Sign Out",
    "openPublicPage": "Open Public Celebration Page",
    "memoryFeed": "Memory Feed",
    "wishes": "Wish Wall",
    "liveStream": "Live Stream",
    "schedule": "Schedule",
    "mezmur": "Mezmur & Music",
    "gatePass": "Gate Pass"
  },
  "publicEvent": {
    "hero": {
      "royalWedding": "Royal Wedding Celebration",
      "enterGatePass": "View Your Gate Pass",
      "sendWish": "Send Blessings & Wishes",
      "watchLive": "Watch Live Stream",
      "scrollMemories": "Explore Wedding Memories",
      "announcementFrom": "Announcement from"
    },
    "countdown": {
      "title": "Counting Down to Forever",
      "days": "Days",
      "hours": "Hours",
      "minutes": "Minutes",
      "seconds": "Seconds",
      "today": "Today is the Blessed Wedding Day!"
    },
    "schedule": {
      "badge": "Wedding Day Timeline",
      "title": "Royal Celebration Itinerary",
      "churchCeremony": "Holy Matrimony & Church Blessing",
      "churchDesc": "Sacred crowning ceremony and vows before God and the church community.",
      "photoSession": "Royal Photo & Video Session",
      "photoDesc": "Cherished wedding photography session with bridal party and close family.",
      "grandReception": "Grand Banquet & Cultural Melse",
      "receptionDesc": "Evening cultural banquet, Gursha ceremony, traditional dances, and royal cake cutting."
    },
    "stream": {
      "badge": "Worldwide Live Broadcast",
      "title": "Join Our Holy Matrimony Live",
      "subtitle": "No matter where you are in the world, share in our holy vows, joyous dances, and blessings in real time.",
      "liveBadge": "LIVE BROADCAST",
      "offlineBadge": "OFFLINE — STREAM STARTS SOON",
      "chatNotice": "Live YouTube video stream synchronized worldwide."
    },
    "mezmur": {
      "badge": "Sacred Music & Cultural Songs",
      "title": "Wedding Mezmur & Cultural Playlist",
      "subtitle": "Traditional Ethiopian Orthodox wedding mezmurs and cultural entrance songs.",
      "nowPlaying": "Now Playing",
      "playTrack": "Play",
      "pauseTrack": "Pause"
    },
    "wishes": {
      "badge": "Blessings & Congratulations",
      "title": "Wedding Blessing Wall",
      "subtitle": "Send your heartfelt blessings, prayers, or a video greeting directly to the bride and groom.",
      "tabText": "Text Blessing",
      "tabVideo": "Video Blessing 📹",
      "senderName": "Your Full Name *",
      "senderPlaceholder": "e.g. Uncle Bekele & Family",
      "messageLabel": "Your Heartfelt Blessing *",
      "messagePlaceholder": "Write your heartfelt prayer and blessings for Sara & Dawit...",
      "videoUrlLabel": "Video Blessing URL or Device Video",
      "chooseVideoDevice": "Choose Video Blessing from Device",
      "submitButton": "Send Blessings to Couple 💍",
      "sendingButton": "Sending Blessing...",
      "successMsg": "Your blessing has been sent directly to the bride and groom!",
      "emptyWall": "Be the first to send blessings to the happy couple!"
    },
    "qrPass": {
      "badge": "Digital Entrance Pass",
      "title": "Your Official Wedding Gate Pass",
      "subtitle": "Please present this personalized QR pass at the entrance gate for check-in validation.",
      "vipEntry": "VIP Entry Pass",
      "quotaAllowed": "Persons Admitted",
      "scanInstructions": "Scan at Sheraton Addis Main Gate",
      "downloadPass": "Download Gate Pass Image",
      "printPass": "Print Entrance Pass"
    }
  },
  "feed": {
    "title": "Wedding Memory Feed",
    "sharedBy": "Shared by",
    "comments": "Comments",
    "addComment": "Add a sweet comment...",
    "postComment": "Post",
    "doubleTapLike": "Double-tap to like",
    "uploadMoments": "Upload Your Moments",
    "uploadTitle": "Share Wedding Moments",
    "uploaderName": "Your Name *",
    "captionLabel": "Caption / Memory Note *",
    "chooseMedia": "Choose Photo or Video from Device",
    "publishButton": "Publish to Memory Feed 🚀",
    "publishing": "Uploading...",
    "emptyFeed": "No memory reels uploaded yet. Be the first to share!"
  },
  "coupleDashboard": {
    "header": {
      "badge": "Couples Suite",
      "title": "Private Wedding Control Suite",
      "guestsAttending": "Guests Attending"
    },
    "tabs": {
      "setup": "0. Wedding Details & Setup",
      "invites": "1. Guest Invites & QR Pass",
      "staff": "2. Crew & Role Delegation",
      "media": "3. Received Media & Vault",
      "broadcast": "4. Wedding Day Broadcast",
      "thankYou": "5. Post-Wedding Thank You"
    },
    "setup": {
      "title": "Wedding Essential Information Setup",
      "subtitle": "Enter both your names, couple portrait, location, wedding date/time, and second milestone to launch your wedding hub.",
      "platformActive": "Platform Active",
      "brideName": "Bride's Full Name *",
      "groomName": "Groom's Full Name *",
      "photoLabel": "Best Photo of Couple (Choose from Device) *",
      "photoHelp": "Accepts high-res PNG, JPG, JPEG from your phone gallery or computer",
      "photoPrompt": "Tap or Click to Choose Couple Photo from Your Device",
      "venueName": "Wedding Venue Name *",
      "venueAddress": "Venue Physical Address *",
      "mapLink": "Google Maps Location Link",
      "eventDate": "Wedding Date *",
      "startTime": "Wedding Start Time *",
      "dressCode": "Dress Code & Theme",
      "welcomeMsg": "Welcome Message to Guests",
      "saveBtn": "Save & Update Wedding Celebration 💍",
      "savingBtn": "Saving Setup...",
      "successMsg": "Wedding celebration updated successfully on Agafari!"
    },
    "invites": {
      "kpiTotal": "Total Invitations",
      "kpiAttending": "Attending RSVP",
      "kpiPending": "Pending RSVP",
      "kpiDeclined": "Declined",
      "genTitle": "Generate New Guest Invitation",
      "genSubtitle": "Create encrypted entrance passes for paper cards or generate direct shareable invitation links.",
      "modeCard": "1) Physical Card QR",
      "modeLink": "2) Direct Link",
      "guestName": "Guest / Family Name *",
      "quota": "Headcount Quota (Persons Allowed) *",
      "phone": "Phone Number (Optional)",
      "genCardBtn": "Generate Printable QR Code Pass",
      "genLinkBtn": "Generate Unique Digital Link",
      "tableTitle": "Invited Guest Directory",
      "tableSubtitle": "Track RSVP responses and manage individual pass credentials.",
      "thGuest": "Guest / Family",
      "thType": "Pass Type",
      "thQuota": "Quota",
      "thRsvp": "RSVP Status",
      "thGate": "Gate Status",
      "thActions": "Actions",
      "attending": "Will Attend",
      "declined": "Declined",
      "pendingRsvp": "Pending RSVP",
      "checkedIn": "Checked In",
      "awaitingGate": "Awaiting Gate",
      "viewQr": "View QR"
    },
    "staff": {
      "title": "Assign Wedding Crew Roles",
      "subtitle": "Create secure operational credentials for your Live Streamer and QR Gate Scanners.",
      "fullName": "Staff Full Name *",
      "email": "Staff Email / Login *",
      "password": "Temporary Password *",
      "role": "Assigned Role *",
      "roleStreamer": "📹 1) Live Streamer",
      "roleScanner": "📱 2) QR Gate Scanner",
      "assignBtn": "Assign Role",
      "activeCrew": "Active Wedding Crew",
      "openPortal": "Open Portal",
      "revokeRole": "Revoke Role"
    },
    "media": {
      "title": "Guest Media & Video Blessings Vault",
      "subtitle": "Review, approve, and manage guest photo reels and video blessings.",
      "tabAll": "All",
      "tabPosted": "🟢 Posted",
      "tabPending": "🟡 Pending",
      "tabRejected": "🔴 Vault",
      "approve": "Approve",
      "reject": "Reject",
      "empty": "No media items in this category."
    },
    "broadcast": {
      "title": "Wedding Day Live Broadcast to Guests",
      "subtitle": "Publish schedule updates, entrance gate notifications, and live alerts directly on your celebration hub.",
      "label": "Announcement Message",
      "previewTitle": "Preview of Guest Banner",
      "publishBtn": "Publish Wedding Day Announcement",
      "publishingBtn": "Broadcasting...",
      "successMsg": "Broadcast announcement is now live on the celebration page!"
    },
    "thankYou": {
      "title": "Post-Wedding Thank You Capsule",
      "subtitle": "Send your official note of gratitude and thank you portrait to all guests after the celebration.",
      "messageLabel": "Official Thank You Message",
      "photoLabel": "Thank You Portrait Photo (Choose from Device)",
      "photoPrompt": "Tap or Click to Choose Thank You Portrait from Your Device",
      "sendBtn": "Send Post-Wedding Thank You Capsule 💌",
      "sendingBtn": "Publishing Thank You...",
      "successMsg": "Post-Wedding Thank You published successfully for all guests!"
    }
  },
  "organizerDashboard": {
    "brand": "Agafari Planners",
    "subtitle": "Event Organizer Suite",
    "kpiHosting": "Active Hosting",
    "kpiArchive": "Hosted Archive",
    "tabs": {
      "weddings": "1. Hosted & Active Weddings",
      "credentials": "2. Couple Credentials & Approvals",
      "media": "3. Global Media Moderation"
    },
    "header": {
      "tag": "Event Organizer Control Command",
      "title": "Hosted & Active Weddings Command Center",
      "requestBtn": "Request Couple Credentials"
    },
    "fleet": {
      "all": "All Weddings",
      "active": "🟢 Active Hosting",
      "archive": "📜 Hosted Archive",
      "pending": "⏳ Pending Admin",
      "searchPlaceholder": "Search wedding, couple, venue...",
      "selectedRoom": "Selected Event Command Room",
      "adminStatus": "Admin Status",
      "roleCredentialsTitle": "Assigned Role Credentials & 1-Click Dashboard Portals",
      "roleCredentialsSubtitle": "Click any role card or launch button to navigate directly into that person's operational dashboard:",
      "coupleRole": "👑 1) Couple",
      "coupleDesc": "Full wedding executive control, invitations, and guest broadcast.",
      "launchCouple": "Launch Couples Dashboard",
      "copyCouple": "Copy Couple Credentials",
      "streamerRole": "📹 2) Live Streamer",
      "streamerDesc": "Direct YouTube RTMP live broadcast transmission and camera switching.",
      "launchStreamer": "Launch Live Stream Studio",
      "copyStreamer": "Copy Streamer Credentials",
      "scannerRole": "📱 3) Gate Scanner",
      "scannerDesc": "Encrypted QR token gate check-in and VIP headcount verification.",
      "launchScanner": "Launch Gate Scanner Terminal",
      "copyScanner": "Copy Scanner Credentials"
    },
    "credentials": {
      "title": "Provision Couple Credentials & Request Admin Approval",
      "subtitle": "Submit essential wedding parameters to generate unique Bride & Groom login credentials upon System Admin verification.",
      "brideName": "Bride's Full Name *",
      "groomName": "Groom's Full Name *",
      "email": "Couple Contact Email (Will be their Login) *",
      "date": "Target Wedding Date *",
      "venue": "Venue / Location *",
      "submitBtn": "Request Admin Approval & Generate Credentials 💍",
      "submittingBtn": "Submitting to System Admin...",
      "successTitle": "Couple Credentials Successfully Provisioned!",
      "trackerTitle": "Couple Credentials & License Verification Tracker"
    }
  },
  "adminDashboard": {
    "brand": "Hamelmal Creatives",
    "subtitle": "System Administration",
    "kpiPending": "Pending Approval",
    "kpiActive": "Active Weddings",
    "tabs": {
      "approvals": "1. Licensing & Approvals",
      "events": "2. Global Weddings Fleet",
      "organizers": "3. Organizing Agencies",
      "users": "4. Platform Users & RBAC",
      "media": "5. Global Media Vault"
    },
    "header": {
      "tag": "Platform Master Control",
      "title": "System Admin Command Center",
      "createBtn": "Direct Create & License Wedding"
    },
    "approvals": {
      "title": "Pending Wedding Onboarding Requests",
      "subtitle": "Review organizer onboarding submissions. Approving generates official couple credentials and provisions the wedding on Agafari.",
      "approveBtn": "Approve & Provision License 🟢",
      "rejectBtn": "Reject Request",
      "approvedTableTitle": "Approved Platform Licenses & Active Instances",
      "openCommand": "Open Command Room →"
    },
    "fleet": {
      "title": "Global Weddings Fleet & Multi-Role Command Hub",
      "startStream": "Start Live Broadcast Simulation",
      "streamLive": "🔴 Stream is LIVE (Click to End)",
      "rolesTitle": "Multi-Role Dashboard Impersonation & Launch Controls"
    },
    "agencies": {
      "title": "Onboard Verified Event Organizer Agency",
      "subtitle": "Grant agency licensing access to professional Ethiopian wedding planners and event organizers.",
      "agencyName": "Agency Name *",
      "contactEmail": "Primary Contact Email (Login) *",
      "password": "Temporary Access Password *",
      "onboardBtn": "Onboard & License Agency Partner 🤝",
      "listTitle": "Certified Partner Agencies"
    },
    "users": {
      "title": "Global User Accounts & RBAC Directory",
      "subtitle": "Inspect user roles, reset passwords, and maintain access security across all system actors.",
      "resetPassword": "Reset Password",
      "newPassword": "New Temporary Password *",
      "updatePasswordBtn": "Update Password"
    }
  },
  "scanner": {
    "title": "Agafari Gate Scanner Terminal",
    "subtitle": "Official Entrance QR Pass & VIP Headcount Verification",
    "inputPlaceholder": "Enter Invite Code (e.g. INV-SD2026-001)...",
    "verifyBtn": "Verify Pass",
    "validPass": "Valid Official Invitation",
    "alreadyScanned": "ENTRY DENIED: Already Scanned",
    "invalidPass": "Unrecognized Pass",
    "checkInBtn": "Confirm & Check In Guests ✓",
    "checkedInSuccess": "Guests Checked In Successfully!"
  },
  "auth": {
    "coupleTitle": "Bride & Groom Portal",
    "coupleSubtitle": "Private Wedding Control Suite",
    "organizerTitle": "Event Organizer Portal",
    "organizerSubtitle": "Wedding Planning & Management Command",
    "adminTitle": "System Admin Portal",
    "adminSubtitle": "Hamelmal Creatives Platform Administration",
    "emailLabel": "Email Address",
    "passwordLabel": "Password",
    "signInBtn": "Sign In to Portal",
    "signingIn": "Signing In...",
    "invalidCreds": "Invalid email or password."
  },
  "landing": {
    "nav": {
      "features": "Features",
      "partners": "Partners",
      "packages": "Packages",
      "liveDemo": "Live Demo",
      "pastWeddings": "Past Weddings",
      "aboutUs": "About Us",
      "bookWedding": "Book Your Wedding",
      "exploreCelebration": "Explore Live Celebration Hub"
    },
    "hero": {
      "badge": "Ethiopia's Premier Digital Wedding Experience Platform",
      "titlePart1": "Transform Your Wedding Into An",
      "titlePart2": "Unforgettable Digital Legacy",
      "description": "From interactive countdowns and tokenized gate QR passes to ontime live streaming the event and a vertical TikTok memory feed — Agafari connects your guests, anywhere in the world.",
      "ctaDemo": "Experience Live Interactive Demo",
      "ctaPackages": "Explore Service Packages",
      "feature1": "No App Download Required",
      "feature2": "Anti-Passback QR Security",
      "feature3": "Full Bride Media Approval",
      "feature4": "Ontime Live Streaming the Event"
    },
    "featuresSection": {
      "badge": "Ethiopia's Premier Wedding Technology Suite",
      "title": "Everything Your",
      "titleScript": "Celebration",
      "titleEnd": "Needs",
      "description": "A seamless ecosystem of interactive countdowns, tokenized anti-passback gate QR passes, vertical TikTok memory feeds, and worldwide live streaming.",
      "marqueeHint": "Infinite Live Loop • Hover Any Card to Pause & Preview",
      "card1Title": "Coming Soon & Wish Wall",
      "card1Badge": "Interactive Countdown",
      "card1Desc": "4-digit dynamic countdown clock with guest wish submission engine. Wishes are moderated by the couple before appearing on the public wish wall.",
      "card1Btn": "Preview Countdown Page",
      "card2Title": "Smart Digital Pass & Gate QR",
      "card2Badge": "Anti-Passback Security",
      "card2Desc": "Tokenized digital invitations with RSVP tracking and headcount quota validation (max_guests) to defeat screenshot entry crashers.",
      "card2Btn": "Test Gate Scanner App",
      "card3Title": "TikTok Feed & Live Broadcast",
      "card3Badge": "Global Streaming",
      "card3Desc": "Vertical video memory feed for guest photo/video uploads and ontime live streaming the event with real-time floating emojis.",
      "card3Btn": "Preview Memory Feed"
    },
    "partnersSection": {
      "badge": "Trusted By Leading Ethiopian Venues & Infrastructure",
      "title": "Our Luxury Hospitality Partners",
      "sheraton": "Sheraton Addis",
      "sheratonType": "Luxury Ballroom Partner",
      "haile": "Haile Grand Addis",
      "haileType": "Resort & Garden Partner",
      "skylight": "Skylight Hotel",
      "skylightType": "Grand Hall Partner",
      "radisson": "Radisson Blu",
      "radissonType": "VIP Hospitality Partner",
      "kuriftu": "Kuriftu Resort",
      "kuriftuType": "Destination Wedding Partner",
      "yegara": "Yegara Hosting",
      "yegaraType": "High-Speed Infrastructure"
    },
    "packagesSection": {
      "badge": "Service Packages",
      "title": "Tailored Service Packages",
      "description": "Select your package. Hamelmal Creatives manages technical setup and delivery.",
      "silverTitle": "Silver Celebration",
      "silverTag": "Essential",
      "silverDesc": "Ideal for intimate weddings and digital invitation distribution.",
      "silverF1": "Coming Soon Countdown Page",
      "silverF2": "Digital Invitation Card & RSVP Tracking",
      "silverF3": "Guest Wish Wall (with Couple Moderation)",
      "silverBtn": "Inquire Silver Package",
      "goldTitle": "Gold Royal Package",
      "goldTag": "Recommended",
      "goldBadge": "Most Popular Choice",
      "goldDesc": "Full digital experience including TikTok feed, gate security scanner, and live stream.",
      "goldF1": "Everything in Silver Package",
      "goldF2": "Gate Security Scanner & Quota Control",
      "goldF3": "TikTok Memory Feed & Guest Media Uploads",
      "goldF4": "Ontime Live Streaming the Event + Reactions",
      "goldBtn": "Book Gold Royal Package",
      "platTitle": "Platinum Enterprise",
      "platTag": "Full VIP Service",
      "platDesc": "For large luxury weddings with on-site operators and custom domain branding.",
      "platF1": "Everything in Gold Royal Package",
      "platF2": "Dedicated On-Site Live Stream Operator",
      "platF3": "Gate Security Personnel & Handheld Scanners",
      "platBtn": "Inquire Platinum VIP"
    },
    "demoSection": {
      "badge": "Live Wedding Simulator",
      "title": "Experience Agafari Operating Live in Real Time",
      "description": "Watch real-time gate check-ins and video broadcasts, or launch the live client screen with 1-click!",
      "tab1": "1. Home",
      "tab2": "2. Digital Invitation & Gate Pass",
      "tab3": "3. TikTok Memory Feed",
      "tab4": "4. Ontime Live Streaming the Event",
      "tab5": "5. Gate Security Scanner",
      "pill1": "Live 3D Countdown & Wish Wall",
      "title1": "Home (Countdown & Wish Wall)",
      "desc1": "Sara & Dawit's 4-digit dynamic countdown clock, venue location map, dress code, and interactive guest wish submission engine.",
      "btn1": "Open Live Home Screen",
      "pill2": "Tokenized Anti-Passback Gate QR",
      "title2": "Digital Invitation & Gate Pass",
      "desc2": "Envelope opening animation with scannable gate QR ticket, RSVP headcount tracking, and secure entry validation.",
      "btn2": "Open Digital Pass View",
      "pill3": "Bride-Approved Vertical Video Feed",
      "title3": "TikTok Memory Feed",
      "desc3": "Vertical snap-scroll video stream for guest-captured moments, double-tap likes, and real-time wish blessings.",
      "btn3": "Open TikTok Memory Feed",
      "pill4": "Worldwide Diaspora Broadcast • 184 Watching",
      "title4": "Ontime Live Streaming the Event",
      "desc4": "Zero-latency ontime live broadcast player with live viewer count indicator and interactive floating emoji reactions.",
      "btn4": "Open Live Stream Screen",
      "pill5": "Gate Security Staff Scanner Active",
      "title5": "Gate Security Scanner App",
      "desc5": "Used by gate staff on mobile/tablets to scan QR codes, validate headcount quotas (0/2 used), and block unauthorized entry.",
      "btn5": "Open Gate Scanner App"
    },
    "portfolioSection": {
      "badge": "Real Weddings Showcase",
      "title": "Memories Powered by Agafari",
      "description": "See how couples and guests experienced luxury weddings hosted by Hamelmal Creatives.",
      "card1Couple": "Sara & Dawit",
      "card1Venue": "Sheraton Addis Luxury Ballroom",
      "card1Type": "Royal Celebration",
      "card1Quote": "\"Our remote family in the USA and Europe watched the entire wedding live on Agafari without any delay. The guest wish wall was so heartwarming!\"",
      "card2Couple": "Marta & Abel",
      "card2Venue": "Haile Grand Outdoor Resort",
      "card2Type": "Garden Ceremony",
      "card2Quote": "\"The gate scanner QR passes eliminated all uninvited crashers! Gate check-in took only 3 seconds per guest.\"",
      "card3Couple": "Tigist & Henok",
      "card3Venue": "Ethiopian Skylight Grand Hall",
      "card3Type": "Traditional Luxury",
      "card3Quote": "\"Reliving our wedding through the guest-uploaded TikTok memory feed was the best part of our honeymoon!\"",
      "verified": "Verified Event"
    },
    "aboutSection": {
      "badge": "Engineered by Hamelmal Creatives",
      "title": "Pioneering Luxury Event Technology",
      "description": "Hamelmal Creatives is Ethiopia's premier software & media agency engineering bespoke event ecosystems, high-tech digital invitation systems, and world-class wedding productions.",
      "visitBtn": "Visit Hamelmal Creatives Official Website",
      "card1Title": "Unmatched Engineering Excellence",
      "card1Desc": "Built on enterprise Next.js App Router architecture, tokenized anti-passback QR security, and instant real-time live stream synchronization.",
      "card1Stat1": "99.9%",
      "card1Label1": "Uptime Reliability",
      "card1Stat2": "< 3 Sec",
      "card1Label2": "Gate Pass Check-in",
      "card2Title": "Full On-Site Technical Operations",
      "card2Desc": "Our dedicated media operators and security personnel handle everything on your wedding day — from live stream broadcasting to handheld gate scanners.",
      "card2Stat1": "100%",
      "card2Label1": "Bride Moderation",
      "card2Stat2": "Global",
      "card2Label2": "Diaspora Stream Reach"
    },
    "footer": {
      "brandDesc": "Ethiopia's premier digital wedding experience platform. Connecting brides, grooms, and guests worldwide through high-tech celebration tools.",
      "visitParent": "Visit Parent Company: Hamelmal Creatives",
      "colFeatures": "Platform Features",
      "f1": "Digital Invitations & Gate QR",
      "f2": "4-Digit Dynamic Countdown",
      "f3": "TikTok Memory Feed",
      "f4": "Ontime Live Streaming the Event",
      "colResources": "Resources & Support",
      "faq": "Frequently Asked Questions (FAQ)",
      "privacy": "Privacy Policy & Media Vault Safety",
      "packages": "Service Packages & Pricing",
      "partners": "Hospitality Partners",
      "demo": "Interactive Screen Demonstrator",
      "colContact": "Contact & Support",
      "address": "Addis Ababa, Ethiopia",
      "copyright": "Agafari Digital Platform © 2026 Hamelmal Creatives. All Rights Reserved.",
      "ssl": "SSL Encrypted & Secure"
    },
    "mobileNav": {
      "features": "Features",
      "packages": "Packages",
      "demo": "Live Demo",
      "weddings": "Weddings",
      "about": "About Us"
    },
    "faqModal": {
      "title": "Frequently Asked Questions (FAQ)",
      "subtitle": "Everything you need to know about Agafari's wedding technology.",
      "q1": "How do wedding guests receive their digital invitation pass?",
      "a1": "The couple or organizer generates a unique shareable link (or sends via WhatsApp with 1-click). Guests open their link without needing to download any mobile app, view event details, and display their personal QR gate pass at the entrance.",
      "q2": "How does the Anti-Passback Gate Scanner protect against uninvited crashers?",
      "a2": "Each invitation QR code is tokenized and locked to a strict headcount quota (max_guests). When scanned by the gate security staff, the system registers the check-in count and prevents reused screenshot codes from entering.",
      "q3": "Can the bride and groom moderate guest photos before they appear publicly?",
      "a3": "Yes! All guest-uploaded photos, short videos, and wishes go into the private Bride & Groom Suite. Only approved content appears on the public site and TikTok feed, while rejected files stay safely saved in the private Rejected Vault until manually deleted.",
      "q4": "Does Agafari support worldwide live streaming for Diaspora family members?",
      "a4": "Absolutely. We deliver zero-latency ontime live streaming the event with interactive real-time floating heart and crown reactions so loved ones abroad can celebrate in real time."
    },
    "privacyModal": {
      "title": "Privacy Policy & Data Security",
      "subtitle": "Our strict commitments to couple and guest data protection.",
      "p1Title": "1. Private Media Vault:",
      "p1Text": "All photos and videos uploaded by wedding guests are stored in an encrypted vault accessible solely by the designated bride and groom.",
      "p2Title": "2. Bride Moderation Guarantee:",
      "p2Text": "No guest submission is ever made public without explicit authorization from the couple.",
      "p3Title": "3. Anti-Passback Gate Data:",
      "p3Text": "Gate pass scanning tokens and check-in tallies are encrypted and never shared with third-party advertising networks.",
      "p4Title": "4. Data Deletion:",
      "p4Text": "The couple retains complete authority to purge rejected or historical wedding files from servers permanently."
    }
  }
}

```

### File: `frontend/src/locales/om.json`

```json
{
  "common": {
    "save": "Qabadhu",
    "saved": "Qabatameera!",
    "cancel": "Dhiisi / Deebi'i",
    "close": "Cufi",
    "delete": "Haqaamaa",
    "edit": "Gulaali",
    "open": "Bani",
    "download": "Buufadhu",
    "print": "Maxxansi",
    "copy": "Waraabi",
    "copied": "Waraabameera!",
    "loading": "Fe'amaa jira...",
    "search": "Barbaadi...",
    "all": "Hunda",
    "status": "Haala",
    "actions": "Tarkaanfiiwwan",
    "yes": "Eeyyee",
    "no": "Lakkii",
    "back": "Deebi'i",
    "submit": "Mirkanaassi fi Ergi",
    "submitting": "Ergamaa jira...",
    "success": "Milkaa'ina",
    "error": "Dogoggora",
    "required": "Dirqama",
    "optional": "Kan filannoo",
    "guest": "Keessummaa",
    "guests": "Keessummoota",
    "heads": "namoota",
    "offline": "Tamsaasa Kallattiin Ala",
    "live": "KALLATTIIN",
    "liveNow": "AMMA KALLATTIIN"
  },
  "nav": {
    "brandTitle": "Agafari",
    "tagline": "Muuxannoo Fuudha fi Heeruma Kabajamaa",
    "couplesPortal": "Mooraa Misirrootaa",
    "organizerPortal": "Mooraa Qopheessitootaa",
    "adminPortal": "Mooraa Bulchiinsaa",
    "signOut": "Ba'i",
    "openPublicPage": "Fuula Kabaja Uummataa Bani",
    "memoryFeed": "Sagantaa Yaadannoo (Reels)",
    "wishes": "Dhaamsa Eebbaa",
    "liveStream": "Tamsaasa Kallattii",
    "schedule": "Sagantaa Fuudhaa",
    "mezmur": "Faarfannaa fi Sirba Culture",
    "gatePass": "Waraqaa Seensaa (QR)"
  },
  "publicEvent": {
    "hero": {
      "royalWedding": "Ayyaana Fuudha fi Heeruma Ebba Waaqayyoo",
      "enterGatePass": "Waraqaa Seensaa Keessan Ilaalaa",
      "sendWish": "Eebba fi Dhaamsa Keessan Ergaa",
      "watchLive": "Tamsaasa Kallattii Daawwadhaa",
      "scrollMemories": "Giraafii Yaadannoo Fuudhaa Ilaalaa",
      "announcementFrom": "Dhaamsa Misirroota irraa"
    },
    "countdown": {
      "title": "Hanga Guyyaa Gaa'ela Bara Baraatti Yeroo Hafe",
      "days": "Guyyoota",
      "hours": "Sa'aattii",
      "minutes": "Daqiiqaa",
      "seconds": "Sakkondii",
      "today": "Har'a Guyyaa Eebbaa Fuudha fi Heeruma Keenya!"
    },
    "schedule": {
      "badge": "Sagantaa Guyyaa Fuudhaa",
      "title": "Tarree Sagantaa Ayyaanaa",
      "churchCeremony": "Eebba Mana Kadhannaa fi Kakuu Gaa'elaa",
      "churchDesc": "Kakuu gaa'elaa fuuldura Waaqayyoo fi amantootaatti raawwatamu.",
      "photoSession": "Sagantaa Suuraa fi Viidiyoottan Yaadannoo",
      "photoDesc": "Misirroota fi maatii dhiyoo waliin suuraa yaadannoo ka'uu.",
      "grandReception": "Affeeramiinsa Ayyaanaa, Melse fi Cidha",
      "receptionDesc": "Sirba aadaa, gursha, kakuu sirnaa fi kakuu kakuu nyaataa kabajaa."
    },
    "stream": {
      "badge": "Tamsaasa Kallattii Addunyaa",
      "title": "Ayyaana Gaa'ela Keenya Kallattiin Daawwadhaa",
      "subtitle": "Biyya keessas ta'ee biyya alaa kan jirtan maatiin fi hiriyaannan keenya eebba keessan nuuf qoodaa.",
      "liveBadge": "KALLATTIIN TAMSAASAMAIRA",
      "offlineBadge": "TAMSAASNI DIHAYOTIIN NI JALQABA",
      "chatNotice": "Tamsaasa kallattii YouTube addunyaa maratti walsimsiifame."
    },
    "mezmur": {
      "badge": "Faarfannaa fi Weelluu Aadaa Filataman",
      "title": "Tarree Faarfannaa Fuudhaa fi Sirba",
      "subtitle": "Faarfannaa fuudhaa fi weelluu aadaa seensa misirrootaaf filataman.",
      "nowPlaying": "Taphachaa Kan Jiru",
      "playTrack": "Taphachiisi",
      "pauseTrack": "Dhaabi"
    },
    "wishes": {
      "badge": "Eebba fi Baga Gamaddan",
      "title": "Dhaamsa Eebbaa fi Hawaasaa",
      "subtitle": "Dhaamsa eebbaa, kadhannaa yookaan nagaa viidiyoo qajeeltoon misirrootaaf ergaa.",
      "tabText": "Dhaamsa Barreeffamaa",
      "tabVideo": "Dhaamsa Viidiyoo 📹",
      "senderName": "Maqaa Guutuu *",
      "senderPlaceholder": "Fkn. Eessuma Bakeele fi Maatii",
      "messageLabel": "Dhaamsa Eebbaa Keessan *",
      "messagePlaceholder": "Dhaamsa eebbaa fi kadhannaa misirrootaaf barreessaa...",
      "videoUrlLabel": "Iddoo Viidiyoo Yookiin Viidiyoo Mobayiilii Filadhaa",
      "chooseVideoDevice": "Viidiyoo Eebbaa Mobayiilii irraa Filadhaa",
      "submitButton": "Dhaamsa Misirrootaaf Ergaa 💍",
      "sendingButton": "Ergamaa jira...",
      "successMsg": "Dhaamsi eebbaa keessan qajeeltoon misirrootaaf ga'eera!",
      "emptyWall": "Nama jalqabaa ta'uudhaan dhaamsa eebbaa ergaa!"
    },
    "qrPass": {
      "badge": "Waraqaa Seensaa Diijiitaalaa",
      "title": "Waraqaa Seensaa Gabaateedhaan Qophaa'e (QR Pass)",
      "subtitle": "Waraqaa seensaa keessan mallattoo seeraatiin qophaa'e mooraa seensaa irratti agarsiisaa.",
      "vipEntry": "Seensa Keessummoota Kabajamoo",
      "quotaAllowed": "Hayyama Keessummootaa",
      "scanInstructions": "Mooraa Seensaa Sheraton Addis irratti sakatta'aa",
      "downloadPass": "Waraqaa Seensaa Suuraan Buufadhu",
      "printPass": "Waraqaa Seensaa Maxxansi"
    }
  },
  "feed": {
    "title": "Sagantaa Viidiyoo Yaadannoo (Feed)",
    "sharedBy": "Kan qoodame",
    "comments": "Yaada",
    "addComment": "Yaada bareeda ida'aa...",
    "postComment": "Maxxansi",
    "doubleTapLike": "Jaallachuuf yeroo lama tuqaa",
    "uploadMoments": "Viidiyoo Yaadannoo Ol-fe'aa",
    "uploadTitle": "Momentii Fuudhaa Qoodaa",
    "uploaderName": "Maqaa Keessan *",
    "captionLabel": "Ibsa / Dhaamsa *",
    "chooseMedia": "Viidiyoo Mobayiilii irraa Filadhaa",
    "publishButton": "Maxxansa Fuudhaaf Ol-fe'aa 🚀",
    "publishing": "Fe'amaa jira...",
    "emptyFeed": "Viidiyoon ol-fe'ame hin jiru. Isin jalqaba ta'aa!"
  },
  "coupleDashboard": {
    "header": {
      "badge": "Mooraa Misirrootaa",
      "title": "To'annoo Fuudha fi Heeruma Misirrootaa",
      "guestsAttending": "Keessummoota Dhufan"
    },
    "tabs": {
      "setup": "0. Odeeffannoo Fuudhaa fi Qophii",
      "invites": "1. Affeeramtoota fi QR Seensaa",
      "staff": "2. Gargaartoota fi Qooda Hojii",
      "media": "3. Viidiyoottan fi Suuraalee Simataman",
      "broadcast": "4. Beeksisa Kallattii Guyyaa Fuudhaa",
      "thankYou": "5. Dhaamsa Galateeffannaa Fuudha Boodaa"
    },
    "setup": {
      "title": "Odeeffannoo Ijoo Fuudhaa Sirreessuu",
      "subtitle": "Maqaa keessan lachuu, suuraa bareeda, iddoo fi guyyaa fuudhaa galchuun mooraa keessan bareolchaa.",
      "platformActive": "Sirni Banaadha",
      "brideName": "Maqaa Guutuu Misirrooti *",
      "groomName": "Maqaa Guutuu Misirrichaa *",
      "photoLabel": "Suuraa Bareeda Misirrootaa (Mobayiilii irraa) *",
      "photoHelp": "Suuraa qulqullina ol-aanaa qabu PNG yookaan JPG filadhaa",
      "photoPrompt": "Suuraa Misirrootaa Filachuuf As Tuqaa",
      "venueName": "Maqaa Hallii Cidhaa *",
      "venueAddress": "Teessoo Hallii Cidhaa *",
      "mapLink": "Liinkii Google Maps",
      "eventDate": "Guyyaa Fuudhaa *",
      "startTime": "Sa'aatii Jalqabaa *",
      "dressCode": "Haala Uffannaa (Dress Code)",
      "welcomeMsg": "Dhaamsa Baga Nagaan Dhuftan Keessummootaaf",
      "saveBtn": "Odeeffannoo Qabadhu fi Haaromsi 💍",
      "savingBtn": "Qabatamaa jira...",
      "successMsg": "Odeeffannoon fuudha keessanii milkaa'inaan haaromeera!"
    },
    "invites": {
      "kpiTotal": "Ida'ama Affeeramtootaa",
      "kpiAttending": "Kan Dhufan",
      "kpiPending": "Kan Hin Murteessine",
      "kpiDeclined": "Kan Hin Dhufne",
      "genTitle": "Affeerraa Keessummaa Haaraa Qopheessuu",
      "genSubtitle": "Waraqaa seensaa QR yookaan liinkii diijiitaalaa ergame qopheessaa.",
      "modeCard": "1) QR Waraqaa Maxxanfamuuf",
      "modeLink": "2) Liinkii Kallattii Diijiitaalaa",
      "guestName": "Maqaa Keessummaa / Maatii *",
      "quota": "Baay'ina Namoota Hayyamamanii *",
      "phone": "Lakkoofsa Bilbilaa (Kan filannoo)",
      "genCardBtn": "QR Seensaa Maxxanfamu Qopheessi",
      "genLinkBtn": "Liinkii Addaa Diijiitaalaa Qopheessi",
      "tableTitle": "Tarree Keessummoota Affeeramanii",
      "tableSubtitle": "Deebii keessummootaa fi waraqaa seensaa hordofaa.",
      "thGuest": "Keessummaa / Maatii",
      "thType": "Gosoota Affeerraa",
      "thQuota": "Baay'ina",
      "thRsvp": "Deebii Dhufaatii",
      "thGate": "Haala Seensaa",
      "thActions": "Tarkaanfiiwwan",
      "attending": "Ni Dhufu",
      "declined": "Hin Dhufan",
      "pendingRsvp": "Deebiin Egamuu",
      "checkedIn": "Seenaniiru",
      "awaitingGate": "Seensa Hin Ga'illre",
      "viewQr": "QR Ilaali"
    },
    "staff": {
      "title": "Qooda Hojii Gargaartootaa fi Hojjettootaa",
      "subtitle": "Tamsaastota kallattii fi to'attoota dooriitiif hayyama seensaa kennaa.",
      "fullName": "Maqaa Guutuu Hojjetaa *",
      "email": "Imeelii / Seensa *",
      "password": "Jecha Darbiiti Yeroo *",
      "role": "Qooda Hojii Kenname *",
      "roleStreamer": "📹 1) Tamsaasa Kallattii",
      "roleScanner": "📱 2) Sakatta'aa QR Seensaa",
      "assignBtn": "Qooda Hojii Kennaa",
      "activeCrew": "Hojjettoota Ramadaman",
      "openPortal": "Bani",
      "revokeRole": "Haqui"
    },
    "media": {
      "title": "Viidiyoottan fi Suuraalee Simataman",
      "subtitle": "Viidiyoottan fi eebba keessummoota irraa ergaaman mirkanreessa.",
      "tabAll": "Hunda",
      "tabPosted": "🟢 Kan Mirkana'an",
      "tabPending": "🟡 Kan Egamuu",
      "tabRejected": "🔴 Kan Haqaaman",
      "approve": "Mirkaneessi",
      "reject": "Haqui",
      "empty": "Koompula kanaan faayiliin hin jiru."
    },
    "broadcast": {
      "title": "Beeksisa Kallattii Guyyaa Fuudhaa Keessummootaaf",
      "subtitle": "Jijjiirama sagantaa fi beeksisa fuula fuudhaa irratti tamsaasaa.",
      "label": "Dhaamsa Beeksisaa",
      "previewTitle": "Giraafii Beeksisaa",
      "publishBtn": "Beeksisa Keessummootaaf Tamsaasaa",
      "publishingBtn": "Tamsasamaa jira...",
      "successMsg": "Beeksiisi fuula fuudhaa irratti tamsaasameera!"
    },
    "thankYou": {
      "title": "Dhaamsa Galateeffannaa Fuudha Boodaa",
      "subtitle": "Fuudha booda keessummoota ayyaana irratti hirmaataniif galateeffannaa ergaa.",
      "messageLabel": "Dhaamsa Galateeffannaa Seeraa",
      "photoLabel": "Suuraa Galateeffannaa (Mobayiilii irraa)",
      "photoPrompt": "Suuraa Galateeffannaa Filachuuf As Tuqaa",
      "sendBtn": "Dhaamsa Galateeffannaa Ergaa 💌",
      "sendingBtn": "Ergamaa jira...",
      "successMsg": "Dhaamsi galateeffannaa keessummoota hundumaaf tamsaasameera!"
    }
  },
  "organizerDashboard": {
    "brand": "Agafari Planners",
    "subtitle": "Mooraa Qopheessitootaa Fuudhaa",
    "kpiHosting": "Kan Hojjataa Jiran",
    "kpiArchive": "Fuudha Xumuraman",
    "tabs": {
      "weddings": "1. Fuudha Gurguddoo",
      "credentials": "2. Hayyama Misirrootaa",
      "media": "3. To'annoo Viidiyoottanii"
    },
    "header": {
      "tag": "Garaa To'annoo Qopheessitoota Fuudhaa",
      "title": "Wiirtuu To'annoo Fuudha Hojjiirra Jiran",
      "requestBtn": "Hayyama Seensaa Misirrootaa Gaafadhaa"
    },
    "fleet": {
      "all": "Fuudha Hundumaa",
      "active": "🟢 Kan Hojjataa Jiran",
      "archive": "📜 Fuudha Xumuraman",
      "pending": "⏳ Egaa Kan Jiran",
      "searchPlaceholder": "Fuudha, misirroo yookaan hallii barbaadi...",
      "selectedRoom": "Kutaah To'annoo Filatame",
      "adminStatus": "Haala Hayyamaa",
      "roleCredentialsTitle": "Qooda Hojii Kenname fi Seensa Qajeeltoon",
      "roleCredentialsSubtitle": "Kardii tuquudhaan gara mooraa to'annoo hojjetaa sanatti galaa:",
      "coupleRole": "👑 1) Misirroota",
      "coupleDesc": "To'annoo guutuu fuudhaa, affeerraa fi beeksisa keessummootaa.",
      "launchCouple": "Gara Mooraa Misirrootaa Galaa",
      "copyCouple": "Seensa Misirrootaa Waraabaa",
      "streamerRole": "📹 2) Tamsaastuu Kallattii",
      "streamerDesc": "To'annoo tamsaasa kallattii fi kaameraa.",
      "launchStreamer": "Gara Studio Tamsaasaa Galaa",
      "copyStreamer": "Seensa Tamsaastuu Waraabaa",
      "scannerRole": "📱 3) Sakatta'aa QR Doorii",
      "scannerDesc": "Sakatta'iinsa waraqaa seensaa QR doorii irratti.",
      "launchScanner": "Gara Terminal Doorii Galaa",
      "copyScanner": "Seensa Sakatta'aa Waraabaa"
    },
    "credentials": {
      "title": "Hayyama Misirrootaa Gaafachuu fi Qopheessuu",
      "subtitle": "Odeeffannoo ijoo galchuudhaan bulchaa sirnaa irraa hayyama argadhaa.",
      "brideName": "Maqaa Guutuu Misirrooti *",
      "groomName": "Maqaa Guutuu Misirrichaa *",
      "email": "Imeelii Misirrootaa (Seensaaf Kan Ta'u) *",
      "date": "Guyyaa Fuudhaa *",
      "venue": "Iddoo / Hallii Cidhaa *",
      "submitBtn": "Hayyama Gaafadhu fi Qopheessi 💍",
      "submittingBtn": "Ergamaa jira...",
      "successTitle": "Seensi Misirrootaa Milkaa'inaan Qophaa'eera!",
      "trackerTitle": "Hordoffii Hayyamaa fi Seensaa"
    }
  },
  "adminDashboard": {
    "brand": "Hamelmal Creatives",
    "subtitle": "Bulchaa Sirnaa Ol-aanaa",
    "kpiPending": "Hayyama Kan Egan",
    "kpiActive": "Fuudha Hojjiirra Jiran",
    "tabs": {
      "approvals": "1. Hayyama fi Mirkaneessa",
      "events": "2. Tarree Fuudha Hundumaa",
      "organizers": "3. Dhaabbilee Qopheessitootaa",
      "users": "4. Fayyadamtoota Sirnaa",
      "media": "5. Kuusaa Viidiyoo Hundumaa"
    },
    "header": {
      "tag": "Garaa To'annoo Sirnaa",
      "title": "Wiirtuu Bulchiinsa Sirnaa Ol-aanaa",
      "createBtn": "Fuudha Haaraa Kallattiin Hayyami"
    },
    "approvals": {
      "title": "Gaaffiiwwan Fuudhaa Hayyama Egaa Jiran",
      "subtitle": "Gaaffii qopheessitootaa madaaluun hayyama kennaa.",
      "approveBtn": "Hayyamuun Mirkaneessi 🟢",
      "rejectBtn": "Gaaffii Kuffisi",
      "approvedTableTitle": "Fuudha Hayyamamanii fi Hojjiirra Jiran",
      "openCommand": "Gara Kutaah To'annoo Galaa →"
    },
    "fleet": {
      "title": "To'annoo Fuudha Hundumaa fi Qooda Hojii",
      "startStream": "Yaalii Tamsaasaa Jalqabi",
      "streamLive": "🔴 Tamsaasni Kallattiin Jira",
      "rolesTitle": "To'annoo Seensa Qooda Hojii Adda Addaa"
    },
    "agencies": {
      "title": "Dhaabbata Qopheessaa Haaraa Galmeessuu",
      "subtitle": "Qopheessitoota fuudhaa ogummaa qabaniif hayyama sirnaa kennaa.",
      "agencyName": "Maqaa Dhaabbataa *",
      "contactEmail": "Imeelii Dhaabbataa (Seensaaf) *",
      "password": "Jecha Darbiiti Yeroo *",
      "onboardBtn": "Dhaabbata Galmeessi fi Hayyami 🤝",
      "listTitle": "Dhaabbilee Galmaa'an"
    },
    "users": {
      "title": "Kuusaa Fayyadamtootaa fi Nageenya",
      "subtitle": "Qooda hojii to'adhaa, jecha darbiiti jijjiiraa.",
      "resetPassword": "Jecha Darbiiti Jijjiiri",
      "newPassword": "Jecha Darbiiti Yeroo Haaraa *",
      "updatePasswordBtn": "Jecha Darbiiti Haaromsi"
    }
  },
  "scanner": {
    "title": "Agafari Terminal Doorii Sakatta'aa",
    "subtitle": "Sakatta'iinsa Waraqaa Seensaa QR fi Baay'ina Keessummootaa",
    "inputPlaceholder": "Koodii Seensaa Galchaa (fkn. INV-SD2026-001)...",
    "verifyBtn": "Koodii Sakatta'i",
    "validPass": "Affeerraa Seeraa Kufaan Seenaa",
    "alreadyScanned": "SEENSI HIN HAYYAMAMU: Cufameera",
    "invalidPass": "Koodii Seensaa Hin Beekamne",
    "checkInBtn": "Mirkanreessii Keessummoota Seensisi ✓",
    "checkedInSuccess": "Keessummoonni Milkaa'inaan Seenaniiru!"
  },
  "auth": {
    "coupleTitle": "Mooraa Misirrootaa",
    "coupleSubtitle": "To'annoo Fuudha fi Heeruma Private",
    "organizerTitle": "Mooraa Qopheessitootaa",
    "organizerSubtitle": "Wiirtuu Qophii fi Bulchiinsa Cidhaa",
    "adminTitle": "Bulchaa Sirnaa Ol-aanaa",
    "adminSubtitle": "Bulchiinsa Platformii Hamelmal Creatives",
    "emailLabel": "Teessoo Imeelii",
    "passwordLabel": "Jecha Darbiiti",
    "signInBtn": "Gara Mooraatti Galaa",
    "signingIn": "Galamaa jira...",
    "invalidCreds": "Imeelii yookaan jecha darbiiti dogoggoraa!"
  },
  "landing": {
    "nav": {
      "features": "Tajaajilawwan",
      "partners": "Michoota",
      "packages": "Paakeejiiwwan",
      "liveDemo": "Agarsiisa Kallattii",
      "pastWeddings": "Fuudha Darban",
      "aboutUs": "Nuyis Booda",
      "bookWedding": "Fuudha Keessan Galmeessaa",
      "exploreCelebration": "Ayyaana Kallattii Daawwadhaa"
    },
    "hero": {
      "badge": "Platformii Fuudha Diijiitaalaa Duraan Oofamu Itoophiyaa",
      "titlePart1": "Fuudha Keessan Gara Yaadannoo",
      "titlePart2": "Bara Baraatti Jijjiiraa",
      "description": "Herrega guyyoota irraa jalqabee hanga waraqaa seensaa QR fi tamsaasa kallattii addunyaatti — Agafari keessummoota keessan bakka jiranitti walitti fida.",
      "ctaDemo": "Agarsiisa Kallattii Yaalaa",
      "ctaPackages": "Paakeejii Tajaajilaa Ilaalaa",
      "feature1": "Appii Buusuun Hin Barbaachisu",
      "feature2": "Nageenya QR Seensaa Eegame",
      "feature3": "Mirkaneessa Misirrootiin Kan Gaggeeffamu",
      "feature4": "Tamsaasa Kallattii Punctual"
    },
    "featuresSection": {
      "badge": "Teeknoolojii Fuudhaa Itoophiyaa Isa Fooyyaitaa",
      "title": "Wanta Ayyaana Keessaniif",
      "titleScript": "Barbaachisu",
      "titleEnd": "Hundumaa",
      "description": "Miseensa sirna wal-simate kan guyyoota lakkaawu, waraqaa seensaa QR fi tamsaasa kallattii addunyaa.",
      "marqueeHint": "Dhaabuuf Tuqaa Yookaan Irra Qabaa",
      "card1Title": "Lakkoofsa Guyyaa fi Dhaamsa Eebbaa",
      "card1Badge": "Lakkoofsa Guyyaa",
      "card1Desc": "Sa'aatii lakkoofsa guyyaa fi iddoo dhaamsa eebbaa keessummootaa. Dhaamsi misirrootaan erga mirkanaa'e booda mul'ata.",
      "card1Btn": "Fuula Lakkoofsaa Ilaalaa",
      "card2Title": "Waraqaa Seensaa Smart & QR",
      "card2Badge": "Nageenya QR",
      "card2Desc": "Waraqaa seensaa diijiitaalaa baay'ina namoota hayyamamaniin eegamee qophaa'e.",
      "card2Btn": "Appii Doorii Yaalaa",
      "card3Title": "Viidiyoo Yaadannoo & Tamsaasa",
      "card3Badge": "Tamsaasa Addunyaa",
      "card3Desc": "Sagantaa viidiyoo yaadannoo fi tamsaasa kallattii YouTube addunyaa maratti.",
      "card3Btn": "Viidiyoottan Yaadannoo Ilaalaa"
    },
    "partnersSection": {
      "badge": "Hotelaa fi Halliiwwan Itoophiyaa Bekamoo Biratti Kan Amaname",
      "title": "Hotelaa fi Michoota Keenya Kabajamoo",
      "sheraton": "Sheraton Addis",
      "sheratonType": "Michuu Hallii Kabajamaa",
      "haile": "Haile Grand Addis",
      "haileType": "Michuu Resort fi Dirree",
      "skylight": "Ethiopian Skylight Hotel",
      "skylightType": "Michuu Hallii Gudaa",
      "radisson": "Radisson Blu",
      "radissonType": "Michuu Hospitality VIP",
      "kuriftu": "Kuriftu Resort",
      "kuriftuType": "Michuu Cidha Resort",
      "yegara": "Yegara Hosting",
      "yegaraType": "Dhaabbata Server Ariifachiisaa"
    },
    "packagesSection": {
      "badge": "Paakeejii Tajaajilaa",
      "title": "Paakeejiiwwan Tajaajilaa Qophaa'an",
      "description": "Filannoo keessan filadhaa. Hamelmal Creatives teeknika hundumaa ni raawwata.",
      "silverTitle": "Paakeejii Silver",
      "silverTag": "Bu'uuraa",
      "silverDesc": "Affeerraa diijiitaalaa fi lakkoofsa guyyootaatiif kan ta'u.",
      "silverF1": "Fuula Lakkoofsa Guyyootaa Fuudhaa",
      "silverF2": "Waraqaa Affeerraa Diijiitaalaa",
      "silverF3": "Dhaamsa Eebbaa (To'annoo Misirrootaatiin)",
      "silverBtn": "Paakeejii Silver Gaafadhaa",
      "goldTitle": "Paakeejii Gold Royal",
      "goldTag": "Kan Gorfamu",
      "goldBadge": "Filannoo Beekamaa Isa Jalqabaa",
      "goldDesc": "Tajaajila guutuu viidiyoo yaadannoo, QR doorii fi tamsaasa kallattii qabu.",
      "goldF1": "Wanti Silver Keessa Jiru Hundumtuu",
      "goldF2": "Sakatta'iinsa QR Doorii fi To'annoo Baay'inaa",
      "goldF3": "Viidiyoo Yaadannoo fi Suuraalee Ol-fe'uu",
      "goldF4": "Tamsaasa Kallattii Punctual fi Yaada",
      "goldBtn": "Paakeejii Gold Royal Ajajaa",
      "platTitle": "Paakeejii Platinum VIP",
      "platTag": "Tajaajila Guutuu",
      "platDesc": "Cidha gurguddoo fi kabajamoo hojjettoota waliin qophaa'e.",
      "platF1": "Wanti Gold Keessa Jiru Hundumtuu",
      "platF2": "Hojjetaa Tamsaasa Kallattii Mooraa Irratti Ramadamu",
      "platF3": "Hojjettoota Doorii Sakatta'iinsa QR",
      "platBtn": "Paakeejii Platinum VIP Gaafadhaa"
    },
    "demoSection": {
      "badge": "Agarsiisa Kallattii Fuudhaa",
      "title": "Agafari Hojjiirra Odoo Jiru Kallattiin Ilaalaa",
      "description": "To'annoo doorii fi tamsaasa kallattii tuqaa tokkoon yaalaa!",
      "tab1": "1. Fuula Ijoo",
      "tab2": "2. Affeerraa Diijiitaalaa & QR",
      "tab3": "3. Viidiyoo Yaadannoo",
      "tab4": "4. Tamsaasa Kallattii",
      "tab5": "5. Sakatta'aa Doorii",
      "pill1": "Lakkoofsa Guyyaa fi Eebba",
      "title1": "Fuula Ijoo (Lakkoofsa Guyyaa)",
      "desc1": "Sa'aatii lakkoofsa guyyaa fuudhaa, teessoo hallii fi dhaamsa eebbaa keessummootaa.",
      "btn1": "Fuula Ijoo Bani",
      "pill2": "QR Seensaa Nageenyi Isa Eegame",
      "title2": "Affeerraa Diijiitaalaa & QR",
      "desc2": "Baniinsa waraqaa affeerraa, tiketti QR seensaa fi baay'ina namoota hayyamamanii.",
      "btn2": "Waraqaa Diijiitaalaa Ilaalaa",
      "pill3": "Viidiyoo Misirrootaan Mirkanaa'u",
      "title3": "Viidiyoo Yaadannoo (Feed)",
      "desc3": "Viidiyoo yaadannoo bareeda keessummootaan ol-fe'amanii fi eebba hawasaa.",
      "btn3": "Viidiyoottan Yaadannoo Ilaalaa",
      "pill4": "Tamsaasa Addunyaa Diaspora",
      "title4": "Tamsaasa Kallattii",
      "desc4": "Tamsaasa kallattii YouTube ariifachiisaa maatii biyya alaa jiraataniif.",
      "btn4": "Tamsaasa Kallattii Ilaalaa",
      "pill5": "Hojjetaa Sakatta'aa Doorii Hojjiirra Jiru",
      "title5": "Appii Sakatta'aa Doorii",
      "desc5": "Hojjettoota dooriitiin koodii QR sakatta'uuf fi namoota affeeramne to'achuuf kan tajaajilu.",
      "btn5": "Appii Doorii Yaalaa"
    },
    "portfolioSection": {
      "badge": "Kuusaa Fuudha Raawwatamanii",
      "title": "Yaadannoo Agafariin Miidhagan",
      "description": "Misirroota fi keessummoota muuxannoo cidha bareeda Agafariin qabaatan ilaalaa.",
      "card1Couple": "Saraa fi Daawwit",
      "card1Venue": "Hallii Kabajamaa Sheraton Addis",
      "card1Type": "Cidha Kabajamaa",
      "card1Quote": "\"Maatiin keenya USA fi Awurooppaa jiran cidha keenya guutumaan guutuutti kallattiin daawwatan. Dhaamsi eebbaa bayyee nama gammachiisa!\"",
      "card2Couple": "Maartaa fi Abeel",
      "card2Venue": "Haile Grand Outdoor Resort",
      "card2Type": "Cidha Dirree",
      "card2Quote": "\"Sakatta'aan QR namoota affeeramne to'achuuf nu gargaareera. Doorii irratti keessummaa simachuuf sakkondii 3 qofa fudhate!\"",
      "card3Couple": "Tigist fi Henok",
      "card3Venue": "Ethiopian Skylight Hotel",
      "card3Type": "Cidha Aadaa Kabajamaa",
      "card3Quote": "\"Viidiyoo yaadannoo keessummootaan ol-fe'aman ilaaluun gammachuu guddaa nuuf kennee!\"",
      "verified": "Fuudha Mirkanaa'e"
    },
    "aboutSection": {
      "badge": "Hamelmal Creatives'n Kan Ijaarame",
      "title": "Aadaa Fuudha Itoophiyaa Teeknoolojiin Guddisuu",
      "description": "Hamelmal Creatives dhaabbata software fi media Itoophiyaa isa beekamaa ta'ee teeknoolojii cidhaa ammayyaa qopheessa.",
      "visitBtn": "Website Hamelmal Creatives Daawwadhaa",
      "card1Title": "Qulqullina Teeknoolojii Ol-aanaa",
      "card1Desc": "Next.js teeknoolojiin kan ijaarame, nageenya QR doorii fi tamsaasa kallattii ariifachiisaa qabu.",
      "card1Stat1": "99.9%",
      "card1Label1": "Amanamummaa Sirnaa",
      "card1Stat2": "< 3 Sakkondii",
      "card1Label2": "Sakatta'iinsa QR Doorii",
      "card2Title": "Tajaajila Teeknikaa Full On-Site",
      "card2Desc": "Hojjettoonni keenya guyyaa cidha keessanii tamsaasa kallattii fi to'annoo doorii guutummaatti raawwatu.",
      "card2Stat1": "100%",
      "card2Label1": "Mirkaneessa Misirrootiin",
      "card2Stat2": "Global",
      "card2Label2": "Tamsaasa Diaspora"
    },
    "footer": {
      "brandDesc": "Platformii fuudha diijiitaalaa duraan oofamu Itoophiyaa; maatii fi hiriyaannan addunyaa maratti walitti fida.",
      "visitParent": "Dhaabbata Abbaa Daawwadhaa: Hamelmal Creatives",
      "colFeatures": "Tajaajilawwan Platformii",
      "f1": "Affeerraa Diijiitaalaa & QR",
      "f2": "Lakkoofsa Guyyaa Sa'aatii",
      "f3": "Viidiyoo Yaadannoo",
      "f4": "Tamsaasa Kallattii Punctual",
      "colResources": "Odeeffannoo & Nageenya",
      "faq": "Gaaffii fi Deebii (FAQ)",
      "privacy": "Imaammata Nageenya Odeeffannoo",
      "packages": "Paakeejiiwwan Tajaajilaa",
      "partners": "Michoota Hotelaa",
      "demo": "Fuula Agarsiisa Kallattii",
      "colContact": "Qunnamtii",
      "address": "Finfinnee, Itoophiyaa",
      "copyright": "Agafari Digital Platform © 2026 Hamelmal Creatives. Mirgi Isaa Seeraan Kan Eegameeruu.",
      "ssl": "Nageenyi Isa Eegame"
    },
    "mobileNav": {
      "features": "Tajaajilawwan",
      "packages": "Paakeejiiwwan",
      "demo": "Agarsiisa Kallattii",
      "weddings": "Fuudha",
      "about": "Nuyis Booda"
    },
    "faqModal": {
      "title": "Gaaffii fi Deebii (FAQ)",
      "subtitle": "Wanta teeknoolojii fuudhaa Agafari irraa beekuu barbaaddan hunda asitti argattu.",
      "q1": "Keessummoonni affeerraa diijiitaalaa isaanii akkamitti argatu?",
      "a1": "Misirrooni yookaan qopheessitoonni liinkii diijiitaalaa ergu. Keessummoonni appii osoo hin buusin liinkii tuquudhaan waraqaa seensaa QR isaanii argatu.",
      "q2": "Sakatta'aan doorii QR namoota affeeramne akkamitti to'ata?",
      "a2": "Koodiin QR tokkoon tokkoo baay'ina namoota hayyamamaniin cufama. Doorii irratti erga sakatta'amee booda suuraan waraabame waraqaatti deebi'ee tajaajiluu hin danda'u.",
      "q3": "Misirrooni suuraa fi viidiyoo keessummoota irraa ergame mirkaneessuu danda'uu?",
      "a3": "Eeyyee! Suuraalee fi viidiyoottan keessummoota irraa erhaman hundumtuu murni misirrootaa erga mirkaneessee booda mul'atu.",
      "q4": "Tamsaasni kallattii maatii biyya alaa jiraataniif ni jiraa?",
      "a4": "Eeyyee. Maatiin biyya alaa jiraatan tamsaasa kallattii YouTube ariifachiisaa ta'een cidha keessan daawwachuu danda'u."
    },
    "privacyModal": {
      "title": "Imaammata Nageenya Odeeffannoo",
      "subtitle": "Kakuu nageenya odeeffannoo misirrootaa fi keessummootaa eeguu keenya.",
      "p1Title": "1. Kuusaa Media Dhuunfaa:",
      "p1Text": "Suuraalee fi viidiyoottan keessummoota irraa erhaman misirroota qofaaf kan banamu dha.",
      "p2Title": "2. Mirkaneessa Misirrootaa:",
      "p2Text": "Viidiyoon yookaan suuraan misirrootaan hin mirkanaa'in ummataaf hin mul'atu.",
      "p3Title": "3. Odeeffannoo QR Seensaa:",
      "p3Text": "Koodiin seensaa fi odeeffannoon keessummootaa qaama sadaffaaf hin kennamu.",
      "p4Title": "4. Haqiinsa Odeeffannoo:",
      "p4Text": "Misirrooni yeroo barbaadanitti faayiliiwwan hin barbaachisne sirna irraa haquu danda'u."
    }
  }
}

```

### File: `frontend/src/locales/ti.json`

```json
{
  "common": {
    "save": "ዓቅብ",
    "saved": "ተዓቂቡልካ!",
    "cancel": "ሰርዝ / ተመለስ",
    "close": "ዓጽው",
    "delete": "አልግስ",
    "edit": "ኣስተኻኽል",
    "open": "ክፈት",
    "download": "ኣውርድ",
    "print": "ሕተም",
    "copy": "ቅዳሕ",
    "copied": "ተቐዲሑልካ!",
    "loading": "የዳሉ ኣሎ...",
    "search": "ድለ...",
    "all": "ኩሉ",
    "status": "ኩነታት",
    "actions": "ስጉምቲታት",
    "yes": "እወ",
    "no": "ኣይፋል",
    "back": "ተመለስ",
    "submit": "ኣረጋግፅን ልኣኽን",
    "submitting": "ይልኣኽ ኣሎ...",
    "success": "ተዓዊቱ!",
    "error": "ስሕተት ኣጋጢሙ",
    "required": "ግደታዊ",
    "optional": "ምርጫዊ",
    "guest": "ጋሻ",
    "guests": "ኣጋይሽ",
    "heads": "ሰባት",
    "offline": "ቀጥታ ፈነወ የለን",
    "live": "ቀጥታ ፈነወ",
    "liveNow": "ሕዚ ብቀጥታ"
  },
  "nav": {
    "brandTitle": "አጋፋሪ",
    "tagline": "ናይ ንጉስ ዲጂታል መርዓ ድምቀት",
    "couplesPortal": "መቆፃፀሪ መርዓወታት",
    "organizerPortal": "ማእከል ኣሰናዳእቲ መርዓ",
    "adminPortal": "ኮንሶል ዋና ኣመሓዳሪ",
    "signOut": "ወጽእ",
    "openPublicPage": "ይፋዊ ገፅ መርዓ ክፈት",
    "memoryFeed": "ቪዲዮታት መዘከርታ (Reels)",
    "wishes": "መንደቕ ምርቓት",
    "liveStream": "ቀጥታ ፈነወ",
    "schedule": "መደብ መርዓ",
    "mezmur": "መዝሙራትን ዜማታትን መርዓ",
    "gatePass": "ፍቓድ ኣታዊ (QR)"
  },
  "publicEvent": {
    "hero": {
      "royalWedding": "ዝተባረኸ በዓል መርዓን ደስታን",
      "enterGatePass": "ፍቓድ ኣታዊኻ ርአ",
      "sendWish": "ምርቓትን ሰናይ ተመኖን ለኣኽ",
      "watchLive": "ቀጥታ ፈነወ ተኸታተል",
      "scrollMemories": "ቪዲዮታት መዘከርታ መርዓ ርአ",
      "announcementFrom": "ካብ መርዓወታት ዝተመሓላለፈ መልእኽቲ"
    },
    "countdown": {
      "title": "ናብ ናይ ዘለዓለም ቃል ኪዳን መዓልቲ መቑጸሪ",
      "days": "መዓልትታት",
      "hours": "ሰዓታት",
      "minutes": "ደቂቓታት",
      "seconds": "ሰከንድታት",
      "today": "ሎሚ ዝተባረኸ መዓልቲ መርዓና እዩ!"
    },
    "schedule": {
      "badge": "ሰሌዳ ግዜ መዓልቲ መርዓ",
      "title": "ሰሌዳ መደብ በዓል መርዓ",
      "churchCeremony": "ስርዓት ተክሊልን ጸሎት ቤተክርስቲያንን",
      "churchDesc": "ኣብ ቅድሚ ኣምላኽን ምእመናንን ዝፍጸም ቅዱስ ናይ ተክሊልን ቃል ኪዳን መርዓን ስርዓት።",
      "photoSession": "ክፍሊ ግዜ ፎቶን ቪዲዮን መዘከርታ",
      "photoDesc": "ምስ መዛሙርትን ምስ ቀረባ ቤተሰብን ዝግበር ውጽኢታዊ ናይ መዘከርታ ፎቶ መደብ።",
      "grandReception": "ዓብዪ ድግስ፣ ባህላዊ መልስን ጉርሻን",
      "receptionDesc": "ባህላዊ ሱፍራ፣ ምሸታዊ ድግስ፣ ስርዓት ጉርሻን ምቑራጽ ኬክ መርዓን።"
    },
    "stream": {
      "badge": "ዓለምለኸ ቀጥታ ፈነወ",
      "title": "ስርዓት መርዓና ካብ ዘለኹምዎ ብቀጥታ ተኸታተሉ",
      "subtitle": "ኣብ ውሽጢ ዓድን ኣብ ወጻእን ዘለኹም ክቡራት ቤተሰብናን ኣዕሩኽትናን ተካፈልቲ ደስታና ብምዃን ምርቓትኩም ኣካፍሉና።",
      "liveBadge": "ብቀጥታ ይፈነው ኣሎ",
      "offlineBadge": "ቀጥታ ፈነወ ኣብ ቐረባ እዋን ይጅምር",
      "chatNotice": "ንኣጋይሽ ዓለምለኸ ዝተሰናደአ ናይ ዩቲዩብ ቀጥታ ፈነወ።"
    },
    "mezmur": {
      "badge": "ዝተመረጹ መዝሙራትን ባህላዊ ዜማታትን",
      "title": "መዝሙራትን ምርጫ ሙዚቃን መርዓ",
      "subtitle": "ብመርዓወታት ዝተመረጹ መንፈሳዊ መዝሙራትን ባህላዊ ዜማታት ምእታው መርዓወታትን።",
      "nowPlaying": "ሕዚ ዝስማዕ ዘሎ",
      "playTrack": "ወልዕ",
      "pauseTrack": "ዓግት"
    },
    "wishes": {
      "badge": "ምርቓትን መልእኽቲ እንቋዕ ደስ በለኩምን",
      "title": "ማህደር ምርቓትን ሰናይ ተመኖን መርዓ",
      "subtitle": "ካብ ልቢ ዝመንጨወ ምርቓትኩም፣ ጸሎትኩም ወይ ናይ ቪዲዮ ሰላምታ ብቀጥታ ንመርዓወታት ለኣኹ።",
      "tabText": "ጽሑፍ ምርቓት",
      "tabVideo": "ቪዲዮ ምርቓት 📹",
      "senderName": "ምሉእ ስምኩም *",
      "senderPlaceholder": "ንኣብነት፡ ኣቦሓጎ በቀለን ቤተሰብን",
      "messageLabel": "ዝተባረኸ ምርቓትኩም *",
      "messagePlaceholder": "ንመርዓወታት ሰናይ ተመኖኹምን ጸሎትኩምን ኣብዚ ጽሓፉ...",
      "videoUrlLabel": "መላገቢ ቪዲዮ ምርቓት ወይ ካብ ሞባይልኩም ቪዲዮ ምረጹ",
      "chooseVideoDevice": "ቪዲዮ ምርቓት ካብ ሞባይልኩም ምረጹ",
      "submitButton": "ምርቓትኩም ንመርዓወታት ለኣኹ 💍",
      "sendingButton": "ይልኣኽ ኣሎ...",
      "successMsg": "ምርቓትኩም ብቀጥታ ንመርዓወታት በጺሑ ኣሎ! የቐንየልና።",
      "emptyWall": "ቀዳማይ መራቒ ብምዃን ንመርዓወታት ምርቓትኩም ለኣኹ!"
    },
    "qrPass": {
      "badge": "ዲጂታል ፍቓድ ኣታዊ",
      "title": "ፓስፖርት ፍቓድ ኣታዊ QR መርዓ",
      "subtitle": "በጃኹም ናብ ኣዳራሽ መርዓ ክትኣተው ከለኹም ነዚ ንዓኹም ዝተዳለወ ፍሉይ QR ኮድ ንሓለውቲ ማዕጾ ኣርእዩ።",
      "vipEntry": "መኣተዊ ክቡራት ኣጋይሽ",
      "quotaAllowed": "ዝተፈቐደ ብዝሒ ሰባት",
      "scanInstructions": "ኣብ ዋና ማዕጾ ሸራተን ኣዲስ ኣመርምሩ",
      "downloadPass": "ፍቓድ ኣታዊ ብምስሊ ኣውርድ",
      "printPass": "ፍቓድ ኣታዊ ሕተም"
    }
  },
  "feed": {
    "title": "ቪዲዮታት መዘከርታ መርዓ",
    "sharedBy": "ዝተሃበ ብ",
    "comments": "ርእዮታት",
    "addComment": "ጽቡቕ ርእዮት ወስኽ...",
    "postComment": "ለኣኽ",
    "doubleTapLike": "ንፈተውቲ ክልተ ግዘ ጠውቕ",
    "uploadMoments": "ቪዲዮ መዘከርታ ስቐል",
    "uploadTitle": "መዘከርታታት መርዓ ኣካፍል",
    "uploaderName": "ስምኩም *",
    "captionLabel": "መግለጺ / መልእኽቲ *",
    "chooseMedia": "ቪዲዮ ካብ ሞባይልኩም ምረጹ",
    "publishButton": "ንቪዲዮታት መርዓ ለኣኽ 🚀",
    "publishing": "ይስቐል ኣሎ...",
    "emptyFeed": "ክሳብ ሕዚ ዝተሰቐለ ቪዲዮ የለን። ቀዳማይ ኩን!"
  },
  "coupleDashboard": {
    "header": {
      "badge": "ማእከል መርዓወታት",
      "title": "ብሕታዊ መቆፃፀሪ መርዓወታት",
      "guestsAttending": "ዝመፁ ኣጋይሽ"
    },
    "tabs": {
      "setup": "0. ሓበሬታ መርዓን ምድላውን",
      "invites": "1. ፃውዒት ኣጋይሽን QR ኣታዊን",
      "staff": "2. ክፍሊ ሓላፍነት ኣሰናዳእቲ",
      "media": "3. ዝተቐበልኩምዎም ቪዲዮታትን ፎቶታትን",
      "broadcast": "4. ሓበሬታ ቀጥታ ፈነወ መዓልቲ መርዓ",
      "thankYou": "5. ድሕሪ መርዓ ናይ ምስጋና መልእኽቲ"
    },
    "setup": {
      "title": "ምስተኻኸሊ ዋና ሓበሬታ መርዓ",
      "subtitle": "ስም ክልቴኹም፣ ውጽኢታዊ ፎቶኹም፣ ቦታን መዓልትን መርዓ ብምእታው ገጽኩም ኣድምቑ።",
      "platformActive": "ሲስተም ክፍቲ እዩ",
      "brideName": "ምሉእ ስም መርዓዊት *",
      "groomName": "ምሉእ ስም መርዓዊ *",
      "photoLabel": "ውጽኢታዊ ፎቶ መርዓወታት (ካብ ሞባይልኩም) *",
      "photoHelp": "ላዕለዋይ ጥራት ዘለዎ PNG ወይ JPG ፎቶ ምረጹ",
      "photoPrompt": "ፎቶ መርዓወታት ንምእታው ኣብዚ ጠውቁ",
      "venueName": "ስም ኣዳራሽ መርዓ *",
      "venueAddress": "ኣድራሻ ኣዳራሽ *",
      "mapLink": "መላገቢ ጉግል ካርታ (Google Maps)",
      "eventDate": "መዓልቲ መርዓ *",
      "startTime": "ሰዓት መበገሲ *",
      "dressCode": "ኮድ ኣከዳድና (Dress Code)",
      "welcomeMsg": "ንኣጋይሽ ዝተመሓላለፈ ናይ እንቋዕ ብደሓን መጻእኩም መልእኽቲ",
      "saveBtn": "ሓበሬታ ዓቅብን ሓድስን 💍",
      "savingBtn": "ይዓቅብ ኣሎ...",
      "successMsg": "ሓበሬታ መርዓኹም ብተዓዋቲ መንገዲ ተሓዲሱ ኣሎ!"
    },
    "invites": {
      "kpiTotal": "ጠቕላላ ዝተዓደሙ",
      "kpiAttending": "ዝመፁ ኣጋይሽ",
      "kpiPending": "ዘይወሰኑ",
      "kpiDeclined": "ዘይመፁ",
      "genTitle": "ሓዲሽ ፃውዒት ጋሻ ምድላው",
      "genSubtitle": "ንካርድ ወረቐት ዝኸውን ፍሉይ QR ਕੋድ ወይ ብቀጥታ ዝልኣኽ ዲጂታል መላገቢ ኣዳሉ።",
      "modeCard": "1) ንሕትመት ካርድ QR",
      "modeLink": "2) ቀጥታ ዲጂታል መላገቢ",
      "guestName": "ስም ጋሻ / ቤተሰብ *",
      "quota": "ዝተፈቐደ ብዝሒ ሰባት *",
      "phone": "ቁጽሪ ስልኪ (ምርጫዊ)",
      "genCardBtn": "ዝሕተም ፍቓድ QR ኣዳሉ",
      "genLinkBtn": "ፍሉይ ዲጂታል መላገቢ ኣዳሉ",
      "tableTitle": "ዝርዝር ዝተዓደሙ ኣጋይሽ",
      "tableSubtitle": "መልሲ ኣጋይሽን ፍቓድ ኣታዊን ተኸታተሉ።",
      "thGuest": "ጋሻ / ቤተሰብ",
      "thType": "ዓይነት ፃውዒት",
      "thQuota": "ብዝሒ",
      "thRsvp": "መልሲ ምብጻሕ",
      "thGate": "ኩነታት ማዕጾ",
      "thActions": "ስጉምቲታት",
      "attending": "ይመፁ",
      "declined": "ኣይመፁን",
      "pendingRsvp": "መልሲ ይፅበ ኣሎ",
      "checkedIn": "ኣቲዮም",
      "awaitingGate": "ማዕጾ ኣይበጽሑን",
      "viewQr": "QR ርአ"
    },
    "staff": {
      "title": "ሓላፍነት ሰራሕተኛታትን ኣጋዦችን መርዓ",
      "subtitle": "ንመፈነውቲ ቀጥታ ፈነወን ንተቆጻጸርቲ ማዕጾን ፍቓድ ሃቡ።",
      "fullName": "ምሉእ ስም ሰራሕተኛ *",
      "email": "ኢሜይል / መኣተዊ *",
      "password": "ጊዜያዊ ሕልፊ ቓል *",
      "role": "ዝተሃበ ሓላፍነት *",
      "roleStreamer": "📹 1) መፈነዊ ቀጥታ ፈነወ",
      "roleScanner": "📱 2) ተቆጻጻሪ QR ማዕጾ",
      "assignBtn": "ሓላፍነት ሃብ",
      "activeCrew": "ዝተመደቡ ሰራሕተኛታት",
      "openPortal": "ክፈት",
      "revokeRole": "ሰርዝ"
    },
    "media": {
      "title": "ዝተቐበልኩምዎም ቪዲዮታትን ማህደር ምርቓትን",
      "subtitle": "ብኣጋይሽ ዝተለኣኹ ቪዲዮታትን ምርቓታትን ኣጽድቑ።",
      "tabAll": "ኩሉ",
      "tabPosted": "🟢 ዝጸደቑ",
      "tabPending": "🟡 ዝፅበዩ",
      "tabRejected": "🔴 ዝተሰረዙ",
      "approve": "ኣጽድቕ",
      "reject": "ሰርዝ",
      "empty": "ኣብዚ ምድብ ዝኾነ ፋይል የለን።"
    },
    "broadcast": {
      "title": "ሓበሬታ ቀጥታ ፈነወ መዓልቲ መርዓ ንኣጋይሽ",
      "subtitle": "ለወጥቲ መደባትን ናይ ደስታ ሓበሬታታትን ብቀጥታ ኣብ ገፅ መርዓ ኣመሓላልፉ።",
      "label": "መልእኽቲ ሓበሬታ",
      "previewTitle": "ገፅታ ሓበሬታ",
      "publishBtn": "ሓበሬታ ንኣጋይሽ ኣመሓላልፍ",
      "publishingBtn": "ብምመሓላላፍ ኣሎ...",
      "successMsg": "ሓበሬታ ኣብ ገፅ መርዓ ብቀጥታ ተመሓላሊፉ ኣሎ!"
    },
    "thankYou": {
      "title": "ድሕሪ መርዓ ናይ ምስጋና መልእኽቲ ማህደር",
      "subtitle": "ድሕሪ ፍጻመ መርዓ ንዝተኣከቡ ኣጋይሽ ኩሎም ዝለዓለ ናይ ምስጋና መልእኽቲ ኣመሓላልፉ።",
      "messageLabel": "ይፋዊ ናይ ምስጋና መልእኽቲ",
      "photoLabel": "ፎቶ ምስጋና (ካብ ሞባይልኩም)",
      "photoPrompt": "ፎቶ ምስጋና ንምእታው ኣብዚ ጠውቁ",
      "sendBtn": "መልእኽቲ ምስጋና ኣመሓላልፍ 💌",
      "sendingBtn": "ብምመሓላላፍ ኣሎ...",
      "successMsg": "ናይ ምስጋና መልእኽቲ ንኹሎም ኣጋይሽ ተመሓላሊፉ ኣሎ!"
    }
  },
  "organizerDashboard": {
    "brand": "አጋፋሪ ፕላነርስ",
    "subtitle": "ማእከል ኣሰናዳእቲ መርዓ",
    "kpiHosting": "ኣብ ስራሕ ዘለዉ",
    "kpiArchive": "ዝተዛዘሙ መርዓታት",
    "tabs": {
      "weddings": "1. ዝምርሑ መርዓታት",
      "credentials": "2. መኣተዊን ፍቓድን መርዓወታት",
      "media": "3. ቁጽጽር ቪዲዮታትን ፎቶታትን"
    },
    "header": {
      "tag": "ኮንሶል መቆፃፀሪ ኣሰናዳእቲ መርዓ",
      "title": "ማእከል መቆፃፀሪ ዝምርሑ መርዓታት",
      "requestBtn": "ንመርዓወታት ፍቓድ መኣተዊ ሕተት"
    },
    "fleet": {
      "all": "ኩሎም መርዓታት",
      "active": "🟢 ኣብ ስራሕ ዘለዉ",
      "archive": "📜 ዝተዛዘሙ መርዓታት",
      "pending": "⏳ ፍቓድ ዝፅበዩ",
      "searchPlaceholder": "መርዓ፣ መርዓዊ ወይ ቦታ ድለ...",
      "selectedRoom": "ዝተመረጸ ክፍሊ መቆፃፀሪ",
      "adminStatus": "ኩነታት ፍቓድ",
      "roleCredentialsTitle": "ዝተመደቡ ሓላፍነታትን ቀጥታ መኣተዊታትን",
      "roleCredentialsSubtitle": "ነቲ ዝተደለየ ሓላፍነት ብምጥዋቕ ብቀጥታ ናብ መቆፃፀሪ ሰራሕተኛ እተው፡",
      "coupleRole": "👑 1) መርዓወታት",
      "coupleDesc": "ምሉእ መቆፃፀሪ መርዓ፣ ፃውዒት ኣጋይሽን ሓበሬታን።",
      "launchCouple": "ናብ መቆፃፀሪ መርዓወታት እተው",
      "copyCouple": "መኣተዊ መርዓወታት ቅዳሕ",
      "streamerRole": "📹 2) መፈነዊ ቀጥታ ፈነወ",
      "streamerDesc": "ቁጽጽር ቀጥታ ፈነወን ካሜራን።",
      "launchStreamer": "ናብ ስቱዲዮ ፈነወ እተው",
      "copyStreamer": "መኣተዊ መፈነዊ ቅዳሕ",
      "scannerRole": "📱 3) ተቆጻጻሪ QR ማዕጾ",
      "scannerDesc": "ምርመራ ኮድ QR ኣብ ማዕጾን ቁጽጽር ኣጋይሽን።",
      "launchScanner": "ናብ ተቆጻጻሪ ማዕጾ እተው",
      "copyScanner": "መኣተዊ ተቆጻጻሪ ቅዳሕ"
    },
    "credentials": {
      "title": "ንመርዓወታት ሕቶ ፍቓድ መኣተዊ ምድላው",
      "subtitle": "ሓበሬታ መርዓ ብምምላእ ካብ ኣመሓዳሪ ሲስተም ፍቓድ ረኸቡ።",
      "brideName": "ምሉእ ስም መርዓዊት *",
      "groomName": "ምሉእ ስም መርዓዊ *",
      "email": "ኢሜይል መርዓወታት (መኣተዊ ሲስተም ይኸውን) *",
      "date": "መዓልቲ መርዓ *",
      "venue": "ቦታ / ኣዳራሽ መርዓ *",
      "submitBtn": "ፍቓድ ሕተት እሞ ኣዳሉ 💍",
      "submittingBtn": "ይልኣኽ ኣሎ...",
      "successTitle": "መኣተዊ መርዓወታት ብተዓዋቲ መንገዲ ተዳሊኡ ኣሎ!",
      "trackerTitle": "መከታተሊ ፍቓዳትን መኣተዊታትን"
    }
  },
  "adminDashboard": {
    "brand": "ሐመልማል ክሬቲቭስ",
    "subtitle": "ዋና ኣመሓዳሪ ሲስተም",
    "kpiPending": "ፍቓድ ዝፅበዩ",
    "kpiActive": "ኣብ ስራሕ ዘለዉ መርዓታት",
    "tabs": {
      "approvals": "1. ፍቓዳትን ማረጋገጺታትን",
      "events": "2. ሓፈሻዊ ዝርዝር መርዓታት",
      "organizers": "3. ትካላት ኣሰናዳእቲ መርዓ",
      "users": "4. ተጠቃምቲ ሲስተም",
      "media": "5. ሓፈሻዊ ማህደር ቪዲዮ"
    },
    "header": {
      "tag": "ዋና ኮንሶል መቆፃፀሪ ፕላትፎርም",
      "title": "ማእከል ዋና ኣመሓዳሪ ሲስተም",
      "createBtn": "ሓዲሽ መርዓ ብቀጥታ ፈቒድካ ክፈት"
    },
    "approvals": {
      "title": "ፍቓድ ዝፅበዩ ሓደስቲ ሕቶታት መርዓ",
      "subtitle": "ካብ ኣሰናዳእቲ ዝቐረቡ ሕቶታት መርዓ መርሚርኩም ኣጽድቑ።",
      "approveBtn": "ፈቒድካ ኣጽድቕ 🟢",
      "rejectBtn": "ነቲ ሕቶ ውድቅ ግበር",
      "approvedTableTitle": "ዝጸደቑን ኣብ ስራሕ ዘለዉን መርዓታት",
      "openCommand": "ናብ መቆፃፀሪ እተው →"
    },
    "fleet": {
      "title": "ሓፈሻዊ መቆፃፀሪ መርዓታትን ሓላፍነታትን",
      "startStream": "መኮረጅ ፈነወ ጀምር",
      "streamLive": "🔴 ፈነወ ብቀጥታ ይፈነው ኣሎ",
      "rolesTitle": "ብተፈላለዩ ሓላፍነታት ናይ ምእታው ቁጽጽር"
    },
    "agencies": {
      "title": "ሓዲሽ ትካል ኣሰናዳኢ መርዓ መዝግብ",
      "subtitle": "ንባለሙያታት ኣሰናዳእቲ መርዓ መኣተዊ ሲስተም ሃቡ።",
      "agencyName": "ስም ትካል *",
      "contactEmail": "ኢሜይል ትካል (መኣተዊ ይኸውን) *",
      "password": "ጊዜያዊ ሕልፊ ቓል *",
      "onboardBtn": "ትካል መዝግብ እሞ ፍቓድ ሃብ 🤝",
      "listTitle": "ዝተመዝገቡ ትካላት ኣሰናዳእቲ"
    },
    "users": {
      "title": "ማህደር ተጠቃምትን ቁጽጽር ድሕንነትን",
      "subtitle": "ሓላፍነት ተጠቃምቲ ተቆጣጸሩ፣ ሕልፊ ቓል ቐይሩ።",
      "resetPassword": "ሕልፊ ቓል ቐይር",
      "newPassword": "ሓዲሽ ጊዜያዊ ሕልፊ ቓል *",
      "updatePasswordBtn": "ሕልፊ ቓል ሓድስ"
    }
  },
  "scanner": {
    "title": "ተርሚናል ተቆጻጻሪ ማዕጾ አጋፋሪ",
    "subtitle": "ምርመራ ፍቓድ QR መኣተዊን ብዝሒ ኣጋይሽን",
    "inputPlaceholder": "ኮድ መኣተዊ እተው (ንኣብነት፡ INV-SD2026-001)...",
    "verifyBtn": "ኮድ መርምር",
    "validPass": "ትክክለኛ ፃውዒት ክቡር ጋሻ",
    "alreadyScanned": "ምእታው ኣይቻልን፡ ኣቀዲሞም ኣቲዮም እዮም",
    "invalidPass": "ዘይተፈልጠ ኮድ መኣተዊ",
    "checkInBtn": "ኣረጋጊፅካ ኣጋይሽ ኣእቱ ✓",
    "checkedInSuccess": "ኣጋይሽ ብተዓዋቲ መንገዲ ኣቲዮም ኣለዉ!"
  },
  "auth": {
    "coupleTitle": "መቆፃፀሪ መርዓወታት",
    "coupleSubtitle": "ብሕታዊ ማእከል መቆፃፀሪ መርዓወታት",
    "organizerTitle": "መቆፃፀሪ ኣሰናዳእቲ መርዓ",
    "organizerSubtitle": "ኮንሶል ምድላውን መሪሕነትን መርዓ",
    "adminTitle": "ዋና ኣመሓዳሪ ሲስተም",
    "adminSubtitle": "ኣመሓዳሪ ፕላትፎርም ሐመልማል ክሬቲቭስ",
    "emailLabel": "ኣድራሻ ኢሜይል",
    "passwordLabel": "ሕልፊ ቓል",
    "signInBtn": "ናብ መቆፃፀሪ እተው",
    "signingIn": "ብምእታው ኣሎ...",
    "invalidCreds": "ስሕተት ኢሜይል ወይ ሕልፊ ቓል!"
  },
  "landing": {
    "nav": {
      "features": "አገልግሎታት",
      "partners": "ተሓባበርቲ",
      "packages": "ፓኬጃት",
      "liveDemo": "ቀጥታ ማሳያ",
      "pastWeddings": "ዝሓለፉ መርዓታት",
      "aboutUs": "ብዛዕባና",
      "bookWedding": "መርዓኹም መዝግቡ",
      "exploreCelebration": "ይፋዊ መርዓ ርኣዩ"
    },
    "hero": {
      "badge": "ቀዳማይ ናይ ንጉስ ዲጂታል ፕላትፎርም መርዓ ኢትዮጵያ",
      "titlePart1": "ደስታ መርዓኹም ናብ ውጹእ",
      "titlePart2": "ዘለዓለማዊ ዲጂታል መዘከርታ ቐይርዎ",
      "description": "ካብ ዝተባረኹ መዓልቲ መቑጸሪታትን ብድሕንነት ካብ ዝተሓለዉ ፍቓድ QR መኣተዊታትን ጀሚሩ ክሳብ ቀጥታ ፈነወን ቪዲዮታት መዘከርታን — አጋፋሪ ንኣጋይሽኩም ኣብ ዝኾነ ጫፍ ዓለም የራኽቦም።",
      "ctaDemo": "ቀጥታ ማሳያ ፍተኑ",
      "ctaPackages": "ፓኬጃት አገልግሎት ርኣዩ",
      "feature1": "ዝኾነ አፕሊኬሽን ምውራድ ኣይደልይን",
      "feature2": "ብድሕንነት ዝተሓለወ QR መኣተዊ",
      "feature3": "ብመርዓዊት ዝጸድቁ መዘከርታታት",
      "feature4": "ኣብ እዋኑ ዝፈነው ቀጥታ ፈነወ"
    },
    "featuresSection": {
      "badge": "ዘመናዊ ቴክኖሎጂ መርዓ ኢትዮጵያ",
      "title": "ንበዓል መርዓኹም",
      "titleScript": "ዘድልዩ",
      "titleEnd": "ኩሎም ነገራት",
      "description": "ካብ መዓልቲ መቑጸሪታት፣ ብድሕንነት ካብ ዝተሓለዉ QR መኣተዊታትን ቀጥታ ፈነወ ዓለምን ዝተኣሳሰረ ዘመናዊ ኣሰራርሓ።",
      "marqueeHint": "ንምእጋድ ማውስኩም ኣንበርኡ",
      "card1Title": "መዓልቲ መቑጸሪን ማህደር ምርቓትን",
      "card1Badge": "መዓልቲ መቑጸሪ",
      "card1Desc": "መዓልቲ መርዓ ዝቖጽር ሰዓትን መኣከቢ ምርቓት ኣጋይሽን። ምርቓታት ብመርዓወታት ምስ ጸደቑ ኣብ መንደቕ ይታኣዩ።",
      "card1Btn": "መዓልቲ መቑጸሪ ርኣዩ",
      "card2Title": "ዲጂታል ፃውዒትን QR መኣተዊን",
      "card2Badge": "ቁጽጽር ድሕንነት",
      "card2Desc": "ዘይተዓደመ ሰብ እንዳይኣቱ ንምቁጽጻርን ዝተፈቐደ ብዝሒ ሰባት ብድሕንነት ንምራጋጋጽ ዝተዳለወ ዘመናዊ ኮድ QR።",
      "card2Btn": "ተቆጻጻሪ ማዕጾ ፍተኑ",
      "card3Title": "ቪዲዮታት መዘከርታን ቀጥታ ፈነወን",
      "card3Badge": "ፈነወ ዓለም",
      "card3Desc": "ብኣጋይሽ ዝስቐሉ ቪዲዮታት መዘከርታን ኣብ መላእ ዓለም ንዘለዉ ኣዝማድ ዝመሓላለፍ ቀጥታ ፈነወ ቪዲዮን።",
      "card3Btn": "ቪዲዮታት መዘከርታ ርኣዩ"
    },
    "partnersSection": {
      "badge": "ኣብ ፍሉጣጥ ሆተላትን ኣዳራሻትን ኢትዮጵያ ዝተኣመነ",
      "title": "ተሓባበርቲ ሆተላትናን ኣዳራሻትናን",
      "sheraton": "ሸራተን ኣዲስ",
      "sheratonType": "ተሓባበሪ ንጉሳዊ ኣዳራሽ",
      "haile": "ኃይሌ ግራንድ ኣዲስ",
      "haileType": "ተሓባበሪ ሪዞርትን ሜዳን",
      "skylight": "ኢትዮጵያ ስካይላይት ሆቴል",
      "skylightType": "ተሓባበሪ ዓብዪ ኣዳራሽ",
      "radisson": "ራዲሰን ብሉ",
      "radissonType": "ተሓባበሪ ክቡራት ኣጋይሽ VIP",
      "kuriftu": "ኩሪፍቱ ሪዞርት",
      "kuriftuType": "ተሓባበሪ መርዓ ሪዞርት",
      "yegara": "የጋራ ሆስቲንግ",
      "yegaraType": "መዋቅር ፈጣን ሲስተም"
    },
    "packagesSection": {
      "badge": "ፓኬጃት አገልግሎት",
      "title": "ንዓኹም ዝተዳለዉ ምርጫታት አገልግሎት",
      "description": "ዝደለխምዎ ፓኬጅ ምረጹ። ሐመልማል ክሬቲቭስ ኩሎም ቴክኒካዊ ስራሕቲ የካይድ።",
      "silverTitle": "ፓኬጅ ሲልቨር (Silver)",
      "silverTag": "መሰረታዊ",
      "silverDesc": "ንዲጂታል ፃውዒታትን ንመዓልቲ መቑጸሪን ዝስማማዕ።",
      "silverF1": "ገፅ መዓልቲ መቑጸሪ መርዓ",
      "silverF2": "ዲጂታል ካርድ ፃውዒትን መከታተሊ ኣጋይሽን",
      "silverF3": "መንደቕ ምርቓትን ጸሎትን (ብቁጽጽር መርዓወታት)",
      "silverBtn": "ብዛዕባ ፓኬጅ ሲልቨር ሕተቱ",
      "goldTitle": "ፓኬጅ ጎልድ ንጉሳዊ (Gold)",
      "goldTag": "ዝተመደበ",
      "goldBadge": "በጣሚ ዝተወደደ ምርጫ",
      "goldDesc": "ቪዲዮታት መዘከርታ፣ ቁጽጽር QR መኣተዊን ቀጥታ ፈነወን ዝሓዘ ምሉእ አገልግሎት።",
      "goldF1": "ኣብ ሲልቨር ዘለዉ ኩሎም አገልግሎታት",
      "goldF2": "ቁጽጽር QR መኣተዊ ማዕጾን ወሳኒ ብዝሒ ሰባትን",
      "goldF3": "መሰቐሊ ማህደር ቪዲዮታትን ፎቶታትን",
      "goldF4": "ኣብ እዋኑ ዝፈነው ቀጥታ ፈነወን ርእዮታትን",
      "goldBtn": "ፓኬጅ ጎልድ ንጉሳዊ እዘዙ",
      "platTitle": "ፓኬጅ ፕላቲነም (Platinum)",
      "platTag": "ምሉእ አገልግሎት",
      "platDesc": "ንዓበይቲ ንጉሳውያን መርዓታት ምስ ኣካል ሰራሕተኛታትን ቀጥታ ስቱዲዮን ዝተዳለወ።",
      "platF1": "ኣብ ጎልድ ዘለዉ ኩሎም አገልግሎታት",
      "platF2": "ኣብ ቦታ መርዓ ዝመደብ ባለሙያ ቀጥታ ፈነወ",
      "platF3": "ኣብ ማዕጾ መርዓ ዝመደቡ ሰራሕተኛታት ቁጽጽር QR",
      "platBtn": "ብዛዕባ ፓኬጅ ፕላቲነም ሕተቱ"
    },
    "demoSection": {
      "badge": "ቀጥታ ማሳያ መርዓ",
      "title": "አጋፋሪ ኣብ ስራሕ እንተሎ ብቀጥታ ርኣዩ",
      "description": "ቁጽጽር መኣተዊን ቀጥታ ፈነወን ብሓደ ጠውቂ ፍተኑ!",
      "tab1": "1. ዋና ገፅ",
      "tab2": "2. ዲጂታል ፃውዒትን QR መኣተዊን",
      "tab3": "3. ቪዲዮታት መዘከርታ",
      "tab4": "4. ብቀጥታ ፈነወ",
      "tab5": "5. ተቆጻጻሪ ማዕጾ",
      "pill1": "መዓልቲ መቑጸሪን መንደቕ ምርቓትን",
      "title1": "ዋና ገፅ (መዓልቲ መቑጸሪ)",
      "desc1": "ሰዓት መዓልቲ መቑጸሪ መርዓ፣ ኣድራሻ ኣዳራሽ፣ ኮድ ኣከዳድናን መሰቐሊ ምርቓትን።",
      "btn1": "ዋና ገፅ ክፈት",
      "pill2": "ብድሕንነት ዝተሓለወ QR መኣተዊ",
      "title2": "ዲጂታል ፃውዒትን QR መኣተዊን",
      "desc2": "ኣፈታሕ ዲጂታል ካርድ፣ ፍቓድ QR መኣተዊን መቆፃፀሪ ዝተፈቐደ ብዝሒ ሰባትን።",
      "btn2": "ዲጂታል ፃውዒት ርኣዩ",
      "pill3": "ብመርዓወታት ዝጸድቕ ማህደር ቪዲዮ",
      "title3": "ቪዲዮታት መዘከርታ (Feed)",
      "desc3": "ብኣጋይሽ ዝስቐሉ ውጽኢታውያን ቪዲዮታት መዘከርታን ሰናይ ተመኖታትን።",
      "btn3": "ቪዲዮታት መዘከርታ ርኣዩ",
      "pill4": "ዓለምለኸ ቀጥታ ፈነወ ዲያስፖራ",
      "title4": "ብቀጥታ ፈነወ",
      "desc4": "ኣብ መላእ ዓለም ንዘለዉ ኣዝማድ ዝመሓላለፍ ፈጣን ቀጥታ ፈነወ ዩቲዩብ።",
      "btn4": "ቀጥታ ፈነወ ርኣዩ",
      "pill5": "ሰራሕተኛ ተቆጻጻሪ ማዕጾ ኣብ ስራሕ",
      "title5": "መተግበሪ ተቆጻጻሪ ማዕጾ",
      "desc5": "ብተቆጻጸርቲ ማዕጾ ዝጥቀሙሉ መርመሪ ኮድ QR እና መቆፃፀሪ ዘይተዓደሙ ሰባት።",
      "btn5": "ተቆጻጻሪ ማዕጾ ፍተኑ"
    },
    "portfolioSection": {
      "badge": "ማህደር ዝተገበሩ መርዓታት",
      "title": "ብአጋፋሪ ዝደመቑ መዘከርታታት መርዓ",
      "description": "መርዓወታትን ኣጋይሽን ብአጋፋሪ ዝረኸብዎ ናይ ደስታ ተሞክሮ ርኣዩ።",
      "card1Couple": "ሳራን ዳዊትን",
      "card1Venue": "ንጉሳዊ ኣዳራሽ ሸራተን ኣዲስ",
      "card1Type": "ንጉሳዊ መርዓ",
      "card1Quote": "\"ኣብ አሜሪካን አውሮፓን ዘለዉ ኣዝማድና መርዓና ብምሉኡ ብቀጥታ ፈነወ ተኸታቲሎም። መንደቕ ምርቓት ብጣዕሚ ልቢ ዝትንክፍ ነይሩ!\"",
      "card2Couple": "ማርታን አቤልን",
      "card2Venue": "ሜዳ ኣዳራሽ ኃይሌ ግራንድ",
      "card2Type": "መዓልቲ መርዓ ሜዳ",
      "card2Quote": "\"ምርመራ QR ዘይተዓደመ ሰብ ከይኣቱ ገይሩልና እዩ። ኣብ ማዕጾ ንኣጋይሽ ምእንግዳድ 3 ሰከንድ ጥራሕ እዩ ወሲዱ!\"",
      "card3Couple": "ትግስትን ሄኖክን",
      "card3Venue": "ኢትዮጵያ ስካይላይት ሆቴል",
      "card3Type": "ባህላዊ ንጉሳዊ መርዓ",
      "card3Quote": "\"ድሕሪ መርዓና ብኣጋይሽ ዝተሰቐሉ ቪዲዮታት መዘከርታ ምእላይ ዓብዪ ደስታ ሂቡና እዩ!\"",
      "verified": "ዝተረጋገጸ መርዓ"
    },
    "aboutSection": {
      "badge": "ብሐመልማል ክሬቲቭስ ዝተገነበ",
      "title": "ባህሊ መርዓ ኢትዮጵያ ብቴክኖሎጂ ምዕባይ",
      "description": "ሐመልማል ክሬቲቭስ ኣብ ኢትዮጵያ ቀዳማይ ዝኾነ ናይ ሶፍትዌርን ሚዲያን ትካል እንትሆን፣ ዘመናዊ ኣሰራርሓታት መርዓን ውጽኢት ቴክኖሎጂን የቕርብ።",
      "visitBtn": "ይፋዊ ድረ-ገፅ ሐመልማል ክሬቲቭስ ጎብኙ",
      "card1Title": "ላዕለዋይ ጥራት ቴክኖሎጂ",
      "card1Desc": "ብላዕለዋይ ቴክኖሎጂ Next.js ዝተገነበ፣ ቁጽጽር ድሕንነት QR እና ፈጣን ቀጥታ ፈነወ ዘለዎ።",
      "card1Stat1": "99.9%",
      "card1Label1": "እምነት ሲስተም",
      "card1Stat2": "< 3 ሰከንድ",
      "card1Label2": "ምርመራ ኮድ መኣተዊ",
      "card2Title": "ምሉእ ኣካል አገልግሎት ቴክኒክ",
      "card2Desc": "ባለሙያታትና ኣብ መዓልቲ መርዓኹም ፈነወን ቁጽጽር ማዕጾን ብምሉኡ የካይዱ።",
      "card2Stat1": "100%",
      "card2Label1": "ብመርዓዊት ዝጸደቕ",
      "card2Stat2": "Global",
      "card2Label2": "ተበጻሕነት ፈነወ"
    },
    "footer": {
      "brandDesc": "ቀዳማይ ናይ ንጉስ ዲጂታል ፕላትፎርም መርዓ ኢትዮጵያ፤ ኣብ መላእ ዓለም ንዘለዉ ኣዝማድ ብቴክኖሎጂ የራኽብ።",
      "visitParent": "እናት ትካል ጎብኙ፡ ሐመልማል ክሬቲቭስ",
      "colFeatures": "አገልግሎታት ፕላትፎርም",
      "f1": "ዲጂታል ፃውዒትን QR መኣተዊን",
      "f2": "ሰዓት መዓልቲ መቑጸሪ",
      "f3": "ቪዲዮታት መዘከርታ",
      "f4": "ኣብ እዋኑ ዝፈነው ቀጥታ ፈነወ",
      "colResources": "ሓበሬታታትን ድሕንነትን",
      "faq": "ተደጋጊሞም ዝሕተቱ ሕቶታት (FAQ)",
      "privacy": "ፖሊሲ ድሕንነትን ሓበሬታን",
      "packages": "ፓኬጃት አገልግሎትን ዋጋን",
      "partners": "ተሓባበርቲ ሆተላት",
      "demo": "ገፅ ቀጥታ ማሳያ",
      "colContact": "ርክብን ደጋፍን",
      "address": "ኣዲስ ኣበባ፣ ኢትዮጵያ",
      "copyright": "አጋፋሪ ዲጂታል ፕላትፎርም © 2026 ሐመልማል ክሬቲቭስ። መሰሉ ብሕጊ ዝተሓለወ እዩ።",
      "ssl": "ብላዕለዋይ ድሕንነት ዝተሓለወ"
    },
    "mobileNav": {
      "features": "አገልግሎታት",
      "packages": "ፓኬጃት",
      "demo": "ቀጥታ ማሳያ",
      "weddings": "መርዓታት",
      "about": "ብዛዕባና"
    },
    "faqModal": {
      "title": "ተደጋጊሞም ዝሕተቱ ሕቶታት (FAQ)",
      "subtitle": "ብዛዕባ ቴክኖሎጂ መርዓ አጋፋሪ ክትፈልጥዎ ዝደለኹም ኩሉ ኣብዚ ረኽብዎ።",
      "q1": "ኣጋይሽ መርዓ ዲጂታል ፃውዒቶም ብኸመይ ረኽቡ?",
      "a1": "መርዓወታት ወይ ኣሰናዳእቲ ፍሉይ ዲጂታል መላገቢ ንኣጋይሽ ይልኣኹ። ኣጋይሽ ዝኾነ አፕሊኬሽን ከየውረዱ ነቲ መላገቢ ብምጥዋቕ ሓበሬታ መርዓን QR መኣተዊኦምን ረኽቡ።",
      "q2": "ተቆጻጻሪ QR ማዕጾ ዘይተዓደመ ሰብ ከይኣቱ ብኸመይ ይከላኸል?",
      "a2": "ነፍሲ ወከፍ ኮድ QR ንዝተወሰነ ብዝሒ ሰባት ጥራሕ ዝተፈቐደ ብምዃኑ ኣብ ማዕጾ ምስ ተመርመረ ብድገም ብፎቶኮፒ ወይ ብስክሪንሾት ምጥቃም ኣይቻልን።",
      "q3": "መርዓወታት ብኣጋይሽ ዝተለኣኹ ፎቶታትን ቪዲዮታትን መሪጾም ማጽደቕ ይኽእሉዶ?",
      "a3": "እወ! ብኣጋይሽ ዝልኣኹ ፎቶታትን ቪዲዮታትን ኩሎም መጀመርታ ናብ መቆፃፀሪ መርዓወታት ይኣተው። መርዓወታት ዝጸደቕዎም ጥራሕ ይፋውያን ይኾኑ።",
      "q4": "ኣብ ወጻኢ ዓለም ንዘለዉ ኣዝማድ ቀጥታ ፈነወ አገልግሎት ኣለኩምዶ?",
      "a4": "ብርግጽ። ኣብ መላእ ዓለም ዘለዉ ቤተሰብኩም መርዓኹም ብዘይተሓሰበ መዘገዪ ብቀጥታ ፈነወ ክተFollow ይኽእሉ እዮም።"
    },
    "privacyModal": {
      "title": "ፖሊሲ ድሕንነትን ሓበሬታን",
      "subtitle": "ሓበሬታ መርዓወታትን ኣጋይሽን ብላዕለዋይ ድሕንነት ናይ ምሕላው ቃል ኪዳንና።",
      "p1Title": "1. ዝተሓለወ ማህደር ሓበሬታ፡",
      "p1Text": "ብኣጋይሽ ዝልኣኹ ፎቶታትን ቪዲዮታትን ኩሎም ብላዕለዋይ ድሕንነት ዝተሓለዉ ኮይኖም ንመርዓወታት ጥራሕ ክፍት ይኾኑ።",
      "p2Title": "2. ስልጣን ማጽደቕ መርዓወታት፡",
      "p2Text": "ብመርዓወታት ዘይጸደቐ ዝኾነ ቪዲዮ ወይ ፎቶ ኣብ ይፋዊ ገፅ ኣይለጥፍን።",
      "p3Title": "3. ሓበሬታ QR መኣተዊ፡",
      "p3Text": "ኮዳት መኣተዊን ሓበሬታ ኣጋይሽን ንሳልሳይ ወገን ብፍጹም ኣይወሃብን።",
      "p4Title": "4. ምድምሳስ ሓበሬታ፡",
      "p4Text": "መርዓወታት ብዝደለይዎ እዋን ዘይተደለዩ ፎቶታትን ቪዲዮታትን ካብ ሲስተም ብምሉኡ ክደம்சሱ ይኽእሉ።"
    }
  }
}

```

### File: `frontend/tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 90%+ LUMINOUS WHITE DOMINANT CANVAS, SELECTIVE BLACK ACCENTS & METALLIC GOLD HIGHLIGHTS
        neutral: {
          DEFAULT: '#FFFFFF', // 90%+ Dominant White Canvas
          soft: '#FAFAFA',
          card: '#FFFFFF',
          border: '#E5E7EB',
        },
        black: {
          DEFAULT: '#0A0A0A',
          pure: '#000000',
          rich: '#0F0F0F',
          card: '#141414',
          surface: '#1E1E1E',
          border: '#2A2A2A',
        },
        gold: {
          DEFAULT: '#D4AF37', // Metallic Gold for Unique Fonts & Design Elements
          light: '#F5E6AD',
          dark: '#B8860B',
          hover: '#C5A059',
          50: '#FDFBF0',
          100: '#FAF3D1',
          200: '#F5E6AD',
          300: '#EECD73',
          400: '#E5BD46',
          500: '#D4AF37',
          600: '#B8860B',
          700: '#8C6C1B',
          800: '#634B12',
          900: '#3D2D0B',
        },
        metallic: {
          DEFAULT: '#D4AF37',
          light: '#F5E6AD',
          dark: '#B8860B',
          hover: '#C5A059',
        },
        charcoal: {
          DEFAULT: '#111827',
          dark: '#0A0A0A',
          light: '#4B5563',
        },
        sage: {
          DEFAULT: '#E5E7EB', // Soft light border
          dark: '#0A0A0A',    // Black accent
          light: '#F9FAFB',
          muted: '#FFFFFF',   // Bright Luminous White Background
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Noto Serif Ethiopic', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Noto Sans Ethiopic', 'Inter', 'sans-serif'],
        script: ['var(--font-script)', 'Great Vibes', 'Noto Serif Ethiopic', 'cursive'],
        ethiopicSerif: ['Noto Serif Ethiopic', 'Abyssinica SIL', 'serif'],
        ethiopicSans: ['Noto Sans Ethiopic', 'sans-serif'],
        ethiopicScript: ['Noto Serif Ethiopic', 'Great Vibes', 'serif'],
      },
      boxShadow: {
        gold: '0 10px 30px -10px rgba(212, 175, 55, 0.35)',
        accent: '0 10px 30px -10px rgba(212, 175, 55, 0.35)',
        glass: '0 8px 30px 0 rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;

```

### File: `frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    ".next/dev"
  ]
}

```

### File: `frontend/tsconfig.tsbuildinfo`

```
{"fileNames":["./node_modules/typescript/lib/lib.es5.d.ts","./node_modules/typescript/lib/lib.es2015.d.ts","./node_modules/typescript/lib/lib.es2016.d.ts","./node_modules/typescript/lib/lib.es2017.d.ts","./node_modules/typescript/lib/lib.es2018.d.ts","./node_modules/typescript/lib/lib.es2019.d.ts","./node_modules/typescript/lib/lib.es2020.d.ts","./node_modules/typescript/lib/lib.es2021.d.ts","./node_modules/typescript/lib/lib.es2022.d.ts","./node_modules/typescript/lib/lib.es2023.d.ts","./node_modules/typescript/lib/lib.es2024.d.ts","./node_modules/typescript/lib/lib.esnext.d.ts","./node_modules/typescript/lib/lib.dom.d.ts","./node_modules/typescript/lib/lib.dom.iterable.d.ts","./node_modules/typescript/lib/lib.es2015.core.d.ts","./node_modules/typescript/lib/lib.es2015.collection.d.ts","./node_modules/typescript/lib/lib.es2015.generator.d.ts","./node_modules/typescript/lib/lib.es2015.iterable.d.ts","./node_modules/typescript/lib/lib.es2015.promise.d.ts","./node_modules/typescript/lib/lib.es2015.proxy.d.ts","./node_modules/typescript/lib/lib.es2015.reflect.d.ts","./node_modules/typescript/lib/lib.es2015.symbol.d.ts","./node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts","./node_modules/typescript/lib/lib.es2016.array.include.d.ts","./node_modules/typescript/lib/lib.es2016.intl.d.ts","./node_modules/typescript/lib/lib.es2017.arraybuffer.d.ts","./node_modules/typescript/lib/lib.es2017.date.d.ts","./node_modules/typescript/lib/lib.es2017.object.d.ts","./node_modules/typescript/lib/lib.es2017.sharedmemory.d.ts","./node_modules/typescript/lib/lib.es2017.string.d.ts","./node_modules/typescript/lib/lib.es2017.intl.d.ts","./node_modules/typescript/lib/lib.es2017.typedarrays.d.ts","./node_modules/typescript/lib/lib.es2018.asyncgenerator.d.ts","./node_modules/typescript/lib/lib.es2018.asynciterable.d.ts","./node_modules/typescript/lib/lib.es2018.intl.d.ts","./node_modules/typescript/lib/lib.es2018.promise.d.ts","./node_modules/typescript/lib/lib.es2018.regexp.d.ts","./node_modules/typescript/lib/lib.es2019.array.d.ts","./node_modules/typescript/lib/lib.es2019.object.d.ts","./node_modules/typescript/lib/lib.es2019.string.d.ts","./node_modules/typescript/lib/lib.es2019.symbol.d.ts","./node_modules/typescript/lib/lib.es2019.intl.d.ts","./node_modules/typescript/lib/lib.es2020.bigint.d.ts","./node_modules/typescript/lib/lib.es2020.date.d.ts","./node_modules/typescript/lib/lib.es2020.promise.d.ts","./node_modules/typescript/lib/lib.es2020.sharedmemory.d.ts","./node_modules/typescript/lib/lib.es2020.string.d.ts","./node_modules/typescript/lib/lib.es2020.symbol.wellknown.d.ts","./node_modules/typescript/lib/lib.es2020.intl.d.ts","./node_modules/typescript/lib/lib.es2020.number.d.ts","./node_modules/typescript/lib/lib.es2021.promise.d.ts","./node_modules/typescript/lib/lib.es2021.string.d.ts","./node_modules/typescript/lib/lib.es2021.weakref.d.ts","./node_modules/typescript/lib/lib.es2021.intl.d.ts","./node_modules/typescript/lib/lib.es2022.array.d.ts","./node_modules/typescript/lib/lib.es2022.error.d.ts","./node_modules/typescript/lib/lib.es2022.intl.d.ts","./node_modules/typescript/lib/lib.es2022.object.d.ts","./node_modules/typescript/lib/lib.es2022.string.d.ts","./node_modules/typescript/lib/lib.es2022.regexp.d.ts","./node_modules/typescript/lib/lib.es2023.array.d.ts","./node_modules/typescript/lib/lib.es2023.collection.d.ts","./node_modules/typescript/lib/lib.es2023.intl.d.ts","./node_modules/typescript/lib/lib.es2024.arraybuffer.d.ts","./node_modules/typescript/lib/lib.es2024.collection.d.ts","./node_modules/typescript/lib/lib.es2024.object.d.ts","./node_modules/typescript/lib/lib.es2024.promise.d.ts","./node_modules/typescript/lib/lib.es2024.regexp.d.ts","./node_modules/typescript/lib/lib.es2024.sharedmemory.d.ts","./node_modules/typescript/lib/lib.es2024.string.d.ts","./node_modules/typescript/lib/lib.esnext.array.d.ts","./node_modules/typescript/lib/lib.esnext.collection.d.ts","./node_modules/typescript/lib/lib.esnext.intl.d.ts","./node_modules/typescript/lib/lib.esnext.disposable.d.ts","./node_modules/typescript/lib/lib.esnext.promise.d.ts","./node_modules/typescript/lib/lib.esnext.decorators.d.ts","./node_modules/typescript/lib/lib.esnext.iterator.d.ts","./node_modules/typescript/lib/lib.esnext.float16.d.ts","./node_modules/typescript/lib/lib.esnext.error.d.ts","./node_modules/typescript/lib/lib.esnext.sharedmemory.d.ts","./node_modules/typescript/lib/lib.decorators.d.ts","./node_modules/typescript/lib/lib.decorators.legacy.d.ts","./node_modules/next/dist/styled-jsx/types/css.d.ts","./node_modules/@types/react/global.d.ts","./node_modules/csstype/index.d.ts","./node_modules/@types/prop-types/index.d.ts","./node_modules/@types/react/index.d.ts","./node_modules/next/dist/styled-jsx/types/index.d.ts","./node_modules/next/dist/styled-jsx/types/macro.d.ts","./node_modules/next/dist/styled-jsx/types/style.d.ts","./node_modules/next/dist/styled-jsx/types/global.d.ts","./node_modules/next/dist/shared/lib/amp.d.ts","./node_modules/next/amp.d.ts","./node_modules/@types/node/compatibility/disposable.d.ts","./node_modules/@types/node/compatibility/indexable.d.ts","./node_modules/@types/node/compatibility/iterators.d.ts","./node_modules/@types/node/compatibility/index.d.ts","./node_modules/@types/node/globals.typedarray.d.ts","./node_modules/@types/node/buffer.buffer.d.ts","./node_modules/@types/node/globals.d.ts","./node_modules/@types/node/web-globals/abortcontroller.d.ts","./node_modules/@types/node/web-globals/domexception.d.ts","./node_modules/@types/node/web-globals/events.d.ts","./node_modules/undici-types/header.d.ts","./node_modules/undici-types/readable.d.ts","./node_modules/undici-types/file.d.ts","./node_modules/undici-types/fetch.d.ts","./node_modules/undici-types/formdata.d.ts","./node_modules/undici-types/connector.d.ts","./node_modules/undici-types/client.d.ts","./node_modules/undici-types/errors.d.ts","./node_modules/undici-types/dispatcher.d.ts","./node_modules/undici-types/global-dispatcher.d.ts","./node_modules/undici-types/global-origin.d.ts","./node_modules/undici-types/pool-stats.d.ts","./node_modules/undici-types/pool.d.ts","./node_modules/undici-types/handlers.d.ts","./node_modules/undici-types/balanced-pool.d.ts","./node_modules/undici-types/agent.d.ts","./node_modules/undici-types/mock-interceptor.d.ts","./node_modules/undici-types/mock-agent.d.ts","./node_modules/undici-types/mock-client.d.ts","./node_modules/undici-types/mock-pool.d.ts","./node_modules/undici-types/mock-errors.d.ts","./node_modules/undici-types/proxy-agent.d.ts","./node_modules/undici-types/env-http-proxy-agent.d.ts","./node_modules/undici-types/retry-handler.d.ts","./node_modules/undici-types/retry-agent.d.ts","./node_modules/undici-types/api.d.ts","./node_modules/undici-types/interceptors.d.ts","./node_modules/undici-types/util.d.ts","./node_modules/undici-types/cookies.d.ts","./node_modules/undici-types/patch.d.ts","./node_modules/undici-types/websocket.d.ts","./node_modules/undici-types/eventsource.d.ts","./node_modules/undici-types/filereader.d.ts","./node_modules/undici-types/diagnostics-channel.d.ts","./node_modules/undici-types/content-type.d.ts","./node_modules/undici-types/cache.d.ts","./node_modules/undici-types/index.d.ts","./node_modules/@types/node/web-globals/fetch.d.ts","./node_modules/@types/node/assert.d.ts","./node_modules/@types/node/assert/strict.d.ts","./node_modules/@types/node/async_hooks.d.ts","./node_modules/@types/node/buffer.d.ts","./node_modules/@types/node/child_process.d.ts","./node_modules/@types/node/cluster.d.ts","./node_modules/@types/node/console.d.ts","./node_modules/@types/node/constants.d.ts","./node_modules/@types/node/crypto.d.ts","./node_modules/@types/node/dgram.d.ts","./node_modules/@types/node/diagnostics_channel.d.ts","./node_modules/@types/node/dns.d.ts","./node_modules/@types/node/dns/promises.d.ts","./node_modules/@types/node/domain.d.ts","./node_modules/@types/node/events.d.ts","./node_modules/@types/node/fs.d.ts","./node_modules/@types/node/fs/promises.d.ts","./node_modules/@types/node/http.d.ts","./node_modules/@types/node/http2.d.ts","./node_modules/@types/node/https.d.ts","./node_modules/@types/node/inspector.generated.d.ts","./node_modules/@types/node/module.d.ts","./node_modules/@types/node/net.d.ts","./node_modules/@types/node/os.d.ts","./node_modules/@types/node/path.d.ts","./node_modules/@types/node/perf_hooks.d.ts","./node_modules/@types/node/process.d.ts","./node_modules/@types/node/punycode.d.ts","./node_modules/@types/node/querystring.d.ts","./node_modules/@types/node/readline.d.ts","./node_modules/@types/node/readline/promises.d.ts","./node_modules/@types/node/repl.d.ts","./node_modules/@types/node/sea.d.ts","./node_modules/@types/node/stream.d.ts","./node_modules/@types/node/stream/promises.d.ts","./node_modules/@types/node/stream/consumers.d.ts","./node_modules/@types/node/stream/web.d.ts","./node_modules/@types/node/string_decoder.d.ts","./node_modules/@types/node/test.d.ts","./node_modules/@types/node/timers.d.ts","./node_modules/@types/node/timers/promises.d.ts","./node_modules/@types/node/tls.d.ts","./node_modules/@types/node/trace_events.d.ts","./node_modules/@types/node/tty.d.ts","./node_modules/@types/node/url.d.ts","./node_modules/@types/node/util.d.ts","./node_modules/@types/node/v8.d.ts","./node_modules/@types/node/vm.d.ts","./node_modules/@types/node/wasi.d.ts","./node_modules/@types/node/worker_threads.d.ts","./node_modules/@types/node/zlib.d.ts","./node_modules/@types/node/index.d.ts","./node_modules/next/dist/server/get-page-files.d.ts","./node_modules/@types/react/canary.d.ts","./node_modules/@types/react/experimental.d.ts","./node_modules/@types/react-dom/index.d.ts","./node_modules/@types/react-dom/canary.d.ts","./node_modules/@types/react-dom/experimental.d.ts","./node_modules/next/dist/compiled/webpack/webpack.d.ts","./node_modules/next/dist/server/config.d.ts","./node_modules/next/dist/lib/load-custom-routes.d.ts","./node_modules/next/dist/shared/lib/image-config.d.ts","./node_modules/next/dist/build/webpack/plugins/subresource-integrity-plugin.d.ts","./node_modules/next/dist/server/body-streams.d.ts","./node_modules/next/dist/server/future/route-kind.d.ts","./node_modules/next/dist/server/future/route-definitions/route-definition.d.ts","./node_modules/next/dist/server/future/route-matches/route-match.d.ts","./node_modules/next/dist/client/components/app-router-headers.d.ts","./node_modules/next/dist/server/request-meta.d.ts","./node_modules/next/dist/server/lib/revalidate.d.ts","./node_modules/next/dist/server/config-shared.d.ts","./node_modules/next/dist/server/base-http/index.d.ts","./node_modules/next/dist/server/api-utils/index.d.ts","./node_modules/next/dist/server/node-environment.d.ts","./node_modules/next/dist/server/require-hook.d.ts","./node_modules/next/dist/server/node-polyfill-crypto.d.ts","./node_modules/next/dist/lib/page-types.d.ts","./node_modules/next/dist/build/analysis/get-page-static-info.d.ts","./node_modules/next/dist/build/webpack/loaders/get-module-build-info.d.ts","./node_modules/next/dist/build/webpack/plugins/middleware-plugin.d.ts","./node_modules/next/dist/server/render-result.d.ts","./node_modules/next/dist/server/future/helpers/i18n-provider.d.ts","./node_modules/next/dist/server/web/next-url.d.ts","./node_modules/next/dist/compiled/@edge-runtime/cookies/index.d.ts","./node_modules/next/dist/server/web/spec-extension/cookies.d.ts","./node_modules/next/dist/server/web/spec-extension/request.d.ts","./node_modules/next/dist/server/web/spec-extension/fetch-event.d.ts","./node_modules/next/dist/server/web/spec-extension/response.d.ts","./node_modules/next/dist/server/web/types.d.ts","./node_modules/next/dist/lib/setup-exception-listeners.d.ts","./node_modules/next/dist/lib/constants.d.ts","./node_modules/next/dist/build/index.d.ts","./node_modules/next/dist/build/webpack/plugins/pages-manifest-plugin.d.ts","./node_modules/next/dist/shared/lib/router/utils/route-regex.d.ts","./node_modules/next/dist/shared/lib/router/utils/route-matcher.d.ts","./node_modules/next/dist/shared/lib/router/utils/parse-url.d.ts","./node_modules/next/dist/server/base-http/node.d.ts","./node_modules/next/dist/server/font-utils.d.ts","./node_modules/next/dist/build/webpack/plugins/flight-manifest-plugin.d.ts","./node_modules/next/dist/server/future/route-modules/route-module.d.ts","./node_modules/next/dist/shared/lib/deep-readonly.d.ts","./node_modules/next/dist/server/load-components.d.ts","./node_modules/next/dist/shared/lib/router/utils/middleware-route-matcher.d.ts","./node_modules/next/dist/build/webpack/plugins/next-font-manifest-plugin.d.ts","./node_modules/next/dist/server/future/route-definitions/locale-route-definition.d.ts","./node_modules/next/dist/server/future/route-definitions/pages-route-definition.d.ts","./node_modules/next/dist/shared/lib/mitt.d.ts","./node_modules/next/dist/client/with-router.d.ts","./node_modules/next/dist/client/router.d.ts","./node_modules/next/dist/client/route-loader.d.ts","./node_modules/next/dist/client/page-loader.d.ts","./node_modules/next/dist/shared/lib/bloom-filter.d.ts","./node_modules/next/dist/shared/lib/router/router.d.ts","./node_modules/next/dist/shared/lib/router-context.shared-runtime.d.ts","./node_modules/next/dist/shared/lib/loadable-context.shared-runtime.d.ts","./node_modules/next/dist/shared/lib/loadable.shared-runtime.d.ts","./node_modules/next/dist/shared/lib/image-config-context.shared-runtime.d.ts","./node_modules/next/dist/shared/lib/hooks-client-context.shared-runtime.d.ts","./node_modules/next/dist/shared/lib/head-manager-context.shared-runtime.d.ts","./node_modules/next/dist/server/future/route-definitions/app-page-route-definition.d.ts","./node_modules/next/dist/shared/lib/modern-browserslist-target.d.ts","./node_modules/next/dist/shared/lib/constants.d.ts","./node_modules/next/dist/build/webpack/loaders/metadata/types.d.ts","./node_modules/next/dist/build/page-extensions-type.d.ts","./node_modules/next/dist/build/webpack/loaders/next-app-loader.d.ts","./node_modules/next/dist/server/lib/app-dir-module.d.ts","./node_modules/next/dist/server/response-cache/types.d.ts","./node_modules/next/dist/server/response-cache/index.d.ts","./node_modules/next/dist/server/lib/incremental-cache/index.d.ts","./node_modules/next/dist/client/components/hooks-server-context.d.ts","./node_modules/next/dist/server/app-render/dynamic-rendering.d.ts","./node_modules/next/dist/client/components/static-generation-async-storage-instance.d.ts","./node_modules/next/dist/client/components/static-generation-async-storage.external.d.ts","./node_modules/next/dist/server/web/spec-extension/adapters/request-cookies.d.ts","./node_modules/next/dist/server/async-storage/draft-mode-provider.d.ts","./node_modules/next/dist/server/web/spec-extension/adapters/headers.d.ts","./node_modules/next/dist/client/components/request-async-storage-instance.d.ts","./node_modules/next/dist/client/components/request-async-storage.external.d.ts","./node_modules/next/dist/server/app-render/create-error-handler.d.ts","./node_modules/next/dist/server/app-render/app-render.d.ts","./node_modules/next/dist/shared/lib/server-inserted-html.shared-runtime.d.ts","./node_modules/next/dist/shared/lib/amp-context.shared-runtime.d.ts","./node_modules/next/dist/server/future/route-modules/app-page/vendored/contexts/entrypoints.d.ts","./node_modules/next/dist/server/future/route-modules/app-page/module.compiled.d.ts","./node_modules/@types/react/jsx-runtime.d.ts","./node_modules/next/dist/client/components/error-boundary.d.ts","./node_modules/next/dist/client/components/router-reducer/create-initial-router-state.d.ts","./node_modules/next/dist/client/components/app-router.d.ts","./node_modules/next/dist/client/components/layout-router.d.ts","./node_modules/next/dist/client/components/render-from-template-context.d.ts","./node_modules/next/dist/client/components/action-async-storage-instance.d.ts","./node_modules/next/dist/client/components/action-async-storage.external.d.ts","./node_modules/next/dist/client/components/client-page.d.ts","./node_modules/next/dist/client/components/search-params.d.ts","./node_modules/next/dist/client/components/not-found-boundary.d.ts","./node_modules/next/dist/server/app-render/rsc/preloads.d.ts","./node_modules/next/dist/server/app-render/rsc/postpone.d.ts","./node_modules/next/dist/server/app-render/rsc/taint.d.ts","./node_modules/next/dist/server/app-render/entry-base.d.ts","./node_modules/next/dist/build/templates/app-page.d.ts","./node_modules/next/dist/server/future/route-modules/app-page/module.d.ts","./node_modules/next/dist/server/app-render/types.d.ts","./node_modules/next/dist/client/components/router-reducer/fetch-server-response.d.ts","./node_modules/next/dist/client/components/router-reducer/router-reducer-types.d.ts","./node_modules/next/dist/shared/lib/app-router-context.shared-runtime.d.ts","./node_modules/next/dist/server/future/route-modules/pages/vendored/contexts/entrypoints.d.ts","./node_modules/next/dist/server/future/route-modules/pages/module.compiled.d.ts","./node_modules/next/dist/build/templates/pages.d.ts","./node_modules/next/dist/server/future/route-modules/pages/module.d.ts","./node_modules/next/dist/server/render.d.ts","./node_modules/next/dist/server/future/route-definitions/pages-api-route-definition.d.ts","./node_modules/next/dist/server/future/route-matches/pages-api-route-match.d.ts","./node_modules/next/dist/server/future/route-matchers/route-matcher.d.ts","./node_modules/next/dist/server/future/route-matcher-providers/route-matcher-provider.d.ts","./node_modules/next/dist/server/future/route-matcher-managers/route-matcher-manager.d.ts","./node_modules/next/dist/server/future/normalizers/normalizer.d.ts","./node_modules/next/dist/server/future/normalizers/locale-route-normalizer.d.ts","./node_modules/next/dist/server/future/normalizers/request/pathname-normalizer.d.ts","./node_modules/next/dist/server/future/normalizers/request/suffix.d.ts","./node_modules/next/dist/server/future/normalizers/request/rsc.d.ts","./node_modules/next/dist/server/future/normalizers/request/prefix.d.ts","./node_modules/next/dist/server/future/normalizers/request/postponed.d.ts","./node_modules/next/dist/server/future/normalizers/request/action.d.ts","./node_modules/next/dist/server/future/normalizers/request/prefetch-rsc.d.ts","./node_modules/next/dist/server/future/normalizers/request/next-data.d.ts","./node_modules/next/dist/server/base-server.d.ts","./node_modules/next/dist/server/image-optimizer.d.ts","./node_modules/next/dist/server/next-server.d.ts","./node_modules/next/dist/lib/coalesced-function.d.ts","./node_modules/next/dist/server/lib/router-utils/types.d.ts","./node_modules/next/dist/trace/types.d.ts","./node_modules/next/dist/trace/trace.d.ts","./node_modules/next/dist/trace/shared.d.ts","./node_modules/next/dist/trace/index.d.ts","./node_modules/next/dist/build/load-jsconfig.d.ts","./node_modules/next/dist/build/webpack-config.d.ts","./node_modules/next/dist/build/webpack/plugins/define-env-plugin.d.ts","./node_modules/next/dist/build/swc/index.d.ts","./node_modules/next/dist/server/dev/parse-version-info.d.ts","./node_modules/next/dist/server/dev/hot-reloader-types.d.ts","./node_modules/next/dist/telemetry/storage.d.ts","./node_modules/next/dist/server/lib/types.d.ts","./node_modules/next/dist/server/lib/render-server.d.ts","./node_modules/next/dist/server/lib/router-server.d.ts","./node_modules/next/dist/shared/lib/router/utils/path-match.d.ts","./node_modules/next/dist/server/lib/router-utils/filesystem.d.ts","./node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.d.ts","./node_modules/next/dist/server/lib/dev-bundler-service.d.ts","./node_modules/next/dist/server/dev/static-paths-worker.d.ts","./node_modules/next/dist/server/dev/next-dev-server.d.ts","./node_modules/next/dist/server/next.d.ts","./node_modules/next/dist/lib/metadata/types/alternative-urls-types.d.ts","./node_modules/next/dist/lib/metadata/types/extra-types.d.ts","./node_modules/next/dist/lib/metadata/types/metadata-types.d.ts","./node_modules/next/dist/lib/metadata/types/manifest-types.d.ts","./node_modules/next/dist/lib/metadata/types/opengraph-types.d.ts","./node_modules/next/dist/lib/metadata/types/twitter-types.d.ts","./node_modules/next/dist/lib/metadata/types/metadata-interface.d.ts","./node_modules/next/types/index.d.ts","./node_modules/next/dist/shared/lib/html-context.shared-runtime.d.ts","./node_modules/@next/env/dist/index.d.ts","./node_modules/next/dist/shared/lib/utils.d.ts","./node_modules/next/dist/pages/_app.d.ts","./node_modules/next/app.d.ts","./node_modules/next/dist/server/web/spec-extension/unstable-cache.d.ts","./node_modules/next/dist/server/web/spec-extension/revalidate.d.ts","./node_modules/next/dist/server/web/spec-extension/unstable-no-store.d.ts","./node_modules/next/cache.d.ts","./node_modules/next/dist/shared/lib/runtime-config.external.d.ts","./node_modules/next/config.d.ts","./node_modules/next/dist/pages/_document.d.ts","./node_modules/next/document.d.ts","./node_modules/next/dist/shared/lib/dynamic.d.ts","./node_modules/next/dynamic.d.ts","./node_modules/next/dist/pages/_error.d.ts","./node_modules/next/error.d.ts","./node_modules/next/dist/shared/lib/head.d.ts","./node_modules/next/head.d.ts","./node_modules/next/dist/client/components/draft-mode.d.ts","./node_modules/next/dist/client/components/headers.d.ts","./node_modules/next/headers.d.ts","./node_modules/next/dist/shared/lib/get-img-props.d.ts","./node_modules/next/dist/client/image-component.d.ts","./node_modules/next/dist/shared/lib/image-external.d.ts","./node_modules/next/image.d.ts","./node_modules/next/dist/client/link.d.ts","./node_modules/next/link.d.ts","./node_modules/next/dist/client/components/redirect-status-code.d.ts","./node_modules/next/dist/client/components/redirect.d.ts","./node_modules/next/dist/client/components/not-found.d.ts","./node_modules/next/dist/client/components/navigation.react-server.d.ts","./node_modules/next/dist/client/components/navigation.d.ts","./node_modules/next/navigation.d.ts","./node_modules/next/router.d.ts","./node_modules/next/dist/client/script.d.ts","./node_modules/next/script.d.ts","./node_modules/next/dist/server/web/spec-extension/user-agent.d.ts","./node_modules/next/dist/compiled/@edge-runtime/primitives/url.d.ts","./node_modules/next/dist/server/web/spec-extension/image-response.d.ts","./node_modules/next/dist/compiled/@vercel/og/satori/index.d.ts","./node_modules/next/dist/compiled/@vercel/og/emoji/index.d.ts","./node_modules/next/dist/compiled/@vercel/og/types.d.ts","./node_modules/next/server.d.ts","./node_modules/next/types/global.d.ts","./node_modules/next/types/compiled.d.ts","./node_modules/next/index.d.ts","./node_modules/next/image-types/global.d.ts","./next-env.d.ts","./node_modules/source-map-js/source-map.d.ts","./node_modules/postcss/lib/previous-map.d.ts","./node_modules/postcss/lib/input.d.ts","./node_modules/postcss/lib/css-syntax-error.d.ts","./node_modules/postcss/lib/declaration.d.ts","./node_modules/postcss/lib/root.d.ts","./node_modules/postcss/lib/warning.d.ts","./node_modules/postcss/lib/lazy-result.d.ts","./node_modules/postcss/lib/no-work-result.d.ts","./node_modules/postcss/lib/processor.d.ts","./node_modules/postcss/lib/result.d.ts","./node_modules/postcss/lib/document.d.ts","./node_modules/postcss/lib/rule.d.ts","./node_modules/postcss/lib/node.d.ts","./node_modules/postcss/lib/comment.d.ts","./node_modules/postcss/lib/container.d.ts","./node_modules/postcss/lib/at-rule.d.ts","./node_modules/postcss/lib/list.d.ts","./node_modules/postcss/lib/postcss.d.ts","./node_modules/postcss/lib/postcss.d.mts","./node_modules/tailwindcss/types/generated/corepluginlist.d.ts","./node_modules/tailwindcss/types/generated/colors.d.ts","./node_modules/tailwindcss/types/config.d.ts","./node_modules/tailwindcss/types/index.d.ts","./tailwind.config.ts","./src/lib/auth.ts","./src/lib/mockdata.ts","./src/app/api/admin/events/route.ts","./src/app/api/admin/users/route.ts","./src/app/api/auth/login/route.ts","./src/app/api/auth/me/route.ts","./src/app/api/events/[slug]/route.ts","./src/app/api/events/[slug]/invitations/route.ts","./src/app/api/events/[slug]/media/route.ts","./src/app/api/events/[slug]/rsvp/route.ts","./src/app/api/events/[slug]/team/route.ts","./src/app/api/events/[slug]/wishes/route.ts","./src/app/api/organizer/events/route.ts","./src/app/api/organizer/media/route.ts","./src/app/api/organizer/media/comments/route.ts","./src/app/api/organizer/wishes/route.ts","./node_modules/@types/qrcode/index.d.ts","./src/app/api/qr/[code]/route.ts","./src/db/schema.ts","./node_modules/lucide-react/dist/lucide-react.d.ts","./src/locales/en.json","./src/locales/am.json","./src/locales/om.json","./src/locales/ti.json","./src/lib/i18n.tsx","./src/app/layout.tsx","./node_modules/motion-dom/dist/index.d.ts","./node_modules/motion-utils/dist/index.d.ts","./node_modules/framer-motion/dist/index.d.ts","./src/app/page.tsx","./src/app/admin/dashboard/page.tsx","./src/app/admin/login/page.tsx","./src/app/couple/dashboard/page.tsx","./src/app/couple/login/page.tsx","./src/app/event/[slug]/page.tsx","./src/app/event/[slug]/feed/page.tsx","./src/app/event/[slug]/gallery/page.tsx","./src/app/event/[slug]/history/page.tsx","./src/app/event/[slug]/invitation/page.tsx","./src/app/event/[slug]/live/page.tsx","./src/app/event/[slug]/program/page.tsx","./src/app/organizer/dashboard/page.tsx","./src/app/organizer/login/page.tsx","./src/app/scanner/page.tsx","./node_modules/html5-qrcode/esm/core.d.ts","./node_modules/html5-qrcode/esm/camera/core.d.ts","./node_modules/html5-qrcode/esm/experimental-features.d.ts","./node_modules/html5-qrcode/esm/state-manager.d.ts","./node_modules/html5-qrcode/esm/html5-qrcode.d.ts","./node_modules/html5-qrcode/esm/html5-qrcode-scanner.d.ts","./node_modules/html5-qrcode/esm/index.d.ts","./src/components/gatescanner.tsx","./.next/types/app/layout.ts","./.next/types/app/page.ts","./.next/types/app/admin/dashboard/page.ts","./.next/types/app/api/admin/events/route.ts","./.next/types/app/api/admin/users/route.ts","./.next/types/app/api/events/[slug]/route.ts","./.next/types/app/api/events/[slug]/invitations/route.ts","./.next/types/app/api/events/[slug]/media/route.ts","./.next/types/app/api/events/[slug]/rsvp/route.ts","./.next/types/app/api/events/[slug]/team/route.ts","./.next/types/app/api/events/[slug]/wishes/route.ts","./.next/types/app/api/organizer/events/route.ts","./.next/types/app/api/organizer/media/route.ts","./.next/types/app/api/organizer/media/comments/route.ts","./.next/types/app/couple/dashboard/page.ts","./.next/types/app/event/[slug]/page.ts","./.next/types/app/event/[slug]/feed/page.ts","./.next/types/app/event/[slug]/gallery/page.ts","./.next/types/app/event/[slug]/history/page.ts","./.next/types/app/event/[slug]/program/page.ts","./.next/types/app/organizer/dashboard/page.ts","./.next/types/app/scanner/page.ts"],"fileIdsList":[[99,145,359,465],[99,145,404,437],[99,145,404,438],[99,145,404,442],[99,145,404,443],[99,145,404,441],[99,145,404,444],[99,145,404,445],[99,145,404,446],[99,145,404,447],[99,145,404,449],[99,145,404,448],[99,145,359,467],[99,145,359,470],[99,145,359,471],[99,145,359,472],[99,145,359,469],[99,145,359,475],[99,145,359,460],[99,145,359,476],[99,145,359,464],[99,145,359,478],[99,145,407,408],[99,145],[99,142,145],[99,144,145],[145],[99,145,150,178],[99,145,146,151,156,164,175,186],[99,145,146,147,156,164],[94,95,96,99,145],[99,145,148,187],[99,145,149,150,157,165],[99,145,150,175,183],[99,145,151,153,156,164],[99,144,145,152],[99,145,153,154],[99,145,155,156],[99,144,145,156],[99,145,156,157,158,175,186],[99,145,156,157,158,171,175,178],[99,145,153,156,159,164,175,186],[99,145,156,157,159,160,164,175,183,186],[99,145,159,161,175,183,186],[97,98,99,100,101,102,103,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192],[99,145,156,162],[99,145,163,186,191],[99,145,153,156,164,175],[99,145,165],[99,145,166],[99,144,145,167],[99,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192],[99,145,169],[99,145,170],[99,145,156,171,172],[99,145,171,173,187,189],[99,145,156,175,176,178],[99,145,177,178],[99,145,175,176],[99,145,178],[99,145,179],[99,142,145,175,180],[99,145,156,181,182],[99,145,181,182],[99,145,150,164,175,183],[99,145,184],[99,145,164,185],[99,145,159,170,186],[99,145,150,187],[99,145,175,188],[99,145,163,189],[99,145,190],[99,140,145],[99,140,145,156,158,167,175,178,186,189,191],[99,145,175,192],[99,145,175,193],[87,99,145,197,198,199],[87,99,145,197,198],[87,99,145],[87,91,99,145,196,360,403],[87,91,99,145,195,360,403],[84,85,86,99,145],[87,99,145,286,461,462],[99,145,479,482,483],[99,145,479,480,481,482],[99,145,479,480,482,483,484],[92,99,145],[99,145,364],[99,145,366,367,368],[99,145,370],[99,145,202,212,218,220,360],[99,145,202,209,211,214,232],[99,145,212],[99,145,212,214,338],[99,145,267,285,300,406],[99,145,308],[99,145,202,212,219,253,263,335,336,406],[99,145,219,406],[99,145,212,263,264,265,406],[99,145,212,219,253,406],[99,145,406],[99,145,202,219,220,406],[99,145,293],[99,144,145,193,292],[87,99,145,286,287,288,305,306],[87,99,145,286],[99,145,276],[99,145,275,277,380],[87,99,145,286,287,303],[99,145,282,306,392],[99,145,390,391],[99,145,226,389],[99,145,279],[99,144,145,193,226,242,275,276,277,278],[87,99,145,303,305,306],[99,145,303,305],[99,145,303,304,306],[99,145,170,193],[99,145,274],[99,144,145,193,211,213,270,271,272,273],[87,99,145,203,383],[87,99,145,186,193],[87,99,145,219,251],[87,99,145,219],[99,145,249,254],[87,99,145,250,363],[87,91,99,145,159,193,195,196,360,401,402],[99,145,360],[99,145,201],[99,145,353,354,355,356,357,358],[99,145,355],[87,99,145,250,286,363],[87,99,145,286,361,363],[87,99,145,286,363],[99,145,159,193,213,363],[99,145,159,193,210,211,222,240,242,274,279,280,302,303],[99,145,271,274,279,287,289,290,291,293,294,295,296,297,298,299,406],[99,145,272],[87,99,145,170,193,211,212,240,242,243,245,270,302,306,360,406],[99,145,159,193,213,214,226,227,275],[99,145,159,193,212,214],[99,145,159,175,193,210,213,214],[99,145,159,170,186,193,210,211,212,213,214,219,222,223,233,234,236,239,240,242,243,244,245,269,270,303,311,313,316,318,321,323,324,325,326],[99,145,159,175,193],[99,145,202,203,204,210,211,360,363,406],[99,145,159,175,186,193,207,337,339,340,406],[99,145,170,186,193,207,210,213,230,234,236,237,238,243,270,316,327,329,335,349,350],[99,145,212,216,270],[99,145,210,212],[99,145,223,317],[99,145,319,320],[99,145,319],[99,145,317],[99,145,319,322],[99,145,206,207],[99,145,206,246],[99,145,206],[99,145,208,223,315],[99,145,314],[99,145,207,208],[99,145,208,312],[99,145,207],[99,145,302],[99,145,159,193,210,222,241,261,267,281,284,301,303],[99,145,255,256,257,258,259,260,282,283,306,361],[99,145,310],[99,145,159,193,210,222,241,247,307,309,311,360,363],[99,145,159,186,193,203,210,212,269],[99,145,266],[99,145,159,193,343,348],[99,145,233,242,269,363],[99,145,331,335,349,352],[99,145,159,216,335,343,344,352],[99,145,202,212,233,244,346],[99,145,159,193,212,219,244,330,331,341,342,345,347],[99,145,194,240,241,242,360,363],[99,145,159,170,186,193,208,210,211,213,216,221,222,230,233,234,236,237,238,239,243,245,269,270,313,327,328,363],[99,145,159,193,210,212,216,329,351],[99,145,159,193,211,213],[87,99,145,159,170,193,201,203,210,211,214,222,239,240,242,243,245,310,360,363],[99,145,159,170,186,193,205,208,209,213],[99,145,206,268],[99,145,159,193,206,211,222],[99,145,159,193,212,223],[99,145,159,193],[99,145,226],[99,145,225],[99,145,227],[99,145,212,224,226,230],[99,145,212,224,226],[99,145,159,193,205,212,213,219,227,228,229],[87,99,145,303,304,305],[99,145,262],[87,99,145,203],[87,99,145,236],[87,99,145,194,239,242,245,360,363],[99,145,203,383,384],[87,99,145,254],[87,99,145,170,186,193,201,248,250,252,253,363],[99,145,213,219,236],[99,145,235],[87,99,145,157,159,170,193,201,254,263,360,361,362],[83,87,88,89,90,99,145,195,196,360,403],[99,145,150],[99,145,332,333,334],[99,145,332],[99,145,372],[99,145,374],[99,145,376],[99,145,378],[99,145,381],[99,145,385],[91,93,99,145,360,365,369,371,373,375,377,379,382,386,388,394,395,397,404,405,406],[99,145,387],[99,145,393],[99,145,250],[99,145,396],[99,144,145,227,228,229,230,398,399,400,403],[99,145,193],[87,91,99,145,159,161,170,193,195,196,197,199,201,214,352,359,363,403],[99,145,425],[99,145,423,425],[99,145,414,422,423,424,426,428],[99,145,412],[99,145,415,420,425,428],[99,145,411,428],[99,145,415,416,419,420,421,428],[99,145,415,416,417,419,420,428],[99,145,412,413,414,415,416,420,421,422,424,425,426,428],[99,145,428],[99,145,410,412,413,414,415,416,417,419,420,421,422,423,424,425,426,427],[99,145,410,428],[99,145,415,417,418,420,421,428],[99,145,419,428],[99,145,420,421,425,428],[99,145,413,423],[99,145,430,431],[99,145,429,432],[99,112,116,145,186],[99,112,145,175,186],[99,107,145],[99,109,112,145,183,186],[99,145,164,183],[99,107,145,193],[99,109,112,145,164,186],[99,104,105,108,111,145,156,175,186],[99,112,119,145],[99,104,110,145],[99,112,133,134,145],[99,108,112,145,178,186,193],[99,133,145,193],[99,106,107,145,193],[99,112,145],[99,106,107,108,109,110,111,112,113,114,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,134,135,136,137,138,139,145],[99,112,127,145],[99,112,119,120,145],[99,110,112,120,121,145],[99,111,145],[99,104,107,112,145],[99,112,116,120,121,145],[99,116,145],[99,110,112,115,145,186],[99,104,109,112,119,145],[99,145,175],[99,107,112,133,145,191,193],[87,99,145,388,454,459,463],[87,99,145,388,394,454,459],[99,145,404,435,436],[99,145,404,436],[99,145,404,451],[87,99,145,388,394,454,463],[87,99,145,394],[87,99,145,388,394,454,459,463],[99,145,407,459],[87,99,145,388,454,459],[87,99,145,454,485],[99,145,150,404],[87,99,145,454,455,456,457,458],[99,145,435],[99,145,433]],"fileInfos":[{"version":"c430d44666289dae81f30fa7b2edebf186ecc91a2d4c71266ea6ae76388792e1","affectsGlobalScope":true,"impliedFormat":1},{"version":"45b7ab580deca34ae9729e97c13cfd999df04416a79116c3bfb483804f85ded4","impliedFormat":1},{"version":"3facaf05f0c5fc569c5649dd359892c98a85557e3e0c847964caeb67076f4d75","impliedFormat":1},{"version":"e44bb8bbac7f10ecc786703fe0a6a4b952189f908707980ba8f3c8975a760962","impliedFormat":1},{"version":"5e1c4c362065a6b95ff952c0eab010f04dcd2c3494e813b493ecfd4fcb9fc0d8","impliedFormat":1},{"version":"68d73b4a11549f9c0b7d352d10e91e5dca8faa3322bfb77b661839c42b1ddec7","impliedFormat":1},{"version":"5efce4fc3c29ea84e8928f97adec086e3dc876365e0982cc8479a07954a3efd4","impliedFormat":1},{"version":"feecb1be483ed332fad555aff858affd90a48ab19ba7272ee084704eb7167569","impliedFormat":1},{"version":"ee7bad0c15b58988daa84371e0b89d313b762ab83cb5b31b8a2d1162e8eb41c2","impliedFormat":1},{"version":"27bdc30a0e32783366a5abeda841bc22757c1797de8681bbe81fbc735eeb1c10","impliedFormat":1},{"version":"8fd575e12870e9944c7e1d62e1f5a73fcf23dd8d3a321f2a2c74c20d022283fe","impliedFormat":1},{"version":"2ab096661c711e4a81cc464fa1e6feb929a54f5340b46b0a07ac6bbf857471f0","impliedFormat":1},{"version":"080941d9f9ff9307f7e27a83bcd888b7c8270716c39af943532438932ec1d0b9","affectsGlobalScope":true,"impliedFormat":1},{"version":"2e80ee7a49e8ac312cc11b77f1475804bee36b3b2bc896bead8b6e1266befb43","affectsGlobalScope":true,"impliedFormat":1},{"version":"c57796738e7f83dbc4b8e65132f11a377649c00dd3eee333f672b8f0a6bea671","affectsGlobalScope":true,"impliedFormat":1},{"version":"dc2df20b1bcdc8c2d34af4926e2c3ab15ffe1160a63e58b7e09833f616efff44","affectsGlobalScope":true,"impliedFormat":1},{"version":"515d0b7b9bea2e31ea4ec968e9edd2c39d3eebf4a2d5cbd04e88639819ae3b71","affectsGlobalScope":true,"impliedFormat":1},{"version":"0559b1f683ac7505ae451f9a96ce4c3c92bdc71411651ca6ddb0e88baaaad6a3","affectsGlobalScope":true,"impliedFormat":1},{"version":"0dc1e7ceda9b8b9b455c3a2d67b0412feab00bd2f66656cd8850e8831b08b537","affectsGlobalScope":true,"impliedFormat":1},{"version":"ce691fb9e5c64efb9547083e4a34091bcbe5bdb41027e310ebba8f7d96a98671","affectsGlobalScope":true,"impliedFormat":1},{"version":"8d697a2a929a5fcb38b7a65594020fcef05ec1630804a33748829c5ff53640d0","affectsGlobalScope":true,"impliedFormat":1},{"version":"4ff2a353abf8a80ee399af572debb8faab2d33ad38c4b4474cff7f26e7653b8d","affectsGlobalScope":true,"impliedFormat":1},{"version":"fb0f136d372979348d59b3f5020b4cdb81b5504192b1cacff5d1fbba29378aa1","affectsGlobalScope":true,"impliedFormat":1},{"version":"d15bea3d62cbbdb9797079416b8ac375ae99162a7fba5de2c6c505446486ac0a","affectsGlobalScope":true,"impliedFormat":1},{"version":"68d18b664c9d32a7336a70235958b8997ebc1c3b8505f4f1ae2b7e7753b87618","affectsGlobalScope":true,"impliedFormat":1},{"version":"eb3d66c8327153d8fa7dd03f9c58d351107fe824c79e9b56b462935176cdf12a","affectsGlobalScope":true,"impliedFormat":1},{"version":"38f0219c9e23c915ef9790ab1d680440d95419ad264816fa15009a8851e79119","affectsGlobalScope":true,"impliedFormat":1},{"version":"69ab18c3b76cd9b1be3d188eaf8bba06112ebbe2f47f6c322b5105a6fbc45a2e","affectsGlobalScope":true,"impliedFormat":1},{"version":"a680117f487a4d2f30ea46f1b4b7f58bef1480456e18ba53ee85c2746eeca012","affectsGlobalScope":true,"impliedFormat":1},{"version":"2f11ff796926e0832f9ae148008138ad583bd181899ab7dd768a2666700b1893","affectsGlobalScope":true,"impliedFormat":1},{"version":"4de680d5bb41c17f7f68e0419412ca23c98d5749dcaaea1896172f06435891fc","affectsGlobalScope":true,"impliedFormat":1},{"version":"954296b30da6d508a104a3a0b5d96b76495c709785c1d11610908e63481ee667","affectsGlobalScope":true,"impliedFormat":1},{"version":"ac9538681b19688c8eae65811b329d3744af679e0bdfa5d842d0e32524c73e1c","affectsGlobalScope":true,"impliedFormat":1},{"version":"0a969edff4bd52585473d24995c5ef223f6652d6ef46193309b3921d65dd4376","affectsGlobalScope":true,"impliedFormat":1},{"version":"9e9fbd7030c440b33d021da145d3232984c8bb7916f277e8ffd3dc2e3eae2bdb","affectsGlobalScope":true,"impliedFormat":1},{"version":"811ec78f7fefcabbda4bfa93b3eb67d9ae166ef95f9bff989d964061cbf81a0c","affectsGlobalScope":true,"impliedFormat":1},{"version":"717937616a17072082152a2ef351cb51f98802fb4b2fdabd32399843875974ca","affectsGlobalScope":true,"impliedFormat":1},{"version":"d7e7d9b7b50e5f22c915b525acc5a49a7a6584cf8f62d0569e557c5cfc4b2ac2","affectsGlobalScope":true,"impliedFormat":1},{"version":"71c37f4c9543f31dfced6c7840e068c5a5aacb7b89111a4364b1d5276b852557","affectsGlobalScope":true,"impliedFormat":1},{"version":"576711e016cf4f1804676043e6a0a5414252560eb57de9faceee34d79798c850","affectsGlobalScope":true,"impliedFormat":1},{"version":"89c1b1281ba7b8a96efc676b11b264de7a8374c5ea1e6617f11880a13fc56dc6","affectsGlobalScope":true,"impliedFormat":1},{"version":"74f7fa2d027d5b33eb0471c8e82a6c87216223181ec31247c357a3e8e2fddc5b","affectsGlobalScope":true,"impliedFormat":1},{"version":"d6d7ae4d1f1f3772e2a3cde568ed08991a8ae34a080ff1151af28b7f798e22ca","affectsGlobalScope":true,"impliedFormat":1},{"version":"063600664504610fe3e99b717a1223f8b1900087fab0b4cad1496a114744f8df","affectsGlobalScope":true,"impliedFormat":1},{"version":"934019d7e3c81950f9a8426d093458b65d5aff2c7c1511233c0fd5b941e608ab","affectsGlobalScope":true,"impliedFormat":1},{"version":"52ada8e0b6e0482b728070b7639ee42e83a9b1c22d205992756fe020fd9f4a47","affectsGlobalScope":true,"impliedFormat":1},{"version":"3bdefe1bfd4d6dee0e26f928f93ccc128f1b64d5d501ff4a8cf3c6371200e5e6","affectsGlobalScope":true,"impliedFormat":1},{"version":"59fb2c069260b4ba00b5643b907ef5d5341b167e7d1dbf58dfd895658bda2867","affectsGlobalScope":true,"impliedFormat":1},{"version":"639e512c0dfc3fad96a84caad71b8834d66329a1f28dc95e3946c9b58176c73a","affectsGlobalScope":true,"impliedFormat":1},{"version":"368af93f74c9c932edd84c58883e736c9e3d53cec1fe24c0b0ff451f529ceab1","affectsGlobalScope":true,"impliedFormat":1},{"version":"af3dd424cf267428f30ccfc376f47a2c0114546b55c44d8c0f1d57d841e28d74","affectsGlobalScope":true,"impliedFormat":1},{"version":"995c005ab91a498455ea8dfb63aa9f83fa2ea793c3d8aa344be4a1678d06d399","affectsGlobalScope":true,"impliedFormat":1},{"version":"959d36cddf5e7d572a65045b876f2956c973a586da58e5d26cde519184fd9b8a","affectsGlobalScope":true,"impliedFormat":1},{"version":"965f36eae237dd74e6cca203a43e9ca801ce38824ead814728a2807b1910117d","affectsGlobalScope":true,"impliedFormat":1},{"version":"3925a6c820dcb1a06506c90b1577db1fdbf7705d65b62b99dce4be75c637e26b","affectsGlobalScope":true,"impliedFormat":1},{"version":"0a3d63ef2b853447ec4f749d3f368ce642264246e02911fcb1590d8c161b8005","affectsGlobalScope":true,"impliedFormat":1},{"version":"8cdf8847677ac7d20486e54dd3fcf09eda95812ac8ace44b4418da1bbbab6eb8","affectsGlobalScope":true,"impliedFormat":1},{"version":"8444af78980e3b20b49324f4a16ba35024fef3ee069a0eb67616ea6ca821c47a","affectsGlobalScope":true,"impliedFormat":1},{"version":"3287d9d085fbd618c3971944b65b4be57859f5415f495b33a6adc994edd2f004","affectsGlobalScope":true,"impliedFormat":1},{"version":"b4b67b1a91182421f5df999988c690f14d813b9850b40acd06ed44691f6727ad","affectsGlobalScope":true,"impliedFormat":1},{"version":"df83c2a6c73228b625b0beb6669c7ee2a09c914637e2d35170723ad49c0f5cd4","affectsGlobalScope":true,"impliedFormat":1},{"version":"436aaf437562f276ec2ddbee2f2cdedac7664c1e4c1d2c36839ddd582eeb3d0a","affectsGlobalScope":true,"impliedFormat":1},{"version":"8e3c06ea092138bf9fa5e874a1fdbc9d54805d074bee1de31b99a11e2fec239d","affectsGlobalScope":true,"impliedFormat":1},{"version":"87dc0f382502f5bbce5129bdc0aea21e19a3abbc19259e0b43ae038a9fc4e326","affectsGlobalScope":true,"impliedFormat":1},{"version":"b1cb28af0c891c8c96b2d6b7be76bd394fddcfdb4709a20ba05a7c1605eea0f9","affectsGlobalScope":true,"impliedFormat":1},{"version":"2fef54945a13095fdb9b84f705f2b5994597640c46afeb2ce78352fab4cb3279","affectsGlobalScope":true,"impliedFormat":1},{"version":"ac77cb3e8c6d3565793eb90a8373ee8033146315a3dbead3bde8db5eaf5e5ec6","affectsGlobalScope":true,"impliedFormat":1},{"version":"56e4ed5aab5f5920980066a9409bfaf53e6d21d3f8d020c17e4de584d29600ad","affectsGlobalScope":true,"impliedFormat":1},{"version":"4ece9f17b3866cc077099c73f4983bddbcb1dc7ddb943227f1ec070f529dedd1","affectsGlobalScope":true,"impliedFormat":1},{"version":"0a6282c8827e4b9a95f4bf4f5c205673ada31b982f50572d27103df8ceb8013c","affectsGlobalScope":true,"impliedFormat":1},{"version":"1c9319a09485199c1f7b0498f2988d6d2249793ef67edda49d1e584746be9032","affectsGlobalScope":true,"impliedFormat":1},{"version":"e3a2a0cee0f03ffdde24d89660eba2685bfbdeae955a6c67e8c4c9fd28928eeb","affectsGlobalScope":true,"impliedFormat":1},{"version":"811c71eee4aa0ac5f7adf713323a5c41b0cf6c4e17367a34fbce379e12bbf0a4","affectsGlobalScope":true,"impliedFormat":1},{"version":"51ad4c928303041605b4d7ae32e0c1ee387d43a24cd6f1ebf4a2699e1076d4fa","affectsGlobalScope":true,"impliedFormat":1},{"version":"60037901da1a425516449b9a20073aa03386cce92f7a1fd902d7602be3a7c2e9","affectsGlobalScope":true,"impliedFormat":1},{"version":"d4b1d2c51d058fc21ec2629fff7a76249dec2e36e12960ea056e3ef89174080f","affectsGlobalScope":true,"impliedFormat":1},{"version":"22adec94ef7047a6c9d1af3cb96be87a335908bf9ef386ae9fd50eeb37f44c47","affectsGlobalScope":true,"impliedFormat":1},{"version":"196cb558a13d4533a5163286f30b0509ce0210e4b316c56c38d4c0fd2fb38405","affectsGlobalScope":true,"impliedFormat":1},{"version":"73f78680d4c08509933daf80947902f6ff41b6230f94dd002ae372620adb0f60","affectsGlobalScope":true,"impliedFormat":1},{"version":"c5239f5c01bcfa9cd32f37c496cf19c61d69d37e48be9de612b541aac915805b","affectsGlobalScope":true,"impliedFormat":1},{"version":"8e7f8264d0fb4c5339605a15daadb037bf238c10b654bb3eee14208f860a32ea","affectsGlobalScope":true,"impliedFormat":1},{"version":"782dec38049b92d4e85c1585fbea5474a219c6984a35b004963b00beb1aab538","affectsGlobalScope":true,"impliedFormat":1},{"version":"0990a7576222f248f0a3b888adcb7389f957928ce2afb1cd5128169086ff4d29","impliedFormat":1},{"version":"eb5b19b86227ace1d29ea4cf81387279d04bb34051e944bc53df69f58914b788","affectsGlobalScope":true,"impliedFormat":1},{"version":"ac51dd7d31333793807a6abaa5ae168512b6131bd41d9c5b98477fc3b7800f9f","impliedFormat":1},{"version":"87d9d29dbc745f182683f63187bf3d53fd8673e5fca38ad5eaab69798ed29fbc","impliedFormat":1},{"version":"09ddcfcfbe77a8232d155ca1030005106b1328f6210df43629d0be750da07c16","affectsGlobalScope":true,"impliedFormat":1},{"version":"cc69795d9954ee4ad57545b10c7bf1a7260d990231b1685c147ea71a6faa265c","impliedFormat":1},{"version":"8bc6c94ff4f2af1f4023b7bb2379b08d3d7dd80c698c9f0b07431ea16101f05f","impliedFormat":1},{"version":"1b61d259de5350f8b1e5db06290d31eaebebc6baafd5f79d314b5af9256d7153","impliedFormat":1},{"version":"57194e1f007f3f2cbef26fa299d4c6b21f4623a2eddc63dfeef79e38e187a36e","impliedFormat":1},{"version":"0f6666b58e9276ac3a38fdc80993d19208442d6027ab885580d93aec76b4ef00","impliedFormat":1},{"version":"05fd364b8ef02fb1e174fbac8b825bdb1e5a36a016997c8e421f5fab0a6da0a0","impliedFormat":1},{"version":"70521b6ab0dcba37539e5303104f29b721bfb2940b2776da4cc818c07e1fefc1","affectsGlobalScope":true,"impliedFormat":1},{"version":"ab41ef1f2cdafb8df48be20cd969d875602483859dc194e9c97c8a576892c052","affectsGlobalScope":true,"impliedFormat":1},{"version":"d153a11543fd884b596587ccd97aebbeed950b26933ee000f94009f1ab142848","affectsGlobalScope":true,"impliedFormat":1},{"version":"21d819c173c0cf7cc3ce57c3276e77fd9a8a01d35a06ad87158781515c9a438a","impliedFormat":1},{"version":"98cffbf06d6bab333473c70a893770dbe990783904002c4f1a960447b4b53dca","affectsGlobalScope":true,"impliedFormat":1},{"version":"ba481bca06f37d3f2c137ce343c7d5937029b2468f8e26111f3c9d9963d6568d","affectsGlobalScope":true,"impliedFormat":1},{"version":"6d9ef24f9a22a88e3e9b3b3d8c40ab1ddb0853f1bfbd5c843c37800138437b61","affectsGlobalScope":true,"impliedFormat":1},{"version":"1db0b7dca579049ca4193d034d835f6bfe73096c73663e5ef9a0b5779939f3d0","affectsGlobalScope":true,"impliedFormat":1},{"version":"9798340ffb0d067d69b1ae5b32faa17ab31b82466a3fc00d8f2f2df0c8554aaa","affectsGlobalScope":true,"impliedFormat":1},{"version":"f26b11d8d8e4b8028f1c7d618b22274c892e4b0ef5b3678a8ccbad85419aef43","affectsGlobalScope":true,"impliedFormat":1},{"version":"5929864ce17fba74232584d90cb721a89b7ad277220627cc97054ba15a98ea8f","impliedFormat":1},{"version":"763fe0f42b3d79b440a9b6e51e9ba3f3f91352469c1e4b3b67bfa4ff6352f3f4","impliedFormat":1},{"version":"25c8056edf4314820382a5fdb4bb7816999acdcb929c8f75e3f39473b87e85bc","impliedFormat":1},{"version":"c464d66b20788266e5353b48dc4aa6bc0dc4a707276df1e7152ab0c9ae21fad8","impliedFormat":1},{"version":"78d0d27c130d35c60b5e5566c9f1e5be77caf39804636bc1a40133919a949f21","impliedFormat":1},{"version":"c6fd2c5a395f2432786c9cb8deb870b9b0e8ff7e22c029954fabdd692bff6195","impliedFormat":1},{"version":"1d6e127068ea8e104a912e42fc0a110e2aa5a66a356a917a163e8cf9a65e4a75","impliedFormat":1},{"version":"5ded6427296cdf3b9542de4471d2aa8d3983671d4cac0f4bf9c637208d1ced43","impliedFormat":1},{"version":"7f182617db458e98fc18dfb272d40aa2fff3a353c44a89b2c0ccb3937709bfb5","impliedFormat":1},{"version":"cadc8aced301244057c4e7e73fbcae534b0f5b12a37b150d80e5a45aa4bebcbd","impliedFormat":1},{"version":"385aab901643aa54e1c36f5ef3107913b10d1b5bb8cbcd933d4263b80a0d7f20","impliedFormat":1},{"version":"9670d44354bab9d9982eca21945686b5c24a3f893db73c0dae0fd74217a4c219","impliedFormat":1},{"version":"0b8a9268adaf4da35e7fa830c8981cfa22adbbe5b3f6f5ab91f6658899e657a7","impliedFormat":1},{"version":"11396ed8a44c02ab9798b7dca436009f866e8dae3c9c25e8c1fbc396880bf1bb","impliedFormat":1},{"version":"ba7bc87d01492633cb5a0e5da8a4a42a1c86270e7b3d2dea5d156828a84e4882","impliedFormat":1},{"version":"4893a895ea92c85345017a04ed427cbd6a1710453338df26881a6019432febdd","impliedFormat":1},{"version":"c21dc52e277bcfc75fac0436ccb75c204f9e1b3fa5e12729670910639f27343e","impliedFormat":1},{"version":"13f6f39e12b1518c6650bbb220c8985999020fe0f21d818e28f512b7771d00f9","impliedFormat":1},{"version":"9b5369969f6e7175740bf51223112ff209f94ba43ecd3bb09eefff9fd675624a","impliedFormat":1},{"version":"4fe9e626e7164748e8769bbf74b538e09607f07ed17c2f20af8d680ee49fc1da","impliedFormat":1},{"version":"24515859bc0b836719105bb6cc3d68255042a9f02a6022b3187948b204946bd2","impliedFormat":1},{"version":"ea0148f897b45a76544ae179784c95af1bd6721b8610af9ffa467a518a086a43","impliedFormat":1},{"version":"24c6a117721e606c9984335f71711877293a9651e44f59f3d21c1ea0856f9cc9","impliedFormat":1},{"version":"dd3273ead9fbde62a72949c97dbec2247ea08e0c6952e701a483d74ef92d6a17","impliedFormat":1},{"version":"405822be75ad3e4d162e07439bac80c6bcc6dbae1929e179cf467ec0b9ee4e2e","impliedFormat":1},{"version":"0db18c6e78ea846316c012478888f33c11ffadab9efd1cc8bcc12daded7a60b6","impliedFormat":1},{"version":"e61be3f894b41b7baa1fbd6a66893f2579bfad01d208b4ff61daef21493ef0a8","impliedFormat":1},{"version":"bd0532fd6556073727d28da0edfd1736417a3f9f394877b6d5ef6ad88fba1d1a","impliedFormat":1},{"version":"89167d696a849fce5ca508032aabfe901c0868f833a8625d5a9c6e861ef935d2","impliedFormat":1},{"version":"615ba88d0128ed16bf83ef8ccbb6aff05c3ee2db1cc0f89ab50a4939bfc1943f","impliedFormat":1},{"version":"a4d551dbf8746780194d550c88f26cf937caf8d56f102969a110cfaed4b06656","impliedFormat":1},{"version":"8bd86b8e8f6a6aa6c49b71e14c4ffe1211a0e97c80f08d2c8cc98838006e4b88","impliedFormat":1},{"version":"317e63deeb21ac07f3992f5b50cdca8338f10acd4fbb7257ebf56735bf52ab00","impliedFormat":1},{"version":"4732aec92b20fb28c5fe9ad99521fb59974289ed1e45aecb282616202184064f","impliedFormat":1},{"version":"2e85db9e6fd73cfa3d7f28e0ab6b55417ea18931423bd47b409a96e4a169e8e6","impliedFormat":1},{"version":"c46e079fe54c76f95c67fb89081b3e399da2c7d109e7dca8e4b58d83e332e605","impliedFormat":1},{"version":"bf67d53d168abc1298888693338cb82854bdb2e69ef83f8a0092093c2d562107","impliedFormat":1},{"version":"b52476feb4a0cbcb25e5931b930fc73cb6643fb1a5060bf8a3dda0eeae5b4b68","affectsGlobalScope":true,"impliedFormat":1},{"version":"e2677634fe27e87348825bb041651e22d50a613e2fdf6a4a3ade971d71bac37e","impliedFormat":1},{"version":"7394959e5a741b185456e1ef5d64599c36c60a323207450991e7a42e08911419","impliedFormat":1},{"version":"8c0bcd6c6b67b4b503c11e91a1fb91522ed585900eab2ab1f61bba7d7caa9d6f","impliedFormat":1},{"version":"8cd19276b6590b3ebbeeb030ac271871b9ed0afc3074ac88a94ed2449174b776","affectsGlobalScope":true,"impliedFormat":1},{"version":"696eb8d28f5949b87d894b26dc97318ef944c794a9a4e4f62360cd1d1958014b","impliedFormat":1},{"version":"3f8fa3061bd7402970b399300880d55257953ee6d3cd408722cb9ac20126460c","impliedFormat":1},{"version":"35ec8b6760fd7138bbf5809b84551e31028fb2ba7b6dc91d95d098bf212ca8b4","affectsGlobalScope":true,"impliedFormat":1},{"version":"5524481e56c48ff486f42926778c0a3cce1cc85dc46683b92b1271865bcf015a","impliedFormat":1},{"version":"68bd56c92c2bd7d2339457eb84d63e7de3bd56a69b25f3576e1568d21a162398","affectsGlobalScope":true,"impliedFormat":1},{"version":"3e93b123f7c2944969d291b35fed2af79a6e9e27fdd5faa99748a51c07c02d28","impliedFormat":1},{"version":"9d19808c8c291a9010a6c788e8532a2da70f811adb431c97520803e0ec649991","impliedFormat":1},{"version":"87aad3dd9752067dc875cfaa466fc44246451c0c560b820796bdd528e29bef40","impliedFormat":1},{"version":"4aacb0dd020eeaef65426153686cc639a78ec2885dc72ad220be1d25f1a439df","impliedFormat":1},{"version":"f0bd7e6d931657b59605c44112eaf8b980ba7f957a5051ed21cb93d978cf2f45","impliedFormat":1},{"version":"8db0ae9cb14d9955b14c214f34dae1b9ef2baee2fe4ce794a4cd3ac2531e3255","affectsGlobalScope":true,"impliedFormat":1},{"version":"15fc6f7512c86810273af28f224251a5a879e4261b4d4c7e532abfbfc3983134","impliedFormat":1},{"version":"58adba1a8ab2d10b54dc1dced4e41f4e7c9772cbbac40939c0dc8ce2cdb1d442","impliedFormat":1},{"version":"641942a78f9063caa5d6b777c99304b7d1dc7328076038c6d94d8a0b81fc95c1","impliedFormat":1},{"version":"1123a83f35cf56c97de746f0a7250012153c61a167e4a61668bf50e558162d14","impliedFormat":1},{"version":"855cd5f7eb396f5f1ab1bc0f8580339bff77b68a770f84c6b254e319bbfd1ac7","impliedFormat":1},{"version":"5650cf3dace09e7c25d384e3e6b818b938f68f4e8de96f52d9c5a1b3db068e86","impliedFormat":1},{"version":"1354ca5c38bd3fd3836a68e0f7c9f91f172582ba30ab15bb8c075891b91502b7","affectsGlobalScope":true,"impliedFormat":1},{"version":"7e20d899c28ca26a2a7afc98beaa69e63ff7fba0a8bc47b4e3bf3ede5e09e424","impliedFormat":1},{"version":"2d2fcaab481b31a5882065c7951255703ddbe1c0e507af56ea42d79ac3911201","impliedFormat":1},{"version":"a192fe8ec33f75edbc8d8f3ed79f768dfae11ff5735e7fe52bfa69956e46d78d","impliedFormat":1},{"version":"ca867399f7db82df981d6915bcbb2d81131d7d1ef683bc782b59f71dda59bc85","affectsGlobalScope":true,"impliedFormat":1},{"version":"372413016d17d804e1d139418aca0c68e47a83fb6669490857f4b318de8cccb3","affectsGlobalScope":true,"impliedFormat":1},{"version":"9e043a1bc8fbf2a255bccf9bf27e0f1caf916c3b0518ea34aa72357c0afd42ec","impliedFormat":1},{"version":"b4f70ec656a11d570e1a9edce07d118cd58d9760239e2ece99306ee9dfe61d02","impliedFormat":1},{"version":"3bc2f1e2c95c04048212c569ed38e338873f6a8593930cf5a7ef24ffb38fc3b6","impliedFormat":1},{"version":"6e70e9570e98aae2b825b533aa6292b6abd542e8d9f6e9475e88e1d7ba17c866","impliedFormat":1},{"version":"f9d9d753d430ed050dc1bf2667a1bab711ccbb1c1507183d794cc195a5b085cc","impliedFormat":1},{"version":"9eece5e586312581ccd106d4853e861aaaa1a39f8e3ea672b8c3847eedd12f6e","impliedFormat":1},{"version":"085f552d005479e2e6a7311cdbbe5d8c55c497b4d19274285df161ee9684cd9c","impliedFormat":1},{"version":"37ba7b45141a45ce6e80e66f2a96c8a5ab1bcef0fc2d0f56bb58df96ec67e972","impliedFormat":1},{"version":"45650f47bfb376c8a8ed39d4bcda5902ab899a3150029684ee4c10676d9fbaee","impliedFormat":1},{"version":"007faacc9268357caa21d24169f3f3f2497af3e9241308df2d89f6e6d9bb3f2e","affectsGlobalScope":true,"impliedFormat":1},{"version":"74cf591a0f63db318651e0e04cb55f8791385f86e987a67fd4d2eaab8191f730","impliedFormat":1},{"version":"5eab9b3dc9b34f185417342436ec3f106898da5f4801992d8ff38ab3aff346b5","impliedFormat":1},{"version":"12ed4559eba17cd977aa0db658d25c4047067444b51acfdcbf38470630642b23","affectsGlobalScope":true,"impliedFormat":1},{"version":"f3ffabc95802521e1e4bcba4c88d8615176dc6e09111d920c7a213bdda6e1d65","impliedFormat":1},{"version":"809821b8a065e3234a55b3a9d7846231ed18d66dd749f2494c66288d890daf7f","impliedFormat":1},{"version":"ae56f65caf3be91108707bd8dfbccc2a57a91feb5daabf7165a06a945545ed26","impliedFormat":1},{"version":"a136d5de521da20f31631a0a96bf712370779d1c05b7015d7019a9b2a0446ca9","impliedFormat":1},{"version":"c3b41e74b9a84b88b1dca61ec39eee25c0dbc8e7d519ba11bb070918cfacf656","affectsGlobalScope":true,"impliedFormat":1},{"version":"4737a9dc24d0e68b734e6cfbcea0c15a2cfafeb493485e27905f7856988c6b29","affectsGlobalScope":true,"impliedFormat":1},{"version":"36d8d3e7506b631c9582c251a2c0b8a28855af3f76719b12b534c6edf952748d","impliedFormat":1},{"version":"1ca69210cc42729e7ca97d3a9ad48f2e9cb0042bada4075b588ae5387debd318","impliedFormat":1},{"version":"f5ebe66baaf7c552cfa59d75f2bfba679f329204847db3cec385acda245e574e","impliedFormat":1},{"version":"ed59add13139f84da271cafd32e2171876b0a0af2f798d0c663e8eeb867732cf","affectsGlobalScope":true,"impliedFormat":1},{"version":"b7c5e2ea4a9749097c347454805e933844ed207b6eefec6b7cfd418b5f5f7b28","impliedFormat":1},{"version":"b1810689b76fd473bd12cc9ee219f8e62f54a7d08019a235d07424afbf074d25","impliedFormat":1},{"version":"8caa5c86be1b793cd5f599e27ecb34252c41e011980f7d61ae4989a149ff6ccc","impliedFormat":1},{"version":"f9fd93190acb1ffe0bc0fb395df979452f8d625071e9ffc8636e4dfb86ab2508","impliedFormat":1},{"version":"5f41fd8732a89e940c58ce22206e3df85745feb8983e2b4c6257fb8cbb118493","impliedFormat":1},{"version":"17ed71200119e86ccef2d96b73b02ce8854b76ad6bd21b5021d4269bec527b5f","impliedFormat":1},{"version":"1cfa8647d7d71cb03847d616bd79320abfc01ddea082a49569fda71ac5ece66b","impliedFormat":1},{"version":"bb7a61dd55dc4b9422d13da3a6bb9cc5e89be888ef23bbcf6558aa9726b89a1c","impliedFormat":1},{"version":"db6d2d9daad8a6d83f281af12ce4355a20b9a3e71b82b9f57cddcca0a8964a96","impliedFormat":1},{"version":"cfe4ef4710c3786b6e23dae7c086c70b4f4835a2e4d77b75d39f9046106e83d3","impliedFormat":1},{"version":"cbea99888785d49bb630dcbb1613c73727f2b5a2cf02e1abcaab7bcf8d6bf3c5","impliedFormat":1},{"version":"98817124fd6c4f60e0b935978c207309459fb71ab112cf514f26f333bf30830e","impliedFormat":1},{"version":"a86f82d646a739041d6702101afa82dcb935c416dd93cbca7fd754fd0282ce1f","impliedFormat":1},{"version":"2dad084c67e649f0f354739ec7df7c7df0779a28a4f55c97c6b6883ae850d1ce","impliedFormat":1},{"version":"fa5bbc7ab4130dd8cdc55ea294ec39f76f2bc507a0f75f4f873e38631a836ca7","impliedFormat":1},{"version":"df45ca1176e6ac211eae7ddf51336dc075c5314bc5c253651bae639defd5eec5","impliedFormat":1},{"version":"cf86de1054b843e484a3c9300d62fbc8c97e77f168bbffb131d560ca0474d4a8","impliedFormat":1},{"version":"196c960b12253fde69b204aa4fbf69470b26daf7a430855d7f94107a16495ab0","impliedFormat":1},{"version":"07183b3d03c52c2ec847fd508591e2d52670882da93e0df284be7ceac8a6988f","impliedFormat":1},{"version":"bf24f6d35f7318e246010ffe9924395893c4e96d34324cde77151a73f078b9ad","impliedFormat":1},{"version":"805c5db07d4b131bede36cc2dbded64cc3c8e49594e53119f4442af183f97935","impliedFormat":1},{"version":"10595c7ff5094dd5b6a959ccb1c00e6a06441b4e10a87bc09c15f23755d34439","impliedFormat":1},{"version":"9620c1ff645afb4a9ab4044c85c26676f0a93e8c0e4b593aea03a89ccb47b6d0","impliedFormat":1},{"version":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","impliedFormat":1},{"version":"a9af0e608929aaf9ce96bd7a7b99c9360636c31d73670e4af09a09950df97841","impliedFormat":1},{"version":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","impliedFormat":1},{"version":"c86fe861cf1b4c46a0fb7d74dffe596cf679a2e5e8b1456881313170f092e3fa","impliedFormat":1},{"version":"08ed0b3f0166787f84a6606f80aa3b1388c7518d78912571b203817406e471da","impliedFormat":1},{"version":"47e5af2a841356a961f815e7c55d72554db0c11b4cba4d0caab91f8717846a94","impliedFormat":1},{"version":"65f43099ded6073336e697512d9b80f2d4fec3182b7b2316abf712e84104db00","impliedFormat":1},{"version":"f5f541902bf7ae0512a177295de9b6bcd6809ea38307a2c0a18bfca72212f368","impliedFormat":1},{"version":"e8da637cbd6ed1cf6c36e9424f6bcee4515ca2c677534d4006cbd9a05f930f0c","impliedFormat":1},{"version":"ca1b882a105a1972f82cc58e3be491e7d750a1eb074ffd13b198269f57ed9e1b","impliedFormat":1},{"version":"fc3e1c87b39e5ba1142f27ec089d1966da168c04a859a4f6aab64dceae162c2b","impliedFormat":1},{"version":"3b414b99a73171e1c4b7b7714e26b87d6c5cb03d200352da5342ab4088a54c85","impliedFormat":1},{"version":"61888522cec948102eba94d831c873200aa97d00d8989fdfd2a3e0ee75ec65a2","impliedFormat":1},{"version":"4e10622f89fea7b05dd9b52fb65e1e2b5cbd96d4cca3d9e1a60bb7f8a9cb86a1","impliedFormat":1},{"version":"74b2a5e5197bd0f2e0077a1ea7c07455bbea67b87b0869d9786d55104006784f","impliedFormat":1},{"version":"59bf32919de37809e101acffc120596a9e45fdbab1a99de5087f31fdc36e2f11","impliedFormat":1},{"version":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","impliedFormat":1},{"version":"b3aa6ede7dda2ee53ee78f257d5d6188f6ba75ac0a34a4b88be4ca93b869da07","impliedFormat":1},{"version":"c40c848daad198266370c1c72a7a8c3d18d2f50727c7859fcfefd3ff69a7f288","impliedFormat":1},{"version":"ac60bbee0d4235643cc52b57768b22de8c257c12bd8c2039860540cab1fa1d82","impliedFormat":1},{"version":"973b59a17aaa817eb205baf6c132b83475a5c0a44e8294a472af7793b1817e89","impliedFormat":1},{"version":"ada39cbb2748ab2873b7835c90c8d4620723aedf323550e8489f08220e477c7f","impliedFormat":1},{"version":"6e5f5cee603d67ee1ba6120815497909b73399842254fc1e77a0d5cdc51d8c9c","impliedFormat":1},{"version":"8dba67056cbb27628e9b9a1cba8e57036d359dceded0725c72a3abe4b6c79cd4","impliedFormat":1},{"version":"70f3814c457f54a7efe2d9ce9d2686de9250bb42eb7f4c539bd2280a42e52d33","impliedFormat":1},{"version":"154dd2e22e1e94d5bc4ff7726706bc0483760bae40506bdce780734f11f7ec47","impliedFormat":1},{"version":"ef61792acbfa8c27c9bd113f02731e66229f7d3a169e3c1993b508134f1a58e0","impliedFormat":1},{"version":"9c82171d836c47486074e4ca8e059735bf97b205e70b196535b5efd40cbe1bc5","impliedFormat":1},{"version":"15e3409b8397457d761d8d6f8c524795845c3aeb5dd0d4291ca0c54fec670b72","impliedFormat":1},{"version":"f6404e7837b96da3ea4d38c4f1a3812c96c9dcdf264e93d5bdb199f983a3ef4b","impliedFormat":1},{"version":"c5426dbfc1cf90532f66965a7aa8c1136a78d4d0f96d8180ecbfc11d7722f1a5","impliedFormat":1},{"version":"65a15fc47900787c0bd18b603afb98d33ede930bed1798fc984d5ebb78b26cf9","impliedFormat":1},{"version":"9d202701f6e0744adb6314d03d2eb8fc994798fc83d91b691b75b07626a69801","impliedFormat":1},{"version":"de9d2df7663e64e3a91bf495f315a7577e23ba088f2949d5ce9ec96f44fba37d","impliedFormat":1},{"version":"c7af78a2ea7cb1cd009cfb5bdb48cd0b03dad3b54f6da7aab615c2e9e9d570c5","impliedFormat":1},{"version":"1ee45496b5f8bdee6f7abc233355898e5bf9bd51255db65f5ff7ede617ca0027","impliedFormat":1},{"version":"8b8f00491431fe82f060dfe8c7f2180a9fb239f3d851527db909b83230e75882","affectsGlobalScope":true,"impliedFormat":1},{"version":"db01d18853469bcb5601b9fc9826931cc84cc1a1944b33cad76fd6f1e3d8c544","affectsGlobalScope":true,"impliedFormat":1},{"version":"dba114fb6a32b355a9cfc26ca2276834d72fe0e94cd2c3494005547025015369","impliedFormat":1},{"version":"903e299a28282fa7b714586e28409ed73c3b63f5365519776bf78e8cf173db36","affectsGlobalScope":true,"impliedFormat":1},{"version":"fa6c12a7c0f6b84d512f200690bfc74819e99efae69e4c95c4cd30f6884c526e","impliedFormat":1},{"version":"f1c32f9ce9c497da4dc215c3bc84b722ea02497d35f9134db3bb40a8d918b92b","impliedFormat":1},{"version":"b73c319af2cc3ef8f6421308a250f328836531ea3761823b4cabbd133047aefa","affectsGlobalScope":true,"impliedFormat":1},{"version":"e433b0337b8106909e7953015e8fa3f2d30797cea27141d1c5b135365bb975a6","impliedFormat":1},{"version":"dd3900b24a6a8745efeb7ad27629c0f8a626470ac229c1d73f1fe29d67e44dca","impliedFormat":1},{"version":"ddff7fc6edbdc5163a09e22bf8df7bef75f75369ebd7ecea95ba55c4386e2441","impliedFormat":1},{"version":"106c6025f1d99fd468fd8bf6e5bda724e11e5905a4076c5d29790b6c3745e50c","impliedFormat":1},{"version":"ec29be0737d39268696edcec4f5e97ce26f449fa9b7afc2f0f99a86def34a418","impliedFormat":1},{"version":"aeab39e8e0b1a3b250434c3b2bb8f4d17bbec2a9dbce5f77e8a83569d3d2cbc2","impliedFormat":1},{"version":"ec6cba1c02c675e4dd173251b156792e8d3b0c816af6d6ad93f1a55d674591aa","impliedFormat":1},{"version":"b620391fe8060cf9bedc176a4d01366e6574d7a71e0ac0ab344a4e76576fcbb8","impliedFormat":1},{"version":"d729408dfde75b451530bcae944cf89ee8277e2a9df04d1f62f2abfd8b03c1e1","impliedFormat":1},{"version":"e15d3c84d5077bb4a3adee4c791022967b764dc41cb8fa3cfa44d4379b2c95f5","impliedFormat":1},{"version":"5f58e28cd22e8fc1ac1b3bc6b431869f1e7d0b39e2c21fbf79b9fa5195a85980","impliedFormat":1},{"version":"e1fc1a1045db5aa09366be2b330e4ce391550041fc3e925f60998ca0b647aa97","impliedFormat":1},{"version":"63533978dcda286422670f6e184ac516805a365fb37a086eeff4309e812f1402","impliedFormat":1},{"version":"43ba4f2fa8c698f5c304d21a3ef596741e8e85a810b7c1f9b692653791d8d97a","impliedFormat":1},{"version":"31fb49ef3aa3d76f0beb644984e01eab0ea222372ea9b49bb6533be5722d756c","impliedFormat":1},{"version":"33cd131e1461157e3e06b06916b5176e7a8ec3fce15a5cfe145e56de744e07d2","impliedFormat":1},{"version":"889ef863f90f4917221703781d9723278db4122d75596b01c429f7c363562b86","impliedFormat":1},{"version":"3556cfbab7b43da96d15a442ddbb970e1f2fc97876d055b6555d86d7ac57dae5","impliedFormat":1},{"version":"437751e0352c6e924ddf30e90849f1d9eb00ca78c94d58d6a37202ec84eb8393","impliedFormat":1},{"version":"48e8af7fdb2677a44522fd185d8c87deff4d36ee701ea003c6c780b1407a1397","impliedFormat":1},{"version":"d11308de5a36c7015bb73adb5ad1c1bdaac2baede4cc831a05cf85efa3cc7f2f","impliedFormat":1},{"version":"38e4684c22ed9319beda6765bab332c724103d3a966c2e5e1c5a49cf7007845f","impliedFormat":1},{"version":"f9812cfc220ecf7557183379531fa409acd249b9e5b9a145d0d52b76c20862de","affectsGlobalScope":true,"impliedFormat":1},{"version":"0a403c4aeeb153bc0c1f11458d005f8e5a0af3535c4c93eedc6f7865a3593f8e","impliedFormat":1},{"version":"2e4f37ffe8862b14d8e24ae8763daaa8340c0df0b859d9a9733def0eee7562d9","impliedFormat":1},{"version":"13283350547389802aa35d9f2188effaeac805499169a06ef5cd77ce2a0bd63f","impliedFormat":1},{"version":"680793958f6a70a44c8d9ae7d46b7a385361c69ac29dcab3ed761edce1c14ab8","impliedFormat":1},{"version":"6ac6715916fa75a1f7ebdfeacac09513b4d904b667d827b7535e84ff59679aff","impliedFormat":1},{"version":"b838d4c72740eb0afd284bf7575b74c624b105eff2e8c7b4aeead57e7ac320ff","impliedFormat":1},{"version":"913ddbba170240070bd5921b8f33ea780021bdf42fbdfcd4fcb2691b1884ddde","impliedFormat":1},{"version":"b4e6d416466999ff40d3fe5ceb95f7a8bfb7ac2262580287ac1a8391e5362431","impliedFormat":1},{"version":"5fe23bd829e6be57d41929ac374ee9551ccc3c44cee893167b7b5b77be708014","impliedFormat":1},{"version":"0a626484617019fcfbfc3c1bc1f9e84e2913f1adb73692aa9075817404fb41a1","impliedFormat":1},{"version":"438c7513b1df91dcef49b13cd7a1c4720f91a36e88c1df731661608b7c055f10","impliedFormat":1},{"version":"cf185cc4a9a6d397f416dd28cca95c227b29f0f27b160060a95c0e5e36cda865","impliedFormat":1},{"version":"0086f3e4ad898fd7ca56bb223098acfacf3fa065595182aaf0f6c4a6a95e6fbd","impliedFormat":1},{"version":"efaa078e392f9abda3ee8ade3f3762ab77f9c50b184e6883063a911742a4c96a","impliedFormat":1},{"version":"54a8bb487e1dc04591a280e7a673cdfb272c83f61e28d8a64cf1ac2e63c35c51","impliedFormat":1},{"version":"021a9498000497497fd693dd315325484c58a71b5929e2bbb91f419b04b24cea","impliedFormat":1},{"version":"9385cdc09850950bc9b59cca445a3ceb6fcca32b54e7b626e746912e489e535e","impliedFormat":1},{"version":"2894c56cad581928bb37607810af011764a2f511f575d28c9f4af0f2ef02d1ab","impliedFormat":1},{"version":"0a72186f94215d020cb386f7dca81d7495ab6c17066eb07d0f44a5bf33c1b21a","impliedFormat":1},{"version":"84124384abae2f6f66b7fbfc03862d0c2c0b71b826f7dbf42c8085d31f1d3f95","impliedFormat":1},{"version":"63a8e96f65a22604eae82737e409d1536e69a467bb738bec505f4f97cce9d878","impliedFormat":1},{"version":"3fd78152a7031315478f159c6a5872c712ece6f01212c78ea82aef21cb0726e2","impliedFormat":1},{"version":"4ef035fc464f0b9d266375990708fe538993da508dc23264781591221131cd48","impliedFormat":1},{"version":"512fc15cca3a35b8dbbf6e23fe9d07e6f87ad03c895acffd3087ce09f352aad0","impliedFormat":1},{"version":"9a0946d15a005832e432ea0cd4da71b57797efb25b755cc07f32274296d62355","impliedFormat":1},{"version":"a52ff6c0a149e9f370372fc3c715d7f2beee1f3bab7980e271a7ab7d313ec677","impliedFormat":1},{"version":"fd933f824347f9edd919618a76cdb6a0c0085c538115d9a287fa0c7f59957ab3","impliedFormat":1},{"version":"6ac6715916fa75a1f7ebdfeacac09513b4d904b667d827b7535e84ff59679aff","impliedFormat":1},{"version":"6a1aa3e55bdc50503956c5cd09ae4cd72e3072692d742816f65c66ca14f4dfdd","impliedFormat":1},{"version":"ab75cfd9c4f93ffd601f7ca1753d6a9d953bbedfbd7a5b3f0436ac8a1de60dfa","impliedFormat":1},{"version":"7cb9c4e1e44809ed4efa9b7b07a5a26afe0919eafbb08655dbb71a134b711d80","impliedFormat":1},{"version":"b73cbf0a72c8800cf8f96a9acfe94f3ad32ca71342a8908b8ae484d61113f647","impliedFormat":1},{"version":"bae6dd176832f6423966647382c0d7ba9e63f8c167522f09a982f086cd4e8b23","impliedFormat":1},{"version":"1364f64d2fb03bbb514edc42224abd576c064f89be6a990136774ecdd881a1da","impliedFormat":1},{"version":"c9958eb32126a3843deedda8c22fb97024aa5d6dd588b90af2d7f2bfac540f23","impliedFormat":1},{"version":"950fb67a59be4c2dbe69a5786292e60a5cb0e8612e0e223537784c731af55db1","impliedFormat":1},{"version":"e927c2c13c4eaf0a7f17e6022eee8519eb29ef42c4c13a31e81a611ab8c95577","impliedFormat":1},{"version":"07ca44e8d8288e69afdec7a31fa408ce6ab90d4f3d620006701d5544646da6aa","impliedFormat":1},{"version":"70246ad95ad8a22bdfe806cb5d383a26c0c6e58e7207ab9c431f1cb175aca657","impliedFormat":1},{"version":"f00f3aa5d64ff46e600648b55a79dcd1333458f7a10da2ed594d9f0a44b76d0b","impliedFormat":1},{"version":"772d8d5eb158b6c92412c03228bd9902ccb1457d7a705b8129814a5d1a6308fc","impliedFormat":1},{"version":"4e4475fba4ed93a72f167b061cd94a2e171b82695c56de9899275e880e06ba41","impliedFormat":1},{"version":"97c5f5d580ab2e4decd0a3135204050f9b97cd7908c5a8fbc041eadede79b2fa","impliedFormat":1},{"version":"c99a3a5f2215d5b9d735aa04cec6e61ed079d8c0263248e298ffe4604d4d0624","impliedFormat":1},{"version":"49b2375c586882c3ac7f57eba86680ff9742a8d8cb2fe25fe54d1b9673690d41","impliedFormat":1},{"version":"802e797bcab5663b2c9f63f51bdf67eff7c41bc64c0fd65e6da3e7941359e2f7","impliedFormat":1},{"version":"9ff1e8df66450af44161c1bfe34bc92c43074cfeec7a0a75f721830e9aabe379","impliedFormat":1},{"version":"3ecfccf916fea7c6c34394413b55eb70e817a73e39b4417d6573e523784e3f8e","impliedFormat":1},{"version":"1630192eac4188881201c64522cd3ef08209d9c4db0f9b5f0889b703dc6d936a","impliedFormat":1},{"version":"6459054aabb306821a043e02b89d54da508e3a6966601a41e71c166e4ea1474f","impliedFormat":1},{"version":"f416c9c3eee9d47ff49132c34f96b9180e50485d435d5748f0e8b72521d28d2e","impliedFormat":1},{"version":"05c97cddbaf99978f83d96de2d8af86aded9332592f08ce4a284d72d0952c391","impliedFormat":1},{"version":"14e5cdec6f8ae82dfd0694e64903a0a54abdfe37e1d966de3d4128362acbf35f","impliedFormat":1},{"version":"bbc183d2d69f4b59fd4dd8799ffdf4eb91173d1c4ad71cce91a3811c021bf80c","impliedFormat":1},{"version":"7b6ff760c8a240b40dab6e4419b989f06a5b782f4710d2967e67c695ef3e93c4","impliedFormat":1},{"version":"8dbc4134a4b3623fc476be5f36de35c40f2768e2e3d9ed437e0d5f1c4cd850f6","impliedFormat":1},{"version":"4e06330a84dec7287f7ebdd64978f41a9f70a668d3b5edc69d5d4a50b9b376bb","impliedFormat":1},{"version":"65bfa72967fbe9fc33353e1ac03f0480aa2e2ea346d61ff3ea997dfd850f641a","impliedFormat":1},{"version":"c06f0bb92d1a1a5a6c6e4b5389a5664d96d09c31673296cb7da5fe945d54d786","impliedFormat":1},{"version":"f974e4a06953682a2c15d5bd5114c0284d5abf8bc0fe4da25cb9159427b70072","impliedFormat":1},{"version":"872caaa31423f4345983d643e4649fb30f548e9883a334d6d1c5fff68ede22d4","impliedFormat":1},{"version":"94404c4a878fe291e7578a2a80264c6f18e9f1933fbb57e48f0eb368672e389c","impliedFormat":1},{"version":"5c1b7f03aa88be854bc15810bfd5bd5a1943c5a7620e1c53eddd2a013996343e","impliedFormat":1},{"version":"09dfc64fcd6a2785867f2368419859a6cc5a8d4e73cbe2538f205b1642eb0f51","impliedFormat":1},{"version":"bcf6f0a323653e72199105a9316d91463ad4744c546d1271310818b8cef7c608","impliedFormat":1},{"version":"01aa917531e116485beca44a14970834687b857757159769c16b228eb1e49c5f","impliedFormat":1},{"version":"351475f9c874c62f9b45b1f0dc7e2704e80dfd5f1af83a3a9f841f9dfe5b2912","impliedFormat":1},{"version":"ac457ad39e531b7649e7b40ee5847606eac64e236efd76c5d12db95bf4eacd17","impliedFormat":1},{"version":"187a6fdbdecb972510b7555f3caacb44b58415da8d5825d03a583c4b73fde4cf","impliedFormat":1},{"version":"d4c3250105a612202289b3a266bb7e323db144f6b9414f9dea85c531c098b811","impliedFormat":1},{"version":"95b444b8c311f2084f0fb51c616163f950fb2e35f4eaa07878f313a2d36c98a4","impliedFormat":1},{"version":"741067675daa6d4334a2dc80a4452ca3850e89d5852e330db7cb2b5f867173b1","impliedFormat":1},{"version":"f8acecec1114f11690956e007d920044799aefeb3cece9e7f4b1f8a1d542b2c9","impliedFormat":1},{"version":"178071ccd043967a58c5d1a032db0ddf9bd139e7920766b537d9783e88eb615e","impliedFormat":1},{"version":"3a17f09634c50cce884721f54fd9e7b98e03ac505889c560876291fcf8a09e90","impliedFormat":1},{"version":"32531dfbb0cdc4525296648f53b2b5c39b64282791e2a8c765712e49e6461046","impliedFormat":1},{"version":"0ce1b2237c1c3df49748d61568160d780d7b26693bd9feb3acb0744a152cd86d","impliedFormat":1},{"version":"e489985388e2c71d3542612685b4a7db326922b57ac880f299da7026a4e8a117","impliedFormat":1},{"version":"5cad4158616d7793296dd41e22e1257440910ea8d01c7b75045d4dfb20c5a41a","impliedFormat":1},{"version":"04d3aad777b6af5bd000bfc409907a159fe77e190b9d368da4ba649cdc28d39e","affectsGlobalScope":true,"impliedFormat":1},{"version":"74efc1d6523bd57eb159c18d805db4ead810626bc5bc7002a2c7f483044b2e0f","impliedFormat":1},{"version":"19252079538942a69be1645e153f7dbbc1ef56b4f983c633bf31fe26aeac32cd","impliedFormat":1},{"version":"bc11f3ac00ac060462597add171220aed628c393f2782ac75dd29ff1e0db871c","impliedFormat":1},{"version":"616775f16134fa9d01fc677ad3f76e68c051a056c22ab552c64cc281a9686790","impliedFormat":1},{"version":"65c24a8baa2cca1de069a0ba9fba82a173690f52d7e2d0f1f7542d59d5eb4db0","impliedFormat":1},{"version":"f9fe6af238339a0e5f7563acee3178f51db37f32a2e7c09f85273098cee7ec49","impliedFormat":1},{"version":"3b0b1d352b8d2e47f1c4df4fb0678702aee071155b12ef0185fce9eb4fa4af1e","impliedFormat":1},{"version":"77e71242e71ebf8528c5802993697878f0533db8f2299b4d36aa015bae08a79c","impliedFormat":1},{"version":"a344403e7a7384e0e7093942533d309194ad0a53eca2a3100c0b0ab4d3932773","impliedFormat":1},{"version":"b7fff2d004c5879cae335db8f954eb1d61242d9f2d28515e67902032723caeab","impliedFormat":1},{"version":"5f3dc10ae646f375776b4e028d2bed039a93eebbba105694d8b910feebbe8b9c","impliedFormat":1},{"version":"bb18bf4a61a17b4a6199eb3938ecfa4a59eb7c40843ad4a82b975ab6f7e3d925","impliedFormat":1},{"version":"4545c1a1ceca170d5d83452dd7c4994644c35cf676a671412601689d9a62da35","impliedFormat":1},{"version":"e9b6fc05f536dfddcdc65dbcf04e09391b1c968ab967382e48924f5cb90d88e1","impliedFormat":1},{"version":"a2d648d333cf67b9aeac5d81a1a379d563a8ffa91ddd61c6179f68de724260ff","impliedFormat":1},{"version":"2b664c3cc544d0e35276e1fb2d4989f7d4b4027ffc64da34ec83a6ccf2e5c528","impliedFormat":1},{"version":"a3f41ed1b4f2fc3049394b945a68ae4fdefd49fa1739c32f149d32c0545d67f5","impliedFormat":1},{"version":"3cd8f0464e0939b47bfccbb9bb474a6d87d57210e304029cd8eb59c63a81935d","impliedFormat":1},{"version":"47699512e6d8bebf7be488182427189f999affe3addc1c87c882d36b7f2d0b0e","impliedFormat":1},{"version":"3026abd48e5e312f2328629ede6e0f770d21c3cd32cee705c450e589d015ee09","impliedFormat":1},{"version":"8b140b398a6afbd17cc97c38aea5274b2f7f39b1ae5b62952cfe65bf493e3e75","impliedFormat":1},{"version":"7663d2c19ce5ef8288c790edba3d45af54e58c84f1b37b1249f6d49d962f3d91","impliedFormat":1},{"version":"30112425b2cf042fca1c79c19e35f88f44bfb2e97454527528cd639dd1a460ca","impliedFormat":1},{"version":"00bd6ebe607246b45296aa2b805bd6a58c859acecda154bfa91f5334d7c175c6","impliedFormat":1},{"version":"ad036a85efcd9e5b4f7dd5c1a7362c8478f9a3b6c3554654ca24a29aa850a9c5","impliedFormat":1},{"version":"fedebeae32c5cdd1a85b4e0504a01996e4a8adf3dfa72876920d3dd6e42978e7","impliedFormat":1},{"version":"504f37ba38bfea8394ec4f397c9a2ade7c78055e41ef5a600073b515c4fd0fc9","impliedFormat":1},{"version":"cdf21eee8007e339b1b9945abf4a7b44930b1d695cc528459e68a3adc39a622e","impliedFormat":1},{"version":"db036c56f79186da50af66511d37d9fe77fa6793381927292d17f81f787bb195","impliedFormat":1},{"version":"87ac2fb61e629e777f4d161dff534c2023ee15afd9cb3b1589b9b1f014e75c58","impliedFormat":1},{"version":"13c8b4348db91e2f7d694adc17e7438e6776bc506d5c8f5de9ad9989707fa3fe","impliedFormat":1},{"version":"3c1051617aa50b38e9efaabce25e10a5dd9b1f42e372ef0e8a674076a68742ed","impliedFormat":1},{"version":"07a3e20cdcb0f1182f452c0410606711fbea922ca76929a41aacb01104bc0d27","impliedFormat":1},{"version":"1de80059b8078ea5749941c9f863aa970b4735bdbb003be4925c853a8b6b4450","impliedFormat":1},{"version":"1d079c37fa53e3c21ed3fa214a27507bda9991f2a41458705b19ed8c2b61173d","impliedFormat":1},{"version":"4cd4b6b1279e9d744a3825cbd7757bbefe7f0708f3f1069179ad535f19e8ed2c","impliedFormat":1},{"version":"5835a6e0d7cd2738e56b671af0e561e7c1b4fb77751383672f4b009f4e161d70","impliedFormat":1},{"version":"c0eeaaa67c85c3bb6c52b629ebbfd3b2292dc67e8c0ffda2fc6cd2f78dc471e6","impliedFormat":1},{"version":"4b7f74b772140395e7af67c4841be1ab867c11b3b82a51b1aeb692822b76c872","impliedFormat":1},{"version":"27be6622e2922a1b412eb057faa854831b95db9db5035c3f6d4b677b902ab3b7","impliedFormat":1},{"version":"b95a6f019095dd1d48fd04965b50dfd63e5743a6e75478343c46d2582a5132bf","impliedFormat":99},{"version":"c2008605e78208cfa9cd70bd29856b72dda7ad89df5dc895920f8e10bcb9cd0a","impliedFormat":99},{"version":"b97cb5616d2ab82a98ec9ada7b9e9cabb1f5da880ec50ea2b8dc5baa4cbf3c16","impliedFormat":99},{"version":"d23df9ff06ae8bf1dcb7cc933e97ae7da418ac77749fecee758bb43a8d69f840","affectsGlobalScope":true,"impliedFormat":1},{"version":"040c71dde2c406f869ad2f41e8d4ce579cc60c8dbe5aa0dd8962ac943b846572","affectsGlobalScope":true,"impliedFormat":1},{"version":"3586f5ea3cc27083a17bd5c9059ede9421d587286d5a47f4341a4c2d00e4fa91","impliedFormat":1},{"version":"a6df929821e62f4719551f7955b9f42c0cd53c1370aec2dd322e24196a7dfe33","impliedFormat":1},{"version":"b789bf89eb19c777ed1e956dbad0925ca795701552d22e68fd130a032008b9f9","impliedFormat":1},"e462a655754db9df18b4a657454a7b6a88717ffded4e89403b2b3a47c6603fc3",{"version":"402e5c534fb2b85fa771170595db3ac0dd532112c8fa44fc23f233bc6967488b","impliedFormat":1},{"version":"52dcc257df5119fb66d864625112ce5033ac51a4c2afe376a0b299d2f7f76e4a","impliedFormat":1},{"version":"e5bab5f871ef708d52d47b3e5d0aa72a08ee7a152f33931d9a60809711a2a9a3","impliedFormat":1},{"version":"e16dc2a81595736024a206c7d5c8a39bfe2e6039208ef29981d0d95434ba8fcf","impliedFormat":1},{"version":"cc4a4903fb698ca1d961d4c10dce658aa3a479faf40509d526f122b044eaf6a4","impliedFormat":1},{"version":"19ee8416e6473ed6c7adb868fa796b5653cf0fa2a337658e677eaa0d134388c3","impliedFormat":1},{"version":"1328ab4e442614b28cdb3d4b414cf68325c0da0dca07287a338d0654b7a00261","impliedFormat":1},{"version":"a039dc21f045919f3cbee2ec13812cc6cc3eebc99dae4be00973230f468d19a6","impliedFormat":1},{"version":"3fbe57af01460e49dcd29df55d6931e1672bc6f1be0fb073d11410bc16f9037d","impliedFormat":1},{"version":"f760be449e8562ec5c09bb5187e8e1eabf3c113c0c58cddda53ef8c69f3e2131","impliedFormat":1},{"version":"44325ed13294fce6ab825b82947bbeed2611db7dad9d9135260192f375e5a189","impliedFormat":1},{"version":"e392e8fb5b514eafc585601c1d781485aa6dd6a320e75daf1064a4c6918a1b45","impliedFormat":1},{"version":"46e4a36e8ddbdfb4e7330e11c81c970dc8b218611df9183d39c41c5f8c653b55","impliedFormat":1},{"version":"3cc8a3d123b6b232d48d34b51b785f9da8d193f5b5817fa521fcd2f3b9315c55","impliedFormat":1},{"version":"6332f565867cf4a740a70e30f31cefba37ef7cebcf74f22eab8d744fde6d193e","impliedFormat":1},{"version":"2977b7884aedc895a1d0c9c210c7cf3272c29d6959a08a6fa3ff71e0aff08175","impliedFormat":1},{"version":"17f2922d41ddd032830a91371c948cd9ce903b35c95adca72271a54584f19b0b","impliedFormat":1},{"version":"3eed76ede2a1a14d7c9bb0a642041282dcc264811139d3dd275c9fe14efc9840","impliedFormat":1},{"version":"354a7f8e1287d9d6b7561bc97fdd8cbc2f7c1dd79e4cb37b942e8a5cfaff1085","impliedFormat":1},{"version":"8d369483f0c2b9ee388129cfdb6a43bc8112b377e86a41884bd06e19ce04f4c1","impliedFormat":99},{"version":"b558c9a18ea4e6e4157124465c3ef1063e64640da139e67be5edb22f534f2f08","impliedFormat":1},{"version":"01374379f82be05d25c08d2f30779fa4a4c41895a18b93b33f14aeef51768692","impliedFormat":1},{"version":"b0dee183d4e65cf938242efaf3d833c6b645afb35039d058496965014f158141","impliedFormat":1},{"version":"c0bbbf84d3fbd85dd60d040c81e8964cc00e38124a52e9c5dcdedf45fea3f213","impliedFormat":1},{"version":"8cc3467691758716bee55ca706828c94a6849f3403081c70d08f32d466eb89de","signature":"f65ce75c9085571e6321abf2bf9833709f4897e381f89e9925521833dbb7ab16"},"9516bc15013d7f982f6aea1dea66d9472394e2776930ad54ddafc5a3a2f7641c",{"version":"0fdad2a16cc74d779ac607ae7e4f446b3b326b62910ac9c4ad58279aaff240b5","signature":"d78afb169ae61df2d47a1a71cb388bfa93d5f242f180ae691ae1041fd84085d9"},"f155ddca47a41f1306b25a35a6bee8e73cdbc80b9c6e0f65e3e986efbf1bda75","9585f1de7d5f5f199a02a750c82749a39f6c4b1f51c9a718ffc2891a294f5b9b","bea705cb89ed5a96dc85856d6902c1ebfec408914d6f6f0d0bae57d090c900bf","ca63a4ff974ade7f50bf0a44e1e322b5401841fd77245522a5c13c6226e27c4a",{"version":"9cf2225c8e4f1c0c7b6ddd526c31320d5e0c8b33e49eeaf86813a24ccad88ad2","signature":"5786f7ea9fde10c1eb5c5398bdbedfd296773506afa8d40c7df553f171b54caf"},"46f68aa3026cd134987c1dd993b2c6100e199bd92b660c9c38cda55d9e1957ee","28c0ef0f55aac928c2e5ceac669a090845cf9245cffc037853c4c2dd17d7f413","6ce9e2383a43606828a2c20f4445b23abc0db52a5374a01e94053db7adb4f764","61fc1b13c939396359d0559ec02bbba3338fb480b97c51be9e826d06ad852606","5c7d6bc11c6318c976cb997d8d7beca4d04100b0800b53aa79e1c77b651ea5a0","84f07332c7bc58cda69c3547afef30a9d584d54ae363cf20f2af64057f82d0bf","8fc8dcad1de0a5438ca58a73bf41133f0038ace64fa31ecc4ea4e9e46ed8dc71","b9af615b4c3f4c33f346a7cf7016fd7d2f1fbbf13b7db1579db6b3db3f0cbc05","b3e3e39d1c480567fdf487b766b67e761e1ac28dd21c7f4e4e11d32885424694",{"version":"006d8ff9a051d61b0887b594b1e76c73314bb1a6fe39026867418937ea2259b3","impliedFormat":1},{"version":"dac2c7f4507236cf7c33ac6474641e12896728ef689bc003b3d5e5d86c313ff8","signature":"0d72bd85a157445badaa3f219524e4b9bd10d524d42162b3a60d55da31e3b2c0"},"71155b5287d9dca447ef8f8a8fb6649dffb35e8bf28434b0e46f82b5474515e9",{"version":"3e40749c76c111866e7bf105d87ae0b89031055ac0622fdbc657c78288492228","impliedFormat":1},{"version":"390a8c98ae2e1969f1d9ce70d351748acfb847df99dfc0e26654520ba677b625","signature":"1ba582b83969d03e47ba980e1945a147299be20aaba94e3c8ef019f12e27d709"},{"version":"0308311a8aa858187002b1d870841a4b70c831ceebaef7d763779a94135f3ad5","signature":"1ba582b83969d03e47ba980e1945a147299be20aaba94e3c8ef019f12e27d709"},{"version":"c1c6e88f5373d6299c3c682b6bfae880072787383699871727177f13d9460887","signature":"1ba582b83969d03e47ba980e1945a147299be20aaba94e3c8ef019f12e27d709"},{"version":"3352e4c679a90209e27920e8fd905da9fa19c9d60f19e2ad3ce6e3f0f04e478c","signature":"1ba582b83969d03e47ba980e1945a147299be20aaba94e3c8ef019f12e27d709"},"01605b3b0047eee10abe9017a15fec4a50cb4603fca184a4cc59e02ded524c24","f8ac3195b36fece8befe13ba7d3acffbb0efe74afa4d8cae27702ad75848a292",{"version":"38479e9851ea5f43f60baaa6bc894a49dba0a74dd706ce592d32bcb8b59e3be9","affectsGlobalScope":true,"impliedFormat":1},{"version":"9592f843d45105b9335c4cd364b9b2562ce4904e0895152206ac4f5b2d1bb212","impliedFormat":1},{"version":"f9ff719608ace88cae7cb823f159d5fb82c9550f2f7e6e7d0f4c6e41d4e4edb4","affectsGlobalScope":true,"impliedFormat":1},"00d297845c23adc97459a5ecbb84ebf8d7d784cc8ea708af7ac1a8698b8818b8","a23ee0ff57c2f83f71bc93d8f2590fac37f5762c578a6708ea239db386cfead9","95b18d833544e1be2445deea194f706a5361d4330e265afd455feaa5a8061a14","31fbb4dd9048d4ca760c52e49a4a94c0fd49b95eb271b4884bdbd63867969824","06ce5f0e0bf9e9f21345e4715326f922b3b4137197ee0e7b7c89dbcd168e78cb",{"version":"61a407f7021c37a073604d22ba38ab0d25f828419a0db29369eeb322304f895c","signature":"aa6fc9f6aed3a31cbbf0a1ee57d6a10b11f38fa9c08d7505bf83253e584f2134"},{"version":"ae8ec5ae7b3cb8d2bc6c92b74223495ca6b5ce54d92102f19e7380dba90f2246","signature":"b35406648b0b04026813c390f47d4be9d2083857ba03b7a58319218f240a60af"},{"version":"906a2dc1ab711aee0a99e6ad353ce22008ff6be6a84be068e32960a7a33f4b60","signature":"e933f1ea44aa1a9adf8b78f712a426d2a9ce2c98e539f1ed6e17755c16a60adc"},{"version":"2c16127dbdc8cdb124631e082170ed00aef0de2247d6fc927f0b9748233be9d8","signature":"d3bf91430a720465e3872a6df0957dc3b98a8aca6fc0d1637143aa1f9c54e52d"},"a20bffb835f73f2976ff3d1f5a804f1c8dfcaa459860a61adeb5a88df7ec4cfd","1f9bfe858c86beffc75ab4cbbecff5e76fb4e6e6c3e8775e982a47b6bd2d09c2",{"version":"c7fe393d30d329f047f4af21751e3d8a2818dd8440939078ad67a87dcfc4a56c","signature":"863aab55542f61d0a68ead26dd0a95d8b125ad128625991fbfe46effd0638839"},"3072c85d9bbb4a0e8a74d4fec04e2bb04ea0b413023a87b96e82c245c6a7e6c7","ad26e595b345dc6149d284a546e19f8a72e25cea3f3e6431734e14cb20b4944f","ad3078031c83a2314dfb974879c2787617fd926634a7206faeff0beef01a4496",{"version":"45b5bf88cf224503a20310b2c8ca01883041360ab7f86ff9da6c4886f45644bf","impliedFormat":1},{"version":"ecf77bf1046cebd4f9a42f8322bbe5b90c6ccbf33b59546b93a2f0251e9ae514","impliedFormat":1},{"version":"197855578790ecbf5198da6c3ea1033e949bba87378c463f270018e1c67b0ee4","impliedFormat":1},{"version":"8bf4236481e545558a50766d266211aa61efef8cbaf91aeb46c34e2978aa4b2e","impliedFormat":1},{"version":"d08026244cddea68a887f606e8ae6998e4798151efd4bc11ab91dded8c4733f2","impliedFormat":1},{"version":"7ede878da480bba98a5e98858ddf7369133fb83341b95ce9ea974eb3c92a518b","impliedFormat":1},{"version":"bea6fc8b6b8af7ea17b7ba5a4f2ebe1303ae20aa30e51a93974d26f62d46f4e1","impliedFormat":1},{"version":"a365c19a15e65ae30bb32eb1f0c034c2be3f2993a0a1f2db51a995c7e8886fbb","signature":"e0c4aff952a9c6861a95beb42586c8a388f8601fb97706ddcd7acff26c919843"},"ed9eb40b62274d9d62ba2b60aa24dec8f332a47705c858773456746826c02091","14339da74af56502639031f1f9b0587f5702615b8051424af22d90be9df51a2b","54452f8c6a9ace66ecb70fd43bb52a3792cf989d4501168de22a6efc775ef359","917b2567eed70550bbb0532b8660c13d3ccd85b6c76c536bb2647b4d227660b7","b2d9db114afcb7583787488fbc06602c506652ea510f3d040c48a2f4693c6f18","54213a90a0c82712c23c2f489f282a3ea03ae35e459cffc718b43ae7f42b499f","03139f84a56d444bdc5c827cd9d3a52282b0984b8216d9ea4b20df78bec59bc6","cd99b751f966a80fd57c2e5d7e123bd3c8b89702128b53e86e96dbd6f8568fd7","290ddf6c951a8228236b3458d7e998c7e2c6e4581b26265efd7fbbece2ad7983","4bf6cbe9fa93703d4c02564fd3caf2b0c3585b09f14101b557303c6e40c0b447","2cd1e2b8de14739c7038da81f65c969dff5972d047f991d1a9034396bc1f9e3d","930c8ae66a3fcd128741d332ce0807f044035b6a97bf603662ce576e75289037","71619281689649c935a6cf3bc45abf018cc75c3525228348f039fb23c2a268f2","d9a5590d4e1be8cedf59cfb141cce162bc5b8448c59481b9d2e74628d4f77bf6","1db128293ee31964078fcaa4c0ab94a59158e4817e111ce4254d2dde51449442","a54ff0b706a7290f4b52d4d45fc950e2518d051367d93931d7a7720e6f9e23f6",{"version":"379ea90c5c14a0783279c3b513bdad848947d2d399f379f152ecbeba89124e21","signature":"2cc743b624d6891f9275f11f76fedfe235af04641c806e7dc65e55740db4dd29"},"acedc7902525c22880b94fba7540286be0a6c2b39f8284c634f805fbea7d5a9d","6086b5f28beef4720b106d2ee09ddd7e8714b2f888260303d9197a34bceaa5e8","65579d6723aa63d3ccfb46bf13f6e98f678d4f8a42625acdb0863f68fe51771f","6de0846f65389114fef10b3453a4519c20daba5c5fd2e34f6668c7472b77988b","fa9aa9c2db4513de1f3f5a310bb6074dc8b29916512c14db0c6834e1650d3536"],"root":[409,[434,450],452,453,459,460,[464,478],[486,508]],"options":{"allowJs":true,"esModuleInterop":true,"jsx":1,"module":99,"skipLibCheck":true,"strict":false,"target":4},"referencedMap":[[489,1],[490,2],[491,3],[493,4],[494,5],[492,6],[495,7],[496,8],[497,9],[498,10],[500,11],[499,12],[501,13],[503,14],[504,15],[505,16],[502,17],[506,18],[487,19],[507,20],[488,21],[508,22],[409,23],[362,24],[142,25],[143,25],[144,26],[99,27],[145,28],[146,29],[147,30],[94,24],[97,31],[95,24],[96,24],[148,32],[149,33],[150,34],[151,35],[152,36],[153,37],[154,37],[155,38],[156,39],[157,40],[158,41],[100,24],[98,24],[159,42],[160,43],[161,44],[193,45],[162,46],[163,47],[164,48],[165,49],[166,50],[167,51],[168,52],[169,53],[170,54],[171,55],[172,55],[173,56],[174,24],[175,57],[177,58],[176,59],[178,60],[179,61],[180,62],[181,63],[182,64],[183,65],[184,66],[185,67],[186,68],[187,69],[188,70],[189,71],[190,72],[101,24],[102,24],[103,24],[141,73],[191,74],[192,75],[86,24],[451,76],[198,77],[199,78],[197,79],[195,80],[196,81],[84,24],[87,82],[286,79],[85,24],[463,83],[480,24],[479,24],[481,24],[484,84],[483,85],[485,86],[482,24],[454,79],[461,24],[462,24],[93,87],[365,88],[369,89],[371,90],[219,91],[233,92],[336,93],[265,24],[339,94],[301,95],[309,96],[337,97],[220,98],[264,24],[266,99],[338,100],[240,101],[221,102],[245,101],[234,101],[204,101],[292,103],[293,104],[209,24],[289,105],[294,106],[380,107],[287,106],[381,108],[271,24],[290,109],[393,110],[392,111],[296,106],[391,24],[389,24],[390,112],[291,79],[278,113],[279,114],[288,115],[304,116],[305,117],[295,118],[273,119],[274,120],[384,121],[387,122],[252,123],[251,124],[250,125],[396,79],[249,126],[225,24],[399,24],[402,24],[401,79],[403,127],[200,24],[330,24],[232,128],[202,129],[353,24],[354,24],[356,24],[359,130],[355,24],[357,131],[358,131],[218,24],[231,24],[364,132],[372,133],[376,134],[214,135],[281,136],[280,24],[272,119],[300,137],[298,138],[297,24],[299,24],[303,139],[276,140],[213,141],[238,142],[327,143],[205,144],[212,145],[201,93],[341,146],[351,147],[340,24],[350,148],[239,24],[223,149],[318,150],[317,24],[324,151],[326,152],[319,153],[323,154],[325,151],[322,153],[321,151],[320,153],[261,155],[246,155],[312,156],[247,156],[207,157],[206,24],[316,158],[315,159],[314,160],[313,161],[208,162],[285,163],[302,164],[284,165],[308,166],[310,167],[307,165],[241,162],[194,24],[328,168],[267,169],[349,170],[270,171],[344,172],[211,24],[345,173],[347,174],[348,175],[331,24],[343,144],[243,176],[329,177],[352,178],[215,24],[217,24],[222,179],[311,180],[210,181],[216,24],[269,182],[268,183],[224,184],[277,185],[275,186],[226,187],[228,188],[400,24],[227,189],[229,190],[367,24],[366,24],[368,24],[398,24],[230,191],[283,79],[92,24],[306,192],[253,24],[263,193],[242,24],[374,79],[383,194],[260,79],[378,106],[259,195],[361,196],[258,194],[203,24],[385,197],[256,79],[257,79],[248,24],[262,24],[255,198],[254,199],[244,200],[237,118],[346,24],[236,201],[235,24],[370,24],[282,79],[363,202],[83,24],[91,203],[88,79],[89,24],[90,24],[342,204],[335,205],[334,24],[333,206],[332,24],[373,207],[375,208],[377,209],[379,210],[382,211],[408,212],[386,212],[407,213],[388,214],[394,215],[395,216],[397,217],[404,218],[406,24],[405,219],[360,220],[426,221],[424,222],[425,223],[413,224],[414,222],[421,225],[412,226],[417,227],[427,24],[418,228],[423,229],[429,230],[428,231],[411,232],[419,233],[420,234],[415,235],[422,221],[416,236],[410,24],[432,237],[431,24],[430,24],[433,238],[81,24],[82,24],[13,24],[14,24],[16,24],[15,24],[2,24],[17,24],[18,24],[19,24],[20,24],[21,24],[22,24],[23,24],[24,24],[3,24],[25,24],[26,24],[4,24],[27,24],[31,24],[28,24],[29,24],[30,24],[32,24],[33,24],[34,24],[5,24],[35,24],[36,24],[37,24],[38,24],[6,24],[42,24],[39,24],[40,24],[41,24],[43,24],[7,24],[44,24],[49,24],[50,24],[45,24],[46,24],[47,24],[48,24],[8,24],[54,24],[51,24],[52,24],[53,24],[55,24],[9,24],[56,24],[57,24],[58,24],[60,24],[59,24],[61,24],[62,24],[10,24],[63,24],[64,24],[65,24],[11,24],[66,24],[67,24],[68,24],[69,24],[70,24],[1,24],[71,24],[72,24],[12,24],[76,24],[74,24],[79,24],[78,24],[73,24],[77,24],[75,24],[80,24],[119,239],[129,240],[118,239],[139,241],[110,242],[109,243],[138,219],[132,244],[137,245],[112,246],[126,247],[111,248],[135,249],[107,250],[106,219],[136,251],[108,252],[113,253],[114,24],[117,253],[104,24],[140,254],[130,255],[121,256],[122,257],[124,258],[120,259],[123,260],[133,219],[115,261],[116,262],[125,263],[105,264],[128,255],[127,253],[131,24],[134,265],[465,266],[466,267],[437,268],[438,268],[439,268],[440,268],[442,268],[443,269],[441,269],[444,269],[445,268],[446,269],[447,268],[449,269],[448,268],[450,268],[452,270],[467,266],[468,267],[470,271],[471,266],[472,266],[473,272],[474,272],[469,273],[475,266],[460,274],[476,266],[477,267],[464,266],[478,275],[486,276],[453,24],[435,277],[459,278],[436,279],[456,24],[455,24],[457,24],[458,24],[434,280]],"affectedFilesPendingEmit":[489,490,491,493,494,492,495,496,497,498,500,499,501,503,504,505,502,506,487,507,488,508,465,466,437,438,439,440,442,443,441,444,445,446,447,449,448,450,452,467,468,470,471,472,473,474,469,475,460,476,477,464,478,486,453,435,459,436,434],"version":"5.9.3"}
```

### File: `frontend/~WRL2073.tmp`

*Error reading file content: 'utf-8' codec can't decode byte 0x92 in position 11: invalid start byte*

