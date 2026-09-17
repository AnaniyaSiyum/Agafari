# Agafari frontend (Next.js 14, App Router)

## Run it

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Then visit:

- `http://localhost:3000/` — shell landing page
- `http://localhost:3000/scanner` — gate scanner skeleton (talks to the PHP API's `/api/scan`)
- `http://localhost:3000/e/kal-hana/guest_demo` — guest RSVP + ticket page (talks to `/api/guests/{token}/confirm`)

Make sure the backend is running first (`../backend/README.md`) — `NEXT_PUBLIC_API_BASE_URL`
in `.env.local` points at it.

## What's real vs. a stub here

Real and working: the API client, the offline scan queue (localStorage for
the skeleton — swap for IndexedDB before production), the route structure
matching the roles in `/agafari-architecture.md`.

Stubbed on purpose (so the scaffold stays small): the scanner page uses a text
input instead of a camera-based QR reader, and the QR ticket renders as raw
text instead of an actual QR image. Both are drop-in swaps — `qrcode.react`
for rendering, any `react-qr-reader`-style library for scanning — the API
contracts (`lib/api/scanner.ts`, `lib/api/client.ts`) don't need to change.
