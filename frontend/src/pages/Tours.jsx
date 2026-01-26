import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { Search, Star, Calendar, Filter, X } from 'lucide-react';
import { tourPrograms, filterPrograms, categories, companies } from '../data/tourPrograms';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import DiscountBadge from '../components/common/DiscountBadge';

const Tours = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [filteredPrograms, setFilteredPrograms] = useState(tourPrograms);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Refs for animations
    const headerRef = useRef(null);
    const filtersRef = useRef(null);
    const cardsContainerRef = useRef(null);
    const hasInitiallyAnimated = useRef(false);

    useEffect(() => {
        const filtered = filterPrograms({
            category: selectedCategory,
            company: selectedCompany,
            searchQuery,
        });
        setFilteredPrograms(filtered);

        // Only animate on filter changes AFTER initial load
        if (hasInitiallyAnimated.current && cardsContainerRef.current) {
            const cards = cardsContainerRef.current.querySelectorAll('.tour-card');
            gsap.fromTo(cards,
                { opacity: 0, y: 20, scale: 0.98 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    stagger: 0.08,
                    ease: 'power2.out'
                }
            );
        }
    }, [selectedCategory, selectedCompany, searchQuery]);

    useEffect(() => {
        // Header slide down animation
        gsap.fromTo(headerRef.current,
            { opacity: 0, y: -40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );

        // Filter sidebar slide in from left
        gsap.fromTo(filtersRef.current,
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.7,
                delay: 0.2,
                ease: 'power3.out'
            }
        );

        // Initial cards stagger animation
        if (cardsContainerRef.current) {
            gsap.fromTo(cardsContainerRef.current.querySelectorAll('.tour-card'),
                { opacity: 0, y: 60, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    delay: 0.4,
                    ease: 'power3.out',
                    onComplete: () => {
                        hasInitiallyAnimated.current = true;
                    }
                }
            );
        }
    }, []);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedCompany('');
    };

    const hasActiveFilters = searchQuery || selectedCategory || selectedCompany;

    return (
        <div className="min-h-screen bg-dark-900 pt-20">
            {/* Header */}
            <section ref={headerRef} className="relative py-20 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]" />

                <div className="container-custom relative z-10">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 text-white">
                        Luxor <span className="bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">Tour Programs</span>
                    </h1>
                    <p className="text-xl text-white/50 mb-6 max-w-2xl">
                        Pre-made trip programs from top tourism companies with exclusive discounts
                    </p>
                    <DiscountBadge discount="UP TO 20" size="lg" />
                </div>
            </section>

            {/* Content */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden">
                            <Button
                                variant="glass"
                                fullWidth
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="flex items-center justify-center gap-2"
                            >
                                <Filter className="w-5 h-5" />
                                Filters
                                {hasActiveFilters && (
                                    <span className="w-2 h-2 bg-primary-500 rounded-full" />
                                )}
                            </Button>
                        </div>

                        {/* Filters Sidebar */}
                        <div
                            ref={filtersRef}
                            className={`
                                lg:col-span-1
                                ${isMobileFilterOpen ? 'fixed inset-0 z-50 bg-dark-900/95 backdrop-blur-xl p-6 overflow-y-auto' : 'hidden lg:block'}
                            `}
                        >
                            {/* Mobile Close Button */}
                            {isMobileFilterOpen && (
                                <div className="flex justify-between items-center mb-6 lg:hidden">
                                    <h3 className="text-xl font-bold text-white">Filters</h3>
                                    <button
                                        onClick={() => setIsMobileFilterOpen(false)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <X className="w-6 h-6 text-white" />
                                    </button>
                                </div>
                            )}

                            <Card className="sticky top-24">
                                <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-primary-400" />
                                    Filters
                                </h3>
                                <div className="space-y-6">
                                    <Input
                                        placeholder="Search programs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        icon={Search}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-white/80">Category</label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300"
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-white/80">Company</label>
                                        <select
                                            value={selectedCompany}
                                            onChange={(e) => setSelectedCompany(e.target.value)}
                                            className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300"
                                        >
                                            <option value="">All Companies</option>
                                            {companies.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    {hasActiveFilters && (
                                        <Button
                                            variant="outline"
                                            fullWidth
                                            onClick={clearFilters}
                                        >
                                            Clear Filters
                                        </Button>
                                    )}

                                    {/* Mobile Apply Button */}
                                    {isMobileFilterOpen && (
                                        <Button
                                            variant="primary"
                                            fullWidth
                                            onClick={() => setIsMobileFilterOpen(false)}
                                            className="lg:hidden"
                                        >
                                            Apply Filters
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Programs Grid */}
                        <div className="lg:col-span-3">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-white/50">
                                    <span className="font-semibold text-primary-400">{filteredPrograms.length}</span> program(s) found
                                </p>
                            </div>

                            <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredPrograms.map((program) => (
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
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="text-xl font-bold mb-2 text-white">{program.name}</h3>
                                                <p className="text-white/50 mb-4 line-clamp-2 flex-1">{program.description}</p>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-primary-400 text-primary-400" />
                                                        <span className="font-semibold text-white/80">{program.rating}</span>
                                                    </div>
                                                    <span className="text-sm text-white/50 flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {program.duration}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                    <div>
                                                        <div className="text-sm text-white/40 line-through">${program.originalPrice}</div>
                                                        <div className="text-2xl font-bold text-primary-400">${program.price}</div>
                                                    </div>
                                                    <span className="text-green-400 font-semibold text-sm bg-green-400/10 px-3 py-1 rounded-full">
                                                        Save ${program.originalPrice - program.price}!
                                                    </span>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>

                            {filteredPrograms.length === 0 && (
                                <div className="text-center py-16">
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-dark-700/50 flex items-center justify-center">
                                        <Search className="w-10 h-10 text-white/30" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">No programs found</h3>
                                    <p className="text-white/50 mb-6">Try adjusting your filters or search query</p>
                                    <Button variant="outline" onClick={clearFilters}>
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Tours;
