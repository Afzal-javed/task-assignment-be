import { HttpStatusCode } from '../constants';

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export class AppException extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly isOperational: boolean;
  public readonly errors?: ValidationErrorDetail[];

  constructor(
    message: string,
    statusCode: HttpStatusCode,
    errors?: ValidationErrorDetail[],
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestException extends AppException {
  constructor(message = 'Bad request', errors?: ValidationErrorDetail[]) {
    super(message, 400, errors);
  }
}

export class UnauthorizedException extends AppException {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenException extends AppException {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundException extends AppException {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictException extends AppException {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

export class InternalServerException extends AppException {
  constructor(message = 'Internal server error') {
    super(message, 500, undefined, false);
  }
}
