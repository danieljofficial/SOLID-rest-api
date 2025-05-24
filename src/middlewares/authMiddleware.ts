import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../interfaces/IAuthService";

export class AuthMiddleware {
  constructor(private authService: IAuthService) {}
  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Authentication required");
      }
      const { userId } = await this.authService.verifyToken(token);

      (req as any).userId = userId;
      next();
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };
}
