-- =============================================================================
-- Migration 003: Gate scan audit logs table
-- Adds the gate check-in audit log for door scan records and anti-counterfeit logs
-- =============================================================================

CREATE TABLE IF NOT EXISTS gate_scan_logs (
    id VARCHAR(36) PRIMARY KEY,
    invitation_id VARCHAR(36) NOT NULL,
    event_staff_id VARCHAR(36),
    result ENUM('VALID', 'ALREADY_SCANNED', 'INVALID', 'HEADCOUNT_EXCEEDED') NOT NULL,
    headcount_admitted INT DEFAULT 0 NOT NULL,
    client_scanned_at DATETIME,
    server_recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_gate_scan_logs_invitation (invitation_id),
    INDEX idx_gate_scan_logs_staff (event_staff_id),
    CONSTRAINT fk_gate_scan_logs_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE,
    CONSTRAINT fk_gate_scan_logs_staff FOREIGN KEY (event_staff_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
