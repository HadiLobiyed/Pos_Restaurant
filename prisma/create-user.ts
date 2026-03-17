import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "hadi@rest.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: {
        name: "hadi",
        password: await hash("azerty123", 12),
        role: "ADMIN",
      },
    });
    console.log("User updated: hadi / hadi@rest.com / azerty123 (ADMIN)");
  } else {
    await prisma.user.create({
      data: {
        name: "hadi",
        email,
        password: await hash("azerty123", 12),
        role: "ADMIN",
      },
    });
    console.log("User created: hadi / hadi@rest.com / azerty123 (ADMIN)");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
