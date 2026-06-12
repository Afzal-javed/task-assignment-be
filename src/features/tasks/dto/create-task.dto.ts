import { z } from 'zod';
import { TaskStatus, VALIDATION } from '../../../shared/constants';

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(VALIDATION.TASK.TITLE.MIN_LENGTH, 'Title is required')
    .max(VALIDATION.TASK.TITLE.MAX_LENGTH),
  description: z
    .string()
    .trim()
    .max(VALIDATION.TASK.DESCRIPTION.MAX_LENGTH)
    .optional()
    .default(''),
  status: z.nativeEnum(TaskStatus).optional().default(TaskStatus.PENDING),
  dueDate: z.coerce.date().optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
