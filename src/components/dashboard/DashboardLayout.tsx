import React, { useState } from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Compass,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportsContext';
import { CivixaLogo } from '../common/CivixaLogo';

interface DashboardLayoutProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentRoute,
  onNavigate,
  children,
}) => {
  const { user, logout } = useAuth();
  const { unreadNotificationCount } = useReports();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
    { name: 'Report Issue', route: '/report', icon: PlusCircle },
    { name: 'My Reports', route: '/reports', icon: FileText },
    { name: 'Track Complaints', route: '/track', icon: Compass },
    {
      name: 'Notifications',
      route: '/notifications',
      icon: Bell,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
    },
    { name: 'Profile', route: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  const handleNavClick = (route: string) => {
    setMobileDrawerOpen(false);
    onNavigate(route);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-900">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-slate-900 text-slate-200 shrink-0 border-r border-slate-800">
        {/* Sidebar Header / Logo */}
        <div className="p-6 border-b border-slate-800/80">
          <div
            onClick={() => onNavigate('/')}
            className="cursor-pointer group"
          >
            <CivixaLogo size="sm" textColor="light" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                id={`sidebar-nav-${item.route.replace('/', '')}`}
                onClick={() => handleNavClick(item.route)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-slate-950 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Ward / Area Quick Info */}
        <div className="mx-4 mb-4 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Coimbatore Central</span>
          </div>
          <p className="text-[11px] text-slate-400">Ward 24 Municipal Jurisdiction</p>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800">
          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER MODAL */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-950/70 backdrop-blur-xs flex">
          <div className="w-72 bg-slate-900 text-slate-200 h-full flex flex-col p-5 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <CivixaLogo size="sm" textColor="light" />
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 py-6 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => handleNavClick(item.route)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium ${
                      isActive
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-slate-950 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
        </div>
      )}

      {/* MAIN VIEWPORT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* DASHBOARD TOP HEADER */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile menu trigger + Greetings */}
            <div className="flex items-center gap-3">
              <button
                id="mobile-drawer-toggle-btn"
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Good morning, {user?.fullName?.split(' ')[0] || 'Citizen'} 👋</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                  Welcome to your CIVIXA grievance & resolution portal.
                </p>
              </div>
            </div>

            {/* Top Right Controls: Notifications & User Profile */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Notifications Button */}
              <button
                id="header-notification-icon"
                onClick={() => onNavigate('/notifications')}
                className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 border-2 border-white rounded-full" />
                )}
              </button>

              {/* Profile Avatar & Name Pill */}
              <div
                id="header-user-profile-pill"
                onClick={() => onNavigate('/profile')}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.fullName?.charAt(0) || 'A'
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 hidden sm:inline">
                  {user?.fullName || 'Arun Kumar'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 hidden sm:inline" />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
