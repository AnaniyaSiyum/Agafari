-- =============================================================================
-- Phase 3e addition — run after Phase 3a's db/schema.sql and 3b's
-- migration_gate_scan_logs.sql.
--
-- Adds quota delegation: your original chat spec and the Phase 1 doc both
-- described a QUOTA_DELEGATE role, and staff_role_enum has included it since
-- Phase 3a — but no table ever backed it, and nothing enforced a delegate's
-- cap. This is that missing piece: a delegate (e.g. "the groom's uncle gets
-- 20 seats to fill himself") gets an allocation, then can add guest
-- invitations against it up to the cap, tracked and enforced server-side.
-- =============================================================================

CREATE TABLE quota_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    delegate_user_id UUID REFERENCES users(id),  -- nullable: an admin/organizer can pre-create
                                                   -- an allocation before the delegate has a login
    delegate_name VARCHAR(150) NOT NULL,
    delegate_phone VARCHAR(50),
    allocated_quota INT NOT NULL CHECK (allocated_quota > 0),
    used_quota INT DEFAULT 0 NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CHECK (used_quota <= allocated_quota)
);

CREATE INDEX idx_quota_groups_event ON quota_groups(event_id);
CREATE INDEX idx_quota_groups_delegate_user ON quota_groups(delegate_user_id);

-- Ties an invitation back to the delegate whose allocation it was created
-- under. NULL means a "direct" invitation not counted against anyone's cap
-- (the normal case when an organizer/couple/admin creates it themselves).
ALTER TABLE invitations ADD COLUMN quota_group_id UUID REFERENCES quota_groups(id);
CREATE INDEX idx_invitations_quota_group ON invitations(quota_group_id);
