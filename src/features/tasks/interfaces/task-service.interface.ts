import {
  CreateTaskDto,
  TaskQueryDto,
  TaskResponseDto,
  UpdateTaskDto,
} from '../dto';
import { ApiResponseMeta } from '../../../shared/response';

export interface PaginatedTaskResponse {
  tasks: TaskResponseDto[];
  meta: ApiResponseMeta;
}

export interface ITaskService {
  createTask(userId: string, dto: CreateTaskDto): Promise<TaskResponseDto>;
  getTaskById(userId: string, taskId: string): Promise<TaskResponseDto>;
  getTasks(userId: string, query: TaskQueryDto): Promise<PaginatedTaskResponse>;
  updateTask(
    userId: string,
    taskId: string,
    dto: UpdateTaskDto
  ): Promise<TaskResponseDto>;
  deleteTask(userId: string, taskId: string): Promise<void>;
}
