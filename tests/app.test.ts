import createApp from "../src/app";
import request from "supertest";

describe("Express app", () => {
  it("Should respond with a message on GET /", async () => {
    const app = createApp();
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual("Hello from Express with TypeScript!");
  });

  //   it("Confirms database setup by returning  an empty array of users", async () => {
  //     const app = createApp();
  //     const response = await request(app).get("/users");

  //     expect(response.statusCode).toBe(200);
  //     expect(response.body).toBe([]);
  //   });
});
