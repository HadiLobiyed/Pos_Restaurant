import { isBeverageCategory } from "@/lib/beverages";

type OrderItemWithMenu = {
  quantity: number;
  menuItem: {
    price: { toString(): string } | number | string;
    purchasePrice?: { toString(): string } | number | string | null;
    category: { name: string };
  };
};

/** Bénéfice = (prix vente − prix achat) × quantité, pour les boissons uniquement. */
export function calcBeverageProfitFromOrderItems(items: OrderItemWithMenu[]): number {
  return items.reduce((sum, oi) => {
    if (!isBeverageCategory(oi.menuItem.category.name)) return sum;
    const sale = Number(oi.menuItem.price);
    const cost = Number(oi.menuItem.purchasePrice ?? 0);
    return sum + (sale - cost) * oi.quantity;
  }, 0);
}
