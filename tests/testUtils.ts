import { v4 as uuidv4 } from "uuid";
import createApp from "../src/app";
import request, { Test } from "supertest";
import { RoleService } from "../src/services/RoleService";
import prismaService, { PrismaService } from "../src/services/prisma.service";
type TestUser = {
  id: string;
  token: string;
  email: string;
  name: string;
  role?: string;
};

const testUsers: TestUser[] = [];
const testProducts: Array<{ id: number }> = [];

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

// const prismaService = new ()
const roleService = new RoleService(prismaService);

export const registerTestUser = async (
  roleName?: string
): Promise<TestUser> => {
  const testData = {
    email: `${uuidv4()}@test.com`,
    name: "Test user",
    password: "testpassword123",
  };

  const app = createApp();
  const response = await request(app).post("/auth/register").send(testData);

  const user = {
    id: response.body.user.id,
    token: response.body.token,
    email: testData.email,
    name: testData.name,
    role: roleName,
  };

  if (roleName) {
    let role = await prismaService.prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      const permissions =
        roleName === "admin" ? ["manage_products"] : ["view_products"];
      role = await prismaService.prisma.role.create({
        data: { name: roleName, permissions },
      });

      await roleService.assignRoleToUser(user.id, roleName);
    }
  }

  testUsers.push(user);
  return user;
};

export const cleanupTestUsers = async () => {
  const app = createApp();
  await Promise.all(
    testUsers.map((user) =>
      request(app)
        .delete(`/users/${user.id}`)
        .set("Authorization", `Bearer ${user.token}`)
        .catch((e) => console.error("Cleanup failed:", e))
    )
  );
  testUsers.length = 0;
};

export const createTestProduct = async (user: TestUser) => {
  const testData = {
    name: "test product",
    description: "test product",
    price: 823,
  };

  const response = await request(createApp())
    .post("/products")
    .set("Authorization", `Bearer ${user.token}`)
    .send(testData);

  testProducts.push({ id: response.body.id });
  return {
    productId: response.body.id,
    testData,
  };
};

export const cleanupTestProducts = async (): Promise<void> => {
  await Promise.all(
    testProducts.map((product) =>
      request(createApp())
        .delete(`/products/${product.id}`)
        .catch((e) => console.error("Product cleanup failed:", e))
    )
  );
  testProducts.length = 0;
};

export const getAuthenticatedRequest = (user: TestUser) => {
  const app = createApp();
  const agent = request(app);
  return (method: HttpMethod, url: string): Test => {
    return agent[method](url).set("Authorization", `Bearer ${user.token}`);
  };
};
