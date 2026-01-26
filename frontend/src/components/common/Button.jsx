import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    type = 'button',
    onClick,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl';

    const variants = {
        primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-400 hover:to-primary-500 focus:ring-primary-500 shadow-[0_4px_20px_rgba(242,133,109,0.3)] hover:shadow-[0_8px_30px_rgba(242,133,109,0.5)] hover:-translate-y-0.5',
        secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-400 hover:to-secondary-500 focus:ring-secondary-500 shadow-[0_4px_20px_rgba(3,74,166,0.3)] hover:shadow-[0_8px_30px_rgba(3,74,166,0.5)] hover:-translate-y-0.5',
        outline: 'border-2 border-primary-500 text-primary-500 bg-transparent hover:bg-primary-500/10 hover:border-primary-400 hover:text-primary-400 focus:ring-primary-500',
        ghost: 'text-white/80 hover:bg-white/10 hover:text-white focus:ring-white/20',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 focus:ring-red-500 shadow-[0_4px_20px_rgba(239,68,68,0.3)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.5)] hover:-translate-y-0.5',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 focus:ring-white/30',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const width = fullWidth ? 'w-full' : '';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
