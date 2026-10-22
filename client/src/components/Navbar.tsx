import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, User as UserIcon, LogOut, ShieldCheck, Bell, CalendarCheck, Menu, X, Car } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/#' + sectionId);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-fine)] bg-[var(--bg-main)]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Luxury Motivo Brand Identity & Geometric Logo */}
        <Link to="/" className="flex items-center space-x-3.5 group cursor-pointer">
          <div className="w-10 h-10 rounded-sm bg-[var(--text-primary)] text-[var(--bg-main)] flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition-transform duration-300">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path
                d="M8 32V8L20 22L32 8V32M14 27L20 20L26 27"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)] leading-none">
              MOTIVO
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[var(--accent-sage)] font-semibold mt-0.5">
              Mobility & Fleet Systems
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          <Link to="/" className="hover:text-[var(--text-primary)] transition-colors py-2">
            Home
          </Link>
          <Link to="/vehicles" className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5 py-2">
            <Car className="w-3.5 h-3.5 text-[var(--accent-sage)]" /> Fleet Catalogue
          </Link>
          <button
            onClick={() => scrollToSection('experience')}
            className="hover:text-[var(--text-primary)] transition-colors py-2 cursor-pointer bg-transparent border-none text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
          >
            The Experience
          </button>
          <button
            onClick={() => scrollToSection('about-motivo')}
            className="hover:text-[var(--text-primary)] transition-colors py-2 cursor-pointer bg-transparent border-none text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
          >
            About Motivo
          </button>
          <button
            onClick={() => scrollToSection('business-model')}
            className="hover:text-[var(--text-primary)] transition-colors py-2 cursor-pointer bg-transparent border-none text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
          >
            Business Model
          </button>
          <button
            onClick={() => scrollToSection('security-guarantee')}
            className="hover:text-[var(--text-primary)] transition-colors py-2 cursor-pointer bg-transparent border-none text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
          >
            Security & Fleet
          </button>

          {user ? (
            <Link to="/dashboard" className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 py-2">
              <CalendarCheck className="w-3.5 h-3.5" /> My Bookings
            </Link>
          ) : (
            <Link to="/login" className="hover:text-[var(--text-primary)] transition-colors py-2">
              Client Portal
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-1.5 text-[var(--accent-sage)] font-bold px-2.5 py-1 rounded-sm border border-[var(--accent-sage)]/30 bg-[var(--surface-sage)]/50">
              <ShieldCheck className="w-3.5 h-3.5" />
              Fleet Command
            </Link>
          )}
        </nav>

        {/* Right Action Controls & Dark Mode Switcher */}
        <div className="flex items-center space-x-3.5">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] hover:bg-[var(--surface-sage)] text-[var(--text-primary)] transition shadow-2xs cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-3">
              <Link
                to="/notifications"
                className="p-2.5 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] hover:bg-[var(--surface-sage)] text-[var(--text-primary)] transition relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-emerald-600 absolute top-1.5 right-1.5 ring-2 ring-[var(--bg-main)]"></span>
              </Link>
              
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-primary)] py-1.5 px-3 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] hover:bg-[var(--surface-sage)] transition"
              >
                <div className="w-5 h-5 rounded-full bg-[var(--surface-sage)] flex items-center justify-center">
                  <UserIcon className="w-3 h-3 text-[var(--accent-sage)]" />
                </div>
                <span className="hidden sm:inline font-mono">{user.name.split(' ')[0]}</span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2 text-[var(--text-secondary)] hover:text-red-600 transition cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-2 transition"
              >
                Sign In
              </Link>
              <Link
                to="/vehicles"
                className="bg-[var(--text-primary)] text-[var(--bg-main)] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-sm hover:opacity-90 transition shadow-sm"
              >
                Reserve Now
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-sm border border-[var(--border-fine)] text-[var(--text-primary)] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[var(--border-fine)] bg-[var(--card-bg)] px-6 py-6 space-y-3 text-sm font-medium">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[var(--text-primary)]">
            Home
          </Link>
          <Link to="/vehicles" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[var(--text-primary)]">
            Fleet Catalogue
          </Link>
          <button onClick={() => scrollToSection('experience')} className="block w-full text-left py-2 text-[var(--text-primary)]">
            The Experience
          </button>
          <button onClick={() => scrollToSection('about-motivo')} className="block w-full text-left py-2 text-[var(--text-primary)]">
            About Motivo
          </button>
          <button onClick={() => scrollToSection('business-model')} className="block w-full text-left py-2 text-[var(--text-primary)]">
            Business Model
          </button>
          <button onClick={() => scrollToSection('security-guarantee')} className="block w-full text-left py-2 text-[var(--text-primary)]">
            Security & Fleet
          </button>
          {user && (
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[var(--text-primary)]">
              My Bookings
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[var(--accent-sage)] font-bold">
              Fleet Command Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
