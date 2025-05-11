import express from 'express';
import { registerUser, loginUser, updateUserProfile, registerAdmin, logoutUser } from '../controllers/auth.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', upload.single('avatar'), registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Admin registration (protected with token)
router.post('/register-admin', upload.single('avatar'), registerAdmin);

// Protected routes
router.put('/profile/:id', verifyToken, upload.single('avatar'), updateUserProfile);

export default router; 