// Booking Management Utility
// Centralized system for managing tourist bookings
import { createNotification } from './NotificationManager';

const BOOKINGS_KEY = 'luxor_bookings';

// Booking Status Types
export const BookingStatus = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
};

/**
 * Create a new booking
 * @param {Object} bookingData - Booking information
 * @returns {Object} Created booking object
 */
export const createBooking = ({
    touristId,
    touristName,
    touristEmail,
    touristPhone,
    programId,
    programTitle,
    programImage,
    companyName,
    providerId,
    tourDate,
    adults,
    children,
    totalPrice,
    specialRequests = ''
}) => {
    try {
        const booking = {
            id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            touristId,
            touristName,
            touristEmail,
            touristPhone,
            programId,
            programTitle,
            programImage,
            companyName,
            providerId,
            tourDate,
            adults,
            children,
            totalPrice,
            status: BookingStatus.PENDING,
            specialRequests,
            createdAt: new Date().toISOString()
        };

        const bookings = getAllBookings();
        bookings.push(booking);
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

        // Notify provider about new booking
        try {
            createNotification({
                userId: providerId,
                type: 'new_booking',
                title: 'New Booking Received',
                message: `${touristName} booked "${programTitle}" for ${tourDate}`,
                bookingId: booking.id,
                status: 'info'
            });
        } catch (err) {
            console.log('Notification failed, but booking created');
        }

        return booking;
    } catch (error) {
        console.error('Error creating booking:', error);
        return null;
    }
};

/**
 * Get all bookings
 * @returns {Array} All bookings
 */
export const getAllBookings = () => {
    try {
        const bookingsData = localStorage.getItem(BOOKINGS_KEY);
        return bookingsData ? JSON.parse(bookingsData) : [];
    } catch (error) {
        console.error('Error getting bookings:', error);
        return [];
    }
};

/**
 * Get bookings for a specific tourist
 * @param {string} touristId - Tourist ID
 * @returns {Array} Tourist's bookings
 */
export const getTouristBookings = (touristId) => {
    const bookings = getAllBookings();
    return bookings.filter(booking => booking.touristId === touristId);
};

/**
 * Get bookings for a specific program
 * @param {string} programId - Program ID
 * @returns {Array} Program's bookings
 */
export const getProgramBookings = (programId) => {
    const bookings = getAllBookings();
    return bookings.filter(booking => booking.programId === programId);
};

/**
 * Get bookings for a specific provider
 * @param {string} providerId - Provider ID
 * @returns {Array} Provider's bookings
 */
export const getProviderBookings = (providerId) => {
    const bookings = getAllBookings();

    // Get provider's program IDs from localStorage
    let providerProgramIds = [];
    try {
        const programsData = localStorage.getItem('luxor_programs');
        const programs = programsData ? JSON.parse(programsData) : [];
        providerProgramIds = programs
            .filter(p => p.providerId === providerId)
            .map(p => p.id);
    } catch (e) {
        console.log('Could not load provider programs');
    }

    // Match bookings by providerId OR by programId belonging to provider's programs
    return bookings.filter(booking =>
        booking.providerId === providerId ||
        providerProgramIds.includes(booking.programId)
    );
};

/**
 * Update booking status
 * @param {string} bookingId - Booking ID
 * @param {string} newStatus - New status from BookingStatus
 * @returns {boolean} Success status
 */
