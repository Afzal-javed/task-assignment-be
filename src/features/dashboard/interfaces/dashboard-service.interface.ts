export interface DashboardStatsDto {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionPercentage: number;
}

export interface IDashboardService {
  getStats(userId: string): Promise<DashboardStatsDto>;
}
