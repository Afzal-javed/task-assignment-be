import { Response } from 'express';
import { HttpStatusCode } from '../constants';

export interface ApiResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ApiResponseBody<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: ApiResponseMeta;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode: HttpStatusCode = 200,
    meta?: ApiResponseMeta
  ): Response {
    const body: ApiResponseBody<T> = {
      success: true,
      message,
      data,
    };

    if (meta) {
      body.meta = meta;
    }

    return res.status(statusCode).json(body);
  }

  static created<T>(
    res: Response,
    data: T,
    message = 'Resource created successfully'
  ): Response {
    return ApiResponse.success(res, data, message, 201);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static error(
    res: Response,
    message: string,
    statusCode: HttpStatusCode = 500,
    errors?: { field: string; message: string }[]
  ): Response {
    const body: ApiResponseBody = {
      success: false,
      message,
      data: null,
    };

    if (errors && errors.length > 0) {
      return res.status(statusCode).json({ ...body, errors });
    }

    return res.status(statusCode).json(body);
  }
}
