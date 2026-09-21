# Agafari Developer Onboarding & Local Setup Guide

**Document Version**: 2.0  
**Target Platform**: Next.js Monolith + MySQL  

---

## 1. System Prerequisites

Ensure the following tools are installed on your local development machine:

- **Node.js**: `v20.x` or higher (LTS recommended)
- **npm**: `v10.x` or higher
- **MySQL Server**: `8.0+` or MariaDB `10.5+` running locally on port 3306

---

## 2. Step-by-Step Local Setup

### Step 2.1: Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/AnaniyaSiyum/Agafari.git
cd Agafari/frontend

# Install node dependencies
npm install
```

### Step 2.2: Environment Configuration
Copy `.env.example` to `.env` in the `frontend/` directory:

```bash
cp .env.example .env
```

Ensure your `.env` contains local MySQL connection settings:

```ini
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3306"
MYSQL_DATABASE="agafari"
MYSQL_USER="root"
MYSQL_PASSWORD=""

PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
TICKET_SIGNING_SECRET="dev_ticket_signing_secret_key_32bytes"
JWT_SECRET="dev_jwt_session_signing_secret_key_32bytes"
```

### Step 2.3: Database Initialization & Migrations
Create the `agafari` database and run schema + migration scripts in exact sequential order:

```bash
# 1. Create database schema
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS agafari CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Run schema and migrations in exact order:
mysql -u root -p agafari < db/migrations/001_schema.sql
mysql -u root -p agafari < db/migrations/002_add_foreign_key_indexes.sql
mysql -u root -p agafari < db/migrations/003_gate_scan_logs.sql
mysql -u root -p agafari < db/migrations/004_quota_groups.sql
mysql -u root -p agafari < db/migrations/005_template_lock.sql
mysql -u root -p agafari < db/migrations/006_seed_templates_and_cms.sql
```

### Step 2.4: Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Running Test Suites

Verify your local installation by executing the test suites:

```bash
# 1. Run pure domain unit tests (43 tests)
npm run test:unit

# 2. Run application service integration tests (9 tests)
npm run test:integration

# 3. Run TypeScript type check
npx tsc --noEmit
```

---

## 4. Local Test Credentials

| Role | Email | Password | Dashboard URL |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@agafari.com` | `admin123` | `/admin/dashboard` |
| **Event Organizer** | `organizer@agafari.com` | `admin123` | `/organizer/dashboard?id=usr-1789161649167-284` |
| **Bride / Groom** | `couple@agafari.com` | `admin123` | `/couple/dashboard` |
| **Gate Scanner** | `gate@agafari.com` | `admin123` | `/event/aynalem-and-birhanu-mtxgppv9/scanner` |
