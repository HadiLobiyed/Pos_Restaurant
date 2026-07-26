import { prisma } from "@/lib/prisma";
import {
  DEFAULT_HOME_PAGE_CONTENT,
  parseHomePageContent,
  type HomePageContent,
} from "@/lib/homePageContent";

const SETTINGS_ID = "default";

export async function getHomePageContent(): Promise<HomePageContent> {
  try {
    const row = await prisma.restaurantSettings.findUnique({ where: { id: SETTINGS_ID } });
    return parseHomePageContent(row?.homePageContent ?? null);
  } catch {
    return DEFAULT_HOME_PAGE_CONTENT;
  }
}

export async function setHomePageContent(content: HomePageContent): Promise<HomePageContent> {
  const parsed = parseHomePageContent(content);
  await prisma.restaurantSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, homePageContent: parsed as object },
    update: { homePageContent: parsed as object },
  });
  return parsed;
}
