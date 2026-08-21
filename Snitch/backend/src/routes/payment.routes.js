import express from 'express';
import { authenticateUser } from '../middleware/auth.middlleware.js';
import { createPayment, getPaymentStatus } from '../controllers/payment.controller.js';
import { paymentLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/create-intent', authenticateUser, paymentLimiter, createPayment);
router.get('/:paymentId', authenticateUser, getPaymentStatus);

export default router;
