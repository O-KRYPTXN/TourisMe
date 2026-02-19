import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { AlertTriangle, ArrowLeft, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const REPORTS_KEY = 'luxor_reports';

// Mock data for demonstration
const mockReports = [
    {
        id: 'rep-001',
        reporterId: 'tourist-001',
        reporterName: 'Sarah Johnson',
        type: 'Program',
        subject: 'Misleading tour description',
        description: 'The tour description mentioned air-conditioned transportation but we got an old bus with broken AC in 40°C heat.',
        targetId: 'prog-001',
        targetType: 'Tour Program',
        priority: 'High',
        status: 'New',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'rep-002',
        reporterId: 'tourist-002',
        reporterName: 'John Smith',
        type: 'Booking',
        subject: 'Double charge on credit card',
        description: 'I was charged twice for the same booking. Transaction IDs: TX123456 and TX123457.',
        targetId: 'book-045',
        targetType: 'Booking',
        priority: 'Critical',
        status: 'In Progress',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        adminNotes: 'Contacted payment processor. Investigating duplicate transaction.',
    },
    {
        id: 'rep-003',
        reporterId: 'tourist-003',
        reporterName: 'Emma Wilson',
        type: 'User',
        subject: 'Inappropriate behavior from guide',
        description: 'Tour guide made several inappropriate comments during the Valley of Kings tour.',
        targetId: 'guide-012',
        targetType: 'Tour Guide',
        priority: 'High',
        status: 'New',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'rep-004',
        reporterId: 'provider-002',
        reporterName: 'Ahmed Hassan',
        type: 'Technical',
        subject: 'Unable to upload tour images',
        description: 'Getting error 500 when trying to upload images larger than 5MB for new tour program.',
        priority: 'Medium',
        status: 'Resolved',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        adminNotes: 'Increased file size limit to 10MB. Issue resolved.',
    },
    {
        id: 'rep-005',
        reporterId: 'tourist-004',
        reporterName: 'Michael Brown',
        type: 'Other',
        subject: 'Request for refund',
        description: 'Tour was cancelled due to weather. Requesting full refund as per cancellation policy.',
        priority: 'Medium',
        status: 'In Progress',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        adminNotes: 'Processing refund. Expected completion in 3-5 business days.',
    },
];

const ReportsManagement = () => {
    const [reports, setReports] = useState([]);
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedReport, setSelectedReport] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const navigate = useNavigate();
    const pageRef = useRef(null);

    useEffect(() => {
        loadReports();

        // Page animation
        gsap.fromTo(pageRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }, []);

    const loadReports = () => {
        // Load from localStorage or use mock data
        const storedReports = localStorage.getItem(REPORTS_KEY);
        if (storedReports) {
            setReports(JSON.parse(storedReports));
        } else {
            setReports(mockReports);
            localStorage.setItem(REPORTS_KEY, JSON.stringify(mockReports));
        }
    };

    const saveReports = (updatedReports) => {
        setReports(updatedReports);
        localStorage.setItem(REPORTS_KEY, JSON.stringify(updatedReports));
    };

    const handleMarkResolved = (reportId) => {
        const updatedReports = reports.map(r => {
            if (r.id === reportId) {
                return {
                    ...r,
                    status: 'Resolved',
                    resolvedAt: new Date().toISOString(),
                };
            }
            return r;
        });
        saveReports(updatedReports);
        setShowDetailsModal(false);
    };

    const handleUpdateNotes = (reportId) => {
        const updatedReports = reports.map(r => {
            if (r.id === reportId) {
                return {
                    ...r,
                    adminNotes,
                    status: r.status === 'New' ? 'In Progress' : r.status,
                };
            }
            return r;
        });
        saveReports(updatedReports);
        setShowDetailsModal(false);
        setAdminNotes('');
    };

    const handleChangePriority = (reportId, newPriority) => {
        const updatedReports = reports.map(r => {
            if (r.id === reportId) {
                return { ...r, priority: newPriority };
            }
            return r;
        });
        saveReports(updatedReports);
    };

    const filteredReports = reports.filter(r => {
        if (typeFilter !== 'All' && r.type !== typeFilter) return false;
        if (statusFilter !== 'All' && r.status !== statusFilter) return false;
        return true;
    });

    const stats = {
        total: reports.length,
        new: reports.filter(r => r.status === 'New').length,
        inProgress: reports.filter(r => r.status === 'In Progress').length,
        resolved: reports.filter(r => r.status === 'Resolved').length,
    };

    const priorityColors = {
        Low: 'text-green-400 bg-green-500/10',
        Medium: 'text-yellow-400 bg-yellow-500/10',
        High: 'text-orange-400 bg-orange-500/10',
        Critical: 'text-red-400 bg-red-500/10',
    };

    const statusColors = {
        New: 'text-blue-400 bg-blue-500/10',
        'In Progress': 'text-yellow-400 bg-yellow-500/10',
        Resolved: 'text-green-400 bg-green-500/10',
    };

    const typeIcons = {
        User: AlertCircle,
        Program: FileText,
        Booking: Clock,
        Technical: AlertTriangle,
        Other: FileText,
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
                        <AlertTriangle className="w-10 h-10 text-primary-400" />
                        Reports Management
                    </h1>
                    <p className="text-white/50 mt-2">Review and handle user reports and complaints</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/50 text-sm">Total Reports</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-primary-400" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/50 text-sm">New</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.new}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-blue-400" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/50 text-sm">In Progress</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.inProgress}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-400" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/50 text-sm">Resolved</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.resolved}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Type Filter */}
                        <div className="flex-1">
                            <label className="block text-sm text-white/70 mb-2">Filter by Type</label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
                            >
                                <option value="All">All Types</option>
                                <option value="User">User Reports</option>
                                <option value="Program">Program Issues</option>
                                <option value="Booking">Booking Disputes</option>
                                <option value="Technical">Technical Issues</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="flex-1">
                            <label className="block text-sm text-white/70 mb-2">Filter by Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
                            >
                                <option value="All">All Statuses</option>
                                <option value="New">New</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Reports Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-dark-700/30">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Subject</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Reporter</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Priority</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredReports.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-white/50">
                                            No reports found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReports.map((report) => {
                                        const TypeIcon = typeIcons[report.type];
                                        return (
                                            <tr key={report.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <TypeIcon className="w-4 h-4 text-primary-400" />
                                                        <span className="text-white/70 text-sm">{report.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-white font-medium">{report.subject}</p>
                                                    <p className="text-white/50 text-sm truncate max-w-xs">{report.description}</p>
                                                </td>
                                                <td className="px-6 py-4 text-white/70">{report.reporterName}</td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={report.priority}
                                                        onChange={(e) => handleChangePriority(report.id, e.target.value)}
                                                        className={`px-3 py-1 rounded-lg text-xs font-medium ${priorityColors[report.priority]} border-0 cursor-pointer`}
                                                    >
                                                        <option value="Low">Low</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="High">High</option>
                                                        <option value="Critical">Critical</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[report.status]}`}>
                                                        {report.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-white/70 text-sm">
                                                    {new Date(report.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedReport(report);
                                                            setAdminNotes(report.adminNotes || '');
                                                            setShowDetailsModal(true);
                                                        }}
                                                    >
                                                        View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Report Details Modal */}
                {showDetailsModal && selectedReport && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <Card className="max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-start justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Report Details</h2>
                                <div className="flex gap-2">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[selectedReport.status]}`}>
                                        {selectedReport.status}
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${priorityColors[selectedReport.priority]}`}>
                                        {selectedReport.priority}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <p className="text-white/50 text-sm">Reporter</p>
                                    <p className="text-white font-medium">{selectedReport.reporterName}</p>
                                </div>
                                <div>
                                    <p className="text-white/50 text-sm">Type</p>
                                    <p className="text-white font-medium">{selectedReport.type}</p>
                                </div>
                                <div>
                                    <p className="text-white/50 text-sm">Subject</p>
                                    <p className="text-white font-medium">{selectedReport.subject}</p>
                                </div>
                                <div>
                                    <p className="text-white/50 text-sm">Description</p>
                                    <p className="text-white font-medium">{selectedReport.description}</p>
                                </div>
                                {selectedReport.targetType && (
                                    <div>
                                        <p className="text-white/50 text-sm">Target</p>
                                        <p className="text-white font-medium">{selectedReport.targetType} (ID: {selectedReport.targetId})</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-white/50 text-sm">Reported On</p>
                                    <p className="text-white font-medium">
                                        {new Date(selectedReport.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                {selectedReport.resolvedAt && (
                                    <div>
                                        <p className="text-white/50 text-sm">Resolved At</p>
                                        <p className="text-white font-medium">
                                            {new Date(selectedReport.resolvedAt).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-white/70 text-sm mb-2">Admin Notes</label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add internal notes about this report..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedReport(null);
                                        setAdminNotes('');
                                    }}
                                >
                                    Close
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleUpdateNotes(selectedReport.id)}
                                >
                                    Save Notes
                                </Button>
                                {selectedReport.status !== 'Resolved' && (
                                    <Button
                                        variant="primary"
                                        onClick={() => handleMarkResolved(selectedReport.id)}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Mark as Resolved
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsManagement;
