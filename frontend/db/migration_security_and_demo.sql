-- =============================================================================
-- AGAFARI (አጋፋሪ) — MIGRATION: SECURITY TABLES + DEMO DATA + ROLE FIX
-- Run once against the `agafari` MySQL database.
-- Safe to re-run: uses IF NOT EXISTS / INSERT IGNORE / ON DUPLICATE KEY UPDATE.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Fix kebron@gmail.com role (empty string → 'COUPLE')
-- ---------------------------------------------------------------------------
UPDATE users
   SET role = 'COUPLE'
 WHERE email = 'kebron@gmail.com'
   AND (role = '' OR role IS NULL);

-- ---------------------------------------------------------------------------
-- 2. Security tables required by the PHP backend middleware
-- ---------------------------------------------------------------------------

-- Session persistence (replaces stateless token-in-response pattern)
CREATE TABLE IF NOT EXISTS php_sessions (
    id          INT UNSIGNED     AUTO_INCREMENT PRIMARY KEY,
    token       VARCHAR(100)     NOT NULL UNIQUE,
    user_id     VARCHAR(100)     NOT NULL,
    role        VARCHAR(50)      NOT NULL,
    ip_address  VARCHAR(45)      DEFAULT NULL,
    created_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at  DATETIME         NOT NULL,
    INDEX idx_php_sessions_token   (token),
    INDEX idx_php_sessions_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Login rate-limit tracking (per IP, sliding 15-min window)
CREATE TABLE IF NOT EXISTS php_rate_limits (
    ip_address    VARCHAR(45)  NOT NULL,
    attempt_count INT UNSIGNED NOT NULL DEFAULT 1,
    window_start  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ensure wishes table has is_featured column
ALTER TABLE wishes ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE NOT NULL;

-- ---------------------------------------------------------------------------
-- 3. Sara Kebede — demo couple user
--    Password is stored as a PBKDF2 hash compatible with auth.php + auth.ts.
--    Plain-text password: agafari7741  (same as the existing couple)
-- ---------------------------------------------------------------------------
INSERT INTO users (
    id, email, phone, full_name, role,
    password_hash, is_active, created_at
)
VALUES (
    'usr-couple-sara-dawit-2026',
    'sara@agafari.com',
    NULL,
    'Sara Kebede',
    'COUPLE',
    -- PBKDF2-SHA512 hash of 'agafari7741' (matches Node.js pbkdf2Sync format)
    'aed45470c364698363f897226c1574c0:355c98d94da839d30f9e37e45ce2ff46712d8a792d76c0501b44028114cda21f9cdb2e7a2e7fbe3b68fcebd1c737f267df401ce5c5bb61da134d8d0028d0450b',
    1,
    NOW()
)
ON DUPLICATE KEY UPDATE email = email;

-- ---------------------------------------------------------------------------
-- 4. Sara & Dawit demo event
-- ---------------------------------------------------------------------------
INSERT INTO events (
    id, slug, title,
    managed_by, organizer_id, couple_user_id,
    template_id, template_customization_json,
    bride_name, groom_name,
    event_date, start_time, second_event_date,
    venue_name, venue_address, venue_map_url,
    dress_code, welcome_message,
    cover_image_url,
    status, admin_approval_status, is_live,
    youtube_video_id,
    background_music_url, background_music_title,
    expected_guests,
    created_at
)
VALUES (
    'evt-sara-and-dawit-2026',
    'sara-and-dawit-2026',
    'Sara & Dawit — Royal Wedding 2026',
    'ORGANIZER',
    '7b95e0c4-f2a8-44d1-872e-3c990264b189',   -- kebkab events organizer
    'usr-couple-sara-dawit-2026',
    '00000000-0000-0000-0000-000000000101',    -- Classic Ivory template
    '{
      "couplePhotoUrl": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800",
      "loveStory": {
        "headline": "A Divine Encounter",
        "firstMetDate": "2023-09-01",
        "firstMetStory": "Sara and Dawit first met at a mutual friend''s dinner in Addis Ababa on a cool September evening. What started as a friendly conversation turned into an inseparable bond that neither of them could explain.",
        "proposalDate": "2025-12-25",
        "proposalStory": "On Christmas morning at Entoto Park, with the entire city of Addis Ababa stretching below them in golden light, Dawit got down on one knee and asked Sara to be his forever. She said YES before he finished the sentence."
      },
      "programs": [
        {
          "id": "p1",
          "time": "9:00 AM",
          "title": "Holy Matrimony at St. George Cathedral",
          "location": "St. George Cathedral, Addis Ababa",
          "description": "A sacred ceremony blessing the union of Sara and Dawit in the presence of family, friends, and God."
        },
        {
          "id": "p2",
          "time": "1:00 PM",
          "title": "Grand Reception & Cultural Celebration",
          "location": "Sheraton Addis — Grand Ballroom",
          "description": "Join us for a lavish reception featuring traditional Ethiopian cuisine, live music by Rophnan, and vibrant cultural dance performances."
        },
        {
          "id": "p3",
          "time": "7:00 PM",
          "title": "Evening Celebration & First Dance",
          "location": "Sheraton Addis — Rooftop Terrace",
          "description": "Cap the evening with breathtaking views of Addis Ababa as the couple shares their first dance under the stars."
        }
      ]
    }',
    'Sara Kebede',
    'Dawit Haile',
    '2026-12-20',
    '09:00',
    '2026-12-20',
    'Sheraton Addis — Grand Ballroom',
    'Taitu Street, Addis Ababa, Ethiopia',
    'https://maps.google.com/?q=Sheraton+Addis+Ababa',
    'Formal Black Tie & Habesha Kemis',
    'With overflowing hearts, we invite you to celebrate the union of Sara & Dawit as they begin their journey of love and faith together. Your presence is our greatest gift.',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    'COMING_SOON',
    'APPROVED',
    0,
    '',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'Yilugnta — Rophnan',
    300,
    NOW()
)
ON DUPLICATE KEY UPDATE slug = slug;

-- ---------------------------------------------------------------------------
-- 5. Sample invitations for Sara & Dawit demo event
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO invitations (
    id, event_id, invite_code, invite_type,
    guest_name, guest_phone,
    max_guests, table_number,
    rsvp_status, qr_code_url, created_at
) VALUES
(
    'inv-sd-001',
    'evt-sara-and-dawit-2026',
    'INV-SD2026-001', 'CARD',
    'Mekdes Alemu', '+251911100001',
    2, 'Table 1 — VIP',
    'ATTENDING',
    'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=INV-SD2026-001',
    NOW()
),
(
    'inv-sd-002',
    'evt-sara-and-dawit-2026',
    'INV-SD2026-002', 'CARD',
    'Yohannes Tadesse', '+251911200002',
    4, 'Table 2 — Family',
    'ATTENDING',
    'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=INV-SD2026-002',
    NOW()
),
(
    'inv-sd-003',
    'evt-sara-and-dawit-2026',
    'INV-SD2026-003', 'CARD',
    'Hiwot Girma', '+251911300003',
    2, 'Table 3',
    'PENDING',
    'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=INV-SD2026-003',
    NOW()
),
(
    'inv-sd-004',
    'evt-sara-and-dawit-2026',
    'INV-SD2026-004', 'CARD',
    'Bereket Mulugeta', '+251911400004',
    3, 'Table 1 — VIP',
    'ATTENDING',
    'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=INV-SD2026-004',
    NOW()
),
(
    'inv-sd-005',
    'evt-sara-and-dawit-2026',
    'INV-SD2026-005', 'CARD',
    'Tigist Bekele', '+251911500005',
    2, 'Table 4',
    'ATTENDING',
    'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=INV-SD2026-005',
    NOW()
);

-- ---------------------------------------------------------------------------
-- 6. Sample guest wishes / blessings for Sara & Dawit demo event
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO wishes (
    id, event_id, sender_name, message, media_type, video_url, status, created_at
) VALUES
(
    'wish-sd-001',
    'evt-sara-and-dawit-2026',
    'Mekdes Alemu',
    'May your love story be the most beautiful chapter ever written. Congratulations Sara & Dawit! ❤️',
    'TEXT', NULL, 'APPROVED', NOW()
),
(
    'wish-sd-002',
    'evt-sara-and-dawit-2026',
    'Yohannes Tadesse',
    'Wishing you a lifetime of happiness, laughter, and endless adventures together. God bless your sacred union!',
    'TEXT', NULL, 'APPROVED', NOW()
),
(
    'wish-sd-003',
    'evt-sara-and-dawit-2026',
    'Hiwot Girma',
    'Two souls, one heart. May every day of your marriage be as magical as today. ቡና ፍቅር! 💕',
    'TEXT', NULL, 'APPROVED', NOW()
),
(
    'wish-sd-004',
    'evt-sara-and-dawit-2026',
    'Bereket Mulugeta',
    'Sara and Dawit — you were made for each other. May your home overflow with joy, love, and endless blessings!',
    'TEXT', NULL, 'APPROVED', NOW()
),
(
    'wish-sd-005',
    'evt-sara-and-dawit-2026',
    'Tigist Bekele',
    'From this day forward, may you face every storm together and celebrate every sunshine as one. Congratulations! 🎊',
    'TEXT', NULL, 'APPROVED', NOW()
),
(
    'wish-sd-006',
    'evt-sara-and-dawit-2026',
    'Daniel Worku',
    'እናንተ ሁለታችሁ ትክክል ናችሁ። ፍቅራችሁ ዘለዓለም ይቆይ! Sara & Dawit — may God''s blessing fill every room of your new home.',
    'TEXT', NULL, 'APPROVED', NOW()
),
(
    'wish-sd-007',
    'evt-sara-and-dawit-2026',
    'Selamawit Ayele',
    'A beautiful couple deserves a beautiful life. Wishing you both all the love in the world. Congratulations! 🌸',
    'TEXT', NULL, 'APPROVED', NOW()
);

-- ---------------------------------------------------------------------------
-- End of migration
-- ---------------------------------------------------------------------------