export const updateBookingStatus = (bookingId, newStatus) => {
    try {
        const bookings = getAllBookings();
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);

        if (bookingIndex === -1) {
            console.error('Booking not found');
            return false;
        }

        const booking = bookings[bookingIndex];
        const oldStatus = booking.status;

        bookings[bookingIndex].status = newStatus;
        bookings[bookingIndex].updatedAt = new Date().toISOString();

        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

        // Notify tourist when status changes
        if (oldStatus !== newStatus) {
            let notificationTitle = '';
            let notificationMessage = '';
            let notificationType = 'info';

            if (newStatus === 'Confirmed') {
                notificationTitle = 'Booking Confirmed! 🎉';
                notificationMessage = `Your booking for "${booking.programTitle}" has been confirmed by ${booking.companyName}!`;
                notificationType = 'success';
            } else if (newStatus === 'Completed') {
                notificationTitle = 'Trip Completed';
                notificationMessage = `Your trip "${booking.programTitle}" has been completed. Hope you enjoyed it!`;
                notificationType = 'success';
            } else if (newStatus === 'Cancelled') {
                notificationTitle = 'Booking Cancelled';
                notificationMessage = `Your booking for "${booking.programTitle}" has been cancelled.`;
                notificationType = 'warning';
            }

            // Notify the tourist
            if (notificationMessage) {
                try {
                    createNotification({
                        userId: booking.touristId,
                        type: 'status_change',
                        title: notificationTitle,
                        message: notificationMessage,
                        bookingId: booking.id,
                        status: notificationType
                    });
                } catch (e) {
                    console.log('Tourist notification failed');
                }
            }

            // Notify all admins about the status change
            try {
                // Try decode secureStorage (base64) for users
                const usersEncoded = localStorage.getItem('luxor_users');
                let users = [];
                if (usersEncoded) {
                    try {
                        users = JSON.parse(atob(usersEncoded));
                    } catch {
                        try { users = JSON.parse(usersEncoded); } catch { users = []; }
                    }
                }
                const admins = users.filter(u => u.role === 'Admin');
                admins.forEach(admin => {
                    createNotification({
                        userId: admin.id,
                        type: 'booking_update',
                        title: `Booking ${newStatus}`,
                        message: `${booking.companyName || 'Provider'} ${newStatus.toLowerCase()} booking for "${booking.programTitle}" by ${booking.touristName}`,
                        bookingId: booking.id,
                        status: 'info'
                    });
                });
            } catch (e) {
                console.log('Admin notification failed');
            }
        }

        return true;
    } catch (error) {
        console.error('Error updating booking status:', error);
        return false;
    }
};

/**
 * Cancel a booking
 * @param {string} bookingId - Booking ID
 * @returns {boolean} Success status
 */
export const cancelBooking = (bookingId) => {
    return updateBookingStatus(bookingId, BookingStatus.CANCELLED);
};

/**
 * Get booking statistics for admin dashboard
 * @returns {Array} Statistics per program
 */
export const getBookingStats = () => {
    try {
        const bookings = getAllBookings();
        const programsData = localStorage.getItem('luxor_programs');
        const programs = programsData ? JSON.parse(programsData) : [];

        // Only include approved programs
        const approvedPrograms = programs.filter(p => p.status === 'Approved');

        const stats = approvedPrograms.map(program => {
            const programBookings = bookings.filter(b => b.programId === program.id);

            if (programBookings.length === 0) return null;

            return {
                programId: program.id,
                programTitle: program.title,
                companyName: program.companyName,
                providerId: program.providerId,
                totalTourists: programBookings.length,
                pendingCount: programBookings.filter(b => b.status === BookingStatus.PENDING).length,
                confirmedCount: programBookings.filter(b => b.status === BookingStatus.CONFIRMED).length,
                completedCount: programBookings.filter(b => b.status === BookingStatus.COMPLETED).length,
                cancelledCount: programBookings.filter(b => b.status === BookingStatus.CANCELLED).length,
                totalRevenue: programBookings
                    .filter(b => b.status !== BookingStatus.CANCELLED)
                    .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
                bookings: programBookings
            };
        }).filter(stat => stat !== null);

        // Sort by total tourists descending
        return stats.sort((a, b) => b.totalTourists - a.totalTourists);
    } catch (error) {
        console.error('Error getting booking stats:', error);
        return [];
    }
};

/**
 * Get upcoming bookings (Pending or Confirmed)
 * @param {string} touristId - Tourist ID (optional)
 * @returns {Array} Upcoming bookings
 */
export const getUpcomingBookings = (touristId = null) => {
    const bookings = touristId ? getTouristBookings(touristId) : getAllBookings();

    return bookings
        .filter(b =>
            (b.status === BookingStatus.PENDING || b.status === BookingStatus.CONFIRMED) &&
            new Date(b.tourDate) >= new Date()
        )
        .sort((a, b) => new Date(a.tourDate) - new Date(b.tourDate));
};

/**
 * Get past bookings (Completed or Cancelled)
 * @param {string} touristId - Tourist ID (optional)
 * @returns {Array} Past bookings
 */
export const getPastBookings = (touristId = null) => {
    const bookings = touristId ? getTouristBookings(touristId) : getAllBookings();

    return bookings
        .filter(b =>
            b.status === BookingStatus.COMPLETED ||
            b.status === BookingStatus.CANCELLED ||
            (new Date(b.tourDate) < new Date() && b.status !== BookingStatus.PENDING && b.status !== BookingStatus.CONFIRMED)
        )
        .sort((a, b) => new Date(b.tourDate) - new Date(a.tourDate));
};

/**
 * Clear all bookings (for testing/admin purposes)
 * @returns {boolean} Success status
 */
export const clearAllBookings = () => {
    try {
        localStorage.removeItem(BOOKINGS_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing bookings:', error);
        return false;
    }
};
