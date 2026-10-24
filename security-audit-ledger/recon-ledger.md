# Agafari Security Audit Reconnaissance Ledger

**Repository**: `AnaniyaSiyum/Agafari`  
**Audit Profile**: Standard / Full Codebase Review  
**Date**: October 24, 2026  
**Auditor**: Cloudflare Security Audit Workflow (`@security-audit`)

---

## 1. System Architecture & Trust Boundaries

The Agafari application is an event coordination and digital wedding platform serving multiple distinct principals:
1. **Unauthenticated Public / Guests**: Visitors viewing wedding announcement pages, submitting RSVP responses, posting public video/text wishes, and retrieving QR passes.
2. **Wedding Couples (`BRIDE_GROOM` / `COUPLE`)**: Authenticated event owners managing invitations, music, media, and guest lists for their specific wedding.
3. **Event Staff (`GATE_SCANNER`, `LIVE_STREAMER`, `CONTENT_MODERATOR`)**: Authenticated operational personnel assigned to a specific wedding event.
4. **Event Organizers (`EVENT_ORGANIZER`, `ORGANIZER_OWNER`)**: Commercial agencies managing multiple client wedding events within their tenant boundary.
5. **Platform Super Administrators (`SYSTEM_ADMIN`)**: Global operators managing tenants, system CMS, global audit logs, user credentials, and event approvals.

### Core Entry Points & Technology Stack
- **Web Frontend & API**: Next.js 14 (App Router) in `frontend/`
- **Database**: MySQL 8.x via `mysql2/promise` pool with parameterized query helper (`frontend/src/lib/db.ts`)
- **Secondary Service**: PHP 8.1 lightweight microservice in `backend/` for standalone check-in logic
- **Authentication**: Custom HMAC-SHA256 JWT tokens transmitted via `agafari_token` / `agafari_session` cookies or Bearer Authorization headers.

---

## 2. Comprehensive Endpoint & Entry-Point Inventory

