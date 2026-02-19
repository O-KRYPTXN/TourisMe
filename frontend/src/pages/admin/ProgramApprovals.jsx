import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { FileCheck, ArrowLeft, CheckCircle, XCircle, Clock, Building2, MapPin, DollarSign } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { createNotification } from '../../utils/NotificationManager';

const PROGRAMS_KEY = 'luxor_programs';

// Mock data for demonstration
const mockPrograms = [
    {
        id: 'prog-001',
        providerId: 'provider-001',
        providerName: 'Mohamed Ahmed',
        companyName: 'Luxor Adventures Ltd.',
        title: 'Valley of the Kings Exploration',
        description: 'Journey through the ancient burial grounds of Egypt\'s greatest pharaohs. This comprehensive tour includes visits to multiple tombs with expert Egyptologist guides.',
        price: 850,
        duration: '8 hours',
        location: 'Valley of the Kings, Luxor',
        images: ['/tour1.jpg'],
        status: 'Pending',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'prog-002',
        providerId: 'provider-001',
        providerName: 'Mohamed Ahmed',
        companyName: 'Luxor Adventures Ltd.',
        title: 'Karnak Temple Night Tour',
        description: 'Experience the magnificent Karnak Temple complex illuminated at night. Witness the stunning sound and light show while exploring ancient Egyptian architecture.',
        price: 650,
        duration: '4 hours',
        location: 'Karnak Temple, Luxor',
        images: ['/tour2.jpg'],
        status: 'Pending',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'prog-003',
        providerId: 'provider-001',
        providerName: 'Mohamed Ahmed',
        companyName: 'Luxor Adventures Ltd.',
        title: 'Nile River Cruise Experience',
        description: 'Sail along the legendary Nile River on a traditional felucca. Enjoy stunning sunset views and traditional Egyptian refreshments.',
        price: 450,
        duration: '3 hours',
        location: 'Nile River, Luxor',
        images: ['/tour3.jpg'],
        status: 'Approved',
        submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

const ProgramApprovals = () => {
    const [programs, setPrograms] = useState([]);
    const [statusFilter, setStatusFilter] = useState('Pending');
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const navigate = useNavigate();
    const pageRef = useRef(null);

    useEffect(() => {
        loadPrograms();

        // Page animation
        gsap.fromTo(pageRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }, []);

    const loadPrograms = () => {
        // Load from localStorage or use mock data
        const storedPrograms = localStorage.getItem(PROGRAMS_KEY);
        if (storedPrograms) {
            setPrograms(JSON.parse(storedPrograms));
        } else {
            setPrograms(mockPrograms);
            localStorage.setItem(PROGRAMS_KEY, JSON.stringify(mockPrograms));
        }
    };

    const savePrograms = (updatedPrograms) => {
        setPrograms(updatedPrograms);
        localStorage.setItem(PROGRAMS_KEY, JSON.stringify(updatedPrograms));
    };

    const handleApprove = (programId) => {
        const program = programs.find(p => p.id === programId);
        const updatedPrograms = programs.map(p => {
            if (p.id === programId) {
                return {
                    ...p,
                    status: 'Approved',
                    reviewedAt: new Date().toISOString(),
                };
            }
            return p;
        });
        savePrograms(updatedPrograms);

        // Notify all tourists about new available program
        if (program) {
            // Get all users and filter tourists
            const USERS_KEY = 'luxor_users';
            const usersData = localStorage.getItem(USERS_KEY);
            if (usersData) {
                const users = JSON.parse(usersData);
                const tourists = users.filter(u => u.role === 'tourist');

                // Create notification for each tourist
                tourists.forEach(tourist => {
                    createNotification({
                        userId: tourist.id,
                        type: 'new_tour',
                        title: 'New Tour Available! ✨',
                        message: `Check out "${program.title}" - ${program.location} for $${program.price}`,
                        programId: program.id,
                        status: 'success'
                    });
                });
            }
        }
    };

    const handleRejectSubmit = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        const updatedPrograms = programs.map(p => {
            if (p.id === selectedProgram.id) {
                return {
                    ...p,
                    status: 'Rejected',
                    reviewedAt: new Date().toISOString(),
                    rejectionReason,
                };
            }
            return p;
        });
        savePrograms(updatedPrograms);
        setShowRejectModal(false);
        setSelectedProgram(null);
        setRejectionReason('');
    };

    const filteredPrograms = programs.filter(p => p.status === statusFilter);

    const stats = {
        pending: programs.filter(p => p.status === 'Pending').length,
        approved: programs.filter(p => p.status === 'Approved').length,
        rejected: programs.filter(p => p.status === 'Rejected').length,
    };

    const statusConfig = {
        Pending: { color: 'text-yellow-400 bg-yellow-500/10', icon: Clock },
        Approved: { color: 'text-green-400 bg-green-500/10', icon: CheckCircle },
        Rejected: { color: 'text-red-400 bg-red-500/10', icon: XCircle },
    };

    return (
        <div ref={pageRef} className="min-h-screen bg-dark-900 py-8">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/dashboard/admin')}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-4xl font-display font-bold text-white flex items-center gap-3">
                        <FileCheck className="w-10 h-10 text-primary-400" />
                        Program Approvals
                    </h1>
                    <p className="text-white/50 mt-2">Review and approve tour programs from service providers</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/50 text-sm">Pending Review</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.pending}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-400" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/50 text-sm">Approved</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.approved}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/50 text-sm">Rejected</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.rejected}</p>
                            </div>
                            <XCircle className="w-8 h-8 text-red-400" />
                        </div>
                    </Card>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-2 mb-6">
                    {['Pending', 'Approved', 'Rejected'].map((status) => {
                        const StatusIcon = statusConfig[status].icon;
                        return (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${statusFilter === status
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-dark-700/50 text-white/70 hover:bg-dark-700 hover:text-white'
                                    }`}
                            >
                                <StatusIcon className="w-4 h-4" />
                                {status}
                                {status === 'Pending' && stats.pending > 0 && (
                                    <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                        {stats.pending}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Programs Grid */}
                {filteredPrograms.length === 0 ? (
                    <Card className="p-12 text-center">
                        <FileCheck className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/50 text-lg">No {statusFilter.toLowerCase()} programs</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredPrograms.map((program) => {
                            const StatusIcon = statusConfig[program.status].icon;
                            return (
                                <Card key={program.id} className="p-6 hover:border-primary-500/30 transition-all">
                                    {/* Provider Info */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{program.companyName}</p>
                                                <p className="text-white/50 text-sm">{program.providerName}</p>
                                            </div>
                                        </div>
                                        <span className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${statusConfig[program.status].color}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {program.status}
                                        </span>
                                    </div>

                                    {/* Program Details */}
                                    <h3 className="text-xl font-bold text-white mb-2">{program.title}</h3>
                                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{program.description}</p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-white/60 text-sm">
                                            <MapPin className="w-4 h-4" />
                                            {program.location}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                                <DollarSign className="w-4 h-4" />
                                                ${program.price}
                                            </div>
                                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                                <Clock className="w-4 h-4" />
                                                {program.duration}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-xs text-white/40 mb-4">
                                        Submitted: {new Date(program.submittedAt).toLocaleDateString()}
                                        {program.reviewedAt && (
                                            <> • Reviewed: {new Date(program.reviewedAt).toLocaleDateString()}</>
                                        )}
                                    </div>

                                    {program.rejectionReason && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
                                            <p className="text-red-400 text-sm">
                                                <strong>Rejection Reason:</strong> {program.rejectionReason}
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {program.status === 'Pending' && (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="primary"
                                                onClick={() => handleApprove(program.id)}
                                                className="flex-1"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedProgram(program);
                                                    setShowRejectModal(true);
                                                }}
                                                className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Reject Modal */}
                {showRejectModal && selectedProgram && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <Card className="max-w-lg w-full p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Reject Program</h2>
                            <p className="text-white/70 mb-6">
                                You are about to reject "<strong>{selectedProgram.title}</strong>". Please provide a reason:
                            </p>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Provide detailed feedback on why this program is being rejected..."
                                rows={4}
                                className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all resize-none mb-6"
                            />
                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setSelectedProgram(null);
                                        setRejectionReason('');
                                    }}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleRejectSubmit}
                                    className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10"
                                >
                                    Confirm Rejection
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgramApprovals;
