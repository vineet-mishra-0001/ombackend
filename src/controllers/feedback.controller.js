import Feedback from '../models/feedback.model.js';

export const createFeedback = async (req, res) => {
  try {
    const { userId, comment, rating } = req.body;

    if (!userId || !comment || typeof rating !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'userId, comment, and rating are required',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const feedback = await Feedback.create({ userId, comment, rating });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (error) {
    console.error('Feedback creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message,
    });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('userId', 'name email avatar') // only selected fields
      .sort({ createdAt: -1 });

    const formatted = feedbacks.map((f) => ({
      _id: f._id,
      comment: f.comment,
      rating: f.rating,
      createdAt: f.createdAt,
      user: {
        name: f.userId?.name,
        email: f.userId?.email,
        avatar: f.userId?.avatar,
      },
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedbacks',
      error: error.message,
    });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Feedback.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: 'Feedback not found' });
    }
    res.json({ success: true, message: 'Feedback deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
