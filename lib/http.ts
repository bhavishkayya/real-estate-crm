import { NextResponse } from "next/server";
import { AuthError } from "@/lib/auth";
export function errorResponse(error: unknown) {
  if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
  console.error(error);
  return NextResponse.json({ error: "The request could not be completed. Check the server logs and required environment variables." }, { status: 500 });
}
export async function bodyJson(request: Request) {
  try { return await request.json(); } catch { throw new Error("Request body must be valid JSON."); }
}
export function text(value: unknown, field: string, max = 255) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required.`);
  if (value.trim().length > max) throw new Error(`${field} is too long.`);
  return value.trim();
}
export function optionalText(value: unknown, max = 255) {
  if (typeof value !== "string" || !value.trim()) return null;
  return value.trim().slice(0, max);
}
