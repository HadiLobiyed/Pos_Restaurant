import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  image: z.string().optional(),
  categoryId: z.string(),
  visible: z.boolean().optional(),
  stock: z.number().int().min(0).nullable().optional(),
  barcode: z.string().optional().nullable(),
  supplements: z.array(z.object({ name: z.string(), price: z.number() })).optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const publicMenu = searchParams.get("public") === "true";
    if (publicMenu) {
      try {
        const items = await prisma.menuItem.findMany({
          where: { visible: true },
          include: { category: true, supplements: true },
          orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
        });
        return NextResponse.json(items);
      } catch (err) {
        // Si la table/colonne relationnelle supplements est absente côté DB,
        // on retente sans supplements pour ne pas casser l'affichage du menu.
        console.warn("GET /api/menu (public) — fallback sans supplements", err);
        const items = await prisma.menuItem.findMany({
          where: { visible: true },
          include: { category: true },
          orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
        });
        return NextResponse.json(items);
      }
    }
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
      const items = await prisma.menuItem.findMany({
        include: { category: true, supplements: true },
        orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
      });
      return NextResponse.json(items);
    } catch (err) {
      console.warn("GET /api/menu — fallback sans supplements", err);
      const items = await prisma.menuItem.findMany({
        include: { category: true },
        orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
      });
      return NextResponse.json(items);
    }
  } catch (err: any) {
    console.error("GET /api/menu error:", err);
    return NextResponse.json({ error: "Database error. Check DATABASE_URL (use Supabase pooler on Vercel)." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = createSchema.safeParse({
    ...body,
    price: typeof body.price === "string" ? parseFloat(body.price) : body.price,
    stock: body.stock === "" || body.stock === undefined ? null : typeof body.stock === "string" ? parseInt(body.stock, 10) : body.stock,
    barcode: body.barcode === "" ? null : body.barcode,
    supplements: body.supplements ? body.supplements.map((s: any) => ({ ...s, price: parseFloat(s.price) })) : undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  try {
    const item = await prisma.menuItem.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        price: parsed.data.price,
        image: parsed.data.image ?? null,
        categoryId: parsed.data.categoryId,
        visible: parsed.data.visible ?? true,
        stock: parsed.data.stock ?? null,
        barcode: parsed.data.barcode ?? null,
        supplements: parsed.data.supplements ? { create: parsed.data.supplements } : undefined,
      },
      include: { category: true, supplements: true },
    });
    return NextResponse.json(item);
  } catch (err: any) {
    console.error("POST /api/menu error:", err);
    return NextResponse.json({ error: "Database error. Check DATABASE_URL (use Supabase pooler on Vercel)." }, { status: 500 });
  }
}
