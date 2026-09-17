-- =============================================================================
-- AGAFARI (አጋፋሪ) WEDDING PLATFORM — FIXED SCHEMA (Phase 3)
-- Replaces frontend/db/schema.sql. Fixes vs. the audited version:
--   - stray "]" syntax error in event_status_enum (was breaking this file)
--   - users.event_id removed (blocked an organizer from owning >1 event)
--   - organizers table + event_staff join table added (multi-tenancy, multi-role staff)
--   - templates + per-event customization added
--   - cms_sections added (admin-controlled landing page blocks)
--   - post_likes added (media_assets.likes_count was an unprotected counter)
--   - invitations.rsvp_locked_at added (2-day-before-wedding RSVP lock)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

CREATE TYPE event_status_enum AS ENUM (
    'DRAFT',
    'COMING_SOON',
    'LIVE',
    'COMPLETED',
    'ARCHIVED'
);

CREATE TYPE admin_approval_enum AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);

-- Kept identical to the existing frontend enum values on purpose — every page
-- component and lib/auth.ts UserRole type already depends on these exact
-- strings, and renaming them would mean touching ~58 frontend files for no
-- functional gain. The fix for the "one event per user" problem is structural
-- (see `organizers` / `event_staff` below), not a role-name change.
CREATE TYPE user_role_enum AS ENUM (
    'SYSTEM_ADMIN',
    'EVENT_ORGANIZER',
    'BRIDE_GROOM',
    'LIVE_STREAMER',
    'GATE_SCANNER',
    'GUEST'
);

CREATE TYPE event_managed_by_enum AS ENUM (
    'ORGANIZER',
    'ADMIN'
);

CREATE TYPE staff_role_enum AS ENUM (
    'GATE_SCANNER',
    'LIVE_STREAMER',
    'CONTENT_MODERATOR',
    'QUOTA_DELEGATE'
);

CREATE TYPE rsvp_status_enum AS ENUM (
    'ATTENDING',
    'MAYBE',
    'DECLINED',
    'PENDING'
);

CREATE TYPE invitation_type_enum AS ENUM (
    'CARD',
    'LINK'
);

CREATE TYPE media_category_enum AS ENUM (
    'WISHES',
    'BTS',
    'LIVE'
);

CREATE TYPE media_type_enum AS ENUM (
    'VIDEO',
    'IMAGE'
);

-- =============================================================================
-- 1. USER ACCOUNTS (global identity — no event_id here, see event_staff below)
-- =============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'GUEST',
    created_by UUID REFERENCES users(id), -- e.g. the admin who created an organizer login
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =============================================================================
-- 2. ORGANIZERS (a EVENT_ORGANIZER user can own many events)
-- =============================================================================

CREATE TABLE organizers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    created_by_admin_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_organizers_owner ON organizers(owner_user_id);

-- =============================================================================
-- 3. TEMPLATES (couples pick one, then customize)
-- =============================================================================

CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    preview_url TEXT,
    config_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =============================================================================
-- 4. WEDDING EVENTS TABLE
-- =============================================================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(120) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    managed_by event_managed_by_enum NOT NULL DEFAULT 'ADMIN',
    organizer_id UUID REFERENCES organizers(id),        -- NULL when managed_by = 'ADMIN'
    couple_user_id UUID REFERENCES users(id),            -- the BRIDE_GROOM login for this event
    template_id UUID REFERENCES templates(id),
    template_customization_json JSONB DEFAULT '{}'::jsonb,
    bride_name VARCHAR(150) NOT NULL,
    groom_name VARCHAR(150) NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    start_time VARCHAR(20) DEFAULT '14:00',
    second_event_date TIMESTAMPTZ,
    venue_name VARCHAR(255) NOT NULL,
    venue_address TEXT,
    venue_map_url TEXT,
    dress_code VARCHAR(255),
    welcome_message TEXT,
    cover_image_url TEXT,
    status event_status_enum DEFAULT 'COMING_SOON' NOT NULL,
    admin_approval_status admin_approval_enum DEFAULT 'APPROVED' NOT NULL,
    youtube_video_id VARCHAR(50),
    is_live BOOLEAN DEFAULT FALSE NOT NULL,
    thank_you_message TEXT,
    thank_you_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CHECK (
        (managed_by = 'ORGANIZER' AND organizer_id IS NOT NULL)
        OR (managed_by = 'ADMIN' AND organizer_id IS NULL)
    )
);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_couple ON events(couple_user_id);

-- Multiple venues per wedding (ceremony / hall / melse, etc.)
CREATE TABLE event_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,     -- "Church", "Reception Hall", "Melse Venue"
    address TEXT NOT NULL,
    map_url TEXT,
    order_index INT DEFAULT 0 NOT NULL
);

CREATE INDEX idx_event_locations_event ON event_locations(event_id);

-- =============================================================================
-- 5. EVENT STAFF (per-event role assignment — one user, many events, many roles)
-- =============================================================================

CREATE TABLE event_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role staff_role_enum NOT NULL,
    assigned_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(event_id, user_id, role)
);

CREATE INDEX idx_event_staff_event ON event_staff(event_id);
CREATE INDEX idx_event_staff_user ON event_staff(user_id);

