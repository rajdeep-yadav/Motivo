import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, MapPin, Phone, GitBranch, Terminal, Database, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--border-fine)] bg-[var(--card-bg)] text-[var(--text-primary)] transition-colors">
      
      {/* Top Banner */}
      <div className="border-b border-[var(--border-fine)] py-10 bg-[var(--surface-sage)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-sm bg-[var(--text-primary)] text-[var(--bg-main)] flex items-center justify-center p-2 shadow-xs">
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
            <div>
              <span className="text-xl font-bold tracking-tight text-[var(--text-primary)] block">
                MOTIVO MOBILITY
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                Your Journey, Your Way. Architectural Automotive Rental Systems.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href="https://github.com/rajdeep-yadav/Motivo.git"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] hover:bg-[var(--surface-sage)] transition"
            >
              <GitBranch className="w-4 h-4" /> GitHub Repository
            </a>
            <Link
              to="/vehicles"
              className="px-4 py-2 rounded-sm bg-[var(--text-primary)] text-[var(--bg-main)] hover:opacity-90 transition uppercase tracking-wider text-[11px]"
            >
              Browse Fleet
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--accent-sage)]">
              ABOUT MOTIVO SYSTEMS
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
              Motivo is a complete, production-ready vehicle rental management application created for a college Industry Practicals engineering project. Designed with strict server-side pricing rules, deterministic booking conflict prevention, and enterprise aesthetics.
            </p>
            <div className="pt-2 space-y-1.5 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[var(--accent-sage)]" /> Bangalore / Delhi NCR Fleet Terminals
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[var(--accent-sage)]" /> support@motivo.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[var(--accent-sage)]" /> +91 98200 11223 (Admin Concierge)
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-4">
              FLEET CATEGORIES
            </h4>
            <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              <li><Link to="/vehicles?category=Sedan" className="hover:text-[var(--text-primary)] transition">Executive Sedans</Link></li>
              <li><Link to="/vehicles?category=SUV" className="hover:text-[var(--text-primary)] transition">Luxury All-Terrain SUVs</Link></li>
              <li><Link to="/vehicles?category=Electric" className="hover:text-[var(--text-primary)] transition">High-Voltage Electric</Link></li>
              <li><Link to="/vehicles?category=Sports" className="hover:text-[var(--text-primary)] transition">Dynamic Sports Coupes</Link></li>
              <li><Link to="/vehicles?category=Luxury" className="hover:text-[var(--text-primary)] transition">Chauffeur Luxury</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-4">
              APPLICATION LINKS
            </h4>
            <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              <li><Link to="/" className="hover:text-[var(--text-primary)] transition">Homepage</Link></li>
              <li><Link to="/vehicles" className="hover:text-[var(--text-primary)] transition">Vehicle Catalogue</Link></li>
              <li><Link to="/login" className="hover:text-[var(--text-primary)] transition">Customer Authentication</Link></li>
              <li><Link to="/dashboard" className="hover:text-[var(--text-primary)] transition">My Booking Records</Link></li>
              <li><Link to="/admin" className="hover:text-[var(--text-primary)] transition">Admin Command Console</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-4">
              ENGINEERING SPECS
            </h4>
            <ul className="space-y-2 text-[11px] text-[var(--text-secondary)] font-mono">
              <li className="flex items-center gap-1.5"><Code2 className="w-3 h-3 text-[var(--accent-sage)]" /> React 19 + TypeScript</li>
              <li className="flex items-center gap-1.5"><Terminal className="w-3 h-3 text-[var(--accent-sage)]" /> Express REST API</li>
              <li className="flex items-center gap-1.5"><Database className="w-3 h-3 text-[var(--accent-sage)]" /> MongoDB Atlas Host</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-[var(--accent-sage)]" /> 24h Ceiling Pricing Rule</li>
            </ul>
          </div>

        </div>

        <div className="mt-14 pt-8 border-t border-[var(--border-fine)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-secondary)]">
          <p>© {new Date().getFullYear()} Motivo Mobility Systems. All rights reserved.</p>
          <div className="mt-3 sm:mt-0 flex gap-6 text-[11px]">
            <span>Terms of Rental</span>
            <span>Zero-Dep Policy</span>
            <span className="font-mono">Industry Practicals Project</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
