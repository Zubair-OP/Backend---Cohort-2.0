import express from 'express';
import { authenticateUser } from '../middleware/auth.middlleware.js';
import { createPayment, getPaymentStatus } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create-intent', authenticateUser, createPayment);
router.get('/:paymentId', authenticateUser, getPaymentStatus);

export default router;
