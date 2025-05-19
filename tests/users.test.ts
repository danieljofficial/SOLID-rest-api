import request from "supertest";
import createApp from "../src/app";
import "dotenv/config";

describe("User API", () => {
  let app = createApp();

  function generateRandomEmail() {
    const letters = "abcdefghijklmnop";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return `${result}@example.com`;
  }

  it("should get a user by their id", async () => {
    const email = generateRandomEmail();
    const testData = {
      email: email,
      name: "Test user",
      password: process.env.PASSWORD,
    };
    const registrationResponse = await request(app)
      .post("/auth/register")
      .send(testData);
    const userId = registrationResponse.body.user.id;
    const getUserResponse = await request(app).get(`/users/${userId}`);
    const { password: _, ...expectedResult } = testData;
    expect(getUserResponse.statusCode).toBe(200);
    expect(getUserResponse.body).toMatchObject(expectedResult);
    await request(app).delete(`/users/${userId}`);
  });

  it("should return an array of users", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    response.body.forEach((user: any) => {
      expect(typeof user.email).toBe("string");
    });
  });

  it("should update an existing user", async () => {
    const email = generateRandomEmail();
    const testData = {
      email: email,
      name: "Test user",
      password: process.env.PASSWORD,
    };
    const registrationResponse = await request(app)
      .post("/auth/register")
      .send(testData);
    const userId = registrationResponse.body.user.id;
    const response = await request(app).patch(`/users/${userId}`).send({
      name: "updated name",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual("updated name");
    await request(app).delete(`/users/${userId}`);
  });

  it("should delete an existing user", async () => {
    const email = generateRandomEmail();
    const testData = {
      email: email,
      name: "Test user",
      password: process.env.PASSWORD,
    };
    const registrationResponse = await request(app)
      .post("/auth/register")
      .send(testData);
    const userId = registrationResponse.body.user.id;
    const response = await request(app).delete(`/users/${userId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
