import { NextFunction, Request, Response } from "express";
import { IRoleService } from "../interfaces/role/IRoleService";
import { ForbiddenError, UnauthorizedError } from "../errors/genericErrors";

export class RoleMiddleware {
  constructor(private roleService: IRoleService) {}

  checkPermission = (requiredPermission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = (req as any).userId;
        if (!userId) {
          throw new UnauthorizedError("Authentication required");
        }

        const hasPermission = await this.roleService.hasPermission(
          userId,
          requiredPermission
        );

        if (!hasPermission) {
          throw new ForbiddenError("Insufficient permissions");
        }

        next();
      } catch (error) {
        throw new ForbiddenError("Forbidden");
      }
    };
  };
}
