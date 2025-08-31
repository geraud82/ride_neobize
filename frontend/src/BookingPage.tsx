import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiContext } from "./App";

const cities = [
  "Moline",
  "Rock Island",
  "Davenport",
  "East Moline",
  "Galesburg",
  "Peoria",
];

const destinations = [
  { label: "Chicago O'Hare International Airport (ORD)", value: "O'Hare" },
  { label: "Quad Cities Area (Return)", value: "Quad Cities" },
];

export default function BookingPage() {
  const navigate = useNavigate();
  const apiUrl = useContext(ApiContext);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    fromCity: "Moline",
    to: "O'Hare",
    pickupAddress: "",
    dropoffAddress: "",
    direction: "oneway", // oneway | roundtrip
    date: "",
    time: "",
    passengers: 1,
    luggage: 0,
    promo: "",
    notes: "",
    returnDate: "",
    returnTime: "",
  });
  const [agree, setAgree] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | 'warning' | null;
    message: string;
  }>({ type: null, message: '' });

  const isRoundTrip = form.direction === "roundtrip";

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!/^[0-9+()\-\s]{7,}$/.test(form.phone)) e.phone = "Valid phone required";
    if (!form.pickupAddress.trim()) e.pickupAddress = "Pickup address required";
    if (!form.dropoffAddress.trim()) e.dropoffAddress = "Drop-off address required";
    if (!form.date) e.date = "Select date";
    if (!form.time) e.time = "Select time";
    if (isRoundTrip) {
      if (!form.returnDate) e.returnDate = "Select return date";
      if (!form.returnTime) e.returnTime = "Select return time";
    }
    if (form.passengers < 1 || form.passengers > 7)
      e.passengers = "1–7 passengers";
    if (form.luggage < 0 || form.luggage > 10)
      e.luggage = "0–10 bags";
    if (!agree) e.agree = "Please accept the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch(`${apiUrl}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage
        const userData = {
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          reservationId: data.reservationId
        };
        localStorage.setItem('neobize_user', JSON.stringify(userData));
        
        // Show success message briefly
        setSubmitStatus({
          type: 'success',
          message: 'Reservation submitted successfully! Redirecting to your dashboard...'
        });
        
        // Reset form
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          fromCity: "Moline",
          to: "O'Hare",
          pickupAddress: "",
          dropoffAddress: "",
          direction: "oneway",
          date: "",
          time: "",
          passengers: 1,
          luggage: 0,
          promo: "",
          notes: "",
          returnDate: "",
          returnTime: "",
        });
        setAgree(true);
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Failed to submit reservation request'
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="text-xs text-slate-500 font-medium hidden sm:block ml-2">Airport Shuttle Service</div>
          </Link>
          
          {/* Back Button */}
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
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            Book Your Airport Shuttle
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Complete the form below to request your reservation. We'll confirm availability and provide pricing within 24 hours.
          </p>
        </div>

        {/* Reservation Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Reservation Details</h2>
                <p className="text-sm text-slate-500">Fill out all required fields below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First name *</label>
                <input 
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  value={form.firstName} 
                  onChange={(e)=>update("firstName", e.target.value)} 
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last name *</label>
                <input 
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  value={form.lastName} 
                  onChange={(e)=>update("lastName", e.target.value)} 
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  value={form.email} 
                  onChange={(e)=>update("email", e.target.value)} 
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                <input 
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  value={form.phone} 
                  onChange={(e)=>update("phone", e.target.value)} 
                  placeholder="(309) 555-0123"
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">From (City) *</label>
                <select className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" value={form.fromCity} onChange={(e)=>update("fromCity", e.target.value as any)}>
                  {cities.map((c)=> <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">To (Destination) *</label>
                <select className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" value={form.to} onChange={(e)=>update("to", e.target.value as any)}>
                  {destinations.map((d)=> <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pickup address *</label>
                <input 
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  value={form.pickupAddress} 
                  onChange={(e)=>update("pickupAddress", e.target.value)} 
                  placeholder="123 Main St, Moline, IL 61265"
                />
                {errors.pickupAddress && <p className="text-xs text-red-600 mt-1">{errors.pickupAddress}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Drop-off address *</label>
                <input 
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  value={form.dropoffAddress} 
                  onChange={(e)=>update("dropoffAddress", e.target.value)} 
                  placeholder="Terminal 1, O'Hare Airport, Chicago, IL"
                />
                {errors.dropoffAddress && <p className="text-xs text-red-600 mt-1">{errors.dropoffAddress}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-3">Trip Type *</label>
                <div className="flex gap-4">
                  <label className={`flex-1 cursor-pointer rounded-xl border-2 px-4 py-3 text-center transition-all ${form.direction==='oneway' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300 hover:border-slate-400'}`}>
                    <input type="radio" name="direction" className="sr-only" checked={form.direction==='oneway'} onChange={()=>update('direction','oneway')} />
                    <div className="font-medium">One‑way</div>
                    <div className="text-xs text-slate-500">Single trip</div>
                  </label>
                  <label className={`flex-1 cursor-pointer rounded-xl border-2 px-4 py-3 text-center transition-all ${form.direction==='roundtrip' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300 hover:border-slate-400'}`}>
                    <input type="radio" name="direction" className="sr-only" checked={form.direction==='roundtrip'} onChange={()=>update('direction','roundtrip')} />
                    <div className="font-medium">Round‑trip</div>
                    <div className="text-xs text-slate-500">Return included</div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pickup date *</label>
                <input 
                  type="date" 
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  value={form.date} 
                  onChange={(e)=>update("date", e.target.value)} 
                />
                {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pickup time *</label>
                <input 
                  type="time" 
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  value={form.time} 
                  onChange={(e)=>update("time", e.target.value)} 
                />
                {errors.time && <p className="text-xs text-red-600 mt-1">{errors.time}</p>}
              </div>

              {isRoundTrip && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Return date *</label>
                    <input 
                      type="date" 
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                      value={form.returnDate} 
                      onChange={(e)=>update("returnDate", e.target.value)} 
                    />
                    {errors.returnDate && <p className="text-xs text-red-600 mt-1">{errors.returnDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Return time *</label>
                    <input 
                      type="time" 
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                      value={form.returnTime} 
                      onChange={(e)=>update("returnTime", e.target.value)} 
                    />
                    {errors.returnTime && <p className="text-xs text-red-600 mt-1">{errors.returnTime}</p>}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Passengers *</label>
                <input 
                  type="number" 
                  min={1} 
                  max={7} 
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  value={form.passengers} 
                  onChange={(e)=>update("passengers", Number(e.target.value))} 
                />
                {errors.passengers && <p className="text-xs text-red-600 mt-1">{errors.passengers}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Luggage (bags)</label>
                <input 
                  type="number" 
                  min={0} 
                  max={10} 
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  value={form.luggage} 
                  onChange={(e)=>update("luggage", Number(e.target.value))} 
                />
                {errors.luggage && <p className="text-xs text-red-600 mt-1">{errors.luggage}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Promo code (optional)</label>
                <input 
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  value={form.promo} 
                  onChange={(e)=>update("promo", e.target.value)} 
                  placeholder="Enter promo code if you have one"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes (flight #, terminal, special requests)</label>
                <textarea 
                  rows={4} 
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none" 
                  value={form.notes} 
                  onChange={(e)=>update("notes", e.target.value)} 
                  placeholder="Flight number, terminal, special requests, etc."
                />
              </div>

              <div className="sm:col-span-2 flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <input 
                  id="agree" 
                  type="checkbox" 
                  className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" 
                  checked={agree} 
                  onChange={(e)=>setAgree(e.target.checked)} 
                />
                <label htmlFor="agree" className="text-sm text-slate-600 leading-relaxed">
                  I understand this is a reservation request. NEOBIZE will confirm availability and provide pricing by phone or email within 24 hours.
                </label>
              </div>
              {errors.agree && <p className="text-xs text-red-600 -mt-2 sm:col-span-2">{errors.agree}</p>}

              <div className="sm:col-span-2 flex flex-col items-center gap-4 pt-4">
                {/* Status Message */}
                {submitStatus.type && (
                  <div className={`w-full p-4 rounded-xl border ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : submitStatus.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    <div className="flex items-center gap-2">
                      {submitStatus.type === 'success' && (
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      )}
                      {submitStatus.type === 'warning' && (
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                      )}
                      {submitStatus.type === 'error' && (
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                      )}
                      <p className="text-sm font-medium">{submitStatus.message}</p>
                    </div>
                  </div>
                )}

                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium mb-2">
                    🚀 Your reservation will be sent to both email and WhatsApp automatically via our backend
                  </p>
                  <p className="text-xs text-blue-600">
                    Email: contact@neobize.com • WhatsApp: (309) 799-0907
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`px-8 py-4 font-semibold rounded-2xl shadow-lg transition-all text-lg ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Reservation Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
