-- =============================================================================
-- AGAFARI (አጋፋሪ) WEDDING PLATFORM — MIGRATION 007: ADMIN-CONTROLLED AUTHENTICATION
-- =============================================================================

-- 1. UPDATE USERS TABLE WITH AUDITABLE METADATA AND 2FA ATTRIBUTES
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone VARCHAR(50) NULL AFTER email,
  ADD COLUMN IF NOT EXISTS password_set_by VARCHAR(36) NULL AFTER password_hash,
  ADD COLUMN IF NOT EXISTS password_set_at DATETIME NULL AFTER password_set_by,
  ADD COLUMN IF NOT EXISTS status ENUM('PENDING', 'ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE' AFTER password_set_at,
  ADD COLUMN IF NOT EXISTS totp_secret VARCHAR(255) NULL AFTER status,
  ADD COLUMN IF NOT EXISTS totp_enabled BOOLEAN NOT NULL DEFAULT FALSE AFTER totp_secret,
  ADD COLUMN IF NOT EXISTS session_version INT NOT NULL DEFAULT 1 AFTER totp_enabled;

-- 2. CREATE MEMBERSHIPS TABLE
CREATE TABLE IF NOT EXISTS memberships (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    role ENUM('SYSTEM_ADMIN', 'ORGANIZER_OWNER', 'COUPLE', 'GATE_SCANNER', 'MEDIA_MODERATOR') NOT NULL,
    scope_type ENUM('PLATFORM', 'ORGANIZER', 'EVENT') NOT NULL,
    scope_id VARCHAR(100) NOT NULL,
    status ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE',
    expires_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_membership_user (user_id),
    INDEX idx_membership_scope (scope_type, scope_id),
    INDEX idx_membership_role (role),
    INDEX idx_membership_status (status),
    CONSTRAINT fk_membership_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CREATE ACCOUNT REQUESTS TABLE (Organizers request accounts, admin activates)
CREATE TABLE IF NOT EXISTS account_requests (
    id VARCHAR(64) PRIMARY KEY,
    requested_by VARCHAR(36) NOT NULL,
    role ENUM('COUPLE', 'GATE_SCANNER', 'MEDIA_MODERATOR') NOT NULL,
    scope_id VARCHAR(100) NOT NULL,
    details_json JSON NOT NULL,
    status ENUM('OPEN', 'DONE', 'REJECTED') NOT NULL DEFAULT 'OPEN',
    handled_by VARCHAR(36) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_req_status (status),
    INDEX idx_req_scope (scope_id),
    INDEX idx_req_requested_by (requested_by),
    CONSTRAINT fk_req_requested_by FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. CREATE IMMUTABLE INSERT-ONLY AUDIT LOG
CREATE TABLE IF NOT EXISTS audit_log (
    id VARCHAR(64) PRIMARY KEY,
    actor_id VARCHAR(36) NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NULL,
    target_id VARCHAR(100) NULL,
    ip VARCHAR(45) NULL,
    meta_json JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_al_actor (actor_id),
    INDEX idx_al_action (action),
    INDEX idx_al_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
