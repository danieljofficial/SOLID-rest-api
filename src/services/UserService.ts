import { IUser } from "../interfaces/IUser";
import { IUserService } from "../interfaces/IUserService";
import { PrismaService } from "./prisma.service";
export class UserService implements IUserService {
  constructor(private prismaService: PrismaService) {}
  async createUser(userData: Omit<IUser, "id" | "createdAt">): Promise<IUser> {
    const existingUser = await this.prismaService.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error("User already exists!");
    }

    const user = await this.prismaService.prisma.user.create({
      data: userData,
    });
    return user;
  }
  async getAllUsers(): Promise<IUser[]> {
    const users = await this.prismaService.prisma.user.findMany();
    return users;
  }
  async getUserById(id: number): Promise<IUser | null> {
    const user = await this.prismaService.prisma.user.findFirst({
      where: { id: id },
    });

    if (!user) {
      throw new Error("User does not exist");
    }
    return user;
  }
  updateUser(id: number, userData: Partial<IUser>): Promise<IUser | null> {
    throw new Error("Method not implemented.");
  }
  deleteUser(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
