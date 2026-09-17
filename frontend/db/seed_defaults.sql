
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000010', 'admin@hamelmal.com', '7817fff8e964a591ffb0e6b008b25f8f:b09b844f99a94cfbfa8232ef0daf26761f6fb3bed570ff33083f3eb633864df3552ae242d27409ab80d03a0a5dac43c9bb225edc1d64a5217a19d56123d886e2', 'System Admin (Hamelmal)', 'SYSTEM_ADMIN'),
  ('00000000-0000-0000-0000-000000000011', 'organizer@hamelmal.com', '4c4f1f4a91fa4d054b50f03aaedf8da5:fc67f03a568218bd98336b55e7dd269db146e5d1d3759bb45f18e043481abd89d4ada9278216caa7379c2d82b8d6d8270eea6dbeb2da02602c13c1629f3dcc46', 'Organizer (Hamelmal)', 'EVENT_ORGANIZER')
ON CONFLICT (email) DO NOTHING;
