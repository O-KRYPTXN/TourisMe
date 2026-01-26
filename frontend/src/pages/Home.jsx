import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Star, Users, TrendingUp, Shield, Award, HeartHandshake, Sparkles } from 'lucide-react';
import { tourPrograms } from '../data/tourPrograms';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import DiscountBadge from '../components/common/DiscountBadge';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Refs for GSAP animation
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const cardsRef = useRef(null);
    const featuresRef = useRef(null);
    const ctaRef = useRef(null);

    const featuredPrograms = tourPrograms.slice(0, 3);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/tours?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const whyChooseUs = [
        { icon: TrendingUp, title: '16-20% Discounts', description: 'Exclusive savings on every tour program' },
        { icon: Shield, title: 'Verified Companies', description: 'All partners are thoroughly vetted' },
        { icon: HeartHandshake, title: 'Easy Booking', description: 'Simple and secure booking process' },
        { icon: Award, title: 'Top-Rated Programs', description: 'Curated experiences with excellent reviews' },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Section Animation
            const hero = heroRef.current;

            gsap.fromTo(hero.querySelector('.hero-content'),
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
            );

            gsap.fromTo(hero.querySelector('.hero-title'),
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.8, delay: 0.3, ease: 'back.out(1.7)' }
            );

            gsap.fromTo(hero.querySelector('.hero-subtitle'),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, delay: 0.5 }
            );

            gsap.fromTo(hero.querySelectorAll('.hero-badge'),
                { opacity: 0, scale: 0 },
                { opacity: 1, scale: 1, duration: 0.5, delay: 0.7, stagger: 0.1, ease: 'back.out(1.7)' }
            );

            gsap.fromTo(hero.querySelector('.search-bar'),
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, delay: 0.9 }
            );

            gsap.fromTo(hero.querySelectorAll('.hero-button'),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, delay: 1.1, stagger: 0.1 }
            );

            // Floating orbs animation
            gsap.to('.floating-orb', {
                y: -20,
                duration: 3,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                stagger: 0.5
            });

            // Stats Counter Animation
            const stats = statsRef.current.querySelectorAll('.stat-number');
            stats.forEach((stat) => {
                const target = parseFloat(stat.dataset.value);
                const obj = { value: 0 };

                gsap.to(obj, {
                    value: target,
                    duration: 2,
                    ease: 'power1.out',
                    onUpdate: () => {
                        if (target % 1 === 0) {
                            stat.textContent = Math.ceil(obj.value);
                        } else {
                            stat.textContent = obj.value.toFixed(1);
                        }
                    },
                    scrollTrigger: {
                        trigger: stat,
                        start: 'top 80%',
                        once: true
                    }
                });
            });

            // Featured Cards Stagger Animation
            gsap.fromTo(cardsRef.current.querySelectorAll('.tour-card'),
                { opacity: 0, y: 60, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: cardsRef.current,
                        start: 'top 70%',
                    }
                }
            );

            // Features Grid Animation
            gsap.fromTo(featuresRef.current.querySelectorAll('.feature-item'),
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: featuresRef.current,
                        start: 'top 70%',
                    }
                }
            );

            // View all button animation
            gsap.fromTo(cardsRef.current.querySelector('.view-all-button'),
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: cardsRef.current.querySelector('.view-all-button'),
                        start: 'top 85%',
                        once: true
                    }
                }
            );

            // CTA Section Animation
            gsap.fromTo(ctaRef.current.querySelector('.cta-content'),
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: ctaRef.current,
                        start: 'top 70%',
                    }
                }
            );

            // Parallax effect on hero gradient orbs
            gsap.to('.parallax-orb', {
                yPercent: 50,
                ease: 'none',
                scrollTrigger: {
                    trigger: hero,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });

        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen bg-dark-900">
            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-20">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    {/* Base Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />

                    {/* Animated Orbs */}
                    <div className="floating-orb parallax-orb absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
                    <div className="floating-orb parallax-orb absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary-500/20 rounded-full blur-[120px]" />
                    <div className="floating-orb absolute top-1/2 right-1/3 w-64 h-64 bg-accent-neon-purple/10 rounded-full blur-[80px]" />

                    {/* Hero Image Overlay */}
                    <div className="absolute inset-0 opacity-30">
                        <img
                            src="https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1920"
                            alt="Luxor"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-dark-900/60" />
                    </div>

                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                <div className="hero-content relative z-10 container-custom text-center text-white px-4">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                        <Sparkles className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-white/80">Discover Ancient Wonders</span>
                    </div>

                    <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight">
                        <span className="block text-white">Explore Ancient</span>
                        <span className="block bg-gradient-to-r from-primary-400 via-primary-500 to-secondary-500 bg-clip-text text-transparent">
                            Luxor
                        </span>
                    </h1>

                    <p className="hero-subtitle text-xl md:text-2xl mb-4 text-white/60 max-w-3xl mx-auto leading-relaxed">
                        Book exclusive tour programs from top tourism companies and save up to
                        <span className="text-primary-400 font-semibold"> 20% </span>
                        on your adventure
                    </p>

                    <div className="flex items-center justify-center gap-4 md:gap-6 mb-10 flex-wrap">
                        <span className="hero-badge"><DiscountBadge discount="UP TO 20" size="lg" /></span>
                        <span className="hero-badge text-white/30">•</span>
                        <span className="hero-badge text-lg text-white/70 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary-400" />
                            5000+ travelers
                        </span>
                        <span className="hero-badge text-white/30">•</span>
                        <span className="hero-badge text-lg flex items-center gap-2 text-white/70">
                            <Star className="w-5 h-5 fill-primary-400 text-primary-400" />
                            4.9 Rating
                        </span>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="search-bar max-w-3xl mx-auto mb-4">
                        <div className="bg-dark-700/50 backdrop-blur-xl rounded-2xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10 flex gap-2 hover:border-primary-500/30 transition-all duration-300">
                            <div className="flex-1 flex items-center gap-3 px-4">
                                <Search className="w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Search tour programs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 py-3 bg-transparent outline-none text-white placeholder-white/40"
                                />
                            </div>
                            <Button type="submit" variant="primary" size="lg">
                                Find Tours
                            </Button>
                        </div>
                    </form>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <span className="hero-button">
                            <Button variant="primary" size="lg" onClick={() => navigate('/tours')}>
                                Browse Tour Programs →
                            </Button>
                        </span>
                        <span className="hero-button">
                            <Button
                                variant="glass"
                                size="lg"
                                onClick={() => navigate('/about')}
                            >
                                Learn More
                            </Button>
                        </span>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section ref={statsRef} className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10" />
                <div className="absolute inset-0 backdrop-blur-3xl" />

                <div className="container-custom relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="group">
                        <div className="stat-number text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent stat-glow" data-value="5">0</div>
                        <div className="text-white/60 group-hover:text-white/80 transition-colors">Tourism Companies</div>
                    </div>
                    <div className="group">
                        <div className="stat-number text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent stat-glow" data-value="5000">0</div>
                        <div className="text-white/60 group-hover:text-white/80 transition-colors">Happy Travelers</div>
                    </div>
                    <div className="group">
                        <div className="stat-number text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent stat-glow" data-value="20">0</div>
                        <div className="text-white/60 group-hover:text-white/80 transition-colors">% Average Discount</div>
                    </div>
                    <div className="group">
                        <div className="stat-number text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent stat-glow" data-value="4.9">0</div>
                        <div className="text-white/60 group-hover:text-white/80 transition-colors">Average Rating</div>
                    </div>
                </div>
            </section>

            {/* Featured Programs */}
            <section ref={cardsRef} className="section-padding relative">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
                            Featured <span className="bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">Tour Programs</span>
                        </h2>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto mb-6">
                            Handpicked tours from top-rated tourism companies
                        </p>
                        <DiscountBadge discount="UP TO 20" size="lg" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredPrograms.map((program) => (
                            <div key={program.id} className="tour-card h-full">
                                <Card
                                    hover
                                    padding={false}
                                    onClick={() => navigate(`/tours/${program.id}`)}
                                    className="cursor-pointer h-full flex flex-col"
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={program.image}
                                            alt={program.name}
                                            className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
                                        <div className="absolute top-4 right-4">
                                            <DiscountBadge discount={program.discount} />
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Users className="w-4 h-4 text-white/40" />
                                            <span className="text-sm text-white/50">{program.company}</span>
                                            <Star className="w-4 h-4 fill-primary-400 text-primary-400 ml-auto" />
                                            <span className="text-sm font-semibold text-white/80">{program.companyRating}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{program.name}</h3>
                                        <p className="text-white/50 mb-4 line-clamp-2 flex-1">{program.description}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <div>
                                                <div className="text-sm text-white/40 line-through">${program.originalPrice}</div>
                                                <div className="text-2xl font-bold text-primary-400">${program.price}</div>
                                            </div>
                                            <span className="text-sm text-green-400 font-semibold bg-green-400/10 px-3 py-1 rounded-full">
                                                Save ${program.originalPrice - program.price}!
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12 view-all-button">
                        <Button variant="primary" size="lg" onClick={() => navigate('/tours')}>
                            View All Tour Programs
                        </Button>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section ref={featuresRef} className="section-padding relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-dark-800/50" />
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]" />

                <div className="container-custom relative z-10">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-4 text-white">
                        Why <span className="bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">Choose Us</span>?
                    </h2>
                    <p className="text-xl text-white/50 text-center mb-16 max-w-2xl mx-auto">
                        Experience the best of Luxor with exclusive benefits
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {whyChooseUs.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="feature-item">
                                    <Card className="text-center h-full group hover:border-primary-500/30">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 text-primary-400 rounded-2xl mb-6 group-hover:shadow-[0_0_30px_rgba(242,133,109,0.3)] transition-all duration-500">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                        <p className="text-white/50">{item.description}</p>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section ref={ctaRef} className="section-padding relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-secondary-500/10 to-primary-500/20" />
                <div className="absolute inset-0 backdrop-blur-3xl" />

                {/* Animated Orbs */}
                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-secondary-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="cta-content container-custom relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
                        Ready to <span className="bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">Explore</span> Ancient Luxor?
                    </h2>
                    <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                        Book your dream tour today and save up to 20% on exclusive programs
                    </p>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate('/tours')}
                        className="shadow-[0_0_40px_rgba(242,133,109,0.4)]"
                    >
                        Browse Tour Programs →
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Home;
