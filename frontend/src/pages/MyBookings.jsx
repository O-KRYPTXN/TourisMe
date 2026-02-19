import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Compass, Clock, Users, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getTouristBookings, getUpcomingBookings, getPastBookings, cancelBooking, BookingStatus } from '../utils/BookingManager';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const MyBookings = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);

    useEffect(() => {
        if (user) {
            loadBookings();
        }
    }, [user]);

    const loadBookings = () => {
        const upcoming = getUpcomingBookings(user.id);
        const past = getPastBookings(user.id);
        setUpcomingBookings(upcoming);
        setPastBookings(past);
    };

    const handleCancelBooking = (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            const success = cancelBooking(bookingId);
            if (success) {
                loadBookings();
            }
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            [BookingStatus.PENDING]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            [BookingStatus.CONFIRMED]: 'bg-green-500/20 text-green-400 border-green-500/30',
            [BookingStatus.COMPLETED]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            [BookingStatus.CANCELLED]: 'bg-red-500/20 text-red-400 border-red-500/30'
        };

        const icons = {
            [BookingStatus.PENDING]: Clock,
            [BookingStatus.CONFIRMED]: CheckCircle,
            [BookingStatus.COMPLETED]: CheckCircle,
            [BookingStatus.CANCELLED]: AlertCircle
        };

        const Icon = icons[status] || Clock;

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 ${styles[status] || ''}`}>
                <Icon className="w-4 h-4" />
                {status}
            </span>
        );
    };

    const BookingCard = ({ booking, isPast = false }) => (
        <Card className="overflow-hidden">
            <div className="flex gap-4">
                <img
                    src={booking.programImage}
                    alt={booking.programTitle}
                    className="w-32 h-32 object-cover rounded-xl"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=400';
                    }}
                />
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">{booking.programTitle}</h3>
                            <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                                <MapPin className="w-4 h-4" />
                                {booking.companyName}
                            </div>
                            <div className="flex items-center gap-2 text-white/50 text-sm">
                                <Calendar className="w-4 h-4" />
                                {new Date(booking.tourDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                        {getStatusBadge(booking.status)}
                    </div>

                    <div className="flex items-center gap-4 text-white/40 text-sm mb-3">
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {booking.adults} Adult{booking.adults !== 1 ? 's' : ''}
                            {booking.children > 0 && `, ${booking.children} Child${booking.children !== 1 ? 'ren' : ''}`}
                        </div>
                        <div className="font-semibold text-primary-400">
                            ${booking.totalPrice.toFixed(2)}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/tours/${booking.programId}`)}
                        >
                            View Details
                        </Button>
                        {!isPast && booking.status === BookingStatus.PENDING && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-red-400 hover:text-red-300"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );

    const hasBookings = upcomingBookings.length > 0 || pastBookings.length > 0;

    return (
        <div className="min-h-screen bg-dark-900 pt-20 pb-12">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-white mb-2">
                        My <span className="bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">Bookings</span>
                    </h1>
                    <p className="text-white/50">Track your upcoming and past adventures</p>
                </div>

                {!hasBookings ? (
                    /* Empty State */
                    <Card className="relative overflow-visible">
                        {/* Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-3xl blur-xl opacity-50" />

                        <div className="relative text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center">
                                <Compass className="w-12 h-12 text-primary-400 opacity-50" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">No bookings yet</h3>
                            <p className="text-white/50 mb-8 max-w-md mx-auto">
                                Start exploring the wonders of ancient Luxor! Browse our exclusive tour programs and book your first adventure.
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => navigate('/tours')}
                                className="shadow-[0_0_30px_rgba(242,133,109,0.4)]"
                            >
                                <MapPin className="w-5 h-5 mr-2" />
                                Explore Tours
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <>
                        {/* Upcoming Bookings */}
                        {upcomingBookings.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Calendar className="w-6 h-6 text-primary-400" />
                                    Upcoming Trips
                                    <span className="ml-2 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-semibold">
                                        {upcomingBookings.length}
                                    </span>
                                </h2>
                                <div className="space-y-4">
                                    {upcomingBookings.map(booking => (
                                        <BookingCard key={booking.id} booking={booking} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Past Bookings */}
                        {pastBookings.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-white/50" />
                                    Past Trips
                                    <span className="ml-2 px-3 py-1 bg-white/10 text-white/50 rounded-full text-sm font-semibold">
                                        {pastBookings.length}
                                    </span>
                                </h2>
                                <div className="space-y-4">
                                    {pastBookings.map(booking => (
                                        <BookingCard key={booking.id} booking={booking} isPast />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
