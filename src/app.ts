import express from "express";
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import router from "./routes/userRoutes";

// import prisma from "./prisma/prisma.service";

function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Hello from Express with TypeScript!");
  });

  // const prisma = new PrismaClient();

  // app.get("/users", async (req, res) => {
  //   const users = await prisma.user.findMany();
  //   const response = res.json(users);
  //   // console.log(response);
  // });

  app.use("/users", router);

  return app;
}

export default createApp;
