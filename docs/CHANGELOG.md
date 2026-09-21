# Agafari Release Changelog

> **Developer Expectation**: This file MUST be updated with a new entry on every meaningful code change, refactor, migration, or documentation release going forward.

---

## [2.0.0] - 2026-09-18

### Architecture & Refactoring
- **Layered OOP Domain-Driven Architecture**: Reorganized monolithic codebase into distinct layers (`src/domain`, `src/application`, `src/infrastructure`, `src/app`).
- **Domain Encapsulation**: Created pure entity models (`Event`, `Invitation`, `Ticket`, `Wish`, `MediaAsset`), value objects (`LockWindow`, `Headcount`), and typed domain exceptions (`DomainError`).
- **Repository Pattern**: Extracted repository interfaces (`IEventRepository`, `IInvitationRepository`, `IMediaRepository`, `IUserRepository`, `IWishRepository`) implemented via `mysql2` connection pool.

### Critical Security & Tenant Isolation Fixes
- **Tenant Isolation Enforcement**: Fixed cross-tenant vulnerability in `/api/events/[slug]/invitations` by rejecting unauthenticated bulk list and invitation creation calls (`401 Unauthorized`).
- **Production Secret Validation**: Removed silent fallback default secrets in production mode (`process.env.NODE_ENV === 'production'`). Server now fails fast if mandatory `JWT_SECRET` or `TICKET_SIGNING_SECRET` is missing.
- **Partial Group Check-In**: Implemented atomic cumulative check-ins supporting group partial arrival ($N \le \text{remaining}$) with row-level locking (`FOR UPDATE`).
- **48-Hour RSVP Lock**: Centralized single source of truth 48-hour lock window logic in `LockWindow.isLocked()` and `Event.isRsvpLocked()`.

### Performance & Hardening
- **Upstash & Memory Rate Limiting**: Added sliding window rate limiter (`src/lib/rateLimit.ts`) enforcing HTTP 429 status + `Retry-After` headers on RSVP (5/10m), QR scan (120/1m), and Wishes (3/5m) endpoints.
- **Sentry & PII Sanitization**: Added telemetry module (`src/lib/errorTracking.ts`) with automatic phone number, password, and HMAC token redaction.
- **Database Index Optimization**: Added foreign key indexes across all 15 MySQL tables (`001_add_foreign_key_indexes.sql`).
- **CI Quality Gate**: Added GitHub Actions workflow (`.github/workflows/ci.yml`) running `tsc --noEmit`, domain unit tests, and Next.js linting.

### Documentation & Governance
- Authored full 12-document technical specification suite in `docs/`: `PRD.md`, `SRS.md`, `ARCHITECTURE.md`, `API.md`, `DATABASE.md`, `CODING_STANDARDS.md`, `RUNBOOK.md`, `CHANGELOG.md`, `DATA_PRIVACY.md`, `ONBOARDING.md`, `DATA_RETENTION.md`, `DISASTER_RECOVERY.md`.

---

## [1.0.0] - 2026-09-17

### Initial Monolith Release
- Initial Next.js App Router monolith release with MySQL database schema, guest invitation card rendering, TikTok-style memory reels, and YouTube live stream embedding.
