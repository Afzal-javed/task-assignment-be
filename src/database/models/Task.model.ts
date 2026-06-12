import mongoose, { Schema } from 'mongoose';
import { TaskStatus, VALIDATION, COLLECTIONS } from '../../shared/constants';
import { ITaskDocument } from '../interfaces';

const taskSchema = new Schema<ITaskDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [
        VALIDATION.TASK.TITLE.MIN_LENGTH,
        'Task title cannot be empty',
      ],
      maxlength: [
        VALIDATION.TASK.TITLE.MAX_LENGTH,
        `Task title cannot exceed ${VALIDATION.TASK.TITLE.MAX_LENGTH} characters`,
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [
        VALIDATION.TASK.DESCRIPTION.MAX_LENGTH,
        `Description cannot exceed ${VALIDATION.TASK.DESCRIPTION.MAX_LENGTH} characters`,
      ],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: Object.values(TaskStatus),
        message:
          'Status must be one of: pending, in_progress, completed, cancelled',
      },
      default: TaskStatus.PENDING,
      index: true,
    },
    dueDate: {
      type: Date,
      index: true,
      validate: {
        validator(value: Date | null | undefined): boolean {
          if (!value) return true;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return value >= today;
        },
        message: 'Due date cannot be in the past',
      },
    },
  },
  {
    timestamps: true,
    collection: COLLECTIONS.TASKS,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

taskSchema.index({ userId: 1 }, { name: 'idx_tasks_userId' });
taskSchema.index({ status: 1 }, { name: 'idx_tasks_status' });
taskSchema.index({ dueDate: 1 }, { name: 'idx_tasks_dueDate' });
taskSchema.index({ userId: 1, status: 1 }, { name: 'idx_tasks_userId_status' });
taskSchema.index({ userId: 1, dueDate: 1 }, { name: 'idx_tasks_userId_dueDate' });
taskSchema.index(
  { title: 'text', description: 'text' },
  {
    name: 'idx_tasks_text_search',
    weights: { title: 10, description: 5 },
    default_language: 'english',
  }
);

export const TaskModel = mongoose.model<ITaskDocument>('Task', taskSchema);
