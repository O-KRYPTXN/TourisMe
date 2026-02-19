import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Building2, DollarSign, Star, TrendingUp, Calendar, Shield, CheckCircle, Clock, Plus, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const PROGRAMS_KEY = 'luxor_programs';
const PROVIDER_REPORTS_KEY = 'luxor_provider_reports';

const ServiceProviderDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [myServices, setMyServices] = useState([]);
    const [realBookings, setRealBookings] = useState([]);
    const [newReportsCount, setNewReportsCount] = useState(0);

    useEffect(() => {
        // Load provider's services
        loadServices();

        // Fade in animation
        gsap.fromTo(containerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }, [user]);

    const loadServices = () => {
        try {
            const programsData = localStorage.getItem(PROGRAMS_KEY);
            const allPrograms = programsData ? JSON.parse(programsData) : [];

            // Filter programs for current provider
            const providerPrograms = allPrograms.filter(program => program.providerId === user?.id);
            setMyServices(providerPrograms);

            // Load real bookings for this provider directly from localStorage
            if (user?.id) {
                const bookingsRaw = localStorage.getItem('luxor_bookings');
                const allBookings = bookingsRaw ? JSON.parse(bookingsRaw) : [];
                const myProgramIds = providerPrograms.map(p => p.id);

                const myBookings = allBookings.filter(b =>
                    b.providerId === user.id ||
                    myProgramIds.includes(b.programId)
                );
                setRealBookings(myBookings);
            }
        } catch (error) {
            console.error('Error loading services:', error);
            setMyServices([]);
            setRealBookings([]);
        }

        // Load provider-specific reports count
        try {
            const provRaw = localStorage.getItem(PROVIDER_REPORTS_KEY);
            const provAll = provRaw ? JSON.parse(provRaw) : [];

            // Get this provider's program IDs for cross-reference
            const programsRaw2 = localStorage.getItem(PROGRAMS_KEY);
            const allProgs = programsRaw2 ? JSON.parse(programsRaw2) : [];
            const myProgIds = allProgs.filter(p => p.providerId === user?.id).map(p => p.id);

            const myNewReports = provAll.filter(r =>
                (r.providerId === user?.id || (r.programId && myProgIds.includes(r.programId)))
                && !r.providerStatus
            );
            setNewReportsCount(myNewReports.length);
        } catch {
            setNewReportsCount(0);
        }
    };

    const totalServices = myServices.length;
    const totalBookings = realBookings.length;
    const totalRevenue = realBookings
        .filter(b => b.status !== 'Cancelled')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const averageRating = myServices.length > 0
        ? (myServices.reduce((sum, service) => sum + (service.rating || 0), 0) / myServices.length).toFixed(1)
        : '0.0';

    const stats = [
        { label: 'Total Services', value: totalServices.toString(), icon: Building2, color: 'from-primary-500 to-primary-600' },
        { label: 'Bookings', value: totalBookings.toString(), icon: Calendar, color: 'from-secondary-500 to-secondary-600' },
        { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-green-500 to-green-600' },
        { label: 'Rating', value: averageRating, icon: Star, color: 'from-yellow-500 to-yellow-600' }
    ];

    // Use real bookings, sorted by most recent
    const recentBookingsList = realBookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    const isVerified = user?.isVerified || false;

    return (
        <div ref={containerRef} className="min-h-screen bg-dark-900 pt-24 pb-16">
            <div className="container-custom">
                {/* Company Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-14 h-14 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-display font-bold text-white">
                                        {user?.companyName || 'Your Business'}
                                    </h1>
                                    <p className="text-white/60">License: {user?.licenseNumber || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            {isVerified ? (
                                <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-semibold">Verified</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full border border-yellow-500/30">
                                    <Clock className="w-5 h-5" />
                                    <span className="font-semibold">Pending Verification</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-white/70">{user?.businessDescription || 'Welcome to your business dashboard'}</p>
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

                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* My Services */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                            <Building2 className="w-6 h-6 text-secondary-400" />
                            My Services
                        </h2>
                        <div className="space-y-4">
                            {myServices.length === 0 ? (
                                <Card className="p-8 text-center">
                                    <Building2 className="w-12 h-12 text-white/20 mx-auto mb-3" />
                                    <p className="text-white/50 mb-4">You haven't added any services yet</p>
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate('/provider/add-program')}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Your First Service
                                    </Button>
                                </Card>
                            ) : (
                                myServices.map(service => (
                                    <Card key={service.id}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-white">{service.title}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${service.status === 'Approved'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : service.status === 'Rejected'
                                                            ? 'bg-red-500/20 text-red-400'
                                                            : 'bg-yellow-500/20 text-yellow-400'
                                                        }`}>
                                                        {service.status}
                                                    </span>
                                                </div>
                                                <div className="text-white/50 text-sm mb-3">{service.location}</div>
                                                <div className="flex items-center gap-6 text-sm">
                                                    <div className="flex items-center gap-2 text-white/60">
                                                        <Calendar className="w-4 h-4" />
                                                        {service.bookings || 0} bookings
                                                    </div>
                                                    <div className="flex items-center gap-2 text-white/60">
                                                        <DollarSign className="w-4 h-4" />
                                                        ${service.price}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-white/60">
                                                        <Clock className="w-4 h-4" />
                                                        {service.duration} hrs
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm">View Details</Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                        <div className="space-y-3">
                            <Button variant="primary" fullWidth onClick={() => navigate('/provider/add-program')}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Service
                            </Button>
                            <Button variant="glass" fullWidth onClick={() => navigate('/provider/analytics')}>
                                View Analytics
                            </Button>
                            <Button variant="glass" fullWidth onClick={() => navigate('/provider/bookings')}>
                                Manage Bookings
                            </Button>
                            <Button
                                variant="glass"
                                fullWidth
                                onClick={() => navigate('/provider/reports')}
                                className={newReportsCount > 0 ? 'border-amber-500/40 hover:border-amber-500/60' : ''}
                            >
                                <AlertTriangle className={`w-4 h-4 mr-2 ${newReportsCount > 0 ? 'text-amber-400' : ''}`} />
                                Tourist Reports
                                {newReportsCount > 0 && (
                                    <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {newReportsCount}
                                    </span>
                                )}
                            </Button>
                            <Button variant="glass" fullWidth onClick={() => navigate('/provider/settings')}>
                                Company Settings
                            </Button>
                        </div>

                        {!isVerified && (
                            <Card className="mt-6 bg-yellow-500/10 border-yellow-500/30">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-yellow-400 mt-1" />
                                    <div>
                                        <div className="text-white font-semibold mb-1">Verification Pending</div>
                                        <div className="text-white/60 text-sm mb-3">
                                            Your business is under review. This usually takes 2-3 business days.
                                        </div>
                                        <Button variant="ghost" size="sm">Learn More</Button>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Recent Bookings */}
                <Card>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-400" />
                        Recent Bookings
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Customer</th>
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Service</th>
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Date</th>
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Amount</th>
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookingsList.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center text-white/40 py-8">
                                            No bookings yet. Once tourists book your programs, they'll appear here.
                                        </td>
                                    </tr>
                                ) : (
                                    recentBookingsList.map(booking => (
                                        <tr key={booking.id} className="border-b border-white/5 hover:bg-dark-700/30 transition-colors">
                                            <td className="py-4 px-4 text-white">{booking.touristName}</td>
                                            <td className="py-4 px-4 text-white/70">{booking.programTitle}</td>
                                            <td className="py-4 px-4 text-white/70">{new Date(booking.tourDate).toLocaleDateString()}</td>
                                            <td className="py-4 px-4 text-primary-400 font-semibold">${booking.totalPrice?.toFixed(2)}</td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' :
                                                    booking.status === 'Completed' ? 'bg-blue-500/20 text-blue-400' :
                                                        booking.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                                                            'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ServiceProviderDashboard;
