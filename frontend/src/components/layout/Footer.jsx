import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Plane, ArrowUpRight } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { path: '/', label: 'Home' },
        { path: '/tours', label: 'Tour Programs' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];

    const contactInfo = [
        { icon: MapPin, text: 'Luxor, Egypt' },
        { icon: Phone, text: '+20 123 456 7890' },
        { icon: Mail, text: 'info@luxorexplore.com' },
    ];

    return (
        <footer className="relative bg-dark-900 border-t border-white/5">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-800/50 to-dark-900 pointer-events-none" />

            <div className="container-custom py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(242,133,109,0.3)] group-hover:shadow-[0_0_30px_rgba(242,133,109,0.5)] transition-all duration-300">
                                <Plane className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
                                LuxorExplore
                            </span>
                        </Link>
                        <p className="text-white/50 leading-relaxed">
                            Your trusted partner for exploring ancient Luxor with exclusive discounts from top tourism companies.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-white mb-6 text-lg">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center gap-2 text-white/50 hover:text-primary-400 transition-colors duration-300"
                                    >
                                        <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        <span>{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-white mb-6 text-lg">Contact Us</h4>
                        <ul className="space-y-4">
                            {contactInfo.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <li key={index} className="flex items-center gap-3 text-white/50">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <Icon className="w-4 h-4 text-primary-400" />
                                        </div>
                                        <span>{item.text}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Newsletter / Social */}
                    <div>
                        <h4 className="font-bold text-white mb-6 text-lg">Stay Connected</h4>
                        <p className="text-white/50 mb-4">
                            Subscribe for exclusive offers and travel inspiration.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300"
                            />
                            <button className="px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white font-semibold hover:from-primary-400 hover:to-primary-500 transition-all duration-300 shadow-[0_4px_20px_rgba(242,133,109,0.3)] hover:shadow-[0_8px_30px_rgba(242,133,109,0.5)]">
                                →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-white/40 text-sm">
                            © {currentYear} LuxorExplore. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-white/40">
                            <Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl pointer-events-none" />
        </footer>
    );
};

export default Footer;
