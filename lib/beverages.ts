import { getKitchenStation } from "@/lib/kitchenStations";

/** Catégories menu considérées comme boissons (poste bar). */
export function isBeverageCategory(categoryName: string): boolean {
  return getKitchenStation(categoryName) === "bar";
}

export const DEFAULT_BEVERAGE_CATEGORY_NAME = "Boissons";
