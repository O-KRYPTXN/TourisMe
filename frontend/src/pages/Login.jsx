import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { Mail, Lock, Loader2, Plane, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const containerRef = useRef(null);
    const formRef = useRef(null);

    const from = location.state?.from || '/';

    useEffect(() => {
        // Container fade in
        gsap.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        );

        // Form animation
        gsap.fromTo(formRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
        );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-dark-900 relative overflow-hidden p-8">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Back to Home Button */}
            <Button
                variant="glass"
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 z-10"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
            </Button>

            {/* Form Container */}
            <div ref={formRef} className="max-w-md w-full relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(242,133,109,0.3)]">
                        <Plane className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">
                        LuxorExplore
                    </span>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Log In</h1>
                    <p className="text-white/50">Log in to your LuxorExplore account</p>
                </div>

                {error && (
                    <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={Mail}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={Lock}
                        required
                    />

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-white/20 bg-dark-700 text-primary-500 focus:ring-primary-500/50 focus:ring-offset-dark-900"
                            />
                            <span className="text-sm text-white/50">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
                    </Button>
                </form>

                <p className="text-center mt-6 text-white/50">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
