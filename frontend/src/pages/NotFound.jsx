import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="text-center px-4 relative z-10">
                {/* 404 Number */}
                <h1 className="text-[12rem] md:text-[16rem] font-bold leading-none mb-4 bg-gradient-to-r from-primary-400 via-primary-500 to-secondary-500 bg-clip-text text-transparent animate-pulse">
                    404
                </h1>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Page Not Found</h2>
                <p className="text-white/50 mb-10 max-w-md mx-auto text-lg">
                    The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate('/')}
                        className="shadow-[0_0_30px_rgba(242,133,109,0.4)]"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Go Home
                    </Button>
                    <Button
                        variant="glass"
                        size="lg"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
