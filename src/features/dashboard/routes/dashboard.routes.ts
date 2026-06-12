import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { AuthMiddleware } from '../../auth/middleware/auth.middleware';

export function createDashboardRoutes(
  controller: DashboardController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  router.use(authMiddleware.authenticate);

  /**
   * @openapi
   * /api/dashboard/stats:
   *   get:
   *     tags: [Dashboard]
   *     summary: Get dashboard statistics
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dashboard stats retrieved successfully
   */
  router.get('/stats', controller.getStats);

  return router;
}
