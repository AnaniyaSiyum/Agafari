-- =============================================================================
-- AGAFARI (አጋፋሪ) WEDDING PLATFORM — MYSQL / MARIADB SCHEMA
-- Converted from PostgreSQL schema.sql to MySQL 8.0+ / MariaDB syntax
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS media_comments;
DROP TABLE IF EXISTS media_assets;
DROP TABLE IF EXISTS wishes;
DROP TABLE IF EXISTS rsvps;
DROP TABLE IF EXISTS invitations;
DROP TABLE IF EXISTS event_staff;
DROP TABLE IF EXISTS event_locations;
DROP TABLE IF EXISTS live_streams;
DROP TABLE IF EXISTS mezmur_playlist;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS templates;
DROP TABLE IF EXISTS organizers;
DROP TABLE IF EXISTS cms_sections;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role ENUM('SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'BRIDE_GROOM', 'LIVE_STREAMER', 'GATE_SCANNER', 'GUEST') NOT NULL DEFAULT 'GUEST',
    created_by VARCHAR(36),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. ORGANIZERS
CREATE TABLE organizers (
    id VARCHAR(36) PRIMARY KEY,
    owner_user_id VARCHAR(36) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    created_by_admin_id VARCHAR(36),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_organizers_owner (owner_user_id),
    CONSTRAINT fk_organizers_owner FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TEMPLATES
CREATE TABLE templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    preview_url TEXT,
    config_json JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. EVENTS
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(120) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    managed_by ENUM('ORGANIZER', 'ADMIN') NOT NULL DEFAULT 'ADMIN',
    organizer_id VARCHAR(36),
    couple_user_id VARCHAR(36),
    template_id VARCHAR(36),
    template_customization_json JSON,
    bride_name VARCHAR(150) NOT NULL,
    groom_name VARCHAR(150) NOT NULL,
    event_date DATETIME NOT NULL,
    start_time VARCHAR(20) DEFAULT '14:00',
    second_event_date DATETIME,
    venue_name VARCHAR(255) NOT NULL,
    venue_address TEXT,
    venue_map_url TEXT,
    dress_code VARCHAR(255),
    welcome_message TEXT,
    cover_image_url TEXT,
    status ENUM('DRAFT', 'COMING_SOON', 'LIVE', 'COMPLETED', 'ARCHIVED') DEFAULT 'COMING_SOON' NOT NULL,
    admin_approval_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED' NOT NULL,
    youtube_video_id VARCHAR(50),
    is_live BOOLEAN DEFAULT FALSE NOT NULL,
    thank_you_message TEXT,
    thank_you_image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_events_slug (slug),
    INDEX idx_events_status (status),
    INDEX idx_events_date (event_date),
    INDEX idx_events_organizer (organizer_id),
    INDEX idx_events_couple (couple_user_id),
    CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES organizers(id) ON DELETE SET NULL,
    CONSTRAINT fk_events_couple FOREIGN KEY (couple_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_events_template FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. EVENT LOCATIONS
CREATE TABLE event_locations (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    label VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    map_url TEXT,
    order_index INT DEFAULT 0 NOT NULL,
    INDEX idx_event_locations_event (event_id),
    CONSTRAINT fk_event_locations_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. EVENT STAFF
CREATE TABLE event_staff (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    role ENUM('GATE_SCANNER', 'LIVE_STREAMER', 'CONTENT_MODERATOR', 'QUOTA_DELEGATE') NOT NULL,
    assigned_by VARCHAR(36),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE KEY uk_event_user_role (event_id, user_id, role),
    INDEX idx_event_staff_event (event_id),
    INDEX idx_event_staff_user (user_id),
    CONSTRAINT fk_event_staff_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_staff_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. INVITATIONS
CREATE TABLE invitations (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    invite_code VARCHAR(50) UNIQUE NOT NULL,
    invite_type ENUM('CARD', 'LINK') DEFAULT 'CARD' NOT NULL,
    guest_name VARCHAR(150) NOT NULL,
    guest_phone VARCHAR(50),
    max_guests INT DEFAULT 1 NOT NULL,
    table_number VARCHAR(100),
    rsvp_status ENUM('ATTENDING', 'MAYBE', 'DECLINED', 'PENDING') DEFAULT 'PENDING' NOT NULL,
    rsvp_updated_at DATETIME,
    rsvp_locked_at DATETIME,
    attending_headcount INT DEFAULT 0 NOT NULL,
    is_scanned BOOLEAN DEFAULT FALSE NOT NULL,
    scanned_count INT DEFAULT 0 NOT NULL,
    scanned_at DATETIME,
    scanned_by VARCHAR(36),
    qr_code_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_invitations_code (invite_code),
    INDEX idx_invitations_event (event_id),
    INDEX idx_invitations_is_scanned (is_scanned),
    CONSTRAINT fk_invitations_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. RSVPS
CREATE TABLE rsvps (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    invitation_id VARCHAR(36),
    invite_code VARCHAR(50),
    guest_name VARCHAR(150) NOT NULL,
    guest_phone VARCHAR(50),
    attendance_status ENUM('ATTENDING', 'MAYBE', 'DECLINED', 'PENDING') NOT NULL,
    attending_count INT DEFAULT 1 NOT NULL,
    song_recommendation TEXT,
    dietary_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_rsvps_event_id (event_id),
    INDEX idx_rsvps_status (attendance_status),
    CONSTRAINT fk_rsvps_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_rsvps_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. WISHES
CREATE TABLE wishes (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    sender_name VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    media_type ENUM('VIDEO', 'IMAGE'),
    video_url TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED' NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_wishes_event_id (event_id),
    INDEX idx_wishes_status (status),
    CONSTRAINT fk_wishes_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. MEDIA ASSETS
CREATE TABLE media_assets (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    uploader_name VARCHAR(150) NOT NULL,
    media_type ENUM('VIDEO', 'IMAGE') DEFAULT 'VIDEO' NOT NULL,
    category ENUM('WISHES', 'BTS', 'LIVE') DEFAULT 'WISHES' NOT NULL,
    cdn_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    views_count INT DEFAULT 0 NOT NULL,
    likes_count INT DEFAULT 0 NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING' NOT NULL,
    moderated_by VARCHAR(36),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_media_event_id (event_id),
    INDEX idx_media_category (category),
    INDEX idx_media_status (status),
    CONSTRAINT fk_media_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. POST LIKES
CREATE TABLE post_likes (
    id VARCHAR(36) PRIMARY KEY,
    media_id VARCHAR(36) NOT NULL,
    guest_identifier VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE KEY uk_media_guest (media_id, guest_identifier),
    CONSTRAINT fk_post_likes_media FOREIGN KEY (media_id) REFERENCES media_assets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. MEDIA COMMENTS
CREATE TABLE media_comments (
    id VARCHAR(36) PRIMARY KEY,
    media_id VARCHAR(36) NOT NULL,
    sender_name VARCHAR(150) NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_comments_media_id (media_id),
    CONSTRAINT fk_comments_media FOREIGN KEY (media_id) REFERENCES media_assets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. LIVE STREAMS
CREATE TABLE live_streams (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    started_by VARCHAR(36),
    youtube_video_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'SCHEDULED' NOT NULL,
    started_at DATETIME,
    ended_at DATETIME,
    INDEX idx_live_streams_event (event_id),
    CONSTRAINT fk_live_streams_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. MEZMUR PLAYLIST
CREATE TABLE mezmur_playlist (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'MEZMUR' NOT NULL,
    order_index INT DEFAULT 0 NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_mezmur_event_id (event_id),
    CONSTRAINT fk_mezmur_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. CMS SECTIONS
CREATE TABLE cms_sections (
    id VARCHAR(36) PRIMARY KEY,
    section_key VARCHAR(100) UNIQUE NOT NULL,
    content_json JSON NOT NULL,
    updated_by VARCHAR(36),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
