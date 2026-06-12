import { DashboardStatsDto, IDashboardService } from '../interfaces/dashboard-service.interface';
import { DashboardRepository } from '../repositories/dashboard.repository';

export class DashboardService implements IDashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getStats(userId: string): Promise<DashboardStatsDto> {
    const stats = await this.dashboardRepository.getStats(userId);

    const completionPercentage =
      stats.totalTasks === 0
        ? 0
        : Math.round((stats.completedTasks / stats.totalTasks) * 1000) / 10;

    return {
      ...stats,
      completionPercentage,
    };
  }
}
