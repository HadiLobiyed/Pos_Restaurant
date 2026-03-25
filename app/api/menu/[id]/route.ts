import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  image: z.string().optional().nullable(),
  categoryId: z.string().optional(),
  visible: z.boolean().optional(),
  stock: z.number().int().min(0).nullable().optional(),
  barcode: z.string().optional().nullable(),
  supplements: z.array(z.object({ name: z.string(), price: z.number() })).optional(),
});

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
    price: body.price != null ? (typeof body.price === "string" ? parseFloat(body.price) : body.price) : undefined,
    stock: body.stock === "" || body.stock === undefined ? undefined : (typeof body.stock === "string" ? parseInt(body.stock, 10) : body.stock),
    barcode: body.barcode === undefined ? undefined : (body.barcode === "" ? null : body.barcode),
    supplements: body.supplements ? body.supplements.map((s: any) => ({ ...s, price: parseFloat(s.price) })) : undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const data: any = {};
  if (parsed.data.name != null) data.name = parsed.data.name;
  if (parsed.data.description !== undefined) data.description = parsed.data.description;
  if (parsed.data.price != null) data.price = parsed.data.price;
  if (parsed.data.image !== undefined) data.image = parsed.data.image;
  if (parsed.data.categoryId != null) data.categoryId = parsed.data.categoryId;
  if (parsed.data.visible !== undefined) data.visible = parsed.data.visible;
  if (parsed.data.stock !== undefined) data.stock = parsed.data.stock;
  if (parsed.data.barcode !== undefined) data.barcode = parsed.data.barcode;
  if (parsed.data.supplements !== undefined) data.supplements = { deleteMany: {}, create: parsed.data.supplements };

  try {
    const item = await prisma.menuItem.update({
      where: { id },
      data,
      include: { category: true, supplements: true },
    });
    return NextResponse.json(item);
  } catch (err) {
    // Si la relation supplements n'existe pas encore en base, on renvoie l'item sans inclure les suppléments.
    console.warn("PATCH /api/menu/[id] — fallback sans supplements", err);
    const dataWithoutSupps = { ...data } as any;
    if (dataWithoutSupps.supplements !== undefined) delete dataWithoutSupps.supplements;

    const item = await prisma.menuItem.update({
      where: { id },
      data: dataWithoutSupps,
      include: { category: true },
    });
    return NextResponse.json(item);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
