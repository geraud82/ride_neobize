import React, { useState } from "react";
import { Link } from "react-router-dom";

const phoneDisplay = "(309) 799-0907";
const phoneDigits = "+13097990907";
const emailTo = "contact@neobize.com";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What areas do you serve?",
    answer: "We provide airport shuttle service throughout the Quad Cities area including Moline, Rock Island, Davenport, East Moline, Galesburg, and Peoria to Chicago O'Hare Airport. We also serve custom pickup locations within our service area."
  },
  {
    question: "How much does the shuttle service cost?",
    answer: "Our pricing starts at $150 per person for one-way trips from the Quad Cities to O'Hare Airport. We offer flat-rate pricing with no hidden fees, surge pricing, or surprises. Group discounts and student rates are available. Contact us for exact pricing based on your pickup location and group size."
  },
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking at least 24-48 hours in advance to guarantee availability, especially during peak travel times. However, we can often accommodate same-day bookings if you call us directly. For holiday travel or large groups, booking a week in advance is recommended."
  },
  {
    question: "What is your cancellation policy?",
    answer: "You can cancel your reservation up to 24 hours before your scheduled pickup time for a full refund. Cancellations made less than 24 hours in advance may be subject to a cancellation fee. We understand that travel plans can change, so please contact us as soon as possible if you need to modify or cancel your booking."
  },
  {
    question: "Do you provide return trips from O'Hare?",
    answer: "Yes! We offer both one-way and round-trip service. For return trips, we monitor your flight status and adjust pickup times accordingly for delays or early arrivals. We'll be waiting for you at the designated pickup area when you land."
  },
  {
    question: "How many passengers can you accommodate?",
    answer: "Our premium vehicles can accommodate up to 7 passengers comfortably. We have ample luggage space for all passengers' bags, including large suitcases and carry-on items. For larger groups, we can arrange multiple vehicles."
  },
  {
    question: "Are your drivers licensed and insured?",
    answer: "Absolutely! All our drivers are fully licensed livery professionals with comprehensive commercial insurance coverage. Our drivers undergo background checks and have extensive experience with airport transportation. Your safety and peace of mind are our top priorities."
  },
  {
    question: "What if my flight is delayed or cancelled?",
    answer: "We monitor all flights in real-time and adjust our pickup times accordingly. If your flight is delayed, we'll wait for you at no extra charge. If your flight is cancelled, we'll work with you to reschedule your ride or provide a full refund if you no longer need the service."
  },
  {
    question: "Do you offer service to other airports?",
    answer: "While our primary service is to Chicago O'Hare Airport, we can arrange transportation to other airports in the Chicago area including Midway Airport. We also provide service to Quad City International Airport (MLI). Contact us to discuss your specific destination needs."
  },
  {
    question: "Can I make changes to my reservation?",
    answer: "Yes, you can modify your reservation by calling us directly. We'll do our best to accommodate changes to pickup time, location, or passenger count. Changes made more than 24 hours in advance are typically free, while last-minute changes may incur a small fee."
  },
  {
    question: "Do you provide car seats for children?",
    answer: "For safety reasons, we require that parents provide their own car seats for children who need them. Our vehicles can accommodate various car seat types. Please let us know when booking if you'll be traveling with children who require car seats."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash, all major credit cards (Visa, MasterCard, American Express, Discover), and digital payments. Payment can be made at the time of booking online, over the phone, or in person with your driver. We also offer invoicing for corporate accounts."
  },
  {
    question: "Is gratuity included in the price?",
    answer: "Gratuity is not included in our quoted prices. While tipping is not required, it is appreciated for exceptional service. A standard tip is 15-20% of the fare, but any amount you feel comfortable with is welcome."
  },
  {
    question: "Do you offer corporate or group discounts?",
    answer: "Yes! We offer special rates for corporate accounts, frequent travelers, students, and large groups. We can also provide invoicing and regular billing arrangements for businesses. Contact us to discuss volume discounts and corporate rates."
  },
  {
    question: "What should I do if I can't find my driver?",
    answer: "Your driver will contact you when they arrive at your pickup location. If you can't locate your driver, call our dispatch number immediately. For airport pickups, we'll provide specific instructions on where to meet your driver, typically at the designated ground transportation area."
  },
  {
    question: "Are pets allowed in your vehicles?",
    answer: "We welcome well-behaved pets in our vehicles. Please let us know when booking that you'll be traveling with a pet. We ask that pets be in carriers or on leashes, and owners are responsible for any damage caused by their pets. Service animals are always welcome."
  },
  {
    question: "Do you provide 24/7 service?",
    answer: "Yes, we provide round-the-clock service to accommodate early morning flights and late-night arrivals. Whether your flight departs at 5 AM or arrives at midnight, we'll be there for you. Just let us know your schedule when booking."
  },
  {
    question: "What happens in bad weather?",
    answer: "We operate in all weather conditions and have experience driving in snow, rain, and other challenging conditions. Our vehicles are well-maintained and equipped for safe travel. In extreme weather situations, we may need to adjust pickup times for safety, and we'll communicate any changes with you promptly."
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 text-slate-900">
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
              <div className="text-xs text-slate-500 font-medium hidden sm:block">Frequently Asked Questions</div>
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
            <a href={`tel:${phoneDigits}`} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium shadow hover:bg-blue-700 transition-colors">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              Call
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="text-slate-600 hover:text-blue-700 transition-colors">Home</Link>
            <Link to="/moline-to-chicago-ohare-airport" className="text-slate-600 hover:text-blue-700 transition-colors">Moline to O'Hare</Link>
            <a href={`tel:${phoneDigits}`} className="flex items-center gap-2 font-semibold text-slate-700 hover:text-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              {phoneDisplay}
            </a>
            <Link to="/book" className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105">
              Book Now
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
            </svg>
            Frequently Asked Questions
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Questions & Answers
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed mb-8 max-w-3xl mx-auto">
            Find answers to common questions about our Quad Cities to Chicago O'Hare airport shuttle service. 
            Can't find what you're looking for? Give us a call!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${phoneDigits}`}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              Call {phoneDisplay}
            </a>
            <Link
              to="/book"
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-orange-800 transition-all transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Book Now
            </Link>
          </div>
        </section>

        {/* FAQ Items */}
        <section className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-slate-800 pr-4">
                  {item.question}
                </h3>
                <div className={`flex-shrink-0 transform transition-transform duration-200 ${
                  openItems.includes(index) ? 'rotate-180' : ''
                }`}>
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-6">
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-slate-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Contact Section */}
        <section className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl text-white text-center p-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-blue-100 mb-6">
              Our friendly team is here to help! Contact us directly for personalized assistance with your airport transportation needs.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${phoneDigits}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                Call Us
              </a>
              <a
                href={`mailto:${emailTo}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Email Us
              </a>
              <a
                href={`https://wa.me/${phoneDigits.replace(/[^\d]/g, "")}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-700 transition-all transform hover:scale-105"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
              Our Services
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li>• Quad Cities to Chicago O'Hare Airport</li>
              <li>• Door-to-door pickup service</li>
              <li>• Premium 7-passenger vehicles</li>
              <li>• Professional licensed drivers</li>
              <li>• Flight monitoring & tracking</li>
              <li>• 24/7 availability</li>
            </ul>
            <Link
              to="/moline-to-ohare-shuttle"
              className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Learn more about our shuttle service
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Ready to Book?
            </h3>
            <p className="text-slate-600 mb-4">
              Booking your airport shuttle is quick and easy. Choose from multiple convenient options:
            </p>
            <ul className="space-y-2 text-slate-600 mb-4">
              <li>• Online booking system</li>
              <li>• Call us directly</li>
              <li>• WhatsApp messaging</li>
              <li>• Email reservations</li>
            </ul>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Book Your Ride
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 mt-16">
        <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-bold">NEOBIZE LLC</div>
            <p className="text-slate-600 mt-2">Professional Airport Shuttle Service</p>
            <p className="text-slate-600 mt-1">Quad Cities to Chicago O'Hare</p>
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
              <li><Link className="hover:text-blue-700" to="/">Home</Link></li>
              <li><Link className="hover:text-blue-700" to="/moline-to-chicago-ohare-airport">Moline to O'Hare</Link></li>
              <li><Link className="hover:text-blue-700" to="/book">Book Now</Link></li>
              <li><Link className="hover:text-blue-700" to="/dashboard">My Account</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
