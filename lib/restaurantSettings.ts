import { prisma } from "@/lib/prisma";

export const DEFAULT_RESTAURANT_NAME = "Restaurant POS";
const SETTINGS_ID = "default";

export async function getRestaurantName(): Promise<string> {
  try {
    const row = await prisma.restaurantSettings.findUnique({ where: { id: SETTINGS_ID } });
    const name = row?.restaurantName?.trim();
    return name && name.length > 0 ? name : DEFAULT_RESTAURANT_NAME;
  } catch {
    return DEFAULT_RESTAURANT_NAME;
  }
}

export async function setRestaurantName(name: string): Promise<string> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Le nom du restaurant est requis.");
  await prisma.restaurantSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, restaurantName: trimmed },
    update: { restaurantName: trimmed },
  });
  return trimmed;
}