| Route / Path | HTTP Method | Expected Authority | Real Auth Guard in Source | DB Sink / Operations | Trust Boundary Status |
|---|---|---|---|---|---|
| `/api/admin/clean-slate` | `GET`, `POST` | `SYSTEM_ADMIN` | **NONE** (`performCleanSlate` called directly) | `DELETE FROM` (13 tables), resets admin credentials | **CRITICAL FLAW**: Completely unauthenticated DB destruction |
| `/api/events/[slug]` | `GET` | Public | Public | `SELECT` from `events`, `users`, `event_staff` | **CRITICAL FLAW**: Plaintext temporary passwords leaked in JSON response |
| `/api/events/[slug]` | `PATCH` | `COUPLE`, `EVENT_ORGANIZER`, `SYSTEM_ADMIN` | **NONE** (`handleUpdate` has zero auth) | `UPDATE events SET bride_name...` | **HIGH FLAW**: Unauthenticated modification of any event |
| `/api/organizer/events` | `GET` | `EVENT_ORGANIZER`, `SYSTEM_ADMIN` | Broken (`requireRole` result ignored if `!auth.ok`) | `SELECT` from `events`, `organizers`, `users` | **HIGH FLAW**: Unauthenticated event & credential exposure via `?id=` |
| `/api/organizer/events` | `POST` | `EVENT_ORGANIZER`, `SYSTEM_ADMIN` | Broken (`requireRole` result ignored if `!auth.ok`) | `INSERT/UPDATE events`, `UPDATE users` | **CRITICAL FLAW**: Unauthenticated event creation & Admin account takeover via email match |
| `/api/admin/events` | `GET` | `SYSTEM_ADMIN` | `requireRole(['SYSTEM_ADMIN', 'EVENT_ORGANIZER'])` | `SELECT` all platform events | **HIGH FLAW (IDOR)**: Organizers view all events and credentials across all tenants |
| `/api/admin/events` | `POST` | `SYSTEM_ADMIN`, `EVENT_ORGANIZER` | `requireRole(['SYSTEM_ADMIN', 'EVENT_ORGANIZER'])` | `INSERT events`, `users` | Controlled |
| `/api/admin/events` | `PATCH`, `DELETE` | `SYSTEM_ADMIN` | `requireRole(['SYSTEM_ADMIN'])` | `UPDATE/DELETE events` | Protected |
| `/api/events/[slug]/invitations` | `GET` | `COUPLE`, `EVENT_ORGANIZER`, `SYSTEM_ADMIN` | Broken (`if (user)` check does not reject unauthenticated) | `SELECT` from `invitations` | **HIGH FLAW**: Full guest list, phone numbers, and QR tokens leaked to unauthenticated callers |
| `/api/events/[slug]/invitations` | `POST` | `COUPLE`, `EVENT_ORGANIZER`, `SYSTEM_ADMIN` | Broken (`if (user)` check does not reject unauthenticated) | `INSERT INTO invitations` | **MEDIUM FLAW**: Unauthenticated invitation generation |
| `/api/events/[slug]/invitations` | `PATCH` | `GATE_SCANNER`, `SYSTEM_ADMIN` | Broken (`if (user)` check does not reject unauthenticated; legacy path signs on fly) | `UPDATE invitations SET is_scanned...` | **MEDIUM FLAW**: Unauthenticated check-in bypass |
| `/api/auth/verify-dashboard` | `POST` | Public | Backdoored authentication logic | `SELECT users`, `generateToken`, `setAuthCookie` | **CRITICAL FLAW**: Hardcoded master passwords (`admin123`, `agafari2026`, `org123`) bypass hashes |
| `/api/auth/login` | `POST` | Public | `verifyPassword` (PBKDF2/bcrypt) + Rate limit | `SELECT users`, `query memberships` | Protected |
| `/api/auth/logout` | `POST` | Authenticated | Clears cookies | None | Protected |
| `/api/auth/me` | `GET` | Authenticated | `getAuthUser` | `SELECT users` | Protected |
| `/api/auth/totp/confirm` | `POST` | `TOTP_SETUP` | `verifySessionToken` + TOTP code check | `UPDATE users SET totp_enabled=TRUE` | Protected |
| `/api/admin/users` | `GET`, `POST`, `PATCH`, `DELETE` | `SYSTEM_ADMIN` | `requireMembership(req, ['SYSTEM_ADMIN'])` | `SELECT/INSERT/UPDATE/DELETE users` | Protected |
| `/api/admin/users/[id]/password` | `POST` | `SYSTEM_ADMIN` | `requireMembership(req, ['SYSTEM_ADMIN'])` | `UPDATE users SET password_hash...` | Protected |
| `/api/admin/account-requests` | `GET`, `POST` | `SYSTEM_ADMIN` | `requireMembership(req, ['SYSTEM_ADMIN'])` | `SELECT/INSERT account_requests` | Protected |
| `/api/admin/account-requests/[id]` | `PATCH` | `SYSTEM_ADMIN` | `requireMembership(req, ['SYSTEM_ADMIN'])` | `UPDATE account_requests` | Protected |
| `/api/admin/audit-logs` | `GET` | `SYSTEM_ADMIN` | `requirePermission(req, 'audit:read')` | `SELECT audit_logs` | Protected |
| `/api/admin/cms` | `PATCH` | `SYSTEM_ADMIN` | `requireRole(req, ['SYSTEM_ADMIN'])` | `INSERT INTO cms_sections` | Protected |
| `/api/admin/view-as` | `POST`, `DELETE` | `SYSTEM_ADMIN` | `requireMembership(req, ['SYSTEM_ADMIN'])` | `SELECT memberships`, `signSessionToken` | Protected |
| `/api/organizer/account-requests` | `GET`, `POST` | `ORGANIZER_OWNER`, `SYSTEM_ADMIN` | `requireMembership(req, ...)` | `SELECT/INSERT account_requests` | Protected |
| `/api/organizer/media` | `GET` | `CONTENT_MODERATOR`, `ORGANIZER_OWNER` | `checkEventAccess(user, eventId, ['CONTENT_MODERATOR'])` | `SELECT media_assets` | Protected |
| `/api/organizer/wishes` | `GET`, `PATCH` | `CONTENT_MODERATOR`, `ORGANIZER_OWNER` | `checkEventAccess(user, eventId, ['CONTENT_MODERATOR'])` | `SELECT/UPDATE wishes` | Protected |
| `/api/events/[slug]/team` | `GET`, `POST` | `COUPLE`, `EVENT_ORGANIZER`, `SYSTEM_ADMIN` | `checkEventAccess(user, resolved.event.id)` | `SELECT/INSERT event_staff` | Protected |
| `/api/events/[slug]/quota` | `GET`, `POST` | `COUPLE`, `EVENT_ORGANIZER`, `SYSTEM_ADMIN` | `checkEventAccess(user, resolved.event.id)` | `SELECT/INSERT quota_groups` | Protected |
| `/api/events/[slug]/rsvp` | `POST` | Public / Guest | Rate limited + `RsvpService` domain logic | `UPDATE invitations SET rsvp_status...` | Protected |
| `/api/events/[slug]/media` | `GET` | Public (Approved) / Staff (All) | `checkEventAccess` for pending items | `SELECT media_assets` | Protected |
| `/api/events/[slug]/media` | `POST` | Public / Guest | Parameter validation; **flaw**: `status === 'APPROVED'` parameter | `INSERT INTO media_assets` | **MEDIUM FLAW**: Guest can self-approve media via body payload |
| `/api/events/[slug]/media` | `PATCH` | Public (Guest Likes) | Validates action and category !== 'LIVE' | `INSERT/DELETE post_likes` | Protected |
| `/api/events/[slug]/music` | `GET`, `POST` | Public / Guest recommendations | Rate limit / text validation | `SELECT/INSERT media_assets` | Protected |
| `/api/events/[slug]/template` | `PATCH` | `COUPLE`, `EVENT_ORGANIZER`, `SYSTEM_ADMIN` | `getAuthUser` + `TemplateService` domain guard | `UPDATE events SET template_id...` | Protected |
| `/api/events/[slug]/wishes` | `GET`, `POST` | Public / Guest blessings | Rate limited + PENDING insert | `SELECT/INSERT wishes` | Protected |
| `/api/media/[mediaId]/comments` | `GET`, `POST` | Public / Guest comments | Validates post is APPROVED and category !== 'LIVE' | `SELECT/INSERT media_comments` | Protected |
| `/api/qr/[code]` | `POST` | `GATE_SCANNER`, `SYSTEM_ADMIN` | `getAuthUser` + `checkEventAccess` + HMAC verification | `UPDATE invitations SET is_scanned...` | Protected |
| `/api/cron/lock-rsvps` | `POST` | Scheduled Worker | Broken (`if (process.env.CRON_SECRET && secret !== ...)`) | `UPDATE invitations`, `events` | **LOW/MEDIUM FLAW**: Fails open if `CRON_SECRET` env is unset |
| `/api/cms` | `GET` | Public | None | `SELECT cms_sections` | Protected (Read-Only) |
| `/api/templates` | `GET` | Public | None | `SELECT templates` | Protected (Read-Only) |

---

## 3. Middleware & Gateway Guard Analysis

### `frontend/src/middleware.ts`
- **Scope**: Matches only frontend page views (`/admin/:path*`, `/organizer/:path*`, `/couple/:path*`, `/scanner/:path*`, etc.).
- **Crucial Architectural Gap**: The Next.js Edge middleware configuration **explicitly omits `/api/:path*`** from `config.matcher`. Therefore, **no API route is protected by `middleware.ts`**. Every API route must implement its own explicit server-side authentication guard (`requireMembership` or `getAuthUser` + `checkEventAccess`).
- **Response Headers Illusion**: Lines 188-191 attempt to pass identity headers down (`response.headers.set('X-User-Id', ...)`), but `NextResponse.next()` modifies outgoing response headers returned to the browser, not incoming request headers to downstream handlers.
