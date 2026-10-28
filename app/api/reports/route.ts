import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
export async function GET() {
  try {
    const user = await requireUser();
    const leadWhere = user.role === "SALES_EXECUTIVE" ? { ownerId: user.id } : {};
    const [totalLeads, hotLeads, booked, projects, followUpsDue, visits, statusGroups, sourceGroups, recentLeads] = await Promise.all([
      prisma.lead.count({ where: leadWhere }),
      prisma.lead.count({ where: { ...leadWhere, temperature: "HOT" } }),
      prisma.lead.count({ where: { ...leadWhere, status: "BOOKED" } }),
      prisma.project.count({ where: { status: "ACTIVE" } }),
      prisma.followUp.count({ where: { ...(user.role === "SALES_EXECUTIVE" ? { ownerId: user.id } : {}), completed: false, dueAt: { lte: new Date() } } }),
      prisma.siteVisit.count(),
      prisma.lead.groupBy({ by: ["status"], where: leadWhere, _count: { _all: true } }),
      prisma.lead.groupBy({ by: ["source"], where: leadWhere, _count: { _all: true }, orderBy: { _count: { source: "desc" } }, take: 10 }),
      prisma.lead.findMany({ where: leadWhere, orderBy: { createdAt: "desc" }, take: 8, include: { project: { select: { name: true } }, owner: { select: { name: true } } } })
    ]);
    return NextResponse.json({ stats: { totalLeads, hotLeads, booked, projects, followUpsDue, visits }, statusGroups, sourceGroups, recentLeads });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to load reports." }, { status: 401 }); }
}
