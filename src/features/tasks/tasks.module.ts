import { Router } from 'express';
import { TaskRepository } from './repositories/task.repository';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';
import { createTaskRoutes } from './routes/task.routes';
import { authMiddleware } from '../auth/auth.module';

const taskRepository = new TaskRepository();
export const taskService = new TaskService(taskRepository);
export const taskController = new TaskController(taskService);

export const taskRouter: Router = createTaskRoutes(
  taskController,
  authMiddleware
);
