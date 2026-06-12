import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../../../shared/exceptions';
import { JwtService } from '../services/jwt.service';
import { TokenRepository } from '../repositories/token.repository';

export class AuthMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository
  ) {}

  authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedException('Access token is required');
      }

      const token = authHeader.slice(7);

      const isBlacklisted = await this.tokenRepository.isBlacklisted(token);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }

      const payload = this.jwtService.verify(token);
      req.user = payload;
      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        next(error);
        return;
      }
      next(new UnauthorizedException('Invalid or expired token'));
    }
  };
}
