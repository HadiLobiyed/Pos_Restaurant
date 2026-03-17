import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({ number: z.number().int().positive() });

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tables = await prisma.table.findMany({
    orderBy: { number: "asc" },
  });
  return NextResponse.json(tables);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = createSchema.safeParse({
    number: typeof body.number === "string" ? parseInt(body.number, 10) : body.number,
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const table = await prisma.table.create({ data: { number: parsed.data.number } });
  return NextResponse.json(table);
}
