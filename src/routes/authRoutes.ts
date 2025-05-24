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

const authController = new AuthController(authService);

authRoutes.post("/register", authController.register.bind(authController));
authRoutes.post("/login", authController.login.bind(authController));
authRoutes.post("/verify", authController.verify.bind(authController));
export default authRoutes;
