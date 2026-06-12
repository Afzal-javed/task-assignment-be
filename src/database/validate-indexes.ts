import mongoose from 'mongoose';
import { logger } from '../shared/logger';

const REQUIRED_INDEXES: Record<string, string[]> = {
  users: ['email_1', 'idx_users_email_unique'],
  tasks: [
    'userId_1',
    'idx_tasks_userId',
    'idx_tasks_userId_status',
    'idx_tasks_userId_dueDate',
  ],
};

export async function validateIndexes(): Promise<void> {
  const db = mongoose.connection.db;
  if (!db) {
    logger.warn('Skipping index validation: database not connected');
    return;
  }

  for (const [collection, expectedIndexes] of Object.entries(REQUIRED_INDEXES)) {
    try {
      const indexes = await db.collection(collection).indexes();
      const indexNames = indexes.map((idx) => idx.name).filter(Boolean) as string[];

      const missing = expectedIndexes.filter(
        (name) => !indexNames.some((existing) => existing === name || existing.includes(name.replace('_1', '')))
      );

      if (missing.length > 0) {
        logger.warn(`Collection "${collection}" missing indexes: ${missing.join(', ')}`);
      } else {
        logger.info(`Index validation passed for "${collection}"`);
      }
    } catch (error) {
      logger.warn(`Index validation skipped for "${collection}": ${String(error)}`);
    }
  }
}
