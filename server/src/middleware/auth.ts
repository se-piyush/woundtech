import { Request, Response, NextFunction } from "express";
import { AuthService } from "../modules/auth/auth.service";
import { AuthRepository } from "../modules/auth/auth.repository";
import { UnauthorizedError, ForbiddenError } from "../errors";
import { UserRole } from "@prisma/client";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

/**
 * Middleware to authenticate JWT token
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = authService.verifyToken(token);

    req.user = decoded;
    next();
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError("Invalid or expired token");
  }
};

/**
 * Middleware to check if user has required role(s)
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        "You do not have permission to access this resource",
      );
    }

    next();
  };
};

/**
 * Middleware to allow super user to access all APIs
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  authenticate(req, res, (err?: any) => {
    if (err) {
      return next(err);
    }

    if (req.user?.role === UserRole.SUPER) {
      return next();
    }
    next();
  });
};
