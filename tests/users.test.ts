import request from "supertest";
import createApp from "../src/app";
import "dotenv/config";
import { cleanupTestUsers, registerTestUser } from "./testUtils";

describe("User API", () => {
  let app = createApp();

  afterEach(cleanupTestUsers);

  describe("GET /users/:id", () => {
    it("Should get a user with proper authentication", async () => {
      const user = await registerTestUser();

      const response = await request(app)
        .get(`/users/${user.id}`)
        .set("Authorization", `Bearer ${user.token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        email: user.email,
        name: user.name,
      });
      expect(response.body.password).toBeUndefined();
    });

    it("Should return 401 for unauthorized requests", async () => {
      const user = await registerTestUser();

      const response = await request(app).get(`/users/${user.id}`);

      expect(response.status).toBe(401);
    });
  });

  describe("GET /users", () => {
    it("It should return an array of users with the expected structure", async () => {
      const user = await registerTestUser();

      const response = await request(app)
        .get("/users/")
        .set("Authorization", `Bearer ${user.token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("email");
    });
  });

  describe("PATCH /users/:id", () => {
    it("should update user information", async () => {
      const user = await registerTestUser();
      const updates = { name: "updated name" };

      const response = await request(app)
        .patch(`/users/${user.id}`)
        .send(updates)
        .set("Authorization", `Bearer ${user.token}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updates.name);

      const getResponse = await request(app)
        .get(`/users/${user.id}`)
        .set("Authorization", `Bearer ${user.token}`);

      expect(getResponse.body.name).toBe(updates.name);
    });
  });

  describe("DELETE /users/:id", () => {
    it("should successfully delete user", async () => {
      const user = await registerTestUser();

      const response = await request(app)
        .delete(`/users/${user.id}`)
        .set("Authorization", `Bearer ${user.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const getResponse = await request(app)
        .get(`/users/${user.id}`)
        .set("Authorization", `Bearer ${user.token}`);

      expect(getResponse.status).toBe(404);
    });
  });
});
