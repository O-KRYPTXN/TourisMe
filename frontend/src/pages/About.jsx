import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Users, Award, Heart } from 'lucide-react';
import Card from '../components/common/Card';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const headerRef = useRef(null);
    const missionRef = useRef(null);
    const valuesRef = useRef(null);

    const values = [
        { icon: Target, title: 'Our Mission', description: 'To make ancient Luxor accessible to everyone through exclusive discounts and curated experiences.' },
        { icon: Users, title: 'Community First', description: 'We partner with local tourism companies to support the Luxor community and economy.' },
        { icon: Award, title: 'Quality Assured', description: 'Every tour program is carefully vetted to ensure the highest quality experience.' },
        { icon: Heart, title: 'Passion for Travel', description: 'We\'re travelers ourselves, passionate about sharing the wonders of ancient Egypt.' },
    ];

    useEffect(() => {
        // Header animation
        gsap.fromTo(headerRef.current,
            { opacity: 0, y: -40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );

        // Mission card animation
        gsap.fromTo(missionRef.current,
            { opacity: 0, y: 60 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: missionRef.current,
                    start: 'top 80%',
                    once: true
                }
            }
        );

        // Values grid animation
        gsap.fromTo(valuesRef.current.querySelectorAll('.value-card'),
            { opacity: 0, y: 40, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: valuesRef.current,
                    start: 'top 75%',
                    once: true
                }
            }
        );
    }, []);

    return (
        <div className="min-h-screen bg-dark-900 pt-20">
            {/* Header */}
            <section ref={headerRef} className="relative py-24 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]" />

                <div className="container-custom relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white">
                        About <span className="bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">LuxorExplore</span>
                    </h1>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto">
                        Your trusted partner for discovering the wonders of ancient Luxor
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="section-padding">
                <div className="container-custom max-w-4xl">
                    <div ref={missionRef}>
                        <Card className="relative overflow-visible">
                            {/* Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-3xl blur-xl opacity-50" />

                            <div className="relative">
                                <h2 className="text-3xl font-bold mb-6 text-white">Our Story</h2>
                                <div className="space-y-6 text-white/60 text-lg leading-relaxed">
                                    <p>
                                        LuxorExplore connects travelers with the best tourism companies in Luxor, Egypt,
                                        offering exclusive discounts on pre-made tour programs. We believe everyone should
                                        experience the wonders of ancient Egypt affordably.
                                    </p>
                                    <p>
                                        Our platform showcases carefully curated tour programs from trusted local companies,
                                        each offering unique experiences of Luxor's magnificent temples, tombs, and historical sites.
                                    </p>
                                    <p>
                                        With discounts up to <span className="text-primary-400 font-semibold">20%</span>, we make it easier than ever to explore the Valley of the Kings,
                                        Karnak Temple, and other incredible landmarks that make Luxor the world's greatest
                                        open-air museum.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section-padding relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-dark-800/50" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-[100px]" />

                <div className="container-custom relative z-10">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4 text-white">
                        Our <span className="bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">Values</span>
                    </h2>
                    <p className="text-xl text-white/50 text-center mb-16 max-w-2xl mx-auto">
                        What drives us to create exceptional travel experiences
                    </p>

                    <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div key={index} className="value-card">
                                    <Card className="h-full group hover:border-primary-500/30 transition-all duration-500">
                                        <div className="flex items-start gap-5">
                                            <div className="w-14 h-14 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_30px_rgba(242,133,109,0.3)] transition-all duration-500">
                                                <Icon className="w-7 h-7 text-primary-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                                                <p className="text-white/50">{value.description}</p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
