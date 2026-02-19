import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { AuthProvider } from './contexts/AuthContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import ChatbotButton from './components/chatbot/ChatbotButton';
import ChatbotPage from './components/chatbot/ChatbotPage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import DashboardRedirect from './components/auth/DashboardRedirect';

// Pages
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import Booking from './pages/Booking';
import Login from './pages/Login';
import SignupWrapper from './pages/SignupWrapper';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import TouristDashboard from './pages/TouristDashboard';
import ServiceProviderDashboard from './pages/ServiceProviderDashboard';
import UserManagement from './pages/admin/UserManagement';
import ProgramApprovals from './pages/admin/ProgramApprovals';
import ReportsManagement from './pages/admin/ReportsManagement';
import AdminSettings from './pages/admin/AdminSettings';
import AddProgram from './pages/provider/AddProgram';
import ProviderAnalytics from './pages/provider/ProviderAnalytics';
import ManageBookings from './pages/provider/ManageBookings';
import ProviderSettings from './pages/provider/ProviderSettings';
import ProviderReports from './pages/provider/ProviderReports';
import ReportIssue from './pages/tourist/ReportIssue';

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

// Lenis Smooth Scroll Provider
const SmoothScrollProvider = ({ children }) => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Make lenis available globally for other components
        window.lenis = lenis;

        return () => {
            lenis.destroy();
            window.lenis = null;
        };
    }, []);

    return children;
};

function App() {
    return (
        <AuthProvider>
            <ChatbotProvider>
                <Router>
                    <SmoothScrollProvider>
                        <ScrollToTop />
                        <div className="flex flex-col min-h-screen bg-dark-900">
                            <Routes>
                                {/* Auth routes without navbar/footer */}
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<SignupWrapper />} />

                                {/* Routes with navbar/footer */}
                                <Route path="/*" element={
                                    <>
                                        <Navbar />
                                        <main className="flex-grow">
                                            <Routes>
                                                <Route path="/" element={<Home />} />
                                                <Route path="/tours" element={<Tours />} />
                                                <Route path="/tours/:id" element={<TourDetail />} />
                                                <Route path="/about" element={<About />} />
                                                <Route path="/contact" element={<Contact />} />

                                                {/* Dashboard routes */}
                                                <Route path="/dashboard" element={<DashboardRedirect />} />
                                                <Route path="/dashboard/admin" element={
                                                    <RoleBasedRoute allowedRoles={['Admin']}>
                                                        <AdminDashboard />
                                                    </RoleBasedRoute>
                                                } />
                                                <Route path="/dashboard/tourist" element={
                                                    <RoleBasedRoute allowedRoles={['Tourist']}>
                                                        <TouristDashboard />
                                                    </RoleBasedRoute>
                                                } />
                                                <Route path="/dashboard/provider" element={
                                                    <RoleBasedRoute allowedRoles={['LocalBusinessOwner']}>
                                                        <ServiceProviderDashboard />
                                                    </RoleBasedRoute>
                                                } />

                                                {/* Admin Management Pages */}
                                                <Route path="/admin/users" element={
                                                    <RoleBasedRoute allowedRoles={['Admin']}>
                                                        <UserManagement />
                                                    </RoleBasedRoute>
                                                } />
                                                <Route path="/admin/programs" element={
                                                    <RoleBasedRoute allowedRoles={['Admin']}>
                                                        <ProgramApprovals />
                                                    </RoleBasedRoute>
                                                } />
                                                <Route path="/admin/reports" element={
                                                    <RoleBasedRoute allowedRoles={['Admin']}>
                                                        <ReportsManagement />
                                                    </RoleBasedRoute>
                                                } />
                                                <Route path="/admin/settings" element={
                                                    <RoleBasedRoute allowedRoles={['Admin']}>
                                                        <AdminSettings />
                                                    </RoleBasedRoute>
                                                } />

                                                {/* Service Provider Pages */}
                                                <Route path="/provider/add-program" element={
                                                    <RoleBasedRoute allowedRoles={['LocalBusinessOwner']}>
                                                        <AddProgram />
                                                    </RoleBasedRoute>
                                                } />
                                                <Route path="/provider/analytics" element={
                                                    <RoleBasedRoute allowedRoles={['LocalBusinessOwner']}>
                                                        <ProviderAnalytics />
                                                    </RoleBasedRoute>
                                                } />
                                                <Route path="/provider/bookings" element={
                                                    <RoleBasedRoute allowedRoles={['LocalBusinessOwner']}>
                                                        <ManageBookings />
                                                    </RoleBasedRoute>
                                                } />
                                                <Route path="/provider/settings" element={
                                                    <RoleBasedRoute allowedRoles={['LocalBusinessOwner']}>
                                                        <ProviderSettings />
                                                    </RoleBasedRoute>
                                                } />
                                                <Route path="/provider/reports" element={
                                                    <RoleBasedRoute allowedRoles={['LocalBusinessOwner']}>
                                                        <ProviderReports />
                                                    </RoleBasedRoute>
                                                } />

                                                {/* Tourist Pages */}
                                                <Route path="/tourist/report-issue" element={
                                                    <RoleBasedRoute allowedRoles={['Tourist']}>
                                                        <ReportIssue />
                                                    </RoleBasedRoute>
                                                } />

                                                {/* Protected routes */}
                                                <Route path="/profile" element={
                                                    <ProtectedRoute>
                                                        <Profile />
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="/my-bookings" element={
                                                    <ProtectedRoute>
                                                        <MyBookings />
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="/booking/:id" element={
                                                    <ProtectedRoute>
                                                        <Booking />
                                                    </ProtectedRoute>
                                                } />

                                                <Route path="*" element={<NotFound />} />
                                            </Routes>
                                        </main>
                                        <Footer />
                                    </>
                                } />
                            </Routes>
                        </div>
                        <ChatbotButton />
                        <ChatbotPage />
                    </SmoothScrollProvider>
                </Router>
            </ChatbotProvider>
        </AuthProvider>
    );
}

export default App;
