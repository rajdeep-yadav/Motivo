import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, User as UserIcon, LogOut, ShieldCheck, Bell, CalendarCheck, Menu, X, Car } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
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

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-fine)] bg-[var(--bg-main)]/90 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Luxury Motivo Brand Identity & Geometric Logo */}
        <Link to="/" className="flex items-center space-x-3.5 group cursor-pointer select-none">
          <div className="w-10 h-10 rounded-sm bg-[var(--text-primary)] text-[var(--bg-main)] flex items-center justify-center p-2 shadow-xs group-hover:scale-105 group-hover:rotate-1 transition-all duration-300 ease-out">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform transition-transform duration-300 group-hover:scale-110">
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
            <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)] leading-none transition-colors duration-200 group-hover:text-[var(--accent-sage)]">
              MOTIVO
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[var(--accent-sage)] font-semibold mt-0.5">
              Mobility & Fleet Systems
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Responsive breakpoints with xl & lg support) */}
        <nav className="hidden xl:flex items-center space-x-6 2xl:space-x-7 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          <Link
            to="/"
            className={`motivo-navlink py-2 ${isActive('/') ? 'text-[var(--text-primary)] active font-bold' : 'hover:text-[var(--text-primary)]'}`}
          >
            Home
          </Link>
          <Link
            to="/vehicles"
            className={`motivo-navlink py-2 flex items-center gap-1.5 ${isActive('/vehicles') ? 'text-[var(--text-primary)] active font-bold' : 'hover:text-[var(--text-primary)]'}`}
          >
            <Car className="w-3.5 h-3.5 text-[var(--accent-sage)]" /> Fleet Catalogue
          </Link>
          <button
            onClick={() => scrollToSection('experience')}
            className="motivo-navlink py-2 cursor-pointer bg-transparent border-none text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            The Experience
          </button>
          <button
            onClick={() => scrollToSection('about-motivo')}
            className="motivo-navlink py-2 cursor-pointer bg-transparent border-none text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            About Motivo
          </button>
          <button
            onClick={() => scrollToSection('business-model')}
            className="motivo-navlink py-2 cursor-pointer bg-transparent border-none text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Business Model
          </button>
          <button
            onClick={() => scrollToSection('security-guarantee')}
            className="motivo-navlink py-2 cursor-pointer bg-transparent border-none text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Security & Fleet
          </button>

          {user ? (
            <Link
              to="/dashboard"
              className={`motivo-navlink py-2 flex items-center gap-1 ${isActive('/dashboard') ? 'text-[var(--text-primary)] active font-bold' : 'hover:text-[var(--text-primary)]'}`}
            >
              <CalendarCheck className="w-3.5 h-3.5" /> My Bookings
            </Link>
          ) : (
            <Link
              to="/login"
              className={`motivo-navlink py-2 ${isActive('/login') ? 'text-[var(--text-primary)] active font-bold' : 'hover:text-[var(--text-primary)]'}`}
            >
              Client Portal
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-[var(--accent-sage)] font-bold px-3 py-1.5 rounded-sm border border-[var(--accent-sage)]/40 bg-[var(--surface-sage)]/50 hover:bg-[var(--surface-sage)] hover:border-[var(--accent-sage)] transition-all duration-200 transform hover:-translate-y-0.5 shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Fleet Command
            </Link>
          )}
        </nav>

        {/* Medium-screen (lg) simplified bar if between 1024px and 1280px */}
        <nav className="hidden lg:flex xl:hidden items-center space-x-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          <Link to="/" className="motivo-navlink py-2 hover:text-[var(--text-primary)]">
            Home
          </Link>
          <Link to="/vehicles" className="motivo-navlink py-2 hover:text-[var(--text-primary)] flex items-center gap-1">
            <Car className="w-3.5 h-3.5 text-[var(--accent-sage)]" /> Fleet
          </Link>
          <button onClick={() => scrollToSection('about-motivo')} className="motivo-navlink py-2 hover:text-[var(--text-primary)] cursor-pointer">
            About
          </button>
          {user && (
            <Link to="/dashboard" className="motivo-navlink py-2 hover:text-[var(--text-primary)]">
              Bookings
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-[var(--accent-sage)] font-bold px-2 py-1 rounded-sm border border-[var(--accent-sage)]/40 bg-[var(--surface-sage)]/50">
              Admin
            </Link>
          )}
        </nav>

        {/* Right Action Controls & Dark Mode Switcher */}
        <div className="flex items-center space-x-3 sm:space-x-3.5">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="motivo-btn p-2.5 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] hover:bg-[var(--surface-sage)] text-[var(--text-primary)] shadow-2xs cursor-pointer flex items-center justify-center"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <Link
                to="/notifications"
                className="motivo-btn p-2.5 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] hover:bg-[var(--surface-sage)] text-[var(--text-primary)] relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-emerald-600 absolute top-1.5 right-1.5 ring-2 ring-[var(--bg-main)] animate-pulse"></span>
              </Link>
              
              <Link
                to="/dashboard"
                className="motivo-btn flex items-center space-x-2 text-xs font-semibold text-[var(--text-primary)] py-1.5 px-3 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] hover:bg-[var(--surface-sage)]"
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
                className="motivo-btn p-2 text-[var(--text-secondary)] hover:text-red-600 cursor-pointer rounded-sm hover:bg-red-50 dark:hover:bg-red-950/30"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                to="/login"
                className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 sm:px-3 py-2 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/vehicles"
                className="motivo-btn bg-[var(--text-primary)] text-[var(--bg-main)] px-4 sm:px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-sm hover:opacity-95 shadow-sm"
              >
                Reserve Now
              </Link>
            </div>
          )}

          {/* Mobile hamburger button with responsive feedback */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden motivo-btn p-2 rounded-sm border border-[var(--border-fine)] text-[var(--text-primary)] bg-[var(--card-bg)] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 transition-transform duration-200 rotate-90" /> : <Menu className="w-5 h-5 transition-transform duration-200" />}
          </button>
        </div>
      </div>

      {/* Smooth Mobile Drawer with Glass Blur Backdrop */}
      {mobileMenuOpen && (
        <div className="lg:hidden animate-drawer border-b border-[var(--border-fine)] bg-[var(--card-bg)]/98 backdrop-blur-xl px-6 py-6 space-y-3.5 shadow-xl transition-all">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-[var(--text-primary)] font-medium border-b border-[var(--border-fine)]/50 hover:text-[var(--accent-sage)] transition-colors"
          >
            <span>Home</span>
            <span className="text-xs text-[var(--text-secondary)] font-mono">01</span>
          </Link>
          <Link
            to="/vehicles"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-[var(--text-primary)] font-medium border-b border-[var(--border-fine)]/50 hover:text-[var(--accent-sage)] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Car className="w-4 h-4 text-[var(--accent-sage)]" />
              Fleet Catalogue
            </span>
            <span className="text-xs text-[var(--text-secondary)] font-mono">02</span>
          </Link>
          <button
            onClick={() => scrollToSection('experience')}
            className="w-full flex items-center justify-between py-2 text-left text-[var(--text-primary)] font-medium border-b border-[var(--border-fine)]/50 hover:text-[var(--accent-sage)] transition-colors cursor-pointer"
          >
            <span>The Experience</span>
            <span className="text-xs text-[var(--text-secondary)] font-mono">03</span>
          </button>
          <button
            onClick={() => scrollToSection('about-motivo')}
            className="w-full flex items-center justify-between py-2 text-left text-[var(--text-primary)] font-medium border-b border-[var(--border-fine)]/50 hover:text-[var(--accent-sage)] transition-colors cursor-pointer"
          >
            <span>About Motivo</span>
            <span className="text-xs text-[var(--text-secondary)] font-mono">04</span>
          </button>
          <button
            onClick={() => scrollToSection('business-model')}
            className="w-full flex items-center justify-between py-2 text-left text-[var(--text-primary)] font-medium border-b border-[var(--border-fine)]/50 hover:text-[var(--accent-sage)] transition-colors cursor-pointer"
          >
            <span>Business Model</span>
            <span className="text-xs text-[var(--text-secondary)] font-mono">05</span>
          </button>
          <button
            onClick={() => scrollToSection('security-guarantee')}
            className="w-full flex items-center justify-between py-2 text-left text-[var(--text-primary)] font-medium border-b border-[var(--border-fine)]/50 hover:text-[var(--accent-sage)] transition-colors cursor-pointer"
          >
            <span>Security & Fleet</span>
            <span className="text-xs text-[var(--text-secondary)] font-mono">06</span>
          </button>
          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-[var(--text-primary)] font-medium border-b border-[var(--border-fine)]/50 hover:text-[var(--accent-sage)] transition-colors"
            >
              <span className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-[var(--accent-sage)]" />
                My Bookings
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-mono">07</span>
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-[var(--accent-sage)] font-bold hover:underline transition-all"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Fleet Command Dashboard
              </span>
              <span className="text-xs font-mono">HQ</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};




