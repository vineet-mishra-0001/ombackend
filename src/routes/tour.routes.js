import express from 'express';
import {
  getTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  getToursWithPagination,
  getToursAndCarsBySearch,
} from '../controllers/tour.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/', getTours);
router.get('/limit', getToursWithPagination);
router.get('/search', getToursAndCarsBySearch);
router.get('/:id', getTourById);
router.post('/', verifyToken, isAdmin, createTour);
router.put('/:id', verifyToken, isAdmin, updateTour);
router.delete('/:id', verifyToken, isAdmin, deleteTour);

export default router;
