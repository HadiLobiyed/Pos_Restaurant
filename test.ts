import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { visible: true },
    });
    console.log("Menu items:", menuItems);
  } catch (err) {
    console.error("Erreur Prisma :", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();