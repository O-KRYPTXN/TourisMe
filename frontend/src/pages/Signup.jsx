import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { User, Mail, Lock, Phone, Loader2, Plane, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        terms: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const containerRef = useRef(null);
    const formRef = useRef(null);

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.terms) {
            setError('Please accept the terms and conditions');
            return;
        }

        setLoading(true);
        const result = await register(formData);

        if (result.success) {
            navigate('/');
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
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
                    <p className="text-white/50">Join LuxorExplore and start your adventure</p>
                </div>

                {error && (
                    <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            name="firstName"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={handleChange}
                            icon={User}
                            required
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            icon={User}
                            required
                        />
                    </div>

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        icon={Mail}
                        required
                    />

                    <Input
                        label="Phone"
                        type="tel"
                        name="phone"
                        placeholder="+1234567890"
                        value={formData.phone}
                        onChange={handleChange}
                        icon={Phone}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        icon={Lock}
                        required
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        icon={Lock}
                        required
                    />

                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            name="terms"
                            checked={formData.terms}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 rounded border-white/20 bg-dark-700 text-primary-500 focus:ring-primary-500/50 focus:ring-offset-dark-900"
                            required
                        />
                        <label className="text-sm text-white/50">
                            I agree to the{' '}
                            <Link to="/terms" className="text-primary-400 hover:text-primary-300 transition-colors">
                                Terms and Conditions
                            </Link>
                        </label>
                    </div>

                    <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </Button>
                </form>

                <p className="text-center mt-6 text-white/50">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                        Sign In
                    </Link>
                </p>

                <p className="text-center mt-4 text-sm text-white/30">
                    Demo: Use any email & password (min 8 chars with uppercase, lowercase, number, special char)
                </p>
            </div>
        </div>
    );
};

export default Signup;
