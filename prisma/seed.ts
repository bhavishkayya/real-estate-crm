import { PrismaClient, Role, LeadStatus, Temperature, Purpose } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) {
    throw new Error("Set SEED_ADMIN_EMAIL and a SEED_ADMIN_PASSWORD of at least 12 characters before running the seed.");
  }
  const admin = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: {
      name: process.env.SEED_ADMIN_NAME || "CRM Super Admin",
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
      role: Role.SUPER_ADMIN
    }
  });
  const projectSpecs = [
    { name: "Mahalunge Heights", location: "Mahalunge, Pune", developer: "Demo Developer" },
    { name: "Hinjewadi Greens", location: "Hinjewadi, Pune", developer: "Demo Developer" },
    { name: "Wakad Central", location: "Wakad, Pune", developer: "Demo Developer" }
  ];
  const projects = [];
  for (const spec of projectSpecs) {
    const existing = await prisma.project.findFirst({ where: { name: spec.name } });
    projects.push(existing ?? await prisma.project.create({ data: spec }));
  }
  const samples = [
    { fullName: "Rahul Sharma", mobile: "+919876543210", source: "Meta Ads", status: LeadStatus.QUALIFIED, temperature: Temperature.HOT, projectId: projects[0].id, budget: 8500000, purpose: Purpose.SELF_USE },
    { fullName: "Priya Nair", mobile: "+919820011223", source: "Google Ads", status: LeadStatus.SITE_VISIT_PLANNED, temperature: Temperature.HOT, projectId: projects[1].id, budget: 7200000, purpose: Purpose.INVESTMENT },
    { fullName: "Arjun Mehta", mobile: "+919988766554", source: "Website", status: LeadStatus.INTERESTED, temperature: Temperature.WARM, projectId: projects[0].id, budget: 9500000, purpose: Purpose.SELF_USE },
    { fullName: "Neha Kulkarni", mobile: "+919765432109", source: "Referral", status: LeadStatus.CONTACTED, temperature: Temperature.WARM, projectId: projects[2].id, budget: 6800000, purpose: Purpose.RENTAL }
  ];
  for (const s of samples) {
    const found = await prisma.lead.findFirst({ where: { mobile: s.mobile } });
    if (!found) {
      await prisma.lead.create({ data: { ...s, leadCode: `SEED-${s.mobile.slice(-6)}`, ownerId: admin.id } });
    }
  }
  console.log(`Seed complete. Admin: ${admin.email}; projects: ${projects.length}. Sample leads inserted when absent.`);
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });
