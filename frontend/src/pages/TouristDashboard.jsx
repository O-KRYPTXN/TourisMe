import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Calendar, Heart, Star, MapPin, Clock, TrendingUp, Plane, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUpcomingBookings } from '../utils/BookingManager';
import { getUserNotifications, markAsRead } from '../utils/NotificationManager';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import DiscountBadge from '../components/common/DiscountBadge';
import NotificationBanner from '../components/common/NotificationBanner';

const TouristDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [approvedPrograms, setApprovedPrograms] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user) {
            // Load real booking data
            const bookings = getUpcomingBookings(user.id);
            setUpcomingBookings(bookings.slice(0, 2)); // Top 2 upcoming bookings

            // Load notifications
            const userNotifications = getUserNotifications(user.id);
            setNotifications(userNotifications.filter(n => !n.read).slice(0, 3));

            // Load approved programs from localStorage
            try {
                const programsData = localStorage.getItem('luxor_programs');
                const programs = programsData ? JSON.parse(programsData) : [];
                const approvedAll = programs.filter(p => p.status === 'Approved');

                // Get booked program IDs and provider IDs
                const allBookings = getUpcomingBookings(user.id);
                const bookedProgramIds = allBookings.map(b => b.programId);
                const trustedProviderIds = allBookings.map(b => b.providerId);

                // Personalize: prioritize trusted providers, exclude booked programs
                const fromTrusted = approvedAll.filter(p =>
                    trustedProviderIds.includes(p.providerId) && !bookedProgramIds.includes(p.id)
                );
                const fromNew = approvedAll.filter(p =>
                    !trustedProviderIds.includes(p.providerId) && !bookedProgramIds.includes(p.id)
                );

                // Combine and limit to 6
                const personalizedList = [...fromTrusted, ...fromNew].slice(0, 6);
                const finalList = personalizedList.length > 0 ? personalizedList : approvedAll.slice(0, 6);

                const approved = finalList.map(program => ({
                    id: program.id,
                    name: program.title,
                    company: program.companyName || 'Tour Company',
                    image: program.images?.[0] || 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800',
                    price: program.price,
                    originalPrice: program.price * 1.2,
                    discount: 20,
                    duration: program.duration,
                    providerId: program.providerId,
                    isTrusted: trustedProviderIds.includes(program.providerId)
                }));
                setApprovedPrograms(approved);
            } catch (error) {
                console.error('Error loading programs:', error);
            }
        }
    }, [user]);

    useEffect(() => {
        // Fade in animation
        gsap.fromTo(containerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }, []);

    // Calculate real stats from bookings
    const stats = [
        { label: 'Upcoming Trips', value: upcomingBookings.length.toString(), icon: Calendar, color: 'from-primary-500 to-primary-600' },
        { label: 'Saved Tours', value: '5', icon: Heart, color: 'from-pink-500 to-pink-600' },
        { label: 'Reviews', value: '12', icon: Star, color: 'from-yellow-500 to-yellow-600' },
        {
            label: 'Total Spent',
            value: `$${upcomingBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0).toFixed(0)}`,
            icon: TrendingUp,
            color: 'from-green-500 to-green-600'
        }
    ];

    const recommendedTours = approvedPrograms;

    return (
        <div ref={containerRef} className="min-h-screen bg-dark-900 pt-24 pb-16">
            <div className="container-custom">
                {/* Welcome Banner */}
                <div className="relative mb-8 p-8 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20" />
                    <div className="absolute inset-0 backdrop-blur-3xl" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                                <Plane className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-white/60 text-sm">Welcome back,</div>
                                <div className="text-2xl font-bold text-white">{user?.firstName} {user?.lastName}</div>
                            </div>
                        </div>
                        <p className="text-white/70">Ready for your next adventure in ancient Luxor?</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="text-center">
                                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-white/50 text-sm">{stat.label}</div>
                            </Card>
                        );
                    })}
                </div>

                {/* Notifications */}
                {notifications.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-primary-400" />
                            Notifications
                        </h2>
                        {notifications.map(notification => (
                            <NotificationBanner
                                key={notification.id}
                                notification={notification}
                                onClose={() => {
                                    markAsRead(notification.id);
                                    setNotifications(prev => prev.filter(n => n.id !== notification.id));
                                }}
                            />
                        ))}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* Upcoming Bookings */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-primary-400" />
                                Upcoming Trips
                            </h2>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/my-bookings')}>
                                View All
                            </Button>
                        </div>
                        {upcomingBookings.length === 0 ? (
                            <div className="text-center py-8 text-white/50">
                                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p>No upcoming bookings</p>
                                <Button variant="primary" size="sm" className="mt-4" onClick={() => navigate('/tours')}>
                                    Browse Tours
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingBookings.map(booking => (
                                    <Card key={booking.id} className="overflow-hidden">
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
                                                        <div className="flex items-center gap-2 text-white/40 text-sm mb-1">
                                                            <Building2 className="w-3 h-3" />
                                                            <span>{booking.companyName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-white/50 text-sm">
                                                            <Clock className="w-4 h-4" />
                                                            {new Date(booking.tourDate).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold block mb-2 ${booking.status === 'Confirmed'
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : 'bg-yellow-500/20 text-yellow-400'
                                                            }`}>
                                                            {booking.status}
                                                        </span>
                                                        <div className="text-green-400 font-bold">${booking.totalPrice?.toFixed(2)}</div>
                                                    </div>
                                                </div>
                                                <Button variant="primary" size="sm" onClick={() => navigate('/my-bookings')}>View Details</Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                        <div className="space-y-3">
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={() => navigate('/tours')}
                            >
                                Browse Tours
                            </Button>
                            <Button
                                variant="glass"
                                fullWidth
                                onClick={() => navigate('/my-bookings')}
                            >
                                My Bookings
                            </Button>
                            <Button
                                variant="glass"
                                fullWidth
                                onClick={() => navigate('/profile')}
                            >
                                Edit Profile
                            </Button>
                            <Button
                                variant="glass"
                                fullWidth
                                onClick={() => navigate('/tourist/report-issue')}
                                className="border-amber-500/30 hover:border-amber-500/50"
                            >
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Report an Issue
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Recommended Tours */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Star className="w-6 h-6 text-primary-400" />
                            Recommended for You
                        </h2>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/tours')}>
                            See More
                        </Button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {recommendedTours.map(tour => (
                            <Card
                                key={tour.id}
                                padding={false}
                                hover
                                onClick={() => navigate(`/tours/${tour.id}`)}
                                className="cursor-pointer"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
                                    <div className="absolute top-4 right-4">
                                        <DiscountBadge discount={tour.discount} />
                                    </div>
                                    {tour.isTrusted && (
                                        <div className="absolute top-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Trusted
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-white mb-2">{tour.name}</h3>
                                    <div className="flex items-center gap-2 text-white/50 text-sm mb-3">
                                        <MapPin className="w-4 h-4" />
                                        {tour.duration}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-white/40 line-through">${tour.originalPrice}</div>
                                            <div className="text-2xl font-bold text-primary-400">${tour.price}</div>
                                        </div>
                                        <Button variant="primary" size="sm">View</Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TouristDashboard;
