import mongoose, { Document, Schema } from 'mongoose';
import { COLLECTIONS } from '../../shared/constants';

export interface ITokenBlacklistDocument extends Document {
  token: string;
  expiresAt: Date;
}

const tokenBlacklistSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    collection: COLLECTIONS.TOKEN_BLACKLIST,
    timestamps: false,
  }
);

export const TokenBlacklistModel = mongoose.model(
  'TokenBlacklist',
  tokenBlacklistSchema
);
