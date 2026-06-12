import { JwtPayload } from '../../features/auth/interfaces';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
