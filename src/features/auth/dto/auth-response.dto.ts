import { UserRole } from '../../../shared/constants';

export interface UserResponseDto {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponseDto {
  user: UserResponseDto;
  accessToken: string;
}
