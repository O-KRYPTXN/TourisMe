import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Save, MapPin, DollarSign, Clock, Users, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';
import { logActivity, ActivityTypes } from '../../utils/ActivityLogger';
import { createNotification } from '../../utils/NotificationManager';

const PROGRAMS_KEY = 'luxor_programs';

const AddProgram = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const pageRef = useRef(null);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        price: '',
        duration: '',
        maxCapacity: '',
        highlights: '',
        inclusions: '',
        exclusions: ''
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

        // Validate required fields
        if (!formData.title || !formData.description || !formData.location || !formData.price || !formData.duration) {
            alert('Please fill in all required fields');
            return;
        }

        // Create new program object
        const newProgram = {
            id: `prog-${Date.now()}`,
            ...formData,
            price: parseFloat(formData.price),
            duration: parseFloat(formData.duration),
            maxCapacity: parseInt(formData.maxCapacity) || 20,
            providerId: user.id,
            providerName: user.firstName + ' ' + user.lastName,
            companyName: user.companyName || 'My Company',
            status: 'Pending',
            submittedAt: new Date().toISOString(),
            highlights: formData.highlights.split('\n').filter(h => h.trim()),
            inclusions: formData.inclusions.split('\n').filter(i => i.trim()),
            exclusions: formData.exclusions.split('\n').filter(e => e.trim())
        };

        // Load existing programs
        const existingPrograms = localStorage.getItem(PROGRAMS_KEY);
        const programs = existingPrograms ? JSON.parse(existingPrograms) : [];

        // Add new program
        programs.push(newProgram);
        localStorage.setItem(PROGRAMS_KEY, JSON.stringify(programs));

        // Log activity
        logActivity({
            providerId: user.id,
            providerName: `${user.firstName} ${user.lastName}`,
            companyName: user.companyName || 'My Company',
            type: ActivityTypes.SERVICE_ADDED,
            description: `Added a new service: ${formData.title}`,
            metadata: {
                programId: newProgram.id,
                programTitle: formData.title,
                price: formData.price,
                location: formData.location
            }
        });

        // Notify admin about new program submission
        createNotification({
            userId: 'admin', // Special admin user ID
            type: 'new_program',
            title: 'New Program Pending Approval',
            message: `${user.companyName || 'Provider'} submitted "${formData.title}" for review`,
            programId: newProgram.id,
            status: 'info'
        });

        // Show success and reset form
        setSubmitted(true);
        setTimeout(() => {
            navigate('/dashboard/provider');
        }, 2000);
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
                        <ImageIcon className="w-10 h-10 text-primary-400" />
                        Add New Program
                    </h1>
                    <p className="text-white/50 mt-2">Create a new tour program for review</p>
                </div>

                {/* Success Alert */}
                {submitted && (
                    <Alert
                        type="success"
                        message="Program submitted successfully! Redirecting to dashboard..."
                        className="mb-6"
                    />
                )}

                <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/70 mb-2">
                                    Program Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    placeholder="e.g., Valley of the Kings Expedition"
                                    required
                                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-white/70 mb-2">
                                    Description <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Detailed description of your tour program..."
                                    rows={5}
                                    required
                                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/70 mb-2">
                                        <MapPin className="w-4 h-4 inline mr-1" />
                                        Location <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => handleChange('location', e.target.value)}
                                        placeholder="e.g., Luxor, Egypt"
                                        required
                                        className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/70 mb-2">
                                        <DollarSign className="w-4 h-4 inline mr-1" />
                                        Price (USD) <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => handleChange('price', e.target.value)}
                                        placeholder="e.g., 850"
                                        required
                                        className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/70 mb-2">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Duration (hours) <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0.5"
                                        step="0.5"
                                        value={formData.duration}
                                        onChange={(e) => handleChange('duration', e.target.value)}
                                        placeholder="e.g., 8"
                                        required
                                        className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/70 mb-2">
                                        <Users className="w-4 h-4 inline mr-1" />
                                        Max Capacity
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.maxCapacity}
                                        onChange={(e) => handleChange('maxCapacity', e.target.value)}
                                        placeholder="e.g., 20"
                                        className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Program Details */}
                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-bold text-white mb-6">Program Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/70 mb-2">
                                    Highlights <span className="text-white/40 text-xs">(one per line)</span>
                                </label>
                                <textarea
                                    value={formData.highlights}
                                    onChange={(e) => handleChange('highlights', e.target.value)}
                                    placeholder="Visit the Tomb of Tutankhamun&#10;Explore ancient hieroglyphics&#10;Professional Egyptologist guide"
                                    rows={4}
                                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-white/70 mb-2">
                                    Inclusions <span className="text-white/40 text-xs">(one per line)</span>
                                </label>
                                <textarea
                                    value={formData.inclusions}
                                    onChange={(e) => handleChange('inclusions', e.target.value)}
                                    placeholder="Air-conditioned transportation&#10;Professional tour guide&#10;Entry tickets to all sites"
                                    rows={4}
                                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-white/70 mb-2">
                                    Exclusions <span className="text-white/40 text-xs">(one per line)</span>
                                </label>
                                <textarea
                                    value={formData.exclusions}
                                    onChange={(e) => handleChange('exclusions', e.target.value)}
                                    placeholder="Meals and drinks&#10;Personal expenses&#10;Tips and gratuities"
                                    rows={4}
                                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                                />
                            </div>
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
                            disabled={submitted}
                        >
                            {submitted ? (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Submitted!
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Submit for Review
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProgram;
