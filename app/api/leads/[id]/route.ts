import { NextResponse } from "next/server";
import { LeadStatus, Temperature } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser, requireRoles } from "@/lib/auth";
import { bodyJson, text, optionalText } from "@/lib/http";
type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  try {
    const user = await requireUser();
    const { id } = await context.params;
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    if (user.role === "SALES_EXECUTIVE" && existing.ownerId !== user.id) return NextResponse.json({ error: "You can only update leads assigned to you." }, { status: 403 });
    const body = await bodyJson(request);
    if (body.status && !Object.values(LeadStatus).includes(body.status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    if (body.temperature && !Object.values(Temperature).includes(body.temperature)) return NextResponse.json({ error: "Invalid temperature." }, { status: 400 });
    const data: any = {};
    for (const key of ["fullName","mobile","source"] as const) if (body[key] !== undefined) data[key] = text(body[key], key, 200);
    for (const key of ["alternateNumber","email","whatsapp","city","configuration","preferredLocation","campaign","adSet","ad"] as const) if (body[key] !== undefined) data[key] = optionalText(body[key], 254);
    for (const key of ["status","temperature","purpose","projectId","ownerId"] as const) if (body[key] !== undefined) data[key] = body[key] || null;
    if (body.budget !== undefined) data.budget = body.budget === "" || body.budget === null ? null : Number(body.budget);
    const lead = await prisma.lead.update({ where: { id }, data });
    await prisma.activity.create({ data: { type: "LEAD_UPDATED", description: `Updated lead ${lead.leadCode}`, leadId: lead.id, userId: user.id } });
    return NextResponse.json({ lead });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to update lead." }, { status: 400 }); }
}
export async function DELETE(_request: Request, context: Context) {
  try {
    const user = await requireRoles(["SUPER_ADMIN", "ADMIN", "SALES_MANAGER"]);
    const { id } = await context.params;
    await prisma.lead.delete({ where: { id } });
    await prisma.activity.create({ data: { type: "LEAD_DELETED", description: `Deleted lead ${id}`, userId: user.id } });
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to delete lead." }, { status: 400 }); }
}
