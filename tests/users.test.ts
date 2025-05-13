import request from "supertest";
import createApp from "../src/app";

describe("User API", () => {
  let app = createApp();

  function generateEmail() {
    const letters = "abcdefghijklmnop";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return `${result}@example.com`;
  }

  it("should get a user by their id", async () => {
    const email = generateEmail();
    const { body } = await request(app)
      .post("/users")
      .send({ email: email, name: "newUser" });
    const response = await request(app).get(`/users/${body.id}`);
    expect(response.statusCode).toBe(200);
    expect(typeof response.body.email).toBe("string");
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
    const email = generateEmail();
    const response = await request(app).post("/users").send({
      email: email,
      name: "Test User",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toEqual(email);
  });

  it("should update an existing user", async () => {
    const response = await request(app).patch("/users/6").send({
      name: "updated name",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual("updated name");
  });

  it("should delete an existing user", async () => {
    const email = generateEmail();
    const { body } = await request(app)
      .post("/users")
      .send({ email: email, name: "newUser" });
    const response = await request(app).delete(`/users/${body.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
