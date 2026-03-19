import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // import par défaut
const { hash } = bcrypt;      // extraire la fonction hash

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning existing data...");
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.table.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating users...");
  const adminPassword = await hash("admin123", 12);
  const hadiPassword = await hash("azerty123", 12);
  const staffPassword = await hash("staff123", 12);

  await prisma.user.createMany({
    data: [
      { name: "Admin", email: "admin@restaurant.com", password: adminPassword, role: "ADMIN" },
      { name: "hadi", email: "hadi@rest.com", password: hadiPassword, role: "ADMIN" },
      { name: "Marie", email: "marie@restaurant.com", password: staffPassword, role: "STAFF" },
    ],
  });

  console.log("Creating categories...");
  const catEntrees = await prisma.category.create({ data: { name: "Entrées" } });
  const catPlats = await prisma.category.create({ data: { name: "Plats principaux" } });
  const catPizza = await prisma.category.create({ data: { name: "Pizza" } });
  const catDesserts = await prisma.category.create({ data: { name: "Desserts" } });
  const catBoissons = await prisma.category.create({ data: { name: "Boissons" } });

  console.log("Creating menu items sequentially...");
  const menuItemsData = [
    // Entrées
    { name: "Salade César", description: "Poulet grillé, parmesan, croûtons, sauce césar", price: 9.5, categoryId: catEntrees.id, visible: true },
    { name: "Soupe à l'oignon", description: "Soupe gratinée au comté", price: 7.0, categoryId: catEntrees.id, visible: true },
    { name: "Bruschetta tomate mozzarella", description: "Pain grillé, tomates fraîches, basilic, mozzarella", price: 6.5, categoryId: catEntrees.id, visible: true },
    { name: "Carpaccio de bœuf", description: "Fine tranches de bœuf, roquette, parmesan, huile d'olive", price: 12.0, categoryId: catEntrees.id, visible: true },
    // Plats
    { name: "Burger classique", description: "Steak 180g, salade, tomate, oignon, sauce maison, frites", price: 14.0, categoryId: catPlats.id, visible: true },
    { name: "Pavé de saumon", description: "Saumon grillé, légumes de saison, beurre blanc", price: 18.5, categoryId: catPlats.id, visible: true },
    { name: "Pâtes carbonara", description: "Pâtes fraîches, lardons, crème, parmesan, œuf", price: 13.0, categoryId: catPlats.id, visible: true },
    { name: "Entrecôte 300g", description: "Entrecôte grillée, frites, sauce au poivre", price: 22.0, categoryId: catPlats.id, visible: true },
    { name: "Risotto aux champignons", description: "Riz crémeux, champignons, parmesan", price: 15.0, categoryId: catPlats.id, visible: true },
    // Pizza
    { name: "Pizza Margherita", description: "Tomate, mozzarella, basilic", price: 11.0, categoryId: catPizza.id, visible: true },
    { name: "Pizza Reine", description: "Tomate, mozzarella, jambon, champignons", price: 13.0, categoryId: catPizza.id, visible: true },
    { name: "Pizza 4 fromages", description: "Mozzarella, gorgonzola, chèvre, parmesan", price: 14.0, categoryId: catPizza.id, visible: true },
    // Desserts
    { name: "Tiramisu", description: "Mascarpone, café, cacao", price: 7.5, categoryId: catDesserts.id, visible: true },
    { name: "Fondant au chocolat", description: "Cœur coulant, glace vanille", price: 8.0, categoryId: catDesserts.id, visible: true },
    { name: "Crème brûlée", description: "Vanille bourbon, croûte caramélisée", price: 6.5, categoryId: catDesserts.id, visible: true },
    { name: "Salade de fruits frais", description: "Fruits de saison", price: 5.5, categoryId: catDesserts.id, visible: true },
    // Boissons
    { name: "Coca-Cola", description: "33cl", price: 3.0, categoryId: catBoissons.id, visible: true, stock: 48, barcode: "5449000000996" },
    { name: "Eau minérale", description: "50cl", price: 2.5, categoryId: catBoissons.id, visible: true, stock: 120, barcode: "3068320055570" },
    { name: "Café expresso", description: "Single ou double", price: 2.0, categoryId: catBoissons.id, visible: true, stock: 200, barcode: "3017620422003" },
    { name: "Vin rouge maison", description: "Verre 12cl", price: 4.5, categoryId: catBoissons.id, visible: true, stock: 24, barcode: "3017620429432" },
    { name: "Jus d'orange pressé", description: "25cl", price: 4.0, categoryId: catBoissons.id, visible: true, stock: 36, barcode: "3017620422004" },
  ];

  const items = [];
  for (const data of menuItemsData) {
    const item = await prisma.menuItem.create({ data });
    items.push(item);
  }

  console.log("Creating tables...");
  const tables = [];
  for (let i = 1; i <= 10; i++) {
    const table = await prisma.table.create({ data: { number: i } });
    tables.push(table);
  }

  // Ici tu peux continuer avec les commandes et paiements comme dans ton script original
  // mais en utilisant `await` séquentiellement pour éviter les erreurs du pooler
  // Exemple pour la première commande :
  const burger = items[4];
  const coca = items[16];
  const tiramisu = items[12];

  const order1 = await prisma.order.create({
    data: {
      tableId: tables[0].id,
      status: "DONE",
      orderItems: {
        create: [
          { menuItemId: burger.id, quantity: 2 },
          { menuItemId: coca.id, quantity: 2 },
          { menuItemId: tiramisu.id, quantity: 1 },
        ],
      },
    },
    include: { orderItems: { include: { menuItem: true } } },
  });
  const total1 = order1.orderItems.reduce((sum, oi) => sum + Number(oi.menuItem.price) * oi.quantity, 0);
  await prisma.payment.create({ data: { orderId: order1.id, total: total1, status: "PAID" } });

  console.log("Seed terminé !");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });