import { PrismaClient } from "../generated/prisma/client";

export class PrismaService {
  private static instance: PrismaService;
  public prisma: PrismaClient;

  private constructor() {
    try {
      this.prisma = new PrismaClient();
    } catch (error) {
      console.error(
        "Failed to initialize Prisma Client. Did you run `prisma generate`?"
      );
      throw error;
    }
  }

  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }

  async connect() {
    await this.prisma.$connect();
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}

const prismaService = PrismaService.getInstance();

export default prismaService;
