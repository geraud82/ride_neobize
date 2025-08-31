import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ApiContext } from "./App";

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

const phoneDisplay = "(309) 799-0907";
const phoneDigits = "+13097990907";
const emailTo = "contact@neobize.com";

export default function UserDashboard() {
  const apiUrl = useContext(ApiContext);
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('neobize_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchUserReservations(userData.email);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserReservations = async (userEmail: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/users/${encodeURIComponent(userEmail)}/reservations`);
      const data = await response.json();
      
      if (data.success) {
        setReservations(data.reservations);
      } else {
        setError(data.message || 'Failed to fetch reservations');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoggingIn(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem('neobize_user', JSON.stringify(data.user));
        fetchUserReservations(data.user.email);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setReservations([]);
    localStorage.removeItem('neobize_user');
    setEmail('');
    setError('');
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
      month: 'long',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-red-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg sm:text-xl">N</span>
              </div>
              <span className="font-bold text-lg sm:text-xl text-slate-800">EOBIZE</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-slate-600 hidden sm:block">
                Welcome, {user.firstName}!
              </span>
            )}
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!user ? (
          // Login Form
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
                Access Your Account
              </h1>
              <p className="text-lg text-slate-600">
                Enter your email to view and manage your reservations
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100">
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="your.email@example.com"
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
                  disabled={isLoggingIn}
                  className={`w-full py-3 px-4 font-semibold rounded-xl transition-all ${
                    isLoggingIn
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transform hover:scale-105'
                  }`}
                >
                  {isLoggingIn ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Accessing Account...
                    </div>
                  ) : (
                    'Access My Account'
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700 text-center">
                  <strong>New customer?</strong> Your account will be automatically created when you make your first booking.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // User Dashboard
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
                    Welcome back, {user.firstName}!
                  </h1>
                  <p className="text-slate-600">
                    Manage your NEOBIZE shuttle reservations and account details
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/book"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4v16m8-8H4"/>
                    </svg>
                    New Booking
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Account Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <p className="text-slate-900 font-medium">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <p className="text-slate-900 font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <p className="text-slate-900 font-medium">{user.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Member Since</label>
                  <p className="text-slate-900 font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Reservations */}
            <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Your Reservations</h2>
                <span className="text-sm text-slate-500">
                  {reservations.length} total reservation{reservations.length !== 1 ? 's' : ''}
                </span>
              </div>

              {reservations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No reservations yet</h3>
                  <p className="text-slate-600 mb-6">Ready to book your first shuttle ride?</p>
                  <Link
                    to="/book"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4v16m8-8H4"/>
                    </svg>
                    Book Your First Ride
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <div key={reservation.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">
                              {reservation.fromCity} → {reservation.to}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {reservation.direction === 'roundtrip' ? 'Round-trip' : 'One-way'}
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Pickup Date:</span>
                          <p className="font-medium text-slate-800">{formatDate(reservation.date)}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Pickup Time:</span>
                          <p className="font-medium text-slate-800">{formatTime(reservation.time)}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Passengers:</span>
                          <p className="font-medium text-slate-800">{reservation.passengers}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Luggage:</span>
                          <p className="font-medium text-slate-800">{reservation.luggage} bags</p>
                        </div>
                        {reservation.direction === 'roundtrip' && reservation.returnDate && (
                          <>
                            <div>
                              <span className="text-slate-500">Return Date:</span>
                              <p className="font-medium text-slate-800">{formatDate(reservation.returnDate)}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Return Time:</span>
                              <p className="font-medium text-slate-800">{formatTime(reservation.returnTime!)}</p>
                            </div>
                          </>
                        )}
                      </div>

                      {reservation.notes && (
                        <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                          <span className="text-slate-500 text-sm">Notes:</span>
                          <p className="text-slate-800 text-sm mt-1">{reservation.notes}</p>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                        <span>Booked: {formatDate(reservation.createdAt)}</span>
                        {reservation.status === 'pending' && (
                          <span className="text-blue-600">Awaiting confirmation</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-3xl p-6 sm:p-8 border border-blue-100">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Need Help?</h3>
              <p className="text-slate-600 mb-4">
                Have questions about your reservations or need to make changes? Contact us directly:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`tel:${phoneDigits}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  Call {phoneDisplay}
                </a>
                <a
                  href={`mailto:${emailTo}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors border border-slate-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Email Us
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
