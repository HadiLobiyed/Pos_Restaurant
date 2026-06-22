import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { DEFAULT_BEVERAGE_CATEGORY_NAME, isBeverageCategory } from "@/lib/beverages";

async function resolveBeverageCategoryId() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  let cat = categories.find((c) => isBeverageCategory(c.name));
  if (!cat) {
    cat = await prisma.category.create({ data: { name: DEFAULT_BEVERAGE_CATEGORY_NAME } });
  }
  return cat.id;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const items = await prisma.menuItem.findMany({
      include: { category: true },
      orderBy: { name: "asc" },
    });
    const beverages = items.filter((i) => isBeverageCategory(i.category.name));
    return NextResponse.json(beverages);
  } catch (e) {
    console.error("GET /api/admin/stock/beverages", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

const createSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().positive(),
  description: z.string().optional(),
  quantity: z.coerce.number().int().min(0),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse({
    ...body,
    price: typeof body.price === "string" ? parseFloat(body.price) : body.price,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  try {
    const categoryId = await resolveBeverageCategoryId();
    const item = await prisma.menuItem.create({
      data: {
        name: parsed.data.name.trim(),
        description: parsed.data.description?.trim() || null,
        price: parsed.data.price,
        categoryId,
        visible: true,
        stock: parsed.data.quantity,
      },
      include: { category: true },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error("POST /api/admin/stock/beverages", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
