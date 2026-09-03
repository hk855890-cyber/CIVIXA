import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  MapPin,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  Wrench,
  ThumbsUp,
  PlusCircle,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useReports } from '../context/ReportsContext';
import { ReportStatus, IssueCategory } from '../types';

interface MyReportsPageProps {
  onNavigate: (route: string, complaintId?: string) => void;
}

export const MyReportsPage: React.FC<MyReportsPageProps> = ({ onNavigate }) => {
  const { reports, toggleUpvote } = useReports();
  const [filterStatus, setFilterStatus] = useState<'All' | ReportStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredReports = reports.filter((report) => {
    const matchesStatus = filterStatus === 'All' || report.status === filterStatus;
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Wrench className="w-3.5 h-3.5 text-blue-600" />
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & New Report CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Reports
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage and track all civic issues submitted by you across the city.
          </p>
        </div>

        <button
          id="my-reports-new-issue-btn"
          onClick={() => onNavigate('/report')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-4">
        {/* Search Bar & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Complaint ID (e.g. CS-2026-00124), title, or location..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* STATUS FILTER TABS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Pending', 'In Progress', 'Resolved'] as const).map((status) => {
              const isActive = filterStatus === status;
              const count =
                status === 'All'
                  ? reports.length
                  : reports.filter((r) => r.status === status).length;

              return (
                <button
                  key={status}
                  id={`filter-status-${status.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{status}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredReports.length}</strong> of{' '}
            {reports.length} reports
          </div>
        </div>
      </div>

      {/* REPORTS LIST / GRID VIEW */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Reports Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              No civic issues match your selected filter criteria or search query.
            </p>
          </div>
          <button
            onClick={() => {
              setFilterStatus('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Photo & Status Badge */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={report.imageUrl}
                  alt={report.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-black/75 backdrop-blur-xs text-white font-mono text-xs font-bold rounded-md">
                    {report.id}
                  </span>
                </div>
                <div className="absolute top-3 right-3">{getStatusBadge(report.status)}</div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                    {report.category}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[160px]">{report.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{report.date}</span>
                    </div>
                  </div>

                  {/* Actions: View Details / Track */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      id={`track-report-card-btn-${report.id}`}
                      onClick={() => onNavigate('/track', report.id)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details & Timeline</span>
                    </button>

                    <button
                      onClick={() => toggleUpvote(report.id)}
                      className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                        report.userUpvoted
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                      title="Support this civic report"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{report.upvotes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                  <img
                    src={report.imageUrl}
                    alt={report.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{report.id}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {report.category}
                    </span>
                    {getStatusBadge(report.status)}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {report.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{report.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{report.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto self-end md:self-auto">
                <button
                  onClick={() => toggleUpvote(report.id)}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                    report.userUpvoted
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{report.upvotes}</span>
                </button>
                <button
                  onClick={() => onNavigate('/track', report.id)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Track</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
