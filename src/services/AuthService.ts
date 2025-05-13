import { IAuthService } from "../interfaces/IAuthService";
import { IAuthUser } from "../interfaces/IAuthUser";
import { PrismaService } from "./prisma.service";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class AuthService implements IAuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtSecret: string,
    private saltRounds: number = 10
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
      throw new Error("All fields are required");
    }

    const existingUser = await this.prismaService.prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already esxists.");
    }

    const hashedPassword = await this.hashPassword(password);

    const result = await this.prismaService.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const token = this.generateToken(result.id);
    const { password: _, ...newUser } = result;
    return { user: newUser, token };
  }

  login(
    email: string,
    password: string
  ): Promise<{ user: Omit<IAuthUser, "password">; token: string }> {
    throw new Error("Method not implemented.");
  }
  verifyToken(token: string): Promise<{ userId: number }> {
    throw new Error("Method not implemented.");
  }
}
