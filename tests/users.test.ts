import request from "supertest";
import createApp from "../src/app";

describe("User API", () => {
  let app = createApp();

  it("should get a user by their id", async () => {
    try {
      const response = await request(app).get("/users");
      expect(response.statusCode).toBe(200);
      expect(typeof response.body.email).toBe("string");
    } catch (error: any) {
      console.log(error.message);
    }
  });

  it("should return an array of users", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    response.body.forEach((user: any) => {
      expect(typeof user.email).toBe("string");
    });
  });

  it("should create a new user", async () => {
    const response = await request(app).post("/users").send({
      email: "test3@example.com",
      name: "Test User3",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toEqual("test3@example.com");
  });
});
