import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    // Get token from cookie (cookie-based auth)
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database and attach them to the request object
    // We use .select('-passwordHash') to ensure the password hash is never passed along
    req.user = await User.findById(decoded.id).select('-passwordHash');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Not authorized, token failed.' });
  }
};

// --- Role Authorization Middleware ---
// Pass allowed roles as arguments, e.g., authorizeRoles('Admin', 'LocalBusinessOwner')
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by the `protect` middleware above
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Your role (${req.user?.role}) is not authorized to access this route.` 
      });
    }
    next();
  };
};