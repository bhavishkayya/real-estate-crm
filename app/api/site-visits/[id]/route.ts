import { NextResponse } from "next/server";
import { SiteVisitStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { bodyJson, optionalText } from "@/lib/http";
type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  try {
    await requireUser();
    const { id } = await context.params;
    const body = await bodyJson(request);
    const data: any = {};
    if (body.status !== undefined) {
      if (!Object.values(SiteVisitStatus).includes(body.status)) return NextResponse.json({ error: "Invalid visit status." }, { status: 400 });
      data.status = body.status;
    }
    if (body.scheduledAt) { const date = new Date(body.scheduledAt); if (Number.isNaN(date.getTime())) return NextResponse.json({ error: "Invalid date." }, { status: 400 }); data.scheduledAt = date; }
    if (body.feedback !== undefined) data.feedback = optionalText(body.feedback, 4000);
    if (body.peopleCount !== undefined) data.peopleCount = body.peopleCount === "" ? null : Number(body.peopleCount);
    const siteVisit = await prisma.siteVisit.update({ where: { id }, data });
    return NextResponse.json({ siteVisit });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to update visit." }, { status: 400 }); }
}
