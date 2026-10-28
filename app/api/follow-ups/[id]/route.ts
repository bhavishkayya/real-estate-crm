import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { bodyJson } from "@/lib/http";
type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  try {
    const user = await requireUser();
    const { id } = await context.params;
    const body = await bodyJson(request);
    const item = await prisma.followUp.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: "Follow-up not found." }, { status: 404 });
    if (user.role === "SALES_EXECUTIVE" && item.ownerId !== user.id) return NextResponse.json({ error: "You cannot update this follow-up." }, { status: 403 });
    const data: any = {};
    if (typeof body.completed === "boolean") data.completed = body.completed;
    if (body.dueAt) { const date = new Date(body.dueAt); if (Number.isNaN(date.getTime())) return NextResponse.json({ error: "Invalid due date." }, { status: 400 }); data.dueAt = date; }
    if (typeof body.notes === "string") data.notes = body.notes.slice(0, 2000);
    const updated = await prisma.followUp.update({ where: { id }, data });
    return NextResponse.json({ followUp: updated });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to update follow-up." }, { status: 400 }); }
}
