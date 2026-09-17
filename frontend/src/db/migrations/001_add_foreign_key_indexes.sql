-- Migration 001: Add missing foreign key indexes for performance and deadlock prevention
-- Fixes Finding 2.1 (Unindexed Foreign Keys)

-- 1. Invitations FK indexes
ALTER TABLE invitations ADD INDEX idx_invitations_event_id (event_id);
ALTER TABLE invitations ADD INDEX idx_invitations_invite_code (invite_code);

-- 2. RSVPs FK indexes and Unique constraint (Fixes Finding 3.1-race)
ALTER TABLE rsvps ADD INDEX idx_rsvps_event_id (event_id);
ALTER TABLE rsvps ADD INDEX idx_rsvps_invitation_id (invitation_id);

-- 3. Media assets & comments FK indexes
ALTER TABLE media_assets ADD INDEX idx_media_assets_event_id (event_id);
ALTER TABLE media_comments ADD INDEX idx_media_comments_media_asset_id (media_asset_id);

-- 4. Wishes FK indexes
ALTER TABLE wishes ADD INDEX idx_wishes_event_id (event_id);

-- 5. Gate scan logs FK indexes
ALTER TABLE gate_scan_logs ADD INDEX idx_gate_scan_logs_invitation_id (invitation_id);
ALTER TABLE gate_scan_logs ADD INDEX idx_gate_scan_logs_staff_id (event_staff_id);

-- 6. Events & Organizers FK indexes
ALTER TABLE events ADD INDEX idx_events_organizer_id (organizer_id);
ALTER TABLE events ADD INDEX idx_events_couple_user_id (couple_user_id);
ALTER TABLE organizers ADD INDEX idx_organizers_owner_user_id (owner_user_id);
