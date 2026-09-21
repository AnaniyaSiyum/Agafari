# Agafari Product Requirements Document (PRD)

**Document Version**: 2.0  
**Status**: Current Production Derived  
**Architecture**: Next.js Monolith + MySQL (Layered OOP Domain-Driven Architecture)

---

## 1. Product Vision & Overview

Agafari is a modern, high-aesthetic wedding management SaaS built specifically for Ethiopian and international celebrations. It unites event organizers, couples, gate security staff, live stream operators, and guests into a seamless real-time ecosystem featuring tokenized anti-passback QR passes, an interactive RSVP engine, a vertical memory reel feed, and synchronized worldwide YouTube live streaming.

---

## 2. System Role Specifications

Agafari enforces strict Role-Based Access Control (RBAC) across 6 distinct user roles:

| Role | Role Identifier | Scope & Capabilities |
| :--- | :--- | :--- |
| **System Admin** | `SYSTEM_ADMIN` | Platform super-user. Can create/delete organizer accounts, create individual wedding events, manage global CMS content, view cross-tenant analytics, and override template locks. |
| **Event Organizer** | `EVENT_ORGANIZER` | Event management agency. Manages multiple assigned wedding events, assigns gate staff/moderators, customizes event templates, locks templates, and moderates guest content. |
| **Bride & Groom (Couple)** | `BRIDE_GROOM` | Couple managing their single wedding event. Views live guest RSVP tallies, headcount summaries, guest wishes, and customizes allowed template fields (unless locked by organizer). |
| **Gate Security Staff** | `GATE_SCANNER` | Security staff stationed at the venue gate. Uses camera QR scanner to validate HMAC-signed guest passes, enforce partial group headcount check-in, and prevent screenshot pass reuse. |
| **Live Stream Operator** | `LIVE_STREAMER` | Media technician managing the wedding's live video broadcast. Sets YouTube live stream IDs, monitors stream state, and toggles broadcast statuses. |
| **Guest / Attendee** | `GUEST` (Public) | Unauthenticated user. Accesses personalized digital invitation page, submits RSVP with song & dietary choices, downloads QR pass, posts wishes, uploads photo/video reels, and watches live stream. |

---

## 3. Core Feature Specifications

### 3.1 Digital Invitation & RSVP Engine
- **Public Guest Access**: Accessible via unique URL parameter (`?code=INVITE_CODE`) or public event slug (`/event/[slug]`).
- **Interactive RSVP**: Guest submits attendance (`ATTENDING`, `DECLINED`, `PENDING`), headcount (`attending_headcount`), song recommendation, and dietary notes.
- **48-Hour Lock Window Invariant**: Enforced by domain `LockWindow.isLocked()`. RSVP changes are automatically locked 48 hours prior to `event_date`.
- **QR Pass Issuance**: Generates a 32-byte HMAC-SHA256 signed QR code containing `eventId`, `inviteCode`, `maxGuests`, and signature string `sig`.

### 3.2 Anti-Passback Gate Check-In Engine
- **Signature Verification**: Validates HMAC signature *before* querying database to instantly reject forged screenshot codes.
- **Partial Group Arrival**: Supports cumulative headcount check-ins (e.g. 2 guests arrive now, 2 arrive later for a pass with `max_guests: 4`).
- **Scanned Count Persistence**: Increments `scanned_count` atomically using MySQL row locking (`FOR UPDATE`) to prevent double-entry race conditions.

### 3.3 Memory Reel Feed & Live Stream
- **Synchronized Video Stream**: Embeds YouTube live stream for guests unable to attend in person.
- **Vertical Feed & Wishes Wall**: TikTok-style vertical media reel where guests post blessing wishes and upload photo/video memories.
- **Content Moderation Queue**: Guest uploads default to `PENDING` status and require approval by `EVENT_ORGANIZER` or `SYSTEM_ADMIN` before appearing in the public feed.

### 3.4 Multi-Theme Template Customization Studio
- **Dynamic Styling**: Allows organizers to switch between design templates (e.g. Modern Luxe, Traditional Ethiopian, Minimalist Gold).
- **Template Lock Capability**: Organizers can lock templates (`template_locked_at`) to prevent unintended couple edits.

---

## 4. Implementation Status Matrix

| Module / Feature | Status | Verification / Implementation Notes |
| :--- | :--- | :--- |
| **Role Authentication & RBAC** | ✅ Complete | JWT token & cookie authentication via `src/lib/auth.ts` |
| **RSVP Submission & 48h Lock** | ✅ Complete | Enforced via `RsvpService.ts` & `LockWindow.ts` |
| **QR Generation & Verification** | ✅ Complete | HMAC-SHA256 signing via `Ticket.ts` & `CheckInService.ts` |
| **Partial Headcount Check-In** | ✅ Complete | Atomic MySQL check-in via `MySqlInvitationRepository.ts` |
| **Content Moderation** | ✅ Complete | Scoped moderation via `ModerationService.ts` |
| **Organizer Account Management** | ✅ Complete | Active event protection via `OrganizerService.ts` |
| **Rate Limiting & Telemetry** | ✅ Complete | Upstash/Memory sliding window via `rateLimit.ts` & Sentry via `errorTracking.ts` |
