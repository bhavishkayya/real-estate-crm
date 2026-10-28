import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRoles } from "@/lib/auth";
import { bodyJson, text } from "@/lib/http";
export async function GET() {
  try {
    await requireRoles(["SUPER_ADMIN", "ADMIN", "SALES_MANAGER", "MANAGEMENT"]);
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, active: true, createdAt: true }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ users });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to load users." }, { status: 401 }); }
}
export async function POST(request: Request) {
  try {
    await requireRoles(["SUPER_ADMIN", "ADMIN"]);
    const body = await bodyJson(request);
    const name = text(body.name, "Name", 120);
    const email = text(body.email, "Email", 254).toLowerCase();
    const password = text(body.password, "Password", 200);
    if (password.length < 12) return NextResponse.json({ error: "Password must be at least 12 characters." }, { status: 400 });
    if (!Object.values(Role).includes(body.role)) return NextResponse.json({ error: "Select a valid role." }, { status: 400 });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email, passwordHash, role: body.role } , select: { id: true, name: true, email: true, role: true, active: true, createdAt: true } });
    return NextResponse.json({ user }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to create user." }, { status: 400 }); }
}
