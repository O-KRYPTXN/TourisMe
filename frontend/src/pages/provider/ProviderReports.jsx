import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
    AlertTriangle, ArrowLeft, CheckCircle, Clock,
    AlertCircle, FileText, Wrench, HelpCircle, User,
    MessageSquare, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createNotification } from '../../utils/NotificationManager';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const PROVIDER_REPORTS_KEY = 'luxor_provider_reports';
const ADMIN_REPORTS_KEY = 'luxor_reports';

const ProviderReports = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const pageRef = useRef(null);

    const [reports, setReports] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [providerNote, setProviderNote] = useState('');

    useEffect(() => {
        gsap.fromTo(
            pageRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
        loadReports();
    }, [user]);

    const loadReports = () => {
        try {
            // Get this provider's program IDs (for cross-referencing)
            const programsRaw = localStorage.getItem('luxor_programs');
            const allPrograms = programsRaw ? JSON.parse(programsRaw) : [];
            const myProgramIds = allPrograms
                .filter(p => p.providerId === user?.id)
                .map(p => p.id);

            // Match by providerId OR by programId belonging to this provider
            const stored = localStorage.getItem(PROVIDER_REPORTS_KEY);
            const all = stored ? JSON.parse(stored) : [];
            const mine = all.filter(r =>
                r.providerId === user?.id ||
                (r.programId && myProgramIds.includes(r.programId))
            );
            setReports(mine);
        } catch {
            setReports([]);
        }
    };


    const saveAll = (updated) => {
        try {
            const stored = localStorage.getItem(PROVIDER_REPORTS_KEY);
            const all = stored ? JSON.parse(stored) : [];
            const merged = all.map(r => {
                const found = updated.find(u => u.id === r.id);
                return found || r;
            });
            localStorage.setItem(PROVIDER_REPORTS_KEY, JSON.stringify(merged));
            setReports(updated);
        } catch { /* ignore */ }
    };

    const handleAcknowledge = (reportId) => {
        const updated = reports.map(r =>
            r.id === reportId ? { ...r, providerStatus: 'Acknowledged', acknowledgedAt: new Date().toISOString() } : r
        );
        saveAll(updated);
        setShowModal(false);
    };

    // ── Mark report as Resolved: update both stores + notify tourist & admin ──
    const handleResolve = (report) => {
        const resolvedAt = new Date().toISOString();
        const providerName = user?.companyName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Service Provider';

        // 1. Update luxor_provider_reports
        const updatedReports = reports.map(r =>
            r.id === report.id
                ? { ...r, status: 'Resolved', providerStatus: 'Resolved', resolvedAt, providerNote }
                : r
        );
        saveAll(updatedReports);

        // 2. Also update luxor_reports (admin store) so admin sees Resolved status
        try {
            const adminRaw = localStorage.getItem(ADMIN_REPORTS_KEY);
            const adminAll = adminRaw ? JSON.parse(adminRaw) : [];
            const adminUpdated = adminAll.map(r =>
                r.id === report.id
                    ? { ...r, status: 'Resolved', resolvedAt, providerNote, resolvedBy: providerName }
                    : r
            );
            localStorage.setItem(ADMIN_REPORTS_KEY, JSON.stringify(adminUpdated));
        } catch { /* ignore */ }

        // 3. Notify the tourist
        if (report.reporterId && report.reporterId !== 'guest') {
            createNotification({
                userId: report.reporterId,
                type: 'report_resolved',
                message: `Your report "${report.subject}" has been resolved by ${providerName}. ✅`,
                link: '/dashboard/tourist',
            });
        }

        // 4. Notify admin
        createNotification({
            userId: 'admin',
            type: 'report_resolved',
            message: `Provider ${providerName} resolved report: "${report.subject}"`,
            link: '/admin/reports',
        });

        setShowModal(false);
        setSelectedReport(null);
        setProviderNote('');
    };

    const handleSaveNote = (reportId) => {
        const updated = reports.map(r =>
            r.id === reportId
                ? { ...r, providerNote, providerStatus: r.providerStatus || 'Acknowledged', acknowledgedAt: r.acknowledgedAt || new Date().toISOString() }
                : r
        );
        saveAll(updated);
        setShowModal(false);
        setProviderNote('');
    };

    const filteredReports = reports.filter(r => {
        if (statusFilter !== 'All' && r.status !== statusFilter) return false;
        if (typeFilter !== 'All' && r.type !== typeFilter) return false;
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
        User: User,
        Program: FileText,
        Booking: Clock,
        Technical: Wrench,
        Other: HelpCircle,
    };

    return (
        <div ref={pageRef} className="min-h-screen bg-dark-900 py-8">
            <div className="container-custom">

                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/dashboard/provider')}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <AlertTriangle className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-display font-bold text-white">Tourist Reports</h1>
                            <p className="text-white/50 mt-1">Issues reported by tourists about your services</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total', value: stats.total, icon: AlertTriangle, color: 'text-amber-400' },
                        { label: 'New', value: stats.new, icon: AlertCircle, color: 'text-blue-400' },
                        { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-yellow-400' },
                        { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-green-400' },
                    ].map(s => {
                        const Icon = s.icon;
                        return (
                            <Card key={s.label} className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/50 text-sm">{s.label}</p>
                                        <p className="text-3xl font-bold text-white mt-1">{s.value}</p>
                                    </div>
                                    <Icon className={`w-8 h-8 ${s.color}`} />
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Filters */}
                <Card className="p-5 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm text-white/70 mb-2">Filter by Type</label>
                            <select
                                value={typeFilter}
                                onChange={e => setTypeFilter(e.target.value)}
                                className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                            >
                                <option value="All">All Types</option>
                                <option value="Program">Program Issues</option>
                                <option value="Booking">Booking Disputes</option>
                                <option value="User">User / Guide Behavior</option>
                                <option value="Technical">Technical Issues</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm text-white/70 mb-2">Filter by Status</label>
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                            >
                                <option value="All">All Statuses</option>
                                <option value="New">New</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Reports table */}
                <Card className="overflow-hidden">
                    {filteredReports.length === 0 ? (
                        <div className="text-center py-16">
                            <AlertTriangle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                            <p className="text-white/40">No reports found for your services</p>
                            <p className="text-white/25 text-sm mt-1">Reports submitted by tourists about your tours will appear here</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-dark-700/30">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Type</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Subject</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Tourist</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Priority</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Admin Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredReports.map(report => {
                                        const TypeIcon = typeIcons[report.type] || HelpCircle;
                                        const isNew = !report.providerStatus;
                                        return (
                                            <tr key={report.id} className={`hover:bg-white/5 transition-colors ${isNew ? 'bg-amber-500/5' : ''}`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <TypeIcon className="w-4 h-4 text-amber-400" />
                                                        <span className="text-white/70 text-sm">{report.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {isNew && <span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />}
                                                        <div>
                                                            <p className="text-white font-medium">{report.subject}</p>
                                                            <p className="text-white/40 text-xs truncate max-w-xs">{report.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-white/70">{report.reporterName}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${priorityColors[report.priority] || ''}`}>
                                                        {report.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[report.status] || ''}`}>
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
                                                            setProviderNote(report.providerNote || '');
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        <MessageSquare className="w-4 h-4 mr-1" />
                                                        {isNew ? 'Review' : 'View'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                {/* Report Detail Modal */}
                {showModal && selectedReport && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <Card className="max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-start justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Report Details</h2>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[selectedReport.status] || ''}`}>
                                        {selectedReport.status}
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${priorityColors[selectedReport.priority] || ''}`}>
                                        {selectedReport.priority}
                                    </span>
                                    <button onClick={() => { setShowModal(false); setSelectedReport(null); }} className="text-white/40 hover:text-white transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <p className="text-white/50 text-sm">Tourist</p>
                                    <p className="text-white font-medium">{selectedReport.reporterName}</p>
                                </div>
                                <div>
                                    <p className="text-white/50 text-sm">Type</p>
                                    <p className="text-white font-medium">{selectedReport.type}</p>
                                </div>
                                {selectedReport.programTitle && (
                                    <div>
                                        <p className="text-white/50 text-sm">Related Program</p>
                                        <p className="text-white font-medium">{selectedReport.programTitle}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-white/50 text-sm">Subject</p>
                                    <p className="text-white font-medium">{selectedReport.subject}</p>
                                </div>
                                <div>
                                    <p className="text-white/50 text-sm">Description</p>
                                    <p className="text-white/80">{selectedReport.description}</p>
                                </div>
                                <div>
                                    <p className="text-white/50 text-sm">Submitted</p>
                                    <p className="text-white font-medium">{new Date(selectedReport.createdAt).toLocaleString()}</p>
                                </div>
                                {selectedReport.acknowledgedAt && (
                                    <div>
                                        <p className="text-white/50 text-sm">Acknowledged</p>
                                        <p className="text-white font-medium">{new Date(selectedReport.acknowledgedAt).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>

                            {/* Note to admin */}
                            <div className="mb-6">
                                <label className="block text-white/70 text-sm mb-2">
                                    Your note <span className="text-white/30 text-xs">(visible to admin)</span>
                                </label>
                                <textarea
                                    value={providerNote}
                                    onChange={e => setProviderNote(e.target.value)}
                                    placeholder="Add a note or explanation about this issue..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                                />
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => { setShowModal(false); setSelectedReport(null); setProviderNote(''); }}
                                >
                                    Close
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleSaveNote(selectedReport.id)}
                                >
                                    Save Note
                                </Button>
                                {!selectedReport.providerStatus && (
                                    <Button
                                        variant="primary"
                                        onClick={() => handleAcknowledge(selectedReport.id)}
                                        className="bg-gradient-to-r from-amber-500 to-orange-600 border-0"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Acknowledge
                                    </Button>
                                )}
                                {/* Mark as Resolved — always visible if not yet resolved */}
                                {selectedReport.status !== 'Resolved' && (
                                    <Button
                                        variant="primary"
                                        onClick={() => handleResolve(selectedReport)}
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 hover:from-green-600 hover:to-emerald-700"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Mark as Resolved
                                    </Button>
                                )}
                                {selectedReport.status === 'Resolved' && (
                                    <span className="flex items-center gap-2 text-green-400 text-sm font-medium">
                                        <CheckCircle className="w-4 h-4" />
                                        Already Resolved
                                    </span>
                                )}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderReports;
