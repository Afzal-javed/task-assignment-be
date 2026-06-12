import { TaskStatus } from '../../../shared/constants';

export interface TaskResponseDto {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
