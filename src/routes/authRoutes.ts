import { Router } from "express";
import { AuthService } from "../services/AuthService";
import prismaService from "../services/prisma.service";

import "dotenv/config";
import { AuthController } from "../controllers/AuthController";
const authRoutes = Router();

const authService = new AuthService(
  prismaService,
  process.env.JWT_SECRET as string
);

const userController = new AuthController(authService);

authRoutes.post("/register", userController.register.bind(userController));
export default authRoutes;
