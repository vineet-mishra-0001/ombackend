// routes/blog.routes.js
import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from '../controllers/blog.controller.js';
import upload from '../middlewares/multer.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verifyToken, isAdmin, createBlog);
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);
router.put('/:id', verifyToken, isAdmin, updateBlog);
router.delete('/:id', deleteBlog);

export default router;
