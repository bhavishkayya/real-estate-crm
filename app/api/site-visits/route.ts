import { NextResponse } from "next/server";
import { SiteVisitStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { bodyJson, text, optionalText } from "@/lib/http";
export async function GET() {
  try {
    await requireUser();
    const siteVisits = await prisma.siteVisit.findMany({ include: { lead: { select: { id: true, leadCode: true, fullName: true, mobile: true, project: { select: { name: true } } } } }, orderBy: { scheduledAt: "asc" }, take: 500 });
    return NextResponse.json({ siteVisits });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to load site visits." }, { status: 401 }); }
}
export async function POST(request: Request) {
  try {
    await requireUser();
    const body = await bodyJson(request);
    const scheduledAt = new Date(body.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime())) return NextResponse.json({ error: "A valid visit date is required." }, { status: 400 });
    const leadId = text(body.leadId, "Lead", 100);
    if (!await prisma.lead.findUnique({ where: { id: leadId } })) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    const siteVisit = await prisma.siteVisit.create({ data: { scheduledAt, leadId, configuration: optionalText(body.configuration, 60), peopleCount: body.peopleCount ? Number(body.peopleCount) : undefined } });
    return NextResponse.json({ siteVisit }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to schedule visit." }, { status: 400 }); }
}
