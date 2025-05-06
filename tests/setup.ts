// import { PrismaClient } from "@prisma/client";

import prismaService from "../src/services/prisma.service";

beforeAll(async () => {
  await prismaService.connect();
});

afterAll(async () => {
  await prismaService.disconnect();
});
