import { Router } from "express";
import { UserService } from "../services/UserService";
import prismaService from "../services/prisma.service";
import { UserController } from "../controllers/UserController";

const userRoutes = Router();
const userService = new UserService(prismaService);
const userController = new UserController(userService);

userRoutes.post("/", userController.createUser.bind(userController));
userRoutes.get("/", userController.getAllUsers.bind(userController));
userRoutes.get("/:id", userController.getUserById.bind(userController));
userRoutes.patch("/:id", userController.updateUser.bind(userController));
userRoutes.delete("/:id", userController.deleteUser.bind(userController));
export default userRoutes;
