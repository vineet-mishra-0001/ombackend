import express from 'express';
import { CarBookingController } from '../controllers/carBooking.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/book', CarBookingController.createBooking);
router.get('/user/:userId', CarBookingController.getUserBookings);
router.get('/', CarBookingController.getAllBookings);
// @route   PUT /api/bookings/:bookingId
router.put('/:bookingId', verifyToken, isAdmin, CarBookingController.updateBooking);

// @route   DELETE /api/bookings/:bookingId
router.delete('/:bookingId', verifyToken, isAdmin, CarBookingController.deleteBooking);

export default router;
