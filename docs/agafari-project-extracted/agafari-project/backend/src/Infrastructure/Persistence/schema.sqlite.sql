-- Minimal schema matching the ERD in agafari-architecture.md, SQLite dialect.
-- Run: sqlite3 storage/database.sqlite < src/Infrastructure/Persistence/schema.sqlite.sql

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  couple_names TEXT NOT NULL,
  wedding_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  type TEXT NOT NULL CHECK (type IN ('home','church','hall','melse')),
  gps_coords TEXT
);

CREATE TABLE IF NOT EXISTS quotas (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  delegate_user_id TEXT,
  slots_total INTEGER NOT NULL,
  slots_used INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS guests (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  quota_id TEXT REFERENCES quotas(id),
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited','confirmed','declined','checked_in')),
  headcount_allowed INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  guest_id TEXT NOT NULL UNIQUE REFERENCES guests(id),
  qr_signature TEXT NOT NULL,
  headcount_allowed INTEGER NOT NULL DEFAULT 1,
  checked_in_at TEXT,
  checked_in_by_device TEXT
);

CREATE TABLE IF NOT EXISTS timeline_milestones (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  label TEXT NOT NULL,
  planned_at TEXT NOT NULL,
  current_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS media_items (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  guest_id TEXT REFERENCES guests(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  storage_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS event_ratings (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  food INTEGER,
  ambiance INTEGER,
  coordination INTEGER
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  permission_key TEXT NOT NULL
);

-- Seed one demo event + guest so the API has something to check in against.
INSERT OR IGNORE INTO events (id, slug, couple_names, wedding_date)
VALUES ('evt_demo', 'kal-hana', 'Kaleab & Hanna', '2026-11-14');

INSERT OR IGNORE INTO guests (id, event_id, quota_id, phone, status, headcount_allowed)
VALUES ('guest_demo', 'evt_demo', NULL, '+251900000000', 'invited', 2);