-- =============================================================================
-- 6. DIGITAL GUEST INVITATIONS & QR PASSES
-- =============================================================================

CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    invite_code VARCHAR(50) UNIQUE NOT NULL,
    invite_type invitation_type_enum DEFAULT 'CARD' NOT NULL,
    guest_name VARCHAR(150) NOT NULL,
    guest_phone VARCHAR(50),
    max_guests INT DEFAULT 1 NOT NULL,
    table_number VARCHAR(100),
    rsvp_status rsvp_status_enum DEFAULT 'PENDING' NOT NULL,
    rsvp_updated_at TIMESTAMPTZ,
    rsvp_locked_at TIMESTAMPTZ,           -- set by scheduled job at (event_date - 2 days); NULL = still editable
    attending_headcount INT DEFAULT 0 NOT NULL,
    is_scanned BOOLEAN DEFAULT FALSE NOT NULL,
    scanned_count INT DEFAULT 0 NOT NULL,
    scanned_at TIMESTAMPTZ,
    scanned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    qr_code_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_invitations_code ON invitations(invite_code);
CREATE INDEX idx_invitations_event ON invitations(event_id);
CREATE INDEX idx_invitations_is_scanned ON invitations(is_scanned);

-- =============================================================================
-- 7. 1-CLICK INSTANT RSVPS (also carries the singer/zemari recommendation —
--    kept merged per the Phase 2 confirmed decision, not split into its own table)
-- =============================================================================

CREATE TABLE rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    invitation_id UUID REFERENCES invitations(id) ON DELETE SET NULL,
    invite_code VARCHAR(50),
    guest_name VARCHAR(150) NOT NULL,
    guest_phone VARCHAR(50),
    attendance_status rsvp_status_enum NOT NULL,
    attending_count INT DEFAULT 1 NOT NULL,
    song_recommendation TEXT,      -- singer/zemari recommendation, free text
    dietary_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX idx_rsvps_status ON rsvps(attendance_status);

-- =============================================================================
-- 8. GUEST WISHES & BLESSINGS (text/video wishes to the couple)
-- =============================================================================

CREATE TABLE wishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    sender_name VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    media_type media_type_enum,
    video_url TEXT,
    status admin_approval_enum DEFAULT 'APPROVED' NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_wishes_event_id ON wishes(event_id);
CREATE INDEX idx_wishes_status ON wishes(status);

-- =============================================================================
-- 9. TIKTOK-STYLE VIDEO MEMORY FEED
-- =============================================================================

CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    uploader_name VARCHAR(150) NOT NULL,
    media_type media_type_enum DEFAULT 'VIDEO' NOT NULL,
    category media_category_enum DEFAULT 'WISHES' NOT NULL,
    cdn_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    views_count INT DEFAULT 0 NOT NULL,
    likes_count INT DEFAULT 0 NOT NULL,    -- kept as a fast-read cache, now driven by post_likes via trigger below
    status admin_approval_enum DEFAULT 'PENDING' NOT NULL,
    moderated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_media_event_id ON media_assets(event_id);
CREATE INDEX idx_media_category ON media_assets(category);
CREATE INDEX idx_media_status ON media_assets(status);

-- Per-guest like tracking (fixes the unprotected likes_count counter)
CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    guest_identifier VARCHAR(255) NOT NULL,   -- device/session id; guests aren't authenticated users
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(media_id, guest_identifier)
);

CREATE OR REPLACE FUNCTION sync_media_likes_count() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE media_assets SET likes_count = likes_count + 1 WHERE id = NEW.media_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE media_assets SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.media_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_post_likes_insert AFTER INSERT ON post_likes
    FOR EACH ROW EXECUTE PROCEDURE sync_media_likes_count();
CREATE TRIGGER trg_post_likes_delete AFTER DELETE ON post_likes
    FOR EACH ROW EXECUTE PROCEDURE sync_media_likes_count();

CREATE TABLE media_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    sender_name VARCHAR(150) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_comments_media_id ON media_comments(media_id);

CREATE TABLE live_streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    started_by UUID REFERENCES users(id),
    youtube_video_id VARCHAR(50),
    status VARCHAR(20) CHECK (status IN ('SCHEDULED','LIVE','ENDED')) DEFAULT 'SCHEDULED' NOT NULL,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ
);

CREATE INDEX idx_live_streams_event ON live_streams(event_id);

-- =============================================================================
-- 10. MEZMUR & WEDDING MUSIC PLAYLIST
-- =============================================================================

CREATE TABLE mezmur_playlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'MEZMUR' NOT NULL,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_mezmur_event_id ON mezmur_playlist(event_id);

-- =============================================================================
-- 11. ADMIN-CONTROLLED LANDING PAGE SECTIONS
-- =============================================================================

CREATE TABLE cms_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key VARCHAR(100) UNIQUE NOT NULL,  -- 'memories_powered_by_agafari_card' | 'packages' | 'experience_agafari_live'
    content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =============================================================================
-- AUTOMATIC updated_at TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER trg_invitations_updated_at BEFORE UPDATE ON invitations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
