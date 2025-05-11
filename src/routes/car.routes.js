import express from 'express';
import {
  createCar,
  getAllCars,
  getCarById,
} from '../controllers/car.controller.js';
import upload from '../middlewares/multer.js';
const router = express.Router();

router.get('/', getAllCars);
router.get('/:id', getCarById);
// router.post('/', upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "images", maxCount: 10 }
//   ]), createCar);

router.post('/', createCar);

export default router;
