import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.userRole.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();

  await prisma.role.createMany({
    data: [
      {
        name: "admin",
        permissions: ["manage_users", "delete_any", "manage_products"],
      },
      { name: "viewer", permissions: ["view_products"] },
    ],
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
