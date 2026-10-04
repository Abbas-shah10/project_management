import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from '../controllers/task.controllers.js';
import { verifyJWT, validateProjectPermission } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { AvailableUserRole } from '../utils/constants.js';

const router = Router();

router.use(verifyJWT);

router.route('/projects/:projectId')
  .get(validateProjectPermission(AvailableUserRole), getTasks)
  .post(
    validateProjectPermission(AvailableUserRole),
    upload.array('attachments'),
    createTask,
  );

router.route('/projects/:projectId/:taskId')
  .get(validateProjectPermission(AvailableUserRole), getTaskById)
  .put(
    validateProjectPermission(AvailableUserRole),
    upload.array('attachments'),
    updateTask,
  )
  .delete(validateProjectPermission(AvailableUserRole), deleteTask);

router.route('/projects/:projectId/:taskId/subtasks')
  .post(validateProjectPermission(AvailableUserRole), createSubTask);

router.route('/projects/:projectId/subtasks/:subTaskId')
  .put(validateProjectPermission(AvailableUserRole), updateSubTask)
  .delete(validateProjectPermission(AvailableUserRole), deleteSubTask);

export default router;