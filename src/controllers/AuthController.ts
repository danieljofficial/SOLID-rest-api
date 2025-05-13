import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";

export class AuthController {
  constructor(private authService: AuthService) {}
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const newUser = await this.authService.register(name, email, password);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
