import { Router } from 'express';
import { validateRequest } from '../../../shared/validators';
import {
  createTaskSchema,
  taskIdSchema,
  taskQuerySchema,
  updateTaskSchema,
} from '../dto';
import { TaskController } from '../controllers/task.controller';
import { AuthMiddleware } from '../../auth/middleware/auth.middleware';

export function createTaskRoutes(
  controller: TaskController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  router.use(authMiddleware.authenticate);

  /**
   * @openapi
   * /api/tasks:
   *   get:
   *     tags: [Tasks]
   *     summary: Get all tasks for authenticated user
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, in_progress, completed, cancelled]
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: desc
   *     responses:
   *       200:
   *         description: Tasks retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  router.get('/', validateRequest(taskQuerySchema, 'query'), controller.getTasks);

  /**
   * @openapi
   * /api/tasks/{id}:
   *   get:
   *     tags: [Tasks]
   *     summary: Get task by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Task retrieved successfully
   *       404:
   *         description: Task not found
   */
  router.get(
    '/:id',
    validateRequest(taskIdSchema, 'params'),
    controller.getTaskById
  );

  /**
   * @openapi
   * /api/tasks:
   *   post:
   *     tags: [Tasks]
   *     summary: Create a new task
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTaskRequest'
   *     responses:
   *       201:
   *         description: Task created successfully
   *       400:
   *         description: Validation error
   */
  router.post('/', validateRequest(createTaskSchema), controller.createTask);

  /**
   * @openapi
   * /api/tasks/{id}:
   *   patch:
   *     tags: [Tasks]
   *     summary: Update a task
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTaskRequest'
   *     responses:
   *       200:
   *         description: Task updated successfully
   *       404:
   *         description: Task not found
   */
  router.patch(
    '/:id',
    validateRequest(taskIdSchema, 'params'),
    validateRequest(updateTaskSchema),
    controller.updateTask
  );

  /**
   * @openapi
   * /api/tasks/{id}:
   *   delete:
   *     tags: [Tasks]
   *     summary: Delete a task
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Task deleted successfully
   *       404:
   *         description: Task not found
   */
  router.delete(
    '/:id',
    validateRequest(taskIdSchema, 'params'),
    controller.deleteTask
  );

  return router;
}
