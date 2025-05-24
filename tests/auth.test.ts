import request from "supertest";
import createApp from "../src/app";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";

describe("Authentication tests", () => {
  let app = createApp();
  const testUser = {
    email: "test@example.com",
    password: process.env.PASSWORD,
    name: "Test User",
  };

  let testUsers: Array<{ id: string; token: string }> = [];
  const createTestUserData: () => {
    email: String;
    name?: String;
    password: String;
  } = () => ({
    email: `${uuidv4()}@test.com`,
    name: "Test User",
    password: process.env.TEST_USER_PASSWORD || "securepassword123",
  });

  const registerTestUser = async (userData = createTestUserData()) => {
    const response = await request(app).post("/auth/register").send(userData);

    testUsers.push({
      id: response.body.user.id,
      token: response.body.token,
    });

    return {
      userData,
      response,
      userId: response.body.user.id,
      token: response.body.token,
    };
  };

  afterEach(async () => {
    await Promise.all(
      testUsers.map((user) =>
        request(app)
          .delete(`/users/${user.id}`)
          .set("Authorization", `Bearer ${user.token}`)
          .catch((e) => console.error("Cleanup failed:", e))
      )
    );
    testUsers = [];
  });

  describe("POST auth/register", () => {
    it("should create a new user with valid data", async () => {
      const testData = createTestUserData();

      const response = await request(app).post("/auth/register").send(testData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        token: expect.any(String),
        user: {
          id: expect.any(Number),
          email: testData.email,
          name: testData.name,
          createdAt: expect.any(String),
        },
      });

      expect(response.body).not.toHaveProperty("password");
    });

    it("should reject registration with missing required fields (400)", async () => {
      const testData = createTestUserData();
      delete testData.name;

      const response = await request(app).post("/auth/register").send(testData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /auth/login", () => {
    it("should authenticate with valid credentials (200)", async () => {
      const { userData } = await registerTestUser();

      const response = await request(app).post("/auth/login").send({
        email: userData.email,
        password: userData.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token: expect.any(String),
        user: {
          id: expect.any(Number),
          email: userData.email,
          name: userData.name,
          createdAt: expect.any(String),
        },
      });
    });

    it("should reject login with invalid password (401)", async () => {
      const { userData } = await registerTestUser();

      const response = await request(app).post("/auth/login").send({
        email: userData.email,
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("should reject login with non-existent email (404)", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "nonexistent@test.com",
        password: "anypassword",
      });

      // console.log(response)
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /auth/verify", () => {
    it("should verify a valid JWT token (200)", async () => {
      const { token, userData } = await registerTestUser();

      const response = await request(app)
        .post("/auth/verify")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        userId: expect.any(Number),
      });
    });

    it("should reject verification with invalid token (401)", async () => {
      const response = await request(app)
        .post("/auth/verify")
        .set("Authorization", "Bearer invalidtoken");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("should reject verification with missing token (401)", async () => {
      const response = await request(app).post("/auth/verify");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });
  });
});
