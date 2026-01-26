import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, Calendar, Edit2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Profile = () => {
    const { user } = useAuth();

    const profileFields = [
        { icon: User, label: 'First Name', value: user?.firstName },
        { icon: User, label: 'Last Name', value: user?.lastName },
        { icon: Mail, label: 'Email', value: user?.email },
        { icon: Phone, label: 'Phone', value: user?.phone },
    ];

    return (
        <div className="min-h-screen bg-dark-900 pt-20 pb-12">
            <div className="container-custom max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-white mb-2">
                        My <span className="bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">Profile</span>
                    </h1>
                    <p className="text-white/50">Manage your account information</p>
                </div>

                {/* Profile Card */}
                <Card className="relative overflow-visible">
                    {/* Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-3xl blur-xl opacity-50" />

                    <div className="relative">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_40px_rgba(242,133,109,0.3)]">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{user?.firstName} {user?.lastName}</h2>
                                <p className="text-white/50">{user?.email}</p>
                            </div>
                        </div>

                        {/* Profile Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {profileFields.map((field, index) => {
                                const Icon = field.icon;
                                return (
                                    <div key={index} className="group">
                                        <label className="flex items-center gap-2 text-sm font-medium text-white/50 mb-2">
                                            <Icon className="w-4 h-4 text-primary-400" />
                                            {field.label}
                                        </label>
                                        <p className="text-lg text-white bg-dark-700/50 px-4 py-3 rounded-xl border border-white/5">
                                            {field.value || '-'}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="mt-8 pt-8 border-t border-white/10">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
