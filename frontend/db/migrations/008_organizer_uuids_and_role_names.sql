-- Migration 008: Independent Organizer UUIDs & Canonical Role Names (ORGANIZER_OWNER, COUPLE)
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Standardize Role Names in users table
ALTER TABLE users MODIFY COLUMN role ENUM('SYSTEM_ADMIN','ORGANIZER_OWNER','COUPLE','LIVE_STREAMER','GATE_SCANNER','MEDIA_MODERATOR','GUEST') NOT NULL DEFAULT 'GUEST';
UPDATE users SET role = 'ORGANIZER_OWNER' WHERE email LIKE '%organizer%' OR email LIKE '%kebkab%';
UPDATE users SET role = 'COUPLE' WHERE email LIKE '%couple%' OR email LIKE '%herkal%' OR email LIKE '%abebech%';

-- 2. Update Kebkab Events organizer to an independent UUID
-- Old: org-usr-8e6634ea-b3b7-4ec5-9517-3944
-- New: 7b95e0c4-f2a8-44d1-872e-3c990264b189
UPDATE organizers 
SET id = '7b95e0c4-f2a8-44d1-872e-3c990264b189' 
WHERE id = 'org-usr-8e6634ea-b3b7-4ec5-9517-3944' OR owner_user_id = 'usr-8e6634ea-b3b7-4ec5-9517-39443f02';

UPDATE events 
SET organizer_id = '7b95e0c4-f2a8-44d1-872e-3c990264b189' 
WHERE organizer_id = 'org-usr-8e6634ea-b3b7-4ec5-9517-3944' OR organizer_id = 'org-usr-8e6634ea-b3b7-4ec5-9517-39443f025dd8';

UPDATE memberships 
SET scope_id = '7b95e0c4-f2a8-44d1-872e-3c990264b189', role = 'ORGANIZER_OWNER' 
WHERE user_id = 'usr-8e6634ea-b3b7-4ec5-9517-39443f02' AND scope_type = 'ORGANIZER';

-- 3. Update Admin organizer record to an independent UUID
-- Old: org-usr-admin-1
-- New: 9e31d47a-2415-4c07-ba71-6c45980a3120
UPDATE organizers 
SET id = '9e31d47a-2415-4c07-ba71-6c45980a3120' 
WHERE id = 'org-usr-admin-1' OR owner_user_id = 'usr-admin-1';

UPDATE events 
SET organizer_id = '9e31d47a-2415-4c07-ba71-6c45980a3120' 
WHERE organizer_id = 'org-usr-admin-1';

-- 4. Clean up any other memberships with legacy role names
UPDATE memberships SET role = 'ORGANIZER_OWNER' WHERE role = 'EVENT_ORGANIZER';
UPDATE memberships SET role = 'COUPLE' WHERE role = 'BRIDE_GROOM';

SET FOREIGN_KEY_CHECKS = 1;
