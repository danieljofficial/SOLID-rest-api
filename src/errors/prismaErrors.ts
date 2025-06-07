import { Prisma } from "../generated/prisma";
import { NotFoundError } from "./genericErrors";

export function handlePrismaError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      throw new NotFoundError("Resource not found");
    }
  }
  throw error;
}
