# Agafari Software Requirements Specification (SRS)

**Document Version**: 2.0  
**Compliance Target**: Current Monolith Codebase Enforcement  
**Architecture**: Domain Entities, Value Objects, and Application Services

---

## 1. Numbered Functional Requirements (FR Catalog)

Every requirement below represents an active business rule enforced directly in the source code.

### FR-01: 48-Hour RSVP Lock Window Rule
- **Description**: The system shall reject guest RSVP attendance status updates when less than 48 hours remain before `event.event_date`.
- **Enforcing Files**:
  - `src/domain/value-objects/LockWindow.ts` (`LockWindow.isLocked()`)
  - `src/domain/entities/Event.ts` (`Event.isRsvpLocked()`)
  - `src/application/services/RsvpService.ts` (`RsvpService.submitRsvp()`)
- **Exception**: Throws `RsvpLockedError` (HTTP status 409).

### FR-02: HMAC-SHA256 QR Signature Validation Rule
- **Description**: The system shall verify the HMAC-SHA256 signature of a QR pass (`eventId|inviteCode|maxGuests`) using `TICKET_SIGNING_SECRET` before performing database lookups during check-in.
- **Enforcing Files**:
  - `src/domain/entities/Ticket.ts` (`Ticket.verifySignature()`, `Ticket.validateOrThrow()`)
  - `src/application/services/CheckInService.ts` (`CheckInService.performCheckIn()`)
- **Exception**: Throws `InvalidQrSignatureError` (HTTP status 400).

### FR-03: Partial Group Arrival & Cumulative Headcount Rule
- **Description**: The system shall support partial group check-ins (admitting $N \le \text{remaining}$ guests). The total admitted across multiple scans shall never exceed `max_guests`.
- **Enforcing Files**:
  - `src/domain/value-objects/Headcount.ts` (`Headcount.evaluateAdmit()`)
  - `src/domain/entities/Invitation.ts` (`Invitation.attemptCheckIn()`)
  - `src/application/services/CheckInService.ts` (`CheckInService.performCheckIn()`)
- **Exceptions**: Throws `AlreadyScannedError` if pass is fully scanned, or `HeadcountExceededError` if requested admit exceeds remaining headcount.

### FR-04: Expired/Archived Event Check-In Short-Circuit Rule
- **Description**: The system shall reject check-in attempts for events with status `COMPLETED` or `ARCHIVED` prior to evaluating headcount rules.
- **Enforcing Files**:
  - `src/domain/entities/Event.ts` (`Event.isCompletedOrArchived()`)
  - `src/application/services/CheckInService.ts` (`CheckInService.performCheckIn()`)
- **Exception**: Throws `EventExpiredError` (HTTP status 400).

### FR-05: Active Events Protection on Organizer Deletion Rule
- **Description**: The system shall block the deletion of an organizer agency account if they manage 1 or more active wedding events (`LIVE` or `COMING_SOON`).
- **Enforcing Files**:
  - `src/application/services/OrganizerService.ts` (`OrganizerService.deleteOrganizer()`)
  - `src/infrastructure/persistence/MySqlEventRepository.ts` (`countActiveByOrganizerId()`)
- **Exception**: Throws `OrganizerHasActiveEventsError` (HTTP status 400).

### FR-06: Tenant Isolation & Scoped Access Rule
- **Description**: The system shall enforce tenant isolation on all organizer and couple API endpoints. Users assigned to Organizer A cannot view, modify, or export data belonging to Organizer B.
- **Enforcing Files**:
  - `src/lib/eventScope.ts` (`checkEventAccess()`)
  - `src/app/api/events/[slug]/invitations/route.ts` (Requires authenticated session for bulk operations)
  - `src/infrastructure/persistence/MySqlInvitationRepository.ts`
- **Exception**: Throws `ForbiddenError` (HTTP status 403) or `UnauthorizedError` (HTTP status 401).

### FR-07: Template Switch Customization Fallback Rule
- **Description**: When switching an event template, if custom design values are provided, they are preserved; otherwise, default template design variables are applied cleanly.
- **Enforcing Files**:
  - `src/application/services/TemplateService.ts` (`TemplateService.updateTemplate()`)

### FR-08: Content Moderation Scoping Rule
- **Description**: Guest wishes and photo/video media uploads shall default to status `PENDING` (or `APPROVED` for text wishes) and can only be updated or deleted by authorized staff.
- **Enforcing Files**:
  - `src/application/services/ModerationService.ts` (`updateWishStatus()`, `updateMediaStatus()`)

### FR-09: Anti-Passback Atomic Row-Locking Rule
- **Description**: Check-in count updates shall execute within a MySQL transaction using row-level locking (`SELECT ... FOR UPDATE` / atomic SQL update) to prevent concurrent scan race conditions.
- **Enforcing Files**:
  - `src/infrastructure/persistence/MySqlInvitationRepository.ts` (`atomicCheckIn()`)

### FR-10: Rate Limiting & Throttling Rule
- **Description**: The system shall limit high-abuse endpoints: RSVP submission (5 req/10m), QR scanning (120 req/1m), and wishes submission (3 req/5m). Breaches return HTTP 429 with `Retry-After` header.
- **Enforcing Files**:
  - `src/lib/rateLimit.ts` (`verifyRateLimit()`, `buildRateLimitResponse()`)
  - `src/app/api/events/[slug]/rsvp/route.ts`
  - `src/app/api/qr/[code]/route.ts`
  - `src/app/api/events/[slug]/wishes/route.ts`

---

## 2. Documented Gaps & Non-Enforced Claims

| Claimed Feature | Current Code Status | Gap Analysis |
| :--- | :--- | :--- |
| **Offline Pass Reconciliation Engine** | PHP offline script in `docs/` | **GAP**: The active Next.js monolith processes check-ins via online serverless lambdas. Offline background sync is not compiled into the Next.js runtime. |
| **Automated 90-Day Purge Cron** | Manual query spec in `docs/DATA_RETENTION.md` | **GAP**: The retention policy is documented, but the automated cron runner (`/api/cron/purge-guest-data`) is not yet wired to a scheduled timer. |
