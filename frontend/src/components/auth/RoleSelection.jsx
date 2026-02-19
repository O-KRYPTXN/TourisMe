import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Plane, Briefcase, Users, Building2 } from 'lucide-react';

const RoleSelection = ({ onSelectRole }) => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        // Container fade in
        gsap.fromTo(containerRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );

        // Stagger card animations
        gsap.fromTo(cardsRef.current,
            { opacity: 0, scale: 0.9, y: 20 },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.15,
                delay: 0.3,
                ease: 'back.out(1.7)'
            }
        );
    }, []);

    const roles = [
        {
            id: 'tourist',
            title: 'Tourist',
            description: 'Book amazing tours and explore Luxor',
            icon: Plane,
            gradient: 'from-primary-500 to-primary-600',
            glow: 'shadow-[0_0_30px_rgba(242,133,109,0.3)]',
            features: ['Exclusive discounts', 'Easy booking', 'Verified tours']
        },
        {
            id: 'service-provider',
            title: 'Service Provider',
            description: 'Offer your services to travelers',
            icon: Building2,
            gradient: 'from-secondary-500 to-secondary-600',
            glow: 'shadow-[0_0_30px_rgba(3,74,166,0.3)]',
            features: ['Reach tourists', 'Manage bookings', 'Grow business']
        }
    ];

    return (
        <div ref={containerRef} className="max-w-4xl w-full">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8 justify-center">
                <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(242,133,109,0.3)]">
                    <Plane className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
                    LuxorExplore
                </span>
            </div>

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
                    Join <span className="bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">LuxorExplore</span>
                </h1>
                <p className="text-xl text-white/60">Choose how you want to get started</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {roles.map((role, index) => {
                    const Icon = role.icon;
                    return (
                        <button
                            key={role.id}
                            ref={el => cardsRef.current[index] = el}
                            onClick={() => onSelectRole(role.id)}
                            className={`group relative bg-dark-700/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 
                                transition-all duration-500 hover:border-white/20 hover:${role.glow} 
                                hover:scale-[1.02] active:scale-[0.98] text-left cursor-pointer`}
                        >
                            {/* Background gradient on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 
                                group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />

                            {/* Icon */}
                            <div className={`relative w-16 h-16 bg-gradient-to-br ${role.gradient} rounded-2xl 
                                flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className="w-8 h-8 text-white" />
                            </div>

                            {/* Title */}
                            <h3 className="relative text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                                {role.title}
                            </h3>

                            {/* Description */}
                            <p className="relative text-white/50 mb-6 group-hover:text-white/70 transition-colors">
                                {role.description}
                            </p>

                            {/* Features */}
                            <ul className="relative space-y-2 mb-6">
                                {role.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-white/40 group-hover:text-white/60 transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <div className="relative flex items-center gap-2 text-primary-400 font-semibold group-hover:gap-3 transition-all">
                                Continue as {role.title}
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>

                            {/* Shine effect */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </div>
                        </button>
                    );
                })}
            </div>

            <p className="text-center mt-8 text-white/40 text-sm">
                By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
        </div>
    );
};

export default RoleSelection;
