import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import type { Vehicle, Booking, User } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
import {
  ShieldCheck,
  Plus,
  Check,
  Truck,
  Users,
  DollarSign,
  Car,
  Calendar,
  MapPin,
  TrendingUp,
  Activity
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'fleet' | 'bookings' | 'customers' | 'maps'>('overview');
  
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

  // Mock fleet telemetry coordinates for the live fleet terminal map
  const fleetLocations = [
    { name: 'Audi A6 Sedan', reg: 'MH02-EK-8821', hub: 'Terminal 1 - TCET Mumbai Base', lat: '19.2081° N', lon: '72.8722° E', status: 'Ready', battery: '95%' },
    { name: 'Range Rover Velar', reg: 'DL01-CA-9902', hub: 'Terminal 2 - Bandra Kurla Complex', lat: '19.0657° N', lon: '72.8687° E', status: 'On Journey', battery: '82%' },
    { name: 'Porsche Taycan 4S', reg: 'KA04-EL-4004', hub: 'Terminal 3 - Mumbai Int. Airport T2', lat: '19.0896° N', lon: '72.8656° E', status: 'Ready', battery: '99%' },
    { name: 'BMW M340i xDrive', reg: 'KA05-MM-3401', hub: 'Terminal 1 - TCET Mumbai Base', lat: '19.2085° N', lon: '72.8719° E', status: 'Ready', battery: '91%' },
    { name: 'Mercedes E-Class', reg: 'MH01-LU-2244', hub: 'Terminal 4 - South Bombay Gateway', lat: '18.9220° N', lon: '72.8347° E', status: 'Ready', battery: '88%' },
    { name: 'Innova HyCross ZX', reg: 'KA03-HY-7007', hub: 'Terminal 1 - TCET Mumbai Base', lat: '19.2079° N', lon: '72.8725° E', status: 'Maintenance', battery: '75%' }
  ];

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-sage)]"></div>
        <p className="text-xs text-[var(--text-secondary)] mt-3">Loading administrative command telemetry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Admin Command Header */}
      <div className="border-b border-[var(--border-fine)] pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[var(--accent-sage)] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[var(--accent-sage)]" /> ENTERPRISE FLEET COMMAND
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            Motivo Executive Operations
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Live fleet GPS telemetry, multi-day revenue curves, customer roster, and lifecycle state dispatch.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-[var(--surface-sage)] p-1 rounded-sm border border-[var(--border-fine)] text-xs">
          {(['overview', 'fleet', 'bookings', 'maps', 'customers'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xs font-semibold capitalize transition ${
                activeTab === tab
                  ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab === 'maps' ? 'Live Telemetry & Maps' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & RICH REVENUE CHARTS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Metrics Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="p-5 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] shadow-xs">
              <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 font-semibold">
                <Car className="w-4 h-4 text-[var(--accent-sage)]" /> Total Fleet
              </span>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-1 font-mono">{stats?.totalVehicles ?? vehicles.length}</h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">{stats?.availableVehicles ?? 7} operational & ready</p>
            </div>

            <div className="p-5 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] shadow-xs">
              <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 font-semibold">
                <Calendar className="w-4 h-4 text-[var(--accent-sage)]" /> Active Rentals
              </span>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-1 font-mono">{stats?.activeRentals ?? 1}</h3>
              <p className="text-[11px] text-[var(--accent-sage)] font-medium mt-1">{stats?.pendingBookings ?? 0} pending dispatch</p>
            </div>

            <div className="p-5 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] shadow-xs">
              <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 font-semibold">
                <Users className="w-4 h-4 text-[var(--accent-sage)]" /> Client Accounts
              </span>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-1 font-mono">{stats?.totalCustomers ?? customers.length}</h3>
              <p className="text-[11px] text-[var(--text-secondary)] font-medium mt-1">Verified driver licenses</p>
            </div>

            <div className="p-5 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] shadow-xs">
              <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 font-semibold">
                <DollarSign className="w-4 h-4 text-[var(--accent-sage)]" /> Realized Turnover
              </span>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-1 font-mono">
                ₹{(stats?.totalRevenue ?? 57879).toLocaleString('en-IN')}
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Verified simulated settlements</p>
            </div>
          </div>

          {/* Dual Charts Area: Area Chart for Smooth Earnings + Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Area Chart: Revenue Inflow Curve */}
            <div className="p-6 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] shadow-xs">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" /> Revenue Growth Inflow Curve
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Smooth trend derived from processed transactions</p>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--accent-sage)]">INR (₹)</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#606D5B" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#606D5B" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-fine)" vertical={false} />
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
                    <Area type="monotone" dataKey="revenue" stroke="#606D5B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart: Daily Reservations */}
            <div className="p-6 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] shadow-xs">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[var(--accent-sage)]" /> Daily Fleet Booking Velocity
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Vehicles dispatched per day</p>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--text-secondary)]">Dispatches</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-fine)" vertical={false} />
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
                    <Bar dataKey="bookings" fill="#20221F" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Quick Fleet Quick-Stats Table */}
          <div className="p-6 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)]">
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4">Active Fleet Telemetry Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-sm bg-[var(--surface-sage)]/50 border border-[var(--border-fine)] space-y-1">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Active Fleet Base</span>
                <p className="font-bold text-sm text-[var(--text-primary)]">TCET Mumbai Central Terminal</p>
                <p className="text-[11px] text-[var(--text-secondary)]">Kandivali East, Mumbai</p>
              </div>
              <div className="p-4 rounded-sm bg-[var(--surface-sage)]/50 border border-[var(--border-fine)] space-y-1">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Fleet Utilization</span>
                <p className="font-bold text-sm text-emerald-600">87.5% Efficiency</p>
                <p className="text-[11px] text-[var(--text-secondary)]">7/8 vehicles in rotation</p>
              </div>
              <div className="p-4 rounded-sm bg-[var(--surface-sage)]/50 border border-[var(--border-fine)] space-y-1">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Zero-Dep Claims</span>
                <p className="font-bold text-sm text-blue-600">0 Incident Reports</p>
                <p className="text-[11px] text-[var(--text-secondary)]">All returns certified intact</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE TELEMETRY & GPS HUBS MAPS */}
      {activeTab === 'maps' && (
        <div className="space-y-6">
          <div className="p-6 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--border-fine)] pb-4">
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" /> Interactive Fleet Terminal Dispatch & GPS Map
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Live satellite telemetry broadcasting from TCET Mumbai Headquarters and regional transit nodes.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-sm font-semibold">
                ● Telemetry Live
              </span>
            </div>

            {/* Stylized Visual Map Display */}
            <div className="relative rounded-sm border border-[var(--border-fine)] bg-[var(--surface-sage)]/60 p-6 overflow-hidden min-h-[340px] flex flex-col justify-between">
              
              {/* Map grid lines */}
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #20221F 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

              {/* Map Header */}
              <div className="relative z-10 flex justify-between items-start">
                <div className="bg-[var(--card-bg)] border border-[var(--border-fine)] p-3 rounded-sm shadow-xs max-w-xs">
                  <span className="text-[10px] font-bold text-[var(--accent-sage)] uppercase block">PRIMARY FLEET TERMINAL</span>
                  <p className="text-xs font-bold text-[var(--text-primary)]">TCET Mumbai Mobility Hub</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">Thakur Complex, Kandivali East, Mumbai</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--border-fine)] p-2 rounded-sm text-right text-[11px] font-mono shadow-xs">
                  <div>LAT: 19.2081° N</div>
                  <div>LON: 72.8722° E</div>
                </div>
              </div>

              {/* Visual Simulated Vehicle Pins */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                {fleetLocations.slice(0, 3).map((loc, i) => (
                  <div key={i} className="p-3 bg-[var(--card-bg)] border border-[var(--border-fine)] rounded-sm shadow-sm flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-800 shrink-0">
                      <Car className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-[var(--text-primary)] block">{loc.name}</span>
                      <span className="text-[11px] font-mono text-[var(--text-secondary)]">{loc.reg}</span>
                      <div className="flex items-center gap-2 mt-1 text-[10px]">
                        <span className="text-emerald-600 font-bold">● {loc.status}</span>
                        <span className="text-[var(--text-secondary)]">Charge: {loc.battery}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative z-10 text-center text-xs text-[var(--text-secondary)] bg-[var(--card-bg)]/80 backdrop-blur-xs py-2 px-4 rounded-sm border border-[var(--border-fine)]">
                Coordinates synchronized with Motivo Autonomous Fleet Engine • Sector 4 Dispatch Active
              </div>
            </div>

            {/* GPS Telemetry Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-sage)] border-b border-[var(--border-fine)] text-[var(--text-secondary)] uppercase">
                  <tr>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Registration</th>
                    <th className="p-3">Current Location / Terminal</th>
                    <th className="p-3">Coordinates</th>
                    <th className="p-3">Telemetry Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-fine)] font-mono">
                  {fleetLocations.map((loc, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-semibold font-sans text-[var(--text-primary)]">{loc.name}</td>
                      <td className="p-3">{loc.reg}</td>
                      <td className="p-3 font-sans text-[var(--text-secondary)]">{loc.hub}</td>
                      <td className="p-3 text-[11px]">{loc.lat}, {loc.lon}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${loc.status === 'Ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                          {loc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FLEET INVENTORY MANAGEMENT */}
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
            <form onSubmit={handleCreateVehicle} className="p-6 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] space-y-4 shadow-sm">
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

      {/* TAB 4: BOOKINGS LIFECYCLE MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Manage Fleet Bookings ({allBookings.length})</h2>
          
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
                    <td className="p-3 text-[var(--text-secondary)]">{(b.customer as any)?.name || 'Rajdeep Yadav'}</td>
                    <td className="p-3 font-medium text-[var(--text-primary)]">{(b.vehicle as any)?.make} {(b.vehicle as any)?.model}</td>
                    <td className="p-3 text-[var(--text-secondary)]">
                      {new Date(b.pickupDateTime).toLocaleDateString()} to {new Date(b.returnDateTime).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold border border-[var(--border-fine)] bg-[var(--surface-sage)]">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-emerald-700">{b.paymentStatus}</td>
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

      {/* TAB 5: REGISTERED CLIENTS ROSTER */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Verified Customer Roster ({customers.length})</h2>
          
          <div className="border border-[var(--border-fine)] bg-[var(--card-bg)] rounded-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-sage)] border-b border-[var(--border-fine)] text-[var(--text-secondary)] uppercase">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Driving License</th>
                  <th className="p-3">Access Role</th>
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
