import nodemailer from 'nodemailer';

/**
 * Utility to send emails
 * @param {Object} options - { to, subject, html, text }
 */
export const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: `"TourisMe Luxor" <${process.env.SMTP_FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || '', // Fallback plain text
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Pre-built email templates
 */
export const emailTemplates = {
  bookingConfirmation: (booking, user) => ({
    subject: 'Booking Confirmed - TourisMe Luxor',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50;">Booking Confirmed! 🎉</h1>
        <p>Hi ${user.name},</p>
        <p>Your booking has been confirmed!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Booking Details:</h3>
          <p><strong>Service:</strong> ${booking.serviceId?.name}</p>
          <p><strong>Date:</strong> ${new Date(booking.serviceDate).toLocaleDateString()}</p>
          <p><strong>Number of People:</strong> ${booking.numberOfPeople}</p>
          <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
          ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
        </div>
        
        <p>We look forward to seeing you!</p>
        <p style="color: #7f8c8d; font-size: 12px;">This is an automated email. Please do not reply.</p>
      </div>
    `
  }),

  bookingCancellation: (booking, user) => ({
    subject: 'Booking Cancelled - TourisMe Luxor',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e74c3c;">Booking Cancelled</h1>
        <p>Hi ${user.name},</p>
        <p>Your booking has been cancelled.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${booking.serviceId?.name}</p>
          <p><strong>Date:</strong> ${new Date(booking.serviceDate).toLocaleDateString()}</p>
        </div>
        
        <p>If you didn't request this cancellation, please contact us immediately.</p>
      </div>
    `
  }),

  adApproval: (ad, owner) => ({
    subject: 'Advertisement Approved - TourisMe Luxor',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #27ae60;">Advertisement Approved! ✅</h1>
        <p>Hi ${owner.name},</p>
        <p>Great news! Your advertisement has been approved and is now live.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Promo Code:</strong> ${ad.promoCode}</p>
          <p><strong>Valid Until:</strong> ${new Date(ad.validUntil).toLocaleDateString()}</p>
        </div>
        
        <p>Your ad will be visible to all users until the expiry date.</p>
      </div>
    `
  }),

  adRejection: (ad, owner, reason) => ({
    subject: 'Advertisement Rejected - TourisMe Luxor',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e74c3c;">Advertisement Rejected</h1>
        <p>Hi ${owner.name},</p>
        <p>Unfortunately, your advertisement was not approved.</p>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p><strong>Reason:</strong> ${reason}</p>
        </div>
        
        <p>Please review our advertising guidelines and submit a revised version.</p>
      </div>
    `
  }),

  newReview: (review, owner, service) => ({
    subject: 'New Review Received - TourisMe Luxor',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50;">New Review Received ⭐</h1>
        <p>Hi ${owner.name},</p>
        <p>You received a new review for <strong>${service.name}</strong>!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Rating:</strong> ${'⭐'.repeat(review.rating)}</p>
          <p><strong>Comment:</strong> "${review.comment}"</p>
        </div>
        
        <p>Keep up the great work!</p>
      </div>
    `
  }),

  welcome: (user) => ({
    subject: 'Welcome to TourisMe Luxor! 🌴',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3498db;">Welcome to TourisMe Luxor!</h1>
        <p>Hi ${user.name},</p>
        <p>Thank you for joining TourisMe Luxor. We're excited to have you!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Get Started:</h3>
          <ul>
            <li>Explore amazing attractions in Luxor</li>
            <li>Book tours and experiences</li>
            <li>Plan your perfect trip</li>
            <li>Discover local restaurants and rentals</li>
          </ul>
        </div>
        
        <p>Start exploring today!</p>
      </div>
    `
  })
};