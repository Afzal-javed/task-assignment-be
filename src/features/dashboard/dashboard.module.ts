import { Router } from 'express';
import { authMiddleware } from '../auth/auth.module';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardRepository } from './repositories/dashboard.repository';
import { DashboardService } from './services/dashboard.service';
import { createDashboardRoutes } from './routes/dashboard.routes';

const dashboardRepository = new DashboardRepository();
const dashboardService = new DashboardService(dashboardRepository);
const dashboardController = new DashboardController(dashboardService);

export const dashboardRouter: Router = createDashboardRoutes(
  dashboardController,
  authMiddleware
);
