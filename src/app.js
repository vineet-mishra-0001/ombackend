import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/user.routes.js';
import carRoutes from './routes/car.routes.js';
import reviewRoutes from './routes/review.routes.js';
import tourRoutes from './routes/tour.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import blogRoutes from './routes/blog.routes.js';
import carbookingRoutes from './routes/carBooking.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import contactRoutes from './routes/contact.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Database connection middleware
const dbMiddleware = async (req, res, next) => {
  try {
    if (!mongoose.connection.readyState) {
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection error' });
  }
};

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Set-Cookie']
  })
);

// Serve static files from the /tmp directory in production
if (process.env.NODE_ENV === 'production') {
  app.use('/uploads', express.static('/tmp/uploads'));
} else {
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
}

// Create uploads directory if it doesn't exist
if (process.env.NODE_ENV === 'production') {
  const uploadsDir = '/tmp/uploads';
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} else {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

// Basic health check route (no DB connection needed)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Apply database middleware to all routes that need database access
app.use('/api/v1/auth', dbMiddleware, authRoutes);
app.use('/api/v1/cars', dbMiddleware, carRoutes);
app.use('/api/v1/tours', dbMiddleware, tourRoutes);
app.use('/api/v1/reviews', dbMiddleware, reviewRoutes);
app.use('/api/v1/bookings', dbMiddleware, bookingRoutes);
app.use('/api/v1/carBookings', dbMiddleware, carbookingRoutes);
app.use('/api/v1/feedback', dbMiddleware, feedbackRoutes);
app.use('/api/v1/blogs', dbMiddleware, blogRoutes);
app.use('/api/v1/contact', dbMiddleware, contactRoutes);
app.use('/api/v1/settings', dbMiddleware, settingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

export default app;
