import Faq from '../models/faq.model.js';

// Get all FAQs
export const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: -1 });
    res.json({ success: true, data: faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create FAQ
export const createFaq = async (req, res) => {
  try {
    const { question, answer, category, isActive } = req.body;
    const faq = await Faq.create({ question, answer, category, isActive });
    res.status(201).json({ success: true, data: faq });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update FAQ
export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category, isActive } = req.body;
    const faq = await Faq.findByIdAndUpdate(
      id,
      { question, answer, category, isActive },
      { new: true }
    );
    if (!faq)
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, data: faq });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete FAQ
export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq)
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
