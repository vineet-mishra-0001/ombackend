import express from 'express';
import {
  createFeedback,
  getAllFeedbacks,
  deleteFeedback,
} from '../controllers/feedback.controller.js';

const router = express.Router();

router.post('/', createFeedback);
router.get('/', getAllFeedbacks);
router.delete('/:id', deleteFeedback);

export default router;
