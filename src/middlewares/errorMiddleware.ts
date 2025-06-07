import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import {
  InvalidCredentialsError,
  MissingPasswordError,
  UserNotFoundError,
} from "../errors/authErrors";
import "dotenv/config";
import { AppError } from "../errors/genericErrors";
import { TokenExpiredError } from "jsonwebtoken";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof TokenExpiredError) {
    statusCode = 401;
    message = "Token expired";
  }

  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === "development") {
    console.error(`[${new Date().toISOString()}] Error:`, {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
    });
  }

  res.status(statusCode).json(response);
};
