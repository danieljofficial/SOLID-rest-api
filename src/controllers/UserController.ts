import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  constructor(private userService: UserService) {}
  async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();
    res.status(200).json(users);
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await this.userService.getUserById(parseInt(id));
    res.status(200).json(user);
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const updatedUser = await this.userService.updateUser(
      parseInt(id),
      req.body
    );
    res.status(200).json(updatedUser);
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const isDeleted = await this.userService.deleteUser(parseInt(id));
    res.status(200).json({ success: isDeleted });
  }
}
