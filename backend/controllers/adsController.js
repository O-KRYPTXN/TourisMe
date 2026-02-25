import Advertisement from '../models/ads.model.js';
import { Service } from '../models/service.model.js';

// @desc    Submit a new advertisement
// @route   POST /api/advertisements
// @access  Private (LocalBusinessOwner only)
export const createAdvertisement = async (req, res) => {
  try {
    const { promoCode, validUntil, serviceId, discount } = req.body;

    // Validation
    if (!validUntil) {
      return res.status(400).json({ message: 'Valid until date is required' });
    }

    // Check if valid until is in the future
    const expiryDate = new Date(validUntil);
    if (expiryDate < new Date()) {
      return res.status(400).json({ message: 'Valid until date must be in the future' });
    }

    // Verify service exists and belongs to owner
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      if (service.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only create ads for your own services' });
      }
    }


    if (discount !== undefined) {
    const numericDiscount = Number(discount);

        if (isNaN(numericDiscount) || numericDiscount < 0 || numericDiscount > 100) {
            return res.status(400).json({
            message: 'Discount must be a number between 0 and 100'
            });
        }
    }


    // Get uploaded banner image URL
    if (!req.file) {
      return res.status(400).json({ message: 'Advertisement banner image is required' });
    }
    const contentUrl = req.file.path;

    // Create the ad (defaults to 'Pending' status)
    const ad = await Advertisement.create({
      ownerId: req.user._id,
      serviceId,
      contentUrl,
      promoCode: promoCode?.toUpperCase(),
      discount,
      validUntil: expiryDate,
      approvalStatus: 'Pending'
    });

    await ad.populate('serviceId', 'name serviceType');

    res.status(201).json({ 
      message: 'Advertisement submitted for review. It will be visible once approved by admin.', 
      ad 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error submitting advertisement', error: error.message });
  }
};

// @desc    Get advertisements based on role
// @route   GET /api/advertisements
// @access  Public / Private based on role
export const getAdvertisements = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};

    // Role-based filtering
    if (!req.user || req.user.role === 'Tourist') {
      // Public/Tourist: Only approved, non-expired ads (FR-AD4)
      query.approvalStatus = 'Approved';
      query.validUntil = { $gte: new Date() };
    } 
    else if (req.user.role === 'LocalBusinessOwner') {
      query.ownerId = req.user._id;
    }
    else if (req.user.role === 'Admin') {
      if (status) {
        query.approvalStatus = status;
      }
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const ads = await Advertisement.find(query)
      .populate('ownerId', 'name companyName email')
      .populate('serviceId', 'name serviceType price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Advertisement.countDocuments(query);

    res.status(200).json({
      ads,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalAds: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching advertisements', error: error.message });
  }
};

// @desc    Get single advertisement by ID
// @route   GET /api/advertisements/:id
// @access  Public (if approved), Private (if owner/admin)
export const getAdvertisementById = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id)
      .populate('ownerId', 'name companyName email')
      .populate('serviceId', 'name serviceType price images');

    if (!ad) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    // Security check
    if (ad.approvalStatus !== 'Approved') {
      // Only owner or admin can view pending/rejected ads
      if (!req.user || (ad.ownerId._id.toString() !== req.user._id.toString() && req.user.role !== 'Admin')) {
        return res.status(403).json({ message: 'This advertisement is not publicly available' });
      }
    }

    res.status(200).json(ad);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching advertisement', error: error.message });
  }
};

