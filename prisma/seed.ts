import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

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

  console.log("Creating menu items...");
  const items = await Promise.all([
    // Entrées
    prisma.menuItem.create({
      data: {
        name: "Salade César",
        description: "Poulet grillé, parmesan, croûtons, sauce césar",
        price: 9.5,
        categoryId: catEntrees.id,
        visible: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Soupe à l'oignon",
        description: "Soupe gratinée au comté",
        price: 7.0,
        categoryId: catEntrees.id,
        visible: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Bruschetta tomate mozzarella",
        description: "Pain grillé, tomates fraîches, basilic, mozzarella",
        price: 6.5,
        categoryId: catEntrees.id,
        visible: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Carpaccio de bœuf",
        description: "Fine tranches de bœuf, roquette, parmesan, huile d'olive",
        price: 12.0,
        categoryId: catEntrees.id,
        visible: true,
      },
    }),
    // Plats
    prisma.menuItem.create({
      data: {
        name: "Burger classique",
        description: "Steak 180g, salade, tomate, oignon, sauce maison, frites",
        price: 14.0,
        categoryId: catPlats.id,
        visible: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Pavé de saumon",
        description: "Saumon grillé, légumes de saison, beurre blanc",
        price: 18.5,
        categoryId: catPlats.id,
        visible: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Pâtes carbonara",
        description: "Pâtes fraîches, lardons, crème, parmesan, œuf",
        price: 13.0,
        categoryId: catPlats.id,
        visible: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Entrecôte 300g",
        description: "Entrecôte grillée, frites, sauce au poivre",
        price: 22.0,
        categoryId: catPlats.id,
        visible: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Risotto aux champignons",
        description: "Riz crémeux, champignons, parmesan",
        price: 15.0,
        categoryId: catPlats.id,
        visible: true,
      },
    }),
    // Pizza
    prisma.menuItem.create({
      data: {
        name: "Pizza Margherita",
        description: "Tomate, mozzarella, basilic",
        price: 11.0,
        categoryId: catPizza.id,
        visible: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Pizza Reine",
        description: "Tomate, mozzarella, jambon, champignons",
        price: 13.0,
        categoryId: catPizza.id,
        visible: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Pizza 4 fromages",
        description: "Mozzarella, gorgonzola, chèvre, parmesan",
        price: 14.0,
        categoryId: catPizza.id,
        visible: true,
      },
    }),
    // Desserts
    prisma.menuItem.create({
      data: {
        name: "Tiramisu",
        description: "Mascarpone, café, cacao",
        price: 7.5,
        categoryId: catDesserts.id,
        visible: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Fondant au chocolat",
        description: "Cœur coulant, glace vanille",
        price: 8.0,
        categoryId: catDesserts.id,
        visible: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Crème brûlée",
        description: "Vanille bourbon, croûte caramélisée",
        price: 6.5,
        categoryId: catDesserts.id,
        visible: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Salade de fruits frais",
        description: "Fruits de saison",
        price: 5.5,
        categoryId: catDesserts.id,
        visible: true,
      },
    }),
    // Boissons (avec stock et code barre)
    prisma.menuItem.create({
      data: {
        name: "Coca-Cola",
        description: "33cl",
        price: 3.0,
        categoryId: catBoissons.id,
        visible: true,
        stock: 48,
        barcode: "5449000000996",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Eau minérale",
        description: "50cl",
        price: 2.5,
        categoryId: catBoissons.id,
        visible: true,
        stock: 120,
        barcode: "3068320055570",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Café expresso",
        description: "Single ou double",
        price: 2.0,
        categoryId: catBoissons.id,
        visible: true,
        stock: 200,
        barcode: "3017620422003",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Vin rouge maison",
        description: "Verre 12cl",
        price: 4.5,
        categoryId: catBoissons.id,
        visible: true,
        stock: 24,
        barcode: "3017620429432",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Jus d'orange pressé",
        description: "25cl",
        price: 4.0,
        categoryId: catBoissons.id,
        visible: true,
        stock: 36,
        barcode: "3017620422004",
      },
    }),
  ]);

  const salade = items[0];
  const soupe = items[1];
  const burger = items[4];
  const saumon = items[5];
  const carbonara = items[6];
  const entrecote = items[7];
  const pizzaMargherita = items[9];
  const tiramisu = items[12];
  const fondant = items[13];
  const coca = items[16];
  const eau = items[17];
  const cafe = items[18];

  console.log("Creating tables...");
  const tables = await Promise.all(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) =>
      prisma.table.create({ data: { number } })
    )
  );

  console.log("Creating demo orders and payments...");
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Order 1 - Table 1 - today - PAID
  const order1 = await prisma.order.create({
    data: {
      tableId: tables[0].id,
      status: "DONE",
      createdAt: new Date(todayStart.getTime() + 12 * 60 * 60 * 1000),
      orderItems: {
        create: [
          { menuItemId: burger.id, quantity: 2, comment: null },
          { menuItemId: coca.id, quantity: 2, comment: null },
          { menuItemId: tiramisu.id, quantity: 1, comment: null },
        ],
      },
    },
    include: { orderItems: { include: { menuItem: true } } },
  });
  const total1 = order1.orderItems.reduce(
    (s, oi) => s + Number(oi.menuItem.price) * oi.quantity,
    0
  );
  await prisma.payment.create({
    data: { orderId: order1.id, total: total1, status: "PAID", createdAt: order1.createdAt },
  });

  // Order 2 - Table 3 - today - PAID
  const order2 = await prisma.order.create({
    data: {
      tableId: tables[2].id,
      status: "DONE",
      createdAt: new Date(todayStart.getTime() + 13 * 60 * 60 * 1000),
      orderItems: {
        create: [
          { menuItemId: salade.id, quantity: 1, comment: "Sans croûtons" },
          { menuItemId: saumon.id, quantity: 1, comment: null },
          { menuItemId: eau.id, quantity: 2, comment: null },
          { menuItemId: fondant.id, quantity: 1, comment: null },
        ],
      },
    },
    include: { orderItems: { include: { menuItem: true } } },
  });
  const total2 = order2.orderItems.reduce(
    (s, oi) => s + Number(oi.menuItem.price) * oi.quantity,
    0
  );
  await prisma.payment.create({
    data: { orderId: order2.id, total: total2, status: "PAID", createdAt: order2.createdAt },
  });

  // Order 3 - Table 5 - today - IN_PROGRESS (unpaid)
  const order3 = await prisma.order.create({
    data: {
      tableId: tables[4].id,
      status: "IN_PROGRESS",
      createdAt: new Date(),
      orderItems: {
        create: [
          { menuItemId: carbonara.id, quantity: 2, comment: null },
          { menuItemId: cafe.id, quantity: 2, comment: null },
        ],
      },
    },
    include: { orderItems: { include: { menuItem: true } } },
  });
  const total3 = order3.orderItems.reduce(
    (s, oi) => s + Number(oi.menuItem.price) * oi.quantity,
    0
  );
  await prisma.payment.create({
    data: { orderId: order3.id, total: total3, status: "UNPAID" },
  });

  // Order 4 - Table 2 - PENDING (pizza + plat pour test cuisine)
  const order4 = await prisma.order.create({
    data: {
      tableId: tables[1].id,
      status: "PENDING",
      createdAt: new Date(),
      orderItems: {
        create: [
          { menuItemId: entrecote.id, quantity: 1, comment: "À point" },
          { menuItemId: pizzaMargherita.id, quantity: 1, comment: null },
          { menuItemId: soupe.id, quantity: 1, comment: null },
        ],
      },
    },
    include: { orderItems: { include: { menuItem: true } } },
  });
  const total4 = order4.orderItems.reduce(
    (s, oi) => s + Number(oi.menuItem.price) * oi.quantity,
    0
  );
  await prisma.payment.create({
    data: { orderId: order4.id, total: total4, status: "UNPAID" },
  });

  // Reserve table 8
  await prisma.table.update({
    where: { id: tables[7].id },
    data: { reserved: true, reservationTime: new Date() },
  });

  console.log("Demo data created successfully.");
  console.log("Users: admin@restaurant.com / admin123, hadi@rest.com / azerty123, marie@restaurant.com / staff123");
  console.log("Categories: Entrées, Plats, Pizza, Desserts, Boissons");
  console.log("Menu: 21 items. Tables: 10. Orders: 4 (2 paid, 1 in progress, 1 pending with pizza+plat). Table 8 reserved.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
