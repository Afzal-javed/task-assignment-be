import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './shared/middleware/error-handler';
import { notFoundHandler } from './shared/middleware/not-found';
import { requestLogger } from './shared/middleware/request-logger';
import { globalRateLimiter, authRateLimiter } from './shared/middleware/rate-limiter';
import { authRouter } from './features/auth/auth.module';
import { taskRouter } from './features/tasks/tasks.module';
import { dashboardRouter } from './features/dashboard/dashboard.module';

export function createApp(): Application {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(compression());
  app.use(globalRateLimiter);
  app.use(
    cors({
      origin:
        env.CORS_ORIGIN === '*'
          ? '*'
          : env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(requestLogger);

  app.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      data: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
    });
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/auth', authRateLimiter, authRouter);
  app.use('/api/dashboard', dashboardRouter);
  app.use('/api/tasks', taskRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
