import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import type { Vehicle, Booking, User } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck, Plus, Check, Truck, Users, DollarSign, Car, Calendar } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'fleet' | 'bookings' | 'customers'>('overview');
  
  // Overview Data
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  // Fleet Management Data
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: 2024,
    category: 'Sedan',
    description: '',
    images: '',
    registrationNumber: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seatingCapacity: 5,
    dailyRate: 5000,
    operationalStatus: 'Available',
    features: 'Panoramic Sunroof, Cruise Control, Leather Seats'
  });

  // Bookings Management Data
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  // Customer Management Data
  const [customers, setCustomers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, reportsRes, vehiclesRes, bookingsRes, customersRes] = await Promise.all([
        apiRequest<{ success: boolean; stats: any; categoryStats: any[]; bookingStatusStats: any[] }>('/admin/stats'),
        apiRequest<{ success: boolean; data: any[] }>('/admin/reports'),
        apiRequest<{ success: boolean; data: Vehicle[] }>('/vehicles?limit=50'),
        apiRequest<{ success: boolean; data: Booking[] }>('/bookings'),
        apiRequest<{ success: boolean; data: User[] }>('/admin/customers')
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (reportsRes.success) setChartData(reportsRes.data);
      if (vehiclesRes.success) setVehicles(vehiclesRes.data);
      if (bookingsRes.success) setAllBookings(bookingsRes.data);
      if (customersRes.success) setCustomers(customersRes.data);
    } catch (err) {
      console.error('Failed to load admin metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newVehicle,
        images: newVehicle.images ? [newVehicle.images] : ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80'],
        features: newVehicle.features.split(',').map((f) => f.trim())
      };
      await apiRequest('/vehicles', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setShowAddVehicle(false);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to add vehicle');
    }
  };

  const handleUpdateVehicleStatus = async (id: string, status: string) => {
    try {
      await apiRequest(`/vehicles/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ operationalStatus: status })
      });
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update vehicle status');
    }
  };

  const handleBookingLifecycle = async (id: string, status: string) => {
    try {
      await apiRequest(`/bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Status transition rejected');
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-sage)]"></div>
        <p className="text-xs text-[var(--text-secondary)] mt-3">Loading administrative console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Admin Header */}
      <div className="border-b border-[var(--border-fine)] pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent-sage)] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[var(--accent-sage)]" /> SECURE FLEET ADMINISTRATION
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            Motivo Control Operations
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Live fleet availability, lifecycle state transitions, customer ledger, and revenue metrics.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-[var(--surface-sage)] p-1 rounded-sm border border-[var(--border-fine)] text-xs">
          {(['overview', 'fleet', 'bookings', 'customers'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xs font-semibold capitalize transition ${
                activeTab === tab
                  ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & CHARTS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Metrics Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="p-5 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)]">
              <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[var(--accent-sage)]" /> Total Fleet
              </span>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats?.totalVehicles ?? 0}</h3>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">{stats?.availableVehicles ?? 0} active ready</p>
            </div>

            <div className="p-5 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)]">
              <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--accent-sage)]" /> Active Rentals
              </span>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats?.activeRentals ?? 0}</h3>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">{stats?.pendingBookings ?? 0} pending review</p>
            </div>

            <div className="p-5 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)]">
              <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[var(--accent-sage)]" /> Registered Clients
              </span>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats?.totalCustomers ?? 0}</h3>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">Verified identities</p>
            </div>

            <div className="p-5 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)]">
              <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[var(--accent-sage)]" /> Simulated Revenue
              </span>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                ₹{(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}
              </h3>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">From successful settlements</p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="p-6 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">7-Day Settled Revenue Trend</h3>
                <p className="text-xs text-[var(--text-secondary)]">Computed strictly from database payment records</p>
              </div>
              <span className="text-xs font-mono text-[var(--accent-sage)]">INR (₹)</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={11} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--border-fine)',
                      fontSize: '12px',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Bar dataKey="revenue" fill="var(--accent-sage)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FLEET MANAGEMENT */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Fleet Inventory ({vehicles.length})</h2>
            <button
              onClick={() => setShowAddVehicle(!showAddVehicle)}
              className="bg-[var(--text-primary)] text-[var(--bg-main)] text-xs font-semibold px-4 py-2 rounded-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Vehicle
            </button>
          </div>

          {showAddVehicle && (
            <form onSubmit={handleCreateVehicle} className="p-6 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Register New Vehicle to Fleet</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block mb-1 text-[var(--text-secondary)]">Make</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BMW"
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                    className="w-full p-2 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[var(--text-secondary)]">Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M340i"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="w-full p-2 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[var(--text-secondary)]">Reg Number</label>
                  <input
                    type="text"
                    required
                    placeholder="KA-01-AB-1234"
                    value={newVehicle.registrationNumber}
                    onChange={(e) => setNewVehicle({ ...newVehicle, registrationNumber: e.target.value })}
                    className="w-full p-2 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[var(--text-secondary)]">Category</label>
                  <select
                    value={newVehicle.category}
                    onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value as any })}
                    className="w-full p-2 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)]"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Sports">Sports</option>
                    <option value="Electric">Electric</option>
                    <option value="Hatchback">Hatchback</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-[var(--text-secondary)]">Daily Rate (INR)</label>
                  <input
                    type="number"
                    required
                    value={newVehicle.dailyRate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, dailyRate: Number(e.target.value) })}
                    className="w-full p-2 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[var(--text-secondary)]">Fuel Type</label>
                  <select
                    value={newVehicle.fuelType}
                    onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value as any })}
                    className="w-full p-2 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)]"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-xs text-[var(--text-secondary)]">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newVehicle.description}
                  onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                  className="w-full p-2 text-xs bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)]"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-sm">
                  Save Vehicle
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddVehicle(false)}
                  className="px-4 py-2 border border-[var(--border-fine)] text-xs text-[var(--text-secondary)] rounded-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="border border-[var(--border-fine)] bg-[var(--card-bg)] rounded-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-sage)] border-b border-[var(--border-fine)] text-[var(--text-secondary)] uppercase">
                <tr>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Reg No</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Daily Rate</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-fine)]">
                {vehicles.map((v) => (
                  <tr key={v._id}>
                    <td className="p-3 font-semibold text-[var(--text-primary)]">
                      {v.make} {v.model} ({v.year})
                    </td>
                    <td className="p-3 font-mono text-[var(--text-secondary)]">{v.registrationNumber}</td>
                    <td className="p-3">{v.category}</td>
                    <td className="p-3 font-bold text-[var(--text-primary)]">₹{v.dailyRate.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold border ${
                        v.operationalStatus === 'Available'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : v.operationalStatus === 'Maintenance'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}>
                        {v.operationalStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <select
                        value={v.operationalStatus}
                        onChange={(e) => handleUpdateVehicleStatus(v._id, e.target.value)}
                        className="text-[11px] p-1 bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)]"
                      >
                        <option value="Available">Available</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Retired">Retired</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS LIFECYCLE MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Manage Bookings ({allBookings.length})</h2>
          
          <div className="border border-[var(--border-fine)] bg-[var(--card-bg)] rounded-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-sage)] border-b border-[var(--border-fine)] text-[var(--text-secondary)] uppercase">
                <tr>
                  <th className="p-3">Ref</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Rental Dates</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3 text-right">Lifecycle Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-fine)]">
                {allBookings.map((b) => (
                  <tr key={b._id}>
                    <td className="p-3 font-mono font-bold text-[var(--text-primary)]">{b.bookingReference}</td>
                    <td className="p-3 text-[var(--text-secondary)]">{(b.customer as any)?.name || 'Guest'}</td>
                    <td className="p-3 font-medium text-[var(--text-primary)]">{(b.vehicle as any)?.make} {(b.vehicle as any)?.model}</td>
                    <td className="p-3 text-[var(--text-secondary)]">
                      {new Date(b.pickupDateTime).toLocaleDateString()} to {new Date(b.returnDateTime).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold border border-[var(--border-fine)] bg-[var(--surface-sage)]">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 font-semibold">{b.paymentStatus}</td>
                    <td className="p-3 text-right space-x-1.5">
                      {b.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleBookingLifecycle(b._id, 'Confirmed')}
                            className="px-2 py-1 bg-emerald-700 text-white rounded-xs hover:bg-emerald-800"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleBookingLifecycle(b._id, 'Rejected')}
                            className="px-2 py-1 bg-red-700 text-white rounded-xs hover:bg-red-800"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {b.status === 'Confirmed' && (
                        <button
                          onClick={() => handleBookingLifecycle(b._id, 'Active')}
                          className="px-2 py-1 bg-blue-700 text-white rounded-xs hover:bg-blue-800 flex items-center gap-1 inline-flex"
                        >
                          <Truck className="w-3 h-3" /> Record Pickup
                        </button>
                      )}
                      {b.status === 'Active' && (
                        <button
                          onClick={() => handleBookingLifecycle(b._id, 'Completed')}
                          className="px-2 py-1 bg-emerald-800 text-white rounded-xs hover:bg-emerald-900 flex items-center gap-1 inline-flex"
                        >
                          <Check className="w-3 h-3" /> Record Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMERS ROSTER */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Registered Customers ({customers.length})</h2>
          
          <div className="border border-[var(--border-fine)] bg-[var(--card-bg)] rounded-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-sage)] border-b border-[var(--border-fine)] text-[var(--text-secondary)] uppercase">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Driving License</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-fine)]">
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="p-3 font-semibold text-[var(--text-primary)]">{c.name}</td>
                    <td className="p-3 font-mono text-[var(--text-secondary)]">{c.email}</td>
                    <td className="p-3">{c.phone || 'N/A'}</td>
                    <td className="p-3 font-mono">{c.drivingLicense || 'N/A'}</td>
                    <td className="p-3 capitalize">{c.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
