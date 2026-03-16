import {Router} from 'express';
const router = Router();
import {register, verifyEmail,login ,getme} from '../controller/auth.controller.js';
import {
	registerValidator,
	loginValidator,
	verifyEmailValidator,
	handleValidationErrors,
} from '../validators/auth.validator.js';
import {authMiddleware }from '../middleware/auth.middleware.js';


router.post('/register', registerValidator, handleValidationErrors, register);
router.get('/verify-email', verifyEmailValidator, handleValidationErrors, verifyEmail);
router.post('/login', loginValidator, handleValidationErrors, login);
router.get('/get-me', authMiddleware, getme);

export default router;