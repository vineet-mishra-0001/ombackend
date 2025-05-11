// controllers/blog.controller.js
import Blog from '../models/blogs.model.js';

export const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      tags,
      category,
      author,
      excerpt,
      readTime,
      coverImage, // this will come from the body as a string URL
    } = req.body;

    // Basic validation
    if (!title || !content || !author) {
      return res.status(400).json({
        message: 'Title, content, and author are required.',
      });
    }

    const blog = new Blog({
      title,
      content,
      excerpt,
      tags,
      category,
      readTime,
      author,
      coverImage: coverImage || '', // fallback if not provided
    });

    const saved = await blog.save();

    res.status(201).json({
      message: 'Blog created successfully',
      blog: saved,
    });
  } catch (err) {
    console.error('Create Blog Error:', err);
    res.status(500).json({
      message: 'Failed to create blog',
      error: err.message,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username email avatar')
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate(
      'author',
      'username email avatar'
    );
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const updates = req.body;
   
    const blog = await Blog.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).populate('author', 'username email avatar');
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update blog' });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete blog' });
  }
};
