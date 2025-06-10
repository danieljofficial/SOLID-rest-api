import { IAuthService } from "../interfaces/auth/IAuthService";
import { IAuthUser } from "../interfaces/auth/IAuthUser";
import { PrismaService } from "./prisma.service";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/genericErrors";
import { IRoleService } from "../interfaces/role/IRoleService";

export class AuthService implements IAuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtSecret: string,
    private saltRounds: number = 10,
    private roleService?: IRoleService
  ) {}

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  private async comparePasswords(plainText: string, hash: string) {
    return await bcrypt.compare(plainText, hash);
  }

  private generateToken(userid: number) {
    return jwt.sign(userid.toString(), this.jwtSecret);
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: Omit<IAuthUser, "password">; token: string }> {
    if (!name || !email || !password) {
      throw new BadRequestError("All Fields Required!");
    }

    const existingUser = await this.prismaService.prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError("Email Already Exists!");
    }

    const hashedPassword = await this.hashPassword(password);

    const result = await this.prismaService.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    if (this.roleService) {
      await this.roleService.assignRoleToUser(result.id, "viewer");
    }

    const token = this.generateToken(result.id);
    const { password: _, ...newUser } = result;
    return { user: newUser, token };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: Omit<IAuthUser, "password">; token: string }> {
    const user = await this.prismaService.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundError("User Not Found!");
    }

    if (!user.password) {
      throw new BadRequestError("Missing Password!");
    }

    const isValid = await this.comparePasswords(password, user.password);

    if (!isValid) {
      throw new UnauthorizedError("Invalid Password!");
    }

    const token = this.generateToken(user.id);

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async verifyToken(token: string): Promise<{ userId: number }> {
    try {
      const decodedToken = jwt.verify(token, this.jwtSecret);
      const parsedToken = parseInt(decodedToken as string);
      return { userId: parsedToken };
    } catch (error) {
      throw new UnauthorizedError(`Invalid Token: ${error}`);
    }
  }
}
