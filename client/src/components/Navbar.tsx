import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, User as UserIcon, LogOut, ShieldCheck, Bell } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-fine)] bg-[var(--bg-main)]/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Wordmark matching reference */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 rounded-sm bg-[var(--text-primary)] text-[var(--bg-main)] flex items-center justify-center font-bold text-base tracking-tighter">
            M
          </div>
          <span className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            motivo
          </span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-10 text-sm font-medium text-[var(--text-secondary)]">
          <Link to="/vehicles" className="hover:text-[var(--text-primary)] transition-colors">
            Vehicles
          </Link>
          <Link to="/vehicles" className="hover:text-[var(--text-primary)] transition-colors">
            Rent
          </Link>
          {user ? (
            <Link to="/dashboard" className="hover:text-[var(--text-primary)] transition-colors">
              Records
            </Link>
          ) : (
            <Link to="/login" className="hover:text-[var(--text-primary)] transition-colors">
              Records
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-1.5 text-[var(--accent-sage)] font-semibold hover:underline">
              <ShieldCheck className="w-4 h-4" />
              Admin Fleet
            </Link>
          )}
        </nav>

        {/* Action Controls & Theme Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-md border border-[var(--border-fine)] hover:bg-[var(--surface-sage)] text-[var(--text-primary)] transition"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-3">
              <Link
                to="/notifications"
                className="p-2 rounded-md border border-[var(--border-fine)] hover:bg-[var(--surface-sage)] text-[var(--text-primary)] transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-sm font-medium text-[var(--text-primary)] hover:opacity-80"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--surface-sage)] flex items-center justify-center border border-[var(--border-fine)]">
                  <UserIcon className="w-4 h-4 text-[var(--accent-sage)]" />
                </div>
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2 text-[var(--text-secondary)] hover:text-red-600 transition"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-2"
              >
                Sign in
              </Link>
              <Link
                to="/vehicles"
                className="bg-[var(--text-primary)] text-[var(--bg-main)] px-5 py-2.5 text-sm font-medium rounded-sm hover:opacity-90 transition tracking-tight"
              >
                Rent now
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
