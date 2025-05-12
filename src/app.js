import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import fs from 'fs';

// Import all routes
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

dotenv.config();

const app = express();

// Resolve directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS configuration
const allowedOrigins = [
  'https://admin.ombannatours.com',
  'https://ombannatours.com',
];

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

// Static file serving
const uploadsPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/uploads' 
  : path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use('/uploads', express.static(uploadsPath));

// Basic health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cars', carRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/carBookings', carbookingRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/settings', settingsRoutes);

// Global error handler
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