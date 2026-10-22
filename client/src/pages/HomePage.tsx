import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import type { Vehicle } from '../types';
import { ShieldCheck, ArrowRight, Clock, Compass } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const stats = {
    totalVehicles: 8,
    availableNow: 7,
    activeRentals: 1,
    totalRevenue: 28500
  };

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const res = await apiRequest<{ success: boolean; data: Vehicle[] }>('/vehicles?limit=4');
        if (res.success && res.data) {
          setFeaturedVehicles(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured vehicles', err);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Editorial Hero Section strictly inspired by reference design */}
      <section className="pt-12 pb-20 border-b border-[var(--border-fine)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Editorial Text Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent-sage)]">
                VEHICLE RENTAL MANAGEMENT
              </span>
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.08]">
                Simple rentals.<br />
                <span className="text-[var(--accent-sage)]">Better journeys.</span>
              </h1>
              <p className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
                Choose a vehicle, select your rental period, calculate the price and manage your booking from one simple platform.
              </p>
              
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/vehicles"
                  className="bg-[var(--text-primary)] text-[var(--bg-main)] px-7 py-3.5 text-sm font-medium rounded-sm hover:opacity-90 transition shadow-sm"
                >
                  Explore vehicles
                </Link>
                <Link
                  to="/vehicles"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-sage)] px-4 py-3 transition"
                >
                  Start a rental <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Automotive Visual Showcase matching reference layout */}
            <div className="lg:col-span-5">
              <div className="relative rounded-sm border border-[var(--border-fine)] bg-[var(--surface-sage)] p-6 overflow-hidden">
                <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] font-mono mb-4">
                  <span>01</span>
                  <span className="uppercase tracking-widest">FLEET</span>
                </div>

                {/* Minimalist Graphic Car Silhouette Illustration */}
                <div className="py-8 flex items-center justify-center">
                  <svg className="w-full max-w-[340px] h-auto drop-shadow-sm" viewBox="0 0 340 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Car Silhouette Path */}
                    <path
                      d="M30 115 C30 100 50 95 70 95 L95 95 C115 95 130 55 170 55 L245 55 C275 55 295 95 310 95 C325 95 330 105 330 120 L330 135 C330 142 322 142 315 142 L290 142 C290 122 265 122 265 142 L130 142 C130 122 105 122 105 142 L40 142 C32 142 30 138 30 135 Z"
                      fill="#556250"
                    />
                    {/* Windows */}
                    <path
                      d="M110 90 L165 90 L165 65 L145 65 C125 65 115 85 110 90 Z"
                      fill="#CBD2C8"
                    />
                    <path
                      d="M175 90 L250 90 C240 75 225 65 210 65 L175 65 Z"
                      fill="#CBD2C8"
                    />
                    {/* Headlight */}
                    <ellipse cx="320" cy="112" rx="4" ry="7" fill="#F7F6F2" />
                    {/* Wheels */}
                    <circle cx="118" cy="142" r="22" fill="#20221F" />
                    <circle cx="118" cy="142" r="10" fill="#434940" />
                    <circle cx="278" cy="142" r="22" fill="#20221F" />
                    <circle cx="278" cy="142" r="10" fill="#434940" />
                  </svg>
                </div>

                <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] pt-4 border-t border-[var(--border-fine)]">
                  <span className="font-semibold text-[var(--text-primary)]">Ready to drive</span>
                  <span>Cars • SUVs • Electric</span>
                </div>
              </div>
            </div>

          </div>

          {/* Metric Bar matching screenshot footer indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-10 border-t border-[var(--border-fine)]">
            <div>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Total vehicles</p>
              <h3 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
                {stats.totalVehicles}
              </h3>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Available now</p>
              <h3 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
                {stats.availableNow}
              </h3>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Active rentals</p>
              <h3 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
                {stats.activeRentals}
              </h3>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Simulated turnover</p>
              <h3 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fleet Section */}
      <section className="py-20 bg-[var(--bg-main)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent-sage)]">
                CURATED SELECTION
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-2">
                Featured Fleet
              </h2>
            </div>
            <Link
              to="/vehicles"
              className="mt-4 sm:mt-0 inline-flex items-center text-sm font-medium text-[var(--accent-sage)] hover:underline"
            >
              View entire collection <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.length > 0 ? (
              featuredVehicles.map((v) => (
                <div
                  key={v._id}
                  className="rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] overflow-hidden flex flex-col group hover:shadow-md transition"
                >
                  <div className="h-48 overflow-hidden bg-[var(--surface-sage)] relative">
                    <img
                      src={v.images[0] || 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80'}
                      alt={`${v.make} ${v.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-[var(--bg-main)]/90 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-[var(--text-primary)] rounded-sm border border-[var(--border-fine)]">
                      {v.category}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">
                        {v.make} {v.model}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                        {v.description}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-[var(--border-fine)] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[var(--text-secondary)]">Daily rate</span>
                        <p className="text-base font-bold text-[var(--text-primary)]">
                          ₹{v.dailyRate.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <Link
                        to={`/vehicles/${v._id}`}
                        className="bg-[var(--text-primary)] text-[var(--bg-main)] text-xs font-medium px-4 py-2 rounded-sm hover:opacity-90 transition"
                      >
                        Reserve
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-sm text-[var(--text-secondary)]">
                Connecting to fleet database...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Editorial Section */}
      <section className="py-20 border-t border-[var(--border-fine)] bg-[var(--surface-sage)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent-sage)]">
              STREAMLINED CONVENIENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-2">
              The Motivo Experience
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-3">
              We have eliminated rental desk delays. Reserve your desired vehicle with complete transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)] space-y-4">
              <div className="w-10 h-10 rounded-sm bg-[var(--surface-sage)] flex items-center justify-center text-[var(--accent-sage)]">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">1. Select & Verify</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Browse executive sedans, spacious SUVs, and electric sports cars with exact real-time calendar availability.
              </p>
            </div>

            <div className="p-8 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)] space-y-4">
              <div className="w-10 h-10 rounded-sm bg-[var(--surface-sage)] flex items-center justify-center text-[var(--accent-sage)]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">2. 24-Hour Fair Pricing</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Enjoy transparent server-side pricing calculated in 24-hour cycles with zero hidden charges or surprises.
              </p>
            </div>

            <div className="p-8 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)] space-y-4">
              <div className="w-10 h-10 rounded-sm bg-[var(--surface-sage)] flex items-center justify-center text-[var(--accent-sage)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">3. Seamless Handover</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Receive instant simulated receipts and manage vehicle pickup and return records effortlessly in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
