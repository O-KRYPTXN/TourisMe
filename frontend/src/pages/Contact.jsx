import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [success, setSuccess] = useState(false);

    const headerRef = useRef(null);
    const formRef = useRef(null);
    const infoRef = useRef(null);

    const contactInfo = [
        { icon: MapPin, title: 'Address', value: 'Luxor, Egypt', color: 'from-primary-500' },
        { icon: Phone, title: 'Phone', value: '+20 123 456 7890', color: 'from-secondary-500' },
        { icon: Mail, title: 'Email', value: 'info@luxorexplore.com', color: 'from-primary-500' },
    ];

    useEffect(() => {
        // Header animation
        gsap.fromTo(headerRef.current,
            { opacity: 0, y: -40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );

        // Form animation
        gsap.fromTo(formRef.current,
            { opacity: 0, x: -60 },
            { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
        );

        // Info cards animation
        gsap.fromTo(infoRef.current.querySelectorAll('.info-card'),
            { opacity: 0, x: 60 },
            { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, delay: 0.3, ease: 'power3.out' }
        );
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-dark-900 pt-20">
            {/* Header */}
            <section ref={headerRef} className="relative py-24 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]" />

                <div className="container-custom relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white">
                        Get in <span className="bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">Touch</span>
                    </h1>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="section-padding">
                <div className="container-custom max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <div ref={formRef}>
                            <Card className="relative overflow-visible">
                                {/* Glow */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-3xl blur-xl opacity-50" />

                                <div className="relative">
                                    <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                                        <Send className="w-6 h-6 text-primary-400" />
                                        Send Us a Message
                                    </h2>

                                    {success && (
                                        <Alert type="success" message="Message sent successfully! We'll get back to you soon." className="mb-6" />
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <Input
                                            label="Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Your full name"
                                            required
                                        />
                                        <Input
                                            label="Email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-white/80">Message</label>
                                            <textarea
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                rows={5}
                                                className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 hover:border-white/20 transition-all duration-300"
                                                placeholder="How can we help you?"
                                                required
                                            />
                                        </div>
                                        <Button type="submit" variant="primary" fullWidth size="lg">
                                            Send Message
                                        </Button>
                                    </form>
                                </div>
                            </Card>
                        </div>

                        {/* Contact Info */}
                        <div ref={infoRef} className="space-y-6">
                            {contactInfo.map((info, index) => {
                                const Icon = info.icon;
                                return (
                                    <div key={index} className="info-card">
                                        <Card className="group hover:border-primary-500/30 transition-all duration-500">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-14 h-14 bg-gradient-to-br ${info.color}/20 to-transparent rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_30px_rgba(242,133,109,0.3)] transition-all duration-500`}>
                                                    <Icon className="w-6 h-6 text-primary-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white mb-1">{info.title}</h3>
                                                    <p className="text-white/50">{info.value}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}

                            {/* Map Placeholder */}
                            <Card className="h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="w-12 h-12 text-primary-400 mx-auto mb-3 opacity-50" />
                                    <p className="text-white/30">Map integration coming soon</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
