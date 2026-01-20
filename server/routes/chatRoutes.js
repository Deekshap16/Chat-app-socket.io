import express from 'express';
import {
  getChats,
  createOrGetChat,
  getChat,
  getMessages,
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/', getChats);
router.post('/', createOrGetChat);
router.get('/:chatId', getChat);
router.get('/:chatId/messages', getMessages);

export default router;




