import React, { useState } from 'react';
import { Lock, Mail, User, Phone, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CivixaLogo } from '../components/common/CivixaLogo';

interface SignupPageProps {
  onNavigate: (route: string) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const { signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    const res = await signup(fullName, email, phoneNumber, password);
    setIsLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        onNavigate('/login');
      }, 1500);
    } else {
      setError(res.error || 'Registration failed. Please check your inputs.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50/40 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top back button */}
      <div className="max-w-lg w-full mx-auto flex items-center justify-between">
        <button
          id="signup-back-btn"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors py-2 px-3 rounded-lg hover:bg-slate-200/60 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Citizen Registry</span>
        </div>
      </div>

      {/* Centered Signup Card */}
      <div className="max-w-lg w-full mx-auto my-6">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/90 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

          {/* Header */}
          <div className="text-center mb-7">
            <div
              onClick={() => onNavigate('/')}
              className="inline-flex flex-col items-center justify-center mb-3 cursor-pointer hover:scale-105 transition-transform"
            >
              <CivixaLogo size="lg" tagline={false} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Create Your CIVIXA Account
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Join your city’s active network of joyful problem solvers.
            </p>
          </div>

          {/* Error / Success Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Account created successfully! Redirecting you to Login...</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="signup-name"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="signup-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Krishnan"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="signup-phone"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="signup-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Create Account Button */}
            <div className="pt-3">
              <button
                id="signup-submit-btn"
                type="submit"
                disabled={isLoading || success}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-70 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom link */}
          <div className="mt-6 text-center text-sm text-slate-600">
            <span>Already have an account? </span>
            <button
              id="signup-to-login-link"
              onClick={() => onNavigate('/login')}
              className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg w-full mx-auto text-center text-xs text-slate-400">
        © 2026 CIVIXA. Protected under municipal data standards.
      </div>
    </div>
  );
};
