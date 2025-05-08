import { Router } from "express";
import { UserService } from "../services/UserService";
import prismaService from "../services/prisma.service";
import { UserController } from "../controllers/UserController";

const router = Router();
const userService = new UserService(prismaService);
const userController = new UserController(userService);

router.post("/", userController.createUser.bind(userController));
router.get("/", userController.getAllUsers.bind(userController));
router.get("/:id", userController.getUserById.bind(userController));
router.patch("/:id", userController.updateUser.bind(userController));
router.delete("/:id", userController.deleteUser.bind(userController));
export default router;
