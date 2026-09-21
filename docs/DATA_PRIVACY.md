# Agafari Data Privacy & Retention Policy

**Document Version**: 2.0  
**Compliance Target**: Guest Personal Information Protection  

---

## 1. Scope of Collected Guest PII

Agafari collects minimal guest personal information required to facilitate wedding RSVPs, gate pass check-ins, and media memory sharing:

| Data Element | Purpose | Storage Table / Column | Scoping & Protection |
| :--- | :--- | :--- | :--- |
| **Guest Name** | Invitation identification & seating assignment | `invitations.guest_name` | Scoped to event organizer & couple. |
| **Phone Number** | Optional SMS/Telegram invitation delivery | `invitations.guest_phone` | Scoped to event organizer. **Masked** in all server logs (`maskPhone()`). |
| **RSVP Responses** | Headcount, dietary needs, song choices | `rsvps` table | Scoped to couple & event organizer. |
| **Media & Wishes** | Guest-uploaded photos, video reels, blessings | `wishes`, `media_assets` | Publicly visible post-moderation (`status = 'APPROVED'`). |

---

## 2. Retention Window & Automated Purge Policy

- **Active Retention Window**: Guest PII is actively retained for **90 days** post-wedding (`event.event_date`).
- **Post-Wedding Archival**: After 90 days, guest phone numbers and raw QR pass signatures are scheduled for automated hashing or deletion.
- **Log Privacy Guarantee**: Plaintext phone numbers, passwords, HMAC keys, and JWT session tokens are automatically sanitized before shipping to application logs or Sentry telemetry.

---

## 3. Access Scoping Matrix

| System Role | Guest List Access | Phone Number Access | RSVP Summary Access | Media Moderation Access |
| :--- | :--- | :--- | :--- | :--- |
| `SYSTEM_ADMIN` | Read / Write | Full | Full | Full |
| `EVENT_ORGANIZER` | Read / Write (Scoped to assigned events) | Full (Scoped) | Full (Scoped) | Full (Scoped) |
| `BRIDE_GROOM` | Read (Scoped to their single event) | Masked | Full (Scoped) | Read (Approved wishes) |
| `GATE_SCANNER` | Read (Verify QR code match) | Hidden | Hidden | None |
| `GUEST` (Public) | None | Hidden | None | Read (Approved public feed) |

---

## 4. Teardown & Cascade Deletion Order

When an event is deleted by an authorized organizer or system administrator, all associated records must be purged in foreign-key dependency order:

```sql
START TRANSACTION;

DELETE FROM gate_scan_logs WHERE invitation_id IN (SELECT id FROM invitations WHERE event_id = ?);
DELETE FROM media_comments WHERE media_id IN (SELECT id FROM media_assets WHERE event_id = ?);
DELETE FROM post_likes WHERE media_id IN (SELECT id FROM media_assets WHERE event_id = ?);
DELETE FROM media_assets WHERE event_id = ?;
DELETE FROM wishes WHERE event_id = ?;
DELETE FROM rsvps WHERE event_id = ?;
DELETE FROM invitations WHERE event_id = ?;
DELETE FROM event_staff WHERE event_id = ?;
DELETE FROM event_locations WHERE event_id = ?;
DELETE FROM live_streams WHERE event_id = ?;
DELETE FROM mezmur_playlist WHERE event_id = ?;
DELETE FROM events WHERE id = ?;

COMMIT;
```
