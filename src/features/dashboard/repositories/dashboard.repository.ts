import { Types } from 'mongoose';
import { TaskModel } from '../../../database/models';
import { TaskStatus } from '../../../shared/constants';

export interface DashboardAggregationResult {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export class DashboardRepository {
  async getStats(userId: string): Promise<DashboardAggregationResult> {
    const userObjectId = new Types.ObjectId(userId);

    const [result] = await TaskModel.aggregate<{
      totalTasks: { count: number }[];
      completedTasks: { count: number }[];
      pendingTasks: { count: number }[];
    }>([
      { $match: { userId: userObjectId } },
      {
        $facet: {
          totalTasks: [{ $count: 'count' }],
          completedTasks: [
            { $match: { status: TaskStatus.COMPLETED } },
            { $count: 'count' },
          ],
          pendingTasks: [
            {
              $match: {
                status: { $in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] },
              },
            },
            { $count: 'count' },
          ],
        },
      },
    ]);

    return {
      totalTasks: result?.totalTasks[0]?.count ?? 0,
      completedTasks: result?.completedTasks[0]?.count ?? 0,
      pendingTasks: result?.pendingTasks[0]?.count ?? 0,
    };
  }
}
