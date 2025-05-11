import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    
    if (!token) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Authentication required. Please login.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        status: 'error',
        message: 'User not found or deleted' 
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ 
      status: 'error',
      message: 'Invalid or expired token. Please login again.' 
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Authentication required. Please login.' 
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        status: 'error',
        message: 'Access denied. Admin privileges required' 
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({ 
      status: 'error',
      message: err.message 
    });
  }
}; 