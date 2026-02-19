import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
    AlertTriangle, ArrowLeft, Send, CheckCircle,
    FileText, AlertCircle, Clock, Wrench, HelpCircle,
    ChevronDown, User, Building2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createNotification } from '../../utils/NotificationManager';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const REPORTS_KEY = 'luxor_reports';
const PROVIDER_REPORTS_KEY = 'luxor_provider_reports';

const issueTypes = [
    { value: 'Program', label: 'Tour Program Issue', icon: FileText, color: 'from-blue-500 to-blue-600', description: 'Problems with a tour program or description' },
    { value: 'Booking', label: 'Booking Dispute', icon: Clock, color: 'from-yellow-500 to-yellow-600', description: 'Issues with your booking or payment' },
    { value: 'User', label: 'User / Guide Behavior', icon: User, color: 'from-orange-500 to-orange-600', description: 'Inappropriate behavior or conduct' },
    { value: 'Technical', label: 'Technical Problem', icon: Wrench, color: 'from-purple-500 to-purple-600', description: 'Website or app technical issues' },
    { value: 'Other', label: 'Other', icon: HelpCircle, color: 'from-gray-500 to-gray-600', description: 'Any other concern or feedback' },
];

const ReportIssue = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const pageRef = useRef(null);

    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [myReports, setMyReports] = useState([]);

    // All approved programs (always have providerId)
    const [programs, setPrograms] = useState([]);
    // Tourist's bookings (optional, for reference)
    const [myBookings, setMyBookings] = useState([]);

    const [form, setForm] = useState({
        subject: '',
        description: '',
        priority: 'Medium',
        // program or booking selection
        selectedProgramId: '',
        bookingId: '',
        // auto-filled from selected program
        providerId: '',
        providerName: '',
        programTitle: '',
    });

    useEffect(() => {
        gsap.fromTo(
            pageRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );

        // Load this user's previous reports
        try {
            const stored = localStorage.getItem(REPORTS_KEY);
            const all = stored ? JSON.parse(stored) : [];
            setMyReports(all.filter(r => r.reporterId === (user?.id || '')));
        } catch {
            setMyReports([]);
        }

        // ─── Load all programs that have an approved/active status ───
        // Programs always store providerId: user.id (from AddProgram.jsx line 63)
        try {
            const programsRaw = localStorage.getItem('luxor_programs');
            const allPrograms = programsRaw ? JSON.parse(programsRaw) : [];
            // Include Approved programs + optionally all so there's always something to pick
            const available = allPrograms.filter(p =>
                p.status === 'Approved' || p.status === 'Active' || allPrograms.length > 0
            );
            setPrograms(allPrograms); // show all so tourist can relate to any
        } catch {
            setPrograms([]);
        }

        // ─── Also load tourist's own bookings (for booking ID reference) ───
        try {
            const bookingsRaw = localStorage.getItem('luxor_bookings');
            const allBookings = bookingsRaw ? JSON.parse(bookingsRaw) : [];
            // Match by userId OR touristId — try both because different booking flows use different field names
            const myBk = allBookings.filter(b =>
                b.userId === user?.id ||
                b.touristId === user?.id
            );
            setMyBookings(myBk);
        } catch {
            setMyBookings([]);
        }
    }, [user]);

    const animateStep = () => {
        gsap.fromTo(
            '.step-content',
            { opacity: 0, x: 40 },
            { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' }
        );
    };

    const handleSelectType = (type) => {
        setSelectedType(type);
        setStep(2);
        setTimeout(animateStep, 10);
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // When tourist picks a program → auto-fill providerId, providerName, programTitle
    const handleProgramSelect = (programId) => {
        if (!programId) {
            setForm(prev => ({
                ...prev,
                selectedProgramId: '',
                providerId: '',
                providerName: '',
                programTitle: '',
            }));
            return;
        }
        const prog = programs.find(p => p.id === programId);
        if (prog) {
            setForm(prev => ({
                ...prev,
                selectedProgramId: programId,
                providerId: prog.providerId || '',
                providerName: prog.companyName || prog.providerName || `${prog.providerFirstName || ''} ${prog.providerLastName || ''}`.trim() || 'Service Provider',
                programTitle: prog.title || '',
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.subject.trim() || !form.description.trim()) return;

        setSubmitting(true);

        const reporterName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Anonymous';

        const newReport = {
            id: `rep-${Date.now()}`,
            reporterId: user?.id || 'guest',
            reporterName,
            type: selectedType.value,
            subject: form.subject.trim(),
            description: form.description.trim(),
            priority: form.priority,
            status: 'New',
            createdAt: new Date().toISOString(),
            // Provider & program context
            ...(form.providerId ? {
                providerId: form.providerId,
                providerName: form.providerName,
            } : {}),
            ...(form.selectedProgramId ? {
                programId: form.selectedProgramId,
                programTitle: form.programTitle,
                targetId: form.selectedProgramId,
                targetType: 'Tour Program',
            } : {}),
            ...(form.bookingId.trim() && !form.selectedProgramId ? {
                targetId: form.bookingId.trim(),
                targetType: 'Booking',
            } : {}),
        };

        try {
            // ── 1. Save to admin reports ──────────────────────────────
            const stored = localStorage.getItem(REPORTS_KEY);
            const all = stored ? JSON.parse(stored) : [];
            all.unshift(newReport);
            localStorage.setItem(REPORTS_KEY, JSON.stringify(all));

            // ── 2. Save to provider reports + fire notification ────────
            if (form.providerId) {
                const provStored = localStorage.getItem(PROVIDER_REPORTS_KEY);
                const provAll = provStored ? JSON.parse(provStored) : [];
                provAll.unshift(newReport);
                localStorage.setItem(PROVIDER_REPORTS_KEY, JSON.stringify(provAll));

                // Fire a real-time notification for this provider
                createNotification({
                    userId: form.providerId,
                    type: 'report',
                    message: `New tourist report: "${newReport.subject}" — ${newReport.priority} priority`,
                    link: '/provider/reports',
                });

                console.log('[ReportIssue] ✅ Report saved to provider reports for providerId:', form.providerId);
            } else {
                console.warn('[ReportIssue] ⚠️ No providerId set — report saved to admin only. Did the tourist select a program?');
            }
        } catch (err) {
            console.error('[ReportIssue] Error saving report:', err);
        }

        setTimeout(() => {
            setSubmitting(false);
            setStep(3);
            // Refresh my reports list
            try {
                const stored = localStorage.getItem(REPORTS_KEY);
                const all = stored ? JSON.parse(stored) : [];
                setMyReports(all.filter(r => r.reporterId === (user?.id || '')));
            } catch { /* ignore */ }
            setTimeout(animateStep, 10);
        }, 600);
    };

    const handleReset = () => {
        setStep(1);
        setSelectedType(null);
        setForm({
            subject: '', description: '', priority: 'Medium',
            selectedProgramId: '', bookingId: '',
            providerId: '', providerName: '', programTitle: '',
        });
        setTimeout(animateStep, 10);
    };

    const statusColors = {
        New: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        'In Progress': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
        Resolved: 'text-green-400 bg-green-500/10 border-green-500/20',
    };

    return (
        <div ref={pageRef} className="min-h-screen bg-dark-900 py-8">
            <div className="container-custom max-w-4xl">

                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/dashboard/tourist')}
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
                            <h1 className="text-4xl font-display font-bold text-white">Report an Issue</h1>
                            <p className="text-white/50 mt-1">Let us know about any problem you experienced</p>
                        </div>
                    </div>
                </div>

                {/* Step Indicator */}
                {step < 3 && (
                    <div className="flex items-center gap-3 mb-8">
                        {[
                            { num: 1, label: 'Issue Type' },
                            { num: 2, label: 'Details' },
                        ].map((s, i) => (
                            <React.Fragment key={s.num}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s.num
                                        ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                                        : 'bg-dark-700 text-white/30'
                                        }`}>
                                        {s.num}
                                    </div>
                                    <span className={`text-sm font-medium ${step >= s.num ? 'text-white' : 'text-white/30'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < 1 && (
                                    <div className={`flex-1 h-0.5 rounded-full ${step > s.num ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-white/10'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}

                {/* ─── Step 1: Choose Type ─── */}
                {step === 1 && (
                    <div className="step-content">
                        <h2 className="text-xl font-bold text-white mb-6">What kind of issue are you experiencing?</h2>
                        <div className="grid md:grid-cols-2 gap-4 mb-10">
                            {issueTypes.map(type => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={type.value}
                                        onClick={() => handleSelectType(type)}
                                        className="group relative text-left p-5 rounded-2xl border border-white/10 bg-dark-800/60 backdrop-blur hover:border-amber-500/40 hover:bg-dark-700/60 transition-all duration-300"
                                    >
                                        <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="font-bold text-white mb-1">{type.label}</div>
                                        <div className="text-white/50 text-sm">{type.description}</div>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronDown className="w-5 h-5 text-amber-400 rotate-[-90deg]" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Previous Reports */}
                        {myReports.length > 0 && (
                            <Card className="p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-amber-400" />
                                    Your Previous Reports
                                </h3>
                                <div className="space-y-3">
                                    {myReports.slice(0, 5).map(r => (
                                        <div key={r.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                            <div>
                                                <div className="text-white text-sm font-medium">{r.subject}</div>
                                                <div className="text-white/40 text-xs mt-0.5">
                                                    {r.type}
                                                    {r.providerName && <span> · {r.providerName}</span>}
                                                    {' · '}{new Date(r.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${statusColors[r.status] || 'text-white/50 bg-white/5 border-white/10'}`}>
                                                {r.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                )}

                {/* ─── Step 2: Fill Form ─── */}
                {step === 2 && selectedType && (
                    <div className="step-content">
                        {/* Selected type recap */}
                        <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-dark-800/60 border border-white/10">
                            <div className={`w-10 h-10 bg-gradient-to-br ${selectedType.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                <selectedType.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="text-white font-semibold">{selectedType.label}</div>
                                <div className="text-white/40 text-sm">{selectedType.description}</div>
                            </div>
                            <button
                                onClick={() => { setStep(1); setSelectedType(null); }}
                                className="text-white/40 hover:text-white/70 text-sm underline transition-colors"
                            >
                                Change
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* ── Related Tour Program (links to provider) ── */}
                            <Card className="p-6 mb-4">
                                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-amber-400" />
                                    Related Tour Program / Provider
                                </h2>

                                <div className="space-y-4">
                                    {/* Program picker — always works because programs store providerId */}
                                    <div>
                                        <label className="block text-sm text-white/70 mb-2">
                                            Select a tour program{' '}
                                            <span className="text-white/30">(optional — links report to the service provider)</span>
                                        </label>
                                        <select
                                            value={form.selectedProgramId}
                                            onChange={e => handleProgramSelect(e.target.value)}
                                            className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                        >
                                            <option value="">— Not related to a specific program —</option>
                                            {programs.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.title}
                                                    {(p.companyName || p.providerName) ? ` — ${p.companyName || p.providerName}` : ''}
                                                    {p.location ? ` (${p.location})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Show confirmation when a program is selected */}
                                    {form.providerId && (
                                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                            <Building2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                            <span className="text-amber-300 text-sm">
                                                Report will also be sent to:{' '}
                                                <strong>{form.providerName}</strong>
                                                {form.programTitle && <span className="text-amber-400/70"> ({form.programTitle})</span>}
                                            </span>
                                        </div>
                                    )}

                                    {/* Booking ID (optional, manual) */}
                                    <div>
                                        <label className="block text-sm text-white/70 mb-2">
                                            Booking ID <span className="text-white/30">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={form.bookingId}
                                            onChange={e => handleChange('bookingId', e.target.value)}
                                            placeholder="e.g. BK-20240218-001"
                                            className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                        />
                                        {/* Suggest from existing bookings */}
                                        {myBookings.length > 0 && !form.bookingId && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className="text-white/30 text-xs mt-1">Your bookings:</span>
                                                {myBookings.slice(0, 3).map(b => (
                                                    <button
                                                        key={b.id}
                                                        type="button"
                                                        onClick={() => handleChange('bookingId', b.id)}
                                                        className="text-xs px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
                                                    >
                                                        {b.id}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            {/* ── Issue Details ── */}
                            <Card className="p-6 mb-6">
                                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-amber-400" />
                                    Issue Details
                                </h2>
                                <div className="space-y-5">
                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm text-white/70 mb-2">
                                            Subject <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={form.subject}
                                            onChange={e => handleChange('subject', e.target.value)}
                                            required
                                            placeholder="Brief description of the issue"
                                            className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm text-white/70 mb-2">
                                            Description <span className="text-red-400">*</span>
                                        </label>
                                        <textarea
                                            value={form.description}
                                            onChange={e => handleChange('description', e.target.value)}
                                            required
                                            rows={5}
                                            placeholder="Please describe the issue in detail. Include dates, names, and any other relevant information..."
                                            className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                                        />
                                    </div>

                                    {/* Priority */}
                                    <div>
                                        <label className="block text-sm text-white/70 mb-2">Priority Level</label>
                                        <select
                                            value={form.priority}
                                            onChange={e => handleChange('priority', e.target.value)}
                                            className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                        >
                                            <option value="Low">Low – General feedback</option>
                                            <option value="Medium">Medium – Needs attention</option>
                                            <option value="High">High – Significant impact</option>
                                            <option value="Critical">Critical – Urgent issue</option>
                                        </select>
                                    </div>
                                </div>
                            </Card>

                            {/* Info banner */}
                            <div className="flex gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-6">
                                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <p className="text-white/60 text-sm">
                                    Your report will be sent to our{' '}
                                    <span className="text-amber-400 font-semibold">admin team</span>
                                    {form.providerName && (
                                        <> and <span className="text-amber-400 font-semibold">{form.providerName}</span></>
                                    )}
                                    . We aim to respond within{' '}
                                    <span className="text-amber-400 font-semibold">24–48 hours</span>.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => { setStep(1); setSelectedType(null); }}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="min-w-[160px] bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 border-0"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Submitting…
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Send className="w-4 h-4" />
                                            Submit Report
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ─── Step 3: Success ─── */}
                {step === 3 && (
                    <div className="step-content flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-500/30">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">Report Submitted!</h2>
                        <p className="text-white/60 max-w-md mb-2">
                            Your report has been sent to our{' '}
                            <span className="text-amber-400 font-semibold">admin team</span>
                            {form.providerName && (
                                <> and <span className="text-amber-400 font-semibold">{form.providerName}</span></>
                            )}.
                        </p>
                        <p className="text-white/40 text-sm mb-10">
                            We aim to respond within 24–48 hours based on priority.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="primary"
                                onClick={handleReset}
                                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 border-0"
                            >
                                Submit Another Report
                            </Button>
                            <Button
                                variant="glass"
                                onClick={() => navigate('/dashboard/tourist')}
                            >
                                Back to Dashboard
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportIssue;
