import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Calendar, Users, MessageSquare, CreditCard } from 'lucide-react';
import { getProgramById } from '../data/tourPrograms';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const program = getProgramById(id);
    const [formData, setFormData] = useState({
        date: '',
        adults: 1,
        children: 0,
        requests: '',
    });
    const [success, setSuccess] = useState(false);

    const headerRef = useRef(null);
    const formRef = useRef(null);
    const summaryRef = useRef(null);

    useEffect(() => {
        // Header animation
        gsap.fromTo(headerRef.current,
            { opacity: 0, y: -30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );

        // Form animation
        gsap.fromTo(formRef.current,
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' }
        );

        // Summary animation
        gsap.fromTo(summaryRef.current,
            { opacity: 0, x: 40 },
            { opacity: 1, x: 0, duration: 0.6, delay: 0.3, ease: 'power3.out' }
        );
    }, []);

    if (!program) {
        navigate('/tours');
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess(true);
        setTimeout(() => navigate('/my-bookings'), 2000);
    };

    const total = program.price * (formData.adults + formData.children * 0.7);

    return (
        <div className="min-h-screen bg-dark-900 pt-20 pb-12">
            <div className="container-custom max-w-5xl">
                <div ref={headerRef} className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-white mb-2">
                        Complete Your <span className="bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">Booking</span>
                    </h1>
                    <p className="text-white/50">You're just one step away from your adventure!</p>
                </div>

                {success && (
                    <Alert type="success" message="Booking confirmed! Redirecting to your bookings..." className="mb-6" />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div ref={formRef} className="lg:col-span-2">
                        <Card className="relative overflow-visible">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-3xl blur-xl opacity-50" />

                            <div className="relative">
                                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                                    <CreditCard className="w-6 h-6 text-primary-400" />
                                    Booking Details
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <Input
                                        label="Tour Date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        icon={Calendar}
                                        required
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-white/80">
                                                <Users className="w-4 h-4 inline mr-2 text-primary-400" />
                                                Adults
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={formData.adults}
                                                onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
                                                className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-white/80">
                                                <Users className="w-4 h-4 inline mr-2 text-primary-400" />
                                                Children
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.children}
                                                onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
                                                className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-white/80">
                                            <MessageSquare className="w-4 h-4 inline mr-2 text-primary-400" />
                                            Special Requests
                                        </label>
                                        <textarea
                                            value={formData.requests}
                                            onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300"
                                            placeholder="Any dietary requirements, accessibility needs, or special requests..."
                                        />
                                    </div>

                                    <Button type="submit" variant="primary" fullWidth size="lg" className="shadow-[0_0_30px_rgba(242,133,109,0.4)]">
                                        Confirm Booking
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </div>

                    {/* Summary */}
                    <div ref={summaryRef}>
                        <Card className="sticky top-24">
                            <h3 className="text-xl font-bold mb-4 text-white">Booking Summary</h3>
                            <div className="space-y-4">
                                <div className="pb-4 border-b border-white/10">
                                    <h4 className="font-semibold text-white mb-1">{program.name}</h4>
                                    <div className="text-sm text-white/50 space-y-1">
                                        <p>Duration: {program.duration}</p>
                                        <p>Company: {program.company}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-white/60">
                                        <span>Adults ({formData.adults} × ${program.price})</span>
                                        <span className="text-white">${program.price * formData.adults}</span>
                                    </div>
                                    {formData.children > 0 && (
                                        <div className="flex justify-between text-white/60">
                                            <span>Children ({formData.children} × ${(program.price * 0.7).toFixed(0)})</span>
                                            <span className="text-white">${(program.price * 0.7 * formData.children).toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between font-bold text-lg pt-4 border-t border-white/10">
                                    <span className="text-white">Total</span>
                                    <span className="text-primary-400">${total.toFixed(2)}</span>
                                </div>

                                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                                    <span className="text-green-400 font-semibold">
                                        💰 You're saving ${(program.originalPrice - program.price) * (formData.adults + formData.children * 0.7)}!
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
