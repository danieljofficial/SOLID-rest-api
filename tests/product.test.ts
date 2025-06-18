import request from "supertest";
import createApp from "../src/app";
import {
  cleanupTestUsers,
  getAuthenticatedRequest,
  registerTestUser,
} from "./testUtils";

describe("Product API", () => {
  let app = createApp();
  const testObject = {
    name: "test product",
    description: "test product",
    price: 823,
  };
  let testProducts: Array<{ id: number }> = [];

  const createTestProduct = async () => {
    const testData = {
      name: "test product",
      description: "test product",
      price: 823,
    };

    const productResponse = await authenticatedRequest(
      "post",
      "/products"
    ).send(testData);
    testProducts.push({ id: productResponse.body.id });

    return {
      productId: productResponse.body.id,
      testData,
    };
  };

  const cleanUpTestProducts = async () => {
    await Promise.all(
      testProducts.map((product) => {
        request(app)
          .delete(`/products/${product.id}`)
          .catch((e) => console.error(`Test product cleanup failed ${e}`));
      })
    );

    testProducts = [];
  };

  let testUser: Awaited<ReturnType<typeof registerTestUser>>;
  let authenticatedRequest: ReturnType<typeof getAuthenticatedRequest>;

  beforeAll(async () => {
    testUser = await registerTestUser();
    authenticatedRequest = getAuthenticatedRequest(testUser);
  });
  afterEach(() => {
    cleanUpTestProducts();
  });
  afterAll(cleanupTestUsers);

  describe("POST /products", () => {
    it("Should create a new product", async () => {
      const response = await authenticatedRequest("post", "/products").send(
        testObject
      );

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(testObject);
    });

    it("Should reject product creation with missing required fields (400)", async () => {
      const response = await authenticatedRequest("post", "/products").send({
        name: "test product",
        description: "test product",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /products", () => {
    it("Should get a list of products", async () => {
      const response = await authenticatedRequest("get", "/products");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      const user = response.body[0];
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("description");
      expect(user).toHaveProperty("price");
    });
  });

  describe("GET /products/:id", () => {
    it("Should get a product", async () => {
      const { productId } = await createTestProduct();
      const response = await authenticatedRequest(
        "get",
        `/products/${productId}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(testObject);
    });
  });

  describe("PATCH /products/:id", () => {
    it("Should update a product", async () => {
      const updates = { description: "updated description" };
      const { productId } = await createTestProduct();

      const response = await authenticatedRequest(
        "patch",
        `/products/${productId}`
      ).send(updates);

      expect(response.status).toBe(200);
      expect(response.body.description).toBe(updates.description);
    });
  });

  describe("DELETE /products/:id", () => {
    it("Should successfully delete a product", async () => {
      const { productId } = await createTestProduct();
      const response = await authenticatedRequest(
        "delete",
        `/products/${productId}`
      );
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
