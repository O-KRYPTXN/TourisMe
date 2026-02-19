import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationBanner = ({ notification, onClose }) => {
    const getIconAndColor = () => {
        switch (notification.status) {
            case 'success':
                return { icon: CheckCircle, bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', textColor: 'text-green-400', iconColor: 'text-green-500' };
            case 'warning':
                return { icon: AlertCircle, bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30', textColor: 'text-yellow-400', iconColor: 'text-yellow-500' };
            case 'error':
                return { icon: AlertCircle, bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', textColor: 'text-red-400', iconColor: 'text-red-500' };
            default:
                return { icon: Info, bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', textColor: 'text-blue-400', iconColor: 'text-blue-500' };
        }
    };

    const { icon: Icon, bgColor, borderColor, textColor, iconColor } = getIconAndColor();

    return (
        <div className={`${bgColor} ${borderColor} border rounded-xl p-4 mb-3 flex items-start gap-3 animate-fadeIn`}>
            <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
                <h4 className={`font-semibold ${textColor} mb-1`}>{notification.title}</h4>
                <p className="text-white/70 text-sm">{notification.message}</p>
                <p className="text-white/40 text-xs mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                </p>
            </div>
            <button
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors flex-shrink-0"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default NotificationBanner;
