import bcrypt from 'bcryptjs';
import { env } from '../../../config/env';

export class PasswordService {
  async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, env.BCRYPT_SALT_ROUNDS);
  }

  async compare(plainPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, passwordHash);
  }
}
