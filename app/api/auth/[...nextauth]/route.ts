// Ensure NextAuth has a URL in dev (avoids Configuration error)
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = "http://localhost:3000";
}

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export async function GET(req: Request, ctx: { params?: Promise<{ nextauth?: string[] }> }) {
  try {
    return await handler(req, ctx as unknown as never);
  } catch (err) {
    console.error("[NextAuth] GET error:", err);
    throw err;
  }
}

export async function POST(req: Request, ctx: { params?: Promise<{ nextauth?: string[] }> }) {
  try {
    return await handler(req, ctx as unknown as never);
  } catch (err) {
    console.error("[NextAuth] POST error:", err);
    throw err;
  }
}

export const dynamic = "force-dynamic";
