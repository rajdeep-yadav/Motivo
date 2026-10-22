import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
} from '../controllers/bookingController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Customer authenticated routes
router.post('/', authenticate, createBooking);
router.get('/my', authenticate, getMyBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/:id/cancel', authenticate, cancelBooking);

// Admin-protected routes
router.get('/', authenticate, authorize('admin'), getAllBookings);
router.put('/:id/status', authenticate, authorize('admin'), updateBookingStatus);

export default router;
