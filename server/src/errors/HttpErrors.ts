import { BaseError } from "./BaseError";

/**
 * 400 Bad Request Error
 * Used when the client sends invalid data or malformed requests
 */
export class BadRequestError extends BaseError {
  constructor(message = "Bad Request") {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

/**
 * 401 Unauthorized Error
 * Used when authentication is required but not provided or invalid
 */
export class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

/**
 * 403 Forbidden Error
 * Used when the user is authenticated but doesn't have permission
 */
export class ForbiddenError extends BaseError {
  constructor(message = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

/**
 * 404 Not Found Error
 * Used when a requested resource doesn't exist
 */
export class NotFoundError extends BaseError {
  constructor(message = "Resource Not Found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

/**
 * 409 Conflict Error
 * Used when a request conflicts with current state (e.g., duplicate records)
 */
export class ConflictError extends BaseError {
  constructor(message = "Conflict") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

/**
 * 500 Internal Server Error
 * Used for unexpected server errors
 */
export class InternalServerError extends BaseError {
  constructor(message = "Internal Server Error", isOperational = false) {
    super(message, 500, isOperational);
    this.name = "InternalServerError";
  }
}
