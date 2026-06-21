export type KitchenStation = "pizzeria" | "restaurant" | "bar";

export type StationItemStatus = "PENDING" | "IN_PROGRESS" | "DONE";

export const KITCHEN_STATIONS: KitchenStation[] = ["pizzeria", "restaurant", "bar"];

export const KITCHEN_STATION_LABELS: Record<KitchenStation, string> = {
  pizzeria: "Pizzeria",
  restaurant: "Restaurant",
  bar: "Bar",
};

export const STATION_STATUS_LABELS: Record<StationItemStatus, string> = {
  PENDING: "En attente",
  IN_PROGRESS: "En cours",
  DONE: "Terminé",
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

type ItemWithCategory = {
  status: string;
  menuItem: { category: { name: string } };
};

/** Statut agrégé d’un poste pour une commande (null = aucun article à ce poste). */
export function getStationAggregateStatus(
  orderItems: ItemWithCategory[],
  station: KitchenStation
): StationItemStatus | null {
  const items = orderItems.filter(
    (oi) => getKitchenStation(oi.menuItem.category.name) === station
  );
  if (items.length === 0) return null;
  if (items.every((oi) => oi.status === "DONE")) return "DONE";
  if (items.some((oi) => oi.status === "IN_PROGRESS")) return "IN_PROGRESS";
  return "PENDING";
}

export function allOrderItemsDone(orderItems: Array<{ status: string }>): boolean {
  return orderItems.length > 0 && orderItems.every((oi) => oi.status === "DONE");
}
