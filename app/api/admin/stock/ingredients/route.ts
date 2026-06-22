import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  quantity: z.coerce.number().int().min(0).optional(),
  unit: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rows = await prisma.stockIngredient.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(rows);
  } catch (e) {
    console.error("GET /api/admin/stock/ingredients", e);
    return NextResponse.json(
      { error: "Erreur serveur. Exécutez `npx prisma db push` pour créer la table StockIngredient." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  try {
    const row = await prisma.stockIngredient.create({
      data: {
        name: parsed.data.name.trim(),
        quantity: parsed.data.quantity ?? 0,
        unit: parsed.data.unit?.trim() || null,
      },
    });
    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    console.error("POST /api/admin/stock/ingredients", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
