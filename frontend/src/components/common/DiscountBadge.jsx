import React from 'react';
import { Tag, TrendingDown, Sparkles } from 'lucide-react';

const DiscountBadge = ({ discount, size = 'md', className = '' }) => {
    const sizes = {
        sm: 'text-xs px-2.5 py-1',
        md: 'text-sm px-3.5 py-1.5',
        lg: 'text-base px-4 py-2',
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    return (
        <div
            className={`
                inline-flex items-center gap-1.5 
                bg-gradient-to-r from-primary-500 to-primary-600 
                text-white font-bold rounded-full 
                shadow-[0_4px_20px_rgba(242,133,109,0.4)]
                hover:shadow-[0_6px_30px_rgba(242,133,109,0.6)]
                transition-all duration-300
                ${sizes[size]} ${className}
            `}
        >
            <Sparkles className={iconSizes[size]} />
            <span>{discount}% OFF</span>
        </div>
    );
};

export default DiscountBadge;
