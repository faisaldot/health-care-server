import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  // biome-ignore lint/suspicious/noExplicitAny: <>
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const success = false;
  const message = err.message || "Something went wrong!";

  // Extract only serializable properties to avoid circular structure
  const error = {
    name: err.name,
    message: err.message,
    ...(err.stack &&
      process.env.NODE_ENV === "development" && { stack: err.stack }),
    ...(err.errors && { errors: err.errors }),
    ...(err.code && { code: err.code }),
    ...(err.statusCode && { statusCode: err.statusCode }),
  };

  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
