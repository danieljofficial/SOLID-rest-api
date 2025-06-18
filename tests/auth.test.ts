import request from "supertest";
import createApp from "../src/app";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import { cleanupTestUsers, registerTestUser } from "./testUtils";

describe("Authentication tests", () => {
  let app = createApp();

  const createTestUserData: () => {
    email: String;
    name?: String;
    password: String;
  } = () => ({
    email: `${uuidv4()}@test.com`,
    name: "Test User",
    password: process.env.TEST_USER_PASSWORD || "securepassword123",
  });

  afterEach(cleanupTestUsers);

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
      expect(response.body.message).toBe("All Fields Required!");
    });
  });

  describe("POST /auth/login", () => {
    it("should authenticate with valid credentials (200)", async () => {
      const user = await registerTestUser();

      const response = await request(app).post("/auth/login").send({
        email: user.email,
        password: "testpassword123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token: expect.any(String),
        user: {
          id: expect.any(Number),
          email: user.email,
          name: user.name,
          createdAt: expect.any(String),
        },
      });
    });

    it("should reject login with invalid password (401)", async () => {
      const user = await registerTestUser();

      const response = await request(app).post("/auth/login").send({
        email: user.email,
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid Password!");
    });

    it("should reject login with non-existent email", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "nonexistent@test.com",
        password: "anypassword",
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User Not Found!");
    });
  });

  describe("POST /auth/verify", () => {
    it("should verify a valid JWT token (200)", async () => {
      const user = await registerTestUser();

      const response = await request(app)
        .post("/auth/verify")
        .set("Authorization", `Bearer ${user.token}`);

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
      expect(response.body.success).toBe(false);
    });

    it("should reject verification with missing token (401)", async () => {
      const response = await request(app).post("/auth/verify");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("No token provided!");
    });
  });
});
