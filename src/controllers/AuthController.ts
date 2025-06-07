import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";
import { BadRequestError, UnauthorizedError } from "../errors/genericErrors";

export class AuthController {
  constructor(private authService: AuthService) {}
  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const newUser = await this.authService.register(name, email, password);
    res.status(201).json(newUser);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const loggedInUser = await this.authService.login(email, password);
    res.status(200).json(loggedInUser);
  }

  async verify(req: Request, res: Response) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("No token provided!");
    }
    const { userId } = await this.authService.verifyToken(token);
    res.status(200).json({ userId });
  }
}
