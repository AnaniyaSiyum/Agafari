-- =============================================================================
-- AGAFARI (አጋፋሪ) WEDDING PLATFORM — MYSQL / MARIADB BASE SCHEMA
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
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS organizers (
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
CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    preview_url TEXT,
    config_json JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. EVENTS
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    managed_by ENUM('DIRECT', 'ORGANIZER') NOT NULL DEFAULT 'DIRECT',
    organizer_id VARCHAR(36),
    couple_user_id VARCHAR(36),
    template_id VARCHAR(36),
    template_customization_json JSON,
    template_locked_at DATETIME,
    template_locked_by VARCHAR(36),
    bride_name VARCHAR(150) NOT NULL,
    groom_name VARCHAR(150) NOT NULL,
    event_date DATETIME NOT NULL,
    start_time VARCHAR(20),
    second_event_date DATETIME,
    venue_name VARCHAR(255) NOT NULL,
    venue_address TEXT,
    venue_map_url TEXT,
    dress_code VARCHAR(255),
    welcome_message TEXT,
    cover_image_url TEXT,
    status ENUM('DRAFT', 'COMING_SOON', 'LIVE', 'COMPLETED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    admin_approval_status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'APPROVED',
    is_live BOOLEAN DEFAULT FALSE NOT NULL,
    youtube_stream_url TEXT,
    youtube_video_id VARCHAR(50),
    background_music_url TEXT,
    background_music_title VARCHAR(255),
    thank_you_message TEXT,
    thank_you_image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_events_slug (slug),
    INDEX idx_events_status (status),
    INDEX idx_events_approval (admin_approval_status),
    INDEX idx_events_organizer (organizer_id),
    INDEX idx_events_couple (couple_user_id),
    CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES organizers(id) ON DELETE SET NULL,
    CONSTRAINT fk_events_couple FOREIGN KEY (couple_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_events_template FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. EVENT_STAFF
CREATE TABLE IF NOT EXISTS event_staff (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    role ENUM('LIVE_STREAMER', 'GATE_SCANNER') NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_event_staff_event (event_id),
    INDEX idx_event_staff_user (user_id),
    UNIQUE KEY uq_event_user_role (event_id, user_id, role),
    CONSTRAINT fk_event_staff_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_staff_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. INVITATIONS
CREATE TABLE IF NOT EXISTS invitations (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    invite_code VARCHAR(100) NOT NULL,
    invite_type ENUM('CARD', 'LINK') DEFAULT 'LINK' NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(50),
    max_guests INT DEFAULT 1 NOT NULL,
    table_number VARCHAR(50),
    rsvp_status ENUM('ATTENDING', 'DECLINED', 'PENDING') DEFAULT 'PENDING' NOT NULL,
    rsvp_updated_at DATETIME,
    rsvp_locked_at DATETIME,
    attending_headcount INT DEFAULT 0 NOT NULL,
    is_scanned BOOLEAN DEFAULT FALSE NOT NULL,
    scanned_count INT DEFAULT 0 NOT NULL,
    scanned_at DATETIME,
    qr_code_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_invitations_event (event_id),
    INDEX idx_invitations_code (invite_code),
    INDEX idx_invitations_rsvp (rsvp_status),
    CONSTRAINT fk_invitations_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. RSVPS
CREATE TABLE IF NOT EXISTS rsvps (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    invitation_id VARCHAR(36),
    attendance_status ENUM('ATTENDING', 'DECLINED', 'PENDING') NOT NULL,
    attending_count INT DEFAULT 0 NOT NULL,
    dietary_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_rsvps_event (event_id),
    INDEX idx_rsvps_invitation (invitation_id),
    CONSTRAINT fk_rsvps_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_rsvps_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. WISHES
CREATE TABLE IF NOT EXISTS wishes (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    media_type ENUM('TEXT', 'VIDEO') DEFAULT 'TEXT' NOT NULL,
    video_url TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_wishes_event (event_id),
    INDEX idx_wishes_status (status),
    CONSTRAINT fk_wishes_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. MEDIA_ASSETS
CREATE TABLE IF NOT EXISTS media_assets (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    uploader_name VARCHAR(255) NOT NULL,
    media_type ENUM('VIDEO', 'IMAGE') NOT NULL,
    category ENUM('WISHES', 'BTS', 'LIVE') DEFAULT 'BTS' NOT NULL,
    cdn_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    views_count INT DEFAULT 0 NOT NULL,
    likes_count INT DEFAULT 0 NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_media_event (event_id),
    INDEX idx_media_category (category),
    INDEX idx_media_status (status),
    CONSTRAINT fk_media_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. MEDIA_COMMENTS
CREATE TABLE IF NOT EXISTS media_comments (
    id VARCHAR(36) PRIMARY KEY,
    media_id VARCHAR(36) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    comment_text TEXT NOT NULL,
    status ENUM('APPROVED', 'REJECTED', 'PENDING') DEFAULT 'APPROVED' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_comments_media (media_id),
    CONSTRAINT fk_comments_media FOREIGN KEY (media_id) REFERENCES media_assets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. POST_LIKES
CREATE TABLE IF NOT EXISTS post_likes (
    id VARCHAR(36) PRIMARY KEY,
    media_id VARCHAR(36) NOT NULL,
    client_ip VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE KEY uq_media_ip (media_id, client_ip),
    CONSTRAINT fk_post_likes_media FOREIGN KEY (media_id) REFERENCES media_assets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. MEZMUR_PLAYLIST
CREATE TABLE IF NOT EXISTS mezmur_playlist (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255),
    category ENUM('MEZMUR', 'TRADITIONAL', 'DANCE', 'SLOW') DEFAULT 'MEZMUR' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_mezmur_event (event_id),
    CONSTRAINT fk_mezmur_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. CMS_SECTIONS
CREATE TABLE IF NOT EXISTS cms_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(100) UNIQUE NOT NULL,
    content_json JSON NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
