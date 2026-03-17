import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import QRCode from "qrcode";

const updateSchema = z.object({
  number: z.number().int().positive().optional(),
  reserved: z.boolean().optional(),
  reservationTime: z.string().datetime().optional().nullable(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const table = await prisma.table.findUnique({ where: { id } });
  if (!table) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(table);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse({
    ...body,
    number: body.number != null ? (typeof body.number === "string" ? parseInt(body.number, 10) : body.number) : undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const data: Record<string, unknown> = {};
  if (parsed.data.number != null) data.number = parsed.data.number;
  if (parsed.data.reserved !== undefined) data.reserved = parsed.data.reserved;
  if (parsed.data.reservationTime !== undefined)
    data.reservationTime = parsed.data.reservationTime ? new Date(parsed.data.reservationTime) : null;
  const table = await prisma.table.update({ where: { id }, data });
  return NextResponse.json(table);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.table.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
