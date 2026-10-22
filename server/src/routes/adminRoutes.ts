import { Router } from 'express';
import { getDashboardStats, getCustomers, getReports } from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All admin endpoints require authentication and admin role
router.use(authenticate, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/customers', getCustomers);
router.get('/reports', getReports);

export default router;
