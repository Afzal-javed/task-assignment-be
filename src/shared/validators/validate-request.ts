import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { BadRequestException } from '../exceptions';

export type RequestPart = 'body' | 'query' | 'params';

export function validateRequest(
  schema: ZodSchema,
  part: RequestPart = 'body'
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      next(new BadRequestException('Validation failed', errors));
      return;
    }

    req[part] = result.data;
    next();
  };
}
