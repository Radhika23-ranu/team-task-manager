import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/').post(protect, admin, createProject).get(protect, getProjects);
router
  .route('/:id')
  .get(protect, getProjectById)
  .put(protect, admin, updateProject)
  .delete(protect, admin, deleteProject);
router.route('/:id/add-member').post(protect, admin, addMember);
router.route('/:id/remove-member').post(protect, admin, removeMember);

export default router;