// @desc    Update advertisement (content, promo code, expiry)
// @route   PUT /api/advertisements/:id
// @access  Private (Owner only, before approval)
export const updateAdvertisement = async (req, res) => {
  try {
    const { promoCode, validUntil, discount } = req.body;
    
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    if (ad.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Cannot update approved ads
    if (ad.approvalStatus === 'Approved') {
      return res.status(400).json({ 
        message: 'Cannot update approved advertisement. Please create a new one or contact admin.' 
      });
    }

    if (promoCode) ad.promoCode = promoCode.toUpperCase();
    if (discount !== undefined) ad.discount = discount;
    if (validUntil) {
      const expiryDate = new Date(validUntil);
      if (expiryDate < new Date()) {
        return res.status(400).json({ message: 'Valid until date must be in the future' });
      }
      ad.validUntil = expiryDate;
    }

    // Handle new banner upload
    if (req.file) {
      ad.contentUrl = req.file.path;
    }

    // Reset to pending if it was rejected
    if (ad.approvalStatus === 'Rejected') {
      ad.approvalStatus = 'Pending';
      ad.rejectionReason = undefined;
    }

    await ad.save();
    await ad.populate('serviceId', 'name serviceType');

    res.status(200).json({ 
      message: 'Advertisement updated successfully', 
      ad 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating advertisement', error: error.message });
  }
};

// @desc    Approve or Reject an advertisement
// @route   PUT /api/advertisements/:id/status
// @access  Private (Admin only)
export const updateAdStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Approved or Rejected.' });
    }

    const updateData = { approvalStatus: status };
    
    // If rejecting, require a reason
    if (status === 'Rejected') {
      if (!rejectionReason) {
        return res.status(400).json({ message: 'Rejection reason is required when rejecting an ad' });
      }
      updateData.rejectionReason = rejectionReason;
    } else {
      // Clear rejection reason if approving
      updateData.rejectionReason = undefined;
    }

    const ad = await Advertisement.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true, runValidators: true }
    ).populate('ownerId', 'name companyName email')
     .populate('serviceId', 'name');

    if (!ad) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    res.status(200).json({ 
      message: `Advertisement ${status.toLowerCase()} successfully`, 
      ad 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating status', error: error.message });
  }
};

// @desc    Delete an advertisement
// @route   DELETE /api/advertisements/:id
// @access  Private (Owner or Admin)
export const deleteAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    // Security: Only the owner or an admin can delete
    if (ad.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this advertisement' });
    }

    await ad.deleteOne();
    res.status(200).json({ message: 'Advertisement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting advertisement', error: error.message });
  }
};

// @desc    Track ad impression (view)
// @route   POST /api/advertisements/:id/impression
// @access  Public
export const trackImpression = async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndUpdate(
      req.params.id,
      { $inc: { impressionCount: 1 } },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    res.status(200).json({ message: 'Impression tracked' });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking impression', error: error.message });
  }
};

// @desc    Track ad click
// @route   POST /api/advertisements/:id/click
// @access  Public
export const trackClick = async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndUpdate(
      req.params.id,
      { $inc: { clickCount: 1 } },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    res.status(200).json({ message: 'Click tracked' });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking click', error: error.message });
  }
};

// @desc    Validate promo code
// @route   POST /api/advertisements/validate-promo
// @access  Public
export const validatePromoCode = async (req, res) => {
  try {
    const { promoCode, serviceId } = req.body;

    if (!promoCode) {
      return res.status(400).json({ message: 'Promo code is required' });
    }

    const query = {
      promoCode: promoCode.toUpperCase(),
      approvalStatus: 'Approved',
      validUntil: { $gte: new Date() }
    };

    if (serviceId) {
      query.serviceId = serviceId;
    }

    const ad = await Advertisement.findOne(query)
      .populate('serviceId', 'name price');

    if (!ad) {
      return res.status(404).json({ 
        message: 'Invalid or expired promo code',
        isValid: false
      });
    }

    res.status(200).json({
      message: 'Promo code is valid',
      isValid: true,
      discount: ad.discount,
      promoCode: ad.promoCode,
      service: ad.serviceId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error validating promo code', error: error.message });
  }
};

// @desc    Get ad statistics for owner
// @route   GET /api/advertisements/stats/my-ads
// @access  Private (LocalBusinessOwner)
export const getMyAdStats = async (req, res) => {
  try {
    const stats = await Advertisement.aggregate([
      { $match: { ownerId: req.user._id } },
      {
        $group: {
          _id: '$approvalStatus',
          count: { $sum: 1 },
          totalImpressions: { $sum: '$impressionCount' },
          totalClicks: { $sum: '$clickCount' }
        }
      }
    ]);

    const totalAds = await Advertisement.countDocuments({ ownerId: req.user._id });
    const activeAds = await Advertisement.countDocuments({
      ownerId: req.user._id,
      approvalStatus: 'Approved',
      validUntil: { $gte: new Date() }
    });

    res.status(200).json({
      totalAds,
      activeAds,
      byStatus: stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ad statistics', error: error.message });
  }
};