import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { bodyJson, text, optionalText } from "@/lib/http";
export async function GET() {
  try {
    const user = await requireUser();
    const where = user.role === "SALES_EXECUTIVE" ? { ownerId: user.id } : {};
    const items = await prisma.followUp.findMany({ where, include: { lead: { select: { id: true, leadCode: true, fullName: true, mobile: true } }, owner: { select: { name: true } } }, orderBy: [{ completed: "asc" }, { dueAt: "asc" }], take: 500 });
    return NextResponse.json({ followUps: items });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to load follow-ups." }, { status: 401 }); }
}
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await bodyJson(request);
    const leadId = text(body.leadId, "Lead", 100);
    const dueAt = new Date(body.dueAt);
    if (Number.isNaN(dueAt.getTime())) return NextResponse.json({ error: "A valid due date is required." }, { status: 400 });
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    const followUp = await prisma.followUp.create({ data: { type: text(body.type, "Follow-up type", 60), dueAt, notes: optionalText(body.notes, 2000), leadId, ownerId: user.id } });
    return NextResponse.json({ followUp }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to create follow-up." }, { status: 400 }); }
}
