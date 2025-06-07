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

  describe("GET /products", () => {
    it("Should create a new product", async () => {
      let response = await request(app).post("/products").send({
        name: "test product",
        description: "test product",
        price: 823,
      });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(testObject);
    });
  });
});
