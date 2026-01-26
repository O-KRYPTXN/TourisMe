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

// Pages
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

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
                                <Route path="/signup" element={<Signup />} />

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
