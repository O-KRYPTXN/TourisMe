import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Settings, ArrowLeft, Save, Globe, Bell, Shield, Database, Mail, Users, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';

const SETTINGS_KEY = 'luxor_admin_settings';

const AdminSettings = () => {
    const navigate = useNavigate();
    const pageRef = useRef(null);
    const [saved, setSaved] = useState(false);

    const [settings, setSettings] = useState({
        // Platform Settings
        siteName: 'TourisMe - Luxor Tourism',
        siteDescription: 'Discover the wonders of ancient Egypt with premium tour experiences',
        contactEmail: 'support@touris.me',
        contactPhone: '+20 123 456 7890',

        // Notification Settings
        emailNotifications: true,
        bookingNotifications: true,
        newUserNotifications: true,
        reportNotifications: true,

        // Security Settings
        requireEmailVerification: false,
        twoFactorAuth: false,
        sessionTimeout: 24, // hours
        maxLoginAttempts: 5,

        // System Settings
        maintenanceMode: false,
        allowRegistration: true,
        autoApproveProviders: false,
        maxFileSize: 10, // MB
    });

    useEffect(() => {
        loadSettings();

        // Page animation
        gsap.fromTo(pageRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }, []);

    const loadSettings = () => {
        const storedSettings = localStorage.getItem(SETTINGS_KEY);
        if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
        }
    };

    const handleInputChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
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
                        onClick={() => navigate('/dashboard/admin')}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-4xl font-display font-bold text-white flex items-center gap-3">
                        <Settings className="w-10 h-10 text-primary-400" />
                        Admin Settings
                    </h1>
                    <p className="text-white/50 mt-2">Manage platform configuration and preferences</p>
                </div>

                {/* Success Alert */}
                {saved && (
                    <Alert
                        type="success"
                        message="Settings saved successfully!"
                        className="mb-6"
                    />
                )}

                {/* Platform Settings */}
                <Card className="p-6 mb-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary-400" />
                        Platform Settings
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-white/70 mb-2">Site Name</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => handleInputChange('siteName', e.target.value)}
                                className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white/70 mb-2">Site Description</label>
                            <textarea
                                value={settings.siteDescription}
                                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-white/70 mb-2">Contact Email</label>
                                <input
                                    type="email"
                                    value={settings.contactEmail}
                                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/70 mb-2">Contact Phone</label>
                                <input
                                    type="tel"
                                    value={settings.contactPhone}
                                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Notification Settings */}
                <Card className="p-6 mb-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary-400" />
                        Notification Settings
                    </h2>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl cursor-pointer hover:bg-dark-700/50 transition-all">
                            <div>
                                <div className="text-white font-medium">Email Notifications</div>
                                <div className="text-white/50 text-sm">Receive email notifications for important events</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.emailNotifications}
                                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500/20"
                            />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl cursor-pointer hover:bg-dark-700/50 transition-all">
                            <div>
                                <div className="text-white font-medium">Booking Notifications</div>
                                <div className="text-white/50 text-sm">Get notified when new bookings are made</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.bookingNotifications}
                                onChange={(e) => handleInputChange('bookingNotifications', e.target.checked)}
                                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500/20"
                            />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl cursor-pointer hover:bg-dark-700/50 transition-all">
                            <div>
                                <div className="text-white font-medium">New User Notifications</div>
                                <div className="text-white/50 text-sm">Alert when new users register</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.newUserNotifications}
                                onChange={(e) => handleInputChange('newUserNotifications', e.target.checked)}
                                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500/20"
                            />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl cursor-pointer hover:bg-dark-700/50 transition-all">
                            <div>
                                <div className="text-white font-medium">Report Notifications</div>
                                <div className="text-white/50 text-sm">Notify when users submit reports</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.reportNotifications}
                                onChange={(e) => handleInputChange('reportNotifications', e.target.checked)}
                                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500/20"
                            />
                        </label>
                    </div>
                </Card>

                {/* Security Settings */}
                <Card className="p-6 mb-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary-400" />
                        Security Settings
                    </h2>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl cursor-pointer hover:bg-dark-700/50 transition-all">
                            <div>
                                <div className="text-white font-medium">Require Email Verification</div>
                                <div className="text-white/50 text-sm">Users must verify their email before accessing the platform</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.requireEmailVerification}
                                onChange={(e) => handleInputChange('requireEmailVerification', e.target.checked)}
                                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500/20"
                            />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl cursor-pointer hover:bg-dark-700/50 transition-all">
                            <div>
                                <div className="text-white font-medium">Two-Factor Authentication</div>
                                <div className="text-white/50 text-sm">Enable 2FA for admin accounts</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.twoFactorAuth}
                                onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500/20"
                            />
                        </label>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-white/70 mb-2">Session Timeout (hours)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="168"
                                    value={settings.sessionTimeout}
                                    onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/70 mb-2">Max Login Attempts</label>
                                <input
                                    type="number"
                                    min="3"
                                    max="10"
                                    value={settings.maxLoginAttempts}
                                    onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* System Settings */}
                <Card className="p-6 mb-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary-400" />
                        System Settings
                    </h2>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl cursor-pointer hover:bg-dark-700/50 transition-all">
                            <div>
                                <div className="text-white font-medium">Maintenance Mode</div>
                                <div className="text-white/50 text-sm">Temporarily disable access for maintenance</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.maintenanceMode}
                                onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500/20"
                            />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl cursor-pointer hover:bg-dark-700/50 transition-all">
                            <div>
                                <div className="text-white font-medium">Allow Registration</div>
                                <div className="text-white/50 text-sm">Enable new user registration</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.allowRegistration}
                                onChange={(e) => handleInputChange('allowRegistration', e.target.checked)}
                                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500/20"
                            />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl cursor-pointer hover:bg-dark-700/50 transition-all">
                            <div>
                                <div className="text-white font-medium">Auto-Approve Service Providers</div>
                                <div className="text-white/50 text-sm">Automatically approve new service provider registrations</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.autoApproveProviders}
                                onChange={(e) => handleInputChange('autoApproveProviders', e.target.checked)}
                                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500/20"
                            />
                        </label>
                        <div>
                            <label className="block text-sm text-white/70 mb-2">Max File Upload Size (MB)</label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={settings.maxFileSize}
                                onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value))}
                                className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />
                            <p className="text-white/40 text-xs mt-1">Maximum file size for image uploads</p>
                        </div>
                    </div>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        className="min-w-[200px]"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Settings
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
