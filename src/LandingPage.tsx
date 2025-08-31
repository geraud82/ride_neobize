import React from "react";
import { Link } from "react-router-dom";

const phoneDisplay = "(309) 799-0907";
const phoneDigits = "+13097990907";
const emailTo = "contact@neobize.com";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 text-slate-900">
      {/* Enhanced Mobile-Friendly Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* NEOBIZE Logo - Red square with white N + EOBIZE text */}
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-red-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-lg sm:text-xl">N</span>
                </div>
                <span className="font-bold text-lg sm:text-xl text-slate-800">EOBIZE</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium hidden sm:block">Airport Shuttle Service</div>
            </div>
          </div>
          
          {/* Mobile Contact Button */}
          <div className="flex items-center gap-2 md:hidden">
            <a href={`tel:${phoneDigits}`} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              Call
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href={`tel:${phoneDigits}`} className="flex items-center gap-2 font-semibold text-slate-700 hover:text-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              {phoneDisplay}
            </a>
            <a href={`mailto:${emailTo}`} className="flex items-center gap-2 text-slate-600 hover:text-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              {emailTo}
            </a>
            <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              My Account
            </Link>
            <a href="https://www.neobize.com" target="_blank" className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105">
              Visit Website
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero section */}
        <section className="grid lg:grid-cols-2 gap-8 lg:gap-12 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col justify-center space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="space-y-4 lg:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Professional Airport Transportation
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Quad Cities ↔ Chicago O'Hare
                <span className="block text-xl sm:text-2xl md:text-3xl text-blue-600 mt-2">Airport Shuttle Service</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed">
                Reliable, comfortable rides in premium 7-passenger vehicles. Licensed & insured professional drivers with flat-rate pricing.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href={`tel:${phoneDigits}`}
                className="inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                Call {phoneDisplay}
              </a>
              <a
                href={`https://wa.me/${phoneDigits.replace(/[^\d]/g, "")}`}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </a>
              <Link
                to="/book"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-orange-800 transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Book Now
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-amber-600">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="font-medium">5.0 Rating</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>On-Time Guarantee</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50  to-red-100">
              <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center relative overflow-hidden p-6 sm:p-8 lg:p-10">
                {/* NEOBIZE Vehicle Image */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src="/carhero.png" 
                    alt="NEOBIZE Airport Shuttle - Professional Vehicle" 
                    className="w-full h-full object-contain object-center rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-500"
                    style={{
                      filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))',
                      maxHeight: '100%',
                      maxWidth: '100%'
                    }}
                    onError={(e) => {
                      // Fallback to a placeholder if image doesn't load
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                      }
                    }}
                  />
                  
                  {/* Fallback content if image doesn't load */}
                  <div className="hidden w-full h-full flex-col items-center justify-center text-slate-600 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl">
                    <div className="mb-4">
                      <svg className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                        <span>Quad Cities</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span>O'Hare</span>
                      </div>
                      <div className="text-xs opacity-75">Premium Airport Transportation</div>
                    </div>
                  </div>
                </div>
                
                {/* Route Overlay */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-lg">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base font-semibold text-slate-800">
                      <span>Quad Cities</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span>Chicago O'Hare</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 text-center mt-1">Professional Airport Transportation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Feature cards */}
        <section className="grid md:grid-cols-3 gap-8 pb-16">
          {[
            {
              t:'Flat Rates', 
              d:'Transparent pricing with no hidden fees. Get your quote upfront and know exactly what you\'ll pay.',
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                </svg>
              ),
              color: 'text-green-600 bg-green-50'
            },
            {
              t:'On‑Time, Every Time', 
              d:'We monitor flight schedules and traffic conditions to ensure punctual pickups and arrivals.',
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  <path d="m12.5 7-1 0 0 6 5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
              ),
              color: 'text-blue-600 bg-blue-50'
            },
            {
              t:'Licensed & Insured', 
              d:'Fully licensed livery service with comprehensive insurance coverage for your peace of mind.',
              icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
                </svg>
              ),
              color: 'text-purple-600 bg-purple-50'
            }
          ].map((f)=> (
            <div key={f.t} className="group bg-white rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl p-8 transition-all duration-300 hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-3">{f.t}</h3>
              <p className="text-slate-600 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-bold">NEOBIZE LLC</div>
            <p className="text-slate-600 mt-2">Serving Moline • Rock Island • Davenport • East Moline • Galesburg • Peoria</p>
          </div>
          <div>
            <div className="font-semibold">Contact</div>
            <ul className="mt-2 space-y-1">
              <li><a className="hover:text-blue-700" href={`tel:${phoneDigits}`}>{phoneDisplay}</a></li>
              <li><a className="hover:text-blue-700" href={`mailto:${emailTo}`}>{emailTo}</a></li>
              <li><a className="hover:text-blue-700" href="https://www.neobize.com" target="_blank">www.neobize.com</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Quick Links</div>
            <ul className="mt-2 space-y-1">
              <li>Airport Shuttle — Quad Cities ↔ O'Hare</li>
              <li>Private Group Rides (up to 7 passengers)</li>
              <li>Student & Family Discounts</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
