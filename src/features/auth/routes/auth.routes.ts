import { Router } from 'express';
import { validateRequest } from '../../../shared/validators';
import { loginSchema, registerSchema } from '../dto';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

export function createAuthRoutes(
  controller: AuthController,
  middleware: AuthMiddleware
): Router {
  const router = Router();
  router.post(
    '/register',
    validateRequest(registerSchema),
    controller.register
  );
  router.post('/login', validateRequest(loginSchema), controller.login);
  router.post('/logout', middleware.authenticate, controller.logout);

  return router;
}
