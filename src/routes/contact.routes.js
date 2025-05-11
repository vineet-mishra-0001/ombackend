import express from 'express';
import { sendMessage, getMessages } from '../controllers/contact.controller.js';

const router = express.Router();

// POST /api/contact/send
router.post('/send', sendMessage);

// GET /api/contact/messages (optional admin route)
router.get('/messages', getMessages);

export default router;
