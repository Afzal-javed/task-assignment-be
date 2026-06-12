import { IUserDocument } from '../../../database/interfaces';
import {
  ConflictException,
  UnauthorizedException,
} from '../../../shared/exceptions';
import {
  AuthResponseDto,
  LoginDto,
  LogoutDto,
  RegisterDto,
  UserResponseDto,
} from '../dto';
import { IAuthService } from '../interfaces';
import { UserRepository } from '../repositories/user.repository';
import { TokenRepository } from '../repositories/token.repository';
import { JwtService } from './jwt.service';
import { PasswordService } from './password.service';

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await this.passwordService.hash(dto.password);
    const user = await this.userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.passwordService.compare(
      dto.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user);
  }

  async logout(dto: LogoutDto): Promise<void> {
    const expiresAt = this.jwtService.getExpirationDate(dto.token);
    await this.tokenRepository.blacklist(dto.token, expiresAt);
  }

  private buildAuthResponse(user: IUserDocument): AuthResponseDto {
    const accessToken = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const userDto: UserResponseDto = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { user: userDto, accessToken };
  }
}
