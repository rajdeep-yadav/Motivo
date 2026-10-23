import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../services/api';

import { Filter, Search, RotateCcw, Users, Gauge, Fuel } from 'lucide-react';

export const VehicleCataloguePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || 'All');
  const [fuelType, setFuelType] = useState(searchParams.get('fuelType') || 'All');
  const [seats, setSeats] = useState(searchParams.get('seats') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [pickupDate, setPickupDate] = useState(searchParams.get('pickupDate') || '');
  const [returnDate, setReturnDate] = useState(searchParams.get('returnDate') || '');

  // Pagination & Sorting
  const [sortBy, setSortBy] = useState('dailyRate');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVehicles, setTotalVehicles] = useState(0);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (category !== 'All') queryParams.append('category', category);
      if (transmission !== 'All') queryParams.append('transmission', transmission);
      if (fuelType !== 'All') queryParams.append('fuelType', fuelType);
      if (seats) queryParams.append('seats', seats);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);
      if (pickupDate) queryParams.append('pickupDate', pickupDate);
      if (returnDate) queryParams.append('returnDate', returnDate);
      queryParams.append('sortBy', sortBy);
      queryParams.append('order', order);
      queryParams.append('page', page.toString());
      queryParams.append('limit', '9');

      const res = await apiRequest(`/vehicles?${queryParams.toString()}`);

      if (res.success) {
        setVehicles(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalVehicles(res.pagination.total);
      }
    } catch (err) {
      setError(err.message || 'Unable to load vehicle fleet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [category, transmission, fuelType, sortBy, order, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVehicles();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setTransmission('All');
    setFuelType('All');
    setSeats('');
    setMaxPrice('');
    setPickupDate('');
    setReturnDate('');
    setSortBy('dailyRate');
    setOrder('asc');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="border-b border-[var(--border-fine)] pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent-sage)]">
            MOTIVO FLEET DIRECTORY
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            Explore Vehicles
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Showing {totalVehicles} available models ready for immediate reservation.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Sort By:
          </label>
          <select
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [f, o] = e.target.value.split('-');
              setSortBy(f);
              setOrder(o);
              setPage(1);
            }}
            className="text-xs bg-[var(--card-bg)] border border-[var(--border-fine)] rounded-sm px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-sage)]"
          >
            <option value="dailyRate-asc">Price: Low to High</option>
            <option value="dailyRate-desc">Price: High to Low</option>
            <option value="createdAt-desc">Newest Fleet Arrivals</option>
            <option value="year-desc">Model Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-fine)]">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <Filter className="w-3.5 h-3.5" /> Filters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-[var(--accent-sage)] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit}>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Search Model / Make
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Audi, Porsche..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm text-[var(--text-primary)] focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--text-secondary)]" />
              </div>
            </form>

            {/* Rental Window Date Check */}
            <div className="space-y-3 pt-2 border-t border-[var(--border-fine)]">
              <span className="text-xs font-semibold text-[var(--text-primary)]">Rental Window</span>
              <div>
                <label className="block text-[11px] text-[var(--text-secondary)] mb-1">Pickup Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full text-xs bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm p-2 text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--text-secondary)] mb-1">Return Date</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full text-xs bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm p-2 text-[var(--text-primary)]"
                />
              </div>
              <button
                onClick={() => {
                  setPage(1);
                  fetchVehicles();
                }}
                className="w-full py-2 bg-[var(--surface-sage)] text-[var(--text-primary)] text-xs font-medium rounded-sm border border-[var(--border-fine)] hover:bg-[var(--accent-sage)] hover:text-white transition"
              >
                Check Date Availability
              </button>
            </div>

            {/* Category Filter */}
            <div className="pt-2 border-t border-[var(--border-fine)]">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm p-2 text-[var(--text-primary)]"
              >
                <option value="All">All Categories</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
                <option value="Sports">Sports</option>
                <option value="Electric">Electric</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Bike">Bikes & Motorcycles</option>
              </select>
            </div>

            {/* Transmission */}
            <div className="pt-2 border-t border-[var(--border-fine)]">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Transmission</label>
              <div className="flex gap-2">
                {['All', 'Automatic', 'Manual'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTransmission(t);
                      setPage(1);
                    }}
                    className={`flex-1 text-xs py-1.5 border rounded-sm transition ${
                      transmission === t
                        ? 'bg-[var(--text-primary)] text-[var(--bg-main)] border-[var(--text-primary)]'
                        : 'border-[var(--border-fine)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Type */}
            <div className="pt-2 border-t border-[var(--border-fine)]">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => {
                  setFuelType(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs bg-[var(--bg-main)] border border-[var(--border-fine)] rounded-sm p-2 text-[var(--text-primary)]"
              >
                <option value="All">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Max Daily Price Slider */}
            <div className="pt-2 border-t border-[var(--border-fine)]">
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
                <span>Max Daily Rate</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {maxPrice ? `₹${Number(maxPrice).toLocaleString('en-IN')}` : 'Any'}
                </span>
              </div>
              <input
                type="range"
                min="3000"
                max="25000"
                step="500"
                value={maxPrice || '25000'}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                className="w-full accent-[var(--accent-sage)] cursor-pointer"
              />
            </div>

          </div>
        </aside>

        {/* Vehicle Cards Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-sage)]"></div>
              <p className="text-xs text-[var(--text-secondary)] mt-3">Loading Motivo fleet catalogue...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-sm">
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
              <button
                onClick={fetchVehicles}
                className="mt-3 text-xs bg-[var(--text-primary)] text-[var(--bg-main)] px-4 py-2 rounded-sm"
              >
                Retry
              </button>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="p-16 text-center border border-[var(--border-fine)] bg-[var(--card-bg)] rounded-sm">
              <p className="text-base font-semibold text-[var(--text-primary)]">No vehicles found</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Try adjusting your search criteria, dates, or price range.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 text-xs bg-[var(--text-primary)] text-[var(--bg-main)] px-4 py-2 rounded-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <div
                    key={v._id}
                    className="motivo-card rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] flex flex-col overflow-hidden group hover:border-[var(--accent-sage)]"
                  >
                    <div className="h-44 bg-[var(--surface-sage)] relative overflow-hidden">
                      <img
                        src={v.images[0] || 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80'}
                        alt={`${v.make} ${v.model}`}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          // Fallback on broken remote images
                          e.target.src = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[var(--bg-main)]/90 backdrop-blur-xs border border-[var(--border-fine)] text-[var(--text-primary)] shadow-2xs">
                        {v.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-sage)] transition-colors duration-200">
                            {v.make} {v.model}
                          </h3>
                          <span className="text-xs font-mono text-[var(--text-secondary)]">{v.year}</span>
                        </div>

                        {/* Specs badges */}
                        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-3">
                          <span className="flex items-center gap-1">
                            <Gauge className="w-3.5 h-3.5" /> {v.transmission}
                          </span>
                          <span className="flex items-center gap-1">
                            <Fuel className="w-3.5 h-3.5" /> {v.fuelType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {v.seatingCapacity}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[var(--border-fine)] flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-[var(--text-secondary)]">Daily rate</span>
                          <p className="text-base font-bold text-[var(--text-primary)]">
                            ₹{v.dailyRate.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <Link
                          to={`/vehicles/${v._id}`}
                          className="motivo-btn bg-[var(--text-primary)] text-[var(--bg-main)] text-xs font-semibold px-4 py-2 rounded-sm hover:opacity-90 shadow-2xs"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination bar */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 text-xs rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] text-[var(--text-primary)] disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-[var(--text-secondary)] px-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 text-xs rounded-sm border border-[var(--border-fine)] bg-[var(--card-bg)] text-[var(--text-primary)] disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};



