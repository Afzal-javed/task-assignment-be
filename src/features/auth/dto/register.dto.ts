import { z } from 'zod';
import { VALIDATION } from '../../../shared/constants';

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(
      VALIDATION.USER.FULL_NAME.MIN_LENGTH,
      `Full name must be at least ${VALIDATION.USER.FULL_NAME.MIN_LENGTH} characters`
    )
    .max(VALIDATION.USER.FULL_NAME.MAX_LENGTH),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .regex(VALIDATION.USER.EMAIL_REGEX, 'Invalid email format'),
  password: z
    .string()
    .min(
      VALIDATION.USER.PASSWORD.MIN_LENGTH,
      `Password must be at least ${VALIDATION.USER.PASSWORD.MIN_LENGTH} characters`
    )
    .max(VALIDATION.USER.PASSWORD.MAX_LENGTH),
});

export type RegisterDto = z.infer<typeof registerSchema>;
