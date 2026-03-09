export abstract class BaseError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly
    Object.setPrototypeOf(this, new.target.prototype);

    // Log the error
    this.logError();
  }

  protected logError(): void {
    const timestamp = new Date().toISOString();
    const errorLog = {
      timestamp,
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      stack: this.stack,
      isOperational: this.isOperational,
    };

    if (this.statusCode >= 500) {
      console.error("[ERROR]", JSON.stringify(errorLog, null, 2));
    } else {
      console.warn("[WARNING]", JSON.stringify(errorLog, null, 2));
    }
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      ...(process.env.NODE_ENV === "development" && { stack: this.stack }),
    };
  }
}
