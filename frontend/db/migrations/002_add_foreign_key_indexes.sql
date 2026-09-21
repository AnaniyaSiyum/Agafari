-- Migration 002: Add missing foreign key indexes for performance and deadlock prevention
-- Fixes Finding 2.1 (Unindexed Foreign Keys)

-- 1. Invitations FK indexes
ALTER TABLE invitations ADD INDEX idx_invitations_event_id (event_id);
ALTER TABLE invitations ADD INDEX idx_invitations_invite_code (invite_code);

-- 2. RSVPs FK indexes
ALTER TABLE rsvps ADD INDEX idx_rsvps_event_id (event_id);
ALTER TABLE rsvps ADD INDEX idx_rsvps_invitation_id (invitation_id);

-- 3. Media assets & comments FK indexes
ALTER TABLE media_assets ADD INDEX idx_media_assets_event_id (event_id);
ALTER TABLE media_comments ADD INDEX idx_media_comments_media_id (media_id);

-- 4. Wishes FK indexes
ALTER TABLE wishes ADD INDEX idx_wishes_event_id (event_id);

-- 5. Events & Organizers FK indexes
ALTER TABLE events ADD INDEX idx_events_organizer_id (organizer_id);
ALTER TABLE events ADD INDEX idx_events_couple_user_id (couple_user_id);
ALTER TABLE organizers ADD INDEX idx_organizers_owner_user_id (owner_user_id);
