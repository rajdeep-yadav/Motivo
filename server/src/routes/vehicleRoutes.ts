import { Router } from 'express';
import {
  getVehicles,
  getVehicleById,
  checkVehicleAvailability,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '../controllers/vehicleController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.get('/:id/availability', checkVehicleAvailability);

// Admin-protected routes
router.post('/', authenticate, authorize('admin'), createVehicle);
router.put('/:id', authenticate, authorize('admin'), updateVehicle);
router.delete('/:id', authenticate, authorize('admin'), deleteVehicle);

export default router;
