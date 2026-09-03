import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  MapPin,
  Calendar,
  Eye,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  SlidersHorizontal,
  Database,
  Award,
  ShieldCheck,
} from 'lucide-react';
import { useReports } from '../context/ReportsContext';
import { useAuth } from '../context/AuthContext';
import { CivicReport, ReportStatus } from '../types';

interface DashboardPageProps {
  onNavigate: (route: string, complaintId?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { reports, stats } = useReports();
  const { user, dashboardSettings, lastSavedToDb } = useAuth();
  const [selectedReportForPreview, setSelectedReportForPreview] = useState<CivicReport | null>(null);

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            In Progress
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  const isCompact = dashboardSettings?.compactView;

  return (
    <div className={`animate-in fade-in duration-300 ${isCompact ? 'space-y-5' : 'space-y-8'}`}>
      {/* Top Welcome & Dashboard Customization Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-500 shadow-sm shrink-0">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
              alt={user?.fullName || 'User'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {user?.fullName || 'Arun Kumar'}
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                <Database className="w-3 h-3" />
                <span>DB Synced</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {user?.wardNumber || 'Ward 24 - Central Zone'} • {user?.city || 'Coimbatore'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            id="dashboard-customize-settings-btn"
            onClick={() => onNavigate('/profile')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            title="Edit Dashboard Settings & Profile"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            <span>Customize Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('/report')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {/* 4 PROFESSIONAL STATISTIC CARDS */}
      <section id="dashboard-statistics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Reports */}
        <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow ${isCompact ? 'p-4' : 'p-6'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Reports
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{stats.total || 12}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>Ward 24</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">All citizen submitted issues</p>
        </div>

        {/* Pending */}
        <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow ${isCompact ? 'p-4' : 'p-6'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Pending
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-900">{stats.pending || 4}</span>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              In Verification
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Awaiting municipal desk review</p>
        </div>

        {/* In Progress */}
        <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow ${isCompact ? 'p-4' : 'p-6'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              In Progress
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-blue-900">{stats.inProgress || 3}</span>
            <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              Crew Dispatched
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Field team assigned & repairing</p>
        </div>

        {/* Resolved */}
        <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow ${isCompact ? 'p-4' : 'p-6'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Resolved
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-900">{stats.resolved || 5}</span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Completed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Closed with photo inspection</p>
        </div>
      </section>

      {/* OPTIONAL IMPACT SCORE CARD (Controlled by Dashboard Settings in Firestore) */}
      {dashboardSettings.showImpactScoreCard && (
        <section className="bg-white rounded-3xl p-5 border border-emerald-100 bg-gradient-to-r from-emerald-50/60 to-teal-50/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm">Civic Guardian Level 2</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[10px] font-bold">
                  {user?.badge || 'Active Contributor'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                You have earned <strong className="text-emerald-800 font-bold">{user?.totalPoints || 340} Civic Points</strong> through 5 verified community photo reports.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/reports')}
            className="px-4 py-2 bg-white hover:bg-emerald-100/50 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-colors shrink-0 cursor-pointer"
          >
            View Verified Fixes
          </button>
        </section>
      )}

      {/* PROMINENT QUICK ACTION BANNER (Controlled by Dashboard Settings in Firestore) */}
      {dashboardSettings.showQuickActions && (
        <section
          id="dashboard-quick-action"
          className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="space-y-2 max-w-xl z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Civic Action</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Have you spotted a civic issue?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Report it now and help improve your community. Our automated system will route it to the right department in seconds.
            </p>
          </div>

          <button
            id="dashboard-report-new-issue-btn"
            onClick={() => onNavigate('/report')}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 active:bg-emerald-100 font-bold text-sm sm:text-base shadow-lg transition-all flex items-center gap-2.5 cursor-pointer z-10"
          >
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <span>+ Report New Issue</span>
          </button>

          <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        </section>
      )}

      {/* RECENT REPORTS TABLE SECTION */}
      <section id="dashboard-recent-reports" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Reports</h3>
            <p className="text-xs text-slate-500">
              Live updates on public issues logged across your municipal zone.
            </p>
          </div>

          <button
            id="dashboard-view-all-reports-btn"
            onClick={() => onNavigate('/reports')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <span>View All Reports ({reports.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Issue & Ticket</th>
                <th className="py-3.5 px-6">Location</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {reports.slice(0, 5).map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/70 transition-colors group">
                  {/* Issue & Photo */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={report.imageUrl}
                          alt={report.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {report.title}
                        </div>
                        <div className="text-xs font-mono font-medium text-slate-400">
                          {report.id} • {report.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-4 px-6 text-slate-600">
                    <div className="flex items-center gap-1.5 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{report.location}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{report.date}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <button
                      id={`view-report-btn-${report.id}`}
                      onClick={() => onNavigate('/track', report.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* QUICK CIVIC METRICS & HELPDESK ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ward Resolution SLA</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard turnaround time for high-priority road hazards is 48 hours within Coimbatore Municipal limits.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
            <MapPin className="w-4 h-4" />
            <span>Active Field Units</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Zone 2 Mobile Repair & Patch Squad currently deployed in Gandhipuram and Saibaba Colony routes.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Monsoon Safety Notice</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Report overflowing stormwater culverts with clear landmark descriptions for rapid suction machine dispatch.
          </p>
        </div>
      </div>
    </div>
  );
};
