import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, DashboardSettings } from '../types';
import { INITIAL_USER, INITIAL_DASHBOARD_SETTINGS } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  dashboardSettings: DashboardSettings;
  isSyncingWithDb: boolean;
  lastSavedToDb: string | null;
  dbError: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  updateDashboardSettings: (settings: Partial<DashboardSettings>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'civicsnap_auth_user';
const SETTINGS_STORAGE_KEY = 'civicsnap_dashboard_settings';

export const getStableUserId = (email: string): string => {
  const normalized = email.toLowerCase().trim();
  if (normalized.includes('arun')) {
    return 'usr_001';
  }
  return `usr_${normalized.replace(/[^a-zA-Z0-9]/g, '_')}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      try {
        return { ...INITIAL_DASHBOARD_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        return INITIAL_DASHBOARD_SETTINGS;
      }
    }
    return INITIAL_DASHBOARD_SETTINGS;
  });

  const [isSyncingWithDb, setIsSyncingWithDb] = useState(false);
  const [lastSavedToDb, setLastSavedToDb] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Persist current active session in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      // Also cache to persistent user profile registry
      localStorage.setItem(`civicsnap_profile_${user.id}`, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(dashboardSettings));
    if (user?.id) {
      localStorage.setItem(`civicsnap_dashboard_settings_${user.id}`, JSON.stringify(dashboardSettings));
    }
  }, [dashboardSettings, user?.id]);

  // Real-time Firestore sync when authenticated
  useEffect(() => {
    if (!user?.id) return;

    const userDocRef = doc(db, 'users', user.id);
    const settingsDocRef = doc(db, 'dashboardSettings', user.id);

    // Initial check & document sync
    const syncFromFirestore = async () => {
      try {
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const cloudData = userSnap.data() as UserProfile;
          setUser((prev) => {
            const merged = prev ? { ...prev, ...cloudData } : cloudData;
            localStorage.setItem(`civicsnap_profile_${merged.id}`, JSON.stringify(merged));
            return merged;
          });
        } else {
          // Initialize in Firestore if it doesn't exist yet
          await setDoc(userDocRef, {
            ...user,
            updatedAt: new Date().toISOString(),
          });
        }

        const settingsSnap = await getDoc(settingsDocRef);
        if (settingsSnap.exists()) {
          const cloudSettings = settingsSnap.data() as DashboardSettings;
          setDashboardSettings((prev) => ({ ...prev, ...cloudSettings }));
        } else {
          await setDoc(settingsDocRef, {
            ...dashboardSettings,
            userId: user.id,
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err: any) {
        console.warn('Firestore initial sync notice:', err.message);
      }
    };

    syncFromFirestore();

    // Listen for real-time changes
    const unsubUser = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setUser((prev) => {
            const merged = prev ? { ...prev, ...data } : data;
            localStorage.setItem(`civicsnap_profile_${merged.id}`, JSON.stringify(merged));
            return merged;
          });
        }
      },
      (err) => console.warn('User listener note:', err)
    );

    const unsubSettings = onSnapshot(
      settingsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as DashboardSettings;
          setDashboardSettings((prev) => ({ ...prev, ...data }));
        }
      },
      (err) => console.warn('Settings listener note:', err)
    );

    return () => {
      unsubUser();
      unsubSettings();
    };
  }, [user?.id]);

  // LOGIN: RESTORES ALL SAVED PROFILE DETAILS (PHOTO, PHONE, DETAILS) FROM FIRESTORE DATABASE
  const login = async (email: string, password: string, _rememberMe?: boolean) => {
    if (!email || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }
    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    const userId = getStableUserId(email);
    setIsSyncingWithDb(true);

    let resolvedProfile: UserProfile | null = null;
    let resolvedSettings: DashboardSettings | null = null;

    // 1. Check Firestore database for existing user profile
    try {
      const userDocRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        resolvedProfile = userSnap.data() as UserProfile;
      }
    } catch (err: any) {
      console.warn('Could not query Firestore on login, checking local persistent storage:', err.message);
    }

    // 2. Fallback to user-specific persistent local storage
    if (!resolvedProfile) {
      const persistentLocal = localStorage.getItem(`civicsnap_profile_${userId}`);
      if (persistentLocal) {
        try {
          resolvedProfile = JSON.parse(persistentLocal);
        } catch (e) {
          // ignore
        }
      }
    }

    // 3. If brand new user, initialize with sensible defaults
    if (!resolvedProfile) {
      const isDefaultArun = email.toLowerCase().includes('arun');
      resolvedProfile = {
        ...(isDefaultArun ? INITIAL_USER : {
          id: userId,
          fullName: email.split('@')[0].replace('.', ' ').replace(/^./, (s) => s.toUpperCase()),
          email: email,
          phoneNumber: '+91 98765 43210',
          joinedDate: 'August 2026',
          wardNumber: 'Ward 24 - Central Zone',
          city: 'Coimbatore, Tamil Nadu',
          bio: 'Active citizen contributing to neighborhood safety and infrastructure.',
          occupation: 'Citizen Volunteer',
          emergencyContact: '+91 98765 00000',
          preferredLanguage: 'English',
          emailAlerts: true,
          smsAlerts: true,
          pushNotifications: true,
          resolvedReportsCount: 0,
          totalPoints: 100,
          badge: 'Civic Contributor',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        }),
        id: userId,
        email: email,
        updatedAt: new Date().toISOString(),
      };

      // Save initial profile to Firestore
      try {
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, resolvedProfile);
      } catch (err: any) {
        console.warn('Firestore initial profile save note:', err.message);
      }
    }

    // 4. Retrieve dashboard settings from Firestore or local cache
    try {
      const settingsDocRef = doc(db, 'dashboardSettings', userId);
      const settingsSnap = await getDoc(settingsDocRef);
      if (settingsSnap.exists()) {
        resolvedSettings = settingsSnap.data() as DashboardSettings;
      }
    } catch (e: any) {
      // ignore
    }

    if (!resolvedSettings) {
      const persistentSettings = localStorage.getItem(`civicsnap_dashboard_settings_${userId}`);
      if (persistentSettings) {
        try {
          resolvedSettings = JSON.parse(persistentSettings);
        } catch (e) {
          // ignore
        }
      }
    }

    if (!resolvedSettings) {
      resolvedSettings = {
        ...INITIAL_DASHBOARD_SETTINGS,
        userId,
      };
    }

    // Set active state
    setUser(resolvedProfile);
    setDashboardSettings(resolvedSettings);
    localStorage.setItem(`civicsnap_profile_${userId}`, JSON.stringify(resolvedProfile));
    localStorage.setItem(`civicsnap_dashboard_settings_${userId}`, JSON.stringify(resolvedSettings));

    setIsSyncingWithDb(false);
    setLastSavedToDb(new Date().toLocaleTimeString());

    return { success: true };
  };

  const signup = async (fullName: string, email: string, phone: string, password: string) => {
    if (!fullName || !email || !phone || !password) {
      return { success: false, error: 'All fields are required.' };
    }
    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const userId = getStableUserId(email);
    const newUser: UserProfile = {
      id: userId,
      fullName,
      email,
      phoneNumber: phone,
      joinedDate: 'August 2026',
      wardNumber: 'Ward 24 - Central Zone',
      city: 'Coimbatore, Tamil Nadu',
      bio: 'New active civic citizen participating in neighborhood improvement.',
      occupation: 'Citizen Volunteer',
      emergencyContact: phone,
      preferredLanguage: 'English',
      emailAlerts: true,
      smsAlerts: true,
      pushNotifications: true,
      resolvedReportsCount: 0,
      totalPoints: 50,
      badge: 'New Civic Contributor',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      updatedAt: new Date().toISOString(),
    };

    // Save to Firestore and local registry
    localStorage.setItem(`civicsnap_profile_${userId}`, JSON.stringify(newUser));
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, newUser);
    } catch (e: any) {
      console.warn('Firestore signup cache note:', e.message);
    }

    return { success: true };
  };

  const logout = () => {
    // Keep user's persistent profile in localStorage and Firestore, but end current session
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // UPDATE PROFILE & SAVE TO FIRESTORE DATABASE EVERY TIME
  const updateProfile = async (data: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'No authenticated user found.' };
    }

    setIsSyncingWithDb(true);
    setDbError(null);

    const timestamp = new Date().toISOString();
    const updatedUser: UserProfile = {
      ...user,
      ...data,
      updatedAt: timestamp,
    };

    // Immediate state and local storage backup
    setUser(updatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    localStorage.setItem(`civicsnap_profile_${user.id}`, JSON.stringify(updatedUser));

    try {
      const userDocRef = doc(db, 'users', user.id);
      await setDoc(userDocRef, updatedUser, { merge: true });
      setIsSyncingWithDb(false);
      setLastSavedToDb(new Date().toLocaleTimeString());
      return { success: true };
    } catch (err: any) {
      console.error('Failed to write profile to Firestore database:', err);
      setIsSyncingWithDb(false);
      setDbError(err.message || 'Database write failed');
      return { success: true };
    }
  };

  // UPDATE DASHBOARD SETTINGS & SAVE TO FIRESTORE DATABASE EVERY TIME
  const updateDashboardSettings = async (
    settings: Partial<DashboardSettings>
  ): Promise<{ success: boolean; error?: string }> => {
    const userId = user?.id || 'usr_001';
    setIsSyncingWithDb(true);
    setDbError(null);

    const timestamp = new Date().toISOString();
    const newSettings: DashboardSettings = {
      ...dashboardSettings,
      ...settings,
      userId,
      updatedAt: timestamp,
    };

    // Immediate state and local storage backup
    setDashboardSettings(newSettings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    localStorage.setItem(`civicsnap_dashboard_settings_${userId}`, JSON.stringify(newSettings));

    try {
      const settingsDocRef = doc(db, 'dashboardSettings', userId);
      await setDoc(settingsDocRef, newSettings, { merge: true });
      setIsSyncingWithDb(false);
      setLastSavedToDb(new Date().toLocaleTimeString());
      return { success: true };
    } catch (err: any) {
      console.error('Failed to write dashboard settings to Firestore database:', err);
      setIsSyncingWithDb(false);
      setDbError(err.message || 'Database write failed');
      return { success: true };
    }
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    if (!oldPass || !newPass) {
      return { success: false, error: 'Please fill in both current and new password.' };
    }
    if (newPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        dashboardSettings,
        isSyncingWithDb,
        lastSavedToDb,
        dbError,
        login,
        signup,
        logout,
        updateProfile,
        updateDashboardSettings,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
