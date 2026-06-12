import { Types } from 'mongoose';
import { TaskModel } from '../../../database/models';
import { ITaskDocument } from '../../../database/interfaces';
import { CreateTaskDto, UpdateTaskDto } from '../dto';
import {
  ITaskRepository,
  PaginatedTasks,
  TaskFilter,
  TaskListOptions,
} from '../interfaces';

export class TaskRepository implements ITaskRepository {
  async create(userId: string, dto: CreateTaskDto): Promise<ITaskDocument> {
    return TaskModel.create({
      userId: new Types.ObjectId(userId),
      title: dto.title,
      description: dto.description ?? '',
      status: dto.status,
      dueDate: dto.dueDate,
    });
  }

  async findByIdAndUserId(
    id: string,
    userId: string
  ): Promise<ITaskDocument | null> {
    return TaskModel.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });
  }

  async findAll(
    filter: TaskFilter,
    options: TaskListOptions
  ): Promise<PaginatedTasks> {
    const query = this.buildFilterQuery(filter);
    const skip = (options.page - 1) * options.limit;
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;

    const [tasks, total] = await Promise.all([
      TaskModel.find(query)
        .sort({ createdAt: sortDirection })
        .skip(skip)
        .limit(options.limit),
      TaskModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / options.limit);

    return {
      tasks,
      total,
      page: options.page,
      limit: options.limit,
      totalPages,
      hasNextPage: options.page < totalPages,
      hasPrevPage: options.page > 1,
    };
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateTaskDto
  ): Promise<ITaskDocument | null> {
    return TaskModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      },
      { $set: dto },
      { new: true, runValidators: true }
    );
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await TaskModel.deleteOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });
    return result.deletedCount > 0;
  }

  private buildFilterQuery(filter: TaskFilter): Record<string, unknown> {
    const query: Record<string, unknown> = {
      userId: new Types.ObjectId(filter.userId),
    };

    if (filter.status) {
      query.status = filter.status;
    }

    if (filter.search) {
      query.title = { $regex: filter.search, $options: 'i' };
    }

    return query;
  }
}
