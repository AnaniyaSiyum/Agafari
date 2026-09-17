-- =============================================================================
-- Phase 3e addition — run alongside migration_quota_groups.sql.
--
-- Backs the organizer template-review step from your spec: "the organizer can
-- change main things or essential things that must be different from couples
-- to couples." Once an organizer/admin has finalized their edits, they can
-- lock the template so the couple can't overwrite those changes by mistake.
-- =============================================================================

ALTER TABLE events ADD COLUMN template_locked_at TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN template_locked_by UUID REFERENCES users(id);
