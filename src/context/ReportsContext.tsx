import React, { createContext, useContext, useState, useEffect } from 'react';
import { CivicReport, CivicNotification, IssueCategory, ReportStatus } from '../types';
import { INITIAL_REPORTS, INITIAL_NOTIFICATIONS } from '../data/mockData';

interface ReportsContextType {
  reports: CivicReport[];
  notifications: CivicNotification[];
  unreadNotificationCount: number;
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  };
  addReport: (newReportData: Omit<CivicReport, 'id' | 'date' | 'rawDate' | 'timeline' | 'comments' | 'upvotes' | 'authorId' | 'authorName'>) => string;
  getReportById: (id: string) => CivicReport | undefined;
  updateReportStatus: (id: string, newStatus: ReportStatus, commentText?: string) => void;
  toggleUpvote: (id: string) => void;
  addComment: (reportId: string, text: string, authorName?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  capturedHeroPhoto: string | null;
  setCapturedHeroPhoto: (url: string | null) => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

const REPORTS_STORAGE_KEY = 'civicsnap_reports_data';
const NOTIFICATIONS_STORAGE_KEY = 'civicsnap_notifications_data';

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<CivicReport[]>(() => {
    const saved = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_REPORTS;
      }
    }
    return INITIAL_REPORTS;
  });

  const [notifications, setNotifications] = useState<CivicNotification[]>(() => {
    const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [capturedHeroPhoto, setCapturedHeroPhoto] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'Pending').length,
    inProgress: reports.filter((r) => r.status === 'In Progress').length,
    resolved: reports.filter((r) => r.status === 'Resolved').length,
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const addReport = (
    newReportData: Omit<CivicReport, 'id' | 'date' | 'rawDate' | 'timeline' | 'comments' | 'upvotes' | 'authorId' | 'authorName'>
  ) => {
    const nextNumber = 125 + reports.length - INITIAL_REPORTS.length;
    const generatedId = `CX-2026-${String(nextNumber).padStart(5, '0')}`;
    const now = new Date();
    const formattedDate = 'Just now';
    const rawDate = now.toISOString().split('T')[0];

    const departmentMap: Record<IssueCategory, string> = {
      'Road Damage': 'Highways & Municipal Road Maintenance Wing',
      'Garbage': 'Sanitation & Solid Waste Management',
      'Streetlight': 'Electrical & Street Lighting Wing',
      'Drainage': 'Stormwater Drainage & Silt Management',
      'Water Supply': 'TWAD & Municipal Water Works',
      'Public Safety': 'City Municipal Traffic & Safety Cell',
      'Other': 'General Civic Administration Wing',
    };

    const newReport: CivicReport = {
      ...newReportData,
      id: generatedId,
      date: formattedDate,
      rawDate: rawDate,
      department: departmentMap[newReportData.category] || 'Civic Services Wing',
      upvotes: 1,
      userUpvoted: true,
      authorId: 'usr_001',
      authorName: 'Arun Kumar',
      timeline: [
        {
          stage: 'Submitted',
          title: 'Complaint Registered',
          description: 'Report filed with photographic evidence and geocodes.',
          timestamp: 'Just now',
          completed: true,
          current: true,
        },
        {
          stage: 'Verified',
          title: 'Verification Desk Review',
          description: 'Civic verification in queue.',
          timestamp: 'Pending',
          completed: false,
        },
        {
          stage: 'Assigned',
          title: 'Department Assignment',
          description: `Dispatched to ${departmentMap[newReportData.category]}.`,
          timestamp: 'Pending',
          completed: false,
        },
        {
          stage: 'In Progress',
          title: 'Field Team Work',
          description: 'Field inspection and remedial execution.',
          timestamp: 'Pending',
          completed: false,
        },
        {
          stage: 'Resolved',
          title: 'Citizen Signoff & Inspection',
          description: 'Resolved verification confirmation.',
          timestamp: 'Pending',
          completed: false,
        },
      ],
      comments: [
        {
          id: `c_${Date.now()}`,
          author: 'CivicSnap Bot',
          role: 'Municipal Officer',
          text: `Complaint ticket ${generatedId} generated and assigned priority [${newReportData.priority}]. Ward officer notified.`,
          timestamp: 'Just now',
        },
      ],
    };

    setReports((prev) => [newReport, ...prev]);

    // Create notification
    const newNotif: CivicNotification = {
      id: `n_${Date.now()}`,
      title: 'Complaint Registered',
      message: `Your report for ${newReport.title} (#${generatedId}) has been registered successfully.`,
      type: 'status_update',
      complaintId: generatedId,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return generatedId;
  };

  const getReportById = (id: string) => {
    return reports.find((r) => r.id.toLowerCase() === id.toLowerCase());
  };

  const updateReportStatus = (id: string, newStatus: ReportStatus, commentText?: string) => {
    setReports((prev) =>
      prev.map((report) => {
        if (report.id === id) {
          const updatedTimeline = report.timeline.map((item) => {
            if (item.stage === 'In Progress' && newStatus === 'In Progress') {
              return { ...item, completed: true, current: true, timestamp: 'Today' };
            }
            if (item.stage === 'Resolved' && newStatus === 'Resolved') {
              return { ...item, completed: true, current: true, timestamp: 'Today' };
            }
            return item;
          });

          const newComments = [...report.comments];
          if (commentText) {
            newComments.push({
              id: `c_${Date.now()}`,
              author: 'Field Engineer',
              role: 'Field Engineer',
              text: commentText,
              timestamp: 'Just now',
            });
          }

          return {
            ...report,
            status: newStatus,
            timeline: updatedTimeline,
            comments: newComments,
          };
        }
        return report;
      })
    );
  };

  const toggleUpvote = (id: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextUpvoted = !r.userUpvoted;
          return {
            ...r,
            userUpvoted: nextUpvoted,
            upvotes: nextUpvoted ? r.upvotes + 1 : Math.max(0, r.upvotes - 1),
          };
        }
        return r;
      })
    );
  };

  const addComment = (reportId: string, text: string, authorName = 'Arun Kumar') => {
    if (!text.trim()) return;
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            comments: [
              ...r.comments,
              {
                id: `c_${Date.now()}`,
                author: authorName,
                role: 'Citizen',
                text: text.trim(),
                timestamp: 'Just now',
              },
            ],
          };
        }
        return r;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        notifications,
        unreadNotificationCount,
        stats,
        addReport,
        getReportById,
        updateReportStatus,
        toggleUpvote,
        addComment,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        capturedHeroPhoto,
        setCapturedHeroPhoto,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};
