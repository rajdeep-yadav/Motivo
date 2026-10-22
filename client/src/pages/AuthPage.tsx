import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload: any = { email, password };
      if (isRegister) {
        payload.name = name;
        payload.phone = phone;
        payload.drivingLicense = drivingLicense;
      }

      const res = await apiRequest<{ success: boolean; token: string; user: any; message?: string }>(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(redirect === '/admin' ? '/dashboard' : redirect);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Account Auto-Fill Helper
  const fillDemoAccount = (role: 'admin' | 'customer') => {
    setIsRegister(false);
    setError(null);
    if (role === 'admin') {
      setEmail('admin@motivo.com');
      setPassword('Admin@Motivo2026');
    } else {
      setEmail('rajdeep@motivo.com');
      setPassword('Customer@Motivo2026');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md p-8 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] shadow-sm space-y-6">
        
        <div className="text-center space-y-1">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--accent-sage)]">
            MOTIVO IDENTITY ACCESS
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            {isRegister
              ? 'Join Motivo for seamless fleet bookings and trip history'
              : 'Enter your credentials to access your dashboard'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-sm text-xs text-red-700 dark:text-red-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajdeep Yadav"
                  className="w-full text-xs p-2.5 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full text-xs p-2.5 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">License No.</label>
                  <input
                    type="text"
                    value={drivingLicense}
                    onChange={(e) => setDrivingLicense(e.target.value)}
                    placeholder="DL-..."
                    className="w-full text-xs p-2.5 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full text-xs p-2.5 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs p-2.5 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--text-primary)] text-[var(--bg-main)] text-xs font-semibold uppercase tracking-wider rounded-sm hover:opacity-90 disabled:opacity-50 transition shadow-sm"
          >
            {loading ? 'Verifying...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast-Switch Buttons */}
        <div className="pt-4 border-t border-[var(--border-fine)] space-y-2">
          <p className="text-[11px] text-[var(--text-secondary)] text-center font-medium">
            Demo Evaluation Fast-Logins:
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('customer')}
              className="flex-1 py-1.5 px-2 text-xs rounded-sm border border-[var(--border-fine)] bg-[var(--surface-sage)]/50 hover:bg-[var(--surface-sage)] text-[var(--text-primary)] transition"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="flex-1 py-1.5 px-2 text-xs rounded-sm border border-[var(--border-fine)] bg-[var(--surface-sage)]/50 hover:bg-[var(--surface-sage)] text-[var(--text-primary)] transition flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-sage)]" /> Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[var(--text-secondary)]">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-[var(--text-primary)] font-semibold underline"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              New to Motivo?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-[var(--text-primary)] font-semibold underline"
              >
                Create an account
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
