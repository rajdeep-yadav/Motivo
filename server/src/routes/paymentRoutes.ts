import { Router } from 'express';
import { createSimulatedPayment, getPaymentReceipt } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/simulate', authenticate, createSimulatedPayment);
router.get('/receipt/:paymentId', authenticate, getPaymentReceipt);

export default router;
