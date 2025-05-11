import express from 'express';
import { getSettings, updateSettings, uploadLogo } from '../controllers/settings.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public route to get settings
router.get('/', getSettings);

// Protected routes (admin only)
router.put('/', verifyToken, isAdmin, updateSettings);
router.post('/upload-logo', verifyToken, isAdmin, uploadLogo);

export default router; 