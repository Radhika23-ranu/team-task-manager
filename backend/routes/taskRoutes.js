import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/').post(protect, admin, createTask).get(protect, getTasks);
router
  .route('/:id')
  .get(protect, getTaskById)
  .put(protect, admin, updateTask)
  .delete(protect, admin, deleteTask);
router.route('/:id/status').patch(protect, updateTaskStatus);

export default router;
