"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Customer authenticated routes
router.post('/', auth_1.authenticate, bookingController_1.createBooking);
router.get('/my', auth_1.authenticate, bookingController_1.getMyBookings);
router.get('/:id', auth_1.authenticate, bookingController_1.getBookingById);
router.put('/:id/cancel', auth_1.authenticate, bookingController_1.cancelBooking);
// Admin-protected routes
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), bookingController_1.getAllBookings);
router.put('/:id/status', auth_1.authenticate, (0, auth_1.authorize)('admin'), bookingController_1.updateBookingStatus);
exports.default = router;
