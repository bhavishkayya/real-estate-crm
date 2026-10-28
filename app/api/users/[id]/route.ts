import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRoles } from "@/lib/auth";
import { bodyJson, text } from "@/lib/http";
type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  try {
    await requireRoles(["SUPER_ADMIN", "ADMIN"]);
    const { id } = await context.params;
    const body = await bodyJson(request);
    const data: any = {};
    if (body.name !== undefined) data.name = text(body.name, "Name", 120);
    if (body.role !== undefined) {
      if (!Object.values(Role).includes(body.role)) return NextResponse.json({ error: "Invalid role." }, { status: 400 });
      data.role = body.role;
    }
    if (typeof body.active === "boolean") data.active = body.active;
    if (body.password) {
      const password = text(body.password, "Password", 200);
      if (password.length < 12) return NextResponse.json({ error: "Password must be at least 12 characters." }, { status: 400 });
      data.passwordHash = await bcrypt.hash(password, 12);
    }
    const user = await prisma.user.update({ where: { id }, data, select: { id: true, name: true, email: true, role: true, active: true, createdAt: true } });
    return NextResponse.json({ user });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to update user." }, { status: 400 }); }
}
