import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock, Search, Users, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateBookingStatus as updateBooking } from '../../utils/BookingManager';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const BOOKINGS_KEY = 'luxor_bookings';
const PROGRAMS_KEY = 'luxor_programs';

const ManageBookings = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const pageRef = useRef(null);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Load provider's bookings directly from localStorage
    const loadBookings = useCallback(() => {
        if (!user || !user.id) return;

        try {
            // Get ALL bookings from localStorage
            const bookingsRaw = localStorage.getItem(BOOKINGS_KEY);
            const allBookings = bookingsRaw ? JSON.parse(bookingsRaw) : [];

            // Get this provider's program IDs
            const programsRaw = localStorage.getItem(PROGRAMS_KEY);
            const allPrograms = programsRaw ? JSON.parse(programsRaw) : [];
            const myProgramIds = allPrograms
                .filter(p => p.providerId === user.id)
                .map(p => p.id);

            // Filter: match by providerId OR by programId
            const myBookings = allBookings.filter(b =>
                b.providerId === user.id ||
                myProgramIds.includes(b.programId)
            );

            console.log(`📋 Provider ${user.id}: Found ${myBookings.length} bookings (from ${allBookings.length} total, ${myProgramIds.length} programs)`);
            setBookings(myBookings);
        } catch (error) {
            console.error('Error loading bookings:', error);
            setBookings([]);
        }
    }, [user]);

    useEffect(() => {
        loadBookings();
    }, [loadBookings]);

    useEffect(() => {
        // Page animation
        gsap.fromTo(pageRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }, []);

    const handleUpdateBookingStatus = (bookingId, newStatus) => {
        updateBooking(bookingId, newStatus);
        // Reload bookings from localStorage
        loadBookings();
        setSelectedBooking(null);
    };

    const filteredBookings = bookings.filter(booking => {
        // Filter by tab
        if (activeTab === 'upcoming' && booking.status !== 'Confirmed' && booking.status !== 'Pending') return false;
        if (activeTab === 'completed' && booking.status !== 'Completed') return false;
        if (activeTab === 'cancelled' && booking.status !== 'Cancelled') return false;

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                booking.touristName.toLowerCase().includes(query) ||
                booking.programTitle.toLowerCase().includes(query) ||
                booking.id.toLowerCase().includes(query)
            );
        }

        return true;
    });

    const stats = {
        total: bookings.length,
        upcoming: bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length,
        completed: bookings.filter(b => b.status === 'Completed').length,
        revenue: bookings
            .filter(b => b.status === 'Completed' || b.status === 'Confirmed')
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
    };

    const tabs = [
        { id: 'all', label: 'All Bookings', count: bookings.length },
        { id: 'upcoming', label: 'Upcoming', count: stats.upcoming },
        { id: 'completed', label: 'Completed', count: stats.completed },
        { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'Cancelled').length }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-white/10 text-white/70';
        }
    };

    return (
        <div ref={pageRef} className="min-h-screen bg-dark-900 py-8">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/dashboard/provider')}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-4xl font-display font-bold text-white flex items-center gap-3">
                        <Calendar className="w-10 h-10 text-primary-400" />
                        Manage Bookings
                    </h1>
                    <p className="text-white/50 mt-2">View and manage all your tour bookings</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-6 text-center">
                        <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
                        <div className="text-white/50 text-sm">Total Bookings</div>
                    </Card>
                    <Card className="p-6 text-center">
                        <div className="text-3xl font-bold text-yellow-400 mb-1">{stats.upcoming}</div>
                        <div className="text-white/50 text-sm">Upcoming</div>
                    </Card>
                    <Card className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-1">{stats.completed}</div>
                        <div className="text-white/50 text-sm">Completed</div>
                    </Card>
                    <Card className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-400 mb-1">${stats.revenue.toLocaleString()}</div>
                        <div className="text-white/50 text-sm">Total Revenue</div>
                    </Card>
                </div>

                {/* Tabs and Search */}
                <Card className="p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="flex gap-2 overflow-x-auto">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-dark-700/50 text-white/70 hover:bg-dark-700'
                                        }`}
                                >
                                    {tab.label} ({tab.count})
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search bookings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-dark-700/50 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Booking ID</th>
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Customer</th>
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Program</th>
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Date</th>
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Guests</th>
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Amount</th>
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Status</th>
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-8 text-white/50">
                                            No bookings found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map(booking => (
                                        <tr key={booking.id} className="border-b border-white/5 hover:bg-dark-700/30 transition-colors">
                                            <td className="py-4 px-4 text-white font-mono text-sm">{booking.id}</td>
                                            <td className="py-4 px-4">
                                                <div className="text-white font-medium">{booking.touristName}</div>
                                                <div className="text-white/50 text-sm">{booking.touristEmail || 'N/A'}</div>
                                            </td>
                                            <td className="py-4 px-4 text-white/70">{booking.programTitle}</td>
                                            <td className="py-4 px-4 text-white/70">{new Date(booking.tourDate).toLocaleDateString()}</td>
                                            <td className="py-4 px-4 text-white/70">{(booking.adults || 0) + (booking.children || 0)}</td>
                                            <td className="py-4 px-4 text-green-400 font-semibold">${booking.totalPrice?.toFixed(2)}</td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedBooking(booking)}
                                                    >
                                                        Details
                                                    </Button>
                                                    {booking.status === 'Pending' && (
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => handleUpdateBookingStatus(booking.id, 'Confirmed')}
                                                        >
                                                            Confirm
                                                        </Button>
                                                    )}
                                                    {booking.status === 'Confirmed' && (
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => handleUpdateBookingStatus(booking.id, 'Completed')}
                                                        >
                                                            Complete
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Booking Details Modal */}
                {selectedBooking && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBooking(null)}>
                        <Card className="max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-start justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                                <button onClick={() => setSelectedBooking(null)} className="text-white/50 hover:text-white">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Customer Info */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-primary-400" />
                                        Customer Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-white/50 text-sm mb-1">Name</div>
                                            <div className="text-white font-medium">{selectedBooking.touristName}</div>
                                        </div>
                                        <div>
                                            <div className="text-white/50 text-sm mb-1">Email</div>
                                            <div className="text-white font-medium flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-primary-400" />
                                                {selectedBooking.touristEmail || 'N/A'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-white/50 text-sm mb-1">Phone</div>
                                            <div className="text-white font-medium flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-primary-400" />
                                                {selectedBooking.touristPhone || 'N/A'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-white/50 text-sm mb-1">Number of Guests</div>
                                            <div className="text-white font-medium">{(selectedBooking.adults || 0) + (selectedBooking.children || 0)} adults ({selectedBooking.adults}, {selectedBooking.children} children)</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Info */}
                                <div className="pt-6 border-t border-white/10">
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-secondary-400" />
                                        Booking Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-white/50 text-sm mb-1">Program</div>
                                            <div className="text-white font-medium">{selectedBooking.programTitle}</div>
                                        </div>
                                        <div>
                                            <div className="text-white/50 text-sm mb-1">Tour Date</div>
                                            <div className="text-white font-medium">{new Date(selectedBooking.tourDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                        </div>
                                        <div>
                                            <div className="text-white/50 text-sm mb-1">Amount</div>
                                            <div className="text-green-400 font-bold text-xl">${selectedBooking.totalPrice?.toFixed(2)}</div>
                                        </div>
                                        <div>
                                            <div className="text-white/50 text-sm mb-1">Status</div>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedBooking.status)}`}>
                                                {selectedBooking.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-6 border-t border-white/10 flex gap-3">
                                    {selectedBooking.status === 'Pending' && (
                                        <>
                                            <Button
                                                variant="primary"
                                                fullWidth
                                                onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'Confirmed')}
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Confirm Booking
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                fullWidth
                                                onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'Cancelled')}
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                    {selectedBooking.status === 'Confirmed' && (
                                        <Button
                                            variant="primary"
                                            fullWidth
                                            onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'Completed')}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Mark as Completed
                                        </Button>
                                    )}
                                    {(selectedBooking.status === 'Completed' || selectedBooking.status === 'Cancelled') && (
                                        <div className="text-center text-white/50 w-full py-2">
                                            This booking is {selectedBooking.status.toLowerCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBookings;
