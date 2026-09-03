import React, { useState } from 'react';
import { Menu, X, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CivixaLogo } from './CivixaLogo';

interface HeaderProps {
  onNavigate: (route: string) => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onScrollToSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Tagline */}
        <div
          id="civixa-brand-logo"
          onClick={() => onNavigate('/')}
          className="cursor-pointer group"
        >
          <CivixaLogo size="md" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavClick('hero')}
            className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            Civic Categories
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Right Side CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <button
              id="header-dashboard-btn"
              onClick={() => onNavigate('/dashboard')}
              className="px-4 py-2.5 rounded-xl border border-emerald-600/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>
          ) : (
            <button
              id="header-signin-btn"
              onClick={() => onNavigate('/login')}
              className="px-4 py-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 font-semibold text-sm transition-all cursor-pointer"
            >
              Sign In
            </button>
          )}

          <button
            id="header-report-issue-btn"
            onClick={() => onNavigate(isAuthenticated ? '/report' : '/login')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Report an Issue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick('hero')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Civic Categories
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Contact
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('/dashboard');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-sm flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('/login');
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(isAuthenticated ? '/report' : '/login');
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <span>Report an Issue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
