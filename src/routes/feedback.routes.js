import express from 'express';
import {
  createFeedback,
  getAllFeedbacks,
} from '../controllers/feedback.controller.js';

const router = express.Router();

router.post('/', createFeedback);
router.get('/', getAllFeedbacks);

export default router;
