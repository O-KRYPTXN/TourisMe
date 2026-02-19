import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Calendar, Plane, LayoutDashboard, Bell, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserNotifications, markAllAsRead, markAsRead } from '../../utils/NotificationManager';
import Button from '../common/Button';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { user, isAuthenticated, logout, getDashboardRoute } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const loadNotifications = useCallback(() => {
        if (!user?.id) return;
        setNotifications(getUserNotifications(user.id));
    }, [user?.id]);

    useEffect(() => {
        loadNotifications();
        // Poll every 10 seconds so newly fired notifications appear in real-time
        const interval = setInterval(loadNotifications, 10000);
        return () => clearInterval(interval);
    }, [loadNotifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAllRead = () => {
        markAllAsRead(user.id);
        loadNotifications();
    };

    const handleMarkRead = (id) => {
        markAsRead(id);
        loadNotifications();
    };

    const notifIcon = (type) => {
        if (type === 'report') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
        if (type === 'report_resolved') return <CheckCircle className="w-4 h-4 text-green-400" />;
        if (type === 'booking_confirmed') return <CheckCircle className="w-4 h-4 text-green-400" />;
        return <Clock className="w-4 h-4 text-blue-400" />;
    };

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
                            <div className="flex items-center gap-2">

                                {/* ── Notification Bell ── */}
                                <div className="relative">
                                    <button
                                        id="notif-bell-btn"
                                        onClick={() => { setIsNotifOpen(o => !o); setIsUserMenuOpen(false); }}
                                        className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all"
                                        title="Notifications"
                                    >
                                        <Bell className="w-5 h-5 text-white/70" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {isNotifOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)} />
                                            <div className="absolute right-0 mt-2 w-80 bg-dark-700/95 backdrop-blur-xl rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 z-20 overflow-hidden">
                                                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                                                    <span className="text-white font-semibold flex items-center gap-2">
                                                        <Bell className="w-4 h-4 text-amber-400" />
                                                        Notifications
                                                        {unreadCount > 0 && (
                                                            <span className="bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                                                        )}
                                                    </span>
                                                    {unreadCount > 0 && (
                                                        <button onClick={handleMarkAllRead} className="text-xs text-white/50 hover:text-white transition-colors">
                                                            Mark all read
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="max-h-80 overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <div className="text-center py-8 text-white/40 text-sm">No notifications</div>
                                                    ) : (
                                                        notifications.map(n => (
                                                            <div
                                                                key={n.id}
                                                                onClick={() => { handleMarkRead(n.id); if (n.link) navigate(n.link); setIsNotifOpen(false); }}
                                                                className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-white/5 hover:bg-white/5 transition-colors ${!n.read ? 'bg-amber-500/5' : ''}`}
                                                            >
                                                                <div className="mt-0.5 flex-shrink-0">{notifIcon(n.type)}</div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-sm leading-snug ${n.read ? 'text-white/60' : 'text-white font-medium'}`}>{n.message}</p>
                                                                    <p className="text-white/30 text-xs mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                                                                </div>
                                                                {!n.read && <span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0 mt-1.5" />}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* ── User Avatar Menu ── */}
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
                                                    to={getDashboardRoute()}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <LayoutDashboard className="w-4 h-4 text-primary-400" />
                                                    <span className="text-white/80">Dashboard</span>
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
                                        to={getDashboardRoute()}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                                    >
                                        <LayoutDashboard className="w-5 h-5 text-primary-400" />
                                        Dashboard
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
