import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      {
        name: "admin",
        permissions: [
          "manage_products",
          "delete_product",
          "create_product",
          "update_product",
        ],
      },
      {
        name: "viewer",
        permissions: ["view_products"],
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
