import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import type { Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';
import { Check, Shield, AlertCircle, ArrowLeft, Fuel, Gauge, Users } from 'lucide-react';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Form State
  const [pickupDate, setPickupDate] = useState<string>('');
  const [pickupTime, setPickupTime] = useState<string>('10:00');
  const [returnDate, setReturnDate] = useState<string>('');
  const [returnTime, setReturnTime] = useState<string>('10:00');
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Booking Submission & Price State
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await apiRequest<{ success: boolean; data: Vehicle }>(`/vehicles/${id}`);
        if (res.success && res.data) {
          setVehicle(res.data);

          // Default booking window: 3 days from today
          const today = new Date();
          const start = new Date(today);
          start.setDate(today.getDate() + 2);
          const end = new Date(start);
          end.setDate(start.getDate() + 3);

          setPickupDate(start.toISOString().split('T')[0]);
          setReturnDate(end.toISOString().split('T')[0]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load vehicle details');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  // Frontend Dynamic Price Estimation (Authoritative calculation will still execute on server)
  const calculateEstimatedPrice = () => {
    if (!pickupDate || !returnDate || !vehicle) return null;
    const p = new Date(`${pickupDate}T${pickupTime}`);
    const r = new Date(`${returnDate}T${returnTime}`);
    const diff = r.getTime() - p.getTime();
    if (diff <= 0) return null;

    const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
    const base = vehicle.dailyRate * days;
    const insurance = includeInsurance ? 350 * days : 0;
    const taxable = base + insurance;
    const tax = Math.round(taxable * 0.18);
    const total = taxable + tax;

    return { days, base, insurance, tax, total };
  };

  const estimated = calculateEstimatedPrice();

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!pickupDate || !returnDate) {
      setBookingError('Please specify pickup and return dates.');
      return;
    }

    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const returnDateTime = new Date(`${returnDate}T${returnTime}`);

    if (returnDateTime <= pickupDateTime) {
      setBookingError('Return time must be strictly after pickup time.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiRequest<{ success: boolean; data: any }>('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          vehicleId: vehicle?._id,
          pickupDateTime: pickupDateTime.toISOString(),
          returnDateTime: returnDateTime.toISOString(),
          includeInsurance,
          specialRequests
        })
      });

      if (res.success && res.data) {
        navigate(`/dashboard?bookingSuccess=${res.data.bookingReference}`);
      }
    } catch (err: any) {
      setBookingError(err.message || 'Failed to create booking reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-sage)]"></div>
        <p className="text-xs text-[var(--text-secondary)] mt-3">Loading vehicle specifications...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <p className="text-sm text-red-600 mb-4">{error || 'Vehicle not found.'}</p>
        <button
          onClick={() => navigate('/vehicles')}
          className="text-xs bg-[var(--text-primary)] text-[var(--bg-main)] px-5 py-2.5 rounded-sm"
        >
          Return to Fleet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate('/vehicles')}
        className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to catalogue
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image Gallery, Details & Specs */}
        <div className="lg:col-span-7 space-y-8">
          <div className="rounded-sm border border-[var(--border-fine)] overflow-hidden bg-[var(--surface-sage)] h-[380px] sm:h-[460px]">
            <img
              src={vehicle.images[0] || 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80'}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80';
              }}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent-sage)]">
                  {vehicle.category} • {vehicle.registrationNumber}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
                  {vehicle.make} {vehicle.model}
                </h1>
              </div>
              <span className={`text-xs px-3 py-1 font-semibold rounded-sm border ${
                vehicle.operationalStatus === 'Available'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300'
                  : 'border-amber-300 bg-amber-50 text-amber-800'
              }`}>
                {vehicle.operationalStatus}
              </span>
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-4">
              {vehicle.description}
            </p>
          </div>

          {/* Core Specifications */}
          <div className="grid grid-cols-3 gap-4 p-5 rounded-sm bg-[var(--card-bg)] border border-[var(--border-fine)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-[var(--surface-sage)] flex items-center justify-center text-[var(--accent-sage)]">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-secondary)] uppercase">Transmission</span>
                <p className="text-xs font-bold text-[var(--text-primary)]">{vehicle.transmission}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-[var(--surface-sage)] flex items-center justify-center text-[var(--accent-sage)]">
                <Fuel className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-secondary)] uppercase">Fuel / Powertrain</span>
                <p className="text-xs font-bold text-[var(--text-primary)]">{vehicle.fuelType}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-[var(--surface-sage)] flex items-center justify-center text-[var(--accent-sage)]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-secondary)] uppercase">Capacity</span>
                <p className="text-xs font-bold text-[var(--text-primary)]">{vehicle.seatingCapacity} Passengers</p>
              </div>
            </div>
          </div>

          {/* Features Checklist */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3">
              Included Vehicle Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {vehicle.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Reservation & Server Price Calculation Box */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 p-7 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] space-y-6 shadow-sm">
            
            <div className="flex justify-between items-baseline pb-5 border-b border-[var(--border-fine)]">
              <div>
                <span className="text-xs text-[var(--text-secondary)]">Base Daily Rate</span>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  ₹{vehicle.dailyRate.toLocaleString('en-IN')}
                </h3>
              </div>
              <span className="text-xs font-mono text-[var(--accent-sage)]">24h Cycle Rate</span>
            </div>

            {bookingError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-400 rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              
              {/* Pickup Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Return Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    required
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Return Time
                  </label>
                  <input
                    type="time"
                    required
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Optional Insurance Add-on */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeInsurance}
                    onChange={(e) => setIncludeInsurance(e.target.checked)}
                    className="rounded border-[var(--border-fine)] text-[var(--accent-sage)] accent-[var(--accent-sage)] w-4 h-4"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-[var(--accent-sage)]" /> Comprehensive Zero-Dep Cover
                    </span>
                    <span className="text-[var(--text-secondary)]">₹350 / billable day</span>
                  </div>
                </label>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Special Notes / Delivery Location
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Airport delivery, child seat..."
                  className="w-full text-xs p-2.5 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              {/* Price Breakdown Preview */}
              {estimated && (
                <div className="p-4 rounded-sm bg-[var(--surface-sage)]/40 border border-[var(--border-fine)] space-y-2 text-xs">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Duration</span>
                    <span className="font-semibold text-[var(--text-primary)]">{estimated.days} billable day(s)</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Base Vehicle Fee</span>
                    <span>₹{estimated.base.toLocaleString('en-IN')}</span>
                  </div>
                  {estimated.insurance > 0 && (
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Zero-Dep Insurance</span>
                      <span>₹{estimated.insurance.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>GST (18%)</span>
                    <span>₹{estimated.tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-2 border-t border-[var(--border-fine)] flex justify-between font-bold text-sm text-[var(--text-primary)]">
                    <span>Estimated Total</span>
                    <span>₹{estimated.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || vehicle.operationalStatus !== 'Available'}
                className="w-full py-3.5 bg-[var(--text-primary)] text-[var(--bg-main)] text-xs font-semibold uppercase tracking-wider rounded-sm hover:opacity-90 disabled:opacity-50 transition shadow-sm"
              >
                {submitting ? 'Confirming Availability...' : user ? 'Reserve Now' : 'Sign In to Reserve'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
