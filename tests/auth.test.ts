import request from "supertest";
import createApp from "../src/app";
import "dotenv/config";

describe("Authentication tests", () => {
  let app = createApp();
  function generateEmail() {
    const letters = "abcdefghijklmnop";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return `${result}@example.com`;
  }
  it("Should authenticate and create a new user", async () => {
    const testData = {
      email: generateEmail(),
      name: "Test User",
      password: process.env.PASSWORD,
    };

    const response = await request(app).post("/auth/register").send(testData);

    if (response.statusCode !== 201) {
      console.error("Test failed with:", {
        status: response.statusCode,
        body: response.body,
        headers: response.headers,
      });
    }

    expect(response.statusCode).toBe(201);
    const { id, createdAt, ...result } = response.body.user;
    expect(result).toMatchObject({
      email: testData.email,
      name: testData.name,
    });
  });

  it("Should login an existing user", async () => {
    const { body } = await request(app).get("/users");
    const email = body[10].email;
    const expectedId = body[10].id;
    const testData = {
      email,
      password: process.env.PASSWORD,
    };

    const response = await request(app).post("/auth/login").send(testData);
    expect(expectedId).toEqual(response.body.user.id);
  });
});
