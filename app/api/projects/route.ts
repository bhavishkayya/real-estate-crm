import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireRoles } from "@/lib/auth";
import { bodyJson, text, optionalText } from "@/lib/http";

export async function GET() {
  try {
    await requireUser();
    const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { leads: true } } } });
    return NextResponse.json({ projects });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to load projects." }, { status: 401 }); }
}
export async function POST(request: Request) {
  try {
    await requireRoles(["SUPER_ADMIN", "ADMIN", "SALES_MANAGER"]);
    const body = await bodyJson(request);
    const project = await prisma.project.create({ data: {
      name: text(body.name, "Project name", 150),
      location: text(body.location, "Location", 200),
      developer: optionalText(body.developer, 150),
      status: typeof body.status === "string" ? body.status : "ACTIVE"
    }});
    return NextResponse.json({ project }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to create project." }, { status: 400 }); }
}
