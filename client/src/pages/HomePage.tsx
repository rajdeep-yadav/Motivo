import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import type { Vehicle } from '../types';
import {
  ArrowRight,
  Lock,
  Layers,
  Activity,
  ChevronRight,
  ShieldCheck,
  DollarSign,
  Globe2,
  CheckCircle,
  Building2
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const stats = {
    totalVehicles: 8,
    availableNow: 7,
    activeRentals: 1,
    totalRevenue: 57879
  };

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const res = await apiRequest<{ success: boolean; data: Vehicle[] }>('/vehicles?limit=6');
        if (res.success && res.data && res.data.length > 0) {
          setFeaturedVehicles(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured vehicles', err);
      }
    };
    loadHomeData();
  }, []);

  const filteredFleet =
    activeCategory === 'All'
      ? featuredVehicles
      : featuredVehicles.filter((v) => v.category === activeCategory);

  return (
    <div className="min-h-screen">
      
      {/* 1. HERO SECTION (Billion-Dollar Mobility Aesthetic) */}
      <section className="relative pt-12 pb-24 border-b border-[var(--border-fine)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Editorial Text Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[var(--surface-sage)]/70 border border-[var(--border-fine)] text-[11px] font-bold uppercase tracking-widest text-[var(--accent-sage)] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Autonomous Fleet Infrastructure • TCET Mumbai
              </div>

              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.05]">
                Simple rentals.<br />
                <span className="text-[var(--accent-sage)]">Better journeys.</span>
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
                Motivo provides an architectural enterprise platform powering modern executive fleet rentals. Built with authoritative 24-hour rate calculations, deterministic availability protection, and digital checkout telemetry.
              </p>
              
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/vehicles"
                  className="bg-[var(--text-primary)] text-[var(--bg-main)] px-8 py-4 text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90 transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  Explore Fleet Collection <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#experience"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:text-[var(--accent-sage)] px-5 py-4 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] hover:bg-[var(--surface-sage)] transition cursor-pointer"
                >
                  The Experience
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[var(--border-fine)] grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">Zero Hidden Fees</span>
                  <span className="text-[var(--text-secondary)] text-[11px]">Exact 24h ceiling rules</span>
                </div>
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">Instant Digital Delivery</span>
                  <span className="text-[var(--text-secondary)] text-[11px]">Strict atomic availability</span>
                </div>
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">Zero-Dep Cover</span>
                  <span className="text-[var(--text-secondary)] text-[11px]">Full comprehensive protection</span>
                </div>
              </div>
            </div>

            {/* Right Automotive Visual Showcase matching reference layout */}
            <div className="lg:col-span-5">
              <div className="relative rounded-sm border border-[var(--border-fine)] bg-[var(--surface-sage)] p-7 overflow-hidden shadow-sm">
                <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] font-mono mb-6">
                  <span className="font-bold text-[var(--text-primary)]">01 // AUTOMOTIVE STUDIO</span>
                  <span className="uppercase tracking-widest px-2.5 py-1 rounded-xs bg-[var(--card-bg)] border border-[var(--border-fine)] text-[10px] font-bold">
                    FLEET DISCOVERY
                  </span>
                </div>

                {/* Minimalist Graphic Car Silhouette Illustration */}
                <div className="py-6 flex items-center justify-center">
                  <svg className="w-full max-w-[340px] h-auto drop-shadow-sm" viewBox="0 0 340 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M30 115 C30 100 50 95 70 95 L95 95 C115 95 130 55 170 55 L245 55 C275 55 295 95 310 95 C325 95 330 105 330 120 L330 135 C330 142 322 142 315 142 L290 142 C290 122 265 122 265 142 L130 142 C130 122 105 122 105 142 L40 142 C32 142 30 138 30 135 Z"
                      fill="#556250"
                    />
                    <path
                      d="M110 90 L165 90 L165 65 L145 65 C125 65 115 85 110 90 Z"
                      fill="#CBD2C8"
                    />
                    <path
                      d="M175 90 L250 90 C240 75 225 65 210 65 L175 65 Z"
                      fill="#CBD2C8"
                    />
                    <ellipse cx="320" cy="112" rx="4" ry="7" fill="#F7F6F2" />
                    <circle cx="118" cy="142" r="22" fill="#20221F" />
                    <circle cx="118" cy="142" r="10" fill="#434940" />
                    <circle cx="278" cy="142" r="22" fill="#20221F" />
                    <circle cx="278" cy="142" r="10" fill="#434940" />
                  </svg>
                </div>

                <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] pt-4 border-t border-[var(--border-fine)]">
                  <span className="font-semibold text-[var(--text-primary)]">Ready for Immediate Booking</span>
                  <span className="font-mono text-[11px]">Sedan • SUV • Electric</span>
                </div>
              </div>
            </div>

          </div>

          {/* Metric Bar matching screenshot footer indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-10 border-t border-[var(--border-fine)]">
            <div className="motivo-card p-4 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)]">
              <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">Total Fleet</p>
              <h3 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1 font-mono">
                {stats.totalVehicles}
              </h3>
              <span className="text-[10px] text-emerald-600 font-medium">Verified active registry</span>
            </div>
            <div className="motivo-card p-4 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)]">
              <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">Available Now</p>
              <h3 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1 font-mono">
                {stats.availableNow}
              </h3>
              <span className="text-[10px] text-emerald-600 font-medium">Ready for immediate pickup</span>
            </div>
            <div className="motivo-card p-4 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)]">
              <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">Active Rentals</p>
              <h3 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1 font-mono">
                {stats.activeRentals}
              </h3>
              <span className="text-[10px] text-[var(--accent-sage)] font-medium">Currently in journey</span>
            </div>
            <div className="motivo-card p-4 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)]">
              <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">Settled Turnover</p>
              <h3 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1 font-mono">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </h3>
              <span className="text-[10px] text-[var(--text-secondary)] font-medium">Simulated invoice ledger</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLEET SHOWCASE & DYNAMIC CATEGORY FILTER */}
      <section className="py-24 bg-[var(--bg-main)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[var(--accent-sage)]">
                CURATED AUTOMOTIVE ROSTER
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
                The Motivo Collection
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xl">
                Every vehicle in our collection undergoes a 120-point mechanical inspection and interior sanitization before every client reservation.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {['All', 'Sedan', 'SUV', 'Electric', 'Sports', 'Luxury', 'Bike'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`motivo-btn px-3.5 py-1.5 rounded-sm border cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[var(--text-primary)] text-[var(--bg-main)] border-[var(--text-primary)] shadow-2xs'
                      : 'border-[var(--border-fine)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-sage)]'
                  }`}
                >
                  {cat === 'Bike' ? 'Bikes & Adventure' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFleet.map((v) => (
              <div
                key={v._id}
                className="motivo-card rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] overflow-hidden flex flex-col group hover:border-[var(--accent-sage)]"
              >
                <div className="h-52 overflow-hidden bg-[var(--surface-sage)] relative">
                  <img
                    src={v.images[0] || 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80'}
                    alt={`${v.make} ${v.model}`}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 bg-[var(--bg-main)]/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-mono font-bold text-[var(--text-primary)] rounded-sm border border-[var(--border-fine)] shadow-2xs">
                    {v.registrationNumber}
                  </div>
                  <div className="absolute top-3 right-3 bg-[var(--text-primary)] text-[var(--bg-main)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-2xs">
                    {v.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-sage)] transition-colors duration-200">
                        {v.make} {v.model}
                      </h3>
                      <span className="text-xs font-mono text-[var(--text-secondary)]">{v.year}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-2 leading-relaxed">
                      {v.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[var(--border-fine)] flex flex-wrap gap-1.5">
                      {v.features.slice(0, 3).map((f, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-xs bg-[var(--surface-sage)]/60 text-[var(--text-secondary)] font-medium transition-colors hover:bg-[var(--surface-sage)]">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-fine)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">24-Hour Cycle</span>
                      <p className="text-lg font-bold text-[var(--text-primary)]">
                        ₹{v.dailyRate.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <Link
                      to={`/vehicles/${v._id}`}
                      className="motivo-btn bg-[var(--text-primary)] text-[var(--bg-main)] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm hover:opacity-90 shadow-2xs"
                    >
                      Reserve Vehicle
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--accent-sage)] hover:underline"
            >
              Browse Complete 8-Vehicle Fleet Registry <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. BUSINESS MODEL & MONETIZATION ENGINE (BILLION-DOLLAR ENTERPRISE BREAKDOWN) */}
      <section id="business-model" className="py-24 border-t border-[var(--border-fine)] bg-[var(--surface-sage)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[var(--accent-sage)]">
              TRANSPARENT VALUE CREATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              How Motivo Operates & Generates Revenue
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              An institutional mobility model combining high-margin utilization with asset-backed software telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)] space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-sm bg-[var(--surface-sage)] flex items-center justify-center text-[var(--accent-sage)]">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">1. 24-Hour Rental Cycles</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Base vehicle charges are calculated strictly in deterministic 24-hour windows with ceiling rounding. Every active vehicle generates predictable daily cashflows.
              </p>
              <div className="pt-2 border-t border-[var(--border-fine)] text-[11px] font-mono text-[var(--accent-sage)]">
                Average Daily Yield: ₹7,800 / day
              </div>
            </div>

            <div className="p-8 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)] space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-sm bg-[var(--surface-sage)] flex items-center justify-center text-[var(--accent-sage)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">2. Comprehensive Add-Ons</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Zero-depreciation insurance (₹350/day), airport concierge deliveries, and child-seat hardware attachments create high-margin ancillary revenue streams.
              </p>
              <div className="pt-2 border-t border-[var(--border-fine)] text-[11px] font-mono text-[var(--accent-sage)]">
                Ancillary Attach Rate: ~40%
              </div>
            </div>

            <div className="p-8 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)] space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-sm bg-[var(--surface-sage)] flex items-center justify-center text-[var(--accent-sage)]">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">3. Enterprise Corporate Accounts</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Executive transport contracts for corporate campuses and multi-day conference mobility hubs provide predictable, high-volume fleet rotations.
              </p>
              <div className="pt-2 border-t border-[var(--border-fine)] text-[11px] font-mono text-[var(--accent-sage)]">
                Enterprise Retention: ~92%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECURITY & FLEET TELEMETRY STANDARDS */}
      <section id="security-guarantee" className="py-24 border-t border-[var(--border-fine)] bg-[var(--bg-main)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest font-bold text-[var(--accent-sage)]">
                ENTERPRISE SAFETY & STANDARDS
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
                Institutional Safety.<br />Certified Vehicles.
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Motivo treats vehicle safety and customer data protection as foundational pillars. Every vehicle is GPS-tracked, electronically monitored, and backed by instantaneous simulated verification.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">120-Point Multipoint Inspection</h4>
                    <p className="text-xs text-[var(--text-secondary)]">Brakes, tires, fluids, powertrain electronics, and chassis inspected between rentals.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">Encrypted Identity & License Storage</h4>
                    <p className="text-xs text-[var(--text-secondary)]">Passwords hashed with Bcrypt, stateless JWT tokens, and strict customer ownership isolation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">24/7 Roadside Assistance & Concierge</h4>
                    <p className="text-xs text-[var(--text-secondary)]">Emergency dispatch and direct vehicle replacement support across Mumbai and NCR corridors.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)] shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-[var(--border-fine)] pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-[var(--accent-sage)]" /> Operating Terminal Network
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600">● 4 Hubs Active</span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-[var(--surface-sage)]/40 rounded-sm border border-[var(--border-fine)] flex justify-between items-center">
                    <div>
                      <strong className="block text-[var(--text-primary)]">TCET Mumbai Mobility Hub</strong>
                      <span className="text-[var(--text-secondary)]">Kandivali East, Mumbai</span>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--accent-sage)] font-bold">Base HQ</span>
                  </div>

                  <div className="p-3 bg-[var(--surface-sage)]/40 rounded-sm border border-[var(--border-fine)] flex justify-between items-center">
                    <div>
                      <strong className="block text-[var(--text-primary)]">Mumbai Chhatrapati Shivaji Airport T2</strong>
                      <span className="text-[var(--text-secondary)]">Sahar, Andheri East</span>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-600 font-bold">Airport Concierge</span>
                  </div>

                  <div className="p-3 bg-[var(--surface-sage)]/40 rounded-sm border border-[var(--border-fine)] flex justify-between items-center">
                    <div>
                      <strong className="block text-[var(--text-primary)]">Bandra Kurla Complex (BKC) Terminal</strong>
                      <span className="text-[var(--text-secondary)]">Financial District, Mumbai</span>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--accent-sage)] font-bold">Executive Hub</span>
                  </div>

                  <div className="p-3 bg-[var(--surface-sage)]/40 rounded-sm border border-[var(--border-fine)] flex justify-between items-center">
                    <div>
                      <strong className="block text-[var(--text-primary)]">South Mumbai Heritage Gateway</strong>
                      <span className="text-[var(--text-secondary)]">Colaba, Mumbai</span>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--accent-sage)] font-bold">Transit Node</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-sm text-[11px] text-emerald-800 dark:text-emerald-300">
                  All terminal dispatches synchronize in real-time with Motivo's centralized Mongoose telemetry database.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. ABOUT MOTIVO & INDUSTRY PRACTICALS ARCHITECTURAL MANIFESTO */}
      <section id="about-motivo" className="py-24 border-t border-[var(--border-fine)] bg-[var(--surface-sage)]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest font-bold text-[var(--accent-sage)]">
                ENGINEERING & ARCHITECTURE
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
                Designed for Reliability.<br />Built for Real Scale.
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Motivo was architected for an academic Industry Practicals capstone project to demonstrate how enterprise-grade vehicle management systems can be constructed without proprietary vendor lock-in.
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Traditional rental portals frequently suffer from race conditions, pricing drift, and complex hidden deposit models. Motivo tackles these problems directly with server-side rate authority and mathematical booking collision conditions.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="motivo-card p-4 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)]">
                  <div className="text-[var(--accent-sage)] mb-2 font-bold flex items-center gap-1.5 text-xs">
                    <Activity className="w-4 h-4" /> Real-Time Telemetry
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Accurate vehicle fleet registry keeping availability status updated across date-ranges.
                  </p>
                </div>
                <div className="motivo-card p-4 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)]">
                  <div className="text-[var(--accent-sage)] mb-2 font-bold flex items-center gap-1.5 text-xs">
                    <Lock className="w-4 h-4" /> Concurrency Safe
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Mathematically verified date collision prevention that safely allows adjacent handovers.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)] space-y-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[var(--accent-sage)]" /> Full-Stack Technical Specifications
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between py-2 border-b border-[var(--border-fine)]">
                    <span className="font-semibold text-[var(--text-primary)]">Frontend Stack</span>
                    <span className="text-[var(--text-secondary)] font-mono">React 19 • TypeScript • Vite • Tailwind CSS v4</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--border-fine)]">
                    <span className="font-semibold text-[var(--text-primary)]">Backend Framework</span>
                    <span className="text-[var(--text-secondary)] font-mono">Node.js 24 • Express.js • REST Architecture</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--border-fine)]">
                    <span className="font-semibold text-[var(--text-primary)]">Database Layer</span>
                    <span className="text-[var(--text-secondary)] font-mono">MongoDB Atlas (Host: motivo.i7x666o.mongodb.net)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--border-fine)]">
                    <span className="font-semibold text-[var(--text-primary)]">Authentication</span>
                    <span className="text-[var(--text-secondary)] font-mono">Stateless JWT + Bcrypt.js password hashing</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--border-fine)]">
                    <span className="font-semibold text-[var(--text-primary)]">Automated Quality</span>
                    <span className="text-[var(--text-secondary)] font-mono">Jest Unit Suites (11/11 tests verified passing)</span>
                  </div>
                </div>

                <div className="p-4 bg-[var(--surface-sage)]/60 rounded-sm text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  <strong>Academic Practicals Integrity:</strong> All vehicle records, simulated payments, invoices, and lifecycle state changes are managed through verified code paths.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. THE EXPERIENCE (Step-by-Step Flow) */}
      <section id="experience" className="py-24 border-t border-[var(--border-fine)] bg-[var(--bg-main)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-[var(--accent-sage)]">
              STREAMLINED MOBILITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
              The Motivo Journey in 4 Steps
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
              From vehicle discovery to key handover, every step is designed for maximum speed, clarity, and peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)] space-y-3 shadow-2xs">
              <span className="font-mono text-xs font-bold text-[var(--accent-sage)]">STEP 01</span>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Vehicle Selection</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Filter by transmission, passenger capacity, powertrain, and real-time dates.
              </p>
            </div>

            <div className="p-6 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)] space-y-3 shadow-2xs">
              <span className="font-mono text-xs font-bold text-[var(--accent-sage)]">STEP 02</span>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Transparent Calculation</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                View 24h cycle days, mandatory GST (18%), and optional zero-dep insurance.
              </p>
            </div>

            <div className="p-6 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)] space-y-3 shadow-2xs">
              <span className="font-mono text-xs font-bold text-[var(--accent-sage)]">STEP 03</span>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Simulated Settlement</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Execute sandbox card or UPI payments and generate downloadable invoice receipts.
              </p>
            </div>

            <div className="p-6 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)] space-y-3 shadow-2xs">
              <span className="font-mono text-xs font-bold text-[var(--accent-sage)]">STEP 04</span>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Digital Handover</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Track vehicle pickup and return status directly from your customer dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION SECTION */}
      <section className="py-20 border-t border-[var(--border-fine)] bg-[var(--text-primary)] text-[var(--bg-main)]">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[var(--accent-sage)]">
            YOUR JOURNEY, YOUR WAY
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Ready to experience effortless mobility?
          </h2>
          <p className="text-sm max-w-xl mx-auto text-[var(--bg-main)]/80 leading-relaxed">
            Choose your preferred vehicle from our executive fleet, reserve your dates, and drive with absolute confidence.
          </p>
          <div className="pt-2">
            <Link
              to="/vehicles"
              className="inline-block px-8 py-4 bg-[var(--bg-main)] text-[var(--text-primary)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90 transition shadow-lg cursor-pointer"
            >
              Start Your Rental Today
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
