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
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const loggedInUser = await this.authService.login(email, password);
      res.status(200).json(loggedInUser);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}
