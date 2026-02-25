import Notification from '../models/notification.model.js';
import { sendEmail, emailTemplates } from './sendEmail.js';

/**
 * Create in-app notification and optionally send email
 */
export const createNotification = async ({
  userId,
  type,
  title,
  message,
  relatedId = null,
  relatedModel = null,
  actionUrl = null,
  priority = 'medium',
  sendEmailNotification = true,
  emailData = null
}) => {
  try {
    // Create in-app notification
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      relatedId,
      relatedModel,
      actionUrl,
      priority
    });

    // Optionally send email
    if (sendEmailNotification && emailData) {
      await sendEmail(emailData);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Notification templates for different events
 */
export const notificationTemplates = {
  bookingConfirmed: async (booking, user) => {
    await createNotification({
      userId: user._id,
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      message: `Your booking for ${booking.serviceId?.name} has been confirmed!`,
      relatedId: booking._id,
      relatedModel: 'Booking',
      actionUrl: `/bookings/${booking._id}`,
      priority: 'high',
      sendEmailNotification: true,
      emailData: {
        to: user.email,
        ...emailTemplates.bookingConfirmation(booking, user)
      }
    });
  },

  bookingCancelled: async (booking, user) => {
    await createNotification({
      userId: user._id,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `Your booking for ${booking.serviceId?.name} has been cancelled.`,
      relatedId: booking._id,
      relatedModel: 'Booking',
      actionUrl: `/bookings/${booking._id}`,
      priority: 'high',
      sendEmailNotification: true,
      emailData: {
        to: user.email,
        ...emailTemplates.bookingCancellation(booking, user)
      }
    });
  },

  adApproved: async (ad, owner) => {
    await createNotification({
      userId: owner._id,
      type: 'ad_approved',
      title: 'Advertisement Approved',
      message: `Your advertisement has been approved and is now live!`,
      relatedId: ad._id,
      relatedModel: 'Advertisement',
      actionUrl: `/advertisements/${ad._id}`,
      priority: 'medium',
      sendEmailNotification: true,
      emailData: {
        to: owner.email,
        ...emailTemplates.adApproval(ad, owner)
      }
    });
  },

  adRejected: async (ad, owner, reason) => {
    await createNotification({
      userId: owner._id,
      type: 'ad_rejected',
      title: 'Advertisement Rejected',
      message: `Your advertisement was rejected. Reason: ${reason}`,
      relatedId: ad._id,
      relatedModel: 'Advertisement',
      actionUrl: `/advertisements/${ad._id}`,
      priority: 'medium',
      sendEmailNotification: true,
      emailData: {
        to: owner.email,
        ...emailTemplates.adRejection(ad, owner, reason)
      }
    });
  },

  newReview: async (review, owner, service) => {
    await createNotification({
      userId: owner._id,
      type: 'review_received',
      title: 'New Review Received',
      message: `You received a ${review.rating}-star review on ${service.name}`,
      relatedId: review._id,
      relatedModel: 'Review',
      actionUrl: `/services/${service._id}`,
      priority: 'low',
      sendEmailNotification: true,
      emailData: {
        to: owner.email,
        ...emailTemplates.newReview(review, owner, service)
      }
    });
  },

  tripReminder: async (tripPlan, user) => {
    await createNotification({
      userId: user._id,
      type: 'trip_reminder',
      title: 'Trip Reminder',
      message: `Your trip "${tripPlan.title}" starts tomorrow!`,
      relatedId: tripPlan._id,
      relatedModel: 'TripPlan',
      actionUrl: `/trips/${tripPlan._id}`,
      priority: 'high',
      sendEmailNotification: false // Don't spam with reminders
    });
  },

  welcome: async (user) => {
    await createNotification({
      userId: user._id,
      type: 'system_announcement',
      title: 'Welcome to TourisMe Luxor!',
      message: 'Start exploring amazing attractions and services in Luxor.',
      priority: 'low',
      sendEmailNotification: true,
      emailData: {
        to: user.email,
        ...emailTemplates.welcome(user)
      }
    });
  }
};