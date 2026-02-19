import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft } from 'lucide-react';
import RoleSelection from '../components/auth/RoleSelection';
import SignupTourist from './SignupTourist';
import SignupServiceProvider from './SignupServiceProvider';
import Button from '../components/common/Button';

const SignupWrapper = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Initial fade in
        gsap.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        );
    }, []);

    const handleRoleSelect = (roleId) => {
        setSelectedRole(roleId);

        // Trigger flip animation
        gsap.to(containerRef.current, {
            rotationY: 180,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => setIsFlipped(true)
        });
    };

    const handleBack = () => {
        // Flip back to role selection
        gsap.to(containerRef.current, {
            rotationY: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onStart: () => setIsFlipped(false),
            onComplete: () => setSelectedRole(null)
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900 relative overflow-hidden p-8">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Back to Home Button - Only show when not flipped */}
            {!isFlipped && (
                <Button
                    variant="glass"
                    onClick={() => navigate('/')}
                    className="absolute top-8 left-8 z-10"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>
            )}

            {/* Flip Container */}
            <div
                ref={containerRef}
                className="relative z-10"
                style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Front Side - Role Selection */}
                <div
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(0deg)',
                        display: selectedRole ? 'none' : 'block'
                    }}
                >
                    <RoleSelection onSelectRole={handleRoleSelect} />
                </div>

                {/* Back Side - Signup Forms */}
                <div
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        position: selectedRole ? 'relative' : 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        display: selectedRole ? 'flex' : 'none',
                        justifyContent: 'center'
                    }}
                >
                    {selectedRole === 'tourist' && (
                        <SignupTourist onBack={handleBack} />
                    )}
                    {selectedRole === 'service-provider' && (
                        <SignupServiceProvider onBack={handleBack} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignupWrapper;
