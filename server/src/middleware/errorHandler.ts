import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors";

/**
 * Centralized error handling middleware
 * Catches all errors thrown in the application and formats the response
 */
export const errorHandler = (
  err: Error | BaseError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // If error is an instance of BaseError, it's already been logged
  if (err instanceof BaseError) {
    res.status(err.statusCode).json({
      error: err.message,
      stack: err.stack,
    });
    return;
  }

  // For unexpected errors, log them
  console.error("Unexpected Error:", err);

  // Send generic 500 error response
  res.status(500).json({
    error: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      message: err.message,
      stack: err.stack,
    }),
  });
};

/**
 * Async handler wrapper to automatically catch promise rejections
 * This mimics Express 5's built-in promise support for Express 4
 *
 * Usage: wrap async route handlers with this function
 * @example
 * router.get('/users', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void | Response>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
