import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import {
  InvalidCredentialsError,
  MissingPasswordError,
  UserNotFoundError,
} from "../errors/authErrors";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof UserNotFoundError) {
    res.status(404).json({ error: err.message });
    return;
  }

  if (
    err instanceof InvalidCredentialsError ||
    err instanceof MissingPasswordError
  ) {
    res.status(401).json({ error: err.message });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
};
