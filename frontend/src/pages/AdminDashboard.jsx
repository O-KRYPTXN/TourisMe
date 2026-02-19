import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Users, Building2, DollarSign, TrendingUp, Shield, CheckCircle, Clock, AlertCircle, FileCheck, AlertTriangle, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { secureStorage } from '../utils/security';
import { getRecentActivities } from '../utils/ActivityLogger';
import { getBookingStats } from '../utils/BookingManager';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const USERS_KEY = 'luxor_users';
const PROGRAMS_KEY = 'luxor_programs';
const REPORTS_KEY = 'luxor_reports';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        totalProviders: 0,
        pendingPrograms: 0,
        approvedPrograms: 0,
        newReports: 0,
        programs: [],
        approvedProgramsList: [],
        allPrograms: [],
        reports: [],
        recentActivities: [],
        bookingStats: []
    });

    useEffect(() => {
        loadDashboardData();

        // Fade in animation
        gsap.fromTo(containerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }, []);

    const loadDashboardData = () => {
        // Load users
        const users = secureStorage.getItem(USERS_KEY) || [];
        const providers = users.filter(u => u.role === 'LocalBusinessOwner');

        // Load programs
        const programsData = localStorage.getItem(PROGRAMS_KEY);
        const programs = programsData ? JSON.parse(programsData) : [];
        const pendingPrograms = programs.filter(p => p.status === 'Pending');
        const approvedPrograms = programs.filter(p => p.status === 'Approved');
        const rejectedPrograms = programs.filter(p => p.status === 'Rejected');

        // Load reports
        const reportsData = localStorage.getItem(REPORTS_KEY);
        const reports = reportsData ? JSON.parse(reportsData) : [];
        const newReports = reports.filter(r => r.status === 'New');

        // Load recent activities
        const recentActivities = getRecentActivities(8);

        // Load booking statistics
        const bookingStats = getBookingStats();

        setDashboardData({
            totalUsers: users.length,
            totalProviders: providers.length,
            pendingPrograms: pendingPrograms.length,
            approvedPrograms: approvedPrograms.length,
            rejectedPrograms: rejectedPrograms.length,
            newReports: newReports.length,
            programs: pendingPrograms.slice(0, 3), // Top 3 pending programs
            approvedProgramsList: approvedPrograms.slice(0, 3), // Top 3 approved programs
            allPrograms: programs, // All programs regardless of status
            reports: newReports.slice(0, 4), // Top 4 new reports
            recentActivities: recentActivities,
            bookingStats: bookingStats
        });
    };

    const stats = [
        {
            label: 'Total Users',
            value: dashboardData.totalUsers.toString(),
            change: '+12%',
            icon: Users,
            color: 'from-primary-500 to-primary-600',
            bgColor: 'bg-primary-500/10'
        },
        {
            label: 'Service Providers',
            value: dashboardData.totalProviders.toString(),
            change: '+8%',
            icon: Building2,
            color: 'from-secondary-500 to-secondary-600',
            bgColor: 'bg-secondary-500/10'
        },
        {
            label: 'Total Revenue',
            value: '$52,450',
            change: '+23%',
            icon: DollarSign,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-500/10'
        },
        {
            label: 'Active Bookings',
            value: '189',
            change: '+15%',
            icon: TrendingUp,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-500/10'
        }
    ];

    const quickActions = [
        { label: 'Manage Users', icon: Users, action: () => navigate('/admin/users'), badge: null },
        { label: 'Program Approvals', icon: FileCheck, action: () => navigate('/admin/programs'), badge: dashboardData.pendingPrograms > 0 ? dashboardData.pendingPrograms.toString() : null },
        { label: 'Review Reports', icon: AlertTriangle, action: () => navigate('/admin/reports'), badge: dashboardData.newReports > 0 ? dashboardData.newReports.toString() : null },
        { label: 'Settings', icon: AlertCircle, action: () => navigate('/admin/settings'), badge: null }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-dark-900 pt-24 pb-16">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-white mb-2">
                        Admin <span className="bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">Dashboard</span>
                    </h1>
                    <p className="text-white/60">Welcome back, {user?.firstName}! Here's what's happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-full blur-3xl opacity-20`} />
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-white/50 text-sm">{stat.label}</div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Provider Performance Metrics */}
                <Card className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-400" />
                            Provider Performance
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Top by Revenue */}
                        <div>
                            <h3 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Top by Revenue
                            </h3>
                            <div className="space-y-2">
                                {dashboardData.bookingStats.slice(0, 5).map((stat, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="text-2xl font-bold text-primary-400">#{i + 1}</div>
                                            <div className="min-w-0">
                                                <div className="text-white font-medium text-sm truncate">{stat.companyName}</div>
                                                <div className="text-white/40 text-xs">{stat.totalTourists} tourists</div>
                                            </div>
                                        </div>
                                        <div className="text-green-400 font-bold">${stat.totalRevenue.toFixed(0)}</div>
                                    </div>
                                ))}
                                {dashboardData.bookingStats.length === 0 && (
                                    <div className="text-center py-4 text-white/30 text-sm">No data yet</div>
                                )}
                            </div>
                        </div>

                        {/* Most Bookings */}
                        <div>
                            <h3 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Most Bookings
                            </h3>
                            <div className="space-y-2">
                                {[...dashboardData.bookingStats]
                                    .sort((a, b) => b.totalTourists - a.totalTourists)
                                    .slice(0, 5)
                                    .map((stat, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="text-2xl font-bold text-secondary-400">#{i + 1}</div>
                                                <div className="min-w-0">
                                                    <div className="text-white font-medium text-sm truncate">{stat.companyName}</div>
                                                    <div className="text-white/40 text-xs">{stat.programTitle}</div>
                                                </div>
                                            </div>
                                            <div className="text-secondary-400 font-bold">{stat.totalTourists}</div>
                                        </div>
                                    ))}
                                {dashboardData.bookingStats.length === 0 && (
                                    <div className="text-center py-4 text-white/30 text-sm">No data yet</div>
                                )}
                            </div>
                        </div>

                        {/* Completion Rate */}
                        <div>
                            <h3 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Best Completion Rate
                            </h3>
                            <div className="space-y-2">
                                {dashboardData.bookingStats
                                    .filter(s => s.totalTourists > 0)
                                    .map(stat => ({
                                        ...stat,
                                        completionRate: (stat.completedCount / stat.totalTourists) * 100
                                    }))
                                    .sort((a, b) => b.completionRate - a.completionRate)
                                    .slice(0, 5)
                                    .map((stat, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="text-2xl font-bold text-green-400">#{i + 1}</div>
                                                <div className="min-w-0">
                                                    <div className="text-white font-medium text-sm truncate">{stat.companyName}</div>
                                                    <div className="text-white/40 text-xs">{stat.completedCount}/{stat.totalTourists} completed</div>
                                                </div>
                                            </div>
                                            <div className="text-green-400 font-bold">{stat.completionRate.toFixed(0)}%</div>
                                        </div>
                                    ))}
                                {dashboardData.bookingStats.length === 0 && (
                                    <div className="text-center py-4 text-white/30 text-sm">No data yet</div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Pending Program Approvals */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileCheck className="w-5 h-5 text-primary-400" />
                                Pending Program Approvals
                            </h2>
                            {dashboardData.pendingPrograms > 0 && (
                                <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm font-semibold">
                                    {dashboardData.pendingPrograms}
                                </span>
                            )}
                        </div>
                        <div className="space-y-4">
                            {dashboardData.programs.length === 0 ? (
                                <div className="text-center py-8 text-white/50">
                                    <FileCheck className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                    <p>No pending programs</p>
                                </div>
                            ) : (
                                dashboardData.programs.map(program => (
                                    <div key={program.id} className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl border border-white/5 hover:border-primary-500/30 transition-all">
                                        <div className="flex-1">
                                            <div className="text-white font-medium">{program.title}</div>
                                            <div className="text-white/40 text-sm">
                                                {program.companyName} • {new Date(program.submittedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => navigate('/admin/programs')}
                                        >
                                            Review
                                        </Button>
                                    </div>
                                ))
                            )}
                            {dashboardData.pendingPrograms > 3 && (
                                <button
                                    onClick={() => navigate('/admin/programs')}
                                    className="w-full text-center text-primary-400 hover:text-primary-300 text-sm font-medium py-2 transition-colors"
                                >
                                    View all {dashboardData.pendingPrograms} pending programs →
                                </button>
                            )}
                        </div>
                    </Card>

                    {/* New Reports */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-secondary-400" />
                                New Reports
                            </h2>
                            {dashboardData.newReports > 0 && (
                                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
                                    {dashboardData.newReports}
                                </span>
                            )}
                        </div>
                        <div className="space-y-4">
                            {dashboardData.reports.length === 0 ? (
                                <div className="text-center py-8 text-white/50">
                                    <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                    <p>No new reports</p>
                                </div>
                            ) : (
                                dashboardData.reports.map(report => (
                                    <div
                                        key={report.id}
                                        className="flex items-start gap-4 p-3 rounded-lg hover:bg-dark-700/30 transition-all cursor-pointer"
                                        onClick={() => navigate('/admin/reports')}
                                    >
                                        <div className={`w-2 h-2 rounded-full mt-2 ${report.priority === 'Critical' ? 'bg-red-400' :
                                            report.priority === 'High' ? 'bg-orange-400' :
                                                report.priority === 'Medium' ? 'bg-yellow-400' :
                                                    'bg-green-400'
                                            }`} />
                                        <div className="flex-1">
                                            <div className="text-white font-medium text-sm">{report.subject}</div>
                                            <div className="text-white/40 text-sm">{report.type} • {report.reporterName}</div>
                                        </div>
                                        <div className="text-white/30 text-xs whitespace-nowrap">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            )}
                            {dashboardData.newReports > 4 && (
                                <button
                                    onClick={() => navigate('/admin/reports')}
                                    className="w-full text-center text-primary-400 hover:text-primary-300 text-sm font-medium py-2 transition-colors"
                                >
                                    View all {dashboardData.newReports} new reports →
                                </button>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Recent Provider Activities */}
                <Card className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary-400" />
                            Recent Provider Activities
                        </h2>
                        {dashboardData.recentActivities.length > 0 && (
                            <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm font-semibold">
                                {dashboardData.recentActivities.length} Recent
                            </span>
                        )}
                    </div>
                    <div className="space-y-3">
                        {dashboardData.recentActivities.length === 0 ? (
                            <div className="text-center py-8 text-white/50">
                                <Activity className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p>No recent activities</p>
                            </div>
                        ) : (
                            dashboardData.recentActivities.map(activity => {
                                // Determine activity icon and color based on type
                                let activityIcon = Activity;
                                let activityColor = 'text-blue-400';

                                if (activity.type === 'SERVICE_ADDED') {
                                    activityIcon = Building2;
                                    activityColor = 'text-green-400';
                                } else if (activity.type === 'SERVICE_UPDATED') {
                                    activityIcon = FileCheck;
                                    activityColor = 'text-yellow-400';
                                } else if (activity.type === 'PROFILE_UPDATED') {
                                    activityIcon = Users;
                                    activityColor = 'text-purple-400';
                                } else if (activity.type === 'LOGIN') {
                                    activityIcon = Shield;
                                    activityColor = 'text-blue-400';
                                }

                                const ActivityIcon = activityIcon;

                                return (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-4 p-4 bg-dark-700/30 rounded-xl border border-white/5 hover:border-primary-500/30 transition-all"
                                    >
                                        <div className={`w-10 h-10 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                            <ActivityIcon className={`w-5 h-5 ${activityColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <div>
                                                    <p className="text-white font-medium">{activity.description}</p>
                                                    <p className="text-white/50 text-sm">
                                                        {activity.companyName} • {activity.providerName}
                                                    </p>
                                                </div>
                                                <span className="text-white/40 text-xs whitespace-nowrap">
                                                    {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            {activity.metadata?.programTitle && (
                                                <div className="text-white/40 text-sm mt-1">
                                                    Program: {activity.metadata.programTitle}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Card>

                {/* Program Booking Statistics */}
                {dashboardData.bookingStats.length > 0 && (
                    <Card className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary-400" />
                                Program Booking Statistics
                            </h2>
                            <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm font-semibold">
                                {dashboardData.bookingStats.length} Program{dashboardData.bookingStats.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="space-y-4">
                            {dashboardData.bookingStats.map(stat => (
                                <div
                                    key={stat.programId}
                                    className="p-5 bg-dark-700/30 rounded-xl border border-white/5 hover:border-primary-500/20 transition-all"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">{stat.programTitle}</h3>
                                            <p className="text-white/50 text-sm">
                                                <Building2 className="w-4 h-4 inline mr-1" />
                                                {stat.companyName}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-white/40">Total Revenue</div>
                                            <div className="text-2xl font-bold text-green-400">
                                                ${stat.totalRevenue.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Statistics Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="p-3 bg-dark-800/50 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Users className="w-4 h-4 text-primary-400" />
                                                <span className="text-white/60 text-xs">Total</span>
                                            </div>
                                            <div className="text-xl font-bold text-white">
                                                {stat.totalTourists}
                                            </div>
                                        </div>

                                        <div className="p-3 bg-dark-800/50 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Clock className="w-4 h-4 text-yellow-400" />
                                                <span className="text-white/60 text-xs">Pending</span>
                                            </div>
                                            <div className="text-xl font-bold text-yellow-400">
                                                {stat.pendingCount}
                                            </div>
                                        </div>

                                        <div className="p-3 bg-dark-800/50 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span className="text-white/60 text-xs">Confirmed</span>
                                            </div>
                                            <div className="text-xl font-bold text-green-400">
                                                {stat.confirmedCount}
                                            </div>
                                        </div>

                                        <div className="p-3 bg-dark-800/50 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CheckCircle className="w-4 h-4 text-blue-400" />
                                                <span className="text-white/60 text-xs">Completed</span>
                                            </div>
                                            <div className="text-xl font-bold text-blue-400">
                                                {stat.completedCount}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* All Programs Overview */}
                <Card className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary-400" />
                            All Provider Programs
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                                {dashboardData.pendingPrograms} Pending
                            </span>
                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                                {dashboardData.approvedPrograms} Approved
                            </span>
                            {dashboardData.rejectedPrograms > 0 && (
                                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
                                    {dashboardData.rejectedPrograms} Rejected
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-3">
                        {dashboardData.allPrograms.length === 0 ? (
                            <div className="text-center py-8 text-white/50">
                                <Building2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p>No programs submitted yet</p>
                            </div>
                        ) : (
                            dashboardData.allPrograms.map(program => {
                                // Determine status badge style
                                let statusBadge = {
                                    bg: 'bg-gray-500/20',
                                    text: 'text-gray-400',
                                    border: 'border-gray-500/30',
                                    icon: AlertCircle
                                };

                                if (program.status === 'Pending') {
                                    statusBadge = {
                                        bg: 'bg-yellow-500/20',
                                        text: 'text-yellow-400',
                                        border: 'border-yellow-500/30',
                                        icon: Clock
                                    };
                                } else if (program.status === 'Approved') {
                                    statusBadge = {
                                        bg: 'bg-green-500/20',
                                        text: 'text-green-400',
                                        border: 'border-green-500/30',
                                        icon: CheckCircle
                                    };
                                } else if (program.status === 'Rejected') {
                                    statusBadge = {
                                        bg: 'bg-red-500/20',
                                        text: 'text-red-400',
                                        border: 'border-red-500/30',
                                        icon: AlertCircle
                                    };
                                }

                                const StatusIcon = statusBadge.icon;

                                return (
                                    <div
                                        key={program.id}
                                        className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl border border-white/5 hover:border-primary-500/30 transition-all cursor-pointer"
                                        onClick={() => navigate('/admin/programs')}
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            {/* Program Image */}
                                            <img
                                                src={program.images?.[0] || 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=200'}
                                                alt={program.title}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=200';
                                                }}
                                            />

                                            {/* Program Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="text-white font-medium mb-1 truncate">{program.title}</div>
                                                <div className="flex items-center gap-3 text-sm text-white/40">
                                                    <span className="truncate">{program.companyName}</span>
                                                    <span>•</span>
                                                    <span>${program.price}</span>
                                                    <span>•</span>
                                                    <span>{program.location}</span>
                                                    <span>•</span>
                                                    <span className="text-white/30 text-xs">
                                                        {new Date(program.submittedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                                            <StatusIcon className="w-4 h-4" />
                                            {program.status}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        {dashboardData.allPrograms.length > 0 && (
                            <button
                                onClick={() => navigate('/admin/programs')}
                                className="w-full text-center text-primary-400 hover:text-primary-300 text-sm font-medium py-2 transition-colors"
                            >
                                Manage all {dashboardData.allPrograms.length} programs →
                            </button>
                        )}
                    </div>
                </Card>

                {/* Recent Approved Programs */}
                <Card className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            Recent Approved Programs
                        </h2>
                        {dashboardData.approvedPrograms > 0 && (
                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                                {dashboardData.approvedPrograms} Total
                            </span>
                        )}
                    </div>
                    <div className="space-y-4">
                        {dashboardData.approvedProgramsList.length === 0 ? (
                            <div className="text-center py-8 text-white/50">
                                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p>No approved programs yet</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {dashboardData.approvedProgramsList.map(program => (
                                    <div key={program.id} className="p-4 bg-dark-700/30 rounded-xl border border-white/5 hover:border-green-500/30 transition-all">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-white font-medium mb-1 truncate">{program.title}</div>
                                                <div className="text-white/40 text-sm truncate">{program.companyName}</div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-green-400 text-xs font-semibold">${program.price}</span>
                                                    <span className="text-white/30 text-xs">•</span>
                                                    <span className="text-white/40 text-xs">{program.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {dashboardData.approvedPrograms > 3 && (
                            <button
                                onClick={() => navigate('/admin/programs')}
                                className="w-full text-center text-primary-400 hover:text-primary-300 text-sm font-medium py-2 transition-colors"
                            >
                                View all {dashboardData.approvedPrograms} approved programs →
                            </button>
                        )}
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={action.action}
                                    className="relative p-6 bg-dark-700/30 border border-white/5 rounded-xl hover:border-primary-500/30 hover:bg-dark-700/50 transition-all group"
                                >
                                    {action.badge && (
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {action.badge}
                                        </div>
                                    )}
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                                        <Icon className="w-6 h-6 text-primary-400" />
                                    </div>
                                    <div className="text-white font-medium text-center">{action.label}</div>
                                </button>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
