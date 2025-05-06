import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  constructor(private userService: UserService) {}
  async createUser(req: Request, res: Response) {
    try {
      const users = await this.userService.createUser(req.body);
      res.status(201).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.body.id);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
