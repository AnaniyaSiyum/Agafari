-- =============================================================================
-- Migration 004: Quota groups table and invitations quota linkage
-- =============================================================================

CREATE TABLE IF NOT EXISTS quota_groups (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    delegate_user_id VARCHAR(36),
    delegate_name VARCHAR(150) NOT NULL,
    delegate_phone VARCHAR(50),
    allocated_quota INT NOT NULL,
    used_quota INT DEFAULT 0 NOT NULL,
    created_by VARCHAR(36),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_quota_groups_event (event_id),
    INDEX idx_quota_groups_delegate_user (delegate_user_id),
    CONSTRAINT fk_quota_groups_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_quota_groups_delegate FOREIGN KEY (delegate_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
