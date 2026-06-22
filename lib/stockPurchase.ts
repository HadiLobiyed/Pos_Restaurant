import type { Prisma } from "@prisma/client";

type PurchaseInput = {
  type: "ingredient" | "beverage";
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
};

export async function recordStockPurchase(
  tx: Prisma.TransactionClient,
  input: PurchaseInput
) {
  if (input.quantity <= 0 || input.unitPrice <= 0) return;
  await tx.stockPurchase.create({
    data: {
      type: input.type,
      itemId: input.itemId,
      itemName: input.itemName,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      totalCost: input.quantity * input.unitPrice,
    },
  });
}
