import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Tourist, LocalBusinessOwner } from '../models/user.model.js'; 
import { notificationTemplates, createNotification } from '../utils/notificationHelper.js';


// Helper function to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id, user.role);
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // Prevents frontend JS from accessing the cookie (XSS protection)
    secure: process.env.NODE_ENV === 'production', // Must be true in production (HTTPS)
    sameSite: 'strict', // Protects against Cross-Site Request Forgery (CSRF)
  };

  const userData = { id: user._id, name: user.name, email: user.email, role: user.role };
  if (user.role === 'LocalBusinessOwner') userData.companyName = user.companyName;

  res
    .status(statusCode)
    .cookie('token', token, options) // Attach token to cookie
    .json({ message, user: userData }); // Do NOT send token in JSON body anymore
};

// --- Tourist Signup ---
export const registerTourist = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body; 

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newTourist = await Tourist.create({
      name,
      email,
      phone,
      passwordHash,
      role: 'Tourist'
    });

    await notificationTemplates.welcome(newTourist); // Send welcome notification and email

    sendTokenResponse(newTourist, 201, res, 'Tourist registered successfully.');

  } catch (error) {
    res.status(500).json({ message: 'Server error during tourist registration.', error: error.message });
  }
};

// --- Local Business Owner Signup ---
export const registerOwner = async (req, res) => {
  try {
    const { name, email, phone, password, companyName, licenseNumber } = req.body;

    if (!name || !email || !phone || !password || !companyName || !licenseNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
        
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newOwner = await LocalBusinessOwner.create({
      name,
      email,
      phone,
      passwordHash,
      companyName,      
      licenseNumber,    
      role: 'LocalBusinessOwner'
    });

    await notificationTemplates.welcome(newOwner); // Send welcome notification and email

    sendTokenResponse(newOwner, 201, res, 'Local Business Owner registered successfully.');

  } catch (error) {
    res.status(500).json({ message: 'Server error during owner registration.', error: error.message });
  }
};

// --- Login ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    sendTokenResponse(user, 200, res, 'Login successful.');

  } catch (error) {
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

// --- Logout ---
export const logout = (req, res) => {
  res
    .cookie('token', '', {
      expires: new Date(0),
      httpOnly: true,
    })
    .json({ message: 'Logged out successfully.' });
};

// --- Get Current User Profile ---
export const getProfile = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    };

    if (req.user.role === 'LocalBusinessOwner') {
      userData.companyName = req.user.companyName;
    }

    res.status(200).json({ user: userData });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};