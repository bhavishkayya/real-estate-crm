import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { Role, User } from "@prisma/client";

const COOKIE = "crm_session";
const secret = () => {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters.");
  return value;
};
function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}
export function makeSession(userId: string) {
  const payload = Buffer.from(JSON.stringify({ userId, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
function readSession(token?: string) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const a = Buffer.from(signature), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!data.userId || !data.exp || data.exp < Date.now()) return null;
    return data.userId as string;
  } catch { return null; }
}
export async function currentUser(): Promise<Omit<User, "passwordHash"> | null> {
  const store = await cookies();
  const userId = readSession(store.get(COOKIE)?.value);
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.active) return null;
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}
export async function requireUser() {
  const user = await currentUser();
  if (!user) throw new AuthError("Authentication required", 401);
  return user;
}
export async function requireRoles(roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new AuthError("You do not have permission to perform this action.", 403);
  return user;
}
export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) { super(message); this.status = status; }
}
export const sessionCookieName = COOKIE;
