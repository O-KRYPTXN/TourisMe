import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Calendar, Users, ArrowLeft, Check, X, Building2, TrendingDown, MapPin } from 'lucide-react';
import { getProgramById } from '../data/tourPrograms';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import DiscountBadge from '../components/common/DiscountBadge';

gsap.registerPlugin(ScrollTrigger);

const TourDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const program = getProgramById(id);

    const heroRef = useRef(null);
    const contentRef = useRef(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        if (!program) return;

        // Kill any existing animations
        gsap.killTweensOf([heroRef.current, contentRef.current, sidebarRef.current]);

        // Hero fade-in
        gsap.fromTo(heroRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: 'power2.out' }
        );

        // Content cards stagger
        const contentCards = contentRef.current?.querySelectorAll('.detail-card');
        if (contentCards && contentCards.length > 0) {
            gsap.fromTo(contentCards,
                { opacity: 0, y: 50, scale: 0.98 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: 'top 75%',
                        once: true
                    }
                }
            );
        }

        // Sidebar slide in
        gsap.fromTo(sidebarRef.current,
            { opacity: 0, x: 60 },
            {
                opacity: 1,
                x: 0,
                duration: 0.9,
                delay: 0.3,
                ease: 'back.out(1.2)'
            }
        );

        // Cleanup
        return () => {
            gsap.killTweensOf([heroRef.current, contentRef.current, sidebarRef.current]);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    if (!program) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-900 pt-20">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-dark-700/50 flex items-center justify-center">
                        <MapPin className="w-10 h-10 text-white/30" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-white">Program not found</h2>
                    <Button onClick={() => navigate('/tours')}>Back to Programs</Button>
                </div>
            </div>
        );
    }

    const handleBookNow = () => {
        if (isAuthenticated) {
            navigate(`/booking/${program.id}`);
        } else {
            navigate('/login', { state: { from: `/booking/${program.id}` } });
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 pt-20">
            {/* Hero */}
            <div ref={heroRef} className="relative h-[500px] overflow-hidden">
                <img src={program.image} alt={program.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-dark-900/30" />

                <Button
                    variant="glass"
                    className="absolute top-8 left-8 z-10"
                    onClick={() => navigate('/tours')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <div className="absolute top-8 right-8">
                    <DiscountBadge discount={program.discount} size="lg" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="container-custom">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 text-white">{program.name}</h1>
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2 text-white/70">
                                <Building2 className="w-5 h-5 text-primary-400" />
                                <span>{program.company}</span>
                            </div>
                            <span className="text-white/30">•</span>
                            <div className="flex items-center gap-1 text-white/70">
                                <Star className="w-5 h-5 fill-primary-400 text-primary-400" />
                                <span>{program.companyRating}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main */}
                    <div ref={contentRef} className="lg:col-span-2 space-y-8">
                        <Card className="detail-card">
                            <h2 className="text-3xl font-bold mb-4 text-white">About This Program</h2>
                            <p className="text-white/60 text-lg leading-relaxed">{program.description}</p>
                        </Card>

                        <Card className="detail-card">
                            <h2 className="text-2xl font-bold mb-6 text-white">Highlights</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {program.highlights.map((h, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <Star className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-white/80">{h}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="detail-card">
                            <h2 className="text-2xl font-bold mb-6 text-white">What's Included</h2>
                            <ul className="space-y-3">
                                {program.included.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-4 h-4 text-green-400" />
                                        </div>
                                        <span className="text-white/70">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card className="detail-card">
                            <h2 className="text-2xl font-bold mb-6 text-white">What's Not Included</h2>
                            <ul className="space-y-3">
                                {program.notIncluded.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <X className="w-4 h-4 text-red-400" />
                                        </div>
                                        <span className="text-white/70">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card className="detail-card">
                            <h2 className="text-2xl font-bold mb-8 text-white">Itinerary</h2>
                            <div className="space-y-6">
                                {program.itinerary.map((day, index) => (
                                    <div key={day.day} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-[0_0_20px_rgba(242,133,109,0.3)] group-hover:shadow-[0_0_30px_rgba(242,133,109,0.5)] transition-all duration-300">
                                                {day.day}
                                            </div>
                                            {index < program.itinerary.length - 1 && (
                                                <div className="w-0.5 h-full bg-gradient-to-b from-primary-500/50 to-transparent mt-2" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-6">
                                            <h3 className="text-lg font-bold mb-2 text-white">Day {day.day}: {day.title}</h3>
                                            <p className="text-white/60">{day.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div ref={sidebarRef} className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="relative overflow-visible">
                                {/* Glow Effect */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur-xl opacity-50" />

                                <div className="relative">
                                    <div className="text-center mb-6 pb-6 border-b border-white/10">
                                        <DiscountBadge discount={program.discount} size="md" className="mb-4" />
                                        <div className="flex items-center justify-center gap-3 mb-2">
                                            <span className="text-2xl text-white/40 line-through">${program.originalPrice}</span>
                                            <TrendingDown className="w-6 h-6 text-red-400" />
                                        </div>
                                        <p className="text-5xl font-bold text-primary-400 mb-2">${program.price}</p>
                                        <p className="text-white/50">per person</p>
                                        <div className="mt-4 inline-block bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm font-semibold border border-green-500/20">
                                            💰 Save ${program.originalPrice - program.price}!
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between py-3 border-b border-white/10">
                                            <span className="flex items-center gap-2 text-white/60">
                                                <Calendar className="w-5 h-5 text-primary-400" />
                                                Duration
                                            </span>
                                            <span className="font-medium text-white">{program.duration}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-white/10">
                                            <span className="flex items-center gap-2 text-white/60">
                                                <Users className="w-5 h-5 text-primary-400" />
                                                Group Size
                                            </span>
                                            <span className="font-medium text-white">{program.groupSize}</span>
                                        </div>
                                        <div className="flex justify-between py-3">
                                            <span className="text-white/60">Rating</span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-5 h-5 fill-primary-400 text-primary-400" />
                                                <span className="font-medium text-white">{program.rating}</span>
                                                <span className="text-white/40 text-sm">({program.reviews})</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="primary"
                                        fullWidth
                                        size="lg"
                                        onClick={handleBookNow}
                                        className="mb-3 shadow-[0_0_30px_rgba(242,133,109,0.4)]"
                                    >
                                        Book with Discount
                                    </Button>

                                    {!isAuthenticated && (
                                        <p className="text-xs text-center text-white/40">
                                            You'll need to sign in to complete booking
                                        </p>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDetail;
