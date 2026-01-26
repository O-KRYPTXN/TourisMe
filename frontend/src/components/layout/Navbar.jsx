import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Calendar, Plane } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/tours', label: 'Tour Programs' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'bg-dark-900/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] border-b border-white/5'
                : 'bg-transparent'
            }`}>
            <div className="container-custom">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(242,133,109,0.3)] group-hover:shadow-[0_0_30px_rgba(242,133,109,0.5)] transition-all duration-300">
                            <Plane className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-400 via-primary-500 to-secondary-500 bg-clip-text text-transparent">
                            LuxorExplore
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isActive(link.path)
                                        ? 'text-primary-400'
                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.label}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons / User Menu */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                                >
                                    <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold shadow-[0_0_15px_rgba(242,133,109,0.3)] group-hover:shadow-[0_0_25px_rgba(242,133,109,0.5)] transition-all duration-300">
                                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                                    </div>
                                    <span className="font-medium text-white/80 group-hover:text-white transition-colors">
                                        {user?.firstName}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-56 bg-dark-700/95 backdrop-blur-xl rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 py-2 z-20 animate-slide-down">
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <User className="w-4 h-4 text-primary-400" />
                                                <span className="text-white/80">My Profile</span>
                                            </Link>
                                            <Link
                                                to="/my-bookings"
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <Calendar className="w-4 h-4 text-primary-400" />
                                                <span className="text-white/80">My Bookings</span>
                                            </Link>
                                            <hr className="my-2 border-white/10" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors w-full text-left text-red-400"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/signup')}
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-white" />
                        ) : (
                            <Menu className="w-6 h-6 text-white" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10 animate-slide-down bg-dark-900/95 backdrop-blur-xl">
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive(link.path)
                                            ? 'bg-primary-500/10 text-primary-400 border-l-2 border-primary-500'
                                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <hr className="my-3 border-white/10" />

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                                    >
                                        <User className="w-5 h-5 text-primary-400" />
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/my-bookings"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                                    >
                                        <Calendar className="w-5 h-5 text-primary-400" />
                                        My Bookings
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-left"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 px-4 pt-2">
                                    <Button
                                        variant="outline"
                                        fullWidth
                                        onClick={() => {
                                            navigate('/login');
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        onClick={() => {
                                            navigate('/signup');
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
