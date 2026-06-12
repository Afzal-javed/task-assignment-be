import { z } from 'zod';

export const taskIdSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid task ID'),
});

export type TaskIdDto = z.infer<typeof taskIdSchema>;
