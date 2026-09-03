export type IssueCategory =
  | 'Road Damage'
  | 'Garbage'
  | 'Streetlight'
  | 'Drainage'
  | 'Water Supply'
  | 'Public Safety'
  | 'Other';

export type ReportStatus = 'Pending' | 'In Progress' | 'Resolved';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface TimelineEvent {
  stage: 'Submitted' | 'Verified' | 'Assigned' | 'In Progress' | 'Resolved';
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
  assignedOfficer?: string;
  department?: string;
}

export interface ComplaintComment {
  id: string;
  author: string;
  role: 'Citizen' | 'Municipal Officer' | 'Field Engineer';
  avatar?: string;
  text: string;
  timestamp: string;
}

export interface CivicReport {
  id: string;
  title: string;
  category: IssueCategory;
  description: string;
  location: string;
  area: string;
  city: string;
  coordinates?: { lat: number; lng: number };
  imageUrl: string;
  date: string;
  rawDate: string;
  status: ReportStatus;
  priority: PriorityLevel;
  department: string;
  assignedOfficer?: string;
  upvotes: number;
  userUpvoted?: boolean;
  expectedResolutionDays?: number;
  timeline: TimelineEvent[];
  comments: ComplaintComment[];
  authorId: string;
  authorName: string;
}

export interface CivicNotification {
  id: string;
  title: string;
  message: string;
  type: 'status_update' | 'assigned' | 'resolved' | 'announcement';
  complaintId?: string;
  timestamp: string;
  read: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  joinedDate: string;
  avatarUrl?: string;
  wardNumber: string;
  city: string;
  bio?: string;
  occupation?: string;
  emergencyContact?: string;
  preferredLanguage?: string;
  emailAlerts?: boolean;
  smsAlerts?: boolean;
  pushNotifications?: boolean;
  resolvedReportsCount: number;
  totalPoints: number;
  badge: string;
  updatedAt?: string;
}

export interface DashboardSettings {
  userId: string;
  defaultViewMode: 'grid' | 'list';
  defaultStatusFilter: 'All' | 'Pending' | 'In Progress' | 'Resolved';
  defaultSortBy: 'newest' | 'priority' | 'upvotes';
  showHeroAnimation: boolean;
  showQuickActions: boolean;
  showImpactScoreCard: boolean;
  mapStyle: 'standard' | 'satellite' | 'clean';
  compactView: boolean;
  autoRefreshInterval: number; // in seconds, 0 = off
  updatedAt?: string;
}

export type AppRoute =
  | '/'
  | '/login'
  | '/signup'
  | '/dashboard'
  | '/report'
  | '/reports'
  | '/track'
  | '/notifications'
  | '/profile';
