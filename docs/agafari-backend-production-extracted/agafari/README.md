# AGAFARI — Consolidated Backend (Phases 1–3e merged)

This is every backend deliverable from Phase 1 (schema/roles), Phase 2 (audit),
and Phase 3a–3e (the actual fix batches) merged into **one buildable
repository**, with later phases overriding earlier files where they conflict.
No functionality was added beyond what those phases already built — this is
an assembly + packaging pass, not a new rewrite.

## What this repo IS

A real, runnable **Next.js API backend** on **Postgres**, covering:
auth (JWT, PBKDF2 passwords), admin/organizer/couple event management,
multi-event staff assignment (`event_staff`), quota delegation, HMAC-signed
QR invitations + gate scanning with row-locking, RSVP with a 2-day edit
lock (enforced via cron), the TikTok-style media feed with moderation,
likes, comments, guest text wishes, and template lock/customization.

## What this repo is NOT (read this before assuming it's 100% done)

**There is no frontend UI in any of the phase deliverables you uploaded.**
The Phase 2 audit references ~58 existing page components
(`app/{admin,couple,organizer,event,scanner}/**`), but their source was
never part of what was handed to Phase 3 — every Phase 3 README says this
explicitly ("frontend page components were never in scope... no source was
provided"). So:

- If you still have that original Next.js frontend project, drop its
  `src/app/(non-api)/**` pages, its `components/`, and its `public/` folder
  into this repo, delete its old `src/lib/mockData.ts` and old
  `src/app/api/**`, and point its `fetch()` calls at the response shapes
  below.
- If you don't have it anymore, the UI needs to be built from scratch
  against this API. I can do that next (it's a large, separate job — five
  role-based dashboards plus the public guest-facing pages) — say the word
  and tell me which dashboard to start with.
- Also genuinely unbuilt (flagged as "still open" in the Phase 3 READMEs,
  not silently dropped): `templates`/`cms_sections` CRUD routes (tables
  exist, no endpoints), the scanner's offline IndexedDB queue (a frontend
  concern), and a decision on whether staff/delegates should log in with a
  lighter no-password link instead of email+password.

## Folder structure

```
agafari/
├── db/
│   ├── 001_schema.sql                     # full schema (all 15 tables), fixed SQL syntax error included
│   └── migrations/
│       ├── 002_gate_scan_logs.sql
│       ├── 003_quota_groups.sql
│       ├── 004_template_lock.sql
│       └── 005_seed_templates_and_cms.sql # starter templates + landing-page CMS content (safe to re-run)
├── scripts/
│   ├── migrate.js                         # runs 001 + migrations/*, tracks progress in schema_migrations
│   └── seed-admin.js                      # creates the first SYSTEM_ADMIN (no public signup for this role)
├── src/
│   ├── lib/
│   │   ├── auth.ts                        # JWT + PBKDF2 password hashing, requireRole()
│   │   ├── db.ts                          # pooled pg query helper
│   │   ├── eventScope.ts                  # checkEventAccess() — single source of truth for event permissions
│   │   └── ticketSigner.ts                # HMAC-signed, offline-verifiable QR payloads
│   └── app/
│       ├── layout.tsx / page.tsx          # placeholder root — see "What this repo is NOT"
│       └── api/
│           ├── auth/{login,me}
│           ├── admin/{users,events}
│           ├── organizer/{events,media,media/comments,wishes}
│           ├── events/[slug]/
│           │   ├── route.ts               # event detail
│           │   ├── rsvp/                  # RSVP + 2-day lock check
│           │   ├── invitations/           # create/list, quota-scoped
│           │   ├── quota/                 # allocate/adjust delegate quotas
│           │   ├── team/                  # assign event_staff (scanner/streamer/moderator/delegate)
│           │   ├── template/              # customize + organizer lock
│           │   ├── media/                 # TikTok-style feed, moderation queue
│           │   └── wishes/                # guest text wishes wall
│           ├── media/[mediaId]/comments/
│           ├── qr/[code]/                 # POST — the actual gate scan (see note below)
│           └── cron/lock-rsvps/           # scheduled job: sets rsvp_locked_at at T-2 days
├── package.json / tsconfig.json / next.config.js
└── .env.example
```

## Setup

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, JWT_SECRET, TICKET_SIGNING_SECRET, CRON_SECRET, PUBLIC_APP_URL
                           # generate secrets with: openssl rand -base64 48
npm run db:migrate         # applies db/001_schema.sql + everything in db/migrations/, in order
node scripts/seed-admin.js "Your Name" you@example.com "a-strong-password"
npm run dev                # or `npm run build && npm run start` for production
```

Wire `POST /api/cron/lock-rsvps` (send header `Authorization: Bearer $CRON_SECRET`)
to an hourly scheduler — Vercel Cron, a system crontab hitting the URL, etc.
This is what actually sets `invitations.rsvp_locked_at`; nothing else does.

## Key design decisions carried over from Phase 1–3 (so you don't have to re-derive them)

- **Next.js API routes are the one real backend.** The old PHP Clean
  Architecture skeleton was retired — it was dead code, never called by the
  frontend, and porting the larger Next.js API surface to PHP would've been
  strictly more work for no functional gain.
- **Role names unchanged** (`SYSTEM_ADMIN`, `EVENT_ORGANIZER`, `BRIDE_GROOM`,
  `LIVE_STREAMER`, `GATE_SCANNER`, `GUEST` on `users.role`; `GATE_SCANNER`,
  `LIVE_STREAMER`, `CONTENT_MODERATOR`, `QUOTA_DELEGATE` on
  `event_staff.role`) so any surviving frontend role checks don't need
  touching.
- **One person, many events**: `organizers` + `event_staff` replace the old
  `users.event_id` column — the structural fix for "one account = one
  wedding."
- **QR scan is `POST /api/qr`, not `GET`.** A scan mutates state
  (marks a ticket checked-in); a GET that mutates state is replayable by
  anything that can fetch the URL. Signature verification can happen
  offline in the scanner app itself; the POST is the authoritative,
  row-locked ("`FOR UPDATE`") check-in that also writes `gate_scan_logs`.
- **Plaintext temporary passwords** are returned in the API response exactly
  once, at account/event creation, and never again on a later `GET`.
- **Security-sensitive secrets have no hardcoded fallback** — the app will
  not start without `JWT_SECRET` / `TICKET_SIGNING_SECRET` set for real.

## Security checklist before going live

- [ ] Rotate/generate all four secrets in `.env` — do not reuse anything from a dev `.env`.
- [ ] Confirm `DATABASE_SSL=true` against your managed Postgres provider.
- [ ] Put `POST /api/cron/lock-rsvps` behind the `CRON_SECRET` check (already coded) and restrict it at the network/edge level too if your host supports it.
- [ ] Decide on the staff/delegate auth model (full account vs. lightweight link) before onboarding real gate scanners — see "still open" above.
- [ ] Build/port the frontend, then do a real pass over CORS, rate limiting, and file-upload validation for the media routes (not covered by any phase so far — these routes accept a `media_url` string; if guests upload directly, add virus/type scanning and size limits at the upload endpoint, which doesn't exist yet either).
