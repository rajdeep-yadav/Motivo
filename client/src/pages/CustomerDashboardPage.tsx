import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import type { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, CreditCard } from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const newRef = searchParams.get('bookingSuccess');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionError, setActionError] = useState<string | null>(null);

  // Simulated Payment Modal State
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null);
  const [simPaymentLoading, setSimPaymentLoading] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: Booking[] }>('/bookings/my');
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err: any) {
      console.error(err);
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
      const res = await apiRequest<{ success: boolean; message: string }>(`/bookings/${id}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ cancellationReason: 'Cancelled via customer dashboard' })
      });
      if (res.success) {
        fetchBookings();
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to cancel booking');
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
      alert(err.message || 'Simulated payment failed');
    } finally {
      setSimPaymentLoading(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Welcome Banner */}
      <div className="border-b border-[var(--border-fine)] pb-8 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent-sage)]">
            CUSTOMER RECORDS & ACTIVITY
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage your verified fleet reservations, simulated payments, and past journey invoices.
          </p>
        </div>
        <Link
          to="/vehicles"
          className="bg-[var(--text-primary)] text-[var(--bg-main)] text-xs font-semibold px-4 py-2.5 rounded-sm hover:opacity-90"
        >
          Book Another Vehicle
        </Link>
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
          <p className="text-xs text-[var(--text-secondary)] mt-3">Fetching your booking records...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-20 text-center border border-[var(--border-fine)] rounded-sm bg-[var(--card-bg)] space-y-3">
          <p className="text-sm font-semibold text-[var(--text-primary)]">No bookings found</p>
          <p className="text-xs text-[var(--text-secondary)]">You haven't reserved any vehicles yet.</p>
          <Link
            to="/vehicles"
            className="inline-block mt-2 bg-[var(--text-primary)] text-[var(--bg-main)] text-xs font-medium px-4 py-2 rounded-sm"
          >
            Explore Fleet
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="p-6 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] shadow-xs flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[var(--text-primary)] bg-[var(--surface-sage)] px-2.5 py-1 rounded-sm">
                    {b.bookingReference}
                  </span>
                  
                  {/* Status Badge */}
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-sm border ${
                      b.status === 'Confirmed' || b.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300'
                        : b.status === 'Pending'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : b.status === 'Active'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {b.status}
                  </span>

                  {/* Payment Status Badge */}
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-sm ${
                      b.paymentStatus === 'Paid'
                        ? 'text-emerald-700 font-bold'
                        : b.paymentStatus === 'Failed'
                        ? 'text-red-600'
                        : 'text-amber-600'
                    }`}
                  >
                    Payment: {b.paymentStatus}
                  </span>
                </div>

                <div className="pt-1">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    {b.vehicle ? `${b.vehicle.make} ${b.vehicle.model}` : 'Vehicle Reserved'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-secondary)] mt-2">
                    <div>
                      <span className="font-medium text-[var(--text-primary)]">Pickup:</span>{' '}
                      {new Date(b.pickupDateTime).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium text-[var(--text-primary)]">Return:</span>{' '}
                      {new Date(b.returnDateTime).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Price Breakdown Summary */}
                <div className="pt-2 text-xs text-[var(--text-secondary)]">
                  {b.priceBreakdown.billableDays} Day(s) @ ₹{b.priceBreakdown.dailyRate.toLocaleString('en-IN')}/day • Tax: ₹{b.priceBreakdown.tax.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Action Column */}
              <div className="flex md:flex-col justify-between md:items-end md:justify-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:pl-6 border-[var(--border-fine)]">
                <div className="md:text-right">
                  <span className="text-[11px] text-[var(--text-secondary)]">Total Amount</span>
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    ₹{b.priceBreakdown.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {b.paymentStatus !== 'Paid' && !['Cancelled', 'Rejected'].includes(b.status) && (
                    <button
                      onClick={() => setPayingBooking(b)}
                      className="px-3.5 py-2 text-xs font-semibold bg-emerald-700 text-white rounded-sm hover:bg-emerald-800 transition flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Pay (Simulated)
                    </button>
                  )}

                  {['Pending', 'Confirmed'].includes(b.status) && (
                    <button
                      onClick={() => handleCancelBooking(b._id)}
                      className="px-3 py-2 text-xs text-red-600 border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-sm transition"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-fine)] rounded-sm p-6 space-y-5">
            <div className="border-b border-[var(--border-fine)] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-sage)]">
                SIMULATED TEST TRANSACTION
              </span>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Complete Payment for {payingBooking.bookingReference}
              </h3>
            </div>

            <div className="p-3 bg-[var(--surface-sage)]/50 rounded-sm text-xs space-y-1">
              <div className="flex justify-between">
                <span>Vehicle:</span>
                <span className="font-bold">{payingBooking.vehicle.make} {payingBooking.vehicle.model}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Due:</span>
                <span className="font-bold text-sm">₹{payingBooking.priceBreakdown.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              * This is a sandbox simulated checkout module for academic practicals demonstration. No real banking credentials or credit cards are involved.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleSimulatePayment('Successful')}
                disabled={simPaymentLoading}
                className="flex-1 py-2.5 text-xs font-semibold bg-emerald-700 text-white rounded-sm hover:bg-emerald-800"
              >
                Simulate Success
              </button>
              <button
                onClick={() => handleSimulatePayment('Failed')}
                disabled={simPaymentLoading}
                className="flex-1 py-2.5 text-xs font-semibold bg-red-700 text-white rounded-sm hover:bg-red-800"
              >
                Simulate Failure
              </button>
            </div>

            <button
              onClick={() => setPayingBooking(null)}
              className="w-full text-xs text-[var(--text-secondary)] hover:underline pt-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Simulated Receipt Dialog */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[var(--card-bg)] border border-[var(--border-fine)] rounded-sm p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-[var(--border-fine)] pb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[var(--accent-sage)]">MOTIVO RECEIPT</span>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedReceipt.invoiceNumber}</h2>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-sm font-bold ${selectedReceipt.status === 'Successful' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {selectedReceipt.status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-[var(--border-fine)] pb-2">
                <span className="text-[var(--text-secondary)]">Transaction Reference:</span>
                <span className="font-mono text-[var(--text-primary)]">{selectedReceipt.transactionReference}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-fine)] pb-2">
                <span className="text-[var(--text-secondary)]">Payment Method:</span>
                <span className="text-[var(--text-primary)]">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-fine)] pb-2">
                <span className="text-[var(--text-secondary)]">Amount Paid:</span>
                <span className="font-bold text-sm text-[var(--text-primary)]">₹{selectedReceipt.amount?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 bg-[var(--text-primary)] text-[var(--bg-main)] text-xs font-semibold rounded-sm"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
