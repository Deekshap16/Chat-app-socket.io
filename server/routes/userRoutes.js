import express from 'express';
import { getUsers, getUser, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/', getUsers);
router.get('/:userId', getUser);
router.put('/profile', updateProfile);

export default router;




