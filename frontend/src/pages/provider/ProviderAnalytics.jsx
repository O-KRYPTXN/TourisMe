import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar, Eye, Star, Users, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const ProviderAnalytics = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const pageRef = useRef(null);

    useEffect(() => {
        // Page animation
        gsap.fromTo(pageRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }, []);

    // Mock analytics data
    const stats = [
        {
            label: 'Total Revenue',
            value: '$24,850',
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'from-green-500 to-green-600'
        },
        {
            label: 'Total Bookings',
            value: '87',
            change: '+8.3%',
            trend: 'up',
            icon: Calendar,
            color: 'from-primary-500 to-primary-600'
        },
        {
            label: 'Profile Views',
            value: '1,243',
            change: '+15.2%',
            trend: 'up',
            icon: Eye,
            color: 'from-blue-500 to-blue-600'
        },
        {
            label: 'Average Rating',
            value: '4.8',
            change: '+0.2',
            trend: 'up',
            icon: Star,
            color: 'from-yellow-500 to-yellow-600'
        }
    ];

    const monthlyRevenue = [
        { month: 'Sep', revenue: 3200 },
        { month: 'Oct', revenue: 4100 },
        { month: 'Nov', revenue: 3800 },
        { month: 'Dec', revenue: 5200 },
        { month: 'Jan', revenue: 4600 },
        { month: 'Feb', revenue: 3950 }
    ];

    const popularPrograms = [
        {
            id: 1,
            name: 'Luxor Full Day Tour',
            bookings: 32,
            revenue: '$8,960',
            rating: 4.9,
            views: 456
        },
        {
            id: 2,
            name: 'Valley of the Kings Guide',
            bookings: 28,
            revenue: '$7,840',
            rating: 4.7,
            views: 398
        },
        {
            id: 3,
            name: 'Hot Air Balloon Experience',
            bookings: 27,
            revenue: '$8,050',
            rating: 5.0,
            views: 389
        }
    ];

    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));

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
                        <TrendingUp className="w-10 h-10 text-primary-400" />
                        Analytics & Performance
                    </h1>
                    <p className="text-white/50 mt-2">Track your business performance and insights</p>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
                        return (
                            <Card key={index} className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        <TrendIcon className="w-4 h-4" />
                                        {stat.change}
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-white/50 text-sm">{stat.label}</div>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* Monthly Revenue Chart */}
                    <Card className="lg:col-span-2 p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-400" />
                            Monthly Revenue Trend
                        </h2>
                        <div className="space-y-4">
                            {monthlyRevenue.map((item, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white/70 text-sm font-medium">{item.month}</span>
                                        <span className="text-white font-semibold">${item.revenue.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full h-3 bg-dark-700/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                                            style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <span className="text-white/50 text-sm">Total Revenue (6 months)</span>
                                <span className="text-2xl font-bold text-green-400">
                                    ${monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Customer Insights */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-secondary-400" />
                            Customer Insights
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/70 text-sm">Repeat Customers</span>
                                    <span className="text-white font-semibold">38%</span>
                                </div>
                                <div className="w-full h-2 bg-dark-700/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" style={{ width: '38%' }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/70 text-sm">Customer Satisfaction</span>
                                    <span className="text-white font-semibold">96%</span>
                                </div>
                                <div className="w-full h-2 bg-dark-700/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '96%' }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/70 text-sm">Average Group Size</span>
                                    <span className="text-white font-semibold">4.2 people</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/70 text-sm">Conversion Rate</span>
                                    <span className="text-white font-semibold">7.0%</span>
                                </div>
                                <div className="w-full h-2 bg-dark-700/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full" style={{ width: '70%' }} />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Popular Programs */}
                <Card className="p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        Top Performing Programs
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Program Name</th>
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Bookings</th>
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Revenue</th>
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Rating</th>
                                    <th className="text-left text-white/50 font-medium py-3 px-4">Views</th>
                                </tr>
                            </thead>
                            <tbody>
                                {popularPrograms.map((program, index) => (
                                    <tr key={program.id} className="border-b border-white/5 hover:bg-dark-700/30 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                    #{index + 1}
                                                </div>
                                                <span className="text-white font-medium">{program.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-white/70">{program.bookings}</td>
                                        <td className="py-4 px-4 text-green-400 font-semibold">{program.revenue}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="text-white">{program.rating}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-white/70">{program.views}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProviderAnalytics;
