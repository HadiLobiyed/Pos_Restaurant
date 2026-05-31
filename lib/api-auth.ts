import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function requireApiAuth(req: NextRequest): Promise<boolean> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return false;
  const token = await getToken({ req, secret });
  return Boolean(token);
}
