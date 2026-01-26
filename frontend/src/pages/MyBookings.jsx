import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Compass } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const MyBookings = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-dark-900 pt-20 pb-12">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-white mb-2">
                        My <span className="bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">Bookings</span>
                    </h1>
                    <p className="text-white/50">Track your upcoming and past adventures</p>
                </div>

                {/* Empty State */}
                <Card className="relative overflow-visible">
                    {/* Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-3xl blur-xl opacity-50" />

                    <div className="relative text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center">
                            <Compass className="w-12 h-12 text-primary-400 opacity-50" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No bookings yet</h3>
                        <p className="text-white/50 mb-8 max-w-md mx-auto">
                            Start exploring the wonders of ancient Luxor! Browse our exclusive tour programs and book your first adventure.
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/tours')}
                            className="shadow-[0_0_30px_rgba(242,133,109,0.4)]"
                        >
                            <MapPin className="w-5 h-5 mr-2" />
                            Explore Tours
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MyBookings;
