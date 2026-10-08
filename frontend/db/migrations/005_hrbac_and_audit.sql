-- =============================================================================
-- AGAFARI (አጋፋሪ) WEDDING PLATFORM — MIGRATION 005: HRBAC & AUDIT LOGGING
-- =============================================================================

-- 1. PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'GENERAL' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_permissions_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    rank INT NOT NULL DEFAULT 0,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_roles_code (code),
    INDEX idx_roles_rank (rank)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. ROLE PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS role_permissions (
    role_code VARCHAR(50) NOT NULL,
    permission_code VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (role_code, permission_code),
    INDEX idx_rp_role (role_code),
    INDEX idx_rp_perm (permission_code),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_code) REFERENCES roles(code) ON DELETE CASCADE,
    CONSTRAINT fk_rp_perm FOREIGN KEY (permission_code) REFERENCES permissions(code) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    actor_id VARCHAR(36),
    target_user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    details JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_audit_actor (actor_id),
    INDEX idx_audit_target (target_user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. SEED INITIAL PERMISSIONS
INSERT IGNORE INTO permissions (id, code, name, description, category) VALUES
('perm-001', 'system:manage', 'System Management', 'Full system configuration, global administration, and settings access', 'SYSTEM'),
('perm-002', 'tenants:manage', 'Tenant & Organizer Management', 'Create, update, suspend, and configure event organizer tenants', 'TENANT'),
('perm-003', 'credentials:manage', 'Global Credentials Management', 'Manage user accounts, passwords, and role assignments globally', 'SECURITY'),
('perm-004', 'credentials:manage_scoped', 'Scoped Credentials Management', 'Manage staff user accounts and credentials within assigned tenant/event scope', 'SECURITY'),
('perm-005', 'events:manage', 'Event Lifecycle Management', 'Create, configure, publish, and delete events', 'EVENTS'),
('perm-006', 'events:read', 'View Event Details', 'View event schedule, details, guest list, and invitation status', 'EVENTS'),
('perm-007', 'events:write', 'Edit Event Details', 'Modify event details, welcome messages, cover image, and seating charts', 'EVENTS'),
('perm-008', 'staff:manage', 'Event Staff Management', 'Assign scanners, streamers, and moderators to specific events', 'STAFF'),
('perm-009', 'reports:view', 'Analytics & Reports', 'View attendance metrics, live stream stats, guest analytics, and RSVP reports', 'ANALYTICS'),
('perm-010', 'gate:scan', 'Gate Ticket Scanning', 'Scan QR tickets at event entrance and record guest check-ins', 'OPERATIONS'),
('perm-011', 'stream:manage', 'Live Streaming Control', 'Start, pause, and configure live broadcast stream studio', 'OPERATIONS'),
('perm-012', 'media:moderate', 'Media & Wish Moderation', 'Review, approve, or reject uploaded guest wishes, photos, and videos', 'OPERATIONS'),
('perm-013', 'audit:read', 'Audit Trail Inspection', 'View security audit logs and privilege alteration history', 'AUDIT');

-- 6. SEED INITIAL ROLES WITH HIERARCHICAL RANKS
INSERT IGNORE INTO roles (id, code, name, rank, description) VALUES
('role-001', 'SYSTEM_ADMIN', 'System Super Administrator', 100, 'Unrestricted global platform access and credential administration authority'),
('role-002', 'EVENT_ORGANIZER', 'Event Organizer Agency', 50, 'Tenant event lifecycle management, staff delegation, and scoped operations'),
('role-003', 'BRIDE_GROOM', 'Couple / Host', 20, 'Event customization, gallery moderation, invitation management, and RSVP viewing'),
('role-004', 'LIVE_STREAMER', 'Live Streamer Crew', 10, 'Live broadcast studio access and video stream management for assigned event'),
('role-005', 'GATE_SCANNER', 'Gate Security Scanner', 10, 'QR invitation ticket scanning and check-in validation at event entrance'),
('role-006', 'MODERATOR', 'Media Content Moderator', 10, 'Reviewing and moderating guest wishes, comments, and media uploads'),
('role-007', 'GUEST', 'Event Guest', 0, 'Public event viewing, sending wishes, uploading photos, and submitting RSVPs');

-- 7. SEED ROLE PERMISSION MAPPINGS
-- SYSTEM_ADMIN permissions
INSERT IGNORE INTO role_permissions (role_code, permission_code) VALUES
('SYSTEM_ADMIN', 'system:manage'),
('SYSTEM_ADMIN', 'tenants:manage'),
('SYSTEM_ADMIN', 'credentials:manage'),
('SYSTEM_ADMIN', 'credentials:manage_scoped'),
('SYSTEM_ADMIN', 'events:manage'),
('SYSTEM_ADMIN', 'events:read'),
('SYSTEM_ADMIN', 'events:write'),
('SYSTEM_ADMIN', 'staff:manage'),
('SYSTEM_ADMIN', 'reports:view'),
('SYSTEM_ADMIN', 'gate:scan'),
('SYSTEM_ADMIN', 'stream:manage'),
('SYSTEM_ADMIN', 'media:moderate'),
('SYSTEM_ADMIN', 'audit:read');

-- EVENT_ORGANIZER permissions
INSERT IGNORE INTO role_permissions (role_code, permission_code) VALUES
('EVENT_ORGANIZER', 'tenants:manage'),
('EVENT_ORGANIZER', 'events:manage'),
('EVENT_ORGANIZER', 'events:read'),
('EVENT_ORGANIZER', 'events:write'),
('EVENT_ORGANIZER', 'staff:manage'),
('EVENT_ORGANIZER', 'reports:view'),
('EVENT_ORGANIZER', 'credentials:manage_scoped'),
('EVENT_ORGANIZER', 'gate:scan'),
('EVENT_ORGANIZER', 'stream:manage'),
('EVENT_ORGANIZER', 'media:moderate');

-- BRIDE_GROOM permissions
INSERT IGNORE INTO role_permissions (role_code, permission_code) VALUES
('BRIDE_GROOM', 'events:read'),
('BRIDE_GROOM', 'events:write'),
('BRIDE_GROOM', 'media:moderate'),
('BRIDE_GROOM', 'reports:view');

-- LIVE_STREAMER permissions
INSERT IGNORE INTO role_permissions (role_code, permission_code) VALUES
('LIVE_STREAMER', 'stream:manage'),
('LIVE_STREAMER', 'events:read');

-- GATE_SCANNER permissions
INSERT IGNORE INTO role_permissions (role_code, permission_code) VALUES
('GATE_SCANNER', 'gate:scan'),
('GATE_SCANNER', 'events:read');

-- MODERATOR permissions
INSERT IGNORE INTO role_permissions (role_code, permission_code) VALUES
('MODERATOR', 'media:moderate'),
('MODERATOR', 'events:read');
