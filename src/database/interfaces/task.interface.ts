import { Document, Types } from 'mongoose';
import { TaskStatus } from '../../shared/constants';

export interface ITask {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskDocument extends ITask, Document {
  _id: Types.ObjectId;
}
