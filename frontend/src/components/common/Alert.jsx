import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
    const types = {
        success: {
            bg: 'bg-green-500/10',
            border: 'border-green-500/30',
            text: 'text-green-400',
            icon: CheckCircle,
            iconColor: 'text-green-400',
        },
        error: {
            bg: 'bg-red-500/10',
            border: 'border-red-500/30',
            text: 'text-red-400',
            icon: AlertCircle,
            iconColor: 'text-red-400',
        },
        warning: {
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/30',
            text: 'text-yellow-400',
            icon: AlertCircle,
            iconColor: 'text-yellow-400',
        },
        info: {
            bg: 'bg-secondary-500/10',
            border: 'border-secondary-500/30',
            text: 'text-secondary-400',
            icon: Info,
            iconColor: 'text-secondary-400',
        },
    };

    const config = types[type];
    const Icon = config.icon;

    return (
        <div className={`${config.bg} ${config.border} border rounded-xl p-4 backdrop-blur-sm ${className}`}>
            <div className="flex items-start">
                <Icon className={`w-5 h-5 ${config.iconColor} mt-0.5 mr-3 flex-shrink-0`} />
                <div className="flex-1">
                    <p className={`${config.text} text-sm`}>{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`${config.text} hover:opacity-70 transition-opacity ml-auto`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;
