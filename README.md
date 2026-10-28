# Real Estate CRM — deployable foundation

This is a Next.js + TypeScript + Prisma + MySQL CRM foundation. It replaces the original demo-only UI with database-backed dashboard, lead management, project creation, follow-ups, site visits, reports, user management, responsive mobile navigation and login/session APIs.

## Before deploying
1. Create or select the intended MySQL database in Hostinger.
2. Set `DATABASE_URL` in Hostinger environment variables.
3. Set `SESSION_SECRET` to a random secret of at least 32 characters.
4. Set `SEED_ADMIN_EMAIL`, `SEED_ADMIN_NAME`, and `SEED_ADMIN_PASSWORD` (password must be at least 12 characters).
5. Keep these secrets out of GitHub. Do not upload `.env`.

## Install and build
```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run build
npm start
```

`prisma db push` creates/updates tables from the schema. Review the target database first and back it up if it contains data. Do not use `prisma migrate reset` in production.

## Hostinger settings
- Framework: Next.js
- Node: 22
- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm start`
- Environment variables: `DATABASE_URL`, `SESSION_SECRET`, `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`

If Hostinger does not offer a terminal, use its supported database migration/build workflow or run the Prisma commands from a secure environment with access to the same database. Ensure schema push and seed have completed before signing in.

## First login
Use `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`. The seed hashes the password using bcrypt and inserts three sample projects and four sample leads if they do not already exist. The seed intentionally refuses to run unless the admin credentials are configured.

## Included
- Secure password hashing (bcrypt), signed HttpOnly cookie session, login/logout/current-user endpoints.
- Roles: SUPER_ADMIN, ADMIN, SALES_MANAGER, SALES_EXECUTIVE, MANAGEMENT.
- Server-side protected dashboard and data modules.
- MySQL-backed project and lead creation, lead search/filter, follow-up scheduling/completion, site visit scheduling/status/feedback, reports and basic user provisioning/disable.
- Responsive layout and mobile navigation.

## Limitations and production hardening
This package is a corrected functional foundation, not a certified production system. It needs an end-to-end test against your Hostinger MySQL environment before real customer data is entered. There is no email delivery, SMS/WhatsApp integration, scheduled background reminder delivery, password reset flow, audit-log UI, or CSRF token framework. The signed cookie uses a seven-day expiry; rotate `SESSION_SECRET` to invalidate sessions. Role restrictions are enforced for major operations, but you should have a developer review authorization edge cases and data retention policies before handling sensitive customer data.
