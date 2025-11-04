/**
 * Custom Application Error Class
 * Extends the built-in Error class to provide additional context for error handling
 */
class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly status: string;

  /**
   * Creates a new AppError instance
   * @param statusCode - HTTP status code
   * @param message - Error message
   * @param isOperational - Whether this is an operational error (true) or a programming error (false)
   * @param stack - Optional stack trace
   */
  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = "",
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    // Set the prototype explicitly to maintain instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export default AppError;
