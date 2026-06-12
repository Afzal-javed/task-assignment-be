import { FilterQuery, SortOrder } from 'mongoose';
import { ITaskDocument } from '../../../database/interfaces';
import { TaskStatus } from '../../../shared/constants';
import { CreateTaskDto, UpdateTaskDto } from '../dto';

export interface TaskFilter {
  userId: string;
  status?: TaskStatus;
  search?: string;
}

export interface TaskListOptions {
  page: number;
  limit: number;
  sortOrder: 'asc' | 'desc';
}

export interface PaginatedTasks {
  tasks: ITaskDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ITaskRepository {
  create(userId: string, dto: CreateTaskDto): Promise<ITaskDocument>;
  findByIdAndUserId(id: string, userId: string): Promise<ITaskDocument | null>;
  findAll(
    filter: TaskFilter,
    options: TaskListOptions
  ): Promise<PaginatedTasks>;
  update(
    id: string,
    userId: string,
    dto: UpdateTaskDto
  ): Promise<ITaskDocument | null>;
  delete(id: string, userId: string): Promise<boolean>;
}

export type TaskSort = Record<string, SortOrder>;
export type TaskFilterQuery = FilterQuery<ITaskDocument>;
