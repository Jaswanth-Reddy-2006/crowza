import { Request, Response, NextFunction } from 'express';

export interface ErrorResponse {
  error: string;
  details?: string;
  timestamp: string;
  path: string;
}

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = (err as any).status || 500;
  const message = err.message || 'Internal Server Error';

  const errorResponse: ErrorResponse = {
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = err.stack;
  }

  console.error([] , err);
  res.status(status).json(errorResponse);
}

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const error = new Error(`Not Found - ${req.method} ${req.path}`);
  (error as any).status = 404;
  next(error);
}
