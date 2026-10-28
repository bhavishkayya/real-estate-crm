import { NextResponse } from "next/server";
import { LeadStatus, Purpose, Temperature } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { bodyJson, text, optionalText } from "@/lib/http";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").trim();
    const status = url.searchParams.get("status") || "";
    const where: any = {};
    if (q) where.OR = [{ fullName: { contains: q } }, { mobile: { contains: q } }, { leadCode: { contains: q } }, { email: { contains: q } }];
    if (Object.values(LeadStatus).includes(status as LeadStatus)) where.status = status;
    if (user.role === "SALES_EXECUTIVE") where.ownerId = user.id;
    const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, include: { project: true, owner: { select: { id: true, name: true, email: true } } }, take: 500 });
    return NextResponse.json({ leads });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to load leads." }, { status: 401 }); }
}
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await bodyJson(request);
    const projectId = text(body.projectId, "Project", 100);
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.status !== "ACTIVE") return NextResponse.json({ error: "Select an active project." }, { status: 400 });
    const mobile = text(body.mobile, "Mobile number", 40);
    const existing = await prisma.lead.findFirst({ where: { mobile } });
    if (existing) return NextResponse.json({ error: "A lead with this mobile number already exists." }, { status: 409 });
    const rawStatus = String(body.status || "NEW");
    const rawTemp = String(body.temperature || "WARM");
    const rawPurpose = String(body.purpose || "");
    if (!Object.values(LeadStatus).includes(rawStatus as LeadStatus)) return NextResponse.json({ error: "Invalid lead status." }, { status: 400 });
    if (!Object.values(Temperature).includes(rawTemp as Temperature)) return NextResponse.json({ error: "Invalid temperature." }, { status: 400 });
    const lead = await prisma.lead.create({ data: {
      leadCode: `LD-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2,5).toUpperCase()}`,
      fullName: text(body.fullName, "Full name", 150), mobile,
      alternateNumber: optionalText(body.alternateNumber, 40), email: optionalText(body.email, 254),
      whatsapp: optionalText(body.whatsapp, 40), city: optionalText(body.city, 100),
      configuration: optionalText(body.configuration, 60),
      budget: body.budget !== undefined && body.budget !== "" ? Number(body.budget) : undefined,
      preferredLocation: optionalText(body.preferredLocation, 150),
      purpose: Object.values(Purpose).includes(rawPurpose as Purpose) ? rawPurpose as Purpose : undefined,
      source: text(body.source || "Other", "Source", 80),
      campaign: optionalText(body.campaign, 150), adSet: optionalText(body.adSet, 150), ad: optionalText(body.ad, 150),
      status: rawStatus as LeadStatus, temperature: rawTemp as Temperature,
      projectId, ownerId: user.role === "SALES_EXECUTIVE" ? user.id : optionalText(body.ownerId, 100) || undefined
    }});
    await prisma.activity.create({ data: { type: "LEAD_CREATED", description: `Created lead ${lead.leadCode}`, leadId: lead.id, userId: user.id } });
    if (typeof body.notes === "string" && body.notes.trim()) {
      await prisma.note.create({ data: { text: body.notes.trim(), leadId: lead.id, authorId: user.id } });
    }
    return NextResponse.json({ lead }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to create lead." }, { status: 400 }); }
}
