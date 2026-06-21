export type KitchenStation = "pizzeria" | "restaurant" | "bar";

export const KITCHEN_STATION_LABELS: Record<KitchenStation, string> = {
  pizzeria: "Pizzeria",
  restaurant: "Restaurant",
  bar: "Bar",
};

/** Associe une catégorie menu à un poste cuisine. */
export function getKitchenStation(categoryName: string): KitchenStation {
  const n = categoryName.toLowerCase().trim();
  if (n === "pizza" || n.includes("pizza")) return "pizzeria";
  if (
    n === "bar" ||
    n === "boissons" ||
    n === "boisson" ||
    n.includes("boisson") ||
    n.includes("drink") ||
    n.includes("bar ")
  ) {
    return "bar";
  }
  return "restaurant";
}

export function stationMatchesCategory(station: KitchenStation, categoryName: string): boolean {
  return getKitchenStation(categoryName) === station;
}
