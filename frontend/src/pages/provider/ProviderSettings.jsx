import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Save, Building2, Mail, Phone, MapPin, Clock, Bell, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { logActivity, ActivityTypes } from '../../utils/ActivityLogger';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';

const ProviderSettings = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const pageRef = useRef(null);
    const [saved, setSaved] = useState(false);

    const [formData, setFormData] = useState({
        companyName: user?.companyName || '',
        licenseNumber: user?.licenseNumber || '',
        businessDescription: user?.businessDescription || '',
        phone: user?.phone || '',
        email: user?.email || '',
        address: user?.address || '',
        businessHours: user?.businessHours || 'Mon-Sat: 8:00 AM - 6:00 PM',
        emailNotifications: user?.emailNotifications !== false,
        smsNotifications: user?.smsNotifications !== false,
        bookingNotifications: user?.bookingNotifications !== false
    });

    useEffect(() => {
        // Page animation
        gsap.fromTo(pageRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Update user in localStorage
        const usersKey = 'luxor_users';
        const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
        const updatedUsers = users.map(u =>
            u.id === user.id ? { ...u, ...formData } : u
        );
        localStorage.setItem(usersKey, JSON.stringify(updatedUsers));

        // Update context
        if (updateUser) {
            updateUser({ ...user, ...formData });
        }

        // Log activity
        logActivity({
            providerId: user.id,
            providerName: `${user.firstName} ${user.lastName}`,
            companyName: formData.companyName || user.companyName || 'My Company',
            type: ActivityTypes.PROFILE_UPDATED,
            description: 'Updated company profile settings',
            metadata: {
                updatedFields: Object.keys(formData)
            }
        });

        // Show success message
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div ref={pageRef} className="min-h-screen bg-dark-900 py-8">
            <div className="container-custom max-w-4xl">
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
                        <Building2 className="w-10 h-10 text-primary-400" />
                        Provider Settings
                    </h1>
                    <p className="text-white/50 mt-2">Manage your business profile and preferences</p>
                </div>

                {/* Success Alert */}
                {saved && (
                    <Alert
                        type="success"
                        message="Settings saved successfully!"
                        className="mb-6"
                    />
                )}

                <form onSubmit={handleSubmit}>
                    {/* Business Profile */}
                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary-400" />
                            Business Profile
                        </h2>
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/70 mb-2">
                                        Company Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => handleChange('companyName', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/70 mb-2">
                                        License Number <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.licenseNumber}
                                        onChange={(e) => handleChange('licenseNumber', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-white/70 mb-2">
                                    Business Description
                                </label>
                                <textarea
                                    value={formData.businessDescription}
                                    onChange={(e) => handleChange('businessDescription', e.target.value)}
                                    rows={4}
                                    placeholder="Brief description of your business..."
                                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-white/70 mb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Business Hours
                                </label>
                                <input
                                    type="text"
                                    value={formData.businessHours}
                                    onChange={(e) => handleChange('businessHours', e.target.value)}
                                    placeholder="e.g., Mon-Sat: 8:00 AM - 6:00 PM"
                                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Contact Information */}
                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-secondary-400" />
                            Contact Information
                        </h2>
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/70 mb-2 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/70 mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        placeholder="+20 123 456 7890"
                                        className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-white/70 mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Business Address
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    placeholder="Full business address"
                                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Notification Preferences */}
                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-yellow-400" />
                            Notification Preferences
                        </h2>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.emailNotifications}
                                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                    className="w-5 h-5 bg-dark-700/50 border border-white/10 rounded text-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                />
                                <div className="flex-1">
                                    <div className="text-white font-medium group-hover:text-primary-400 transition-colors">
                                        Email Notifications
                                    </div>
                                    <div className="text-white/50 text-sm">
                                        Receive email notifications for important updates
                                    </div>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.smsNotifications}
                                    onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                                    className="w-5 h-5 bg-dark-700/50 border border-white/10 rounded text-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                />
                                <div className="flex-1">
                                    <div className="text-white font-medium group-hover:text-primary-400 transition-colors">
                                        SMS Notifications
                                    </div>
                                    <div className="text-white/50 text-sm">
                                        Get text messages for urgent matters
                                    </div>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.bookingNotifications}
                                    onChange={(e) => handleChange('bookingNotifications', e.target.checked)}
                                    className="w-5 h-5 bg-dark-700/50 border border-white/10 rounded text-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                />
                                <div className="flex-1">
                                    <div className="text-white font-medium group-hover:text-primary-400 transition-colors">
                                        Booking Notifications
                                    </div>
                                    <div className="text-white/50 text-sm">
                                        Instant alerts for new bookings and cancellations
                                    </div>
                                </div>
                            </label>
                        </div>
                    </Card>

                    {/* Account Status */}
                    <Card className="p-6 mb-6 bg-dark-800/50">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-400" />
                            Account Status
                        </h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-white font-medium mb-1">Verification Status</div>
                                <div className="text-white/50 text-sm">
                                    {user?.isVerified
                                        ? 'Your business is verified and active'
                                        : 'Verification pending - typically takes 2-3 business days'}
                                </div>
                            </div>
                            {user?.isVerified ? (
                                <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-semibold">Verified</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full border border-yellow-500/30">
                                    <Clock className="w-5 h-5" />
                                    <span className="font-semibold">Pending</span>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate('/dashboard/provider')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="min-w-[200px]"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProviderSettings;
