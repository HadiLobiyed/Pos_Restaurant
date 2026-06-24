import { prisma } from "@/lib/prisma";

export const DEFAULT_RESTAURANT_NAME = "Restaurant POS";
const SETTINGS_ID = "default";
const LOGO_ID = "default";

export type RestaurantBranding = {
  restaurantName: string;
  logoUrl: string | null;
  logoUpdatedAt: string | null;
};

export async function getRestaurantBranding(): Promise<RestaurantBranding> {
  try {
    const [settings, logo] = await Promise.all([
      prisma.restaurantSettings.findUnique({ where: { id: SETTINGS_ID } }),
      prisma.restaurantLogo.findUnique({ where: { id: LOGO_ID } }),
    ]);
    const name = settings?.restaurantName?.trim();
    return {
      restaurantName: name && name.length > 0 ? name : DEFAULT_RESTAURANT_NAME,
      logoUrl: logo?.imageUrl?.trim() || null,
      logoUpdatedAt: logo?.updatedAt?.toISOString() ?? null,
    };
  } catch {
    return {
      restaurantName: DEFAULT_RESTAURANT_NAME,
      logoUrl: null,
      logoUpdatedAt: null,
    };
  }
}

export async function getRestaurantName(): Promise<string> {
  const { restaurantName } = await getRestaurantBranding();
  return restaurantName;
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

export async function setRestaurantLogo(data: {
  imageUrl: string;
  storagePath: string;
  mimeType: string;
}): Promise<RestaurantBranding> {
  await prisma.restaurantLogo.upsert({
    where: { id: LOGO_ID },
    create: {
      id: LOGO_ID,
      imageUrl: data.imageUrl,
      storagePath: data.storagePath,
      mimeType: data.mimeType,
    },
    update: {
      imageUrl: data.imageUrl,
      storagePath: data.storagePath,
      mimeType: data.mimeType,
    },
  });
  return getRestaurantBranding();
}

export async function clearRestaurantLogo(): Promise<RestaurantBranding> {
  await prisma.restaurantLogo.upsert({
    where: { id: LOGO_ID },
    create: { id: LOGO_ID },
    update: { imageUrl: null, storagePath: null, mimeType: null },
  });
  return getRestaurantBranding();
}
