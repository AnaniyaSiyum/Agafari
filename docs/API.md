# Agafari Monolith REST API Specification

**Document Version**: 2.0  
**Base URL**: `http://localhost:3000/api` (Dev) / `https://your-domain.com/api` (Production)  
**Authentication**: Bearer Token in `Authorization` header OR `agafari_token` HTTP-Only Cookie.

---

## 1. Authentication & Session Endpoints

### 1.1 `POST /api/auth/login`
- **Auth**: Public (None)
- **Request Body**:
  ```json
  { "email": "user@example.com", "password": "password123" }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": { "id": "usr_123", "email": "user@example.com", "role": "EVENT_ORGANIZER" }
  }
  ```
- **Errors**: `400 Bad Request` (missing fields), `401 Unauthorized` (invalid credentials).

### 1.2 `GET /api/auth/me`
- **Auth**: Authenticated User (`SYSTEM_ADMIN`, `EVENT_ORGANIZER`, `BRIDE_GROOM`, `GATE_SCANNER`, `LIVE_STREAMER`)
- **Response (200 OK)**: Returns authenticated user payload.
- **Errors**: `401 Unauthorized` (no valid session).

---

## 2. Gate Security & Check-In Endpoints

### 2.1 `POST /api/qr/[code]`
- **Auth**: `GATE_SCANNER`, `SYSTEM_ADMIN`
- **Rate Limit**: 120 requests / 1 minute per staff user
- **Request Body**:
  ```json
  {
    "eventId": "evt_123",
    "inviteCode": "RSVP123",
    "maxGuests": 4,
    "sig": "32byte_hmac_sha256_signature",
    "admitCount": 2
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "result": "VALID",
    "message": "Checked in 2 guest(s).",
    "guestName": "Smith Family",
    "admitted": 2,
    "remaining": 2,
    "invitationId": "inv_123"
  }
  ```
- **Errors**:
  - `400 Bad Request`: `InvalidQrSignatureError` (forged QR signature) or missing parameters.
  - `400 Bad Request`: `EventExpiredError` (event COMPLETED/ARCHIVED).
  - `403 Forbidden`: User is not a gate scanner for this event.
  - `404 Not Found`: Invitation code not found.
  - `409 Conflict`: `AlreadyScannedError` (pass already fully scanned).
  - `429 Too Many Requests`: Rate limit exceeded.

---

## 3. RSVP & Invitation Endpoints

### 3.1 `POST /api/events/[slug]/rsvp`
- **Auth**: Public (Guest)
- **Rate Limit**: 5 requests / 10 minutes per IP/inviteCode
- **Request Body**:
  ```json
  {
    "inviteCode": "RSVP123",
    "attendanceStatus": "ATTENDING",
    "attendingCount": 2,
    "songRecommendation": "Abebe Tessema - Wedding Song",
    "dietaryNotes": "Vegan",
    "guestName": "Abebe",
    "guestPhone": "+251911223344"
  }
  ```
- **Response (200 OK)**:
  ```json
  { "success": true, "eventId": "evt_123", "invitationId": "inv_123", "rsvpStatus": "ATTENDING" }
  ```
- **Errors**: `400 Bad Request`, `404 Not Found`, `409 Conflict` (`RsvpLockedError` when < 48h to event), `429 Too Many Requests`.

### 3.2 `GET /api/events/[slug]/invitations`
- **Auth**: Public with `?code=INVITE_CODE` OR Authenticated (`EVENT_ORGANIZER`, `BRIDE_GROOM`, `SYSTEM_ADMIN`)
- **Query Params**: `?code=RSVP123` (public guest lookup)
- **Response (200 OK)**: Returns invitation record for single guest or array of invitations for event dashboard.
- **Errors**: `401 Unauthorized` (for bulk list without login), `403 Forbidden` (cross-tenant access breach), `404 Not Found`.

### 3.3 `POST /api/events/[slug]/invitations`
- **Auth**: `EVENT_ORGANIZER`, `BRIDE_GROOM`, `SYSTEM_ADMIN`
- **Request Body**:
  ```json
  { "guestName": "Kebede", "guestPhone": "+251911000000", "maxGuests": 2, "inviteType": "CARD" }
  ```
- **Response (201 Created)**: Returns created invitation object with signed `qrCodeUrl`.
- **Errors**: `401 Unauthorized`, `403 Forbidden`.

---

## 4. Content Feed, Wishes & Moderation Endpoints

### 4.1 `GET /api/events/[slug]/wishes`
- **Auth**: Public (Guests see `APPROVED` text wishes) / Staff with `?status=` parameter.
- **Response (200 OK)**: `{ "wishes": [...] }`

### 4.2 `POST /api/events/[slug]/wishes`
- **Auth**: Public (Guest)
- **Rate Limit**: 3 requests / 5 minutes per IP
- **Request Body**:
  ```json
  { "senderName": "Tigist", "message": "Wishing you eternal joy!", "mediaType": "TEXT" }
  ```
- **Response (201 Created)**: `{ "success": true, "wish": {...} }`
- **Errors**: `400 Bad Request` (empty fields or message > 2000 chars), `429 Too Many Requests`.

### 4.3 `GET /api/organizer/media` & `PATCH /api/organizer/media`
- **Auth**: `EVENT_ORGANIZER`, `SYSTEM_ADMIN`, `CONTENT_MODERATOR`
- **Description**: Moderates uploaded photo/video memory reels (`PENDING` -> `APPROVED` / `REJECTED`).

---

## 5. System Administration & Organizer Endpoints

### 5.1 `GET /api/admin/users` & `DELETE /api/admin/users`
- **Auth**: `SYSTEM_ADMIN`
- **DELETE Request**: `DELETE /api/admin/users?id=usr_org_123`
- **Response (200 OK)**: `{ "success": true, "message": "Organizer agency deleted successfully." }`
- **Errors**: `400 Bad Request` (`OrganizerHasActiveEventsError` if organizer has active `LIVE` / `COMING_SOON` events).

### 5.2 `PATCH /api/events/[slug]/template`
- **Auth**: `EVENT_ORGANIZER`, `BRIDE_GROOM`, `SYSTEM_ADMIN`
- **Description**: Updates template design ID and customization JSON. Enforces template lock (`ForbiddenError` if couple attempts edit while locked).
