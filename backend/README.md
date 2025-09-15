# LMS Backend (API & Workers)

A TypeScript/Express backend for the multi-tenant **Log Management System (LMS)**. It provides log ingestion, search, alert rules, authentication, and background workers (BullMQ) for email/OTP/cache jobs.

## 📑 Table of Contents
 
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure (key parts)](#folder-structure-key-parts)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Run Locally](#run-locally)
- [API Base Paths](#api-base-paths)
- [Routes (2-column tables)](#routes-2-column-tables)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Error Response Shape](#error-response-shape)
- [Sample Ingest (Admin)](#sample-ingest-admin)


## Features

- **Auth & RBAC**: JWT (HttpOnly cookies), Admin/User roles, auth + authorize middlewares  
- **Log Ingestion & Search**: REST endpoints with validation and tenant scoping  
- **Alerts**: Rule creation, evaluation, and alert listing  
- **Background Jobs**: BullMQ workers (email, OTP, cache invalidation) on Redis  
- **Security**: helmet, CORS whitelist, rate limiting, sanitization, compression  
- **Observability**: morgan request logs, consistent error handler  
- **Persistence**: PostgreSQL via Prisma (migrations + generated client)

---

## Tech Stack

- **Runtime**: Node.js + TypeScript  
- **Web**: Express 5, express-validator  
- **DB/ORM**: PostgreSQL + Prisma  
- **Queue/Cache**: BullMQ + Redis (ioredis)  
- **Auth**: JWT (access/refresh) in **HttpOnly, Secure** cookies  
- **Email**: Resend  
- **Security**: helmet, CORS, rate limit, sanitize-html, compression  
- **Testing**: Jest, Supertest

---

## Folder Structure (key parts)

```
backend/
├─ prisma/                  # schema.prisma, migrations/, seed.ts
├─ src/
│  ├─ config/               # error-codes.ts, prisma-client.ts, redis-client.ts, seed-data.ts
│  ├─ controllers/          # auth/, user/ controllers
│  ├─ jobs/
│  │  ├─ queues/            # bullmq queue definitions
│  │  └─ workers/           # email-worker.ts, otp-worker.ts, cache-worker.ts
│  ├─ middlewares/          # auth-middleware.ts, authorize-middleware.ts, rate-limtter.ts
│  ├─ routes/
│  │  └─ v1/
│  │     ├─ index.ts        # mounts /api/v1, /api/v1/admin, /api/v1/user
│  │     ├─ admin/          # admin-routes.ts
│  │     ├─ auth/           # auth-routes.ts
│  │     └─ user/           # user-routes.ts
│  ├─ services/             # alert-services.ts, auth-services.ts, log-services.ts, user-services.ts
│  ├─ utils/                # common utilities
│  ├─ test/                 # unit/integration tests
│  ├─ app.ts                # express app setup
│  ├─ index.ts              # server bootstrap (build outputs to dist/)
│  └─ syslog-listener.ts    # UDP/TCP syslog ingestion entry
└─ package.json
```

---

## Environment Variables

Create a `.env` next to `package.json` (production values go in your host’s env manager):

```env
NODE_ENV="developemnt"
PORT="8080l"
APP_DEBUG="true"
ACCESS_TOKEN_SECRET="your-key"
REFRESH_TOKEN_SECRET="your-key"
REDIS_URL="your-redis-url"
REDIS_HOST="your-redis-host-in-dev-6379"
REDIS_PORT="your-redis-port-in-dev-localhost"
REDIS_PASSWORD="your-redis-password"
LOG_RETENTION_DAYS="7"
DATABASE_URL="your-db-uri-go-grab-from-vercel-storage-create-db-neon-copy-db-uri"
RESEND_API_KEY="your-resend-api-key"
SENDER_EMAIL="no-reply@your-website.com"
RECIEVER_EMAIL="your-email"
```

> **CORS**: The app uses a **whitelist**. In code, common origins include:
> `https://www.logsmanagementsystem.xyz`, `https://lms-one-lac.vercel.app`, `http://localhost:5173`, `http://localhost:4000`.

---

## Scripts

From `package.json`:

| Script | What it does |
|---|---|
| `npm run dev` | Run API + all workers concurrently (nodemon) |
| `npm run dev:node` | Run API only (nodemon `src/index.ts`) |
| `npm run cache` | Run cache worker (nodemon) |
| `npm run email` | Run email worker (nodemon) |
| `npm run otp` | Run OTP worker (nodemon) |
| `npm run build` | TypeScript build to `dist/` |
| `npm start` | Start compiled server (`dist/index.js`) |
| `npm run test` | Run Jest tests |
| `npm run deploy` | `prisma migrate deploy && prisma generate` |

---

## Run Locally

1) Install deps  
```bash
npm install
```
2) Generate Prisma client  
```bash
npx prisma generate
```
3) (First time) apply migrations / seed (optional)  
```bash
npx prisma migrate deploy
# npm run seed  ← if you wire up the seed script
```
4) Start API + workers (dev)  
```bash
npm run dev
```
5) Or API only  
```bash
npm run dev:node
```

