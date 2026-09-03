import React from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Lightbulb,
  Droplets,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Building2,
  FileCheck,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { CharacterHeroScene } from '../components/character/CharacterHeroScene';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReportClick = () => {
    if (isAuthenticated) {
      onNavigate('/report');
    } else {
      onNavigate('/login');
    }
  };

  const categories = [
    {
      title: 'Road Damage & Potholes',
      desc: 'Cracked asphalt, deep potholes, broken sidewalks, and hazardous speed breakers.',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      title: 'Garbage & Waste Spills',
      desc: 'Overflowing community bins, open dumping, and uncollected municipal garbage.',
      icon: Trash2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Streetlights & Electrical',
      desc: 'Dark streetlights, flickering fixtures, exposed electrical cables, and damaged poles.',
      icon: Lightbulb,
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    },
    {
      title: 'Drainage & Waterlogging',
      desc: 'Clogged stormwater drains, stagnant sewage, and monsoon overflow bottlenecks.',
      icon: Droplets,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'Water Supply & Leaks',
      desc: 'Bursted municipal distribution pipes, contaminated water, or low pressure.',
      icon: Droplets,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    },
    {
      title: 'Public Safety & Parks',
      desc: 'Broken playground equipment, fallen tree branches, and safety hazards.',
      icon: ShieldAlert,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sticky Header */}
      <Header onNavigate={onNavigate} onScrollToSection={handleScrollTo} />

      {/* Main Content */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section id="hero" className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Hero Copy & CTA */}
              <div className="lg:col-span-6 space-y-6 text-left">
                {/* Civic Tech Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-xs font-semibold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Empowering 100+ Municipal Wards</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
                  Your City.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    Your Voice.
                  </span>{' '}
                  Your Impact.
                </h1>

                {/* Subheading */}
                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
                  Report civic issues instantly and help build a cleaner, safer and better community.
                </p>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    id="hero-report-issue-btn"
                    onClick={handleReportClick}
                    className="px-7 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-base shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <Camera className="w-5 h-5 stroke-[2.2]" />
                    <span>Report a Civic Issue</span>
                  </button>

                  <button
                    id="hero-how-it-works-btn"
                    onClick={() => handleScrollTo('how-it-works')}
                    className="px-6 py-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>How It Works</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                {/* Citizen Trust Badges */}
                <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-left">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">12,400+</div>
                    <div className="text-xs text-slate-500 font-medium">Issues Solved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">48 hrs</div>
                    <div className="text-xs text-slate-500 font-medium">Avg. Response</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">96.8%</div>
                    <div className="text-xs text-slate-500 font-medium">Resolution Rate</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Natural 3D Character Walking & Photo Capture Scene */}
              <div className="lg:col-span-6 w-full">
                <CharacterHeroScene
                  onContinueToLogin={() => onNavigate('/login')}
                  onExploreHowItWorks={() => handleScrollTo('how-it-works')}
                />
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Simple 3-Step Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                How CIVIXA Solves Grievances
              </h2>
              <p className="text-slate-600 text-base">
                Report public issues in seconds, track solutions step-by-step, and bring smiles back to your neighborhood.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative p-8 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-emerald-300 transition-all hover:shadow-lg space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/20">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900">Photograph the Problem</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Spot a broken streetlight, pothole, or garbage pile. Snap a quick photo with your smartphone or upload from gallery.
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Instant geotag capture</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative p-8 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-emerald-300 transition-all hover:shadow-lg space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-teal-600/20">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900">Ward Dispatch & Verification</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The municipal control desk auto-routes your complaint with unique ID to the respective ward engineer and department team.
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Assigned to field supervisor</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative p-8 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-emerald-300 transition-all hover:shadow-lg space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-slate-900/20">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900">Track Real-Time Fix</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Follow each stage from inspection to repair completion. Receive automated SMS and app alerts when the work is done.
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Photographic proof of resolution</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CIVIC CATEGORIES SECTION */}
        <section id="categories" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Civic Services
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Issues You Can Report
              </h2>
              <p className="text-slate-600 text-base">
                CIVIXA connects citizens directly to specialized municipal corporation wings for fast resolution.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${cat.color}`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{cat.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{cat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ABOUT & CITIZEN TRANSPARENCY */}
        <section id="about" className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Citizen Empowerment
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Transparent Municipal Governance in Your Pocket
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  CIVIXA is built on the belief that cleaner, safer, and happier neighborhoods happen when proactive citizens and municipal field teams collaborate seamlessly. No bureaucratic maze, no endless follow-ups.
                </p>

                <div className="space-y-3.5 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-slate-700">
                      <strong>Public Accountability:</strong> Every complaint gets a tracked public ticket number with department SLA.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-slate-700">
                      <strong>Direct Officer Assignment:</strong> Notifications specify the assigned engineer’s name and zone unit.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-slate-700">
                      <strong>Visual Proof of Completion:</strong> Inspect before-and-after photographs uploaded by city field crews.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-2xl font-bold mb-4">Start Improving Your Neighborhood</h3>
                <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                  Join thousands of active residents who photograph and report civic issues daily. It takes less than 30 seconds to report your first issue.
                </p>

                <div className="space-y-4">
                  <button
                    onClick={handleReportClick}
                    className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Report a Civic Issue Now</span>
                  </button>

                  <button
                    onClick={() => onNavigate('/login')}
                    className="w-full py-3.5 px-6 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Sign In to Existing Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT / HELPLINE SECTION */}
        <section id="contact" className="py-16 bg-slate-100/70 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>24/7 Municipal Control Helpline</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Emergency Civic Breakdown?
                </h3>
                <p className="text-slate-600 text-sm max-w-lg">
                  For dangerous open manholes, active electrical live wire spark, or urgent water main bursts, call the emergency civic hotline.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <a
                  href="tel:18004254321"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>1800 425 4321 (Toll-Free)</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
