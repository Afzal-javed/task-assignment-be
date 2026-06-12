import { Router } from 'express';
import { AuthController } from './controllers/auth.controller';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UserRepository } from './repositories/user.repository';
import { TokenRepository } from './repositories/token.repository';
import { AuthService } from './services/auth.service';
import { JwtService } from './services/jwt.service';
import { PasswordService } from './services/password.service';
import { createAuthRoutes } from './routes/auth.routes';

// ─── Dependency Injection Container ──────────────────────────────────────────
const userRepository = new UserRepository();
const tokenRepository = new TokenRepository();
const jwtService = new JwtService();
const passwordService = new PasswordService();

export const authService = new AuthService(
  userRepository,
  tokenRepository,
  jwtService,
  passwordService
);

export const authMiddleware = new AuthMiddleware(jwtService, tokenRepository);
export const authController = new AuthController(authService);

export const authRouter: Router = createAuthRoutes(
  authController,
  authMiddleware
);
