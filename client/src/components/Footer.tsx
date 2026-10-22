import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--border-fine)] bg-[var(--bg-main)] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-sm bg-[var(--text-primary)] text-[var(--bg-main)] flex items-center justify-center font-bold text-sm tracking-tighter">
                M
              </div>
              <span className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                motivo
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Your Journey, Your Way. Architectural automotive rental platform for discerning drivers.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--text-primary)] mb-4">
              Fleet Discovery
            </h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><Link to="/vehicles?category=Sedan" className="hover:text-[var(--text-primary)]">Executive Sedans</Link></li>
              <li><Link to="/vehicles?category=SUV" className="hover:text-[var(--text-primary)]">Luxury SUVs</Link></li>
              <li><Link to="/vehicles?category=Electric" className="hover:text-[var(--text-primary)]">Electric High Performance</Link></li>
              <li><Link to="/vehicles?category=Sports" className="hover:text-[var(--text-primary)]">Sports Coupes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--text-primary)] mb-4">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><Link to="/vehicles" className="hover:text-[var(--text-primary)]">Daily & Weekly Rentals</Link></li>
              <li><span className="text-[var(--text-secondary)]">Zero-Dep Comprehensive Insurance</span></li>
              <li><span className="text-[var(--text-secondary)]">Airport Concierge Handover</span></li>
              <li><span className="text-[var(--text-secondary)]">24/7 Roadside Assistance</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--text-primary)] mb-4">
              Campus Project Info
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
              Developed as a full-stack Industry Practicals engineering project with MongoDB Atlas, Express, React, and Node.js.
            </p>
            <div className="text-xs text-[var(--text-secondary)]">
              Currency: INR (₹) • Authoritative Server Engine
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border-fine)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-secondary)]">
          <p>© {new Date().getFullYear()} Motivo Mobility Systems. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">Academic Full-Stack Demonstration</p>
        </div>
      </div>
    </footer>
  );
};
