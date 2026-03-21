import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const table = await prisma.table.findUnique({ where: { id } });
  if (!table) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Priorité : SITE_URL (explicite) > VERCEL_URL (auto sur Vercel) > NEXTAUTH_URL > localhost
  const baseUrl =
    process.env.SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000";
  const url = `${baseUrl.replace(/\/$/, "")}/menu?table=${id}`;
  const dataUrl = await QRCode.toDataURL(url, { width: 256, margin: 2 });
  return NextResponse.json({ url, dataUrl });
}
