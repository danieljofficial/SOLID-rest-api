import { kMaxLength } from "buffer";
import { IRoleService } from "../interfaces/IRoleService";
import { PrismaService } from "./prisma.service";

export class RoleService implements IRoleService {
  constructor(private prismaService: PrismaService) {}
  async assignRoleToUser(userId: number, roleName: string): Promise<boolean> {
    const role = await this.prismaService.prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      throw new Error("Role not found");
    }

    const userRole = await this.prismaService.prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId: role.id } },
      update: {},
      create: { userId, roleId: role.id },
    });

    return true;
  }

  async getUserRoles(userId: number): Promise<string[]> {
    const userRoles = await this.prismaService.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
    return userRoles.map((ur) => ur.role.name);
  }

  async hasPermission(
    userId: number,
    requiredPermission: string
  ): Promise<boolean> {
    const userRoles = await this.prismaService.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });

    return userRoles.some((ur) =>
      ur.role.permissions.includes(requiredPermission)
    );
  }
}
