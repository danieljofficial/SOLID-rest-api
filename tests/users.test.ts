import request from "supertest";
import createApp from "../src/app";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";

describe("User API", () => {
  let app = createApp();
  let testUsers: Array<{ id: string; token: string }> = [];

  const generateRandomEmail = () => `${uuidv4()}@test.com`;
  const registerTestUser = async () => {
    const testData = {
      email: generateRandomEmail(),
      name: "Test user",
      password: process.env.PASSWORD,
    };

    const registrationResponse = await request(app)
      .post("/auth/register")
      .send(testData);

    testUsers.push({
      id: registrationResponse.body.user.id,
      token: registrationResponse.body.token,
    });

    return {
      userId: registrationResponse.body.user.id,
      token: registrationResponse.body.token,
      testData,
    };
  };

  const cleanUpTestUsers = async () => {
    await Promise.all(
      testUsers.map((user) => {
        request(app)
          .delete(`/users/${user.id}`)
          .set("Authorization", `Bearer ${user.token}`)
          .catch((e) => console.error("cleanup failed"));
      })
    );

    testUsers = [];
  };

  afterEach(() => {
    cleanUpTestUsers();
  });

  describe("GET /users/:id", () => {
    it("Should get a user with proper authentication", async () => {
      const { testData, token, userId } = await registerTestUser();

      const response = await request(app)
        .get(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        email: testData.email,
        name: testData.name,
      });
      expect(response.body.password).toBeUndefined();
    });

    it("Should return 401 for unauthorized requests", async () => {
      const { userId } = await registerTestUser();

      const response = await request(app).get(`/users/${userId}`);

      expect(response.status).toBe(401);
    });
  });

  describe("GET /users", () => {
    it("It should return an array ofusers with the expected structure", async () => {
      const { token } = await registerTestUser();

      const response = await request(app)
        .get("/users/")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      const user = response.body[0];
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("email");
    });
  });

  describe("PATCH /users/:id", () => {
    it("should update user information", async () => {
      const { userId, token } = await registerTestUser();
      const updates = { name: "updated name" };

      const response = await request(app)
        .patch(`/users/${userId}`)
        .send(updates)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updates.name);

      const getResponse = await request(app)
        .get(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getResponse.body.name).toBe(updates.name);
    });
  });

  describe("DELETE /users/:id", () => {
    it("should successfully delete user", async () => {
      const { userId, token } = await registerTestUser();

      const response = await request(app)
        .delete(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const getResponse = await request(app)
        .get(`/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getResponse.status).toBe(500);
    });
  });
});
