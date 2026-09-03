import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CivixaLogo } from '../components/common/CivixaLogo';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login(email, password, rememberMe);
    setIsLoading(false);

    if (res.success) {
      onNavigate('/dashboard');
    } else {
      setError(res.error || 'Invalid credentials. Please try again.');
    }
  };

  const handleDemoSignIn = async () => {
    setEmail('arun.citizen@civixa.org');
    setPassword('civic123');
    setIsLoading(true);
    const res = await login('arun.citizen@civixa.org', 'civic123', true);
    setIsLoading(false);
    if (res.success) {
      onNavigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50/40 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top back button & minimal header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <button
          id="login-back-to-home-btn"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors py-2 px-3 rounded-lg hover:bg-slate-200/60 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure Civic Gateway</span>
        </div>
      </div>

      {/* Centered Login Card */}
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/90 p-8 sm:p-10 relative overflow-hidden">
          {/* Top Decorative accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div
              onClick={() => onNavigate('/')}
              className="inline-flex flex-col items-center justify-center mb-4 cursor-pointer hover:scale-105 transition-transform"
            >
              <CivixaLogo size="lg" tagline={false} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mt-2">Welcome Back</h2>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to report grievances and track problem resolutions.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Options: Remember me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-70 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Helper */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <button
              type="button"
              id="quick-demo-login-btn"
              onClick={handleDemoSignIn}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>One-Click Citizen Demo Login (Arun Kumar)</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm text-slate-600">
            <span>Don't have an account? </span>
            <button
              id="login-to-signup-link"
              onClick={() => onNavigate('/signup')}
              className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Create an account
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
            {resetSent ? (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-600">
                  Password reset link has been dispatched to your email address.
                </p>
                <button
                  onClick={() => {
                    setForgotModalOpen(false);
                    setResetSent(false);
                  }}
                  className="w-full py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Enter your registered citizen email to receive a password recovery link.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 py-2.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setResetSent(true)}
                    className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl"
                  >
                    Send Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer minimal info */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-slate-400">
        © 2026 CIVIXA. Secure Citizen Authentication.
      </div>
    </div>
  );
};
