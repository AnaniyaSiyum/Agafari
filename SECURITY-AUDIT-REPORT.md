# Agafari Security Audit Report

**Target**: `AnaniyaSiyum/Agafari`  
**Execution Standard**: Cloudflare Security Audit Workflow (`@security-audit`)  
**Date**: October 24, 2026  
**Auditor Mode**: Defensive Source-Level Vulnerability Review & Adversarial Validation  
**Overall Posture**: **CRITICAL** (Multiple Unauthenticated Administrative Actions, Account Takeovers, and Credential Exposures Identified)

---

## Executive Summary

A systematic, source-level security audit was conducted on the Agafari platform, covering Next.js API route handlers (`frontend/src/app/api`), edge middleware routing (`frontend/src/middleware.ts`), authentication and authorization libraries (`auth.ts`, `requireMembership.ts`, `eventScope.ts`), the MySQL database interface, and the secondary PHP microservice.

### Key Architectural Finding
`frontend/src/middleware.ts` restricts its `matcher` configuration strictly to browser page routes (`/admin`, `/organizer`, `/couple`, etc.) and **explicitly excludes `/api/:path*`**. Consequently, **zero API endpoints inherit middleware authentication guards**. Each API route handler is solely responsible for enforcing its own server-side session and capability checks. Several endpoints omitted or improperly evaluated these checks, resulting in critical vulnerabilities.

---

## Vulnerability Summary Matrix

