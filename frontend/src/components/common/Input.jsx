import React from 'react';

const Input = ({
    label,
    error,
    icon: Icon,
    type = 'text',
    className = '',
    dark = true,
    ...props
}) => {
    const inputStyles = dark
        ? 'w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 hover:border-white/20 hover:bg-dark-600/50 transition-all duration-300 backdrop-blur-sm'
        : 'w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300';

    return (
        <div className="w-full">
            {label && (
                <label className={`block text-sm font-medium mb-2 ${dark ? 'text-white/80' : 'text-gray-700'}`}>
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className={`h-5 w-5 ${dark ? 'text-white/40' : 'text-gray-400'}`} />
                    </div>
                )}
                <input
                    type={type}
                    className={`${inputStyles} ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:ring-red-500/50' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
};

export default Input;
