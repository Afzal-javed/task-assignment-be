import { Request, Response } from 'express';
import { ApiResponse } from '../../../shared/response';
import { asyncHandler } from '../../../shared/middleware/async-handler';
import { UnauthorizedException } from '../../../shared/exceptions';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  getStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.sub) {
      throw new UnauthorizedException('User not authenticated');
    }

    const stats = await this.dashboardService.getStats(req.user.sub);
    ApiResponse.success(res, stats, 'Dashboard stats retrieved successfully');
  });
}
