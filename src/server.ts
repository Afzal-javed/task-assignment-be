import mongoose from 'mongoose';
import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './database';
import { validateIndexes } from './database/validate-indexes';
import { logger } from './shared/logger';

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await validateIndexes();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
    logger.info(`Swagger docs: http://localhost:${env.PORT}/api/docs`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      logger.info('HTTP server closed');
      logger.info('MongoDB disconnected');
      process.exit(0);
    });
    setTimeout(() => {
      logger.error('Forced shutdown');
      process.exit(1);
    }, 5000);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error(`Unhandled Rejection: ${String(reason)}`);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    process.exit(1);
  });
}

bootstrap().catch((error: Error) => {
  logger.error(`Failed to start server: ${error.message}`);
  process.exit(1);
});
