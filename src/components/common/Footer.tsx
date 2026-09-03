import React from 'react';
import { Shield, MapPin, Mail, Phone } from 'lucide-react';
import { CivixaLogo } from './CivixaLogo';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="cursor-pointer" onClick={() => onNavigate('/')}>
              <CivixaLogo size="lg" textColor="light" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Empowering proactive citizens to photograph, submit, and track civic issues across municipal wards for faster municipal resolution, joyful problem-solving, and transparent governance.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Verified City Portal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Coimbatore Municipal Corporation</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-emerald-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/login')} className="hover:text-emerald-400 transition-colors">
                  Sign In
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/signup')} className="hover:text-emerald-400 transition-colors">
                  Create Account
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/report')} className="hover:text-emerald-400 transition-colors">
                  Report Civic Issue
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/track')} className="hover:text-emerald-400 transition-colors">
                  Track Complaint
                </button>
              </li>
            </ul>
          </div>

          {/* Civic Categories */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Issue Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Road Damage & Potholes</li>
              <li>Solid Waste & Garbage</li>
              <li>Streetlights & Electrical</li>
              <li>Stormwater Drainage</li>
              <li>Water Supply Pipelines</li>
              <li>Public Safety & Parks</li>
            </ul>
          </div>

          {/* Civic Helpdesk */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Municipal Helpdesk
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Toll-Free Civic Helpline: 1800 425 4321</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>support@civicsnap.org</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Corporation HQ, Big Bazaar St, Town Hall, Coimbatore</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CIVIXA. All civic rights reserved. Built for happy, clean and safe smart communities.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Citizen Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
