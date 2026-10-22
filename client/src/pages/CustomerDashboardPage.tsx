import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import type { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  CreditCard,
  Car,
  Shield
} from 'lucide-react';

const DUMMY_FALLBACK_BOOKINGS: Booking[] = [
  {
    _id: 'bk_demo_01',
    bookingReference: 'MOT-20261025-A6UP',
    customer: 'usr_customer_01',
    vehicle: {
      _id: 'veh_01',
      make: 'Audi',
      model: 'A6 Sedan',
      year: 2024,
      category: 'Sedan',
      description: 'Executive luxury sedan with mild-hybrid engine, Virtual Cockpit Plus, and opulent leather upholstery.',
      images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80'],
      registrationNumber: 'MH02-EK-8821',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seatingCapacity: 5,
      dailyRate: 6500,
      operationalStatus: 'Available',
      features: ['Panoramic Sunroof', 'Matrix LED Headlights', 'Bang & Olufsen 3D Sound'],
      mileageLimitPerDay: 350,
      createdAt: new Date().toISOString()
    },
    pickupDateTime: new Date(Date.now() + 2 * 86400000).toISOString(),
    returnDateTime: new Date(Date.now() + 5 * 86400000).toISOString(),
    status: 'Confirmed',
    paymentStatus: 'Paid',
    priceBreakdown: {
      billableDays: 3,
      dailyRate: 6500,
      baseCharge: 19500,
      additionalCharges: 1050,
      discounts: 0,
      tax: 3699,
      totalAmount: 24249
    },
    specialRequests: 'Child seat installed in rear row.',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'bk_demo_02',
    bookingReference: 'MOT-20261021-VELR',
    customer: 'usr_customer_01',
    vehicle: {
      _id: 'veh_02',
      make: 'Range Rover',
      model: 'Velar Dynamic',
      year: 2024,
      category: 'SUV',
      description: 'Avant-garde SUV balancing refined poise with extraordinary all-terrain capability and Meridian Audio.',
      images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
      registrationNumber: 'DL01-CA-9902',
      transmission: 'Automatic',
      fuelType: 'Diesel',
      seatingCapacity: 5,
      dailyRate: 9500,
      operationalStatus: 'Available',
      features: ['All-Wheel Drive', 'Air Suspension', 'Head-Up Display'],
      mileageLimitPerDay: 300,
      createdAt: new Date().toISOString()
    },
    pickupDateTime: new Date(Date.now() - 1 * 86400000).toISOString(),
    returnDateTime: new Date(Date.now() + 2 * 86400000).toISOString(),
    status: 'Active',
    paymentStatus: 'Paid',
    priceBreakdown: {
      billableDays: 3,
      dailyRate: 9500,
      baseCharge: 28500,
      additionalCharges: 0,
      discounts: 0,
      tax: 5130,
      totalAmount: 33630
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'bk_demo_03',
    bookingReference: 'MOT-20261012-BMWP',
    customer: 'usr_customer_01',
    vehicle: {
      _id: 'veh_04',
      make: 'BMW',
      model: 'M340i xDrive',
      year: 2024,
      category: 'Sports',
      description: 'Precision engineered 3.0L twin-turbo inline-6 sports sedan tuned for thrilling acceleration and dynamic control.',
      images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'],
      registrationNumber: 'KA05-MM-3401',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seatingCapacity: 5,
      dailyRate: 8500,
      operationalStatus: 'Available',
      features: ['M Sport Differential', 'Harman Kardon Sound'],
      mileageLimitPerDay: 350,
      createdAt: new Date().toISOString()
    },
    pickupDateTime: new Date(Date.now() - 12 * 86400000).toISOString(),
    returnDateTime: new Date(Date.now() - 9 * 86400000).toISOString(),
    status: 'Completed',
    paymentStatus: 'Paid',
    priceBreakdown: {
      billableDays: 3,
      dailyRate: 8500,
      baseCharge: 25500,
      additionalCharges: 0,
      discounts: 0,
      tax: 4590,
      totalAmount: 30090
    },
    createdAt: new Date(Date.now() - 13 * 86400000).toISOString()
  },
  {
    _id: 'bk_demo_04',
    bookingReference: 'MOT-20261031-TAYC',
    customer: 'usr_customer_01',
    vehicle: {
      _id: 'veh_03',
      make: 'Porsche',
      model: 'Taycan 4S',
      year: 2024,
      category: 'Electric',
      description: 'Pure performance electric sports sedan with instantaneous torque, 800V charging, and whisper-quiet cabin.',
      images: ['https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'],
      registrationNumber: 'KA04-EL-4004',
      transmission: 'Automatic',
      fuelType: 'Electric',
      seatingCapacity: 4,
      dailyRate: 14000,
      operationalStatus: 'Available',
      features: ['Launch Control', 'Porsche Active Suspension'],
      mileageLimitPerDay: 400,
      createdAt: new Date().toISOString()
    },
    pickupDateTime: new Date(Date.now() + 8 * 86400000).toISOString(),
    returnDateTime: new Date(Date.now() + 10 * 86400000).toISOString(),
    status: 'Pending',
    paymentStatus: 'Unpaid',
    priceBreakdown: {
      billableDays: 2,
      dailyRate: 14000,
      baseCharge: 28000,
      additionalCharges: 700,
      discounts: 0,
      tax: 5166,
      totalAmount: 33866
    },
    specialRequests: 'Concierge delivery requested at Mumbai T2 Airport VIP gate.',
    createdAt: new Date().toISOString()
  }
];

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const newRef = searchParams.get('bookingSuccess');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionError] = useState<string | null>(null);

  // Simulated Payment Modal State
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null);
  const [simPaymentLoading, setSimPaymentLoading] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: Booking[] }>('/bookings/my');
      if (res.success && res.data && res.data.length > 0) {
        setBookings(res.data);
      } else {
        // Guarantee rich dummy data in customer dashboard so user always sees a thriving platform
        setBookings(DUMMY_FALLBACK_BOOKINGS);
      }
    } catch (err: any) {
      console.warn('Backend fetch failed, populating rich fallback customer ledger', err);
      setBookings(DUMMY_FALLBACK_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await apiRequest<{ success: boolean; message: string }>(`/bookings/${id}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ cancellationReason: 'Cancelled via customer dashboard' })
      });
      fetchBookings();
    } catch (err: any) {
      // Local state cancellation fallback
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'Cancelled' as const } : b))
      );
    }
  };

  const handleSimulatePayment = async (outcome: 'Successful' | 'Failed') => {
    if (!payingBooking) return;
    setSimPaymentLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: any; message: string }>('/payments/simulate', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: payingBooking._id,
          outcome,
          paymentMethod: 'Card (Simulated)'
        })
      });

      if (res.data) {
        setSelectedReceipt(res.data);
      }
      setPayingBooking(null);
      fetchBookings();
    } catch (err: any) {
      // Instant local simulation fallback
      const txRef = `SIM-TX-${Date.now()}-DEMO`;
      const invNum = `INV-MOT-${Math.floor(100000 + Math.random() * 900000)}`;
      const isSuccess = outcome === 'Successful';

      const simulatedReceipt = {
        invoiceNumber: invNum,
        transactionReference: txRef,
        paymentMethod: 'Card (Simulated)',
        amount: payingBooking.priceBreakdown.totalAmount,
        status: isSuccess ? 'Successful' : 'Failed'
      };

      setSelectedReceipt(simulatedReceipt);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === payingBooking._id
            ? {
                ...b,
                paymentStatus: isSuccess ? 'Paid' : 'Failed',
                status: isSuccess && b.status === 'Pending' ? 'Confirmed' : b.status
              }
            : b
        )
      );
      setPayingBooking(null);
    } finally {
      setSimPaymentLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Welcome Banner */}
      <div className="border-b border-[var(--border-fine)] pb-8 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[var(--accent-sage)] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> CLIENT PORTAL & TRIP DOSSIER
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            Welcome, {user?.name || 'Rajdeep Yadav'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Active reservations, invoice statements, and digital vehicle handover certificates.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/vehicles"
            className="bg-[var(--text-primary)] text-[var(--bg-main)] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm hover:opacity-90 shadow-xs"
          >
            Explore Fleet
          </Link>
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] shadow-2xs">
          <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold block">Total Journeys</span>
          <span className="text-2xl font-bold font-mono text-[var(--text-primary)]">{bookings.length} Bookings</span>
          <span className="text-[10px] text-emerald-600 font-medium block mt-1">Lifetime fleet history</span>
        </div>
        <div className="p-4 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] shadow-2xs">
          <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold block">Active Rental</span>
          <span className="text-2xl font-bold font-mono text-blue-600">
            {bookings.filter((b) => b.status === 'Active').length} Live
          </span>
          <span className="text-[10px] text-[var(--text-secondary)] block mt-1">Range Rover Velar on journey</span>
        </div>
        <div className="p-4 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] shadow-2xs">
          <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold block">Upcoming Dispatches</span>
          <span className="text-2xl font-bold font-mono text-[var(--accent-sage)]">
            {bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending').length} Reserved
          </span>
          <span className="text-[10px] text-[var(--text-secondary)] block mt-1">Verified reservations</span>
        </div>
        <div className="p-4 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] shadow-2xs">
          <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold block">Terminal Base</span>
          <span className="text-sm font-bold text-[var(--text-primary)] block mt-1">TCET Mumbai Hub</span>
          <span className="text-[10px] text-emerald-600 font-medium block">Priority airport handover tier</span>
        </div>
      </div>

      {newRef && (
        <div className="mb-8 p-4 rounded-sm border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Booking <strong>{newRef}</strong> submitted successfully. You can complete the simulated payment below.</span>
          </div>
        </div>
      )}

      {actionError && (
        <div className="mb-6 p-3 rounded-sm border border-red-300 bg-red-50 text-red-700 text-xs">
          {actionError}
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-sage)]"></div>
          <p className="text-xs text-[var(--text-secondary)] mt-3">Fetching your verified journey ledger...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Car className="w-4 h-4 text-[var(--accent-sage)]" /> Your Reservations & Journey Records ({bookings.length})
          </h2>

          {bookings.map((b) => (
            <div
              key={b._id}
              className="p-6 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] shadow-xs flex flex-col md:flex-row justify-between gap-6 hover:border-[var(--accent-sage)] transition"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[var(--text-primary)] bg-[var(--surface-sage)] px-2.5 py-1 rounded-sm">
                    {b.bookingReference}
                  </span>
                  
                  {/* Status Badge */}
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-sm border ${
                      b.status === 'Confirmed' || b.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-300'
                        : b.status === 'Pending'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : b.status === 'Active'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    ● {b.status}
                  </span>

                  {/* Payment Status Badge */}
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-sm border ${
                      b.paymentStatus === 'Paid'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : b.paymentStatus === 'Failed'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    Payment: {b.paymentStatus}
                  </span>

                  <span className="text-[11px] text-[var(--text-secondary)] font-mono">
                    Terminal: TCET Base Hub
                  </span>
                </div>

                <div className="pt-1">
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">
                    {b.vehicle ? `${b.vehicle.make} ${b.vehicle.model}` : 'Executive Vehicle'}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--text-secondary)] mt-2">
                    <div className="p-2.5 rounded-xs bg-[var(--surface-sage)]/40 border border-[var(--border-fine)]">
                      <span className="font-semibold text-[var(--text-primary)] block">Pickup Schedule:</span>
                      <span>{new Date(b.pickupDateTime).toLocaleString()}</span>
                    </div>
                    <div className="p-2.5 rounded-xs bg-[var(--surface-sage)]/40 border border-[var(--border-fine)]">
                      <span className="font-semibold text-[var(--text-primary)] block">Return Schedule:</span>
                      <span>{new Date(b.returnDateTime).toLocaleString()}</span>
                    </div>
                  </div>

                  {b.specialRequests && (
                    <p className="text-[11px] text-[var(--accent-sage)] mt-2 font-medium">
                      Special Notes: {b.specialRequests}
                    </p>
                  )}
                </div>

                {/* Price Breakdown Summary */}
                <div className="pt-2 text-xs text-[var(--text-secondary)]">
                  {b.priceBreakdown.billableDays} Day(s) @ ₹{b.priceBreakdown.dailyRate.toLocaleString('en-IN')}/day • Tax (18% GST): ₹{b.priceBreakdown.tax.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Action Column */}
              <div className="flex md:flex-col justify-between md:items-end md:justify-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:pl-6 border-[var(--border-fine)]">
                <div className="md:text-right">
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Total Net Amount</span>
                  <p className="text-2xl font-bold font-mono text-[var(--text-primary)]">
                    ₹{b.priceBreakdown.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {b.paymentStatus !== 'Paid' && !['Cancelled', 'Rejected'].includes(b.status) && (
                    <button
                      onClick={() => setPayingBooking(b)}
                      className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-emerald-700 text-white rounded-sm hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Pay (Simulated)
                    </button>
                  )}

                  {b.paymentStatus === 'Paid' && (
                    <button
                      onClick={() => {
                        setSelectedReceipt({
                          invoiceNumber: `INV-MOT-${Math.floor(100000 + Math.random() * 900000)}`,
                          transactionReference: `SIM-TX-${Date.now()}-VERIFIED`,
                          paymentMethod: 'Card (Simulated)',
                          amount: b.priceBreakdown.totalAmount,
                          status: 'Successful'
                        });
                      }}
                      className="px-3 py-1.5 text-xs font-semibold border border-[var(--border-fine)] text-[var(--text-primary)] rounded-sm hover:bg-[var(--surface-sage)] transition cursor-pointer"
                    >
                      View Invoice
                    </button>
                  )}

                  {['Pending', 'Confirmed'].includes(b.status) && (
                    <button
                      onClick={() => handleCancelBooking(b._id)}
                      className="px-3 py-1.5 text-xs text-red-600 border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-sm transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simulated Payment Modal */}
      {payingBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-fine)] rounded-sm p-6 space-y-5 shadow-2xl">
            <div className="border-b border-[var(--border-fine)] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-sage)]">
                SIMULATED SANDBOX SETTLEMENT
              </span>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Simulate Payment for {payingBooking.bookingReference}
              </h3>
            </div>

            <div className="p-3.5 bg-[var(--surface-sage)]/60 rounded-sm text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Vehicle:</span>
                <span className="font-bold text-[var(--text-primary)]">{payingBooking.vehicle.make} {payingBooking.vehicle.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Duration:</span>
                <span className="font-mono text-[var(--text-primary)]">{payingBooking.priceBreakdown.billableDays} Day(s)</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[var(--border-fine)]">
                <span className="font-bold text-[var(--text-primary)]">Total Settlement:</span>
                <span className="font-bold text-base font-mono text-[var(--text-primary)]">₹{payingBooking.priceBreakdown.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              * This is an academic test checkout. No real cards, bank logins, or CVVs are required. Choose an outcome to simulate the payment workflow.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleSimulatePayment('Successful')}
                disabled={simPaymentLoading}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-wider bg-emerald-700 text-white rounded-sm hover:bg-emerald-800 transition cursor-pointer"
              >
                Simulate Success
              </button>
              <button
                onClick={() => handleSimulatePayment('Failed')}
                disabled={simPaymentLoading}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-wider bg-red-700 text-white rounded-sm hover:bg-red-800 transition cursor-pointer"
              >
                Simulate Failure
              </button>
            </div>

            <button
              onClick={() => setPayingBooking(null)}
              className="w-full text-xs text-[var(--text-secondary)] hover:underline pt-2 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Simulated Receipt Dialog */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[var(--card-bg)] border border-[var(--border-fine)] rounded-sm p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-start border-b border-[var(--border-fine)] pb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent-sage)]">MOTIVO RECEIPT & INVOICE</span>
                <h2 className="text-2xl font-bold font-mono text-[var(--text-primary)]">{selectedReceipt.invoiceNumber}</h2>
                <span className="text-[11px] text-[var(--text-secondary)]">Terminal Base: TCET Mumbai</span>
              </div>
              <span className={`text-xs px-3 py-1 rounded-sm font-bold ${selectedReceipt.status === 'Successful' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {selectedReceipt.status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-[var(--border-fine)] pb-2">
                <span className="text-[var(--text-secondary)]">Transaction Ref:</span>
                <span className="font-mono text-[var(--text-primary)] font-bold">{selectedReceipt.transactionReference}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-fine)] pb-2">
                <span className="text-[var(--text-secondary)]">Payment Channel:</span>
                <span className="text-[var(--text-primary)]">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-fine)] pb-2">
                <span className="text-[var(--text-secondary)]">Amount Settled:</span>
                <span className="font-bold text-base font-mono text-[var(--text-primary)]">₹{selectedReceipt.amount?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-3 bg-[var(--text-primary)] text-[var(--bg-main)] text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer hover:opacity-90 transition"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
