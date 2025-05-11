import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Try to get token from cookie first
    let token = req.cookies.auth_token;
    
    // If no cookie token, try Authorization header
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ 
            status: 'error',
            message: 'No token provided' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ 
            status: 'error',
            message: 'Invalid or expired token'
        });
    }
};