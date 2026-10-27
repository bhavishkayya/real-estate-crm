# Real Estate CRM — Hostinger Deployment

Next.js + TypeScript + Prisma + MySQL starter for a real-estate sales CRM.

## 1. Local setup
```bash
npm install
cp .env.example .env
# Put your MySQL DATABASE_URL in .env
npx prisma generate
npx prisma db push
npm run dev
```

## 2. GitHub
Create a new GitHub repository named `real-estate-crm`, upload the contents of this folder, and push the code.

## 3. Hostinger
In Deploy your web app choose **Import your Git repository → Connect with GitHub** and select the repository.

Recommended settings:
- Framework: Next.js
- Node.js: 22 or 24
- Build command: `npm run build`
- Start command: `npm start`
- Port: use Hostinger's detected/default Node app port
- Environment variable: `DATABASE_URL`

## 4. Database
Create a MySQL database in Hostinger hPanel, copy the connection details into `DATABASE_URL`, then run the Prisma schema push from the deployment/build environment as required by your Hostinger setup.

## Important
The UI is functional as a CRM prototype with demo records. Authentication, server-side lead CRUD, permissions, notifications, and live reports should be wired to the Prisma database before production use. Never use the seeded `CHANGE_ME` password in production.
