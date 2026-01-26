import React from 'react';

const Card = ({
    children,
    padding = true,
    hover = false,
    glass = true,
    className = '',
    onClick,
    ...props
}) => {
    const baseStyles = glass
        ? 'bg-dark-700/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden'
        : 'bg-dark-700 rounded-2xl overflow-hidden';

    const hoverStyles = hover
        ? 'hover:border-primary-500/30 hover:shadow-[0_8px_40px_rgba(242,133,109,0.15)] hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 cursor-pointer'
        : 'transition-all duration-300';

    const paddingStyles = padding ? 'p-6' : '';

    const shadowStyles = 'shadow-[0_4px_30px_rgba(0,0,0,0.3)]';

    return (
        <div
            className={`${baseStyles} ${hoverStyles} ${paddingStyles} ${shadowStyles} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
