import { Document, Types } from 'mongoose';
import { UserRole } from '../../shared/constants';

export interface IUser {
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}
