import express from 'express';
import { createReview, getAllReviews, getReviewByCarId } from '../controllers/review.controller.js';

const router = express.Router();

router.get('/', getAllReviews);
router.get('/:id', getReviewByCarId);
router.post('/', createReview); 


export default router;