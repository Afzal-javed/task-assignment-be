import { ITaskDocument } from '../../../database/interfaces';
import { NotFoundException } from '../../../shared/exceptions';
import {
  CreateTaskDto,
  TaskQueryDto,
  TaskResponseDto,
  UpdateTaskDto,
} from '../dto';
import { ITaskService, PaginatedTaskResponse } from '../interfaces';
import { TaskRepository } from '../repositories/task.repository';

export class TaskService implements ITaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(userId: string, dto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = await this.taskRepository.create(userId, dto);
    return this.toResponseDto(task);
  }

  async getTaskById(userId: string, taskId: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findByIdAndUserId(taskId, userId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return this.toResponseDto(task);
  }

  async getTasks(
    userId: string,
    query: TaskQueryDto
  ): Promise<PaginatedTaskResponse> {
    const result = await this.taskRepository.findAll(
      {
        userId,
        status: query.status,
        search: query.search,
      },
      {
        page: query.page,
        limit: query.limit,
        sortOrder: query.sortOrder,
      }
    );

    return {
      tasks: result.tasks.map((task) => this.toResponseDto(task)),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    };
  }

  async updateTask(
    userId: string,
    taskId: string,
    dto: UpdateTaskDto
  ): Promise<TaskResponseDto> {
    const task = await this.taskRepository.update(taskId, userId, dto);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return this.toResponseDto(task);
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const deleted = await this.taskRepository.delete(taskId, userId);
    if (!deleted) {
      throw new NotFoundException('Task not found');
    }
  }

  private toResponseDto(task: ITaskDocument): TaskResponseDto {
    return {
      id: task._id.toString(),
      title: task.title,
      description: task.description ?? '',
      status: task.status,
      dueDate: task.dueDate ?? null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
