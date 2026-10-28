import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRoles } from "@/lib/auth";
import { bodyJson, text, optionalText } from "@/lib/http";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  try {
    await requireRoles(["SUPER_ADMIN", "ADMIN", "SALES_MANAGER"]);
    const { id } = await context.params;
    const body = await bodyJson(request);
    const project = await prisma.project.update({ where: { id }, data: {
      ...(body.name !== undefined ? { name: text(body.name, "Project name", 150) } : {}),
      ...(body.location !== undefined ? { location: text(body.location, "Location", 200) } : {}),
      ...(body.developer !== undefined ? { developer: optionalText(body.developer, 150) } : {}),
      ...(body.status !== undefined ? { status: text(body.status, "Status", 30) } : {})
    }});
    return NextResponse.json({ project });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to update project." }, { status: 400 }); }
}
export async function DELETE(_request: Request, context: Context) {
  try {
    await requireRoles(["SUPER_ADMIN", "ADMIN"]);
    const { id } = await context.params;
    const linked = await prisma.lead.count({ where: { projectId: id } });
    if (linked) return NextResponse.json({ error: "This project has leads linked to it. Archive it instead of deleting it." }, { status: 409 });
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to delete project." }, { status: 400 }); }
}
