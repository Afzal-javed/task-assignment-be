import { UserModel } from '../../../database/models';
import { IUserDocument } from '../../../database/interfaces';
import {
  CreateUserData,
  IUserRepository,
} from '../interfaces';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() });
  }

  async findByEmailWithPassword(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase(), isActive: true }).select(
      '+passwordHash'
    );
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id);
  }

  async create(data: CreateUserData): Promise<IUserDocument> {
    return UserModel.create({
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
    });
  }
}
