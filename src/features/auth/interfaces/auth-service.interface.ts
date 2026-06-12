import {
  AuthResponseDto,
  LoginDto,
  LogoutDto,
  RegisterDto,
} from '../dto';

export interface IAuthService {
  register(dto: RegisterDto): Promise<AuthResponseDto>;
  login(dto: LoginDto): Promise<AuthResponseDto>;
  logout(dto: LogoutDto): Promise<void>;
}
