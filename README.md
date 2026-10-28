# Real Estate CRM — Hostinger / Next.js / Prisma / MySQL

This project includes database-backed CRM modules for dashboard statistics, leads, projects, follow-ups, site visits, reports, user administration, and responsive navigation. Authentication uses bcrypt password hashes and a signed HttpOnly session cookie.

## Important: deployment does not create database tables automatically

`npm install` runs `prisma generate`; this generates Prisma Client only. It does **not** create MySQL tables and it does not create the administrator. The database must be reachable by the MySQL user and the schema/seed setup must be run once.

## 1. Hostinger environment variables

In Hostinger hPanel → Websites → your website → Environment variables, set:

- `DATABASE_URL` — the MySQL connection string from Hostinger, using the exact database name, MySQL username, password, and hostname shown in hPanel.
- `SESSION_SECRET` — a unique random secret of at least 32 characters.
- `SEED_ADMIN_NAME` — desired administrator display name.
- `SEED_ADMIN_EMAIL` — desired administrator email address.
- `SEED_ADMIN_PASSWORD` — a strong unique password of at least 12 characters.

Use this format for the connection string (replace every placeholder):

```env
DATABASE_URL="mysql://DB_USERNAME:DB_PASSWORD@DB_HOST:3306/DB_NAME"
```

URL-encode special characters in the database password. Do not commit `.env`, share database passwords, or place real credentials in GitHub. Confirm the hostname in Hostinger; do not assume `127.0.0.1` is correct.

### If Prisma reports “User was denied access on the database”

This is a MySQL permissions/connection configuration problem, not a missing Prisma table. In hPanel → Databases → Management, verify the named MySQL user is assigned to the intended database and has the privileges required to create/read/write tables. Verify the database host and credentials. Do not keep retrying the seed until this access error is fixed.

## 2. Create tables and administrator

Run these commands from the project directory in a terminal that has access to the Hostinger database:

```bash
npm install
npx prisma validate
npx prisma generate
npm run db:setup
npm run build
```

`npm run db:setup` runs `prisma db push` followed by the seed script. This creates/updates tables from `prisma/schema.prisma`, then inserts the administrator and sample records. Review the target database and back it up first if it already contains data. Never run `prisma migrate reset` against production data.

If Hostinger does not provide a terminal, use a secure local terminal with network access to the Hostinger MySQL host if permitted by Hostinger, or use Hostinger's supported database deployment workflow. Do not manually create each table in phpMyAdmin.

## 3. Deploy on Hostinger

Recommended settings:

- Application/framework: Next.js
- Node.js: 22
- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm start` (if required by your Hostinger application mode)

Keep the build command separate from database setup. Run `npm run db:setup` once, deliberately, after checking the database connection and before logging in. Configure all environment variables in Hostinger, then redeploy.

## 4. First login

Use the email and password configured by `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` when the seed creates the account. The seed does not overwrite the password for an already-existing administrator with the same email. If that account already exists and the password is unknown, use a deliberate password-reset procedure rather than expecting another seed run to reset it.

The seed creates three sample projects and four sample leads if they are not already present.

## Features included

- Secure password hashing, signed HttpOnly cookie session, login/logout/current-user APIs.
- Roles: SUPER_ADMIN, ADMIN, SALES_MANAGER, SALES_EXECUTIVE, MANAGEMENT.
- Database-backed dashboard, lead list/search/status changes, lead creation/deletion, project creation/edit/archive, follow-up scheduling/completion, site-visit scheduling/status/feedback, reports, and basic user provisioning/disable.
- Mobile bottom navigation with a More menu exposing Projects, Site Visits, Reports, Users, and Settings.

## Known limitations / production hardening

This is a deployable CRM foundation, not a security certification. Before entering real customer data, test every workflow against the actual Hostinger database and have a developer review authorization boundaries, backup/restore, logging, data-retention rules, and privacy obligations. Email/SMS/WhatsApp delivery, automated background reminder delivery, password reset, full audit-log UI, and a CSRF-token framework are not included. The signed session expires after seven days; rotating `SESSION_SECRET` invalidates existing sessions.
