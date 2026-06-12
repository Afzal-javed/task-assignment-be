import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { MongoServerError } from 'mongodb';
import { env } from '../../config/env';
import { AppException } from '../exceptions';
import { ApiResponse } from '../response';
import { logger } from '../logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppException) {
    ApiResponse.error(res, err.message, err.statusCode, err.errors);
    return;
  }

  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    ApiResponse.error(res, 'Validation failed', 400, errors);
    return;
  }

  if (err instanceof MongoServerError && err.code === 11000) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? 'field';
    ApiResponse.error(res, `${field} already exists`, 409);
    return;
  }

  logger.error(err.message, { stack: err.stack });

  const message =
    env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  ApiResponse.error(res, message, 500);
}
