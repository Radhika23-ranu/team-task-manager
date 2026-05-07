import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/users').get(protect, admin, getUsers);

export default router;
