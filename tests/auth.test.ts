import request from "supertest";
import createApp from "../src/app";

describe("Authentication tests", () => {
  let app = createApp();
  it("Should authenticate and create a new user", async () => {
    function generateEmail() {
      const letters = "abcdefghijklmnop";
      let result = "";
      for (let i = 0; i < 5; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
      }
      return `${result}@example.com`;
    }
    const testData = {
      email: generateEmail(),
      name: "Test User",
      password: "ABCabc123!",
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

  // it("Should login an existing user", async () => {

  // })
});
