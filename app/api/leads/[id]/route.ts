import { NextResponse } from "next/server";
import { LeadStatus, Temperature, Purpose } from "@prisma/client";
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
    if (body.mobile !== undefined) {
      const mobile = text(body.mobile, "Mobile number", 40);
      const duplicate = await prisma.lead.findFirst({ where: { mobile, NOT: { id } } });
      if (duplicate) return NextResponse.json({ error: "A lead with this mobile number already exists." }, { status: 409 });
      data.mobile = mobile;
    }
    if (body.purpose !== undefined) {
      if (body.purpose !== null && body.purpose !== "" && !Object.values(Purpose).includes(body.purpose)) return NextResponse.json({ error: "Invalid purpose." }, { status: 400 });
      data.purpose = body.purpose || null;
    }
    if (body.projectId !== undefined || body.ownerId !== undefined) {
      if (["SALES_EXECUTIVE", "MANAGEMENT"].includes(user.role)) return NextResponse.json({ error: "You cannot reassign the project or owner." }, { status: 403 });
      if (body.projectId !== undefined) {
        const project = await prisma.project.findUnique({ where: { id: String(body.projectId) } });
        if (!project || project.status !== "ACTIVE") return NextResponse.json({ error: "Select an active project." }, { status: 400 });
        data.projectId = project.id;
      }
      if (body.ownerId !== undefined) {
        if (body.ownerId === "" || body.ownerId === null) data.ownerId = null;
        else {
          const owner = await prisma.user.findUnique({ where: { id: String(body.ownerId) } });
          if (!owner || !owner.active) return NextResponse.json({ error: "Select an active owner." }, { status: 400 });
          data.ownerId = owner.id;
        }
      }
    }
    for (const key of ["fullName","source"] as const) if (body[key] !== undefined) data[key] = text(body[key], key, 200);
    for (const key of ["alternateNumber","email","whatsapp","city","configuration","preferredLocation","campaign","adSet","ad"] as const) if (body[key] !== undefined) data[key] = optionalText(body[key], 254);
    for (const key of ["status","temperature"] as const) if (body[key] !== undefined) data[key] = body[key] || null;
    if (body.budget !== undefined) {
      if (body.budget === "" || body.budget === null) data.budget = null;
      else { const budget = Number(body.budget); if (!Number.isFinite(budget) || budget < 0) return NextResponse.json({ error: "Budget must be a non-negative number." }, { status: 400 }); data.budget = budget; }
    }
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