---

## API Base Paths

- **Public/Auth**: `/api/v1/*`  
- **Admin (requires Admin role)**: `/api/v1/admin/*`  
- **User (authenticated)**: `/api/v1/user/*`

---

## Routes (2-column tables)

### Auth (public `/api/v1`)

| Route | What it does |
|---|---|
| `POST /api/v1/register` | Register a new user (starts OTP verification flow) |
| `POST /api/v1/verify-otp` | Verify OTP for registration |
| `POST /api/v1/confirm-password` | Confirm and set password after OTP |
| `POST /api/v1/login` | Login; sets JWT cookies (HttpOnly) |
| `POST /api/v1/logout` | Logout; clears cookies |
| `POST /api/v1/forgot-password` | Start forgot-password flow (send OTP) |
| `POST /api/v1/verify-forgot-otp` | Verify OTP for password reset |
| `POST /api/v1/reset-password` | Reset password after OTP verification |
| `GET /api/v1/auth-check` | Check auth/session status (requires auth) |

### Admin (protected `/api/v1/admin`)

| Route | What it does |
|---|---|
| `GET /api/v1/admin/test` | Simple admin ping/test endpoint |
| `POST /api/v1/admin/ingest` | Ingest a log (admin-managed) |
| `DELETE /api/v1/admin/logs` | Delete logs by criteria |
| `GET /api/v1/admin/get-logs-infinite` | Infinite/paginated logs for admins |
| `POST /api/v1/admin/users` | Create a user (admin) |
| `DELETE /api/v1/admin/users` | Delete a user (admin) |
| `PATCH /api/v1/admin/users` | Update a user (admin) |
| `GET /api/v1/admin/users` | List users (infinite/paginated) |
| `POST /api/v1/admin/alert-rules` | Create an alert rule |
| `PATCH /api/v1/admin/alert-rules` | Update an alert rule |
| `DELETE /api/v1/admin/alert-rules` | Delete an alert rule |
| `GET /api/v1/admin/alert-rules` | List alert rules |
| `GET /api/v1/admin/summary` | Admin summary (metrics/overview) |

### User (protected `/api/v1/user`)

| Route | What it does |
|---|---|
| `GET /api/v1/user/test` | Simple user ping/test endpoint |
| `GET /api/v1/user/logs-alerts-overview` | Combined overview of logs & alerts |
| `GET /api/v1/user/source-comparisons` | Source-based comparisons/metrics |
| `GET /api/v1/user/severity-overview` | Severity distribution/overview |
| `GET /api/v1/user/get-logs-infinite` | Infinite/paginated logs for tenant |
| `GET /api/v1/user/filters` | Retrieve all necessary filters data for UI |
| `GET /api/v1/user/user-data` | Get user-profile info |
| `GET /api/v1/user/top-ips` | Top IPs by tenants |
| `GET /api/v1/user/all-alerts` | List alerts for tenant |

> All protected endpoints enforce **auth** middleware.  
> Admin endpoints also enforce **authorize(true, "ADMIN")**.

---

## Security

- **Cookies**: JWT access/refresh stored in **HttpOnly, Secure** cookies  
- **CORS**: Strict whitelist + `credentials: true`  
- **Headers**: `helmet()` with cross-origin resource policy  
- **Rate Limiting**: `express-rate-limit` via custom `limiter` middleware  
- **Validation**: `express-validator`, `sanitize-html`  
- **Compression/Logging**: `compression`, `morgan`

---

## Testing

- Unit/integration tests with **Jest** and **Supertest**  
- Keep test files out of TypeScript build (exclude `**/*.test.ts` in `tsconfig.json`)

---

## Deployment

- Build: `npm run build` → outputs to `dist/`  
- Start: `npm start`  
- Prisma: `npm run deploy` (runs `prisma migrate deploy` + `prisma generate`)  
- Suggested hosts: **Render** (API), **Neon** (Postgres), **Redis Cloud** (Redis), **Resend** (email)

---

## Error Response Shape

All errors pass the global error handler and respond as:

```json
{
  "message": "Human-readable message",
  "error": "Error_Code"
}
```

---

## Sample Ingest (Admin)

```http
POST /api/v1/admin/ingest
Content-Type: application/json

{
    tenant: "tenantA",
    source: "API",
    action: "ALERT",
    severity: 5,
    eventType: "LoginAttempt",
    user: "Swam Yi Phyo",
    ip: "127.0.0.1",
    reason: "Testing default API log",
}
```
