import express from "express";
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

// import prisma from "./prisma/prisma.service";

function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Hello from Express with TypeScript!");
  });

  app.use("/users", userRoutes);
  app.use("/auth", authRoutes);

  return app;
}

export default createApp;
