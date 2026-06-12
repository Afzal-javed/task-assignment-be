import mongoose, { Schema } from 'mongoose';
import { UserRole, VALIDATION, COLLECTIONS } from '../../shared/constants';
import { IUserDocument } from '../interfaces';

const userSchema = new Schema<IUserDocument>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [
        VALIDATION.USER.FULL_NAME.MIN_LENGTH,
        `Full name must be at least ${VALIDATION.USER.FULL_NAME.MIN_LENGTH} characters`,
      ],
      maxlength: [
        VALIDATION.USER.FULL_NAME.MAX_LENGTH,
        `Full name cannot exceed ${VALIDATION.USER.FULL_NAME.MAX_LENGTH} characters`,
      ],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        VALIDATION.USER.EMAIL_REGEX,
        'Please provide a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(UserRole),
        message: 'Role must be either user or admin',
      },
      default: UserRole.USER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTIONS.USERS,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.index({ email: 1 }, { unique: true, name: 'idx_users_email_unique' });
userSchema.index({ email: 1, isActive: 1 }, { name: 'idx_users_email_isActive' });

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
