import { z } from 'zod';
import { TaskStatus, VALIDATION } from '../../../shared/constants';

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(VALIDATION.TASK.TITLE.MIN_LENGTH)
      .max(VALIDATION.TASK.TITLE.MAX_LENGTH)
      .optional(),
    description: z
      .string()
      .trim()
      .max(VALIDATION.TASK.DESCRIPTION.MAX_LENGTH)
      .optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    dueDate: z.coerce.date().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
