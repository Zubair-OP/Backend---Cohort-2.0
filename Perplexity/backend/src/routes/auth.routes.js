import {Router} from 'express';
const router = Router();
import {register, login, getme, logout} from '../controller/auth.controller.js';
import {
	registerValidator,
	loginValidator,
	handleValidationErrors,
} from '../validators/auth.validator.js';
import {authMiddleware} from '../middleware/auth.middleware.js';

router.post('/register', registerValidator, handleValidationErrors, register);
router.post('/login', loginValidator, handleValidationErrors, login);
router.get('/get-me', authMiddleware, getme);
router.get('/logout', logout);

export default router;
