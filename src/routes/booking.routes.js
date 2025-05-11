import express from 'express';
import { BookingController } from '../controllers/booking.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', BookingController.createBooking);
router.get('/trend', BookingController.getBookingAnalytics);
router.get('/', BookingController.getAllBooking);
router.get('/:id', BookingController.getBooking);
router.get('/user/:userId', BookingController.getBookingsByUser);
router.delete('/:id', verifyToken, isAdmin, BookingController.cancelBooking);
router.patch('/:id', verifyToken, isAdmin, BookingController.updateBooking); // Admin only

export default router;
