import { v4 as uuidv4 } from "uuid";
import createApp from "../src/app";
import request, { Test } from "supertest";
type TestUser = {
  id: string;
  token: string;
  email: string;
  name: string;
};

const testUsers: TestUser[] = [];

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export const registerTestUser = async () => {
  const testData = {
    email: `${uuidv4()}@test.com`,
    name: "Test user",
    password: "testpassword123",
  };

  const app = createApp();
  const response = await request(app).post("/auth/register").send(testData);

  const user = {
    id: response.body.user.id,
    token: response.body.token,
    email: testData.email,
    name: testData.name,
  };

  testUsers.push(user);
  return user;
};

export const cleanupTestUsers = async () => {
  const app = createApp();
  await Promise.all(
    testUsers.map((user) =>
      request(app)
        .delete(`/users/${user.id}`)
        .set("Authorization", `Bearer ${user.token}`)
        .catch((e) => console.error("Cleanup failed:", e))
    )
  );
  testUsers.length = 0;
};

export const getAuthenticatedRequest = (user: TestUser) => {
  const app = createApp();
  const agent = request(app);
  return (method: HttpMethod, url: string): Test => {
    return agent[method](url).set("Authorization", `Bearer ${user.token}`);
  };
};
