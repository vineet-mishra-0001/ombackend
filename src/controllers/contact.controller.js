import ContactMessage from '../models/contact.model.js';

export const sendMessage = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;
    const userId = req.user?.id || req.body.userId; // use req.user from auth middleware or body

    if (!fullName || !email || !subject || !message || !userId) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newMessage = new ContactMessage({
      fullName,
      email,
      subject,
      message,
      userId,
    });

    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

// (Optional) Get all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .populate('userId')
      .select('-password')
      .sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
