import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../../config/env';
import { JwtPayload } from '../interfaces';

export class JwtService {
  sign(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    const options: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
      subject: payload.sub,
    };
    return jwt.sign(
      { email: payload.email, role: payload.role },
      env.JWT_SECRET,
      options
    );
  }

  verify(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  }

  getExpirationDate(token: string): Date {
    const decoded = jwt.decode(token) as JwtPayload | null;
    if (!decoded?.exp) {
      return new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
    return new Date(decoded.exp * 1000);
  }
}
