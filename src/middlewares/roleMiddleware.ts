import { NextFunction, Request, Response } from "express";
import { IRoleService } from "../interfaces/role/IRoleService";
import {
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from "../errors/genericErrors";
import { roles } from "../utils/utils";

export class RoleMiddleware {
  constructor(private roleService: IRoleService) {}

  requireRole = (requiredRole: roles) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = (req as any).userId;
        if (!userId) {
          throw new UnauthorizedError("Authentication Required!");
        }

        const userRoles = await this.roleService.getUserRoles(userId);

        if (!userRoles.includes(requiredRole)) {
          throw new ForbiddenError("Insufficient Permissions!");
        }

        next();
      } catch (error) {
        throw new InternalServerError();
      }
    };
  };

  requireAnyRole(allowedRoles: roles[]) {
    return async (req: Request, res: Response) => {
      try {
        const userId = (req as any).userId;

        if (!userId) {
          throw new UnauthorizedError("Authentication Required!");
        }

        const userRoles = await this.roleService.getUserRoles(userId);

        const hasRequiredRoles = allowedRoles.some((role) =>
          userRoles.includes(role)
        );

        if (!hasRequiredRoles) {
          throw new ForbiddenError("Not Enough Privileges!");
        }
      } catch (error) {
        throw new InternalServerError();
      }
    };
  }
}
