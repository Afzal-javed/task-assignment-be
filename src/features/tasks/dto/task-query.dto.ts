import { z } from 'zod';
import { TaskStatus } from '../../../shared/constants';

export const taskQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  status: z.nativeEnum(TaskStatus).optional(),
  search: z.string().trim().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type TaskQueryDto = z.infer<typeof taskQuerySchema>;
