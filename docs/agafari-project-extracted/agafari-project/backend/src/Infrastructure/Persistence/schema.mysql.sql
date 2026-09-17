-- Same schema, MySQL dialect. Run: mysql -u root -p agafari < schema.mysql.sql

CREATE TABLE IF NOT EXISTS events (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(191) NOT NULL UNIQUE,
  couple_names VARCHAR(255) NOT NULL,
  wedding_date DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS venues (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36) NOT NULL,
  type ENUM('home','church','hall','melse') NOT NULL,
  gps_coords VARCHAR(64),
  FOREIGN KEY (event_id) REFERENCES events(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS quotas (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36) NOT NULL,
  delegate_user_id CHAR(36),
  slots_total INT NOT NULL,
  slots_used INT NOT NULL DEFAULT 0,
  FOREIGN KEY (event_id) REFERENCES events(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS guests (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36) NOT NULL,
  quota_id CHAR(36),
  phone VARCHAR(32) NOT NULL,
  status ENUM('invited','confirmed','declined','checked_in') NOT NULL DEFAULT 'invited',
  headcount_allowed INT NOT NULL DEFAULT 1,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (quota_id) REFERENCES quotas(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tickets (
  id CHAR(36) PRIMARY KEY,
  guest_id CHAR(36) NOT NULL UNIQUE,
  qr_signature VARCHAR(191) NOT NULL,
  headcount_allowed INT NOT NULL DEFAULT 1,
  checked_in_at DATETIME NULL,
  checked_in_by_device VARCHAR(191) NULL,
  FOREIGN KEY (guest_id) REFERENCES guests(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS timeline_milestones (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36) NOT NULL,
  label VARCHAR(191) NOT NULL,
  planned_at DATETIME NOT NULL,
  current_at DATETIME NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS media_items (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36) NOT NULL,
  guest_id CHAR(36) NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  storage_url VARCHAR(512) NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (guest_id) REFERENCES guests(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS event_ratings (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36) NOT NULL,
  food TINYINT,
  ambiance TINYINT,
  coordination TINYINT,
  FOREIGN KEY (event_id) REFERENCES events(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  role VARCHAR(64) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS role_permissions (
  id CHAR(36) PRIMARY KEY,
  role VARCHAR(64) NOT NULL,
  permission_key VARCHAR(128) NOT NULL
) ENGINE=InnoDB;
