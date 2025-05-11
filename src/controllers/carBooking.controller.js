import createHttpError from 'http-errors';
import carBookingModel from '../models/carBooking.model.js';
import userModel from '../models/user.model.js';
import carModel from '../models/car.model.js';

export class CarBookingController {
  // Create a new car booking
  static async createBooking(req, res) {
    try {
      const {
        carId,
        userId,
        startDate,
        endDate,
        startLocation,
        endLocation,
        guests,
        price,
        status,
      } = req.body;

      if (
        !carId ||
        !userId ||
        !startDate ||
        !endDate ||
        !startLocation ||
        !endLocation ||
        !guests ||
        !price
      ) {
        return res.status(400).json({
          success: false,
          message: 'Missing required booking fields.',
        });
      }

      // Check if user and car exist
      const userExists = await userModel.findById(userId);
      const carExists = await carModel.findById(carId);

      if (!userExists || !carExists) {
        return res.status(404).json({
          success: false,
          message: 'User or Car not found.',
        });
      }

      const booking = await carBookingModel.create({
        user: userId,
        car: carId,
        startDate,
        endDate,
        startLocation,
        endLocation,
        guests,
        price,
        status: status || 'pending',
      });

      return res.status(201).json({
        success: true,
        message: 'Car booked successfully.',
        data: booking,
      });
    } catch (error) {
      console.error('Car Booking Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }

  // Get all bookings of a specific user
  static async getUserBookings(req, res) {
    try {
      const { userId } = req.params;

      const bookings = await carBookingModel
        .find({ user: userId })
        .populate('car')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: 'User car bookings fetched.',
        data: bookings,
      });
    } catch (error) {
      console.error('Get Bookings Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }

  // Get all bookings
  static async getAllBookings(req, res) {
    try {
      const bookings = await carBookingModel
        .find()
        .populate('car user', '-password')
        .sort({ createdAt: -1 });

        
      return res.status(200).json({
        success: true,
        message: 'bookings fetched.',
        data: bookings,
      });
    } catch (error) {
      console.error('Get Bookings Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }

  // Update a booking
  static async updateBooking(req, res) {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;

      // Find the booking first
      const booking = await carBookingModel.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found.',
        });
      }

      // Get the car
      const car = await carModel.findById(booking.car);
      if (!car) {
        return res.status(404).json({
          success: false,
          message: 'Car not found.',
        });
      }

      // Handle car quantity and availability based on status
      if (status === 'confirmed') {
        // When booking is confirmed, reduce car quantity to 0 and set available to false
        car.quantity = 0;
        car.available = false;
        await car.save();
      } else if (status === 'cancelled' || status === 'rejected') {
        // When booking is cancelled/rejected, restore car quantity to 1 and set available to true
        car.quantity = 1;
        car.available = true;
        await car.save();
      } else if (status === 'completed') {
        // When booking is completed, restore car quantity to 1 and set available to true
        car.quantity = 1;
        car.available = true;
        await car.save();
      }

      // Update the booking status
      const updatedBooking = await carBookingModel.findByIdAndUpdate(
        bookingId,
        { status },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Booking updated successfully.',
        data: updatedBooking,
      });
    } catch (error) {
      console.error('Update Booking Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }

  // Delete a booking
  static async deleteBooking(req, res) {
    try {
      const { bookingId } = req.params;

      const deleted = await carBookingModel.findByIdAndDelete(bookingId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Booking deleted successfully.',
      });
    } catch (error) {
      console.error('Delete Booking Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
}
