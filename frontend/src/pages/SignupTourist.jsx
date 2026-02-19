import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { User, Mail, Lock, Phone, Loader2, Plane, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

// Define InputField outside component to prevent re-creation on each render
const InputField = ({ label, icon: Icon, onChange, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
        <div className="relative">
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                    <Icon className="w-5 h-5" />
                </div>
            )}
            <input
                {...props}
                onChange={onChange}
                className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-dark-700/50 border border-white/10 
                    rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 
                    focus:ring-2 focus:ring-primary-500/20 transition-all duration-300`}
            />
        </div>
    </div>
);

const SignupTourist = ({ onBack }) => {
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

    const formRef = useRef(null);

    useEffect(() => {
        // Form animation
        gsap.fromTo(formRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
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
        const result = await register({
            ...formData,
            role: 'Tourist'
        });

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div ref={formRef} className="max-w-md w-full">
            {/* Back Button */}
            {onBack && (
                <Button
                    variant="glass"
                    onClick={onBack}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Role Selection
                </Button>
            )}

            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-[0_0_30px_rgba(242,133,109,0.3)]">
                    <Plane className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">Create Tourist Account</h1>
                <p className="text-white/50">Start your journey through ancient Luxor</p>
            </div>

            {error && (
                <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        label="First Name"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                        icon={User}
                        required
                    />
                    <InputField
                        label="Last Name"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        icon={User}
                        required
                    />
                </div>

                <InputField
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    icon={Mail}
                    required
                />

                <InputField
                    label="Phone"
                    type="tel"
                    name="phone"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={handleChange}
                    icon={Phone}
                    required
                />

                <InputField
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    icon={Lock}
                    required
                />

                <InputField
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
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Tourist Account'}
                </Button>
            </form>

            <p className="text-center mt-6 text-white/50">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                    Sign In
                </Link>
            </p>

            <p className="text-center mt-4 text-sm text-white/30">
                Demo: Use any email & password (min 8 chars)
            </p>
        </div>
    );
};

export default SignupTourist;
