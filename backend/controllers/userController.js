import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    // req.user is populated by your `protect` middleware
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update logged-in user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. Update Base User Fields (Allowed for all roles)
    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    
    // 2. Update Role-Specific Fields
    if (user.role === 'Tourist') {
      if (req.body.preferences) user.preferences = req.body.preferences;
      if (req.body.favorites) user.favorites = req.body.favorites;
    } 
    
    if (user.role === 'LocalBusinessOwner') {
      if (req.body.companyName) user.companyName = req.body.companyName;
      if (req.body.description) user.description = req.body.description;
    }

    const updatedUser = await user.save();

    const userResponse = updatedUser.toObject();
    delete userResponse.passwordHash;

    res.status(200).json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both current and new password' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error changing password', error: error.message });
  }
};

// @desc    Add favorite attraction (for tourists)
// @route   POST /api/users/favorites/:attractionId
// @access  Private (Tourist only)
export const addFavorite = async (req, res) => {
  try {
    const { attractionId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'Tourist') {
      return res.status(403).json({ message: 'Only tourists can add favorites' });
    }

    // Check if already favorited
    if (user.favorites.includes(attractionId)) {
      return res.status(400).json({ message: 'Attraction already in favorites' });
    }

    user.favorites.push(attractionId);
    await user.save();

    res.status(200).json({ 
      message: 'Added to favorites', 
      favorites: user.favorites 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error adding favorite', error: error.message });
  }
};

// @desc    Remove favorite attraction (for tourists)
// @route   DELETE /api/users/favorites/:attractionId
// @access  Private (Tourist only)
export const removeFavorite = async (req, res) => {
  try {
    const { attractionId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'Tourist') {
      return res.status(403).json({ message: 'Only tourists can remove favorites' });
    }

    user.favorites = user.favorites.filter(
      fav => fav.toString() !== attractionId
    );
    await user.save();

    res.status(200).json({ 
      message: 'Removed from favorites', 
      favorites: user.favorites 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error removing favorite', error: error.message });
  }
};

// @desc    Get user's favorites with full attraction details
// @route   GET /api/users/favorites
// @access  Private (Tourist only)
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'Tourist') {
      return res.status(403).json({ message: 'Only tourists have favorites' });
    }

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching favorites', error: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Please provide your password to confirm deletion' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password before deletion
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    await User.findByIdAndDelete(req.user._id);

    // Clear cookie
    res.cookie('token', '', {
      expires: new Date(0),
      httpOnly: true,
    });

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting account', error: error.message });
  }
};