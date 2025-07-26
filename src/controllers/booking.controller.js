import Booking from '../models/booking.model.js';
import createHttpError from 'http-errors';
import userModel from '../models/user.model.js';
import Tour from '../models/tour.model.js';
import carBookingModel from '../models/carBooking.model.js';
import { Resend } from 'resend';
import { generateBookingEmail } from '../utils/bookingEmailTemplate.js';

export class BookingController {
  // Create a new booking
  static async createBooking(req, res) {
    try {
      const { userId, tourId, startDate, guests } = req.body;

      if (!userId || !tourId || !startDate) {
        return res.status(400).json({
          success: false,
          message: 'User ID, Tour ID, startDate are required.',
        });
      }

      // Optional: Validate user and tour exist
      const userExists = await userModel.findById(userId);
      const tourExists = await Tour.findById(tourId);

      if (!userExists || !tourExists) {
        return res.status(404).json({
          success: false,
          message: 'User or Tour not found.',
        });
      }

      // Create booking
      const booking = await Booking.create({
        user: userId,
        tour: tourId,
        startDate,
        guests,
        bookingStatus: 'confirmed',
        paymentStatus: 'unpaid',
      });

      // Send booking confirmation email using Resend
      try {
        const resend = new Resend('re_ADGFyo15_BXcEyMhKHexLToRUPJTpEXKa');
        const html = generateBookingEmail({
          bookingId: booking._id,
          bookingDate: new Date(booking.createdAt).toLocaleDateString(),
          status: booking.bookingStatus || 'CONFIRMED',
          paymentStatus: booking.paymentStatus || 'RECEIVED',
          customerName: userExists.name,
          customerPhone: userExists.phone,
          customerEmail: userExists.email,
          fromCity: tourExists.startLocation || 'N/A',
          toCity: tourExists.endLocation || 'N/A',
          departureDate: new Date(booking.startDate).toLocaleDateString(),
          returnDate: new Date(
            booking.endDate || booking.startDate
          ).toLocaleDateString(),
          duration: 'N/A',
          packageType: tourExists.category || 'N/A',
          adults: booking.guests,
          children: 0,
          packageCost: tourExists.price || 0,
          transportation: 0,
          serviceTax: 0,
          discount: 0,
          totalPaid: tourExists.price || 0,
        });
        await resend.emails.send({
          from: 'Om Banna Tours <noreply@ombannatours.com>',
          to: userExists.email,
          subject: 'Your Booking Confirmation - Om Banna Tours',
          html,
        });
      } catch (mailErr) {
        console.error('Failed to send booking confirmation email:', mailErr);
      }

      return res.status(201).json({
        success: true,
        message: 'Tour booked successfully',
        data: booking,
      });
    } catch (error) {
      console.error('Booking Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
  // Get full booking details
  static async getBooking(req, res) {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('user')
      .populate('tour');

    if (!booking) {
      throw createHttpError(404, 'Booking not found');
    }

    return res.status(200).json({
      success: true,
      message: 'Booking details fetched',
      data: booking,
    });
  }
  static async getAllBooking(req, res) {
    const booking = await Booking.find().populate('user tour', '-password');

    if (!booking) {
      throw createHttpError(404, 'Booking not found');
    }

    return res.status(200).json({
      success: true,
      message: 'Booking details fetched',
      data: booking,
    });
  }

  // Cancel a booking
  static async cancelBooking(req, res) {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      throw createHttpError(404, 'Booking not found');
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    // Emit socket event
    const io = req.app.get('io');
    io.emit('bookingStatusChanged', {
      type: 'tour',
      bookingId: booking._id,
      status: 'cancelled',
      tourId: booking.tour,
      userId: booking.user,
    });

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  }

  // Update booking (admin usage)
  static async updateBooking(req, res) {
    const { id } = req.params;
    const { bookingStatus, paymentStatus } = req.body;

    const booking = await Booking.findById(id).populate(
      'user tour',
      '-password'
    );
    if (!booking) {
      throw createHttpError(404, 'Booking not found');
    }

    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.emit('bookingStatusChanged', {
      type: 'tour',
      bookingId: id,
      status: bookingStatus,
      tourId: booking.tour?._id || booking.tour,
      userId: booking.user?._id || booking.user,
    });

    return res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  }

  // Get all bookings of a specific user
  static async getBookingsByUser(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required.',
        });
      }

      const bookings = await Booking.find({ user: userId })
        .populate('tour')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: 'User bookings fetched successfully.',
        data: bookings,
      });
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }

  // static async getBookingAnalytics(req, res) {
  //   try {
  //     const tourBookings = await Booking.find().populate('tour');
  //     const carBookings = await carBookingModel.find();

  //     // Filter for paid/completed
  //     const paidTourBookings = tourBookings.filter(
  //       (booking) =>
  //         booking.paymentStatus === 'paid' || booking.bookingStatus === 'paid'
  //     );
  //     const completedCarBookings = carBookings.filter(
  //       (booking) => booking.status === 'paid'
  //     );

  //     console.log(completedCarBookings);
  //     // Income calculations
  //     const tourIncome = paidTourBookings.reduce(
  //       (acc, curr) => acc + Number(curr.tour.price),
  //       0
  //     );

  //     const carIncome = completedCarBookings.reduce(
  //       (acc, curr) => acc + Number(curr.price),
  //       0
  //     );
  //     const totalIncome = tourIncome + carIncome;
  //     console.log(totalIncome);
  //     // Total sales (successful bookings)
  //     const totalSales = paidTourBookings.length + completedCarBookings.length;

  //     // Total orders (all bookings)
  //     const totalOrders = tourBookings.length + carBookings.length;

  //     // AOV & Conversion Rate
  //     const averageOrderValue = totalSales ? totalIncome / totalSales : 0;
  //     const conversionRate = totalOrders ? (totalSales / totalOrders) * 100 : 0;

  //     return res.status(200).json({
  //       success: true,
  //       message: 'Booking analytics fetched successfully',
  //       data: {
  //         totalIncome,
  //         totalSales,
  //         averageOrderValue: Number(averageOrderValue.toFixed(2)),
  //         conversionRate: Number(conversionRate.toFixed(2)),
  //       },
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       success: false,
  //       message: 'Failed to fetch booking analytics',
  //       error: error.message,
  //     });
  //   }
  // }

  static async getBookingAnalytics(req, res) {
    try {
      const tourBookings = await Booking.find().populate('tour');
      const carBookings = await carBookingModel.find();

      // Filter for paid/completed
      const paidTourBookings = tourBookings.filter(
        (booking) =>
          booking.paymentStatus === 'paid' || booking.bookingStatus === 'paid'
      );
      const completedCarBookings = carBookings.filter(
        (booking) => booking.status === 'paid'
      );

      // Income calculations
      const tourIncome = paidTourBookings.reduce(
        (acc, curr) => acc + Number(curr.tour?.price || 0),
        0
      );
      const carIncome = completedCarBookings.reduce(
        (acc, curr) => acc + Number(curr.price || 0),
        0
      );
      const totalIncome = tourIncome + carIncome;

      // Total sales (successful bookings)
      const totalSales = paidTourBookings.length + completedCarBookings.length;

      // Total orders (all bookings)
      const totalOrders = tourBookings.length + carBookings.length;

      // AOV & Conversion Rate
      const averageOrderValue = totalSales ? totalIncome / totalSales : 0;
      const conversionRate = totalOrders ? (totalSales / totalOrders) * 100 : 0;

      // 📍 Extract unique tour locations
      const tourLocations = paidTourBookings
        .map((booking) => booking.tour?.location)
        .filter(Boolean);

      // 📍 Extract car pickup or drop locations (customize field as per your schema)
      const carLocations = completedCarBookings
        .map((booking) => booking.pickupLocation || booking.dropLocation) // adjust field names
        .filter(Boolean);

      const uniqueLocations = [...new Set([...tourLocations, ...carLocations])];

      return res.status(200).json({
        success: true,
        message: 'Booking analytics fetched successfully',
        data: {
          totalIncome,
          totalSales,
          averageOrderValue: Number(averageOrderValue.toFixed(2)),
          conversionRate: Number(conversionRate.toFixed(2)),
          locations: uniqueLocations,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch booking analytics',
        error: error.message,
      });
    }
  }

  // Delete a booking (admin)
  static async deleteBooking(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Booking.findByIdAndDelete(id);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: 'Booking not found' });
      }
      // Emit socket event
      const io = req.app.get('io');
      io.emit('bookingStatusChanged', {
        type: 'tour',
        bookingId: id,
        status: 'deleted',
        tourId: deleted.tour,
        userId: deleted.user,
      });
      return res
        .status(200)
        .json({ success: true, message: 'Booking deleted successfully.' });
    } catch (error) {
      console.error('Delete Booking Error:', error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal Server Error' });
    }
  }
}
