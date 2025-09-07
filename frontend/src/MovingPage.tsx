import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const phoneDisplay = "(309) 799-0907";
const phoneDigits = "+13097990907";
const emailTo = "contact@neobize.com";

export default function MovingPage() {
  useEffect(() => {
    document.title = "Professional Moving Services | NEOBIZE";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              {/* NEOBIZE Logo */}
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-red-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-lg sm:text-xl">N</span>
                </div>
                <span className="font-bold text-lg sm:text-xl text-slate-800">EOBIZE</span>
              </div>
            </Link>
            <div>
              <div className="text-xs text-slate-500 font-medium hidden sm:block">Moving Services</div>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex items-center gap-1 md:hidden">
            <Link to="/dashboard" className="inline-flex items-center gap-0.5 px-1.5 py-1 text-slate-600 hover:text-blue-700 transition-colors">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-xs font-medium">Account</span>
            </Link>
            <Link to="/book" className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium shadow hover:bg-blue-700 transition-colors">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
              Ride
            </Link>
            <Link to="/moving" className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-lg text-xs font-medium shadow hover:bg-green-700 transition-colors">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.5L18.5 12H17v6H7v-6H5.5L12 5.5z"/>
              </svg>
              Moving
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="text-slate-600 hover:text-blue-700 transition-colors">Home</Link>
            <Link to="/faq" className="text-slate-600 hover:text-blue-700 transition-colors">FAQ</Link>
            <a href={`tel:${phoneDigits}`} className="flex items-center gap-2 font-semibold text-slate-700 hover:text-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              {phoneDisplay}
            </a>
            <Link to="/book" className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105">
              Book Ride
            </Link>
            <Link to="/moving" className="px-4 py-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105">
              Book Moving
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-12 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.5L18.5 12H17v6H7v-6H5.5L12 5.5z"/>
              </svg>
              Professional Moving Services
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Professional Moving
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-green-600 mt-2">
                Services
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed mb-8 max-w-3xl mx-auto">
              Reliable and professional moving services for residential and commercial moves. 
              Licensed, insured, and experienced movers to handle your belongings with care.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a
                href={`tel:${phoneDigits}`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                Call {phoneDisplay}
              </a>
              <a
                href={`mailto:${emailTo}?subject=Moving Quote Request`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-orange-800 transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Get Quote
              </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-white rounded-3xl shadow-lg mb-16">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Moving Services</h2>
              <p className="text-lg text-slate-600">Comprehensive moving solutions for all your needs</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center border-2 border-blue-200 hover:border-blue-300 transition-colors">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.5L18.5 12H17v6H7v-6H5.5L12 5.5z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Residential Moving</h3>
                <p className="text-slate-600 mb-4">Complete home moving services</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Local and long-distance moves</li>
                  <li>• Packing and unpacking services</li>
                  <li>• Furniture disassembly/assembly</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center border-2 border-green-200 hover:border-green-300 transition-colors">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Commercial Moving</h3>
                <p className="text-slate-600 mb-4">Office and business relocations</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Office equipment handling</li>
                  <li>• Minimal business disruption</li>
                  <li>• Weekend/after-hours moves</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center border-2 border-purple-200 hover:border-purple-300 transition-colors">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Specialty Moving</h3>
                <p className="text-slate-600 mb-4">Delicate and valuable items</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Piano and instrument moving</li>
                  <li>• Artwork and antiques</li>
                  <li>• Safe and heavy item moving</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose NEOBIZE Moving?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Professional, reliable, and affordable moving services you can trust
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Licensed & Insured',
                description: 'Fully licensed and insured moving company with comprehensive coverage for your peace of mind.',
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                ),
                color: 'text-blue-600 bg-blue-50'
              },
              {
                title: 'Experienced Team',
                description: 'Professional movers with years of experience handling all types of moves with care and efficiency.',
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                ),
                color: 'text-green-600 bg-green-50'
              },
              {
                title: 'Quality Equipment',
                description: 'Modern moving trucks and professional equipment to ensure safe transport of your belongings.',
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                ),
                color: 'text-purple-600 bg-purple-50'
              },
              {
                title: 'Competitive Pricing',
                description: 'Transparent, competitive pricing with no hidden fees. Get a free quote for your move.',
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                  </svg>
                ),
                color: 'text-emerald-600 bg-emerald-50'
              },
              {
                title: 'Flexible Scheduling',
                description: 'Convenient scheduling options including weekends and evenings to fit your timeline.',
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                    <path d="m12.5 7-1 0 0 6 5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                ),
                color: 'text-indigo-600 bg-indigo-50'
              },
              {
                title: 'Customer Satisfaction',
                description: 'Committed to providing excellent customer service and ensuring your complete satisfaction.',
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ),
                color: 'text-yellow-600 bg-yellow-50'
              }
            ].map((feature) => (
              <div key={feature.title} className="group bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 rounded-3xl text-white text-center">
          <div className="max-w-4xl mx-auto px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Schedule Your Move?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Get a free quote today and let our professional movers handle your relocation with care and efficiency.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${phoneDigits}`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-green-600 font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:bg-green-50 transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                Call {phoneDisplay}
              </a>
              <a
                href={`mailto:${emailTo}?subject=Moving Quote Request`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:bg-orange-700 transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Get Free Quote
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 mt-16">
        <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-bold">NEOBIZE LLC</div>
            <p className="text-slate-600 mt-2">Professional Moving Services</p>
            <p className="text-slate-600 mt-1">Licensed & Insured</p>
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
              <li><Link className="hover:text-blue-700" to="/moline-to-chicago-ohare-airport">Moline to O'Hare Shuttle</Link></li>
              <li><Link className="hover:text-blue-700" to="/faq">FAQ</Link></li>
              <li><Link className="hover:text-blue-700" to="/book">Book Ride</Link></li>
              <li><Link className="hover:text-blue-700" to="/moving">Moving Services</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
