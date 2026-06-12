import { TokenBlacklistModel } from '../../../database/models';
import { ITokenRepository } from '../interfaces';

export class TokenRepository implements ITokenRepository {
  async blacklist(token: string, expiresAt: Date): Promise<void> {
    await TokenBlacklistModel.updateOne(
      { token },
      { $setOnInsert: { token, expiresAt } },
      { upsert: true }
    );
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const entry = await TokenBlacklistModel.findOne({ token }).lean();
    return entry !== null;
  }
}