| ID | Vulnerability Title | Severity | Affected File & Lines | Affected Principal | CWE |
|---|---|---|---|---|---|
| **SEC-01** | Unauthenticated Database Wipe & Super Admin Backdoor | **CRITICAL** | [`frontend/src/app/api/admin/clean-slate/route.ts:82-108`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/admin/clean-slate/route.ts#L82-L108) | Entire Platform / All Users | CWE-306 |
| **SEC-02** | Hardcoded Backdoor Credentials in Dashboard Authentication | **CRITICAL** | [`frontend/src/app/api/auth/verify-dashboard/route.ts:74-80`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/auth/verify-dashboard/route.ts#L74-L80) | Any User Account (Admin, Organizer, Couple) | CWE-798 |
| **SEC-03** | Unauthenticated Account Hijacking & Admin Role Overwrite | **CRITICAL** | [`frontend/src/app/api/organizer/events/route.ts:410-460`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/organizer/events/route.ts#L410-L460) | System Administrator (`admin@agafari.com`) | CWE-287 / CWE-269 |
| **SEC-04** | Plaintext Password & Credential Exposure on Public Event Endpoint | **CRITICAL** | [`frontend/src/app/api/events/[slug]/route.ts:168-236`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/events/%5Bslug%5D/route.ts#L168-L236) | Wedding Couples & Event Staff (Scanner, Streamer, Moderator) | CWE-200 / CWE-312 |
| **SEC-05** | Unauthenticated Organizer Event & Credential Enumeration | **HIGH** | [`frontend/src/app/api/organizer/events/route.ts:235-377`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/organizer/events/route.ts#L235-L377) | All Event Organizers & Couples | CWE-306 / CWE-639 |
| **SEC-06** | Cross-Tenant Event & Credential Exposure (IDOR) | **HIGH** | [`frontend/src/app/api/admin/events/route.ts:84-125`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/admin/events/route.ts#L84-L125) | Event Organizers (Tenant Boundary Violation) | CWE-639 |
| **SEC-07** | Unauthenticated Event Modification (Tampering) | **HIGH** | [`frontend/src/app/api/events/[slug]/route.ts:262-360`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/events/%5Bslug%5D/route.ts#L262-L360) | Wedding Couples & Organizers | CWE-306 |
| **SEC-08** | Unauthenticated Guest List & Phone Number Disclosure | **HIGH** | [`frontend/src/app/api/events/[slug]/invitations/route.ts:104-161`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/events/%5Bslug%5D/invitations/route.ts#L104-L161) | Wedding Guests (PII) & Couples | CWE-284 / CWE-200 |
| **SEC-09** | Content Moderation Bypass via Parameter Tampering | **MEDIUM** | [`frontend/src/app/api/events/[slug]/media/route.ts:109-111`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/events/%5Bslug%5D/media/route.ts#L109-L111) | Couples & Wedding Guests | CWE-602 |
| **SEC-10** | Fail-Open Authorization in RSVP Lock Cron Worker | **LOW** | [`frontend/src/app/api/cron/lock-rsvps/route.ts:14-17`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/cron/lock-rsvps/route.ts#L14-L17) | Scheduled Jobs / Event RSVPs | CWE-1188 |

---

## Detailed Findings & Remediation Diffs

### SEC-01: Unauthenticated Database Wipe & Super Admin Backdoor
- **File & Line**: [`frontend/src/app/api/admin/clean-slate/route.ts:82-108`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/admin/clean-slate/route.ts#L82-L108)
- **Concrete Affected Principal**: All system tenants, organizers, couples, and platform administrators.
- **Impacted Data**: Permanent loss of 13 relational tables (`events`, `organizers`, `invitations`, `rsvps`, `wishes`, `media_assets`, `users`, etc.) and forced reset of superadmin password to `admin123`.
- **Mechanics**: The `GET` and `POST` handlers invoke `performCleanSlate()` without authenticating the caller or inspecting session tokens.
- **Adversarial Verification**: Verified against `middleware.ts`. Because the edge matcher excludes `/api/*`, any anonymous HTTP request immediately purges the production database.
- **Minimal Code Diff**:
```diff
--- a/frontend/src/app/api/admin/clean-slate/route.ts
+++ b/frontend/src/app/api/admin/clean-slate/route.ts
@@ -1,5 +1,6 @@
 import { NextRequest, NextResponse } from 'next/server';
+import { requireMembership } from '@/lib/requireMembership';
 import { query } from '@/lib/db';
 import { hashPasswordSync } from '@/lib/passwords';
 import { logAudit } from '@/lib/audit';
@@ -81,6 +82,10 @@ async function performCleanSlate() {
 }
 
 export async function POST(req: NextRequest) {
+  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
+  if (!auth.authorized) {
+    return NextResponse.json({ error: auth.error }, { status: auth.status });
+  }
   try {
     const ops = await performCleanSlate();
     return NextResponse.json({
@@ -95,6 +100,10 @@ export async function POST(req: NextRequest) {
 }
 
 export async function GET(req: NextRequest) {
+  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
+  if (!auth.authorized) {
+    return NextResponse.json({ error: auth.error }, { status: auth.status });
+  }
   try {
     const ops = await performCleanSlate();
     return NextResponse.json({
```

---

### SEC-02: Hardcoded Backdoor Credentials in Dashboard Authentication
- **File & Line**: [`frontend/src/app/api/auth/verify-dashboard/route.ts:74-80, 116-118, 145-148, 177-179, 285, 327-337`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/auth/verify-dashboard/route.ts#L74-L80)
- **Concrete Affected Principal**: Every registered account in the system (Admins, Organizers, Couples).
- **Impacted Data**: Full session token issuance, account impersonation, and administrative control.
- **Mechanics**: The authentication handler permits master bypass strings (`admin123`, `agafari2026`, `org123`, `scan123`, `stream123`, `mod123`) to evaluate as valid passwords, circumventing PBKDF2/bcrypt verification. Furthermore, section 4 dynamically mints organizer tokens for arbitrary input identifiers if the password is `org123`.
- **Adversarial Verification**: Verified that supplying `identifier: "admin@agafari.com"` with `password: "admin123"` returns a valid signed JWT with role `SYSTEM_ADMIN` regardless of the user's actual password hash.
- **Minimal Code Diff**:
```diff
--- a/frontend/src/app/api/auth/verify-dashboard/route.ts
+++ b/frontend/src/app/api/auth/verify-dashboard/route.ts
@@ -73,11 +73,8 @@ export async function POST(req: NextRequest) {
       if (dbUser && (dbUser.password_hash || dbUser.temporary_password)) {
         const isDbPasswordValid =
           (dbUser.password_hash && verifyPassword(password, dbUser.password_hash)) ||
-          (dbUser.temporary_password && dbUser.temporary_password === password) ||
-          password === 'admin123' ||
-          password === 'agafari2026' ||
-          password === 'org123';
+          (dbUser.temporary_password && dbUser.temporary_password === password);
 
         if (isDbPasswordValid) {
@@ -113,10 +110,7 @@ export async function POST(req: NextRequest) {
       if (storedUser) {
         const isPasswordValid =
           (storedUser.passwordHash && verifyPassword(password, storedUser.passwordHash)) ||
-          storedUser.temporaryPassword === password ||
-          password === 'admin123' ||
-          password === 'agafari2026' ||
-          password === 'org123';
+          storedUser.temporaryPassword === password;
 
         if (isPasswordValid) {
```

---

### SEC-03: Unauthenticated Account Hijacking & Admin Role Overwrite
- **File & Line**: [`frontend/src/app/api/organizer/events/route.ts:410-460`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/organizer/events/route.ts#L410-L460)
- **Concrete Affected Principal**: System Super Administrator (`admin@agafari.com`) or any existing user.
- **Impacted Data**: Account credentials, user roles, and platform ownership.
- **Mechanics**: In `POST /api/organizer/events`, line 410 calls `let auth = requireRole(req, ['EVENT_ORGANIZER', 'SYSTEM_ADMIN']);`, but fails to return `auth.response` when `!auth.ok`. Later at lines 456–460, if `coupleEmail` matches an existing user in the database, it executes:
  ```sql
  UPDATE users 
  SET role = 'BRIDE_GROOM', full_name = $1, password_hash = $2, temporary_password = $3, status = 'ACTIVE'
  WHERE id = $4
  ```
  An attacker can specify `coupleEmail: 'admin@agafari.com'`, which resets the superadmin's password and downgrades their role.
- **Adversarial Verification**: Traced handler execution when `req` contains no cookies/headers. `auth.ok` is `false`, but execution proceeds directly into the database transaction.
- **Minimal Code Diff**:
```diff
--- a/frontend/src/app/api/organizer/events/route.ts
+++ b/frontend/src/app/api/organizer/events/route.ts
@@ -408,7 +408,9 @@ export async function POST(req: NextRequest) {
     const tempPassword = `agafari${Math.floor(1000 + Math.random() * 9000)}`;
 
     let auth = requireRole(req, ['EVENT_ORGANIZER', 'SYSTEM_ADMIN']);
-    const userId = auth.ok ? auth.user.userId : null;
+    if (!auth.ok) {
+      return auth.response;
+    }
+    const userId = auth.user.userId;
 
     if ((!targetOrgId || targetOrgId === 'global') && auth.ok) {
```

---

### SEC-04: Plaintext Password & Credential Exposure on Public Event Endpoint
- **File & Line**: [`frontend/src/app/api/events/[slug]/route.ts:168-236`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/events/%5Bslug%5D/route.ts#L168-L236)
- **Concrete Affected Principal**: Couples, Gate Scanners, Streamers, and Moderators.
- **Impacted Data**: Plaintext temporary passwords and user emails for all assigned event staff and couples.
- **Mechanics**: The public wedding page queries `GET /api/events/[slug]`. The handler queries `u.temporary_password` from `users` and `event_staff`, constructs `dynamicCredentials`, and attaches them to `formattedEvent.credentials` and `formattedEvent.coupleCredentials` in the HTTP response.
- **Adversarial Verification**: Any guest visiting a wedding URL can open browser DevTools or send `curl /api/events/test-wedding` and obtain the credentials for the couple and gate security.
- **Minimal Code Diff**:
```diff
--- a/frontend/src/app/api/events/[slug]/route.ts
+++ b/frontend/src/app/api/events/[slug]/route.ts
@@ -164,6 +164,10 @@ export async function GET(_req: NextRequest, { params }: { params: { slug: strin
-      (formattedEvent as any).credentials = dynamicCredentials;
-      (formattedEvent as any).coupleCredentials = dynamicCredentials.couple;
-      (formattedEvent as any).team = staffMembers;
+      // Never leak user credentials or temporary passwords in public event responses
+      delete (formattedEvent as any).credentials;
+      delete (formattedEvent as any).coupleCredentials;
+      (formattedEvent as any).team = (staffMembers || []).map((s: any) => ({
+        id: s.assignment_id || s.id,
+        role: s.role,
+        fullName: s.full_name,
+      }));
```

---

### SEC-05: Unauthenticated Organizer Event & Credential Enumeration
- **File & Line**: [`frontend/src/app/api/organizer/events/route.ts:235-377`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/organizer/events/route.ts#L235-L377)
- **Concrete Affected Principal**: Event Organizers and Couples.
- **Impacted Data**: Complete listing of all weddings under any specified organizer ID, including couple passwords and staff credentials.
- **Mechanics**: In `GET /api/organizer/events`, line 235 calls `let auth = requireRole(req, ...);`, but does not return `auth.response` if unauthorized. The tenant check on line 240 is wrapped in `if (auth.ok && auth.user.role === 'EVENT_ORGANIZER')`. An unauthenticated caller bypasses this check and queries events for any `?id=<orgId>`.
- **Adversarial Verification**: Verified that unauthenticated `GET /api/organizer/events?id=org-sample` executes `SELECT e.* ... WHERE e.organizer_id = 'org-sample'` and returns full credential blocks.
- **Minimal Code Diff**:
```diff
--- a/frontend/src/app/api/organizer/events/route.ts
+++ b/frontend/src/app/api/organizer/events/route.ts
@@ -233,7 +233,10 @@ export async function GET(req: NextRequest) {
   const targetOrgId = req.nextUrl.searchParams.get('id') || req.nextUrl.searchParams.get('organizerId');
 
   try {
     let auth = requireRole(req, ['EVENT_ORGANIZER', 'SYSTEM_ADMIN']);
+    if (!auth.ok) {
+      return auth.response;
+    }
     const userId = auth.user.userId;
```

---

### SEC-06: Cross-Tenant Event & Credential Exposure (IDOR)
- **File & Line**: [`frontend/src/app/api/admin/events/route.ts:84-125`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/admin/events/route.ts#L84-L125)
- **Concrete Affected Principal**: Event Organizers (Agency Data Confidentiality).
- **Impacted Data**: All wedding events, guest statistics, and staff credentials belonging to competitor agencies.
- **Mechanics**: `GET /api/admin/events` authorizes both `SYSTEM_ADMIN` and `EVENT_ORGANIZER`. However, the query does not filter by the authenticated user's `tenantId`. An organizer logging into their dashboard can hit `/api/admin/events` and retrieve the events and credentials of all other agencies on the platform.
- **Adversarial Verification**: Logged in as `EVENT_ORGANIZER`; query returns all rows from `events` without tenant segregation.
- **Minimal Code Diff**:
```diff
--- a/frontend/src/app/api/admin/events/route.ts
+++ b/frontend/src/app/api/admin/events/route.ts
@@ -83,8 +83,16 @@ import { mockStore } from '@/lib/mockData';
 // GET: every wedding event on the platform, with organizer/couple names and stats
 export async function GET(req: NextRequest) {
-  const auth = requireRole(req, ['SYSTEM_ADMIN', 'EVENT_ORGANIZER']);
+  const auth = requireRole(req, ['SYSTEM_ADMIN']);
   if (!auth.ok) return auth.response;
```

---

### SEC-07: Unauthenticated Event Modification (Tampering)
- **File & Line**: [`frontend/src/app/api/events/[slug]/route.ts:262-360`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/events/%5Bslug%5D/route.ts#L262-L360)
- **Concrete Affected Principal**: Wedding Couples and Event Organizers.
- **Impacted Data**: Integrity of wedding dates, venue address, live broadcast URLs, dress code, and wedding status.
- **Mechanics**: `PATCH /api/events/[slug]` forwards directly to `handleUpdate`, which extracts request JSON and executes `UPDATE events SET ... WHERE id = $16` without validating any session token or permission.
- **Adversarial Verification**: Verified that sending a `PATCH` request with `{ "isLive": true, "youtubeVideoId": "malicious" }` modifies the event record in the database anonymously.
- **Minimal Code Diff**:
```diff
--- a/frontend/src/app/api/events/[slug]/route.ts
+++ b/frontend/src/app/api/events/[slug]/route.ts
@@ -2,6 +2,8 @@ export const dynamic = 'force-dynamic';
 
 import { NextRequest, NextResponse } from 'next/server';
 import { queryOne, query } from '@/lib/db';
+import { getAuthUser } from '@/lib/auth';
+import { checkEventAccess } from '@/lib/eventScope';
 import { mockStore } from '@/lib/mockData';
 
@@ -263,6 +265,18 @@ export async function PATCH(req: NextRequest, { params }: { params: { slug: str
 }
 
 async function handleUpdate(req: NextRequest, slug: string) {
+  const user = getAuthUser(req);
+  if (!user) {
+    return NextResponse.json({ error: 'Unauthorized — login required.' }, { status: 401 });
+  }
+
+  const eventRow = await queryOne<{ id: string }>('SELECT id FROM events WHERE LOWER(slug) = LOWER($1) OR id = $1', [slug]);
+  if (!eventRow) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
+
+  const access = await checkEventAccess(user, eventRow.id);
+  if (!access.allowed) {
+    return NextResponse.json({ error: 'Forbidden — insufficient event authority.' }, { status: 403 });
+  }
```

---

### SEC-08: Unauthenticated Guest List & Phone Number Disclosure
- **File & Line**: [`frontend/src/app/api/events/[slug]/invitations/route.ts:104-161`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/events/%5Bslug%5D/invitations/route.ts#L104-L161)
- **Concrete Affected Principal**: Wedding Guests (Privacy/PII).
- **Impacted Data**: Guest names, phone numbers, seating/table numbers, headcount, and unhashed invitation access tokens.
- **Mechanics**: When `GET /api/events/[slug]/invitations` is called without `?code=`, lines 104–110 check `if (user) { ... }`. If `user` is absent, the check is skipped without returning 401. The endpoint returns the full invitation table.
- **Adversarial Verification**: Calling `GET /api/events/test-wedding/invitations` anonymously returns the complete list of invited guests and phone numbers.
- **Minimal Code Diff**:
```diff
--- a/frontend/src/app/api/events/[slug]/invitations/route.ts
+++ b/frontend/src/app/api/events/[slug]/invitations/route.ts
@@ -103,11 +103,12 @@ export async function GET(req: NextRequest, { params }: { params: { slug: string
   // Dashboard lookup: require authenticated user & event access for bulk guest list
   const user = getAuthUser(req);
-  if (user) {
-    const access = await checkEventAccess(user, resolved.event.id);
-    if (!access.allowed && user.role !== 'SYSTEM_ADMIN') {
-      console.warn(`User ${user.userId} access not explicit, proceeding in preview scope.`);
-    }
+  if (!user) {
+    return NextResponse.json({ error: 'Unauthorized — session required to view guest list.' }, { status: 401 });
+  }
+  const access = await checkEventAccess(user, resolved.event.id);
+  if (!access.allowed && user.role !== 'SYSTEM_ADMIN') {
+    return NextResponse.json({ error: 'Forbidden — not authorized for this event.' }, { status: 403 });
   }
```

---

### SEC-09: Content Moderation Bypass via Parameter Tampering
- **File & Line**: [`frontend/src/app/api/events/[slug]/media/route.ts:109-111`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/events/%5Bslug%5D/media/route.ts#L109-L111)
- **Concrete Affected Principal**: Couples and Event Attendees.
- **Impacted Data**: Public wedding live feed integrity.
- **Mechanics**: In `POST /api/events/[slug]/media`, line 110 sets:
  ```ts
  const initialStatus = (user?.role === 'SYSTEM_ADMIN' || user?.role === 'EVENT_ORGANIZER' || status === 'APPROVED') ? 'APPROVED' : 'PENDING';
  ```
  An anonymous guest submitting an upload with `"status": "APPROVED"` forces the media asset into `APPROVED` status, bypassing moderator triage.
- **Adversarial Verification**: Verified that sending `{ "cdnUrl": "https://...", "status": "APPROVED" }` writes a row with `status = 'APPROVED'` visible on the public feed.
- **Minimal Code Diff**:
```diff
--- a/frontend/src/app/api/events/[slug]/media/route.ts
+++ b/frontend/src/app/api/events/[slug]/media/route.ts
@@ -108,7 +108,7 @@ export async function POST(req: NextRequest, { params }: { params: { slug: strin
     if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
 
     const user = getAuthUser(req);
-    const initialStatus = (user?.role === 'SYSTEM_ADMIN' || user?.role === 'EVENT_ORGANIZER' || status === 'APPROVED') ? 'APPROVED' : 'PENDING';
+    const initialStatus = (user?.role === 'SYSTEM_ADMIN' || user?.role === 'EVENT_ORGANIZER' || user?.role === 'CONTENT_MODERATOR') ? 'APPROVED' : 'PENDING';
 
     const mediaId = `med_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
```

---

### SEC-10: Fail-Open Authorization in RSVP Lock Cron Worker
- **File & Line**: [`frontend/src/app/api/cron/lock-rsvps/route.ts:14-17`](file:///c:/Users/hp/OneDrive/Documents/dagi/Agafari/frontend/src/app/api/cron/lock-rsvps/route.ts#L14-L17)
- **Concrete Affected Principal**: Wedding RSVPs and Event Planners.
- **Impacted Data**: Locking state of wedding invitations.
- **Mechanics**: The endpoint checks:
  ```ts
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  ```
  If `CRON_SECRET` is unset in production, the condition is skipped, allowing any anonymous caller to trigger the lock worker.
- **Adversarial Verification**: Verified that unsetting `CRON_SECRET` allows unauthenticated POST requests to execute `rsvpService.lockEligibleRsvps()`.
- **Minimal Code Diff**:
```diff
--- a/frontend/src/app/api/cron/lock-rsvps/route.ts
+++ b/frontend/src/app/api/cron/lock-rsvps/route.ts
@@ -12,7 +12,8 @@ const rsvpService = new RsvpService(
 
 export async function POST(req: NextRequest) {
+  const configuredSecret = process.env.CRON_SECRET;
+  const secret = req.headers.get('authorization')?.replace('Bearer ', '');
-  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
+  if (!configuredSecret || secret !== configuredSecret) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
```

---

## Conclusion & Recommended Action Plan

1. **Immediate Action**: Apply the minimal code diffs for **SEC-01** (protecting `/api/admin/clean-slate`), **SEC-02** (eliminating master backdoor passwords), **SEC-03** (closing the unauthenticated superadmin account takeover), and **SEC-04** (redacting credentials from the public event endpoint).
2. **Multi-Tenant Hardening**: Enforce tenant boundaries on `/api/admin/events` and `/api/organizer/events` so that organizations are strictly isolated to their own tenant data.
3. **Defense-in-Depth**: Add `/api/:path*` to the Next.js `middleware.ts` matcher to reject unauthenticated requests to protected API spaces (`/api/admin/*`, `/api/organizer/*`) before they reach route handlers.
