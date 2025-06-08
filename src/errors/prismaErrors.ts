import { Prisma } from "../generated/prisma";
import { ConflictError, NotFoundError } from "./genericErrors";

export function handlePrismaError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      throw new NotFoundError("Resource Not Found!");
    }

    if (error.code === "2002") {
      throw new ConflictError("Product Already Exists!");
    }
  }
  throw error;
}
