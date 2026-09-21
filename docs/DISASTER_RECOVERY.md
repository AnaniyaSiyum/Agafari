# Agafari Disaster Recovery & Database Backup/Restore Manual

This document outlines the backup capabilities, automated snapshot policies, and step-by-step disaster recovery procedures for the Agafari Next.js + MySQL production database.

---

## 1. Managed MySQL Provider Capabilities & Defaults

Agafari is deployed as a Next.js monolith on Vercel connecting to a managed MySQL instance (AWS RDS MySQL, PlanetScale, Railway MySQL, or Aiven MySQL).

| Provider | Default Backup Mechanism | Retention Period | Recovery Capability |
| :--- | :--- | :--- | :--- |
| **AWS RDS MySQL** | Automated daily snapshots + binary log shipping | 7 days (default), configurable up to 35 days | Point-in-Time Recovery (PITR) to any second within retention window |
| **PlanetScale** | Automatic branch & daily database backups | 7 days (Hobby), 30 days (Scaler/Pro) | One-click snapshot restore & branch cloning |
| **Aiven for MySQL** | Automated hourly delta backups + full daily snapshots | 30 days | Point-in-Time Recovery (PITR) |
| **Railway MySQL** | Daily automated volume snapshots | 7 days | Snapshot volume restoration |

> [!IMPORTANT]
> **Production Opt-In Check**: Confirm that automated daily backups and binary log shipping (PITR) are **enabled** in your cloud provider console before launching production traffic.

---

## 2. Step-by-Step Recovery Procedure (Database Loss or Corruption)

If the active MySQL instance is corrupted or dropped, follow these steps to restore service:

### Step 2.1: Initiate Cloud Restore to a New MySQL Instance
1. Open your MySQL provider console (e.g. AWS RDS or PlanetScale).
2. Select **Restore from Snapshot** or **Restore to Point in Time**.
3. Target timestamp: Select the time immediately preceding the incident (e.g. 5 minutes before corruption).
4. Launch the restored instance with a temporary name (e.g. `agafari-prod-restored-2026`).

### Step 2.2: CLI Dump & Restore (Alternative / On-Premise)
If performing a manual backup or restoring from a `.sql` backup file:

```bash
# 1. Export backup from source instance
mysqldump --single-transaction --quick --lock-tables=false \
  -h <OLD_MYSQL_HOST> -u <MYSQL_USER> -p<MYSQL_PASSWORD> <MYSQL_DATABASE> > agafari_backup_latest.sql

# 2. Restore into target instance
mysql -h <NEW_MYSQL_HOST> -u <MYSQL_USER> -p<MYSQL_PASSWORD> -e "CREATE DATABASE IF NOT EXISTS agafari CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -h <NEW_MYSQL_HOST> -u <MYSQL_USER> -p<MYSQL_PASSWORD> agafari < agafari_backup_latest.sql
```

### Step 2.3: Verify Restored Data Integrity
Before pointing production traffic to the new database, run quick verification queries:

```sql
USE agafari;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM events;
SELECT COUNT(*) FROM invitations;
```

### Step 2.4: Update Vercel Environment Variables & Redeploy
1. Go to **Vercel Dashboard** → **Project Settings** → **Environment Variables**.
2. Update the connection variables:
   - `MYSQL_HOST`: `<NEW_MYSQL_HOST>`
   - `MYSQL_DATABASE`: `agafari`
   - `MYSQL_USER`: `<MYSQL_USER>`
   - `MYSQL_PASSWORD`: `<NEW_MYSQL_PASSWORD>`
3. Click **Redeploy** on Vercel to instantly update all serverless lambdas.

---

## 3. Human Manual Steps Notice

> [!NOTE]
> Since this environment uses local MySQL or developer staging, automated cloud snapshot trigger requires provider API access (AWS IAM / PlanetScale API key). The steps above represent the exact operational playbook human SREs must execute during an incident.
