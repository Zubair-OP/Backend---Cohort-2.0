import {Router} from 'express';
const router = Router();
import { HandleChat,getChats,getChatMessages,deleteChat } from '../controller/chat.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

router.post('/message', authMiddleware, HandleChat);
router.get('/', authMiddleware, getChats);
router.get('/messages/:Id', authMiddleware, getChatMessages);
router.delete('/delete/:Id', authMiddleware, deleteChat);


export default router;