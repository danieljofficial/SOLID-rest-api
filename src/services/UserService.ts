import { IUser } from "../interfaces/IUser";
import { IUserService } from "../interfaces/IUserService";
import { PrismaService } from "./prisma.service";
import { Prisma, PrismaClient } from "../generated/prisma/client";
import { NotFoundError } from "../errors/genericErrors";
import { handlePrismaError } from "../errors/prismaErrors";

export class UserService implements IUserService {
  constructor(private prismaService: PrismaService) {}
  private stripPassword(user: {
    id: number;
    email: string;
    name: string | null;
    password: string | null;
    createdAt: Date;
  }): IUser {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers(): Promise<IUser[]> {
    const users = await this.prismaService.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    return users;
  }

  async getUserById(id: number): Promise<IUser | null> {
    const user = await this.prismaService.prisma.user.findFirst({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    const userWithoutPassword = this.stripPassword(user);
    return userWithoutPassword;
  }

  async updateUser(
    id: number,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      const updatedUser = await this.prismaService.prisma.user.update({
        where: { id },
        data: userData,
      });
      const userWithoutPassword = this.stripPassword(updatedUser);
      return userWithoutPassword;
    } catch (error) {
      handlePrismaError(error);
      return null;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    const existingUser = await this.prismaService.prisma.user.findFirst({
      where: { id: id },
    });

    if (!existingUser) {
      throw new NotFoundError("Delete failed: user does not exist.");
    }

    const deletedUser = await this.prismaService.prisma.user.delete({
      where: { id },
    });

    if (!deletedUser) {
      return false;
    }

    return true;
  }
}
