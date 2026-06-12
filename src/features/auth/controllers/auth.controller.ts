import { Request, Response } from 'express';
import { ApiResponse } from '../../../shared/response';
import { asyncHandler } from '../../../shared/middleware/async-handler';
import { LoginDto, RegisterDto } from '../dto';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as RegisterDto;
    const result = await this.authService.register(dto);
    ApiResponse.created(res, result, 'User registered successfully');
  });

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as LoginDto;
    const result = await this.authService.login(dto);
    ApiResponse.success(res, result, 'Login successful');
  });

  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : '';

    if (!token) {
      ApiResponse.success(res, null, 'Logged out successfully');
      return;
    }

    await this.authService.logout({ token });
    ApiResponse.success(res, null, 'Logged out successfully');
  });
}
