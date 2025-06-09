import { v4 as uuidv4 } from "uuid";
import request from "supertest";
import createApp from "../src/app";

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

    const productResponse = await request(app).post("/products").send(testData);
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

  afterEach(() => {
    cleanUpTestProducts();
  });

  describe("POST /products", () => {
    it("Should create a new product", async () => {
      const response = await request(app).post("/products").send(testObject);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(testObject);
    });

    it("Should reject product creation with missing required fields (400)", async () => {
      const response = await request(app).post("/products").send({
        name: "test product",
        description: "test product",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /products", () => {
    it("Should get a list of products", async () => {
      const response = await request(app).get("/products");

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
      const response = await request(app).get(`/products/${productId}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(testObject);
    });
  });

  describe("PATCH /products/:id", () => {
    it("Should update a product", async () => {
      const updates = { description: "updated description" };
      const { productId } = await createTestProduct();

      const response = await request(app)
        .patch(`/products/${productId}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.description).toBe(updates.description);
    });
  });

  describe("DELETE /products/:id", () => {
    it("Should successfully delete a product", async () => {
      const { productId } = await createTestProduct();
      const response = await request(app).delete(`/products/${productId}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
