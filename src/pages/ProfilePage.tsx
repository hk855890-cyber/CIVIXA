import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Award,
  ShieldCheck,
  Edit3,
  Lock,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Camera,
  Upload,
  Database,
  Sliders,
  BellRing,
  Globe,
  Briefcase,
  HeartHandshake,
  Check,
  RefreshCw,
  SlidersHorizontal,
  LayoutGrid,
  Eye,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportsContext';

interface ProfilePageProps {
  onNavigate: (route: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const {
    user,
    logout,
    updateProfile,
    dashboardSettings,
    updateDashboardSettings,
    changePassword,
    isSyncingWithDb,
    lastSavedToDb,
  } = useAuth();
  const { reports, stats } = useReports();

  const [activeTab, setActiveTab] = useState<'profile' | 'dashboardSettings' | 'notifications'>('profile');

  // Profile fields
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.fullName || 'Arun Kumar');
  const [email, setEmail] = useState(user?.email || 'arun.citizen@civicsnap.org');
  const [phone, setPhone] = useState(user?.phoneNumber || '+91 98765 43210');
  const [ward, setWard] = useState(user?.wardNumber || 'Ward 24 - Central Zone');
  const [city, setCity] = useState(user?.city || 'Coimbatore, Tamil Nadu');
  const [bio, setBio] = useState(
    user?.bio || 'Active civic volunteer committed to pothole reporting and urban infrastructure improvements.'
  );
  const [occupation, setOccupation] = useState(user?.occupation || 'Software Engineer & Urban Volunteer');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '+91 98765 00000');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'English');
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
  );

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(user?.emailAlerts ?? true);
  const [smsAlerts, setSmsAlerts] = useState(user?.smsAlerts ?? true);
  const [pushNotifications, setPushNotifications] = useState(user?.pushNotifications ?? true);

  // Dashboard Settings State
  const [defaultViewMode, setDefaultViewMode] = useState<'grid' | 'list'>(dashboardSettings.defaultViewMode || 'grid');
  const [defaultStatusFilter, setDefaultStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Resolved'>(
    dashboardSettings.defaultStatusFilter || 'All'
  );
  const [defaultSortBy, setDefaultSortBy] = useState<'newest' | 'priority' | 'upvotes'>(
    dashboardSettings.defaultSortBy || 'newest'
  );
  const [showHeroAnimation, setShowHeroAnimation] = useState(dashboardSettings.showHeroAnimation ?? true);
  const [showQuickActions, setShowQuickActions] = useState(dashboardSettings.showQuickActions ?? true);
  const [showImpactScoreCard, setShowImpactScoreCard] = useState(dashboardSettings.showImpactScoreCard ?? true);
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'clean'>(
    dashboardSettings.mapStyle || 'standard'
  );
  const [compactView, setCompactView] = useState(dashboardSettings.compactView ?? false);

  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep form state in sync when user or dashboardSettings is loaded or updated
  useEffect(() => {
    if (user) {
      setName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phoneNumber || '');
      setWard(user.wardNumber || 'Ward 24 - Central Zone');
      setCity(user.city || 'Coimbatore, Tamil Nadu');
      if (user.bio !== undefined) setBio(user.bio);
      if (user.occupation !== undefined) setOccupation(user.occupation);
      if (user.emergencyContact !== undefined) setEmergencyContact(user.emergencyContact);
      if (user.preferredLanguage !== undefined) setPreferredLanguage(user.preferredLanguage);
      if (user.avatarUrl) setAvatarUrl(user.avatarUrl);
      if (user.emailAlerts !== undefined) setEmailAlerts(user.emailAlerts);
      if (user.smsAlerts !== undefined) setSmsAlerts(user.smsAlerts);
      if (user.pushNotifications !== undefined) setPushNotifications(user.pushNotifications);
    }
  }, [user]);

  useEffect(() => {
    if (dashboardSettings) {
      if (dashboardSettings.defaultViewMode) setDefaultViewMode(dashboardSettings.defaultViewMode);
      if (dashboardSettings.defaultStatusFilter) setDefaultStatusFilter(dashboardSettings.defaultStatusFilter);
      if (dashboardSettings.defaultSortBy) setDefaultSortBy(dashboardSettings.defaultSortBy);
      if (dashboardSettings.showHeroAnimation !== undefined) setShowHeroAnimation(dashboardSettings.showHeroAnimation);
      if (dashboardSettings.showQuickActions !== undefined) setShowQuickActions(dashboardSettings.showQuickActions);
      if (dashboardSettings.showImpactScoreCard !== undefined) setShowImpactScoreCard(dashboardSettings.showImpactScoreCard);
      if (dashboardSettings.mapStyle) setMapStyle(dashboardSettings.mapStyle);
      if (dashboardSettings.compactView !== undefined) setCompactView(dashboardSettings.compactView);
    }
  }, [dashboardSettings]);

  // Password Modal
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Pre-set avatar library matching 3D civic styles
  const PRESET_AVATARS = [
    {
      name: 'Orange Shirt Guardian (Hero Character)',
      url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Civic Explorer',
      url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Community Leader',
      url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Urban Architect',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
  ];

  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        setPhotoModalOpen(false);
        // Automatically save to database
        updateProfile({ avatarUrl: result });
        setSaveSuccessMsg('Profile photo updated & saved to database!');
        setTimeout(() => setSaveSuccessMsg(null), 3500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetAvatar = (url: string) => {
    setAvatarUrl(url);
    setPhotoModalOpen(false);
    updateProfile({ avatarUrl: url });
    setSaveSuccessMsg('Avatar updated & saved to Firestore database!');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateProfile({
      fullName: name,
      email,
      phoneNumber: phone,
      wardNumber: ward,
      city,
      bio,
      occupation,
      emergencyContact,
      preferredLanguage,
      avatarUrl,
      emailAlerts,
      smsAlerts,
      pushNotifications,
    });

    if (res.success) {
      setIsEditing(false);
      setSaveSuccessMsg('Profile changes saved to Firestore Database successfully! ✓');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    }
  };

  const handleSaveDashboardSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateDashboardSettings({
      defaultViewMode,
      defaultStatusFilter,
      defaultSortBy,
      showHeroAnimation,
      showQuickActions,
      showImpactScoreCard,
      mapStyle,
      compactView,
    });

    if (res.success) {
      setSaveSuccessMsg('Dashboard settings saved to Firestore Database successfully! ✓');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    const res = await changePassword(currentPassword, newPassword);
    if (res.success) {
      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordModalOpen(false);
        setPasswordSuccess(false);
        setCurrentPassword('');
        setNewPassword('');
      }, 1500);
    } else {
      setPasswordError(res.error || 'Failed to update password.');
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header & Firestore DB Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Account & Dashboard Settings
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your personal profile, avatar photo, ward information, and customize your dashboard preferences.
          </p>
        </div>

        {/* Database Persistence Pill Indicator */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold self-start sm:self-auto shadow-2xs">
          <Database className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Connected to Cloud Firestore</span>
          {lastSavedToDb && (
            <span className="text-[11px] text-emerald-600 font-mono">
              (Saved {lastSavedToDb})
            </span>
          )}
        </div>
      </div>

      {/* SUCCESS BANNER */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white text-sm font-semibold flex items-center justify-between shadow-lg shadow-emerald-600/20 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{saveSuccessMsg}</span>
          </div>
          <span className="text-xs bg-emerald-700/80 px-2.5 py-1 rounded-lg">Cloud Synced</span>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Photo</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboardSettings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'dashboardSettings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Dashboard Customization</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'notifications'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Alerts & Notifications</span>
        </button>
      </div>

      {/* TAB 1: PROFILE & PHOTO SETTINGS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-8">
          {/* Top Identity Header with Avatar & Change Photo Button */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
            <div className="relative group">
              <div className="w-28 h-28 rounded-3xl overflow-hidden bg-slate-900 text-white flex items-center justify-center font-bold text-3xl shadow-xl border-4 border-white">
                <img
                  src={avatarUrl}
                  alt={user?.fullName || name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                id="open-change-photo-modal-btn"
                onClick={() => setPhotoModalOpen(true)}
                className="absolute -bottom-2 -right-2 p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
                title="Change Avatar Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">{user?.fullName || name}</h2>
                  <p className="text-xs text-slate-500 font-medium">{occupation}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 self-center sm:self-auto">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{user?.badge || 'Active Civic Guardian'}</span>
                </span>
              </div>

              <p className="text-xs text-slate-600 flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{ward}, {city}</span>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-amber-800">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{user?.totalPoints || 340} Civic Points</span>
                </div>
                <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{stats.resolved} Resolved Reports</span>
                </div>
              </div>
            </div>
          </div>

          {/* EDIT FORM / VIEW DETAILS */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Full Name <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Email Address <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Occupation / Role
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Urban Planner, Citizen Volunteer"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Municipal Ward
                  </label>
                  <input
                    type="text"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="e.g. Ward 24 - Central Zone"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    City / District
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Bio / Citizen Statement
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short note about your civic contributions..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="save-profile-to-db-btn"
                  disabled={isSyncingWithDb}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSyncingWithDb ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Database className="w-4 h-4" />
                  )}
                  <span>Save Changes to Database</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Email Address
                  </span>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{user?.email || email}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Phone Number
                  </span>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{user?.phoneNumber || phone}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Occupation
                  </span>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>{user?.occupation || occupation}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Municipal Ward
                  </span>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{user?.wardNumber || ward}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Citizen Statement / Bio
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {user?.bio || bio}
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    id="edit-profile-btn"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile Details</span>
                  </button>

                  <button
                    id="change-password-btn"
                    onClick={() => setPasswordModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Change Password</span>
                  </button>
                </div>

                <button
                  id="profile-logout-btn"
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DASHBOARD CUSTOMIZATION & PERSISTENCE */}
      {activeTab === 'dashboardSettings' && (
        <form
          onSubmit={handleSaveDashboardSettings}
          className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Dashboard Display & Layout Preferences
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize how metrics, report grids, and civic maps are organized on your dashboard.
            </p>
          </div>

          <div className="space-y-6">
            {/* View Mode Default */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Default Report Layout
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setDefaultViewMode('grid')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    defaultViewMode === 'grid'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Grid Cards View</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDefaultViewMode('list')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    defaultViewMode === 'list'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Compact List View</span>
                </button>
              </div>
            </div>

            {/* Default Status Filter & Sort Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Default Status Filter
                </label>
                <select
                  value={defaultStatusFilter}
                  onChange={(e) => setDefaultStatusFilter(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="All">All Reports (Default)</option>
                  <option value="Pending">Pending Only</option>
                  <option value="In Progress">In Progress Only</option>
                  <option value="Resolved">Resolved Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Default Sort Order
                </label>
                <select
                  value={defaultSortBy}
                  onChange={(e) => setDefaultSortBy(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="newest">Newest First</option>
                  <option value="priority">Highest Priority First</option>
                  <option value="upvotes">Most Upvoted / Supported</option>
                </select>
              </div>
            </div>

            {/* Visual Toggles */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Dashboard Modules Visibility
              </label>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">
                      Show Quick Action Report Banner
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Display one-click "Report New Issue" callout card at the top of dashboard.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showQuickActions}
                    onChange={(e) => setShowQuickActions(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">
                      Show Civic Impact Score Card
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Highlight citizen points and resolution badges in the statistics panel.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showImpactScoreCard}
                    onChange={(e) => setShowImpactScoreCard(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">
                      High Density Mode
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Reduce padding between cards to display more civic information on screen.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={compactView}
                    onChange={(e) => setCompactView(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              id="save-dashboard-settings-btn"
              disabled={isSyncingWithDb}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSyncingWithDb ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Database className="w-4 h-4" />
              )}
              <span>Save Dashboard Settings to Database</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: NOTIFICATIONS & ALERTS PREFERENCES */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Notification & Emergency Broadcast Preferences
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose how municipal departments notify you regarding verified complaints and work orders.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">
                  SMS Instant Status Updates
                </span>
                <span className="text-[11px] text-slate-500">
                  Receive SMS on {phone} when engineer begins repairs or resolves the issue.
                </span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => {
                  setSmsAlerts(e.target.checked);
                  updateProfile({ smsAlerts: e.target.checked });
                }}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">
                  Email Progress Digest
                </span>
                <span className="text-[11px] text-slate-500">
                  Receive weekly breakdown of resolved community issues in {ward}.
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => {
                  setEmailAlerts(e.target.checked);
                  updateProfile({ emailAlerts: e.target.checked });
                }}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">
                  Push Alerts for Municipal Warnings
                </span>
                <span className="text-[11px] text-slate-500">
                  Receive real-time alerts for heavy rain flood warnings, road closures, and power grid maintenance.
                </span>
              </div>
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => {
                  setPushNotifications(e.target.checked);
                  updateProfile({ pushNotifications: e.target.checked });
                }}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>
      )}

      {/* MODAL 1: CHANGE PROFILE PHOTO MODAL */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Change Profile Photo</h3>
              <button
                onClick={() => setPhotoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Custom Upload Trigger */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCustomPhotoUpload}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">Upload Photo from Device</p>
              <p className="text-[11px] text-slate-500">Supports JPG, PNG, WEBP</p>
            </div>

            {/* Preset Avatar Gallery */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Or choose a 3D Civic Avatar:
              </span>
              <div className="grid grid-cols-2 gap-3">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.name}
                    type="button"
                    onClick={() => handleSelectPresetAvatar(av.url)}
                    className="p-2 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 flex items-center gap-3 transition-all text-left cursor-pointer group"
                  >
                    <img
                      src={av.url}
                      alt={av.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700 line-clamp-1">
                      {av.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPhotoModalOpen(false)}
              className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: CHANGE PASSWORD MODAL */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">Change Password</h3>

            {passwordError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password changed successfully!</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
