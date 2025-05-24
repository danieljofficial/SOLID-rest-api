import express from "express";
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import { AuthMiddleware } from "./middlewares/authMiddleware";
import { AuthService } from "./services/AuthService";
import prismaService from "./services/prisma.service";
import "dotenv/config";
import { errorHandler } from "./middlewares/errorMiddleware";

const authService = new AuthService(
  prismaService,
  process.env.JWT_SECRET as string
);
const authMiddleware = new AuthMiddleware(authService);
function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Hello from Express with TypeScript!");
  });

  app.use("/users", authMiddleware.authenticate, userRoutes);
  app.use("/auth", authRoutes);

  app.use(errorHandler);
  return app;
}

export default createApp;
