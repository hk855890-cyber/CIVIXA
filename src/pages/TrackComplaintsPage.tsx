import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  MapPin,
  Calendar,
  Building2,
  UserCheck,
  Send,
  MessageSquare,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useReports } from '../context/ReportsContext';
import { useAuth } from '../context/AuthContext';
import { CivicReport, ReportStatus, TimelineEvent } from '../types';

interface TrackComplaintsPageProps {
  initialComplaintId?: string | null;
  onNavigate: (route: string) => void;
}

export const TrackComplaintsPage: React.FC<TrackComplaintsPageProps> = ({
  initialComplaintId,
  onNavigate,
}) => {
  const { reports, getReportById, addComment, toggleUpvote } = useReports();
  const { user } = useAuth();

  const [searchId, setSearchId] = useState(initialComplaintId || reports[0]?.id || 'CX-2026-00124');
  const [activeReport, setActiveReport] = useState<CivicReport | undefined>(() => {
    if (initialComplaintId) {
      return getReportById(initialComplaintId) || reports[0];
    }
    return reports[0];
  });
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    if (initialComplaintId) {
      const found = getReportById(initialComplaintId);
      if (found) {
        setActiveReport(found);
        setSearchId(found.id);
      }
    }
  }, [initialComplaintId, getReportById]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = getReportById(searchId.trim());
    if (found) {
      setActiveReport(found);
    }
  };

  const handleSelectReport = (report: CivicReport) => {
    setActiveReport(report);
    setSearchId(report.id);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeReport) return;
    addComment(activeReport.id, commentInput.trim(), user?.fullName || 'Arun Kumar');
    setCommentInput('');
    // Refresh active report reference
    const updated = getReportById(activeReport.id);
    if (updated) setActiveReport(updated);
  };

  const stages = ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'] as const;

  // Determine current active stage index in 5-stage timeline
  const getStageIndex = (status: ReportStatus) => {
    switch (status) {
      case 'Pending':
        return 0; // At Submitted/Verification
      case 'In Progress':
        return 3; // At In Progress (Submitted, Verified, Assigned completed)
      case 'Resolved':
        return 4; // All 5 completed
      default:
        return 0;
    }
  };

  const currentStageIndex = activeReport ? getStageIndex(activeReport.status) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Complaints
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor the live stage-by-stage resolution lifecycle of municipal work orders.
        </p>
      </div>

      {/* SEARCH COMPLAINT ID BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Complaint ID (e.g. CS-2026-00124)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Track ID</span>
          </button>
        </form>

        {/* Quick select pills */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 overflow-x-auto text-xs pb-1">
          <span className="text-slate-400 shrink-0 font-medium">Recent Tickets:</span>
          {reports.slice(0, 4).map((r) => (
            <button
              key={r.id}
              onClick={() => handleSelectReport(r)}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-colors shrink-0 cursor-pointer ${
                activeReport?.id === r.id
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {r.id}
            </button>
          ))}
        </div>
      </div>

      {activeReport ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: MAIN COMPLAINT CARD & 5-STAGE TIMELINE */}
          <div className="lg:col-span-8 space-y-6">
            {/* Primary Details Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-slate-900 text-white font-mono text-sm font-bold tracking-wider">
                      {activeReport.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {activeReport.category}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {activeReport.title}
                  </h2>
                </div>

                <div className="shrink-0">
                  {activeReport.status === 'Resolved' ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Resolved
                    </span>
                  ) : activeReport.status === 'In Progress' ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                      <Wrench className="w-4 h-4 text-blue-600" />
                      In Progress
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      <Clock className="w-4 h-4 text-amber-600" />
                      Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Location & Metadata Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800">Location</div>
                    <div className="truncate">{activeReport.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800">Reported On</div>
                    <div>{activeReport.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800">Priority</div>
                    <div className="font-semibold text-slate-900">{activeReport.priority}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Issue Description
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {activeReport.description}
                </p>
              </div>

              {/* 5-STAGE PROGRESS TIMELINE (Section 18 in specs) */}
              <div className="pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
                  Resolution Progress Timeline
                </h4>

                {/* Horizontal Progress Stepper for larger screens */}
                <div className="hidden md:flex items-center justify-between relative mb-10 px-4">
                  {/* Connecting line */}
                  <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 z-0">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-500"
                      style={{
                        width: `${(currentStageIndex / (stages.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {stages.map((stage, idx) => {
                    const isCompleted = idx < currentStageIndex || (idx === currentStageIndex && activeReport.status === 'Resolved');
                    const isCurrent = idx === currentStageIndex && activeReport.status !== 'Resolved';
                    const isPending = idx > currentStageIndex;

                    return (
                      <div key={stage} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                            isCompleted
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                              : isCurrent
                              ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                              : 'bg-white text-slate-400 border-2 border-slate-300'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <span
                          className={`text-xs mt-2 font-bold tracking-tight whitespace-nowrap ${
                            isCurrent
                              ? 'text-blue-700'
                              : isCompleted
                              ? 'text-emerald-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Detailed Timeline Feed */}
                <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeReport.timeline.map((item, idx) => (
                    <div key={idx} className="relative">
                      {/* Step node dot */}
                      <div
                        className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                          item.completed
                            ? 'bg-emerald-600 text-white'
                            : item.current
                            ? 'bg-blue-600 text-white animate-pulse'
                            : 'bg-slate-300 text-slate-600'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>

                      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                            <span>{item.title}</span>
                            {item.stage && (
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                {item.stage}
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CITIZEN & OFFICER COMMENTS SECTION */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>Updates & Official Remarks</span>
              </div>

              {/* Comments Thread */}
              <div className="space-y-3">
                {activeReport.comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    No remarks added yet. Add a note or query below.
                  </p>
                ) : (
                  activeReport.comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{c.author}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                              c.role === 'Field Engineer'
                                ? 'bg-blue-100 text-blue-800'
                                : c.role === 'Municipal Officer'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {c.role}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{c.timestamp}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handlePostComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Post a query or update for the ward team..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: PHOTOGRAPHIC EVIDENCE & WARD TEAM DETAILS */}
          <div className="lg:col-span-4 space-y-6">
            {/* Photo Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-900 flex items-center justify-between">
                <span>Photographic Evidence</span>
                <span className="text-xs text-emerald-600 font-medium">Verified Geotag</span>
              </div>
              <div className="aspect-video bg-slate-900 relative">
                <img
                  src={activeReport.imageUrl}
                  alt={activeReport.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-800">{activeReport.location}</p>
                <p>Captured on {activeReport.date} via Citizen App</p>
              </div>
            </div>

            {/* Department Assignment Box */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Municipal Wing In Charge</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Department</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {activeReport.department}
                  </span>
                </div>

                {activeReport.assignedOfficer && (
                  <div>
                    <span className="text-slate-400 block font-medium">Assigned Officer</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{activeReport.assignedOfficer}</span>
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-slate-400 block font-medium">Target Turnaround (SLA)</span>
                  <span className="font-semibold text-slate-800">
                    {activeReport.expectedResolutionDays || 2} Days from verification
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Complaint Not Found</h3>
          <p className="text-sm text-slate-500">
            No ticket exists with ID "{searchId}". Please check the ID or select from the list.
          </p>
        </div>
      )}
    </div>
  );
};
