import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { makeSession, sessionCookieName } from "@/lib/auth";
import { bodyJson, text } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body = await bodyJson(request);
    const email = text(body.email, "Email", 254).toLowerCase();
    const password = text(body.password, "Password", 200);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    }
    const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    response.cookies.set(sessionCookieName, makeSession(user.id), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
      path: "/", maxAge: 60 * 60 * 24 * 7
    });
    return response;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Login failed." }, { status: 400 });
  }
}
