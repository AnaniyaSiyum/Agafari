# Agafari (አጋፋሪ) — project scaffold

This is a runnable clean-architecture scaffold matching `agafari-architecture.md`:

- `backend/` — PHP API (zero Composer dependencies to run; SQLite by default, MySQL-ready)
- `frontend/` — Next.js 16 (App Router) PWA shell
- `agafari-architecture.md` — the full system design, data flow, business logic, and folder structure spec

## Quick start

**Backend** (in one terminal):
```bash
cd backend
cp .env.example .env
sqlite3 storage/database.sqlite < src/Infrastructure/Persistence/schema.sqlite.sql
php -S localhost:8000 -t public
```

**Frontend** (in another terminal):
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Then open `http://localhost:3000/scanner` or `http://localhost:3000/e/kal-hana/guest_demo`.

Both halves were actually run and tested while this was built — the check-in
double-scan rule, the forged-signature rejection, and the Next.js build all
pass. See each folder's own README for details and for what's still a
deliberate stub (camera-based QR scanning, real QR rendering, Telegram/YouTube
integrations) versus what's wired end-to-end.
