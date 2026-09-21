# Agafari Guest Data Retention & Privacy Policy

This document defines the guest data retention policy and cascade deletion specification for the Agafari Wedding Platform SaaS.

---

## 1. Guest Data Retention Policy

Guest personal data (names, phone numbers, RSVP responses, dietary notes, and QR gate scan logs) collected on the Agafari platform is stored strictly for the operational duration of the wedding event.

- **Active Retention Window**: Guest data is actively accessible to the couple and event organizer for **90 days** following the conclusion of the event (`event_date`).
- **Post-Event Archival**: After 90 days, guest phone numbers and raw QR pass signatures are scheduled for automated purge or hashing to protect attendee privacy.
- **Log Masking Policy**: Guest phone numbers MUST be masked (`***-***-1234`) in all application server logs and telemetry breadcrumbs. Plaintext phone numbers are never persisted in log storage.

---

## 2. Event Teardown & Cascade Deletion Specification

When an event organizer or system administrator deletes an event, all associated records across tenant tables must be deleted cleanly.

In MySQL, foreign keys with `ON DELETE CASCADE` manage this at the database level. For application-level or manual teardown, tables must be purged in the following strict dependency order:

```sql
START TRANSACTION;

-- 1. Gate scan logs
DELETE FROM gate_scan_logs WHERE event_id = ?;

-- 2. Media comments & uploads
DELETE FROM media_comments WHERE media_id IN (SELECT id FROM media_assets WHERE event_id = ?);
DELETE FROM media_assets WHERE event_id = ?;

-- 3. Guest wishes & blessings
DELETE FROM wishes WHERE event_id = ?;

-- 4. Guest invitations & QR passes
DELETE FROM invitations WHERE event_id = ?;

-- 5. Quota groups & staff assignments
DELETE FROM quota_groups WHERE event_id = ?;
DELETE FROM event_staff WHERE event_id = ?;

-- 6. Event entity
DELETE FROM events WHERE id = ?;

COMMIT;
```

---

## 3. Compliance Verification

- All API endpoints returning guest export datasets (invitation list, headcount breakdown, scan logs) enforce tenant isolation via `checkEventAccess(user, eventId)`.
- Anonymous access to bulk guest data is forbidden (returns HTTP 401 Unauthorized).
