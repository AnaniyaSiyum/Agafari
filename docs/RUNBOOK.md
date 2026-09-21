# Agafari Operations & Deployment Runbook

**Document Version**: 2.0  
**Target Platform**: Vercel (Next.js Monolith) + Managed MySQL (RDS / PlanetScale / Railway)

---

## 1. Complete Environment Variable Catalog

| Variable Name | Required? | Default (Dev) | Description |
| :--- | :--- | :--- | :--- |
| `MYSQL_HOST` | **Required** | `127.0.0.1` | Hostname of production MySQL server. |
| `MYSQL_PORT` | Optional | `3306` | MySQL port. |
| `MYSQL_DATABASE` | **Required** | `agafari` | Production database name. |
| `MYSQL_USER` | **Required** | `root` | Database connection username. |
| `MYSQL_PASSWORD` | **Required** | `""` | Database connection password. |
| `TICKET_SIGNING_SECRET` | **Required (Prod)** | Dev fallback | HMAC-SHA256 key (min 32 chars) for signing guest QR passes. |
| `JWT_SECRET` | **Required (Prod)** | Dev fallback | Session token JWT signing key (min 32 chars). |
| `PUBLIC_APP_URL` | **Required** | `http://localhost:3000` | Canonical public URL used for QR links. |
| `CRON_SECRET` | Recommended | - | Authorization token for scheduled lock endpoints. |
| `UPSTASH_REDIS_REST_URL` | Optional | - | Upstash Redis REST URL for distributed rate limiting. |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | - | Upstash Redis REST bearer token. |
| `SENTRY_DSN` | Optional | - | Sentry DSN for server-side error telemetry. |

---

## 2. Standard Deployment Procedure (Vercel)

### Step 2.1: Pre-Deploy Database Migrations
1. Connect to production MySQL using admin client or CLI.
2. Execute pending migration SQL scripts in `frontend/db/migrations/` in sequential order:
   ```bash
   mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < frontend/db/migrations/001_schema.sql
   mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < frontend/db/migrations/002_add_foreign_key_indexes.sql
   mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < frontend/db/migrations/003_gate_scan_logs.sql
   mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < frontend/db/migrations/004_quota_groups.sql
   mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < frontend/db/migrations/005_template_lock.sql
   mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < frontend/db/migrations/006_seed_templates_and_cms.sql
   ```

### Step 2.2: Configure Vercel Project Settings
1. Go to **Vercel Dashboard** → **Project Settings** → **Environment Variables**.
2. Add all mandatory variables from Section 1 above. Ensure `TICKET_SIGNING_SECRET` and `JWT_SECRET` are high-entropy 32-character strings.
3. Target **Production**, **Preview**, and **Development** environments appropriately.

### Step 2.3: Trigger Build & Verify
1. Push release commit to `main` or trigger via Vercel CLI: `vercel --prod`.
2. Confirm build succeeds (`next build` generates static assets & serverless lambdas cleanly).

---

## 3. Immediate Rollback Procedure

If a production deploy exhibits critical errors post-release:

1. Open **Vercel Dashboard** → **Deployments**.
2. Locate the last known healthy deployment prior to the release.
3. Click **...** → **Instant Rollback**. Vercel redirects traffic back to the prior deployment artifact within ~5 seconds.
4. If schema migrations were applied, run backwards-compatible rollbacks or point traffic to the snapshot per `docs/DISASTER_RECOVERY.md`.

---

## 4. Incident Triage Checklists

### 4.1 Check-Ins Failing at Live Gate (HTTP 400 / 403 / 500)
1. **Check Rate Limits**: If gate staff gets HTTP 429, verify they haven't exceeded 120 scans/min per device.
2. **Check HMAC Key Mismatch**: Confirm `TICKET_SIGNING_SECRET` in Vercel environment variables matches the key used when guest invitation passes were generated.
3. **Check Staff Event Scoping**: Verify the scanning user has an active row in `event_staff` for that `event_id` with `role = 'GATE_SCANNER'`.

### 4.2 RSVPs Failing to Save (HTTP 409 / 500)
1. **Check 48-Hour Lock**: If response is HTTP 409 `RsvpLockedError`, check `event_date`. If less than 48h remain, the domain lock is behaving as intended.
2. **Check MySQL Pool Exhaustion**: Inspect Vercel serverless logs for `Too many connections`. Adjust MySQL server `max_connections` or connection pool settings.
