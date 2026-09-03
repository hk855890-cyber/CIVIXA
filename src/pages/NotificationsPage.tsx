import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
  CheckCheck,
  ChevronRight,
  Sparkles,
  Inbox,
} from 'lucide-react';
import { useReports } from '../context/ReportsContext';
import { CivicNotification } from '../types';

interface NotificationsPageProps {
  onNavigate: (route: string, complaintId?: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationCount,
  } = useReports();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter((n) =>
    filter === 'unread' ? !n.read : true
  );

  const getIcon = (type: CivicNotification['type']) => {
    switch (type) {
      case 'resolved':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'assigned':
        return <Wrench className="w-5 h-5 text-blue-600" />;
      case 'status_update':
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-600" />;
    }
  };

  const handleNotificationClick = (n: CivicNotification) => {
    markNotificationAsRead(n.id);
    if (n.complaintId) {
      onNavigate('/track', n.complaintId);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Notifications</span>
            {unreadNotificationCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {unreadNotificationCount} New
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Stay updated with real-time progress on your submitted civic complaints.
          </p>
        </div>

        {unreadNotificationCount > 0 && (
          <button
            id="mark-all-read-btn"
            onClick={markAllNotificationsAsRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'unread'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Unread ({unreadNotificationCount})
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">All Caught Up!</h3>
          <p className="text-xs text-slate-500">You have no unread civic notifications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 group ${
                item.read
                  ? 'bg-white border-slate-200/80 hover:border-slate-300'
                  : 'bg-emerald-50/40 border-emerald-200/90 shadow-xs hover:border-emerald-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  item.read ? 'bg-slate-100' : 'bg-white border border-emerald-200'
                }`}
              >
                {getIcon(item.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`text-sm font-bold transition-colors ${
                      item.read
                        ? 'text-slate-800'
                        : 'text-slate-950 group-hover:text-emerald-700 font-extrabold'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>

                {item.complaintId && (
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <span>View Ticket #{item.complaintId}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}
              </div>

              {!item.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
