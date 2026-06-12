import { Request, Response } from 'express';
import { ApiResponse } from '../response';

export function notFoundHandler(req: Request, res: Response): void {
  ApiResponse.error(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
}
