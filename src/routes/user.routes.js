import {
  loginUser,
  logoutUser,
  registerAdmin,
  registerUser,
  updateUserProfile,
} from '../controllers/auth.controller.js';
import upload from '../middlewares/multer.js';
import express from 'express';
const router = express.Router();

router.post('/register', upload.single('avatar'), registerUser);
router.post('/login', loginUser);
router.put('/user/:id', upload.single('avatar'), updateUserProfile);
router.post('/register-admin', upload.single('avatar'), registerAdmin);
router.post('/logout', logoutUser);

export default router;
