import { IUserDocument } from '../../../database/interfaces';

export interface CreateUserData {
  fullName: string;
  email: string;
  passwordHash: string;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<IUserDocument | null>;
  findByEmailWithPassword(email: string): Promise<IUserDocument | null>;
  findById(id: string): Promise<IUserDocument | null>;
  create(data: CreateUserData): Promise<IUserDocument>;
}
