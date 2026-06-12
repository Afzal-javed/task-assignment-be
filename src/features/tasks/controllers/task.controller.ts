import { Request, Response } from 'express';
import { ApiResponse } from '../../../shared/response';
import { asyncHandler } from '../../../shared/middleware/async-handler';
import { UnauthorizedException } from '../../../shared/exceptions';
import {
  CreateTaskDto,
  TaskQueryDto,
  UpdateTaskDto,
} from '../dto';
import { TaskService } from '../services/task.service';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  private getUserId(req: Request): string {
    if (!req.user?.sub) {
      throw new UnauthorizedException('User not authenticated');
    }
    return req.user.sub;
  }

  createTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserId(req);
    const dto = req.body as CreateTaskDto;
    const task = await this.taskService.createTask(userId, dto);
    ApiResponse.created(res, task, 'Task created successfully');
  });

  getTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserId(req);
    const query = req.query as unknown as TaskQueryDto;
    const result = await this.taskService.getTasks(userId, query);
    ApiResponse.success(res, result.tasks, 'Tasks retrieved successfully', 200, result.meta);
  });

  getTaskById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserId(req);
    const taskId = String(req.params.id);
    const task = await this.taskService.getTaskById(userId, taskId);
    ApiResponse.success(res, task, 'Task retrieved successfully');
  });

  updateTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserId(req);
    const taskId = String(req.params.id);
    const dto = req.body as UpdateTaskDto;
    const task = await this.taskService.updateTask(userId, taskId, dto);
    ApiResponse.success(res, task, 'Task updated successfully');
  });

  deleteTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserId(req);
    const taskId = String(req.params.id);
    await this.taskService.deleteTask(userId, taskId);
    ApiResponse.success(res, null, 'Task deleted successfully');
  });
}
