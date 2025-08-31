import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface Reservation {
  id: string;
  userId: string;
  fromCity: string;
  to: string;
  direction: 'oneway' | 'roundtrip';
  date: string;
  time: string;
  returnDate?: string;
  returnTime?: string;
  passengers: number;
  luggage: number;
  promo?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface UserWithReservations extends User {
  reservations: Reservation[];
}

const phoneDisplay = "(309) 799-0907";
const phoneDigits = "+13097990907";
const emailTo = "contact@neobize.com";

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserWithReservations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserWithReservations | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  // Simple admin authentication (in production, use proper authentication)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "Passerneobize1982") { // Simple password for demo
      setIsAuthenticated(true);
      fetchAllData();
    } else {
      setError("Invalid admin password");
    }
  };

  const fetchAllData = async () => {
    try {
      const response = await fetch('http://localhost:3008/api/admin/users-with-reservations');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3008/api/admin/reservations/${reservationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh data
        fetchAllData();
      } else {
        setError(data.message || 'Failed to update reservation status');
      }
    } catch (err) {
      setError('Network error while updating reservation status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    if (statusFilter === "all") return matchesSearch;
    
    const hasReservationWithStatus = user.reservations.some(reservation => 
      reservation.status === statusFilter
    );
    
    return matchesSearch && hasReservationWithStatus;
  });

  const totalUsers = users.length;
  const totalReservations = users.reduce((sum, user) => sum + user.reservations.length, 0);
  const pendingReservations = users.reduce((sum, user) => 
    sum + user.reservations.filter(r => r.status === 'pending').length, 0
  );
  const confirmedReservations = users.reduce((sum, user) => 
    sum + user.reservations.filter(r => r.status === 'confirmed').length, 0
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-12 w-12 rounded-lg bg-red-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <span className="font-bold text-xl text-slate-800">EOBIZE</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
              <p className="text-slate-600">Enter admin password to access</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
              >
                Access Admin Dashboard
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
              >
                ← Back to Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-red-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="font-bold text-lg text-slate-800">EOBIZE</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-sm text-slate-500">Admin Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-sm text-slate-600 hover:text-red-600 transition-colors"
              >
                Sign Out
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Website
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{totalUsers}</p>
                <p className="text-sm text-slate-500">Total Users</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{totalReservations}</p>
                <p className="text-sm text-slate-500">Total Reservations</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{pendingReservations}</p>
                <p className="text-sm text-slate-500">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{confirmedReservations}</p>
                <p className="text-sm text-slate-500">Confirmed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Users</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="Search by name, email, or phone..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Users & Reservations</h2>
            <p className="text-sm text-slate-500 mt-1">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">No users found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-slate-500">{user.email}</p>
                        <p className="text-sm text-slate-500">{user.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Member since</p>
                      <p className="text-sm font-medium text-slate-800">{formatDate(user.createdAt)}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {user.reservations.length} reservation{user.reservations.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {user.reservations.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-700">Reservations:</h4>
                      {user.reservations.map((reservation) => (
                        <div key={reservation.id} className="bg-slate-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">
                                  {reservation.fromCity} → {reservation.to}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {formatDate(reservation.date)} at {formatTime(reservation.time)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <select
                                value={reservation.status}
                                onChange={(e) => updateReservationStatus(reservation.id, e.target.value)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)} focus:ring-2 focus:ring-blue-500 outline-none`}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">Trip:</span>
                              <p className="font-medium text-slate-800">
                                {reservation.direction === 'roundtrip' ? 'Round-trip' : 'One-way'}
                              </p>
                            </div>
                            <div>
                              <span className="text-slate-500">Passengers:</span>
                              <p className="font-medium text-slate-800">{reservation.passengers}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Luggage:</span>
                              <p className="font-medium text-slate-800">{reservation.luggage} bags</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Booked:</span>
                              <p className="font-medium text-slate-800">{formatDate(reservation.createdAt)}</p>
                            </div>
                          </div>

                          {reservation.notes && (
                            <div className="mt-3 p-3 bg-white rounded-lg">
                              <span className="text-slate-500 text-sm">Notes:</span>
                              <p className="text-slate-800 text-sm mt-1">{reservation.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
