-- =============================================================================
-- Phase 3b addition — run this after db/schema.sql from Phase 3a.
-- Adds the gate check-in audit log (every scan attempt, not just the latest
-- status on the invitation row) — needed so double-scan attempts, offline
-- reconciliation, and "which staff member scanned this" are all reconstructable.
-- =============================================================================

CREATE TABLE gate_scan_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    event_staff_id UUID REFERENCES event_staff(id),
    result VARCHAR(20) CHECK (result IN ('VALID','ALREADY_SCANNED','INVALID','HEADCOUNT_EXCEEDED')) NOT NULL,
    headcount_admitted INT DEFAULT 0 NOT NULL,
    client_scanned_at TIMESTAMPTZ,   -- timestamp from the scanner device (may be offline-queued)
    server_recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_gate_scan_logs_invitation ON gate_scan_logs(invitation_id);
CREATE INDEX idx_gate_scan_logs_staff ON gate_scan_logs(event_staff_id);
