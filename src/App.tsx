import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReportsProvider } from './context/ReportsContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { MyReportsPage } from './pages/MyReportsPage';
import { TrackComplaintsPage } from './pages/TrackComplaintsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AppRoute } from './types';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    const path = window.location.pathname;
    const validRoutes: AppRoute[] = [
      '/',
      '/login',
      '/signup',
      '/dashboard',
      '/report',
      '/reports',
      '/track',
      '/notifications',
      '/profile',
    ];
    return validRoutes.includes(path as AppRoute) ? (path as AppRoute) : '/';
  });

  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(null);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const validRoutes: AppRoute[] = [
        '/',
        '/login',
        '/signup',
        '/dashboard',
        '/report',
        '/reports',
        '/track',
        '/notifications',
        '/profile',
      ];
      if (validRoutes.includes(path as AppRoute)) {
        setCurrentRoute(path as AppRoute);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Protected Routes Verification: If trying to access protected route while unauthenticated, redirect to /login
  useEffect(() => {
    const protectedRoutes: AppRoute[] = [
      '/dashboard',
      '/report',
      '/reports',
      '/track',
      '/notifications',
      '/profile',
    ];

    if (!isAuthenticated && protectedRoutes.includes(currentRoute)) {
      navigate('/login');
    }
  }, [currentRoute, isAuthenticated]);

  const navigate = (route: string, complaintId?: string) => {
    const targetRoute = route as AppRoute;
    if (complaintId) {
      setActiveComplaintId(complaintId);
    }
    setCurrentRoute(targetRoute);
    window.scrollTo({ top: 0, behavior: 'instant' });

    try {
      window.history.pushState({}, '', targetRoute);
    } catch (e) {
      // Safe fallback in sandboxed iframes
    }
  };

  // 1. PUBLIC ROUTES: LANDING, LOGIN, SIGNUP
  if (currentRoute === '/') {
    return <LandingPage onNavigate={navigate} />;
  }

  if (currentRoute === '/login') {
    return <LoginPage onNavigate={navigate} />;
  }

  if (currentRoute === '/signup') {
    return <SignupPage onNavigate={navigate} />;
  }

  // 2. PROTECTED ROUTES (WRAPPED IN DASHBOARD LAYOUT)
  // Protected Guard fallback
  if (!isAuthenticated) {
    return <LoginPage onNavigate={navigate} />;
  }

  return (
    <DashboardLayout currentRoute={currentRoute} onNavigate={navigate}>
      {currentRoute === '/dashboard' && <DashboardPage onNavigate={navigate} />}
      {currentRoute === '/report' && <ReportIssuePage onNavigate={navigate} />}
      {currentRoute === '/reports' && <MyReportsPage onNavigate={navigate} />}
      {currentRoute === '/track' && (
        <TrackComplaintsPage
          initialComplaintId={activeComplaintId}
          onNavigate={navigate}
        />
      )}
      {currentRoute === '/notifications' && <NotificationsPage onNavigate={navigate} />}
      {currentRoute === '/profile' && <ProfilePage onNavigate={navigate} />}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ReportsProvider>
        <AppContent />
      </ReportsProvider>
    </AuthProvider>
  );
}
