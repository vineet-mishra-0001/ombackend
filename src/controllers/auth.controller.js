import bcrypt from 'bcryptjs';
import userModel from '../models/user.model.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';

export const registerUser = async (req, res) => {
  const { username, email, password, age, phone, confirmPassword } = req.body;
  const avatar = req.file;

  try {
    const userExists = await userModel.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    let avatarPath = null;

    // Save buffer to disk manually
    if (avatar) {
      const uploadsDir = path.join('./uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

      const ext = path.extname(avatar.originalname);
      const fileName = `${Date.now()}-${username}${ext}`;
      const fullPath = path.join(uploadsDir, fileName);

      fs.writeFileSync(fullPath, avatar.buffer);
      avatarPath = `/uploads/${fileName}`; // What you send back to frontend
    }

    const newUser = new userModel({
      username,
      email,
      password,
      age,
      phone,
      avatar: avatarPath,
    });

    const savedUser = await newUser.save();

    const { password: _, ...rest } = savedUser._doc; // Remove password from the saved user object

    res.status(201).json({ message: 'Registration successful', user: rest });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Send token in both cookie and response body
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _, ...rest } = user._doc;

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      user: rest,
      token: token, // Also send token in response body
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, phone, age, password } = req.body;
    const avatar = req.file;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update basic fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (age) user.age = age;

    // ✅ Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // ✅ Handle avatar upload if provided
    if (avatar) {
      const uploadsDir = path.resolve('./uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

      const ext = path.extname(avatar.originalname);
      const fileName = `${Date.now()}-${user.username}${ext}`;
      const fullPath = path.join(uploadsDir, fileName);

      fs.writeFileSync(fullPath, avatar.buffer);
      user.avatar = `/uploads/${fileName}`; // For frontend access
    }

    const updatedUser = await user.save();
    const { password: _, ...rest } = updatedUser._doc;

    res.status(200).json({ message: 'Profile updated', user: rest });
  } catch (err) {
    console.error('Update profile error:', err);
    res
      .status(500)
      .json({ message: 'Something went wrong', error: err.message });
  }
};

export const registerAdmin = async (req, res) => {
  const { username, email, password, age, phone } = req.body;
  const avatar = req.file;

  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists',
      });
    }

    let avatarPath = null;
    if (avatar) {
      const uploadsDir = path.join('./uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

      const ext = path.extname(avatar.originalname);
      const fileName = `${Date.now()}-${username}${ext}`;
      const fullPath = path.join(uploadsDir, fileName);

      fs.writeFileSync(fullPath, avatar.buffer);
      avatarPath = `/uploads/${fileName}`;
    }

    const newAdmin = new userModel({
      username,
      email,
      password,
      age,
      phone,
      avatar: avatarPath,
      role: 'admin',
      isVerified: true,
    });

    const savedAdmin = await newAdmin.save();
    const { password: _, ...rest } = savedAdmin._doc;

    const token = jwt.sign({ id: savedAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      status: 'success',
      message: 'Admin registration successful',
      user: rest,
      token: token,
    });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Clear the auth token cookie
    res.clearCookie('auth_token');

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
