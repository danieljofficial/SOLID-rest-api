import { IUser } from "../interfaces/IUser";
import { IUserService } from "../interfaces/IUserService";
import { PrismaService } from "./prisma.service";
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
  // async createUser(
  //   userData: Omit<IUser, "id" | "createdAt">
  // ): Promise<Omit<IUser, "password" >> {
  //   const existingUser = await this.prismaService.prisma.user.findUnique({
  //     where: { email: userData.email },
  //   });

  //   if (existingUser) {
  //     throw new Error("User already exists!");
  //   }

  //   const user = await this.prismaService.prisma.user.create({
  //     data: userData,
  //   });
  //   const result = this.stripPassword(user);
  //   return result;
  // }

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
      throw new Error("User does not exist");
    }

    const userWithoutPassword = this.stripPassword(user);
    return userWithoutPassword;
  }

  async updateUser(
    id: number,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    const existingUser = await this.prismaService.prisma.user.findFirst({
      where: { id: id },
    });

    if (!existingUser) {
      throw new Error("Update failed: user does not exist.");
    }

    const updatedUser = await this.prismaService.prisma.user.update({
      where: { id },
      data: userData,
    });

    const userWithoutPassword = this.stripPassword(updatedUser);
    return userWithoutPassword;
  }

  async deleteUser(id: number): Promise<boolean> {
    const existingUser = await this.prismaService.prisma.user.findFirst({
      where: { id: id },
    });

    if (!existingUser) {
      throw new Error("Delete failed: user does not exist.");
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
