/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Phone,
  Clock,
  MapPin,
  Star,
  Check,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Send,
  HeartHandshake,
  ArrowRight,
  CalendarCheck
} from 'lucide-react';

// ============================================================================
// 1. BUSINESS CONFIGURATION & EDITABLE DETAILS
//    (Edit service area, hours, services, and contact details here)
// ============================================================================

export const BUSINESS_CONFIG = {
  name: "At Your Feet Carpet Cleaning & Upholstery",
  shortName: "At Your Feet",
  tagline: "CARPET CLEANING & UPHOLSTERY",
  phoneDisplay: "+1 (931) 808-2878",
  phoneTel: "+19318082878",
  
  // EDIT SERVICE AREA HERE:
  serviceArea: "Middle Tennessee",
  serviceAreaDetails: "Proudly serving homes and businesses throughout Middle Tennessee with responsive, flexible scheduling.",

  // STAR RATING:
  rating: {
    score: "5.0",
    reviewCount: 6,
    text: "5.0 · 6 reviews",
  },

  // EDIT OPERATING HOURS HERE (Central Time):
  // Monday to Saturday: 9 AM to 9 PM, Sunday: Closed
  hours: [
    { day: "Monday", openHour: 9, closeHour: 21, display: "9:00 AM – 9:00 PM", isClosed: false },
    { day: "Tuesday", openHour: 9, closeHour: 21, display: "9:00 AM – 9:00 PM", isClosed: false },
    { day: "Wednesday", openHour: 9, closeHour: 21, display: "9:00 AM – 9:00 PM", isClosed: false },
    { day: "Thursday", openHour: 9, closeHour: 21, display: "9:00 AM – 9:00 PM", isClosed: false },
    { day: "Friday", openHour: 9, closeHour: 21, display: "9:00 AM – 9:00 PM", isClosed: false },
    { day: "Saturday", openHour: 9, closeHour: 21, display: "9:00 AM – 9:00 PM", isClosed: false },
    { day: "Sunday", openHour: 0, closeHour: 0, display: "Closed", isClosed: true },
  ],

  // EDIT SERVICES HERE:
  services: [
    {
      id: "carpet-cleaning",
      title: "Carpet Cleaning",
      description: "Deep cleaning that lifts dirt, dust, and allergens from your carpets.",
      highlights: ["High-heat extraction", "Quick drying times", "Safe for children & pets"],
      badge: "Most Popular",
    },
    {
      id: "upholstery-cleaning",
      title: "Upholstery Cleaning",
      description: "Refresh sofas, chairs, and cushions to look and feel like new.",
      highlights: ["Fabric-safe solutions", "Removes trapped oils", "Delicate hand detailing"],
      badge: "Gentle Care",
    },
    {
      id: "pet-stain-odor",
      title: "Pet Stain & Odor Removal",
      description: "Targeted treatment for stubborn stains and lingering smells.",
      highlights: ["Enzymatic breakdown", "Deep padding penetration", "Neutralizes odors"],
      badge: "Specialty",
    },
    {
      id: "area-rug-cleaning",
      title: "Area Rug Cleaning",
      description: "Gentle, effective cleaning for rugs of all sizes and fiber weaves.",
      highlights: ["Color-safe gentle wash", "Fringe detailing", "Wool & synthetic care"],
      badge: "Precision",
    },
  ],

  // "WHY CHOOSE AT YOUR FEET" VALUE PILLARS:
  whyChoosePoints: [
    {
      title: "5.0 Star Rated",
      desc: "Impeccable track record with 100% 5-star customer reviews.",
      icon: Star,
    },
    {
      title: "Evening Hours Until 9 PM",
      desc: "Convenient Mon–Sat appointments to fit your work and family schedule.",
      icon: Clock,
    },
    {
      title: "Careful With Your Home",
      desc: "Corner guards, clean shoe covers, and respectful, meticulous care.",
      icon: ShieldCheck,
    },
    {
      title: "Free Quotes",
      desc: "Transparent, honest estimates with no hidden fees or pushy upselling.",
      icon: Sparkles,
    },
  ],
};

// ============================================================================
// 2. HELPER FUNCTIONS & TIME LOGIC
// ============================================================================

interface CentralTimeStatus {
  isOpen: boolean;
  statusText: string;
  todayIndex: number; // 0 for Monday, ..., 6 for Sunday
  currentDayName: string;
}

/**
 * Calculates whether the business is currently open in Middle Tennessee (US Central Time).
 * Mon - Sat: 9 AM (09:00) to 9 PM (21:00)
 * Sun: Closed
 */
function getBusinessTimeStatus(): CentralTimeStatus {
  try {
    const now = new Date();
    // Format to US Central Time
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      hour12: false,
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
    });

    const parts = formatter.formatToParts(now);
    const weekday = parts.find((p) => p.type === 'weekday')?.value || 'Monday';
    const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);

    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const todayIndex = Math.max(0, dayOrder.indexOf(weekday));

    const todayConfig = BUSINESS_CONFIG.hours[todayIndex];

    let isOpen = false;
    let statusText = 'Closed now';

    if (!todayConfig.isClosed && hour >= todayConfig.openHour && hour < todayConfig.closeHour) {
      isOpen = true;
      statusText = 'Open now · Closes at 9:00 PM';
    } else {
      isOpen = false;
      if (weekday === 'Sunday') {
        statusText = 'Closed today · Opens Monday at 9:00 AM';
      } else if (hour < 9) {
        statusText = 'Closed now · Opens today at 9:00 AM';
      } else {
        const nextDay = weekday === 'Saturday' ? 'Monday' : 'tomorrow';
        statusText = `Closed now · Opens ${nextDay} at 9:00 AM`;
      }
    }

    return {
      isOpen,
      statusText,
      todayIndex,
      currentDayName: weekday,
    };
  } catch {
    // Fallback if Intl timezone fails
    return {
      isOpen: true,
      statusText: 'Open Mon–Sat 9 AM – 9 PM',
      todayIndex: 0,
      currentDayName: 'Monday',
    };
  }
}

// ============================================================================
// 3. LOGO COMPONENT
// ============================================================================

function Logo({ variant = 'default' }: { variant?: 'default' | 'footer' }) {
  const isFooter = variant === 'footer';
  return (
    <a
      href="#hero"
      className="flex items-center gap-3 group transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8602F] rounded-lg"
      aria-label="At Your Feet Carpet Cleaning & Upholstery - Home"
    >
      {/* Terracotta Logo Icon: Stylized Footprints & Carpet Swirl */}
      <div
        className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
          isFooter
            ? 'bg-[#B8602F] text-white'
            : 'bg-[#FAF6F1] border border-[#D97B4A]/25 text-[#B8602F] group-hover:bg-[#FAF0E6]'
        }`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          aria-hidden="true"
        >
          {/* Stylized carpet roll / curved footprint motif */}
          <path
            d="M6 10C6 7.79086 7.79086 6 10 6H22C24.2091 6 26 7.79086 26 10V11C26 13.2091 24.2091 15 22 15H10C7.79086 15 6 13.2091 6 11V10Z"
            fill="currentColor"
            fillOpacity="0.22"
          />
          <path
            d="M10 19C10 16.7909 11.7909 15 14 15H22C24.2091 15 26 16.7909 26 19V22C26 24.2091 24.2091 26 22 26H14C11.7909 26 10 24.2091 10 22V19Z"
            fill="currentColor"
            fillOpacity="0.88"
          />
          <circle cx="9" cy="22" r="2.5" fill="currentColor" />
          <path
            d="M5 22C5 18 8 16 12 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="21" cy="10" r="1.5" fill="#FAF6F1" />
        </svg>
      </div>

      <div className="flex flex-col text-left">
        <span
          className={`font-heading font-bold text-lg md:text-xl leading-none tracking-tight ${
            isFooter ? 'text-white' : 'text-[#1F3A5F] group-hover:text-[#14263F]'
          }`}
        >
          {BUSINESS_CONFIG.shortName}
        </span>
        <span
          className={`text-[9.5px] md:text-[10px] font-semibold tracking-[0.14em] uppercase mt-1 leading-tight ${
            isFooter ? 'text-[#D97B4A]' : 'text-[#B8602F]'
          }`}
        >
          {BUSINESS_CONFIG.tagline}
        </span>
      </div>
    </a>
  );
}

// ============================================================================
// 4. MAIN APP COMPONENT
// ============================================================================

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeStatus, setTimeStatus] = useState<CentralTimeStatus>(getBusinessTimeStatus);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: BUSINESS_CONFIG.services[0].title,
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update business time status every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStatus(getBusinessTimeStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Form input handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Form submission handler with front-end validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Please enter your full name';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Please enter a contact phone number';
    } else {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        errors.phone = 'Please enter a valid 10-digit phone number';
      }
    }
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    // Simulate brief network submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleSelectServiceFromCard = (serviceTitle: string) => {
    setFormData((prev) => ({ ...prev, service: serviceTitle }));
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1B2430]">
      {/* ================================================================== */}
      {/* SECTION 1: STICKY HEADER (White)                                    */}
      {/* ================================================================== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo on Left */}
          <Logo />

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#1B2430]">
            <a
              href="#services"
              className="text-[#1F3A5F] hover:text-[#B8602F] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#B8602F] hover:after:w-full after:transition-all"
            >
              Services
            </a>
            <a
              href="#about"
              className="text-[#1F3A5F] hover:text-[#B8602F] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#B8602F] hover:after:w-full after:transition-all"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-[#1F3A5F] hover:text-[#B8602F] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#B8602F] hover:after:w-full after:transition-all"
            >
              Contact
            </a>
          </nav>

          {/* Right Action: Call Button + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Terracotta Call Button */}
            <a
              href={`tel:${BUSINESS_CONFIG.phoneTel}`}
              className="inline-flex items-center gap-2 bg-[#B8602F] hover:bg-[#9E4F24] active:bg-[#86401B] text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Call Now:</span>
              <span className="tracking-tight">{BUSINESS_CONFIG.phoneDisplay}</span>
            </a>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1F3A5F] hover:text-[#B8602F] hover:bg-[#FAF6F1] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8602F]"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-5 shadow-lg animate-fadeIn">
            <nav className="flex flex-col gap-2">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-base font-semibold text-[#1F3A5F] hover:bg-[#FAF6F1] hover:text-[#B8602F] transition-colors"
              >
                Services
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-base font-semibold text-[#1F3A5F] hover:bg-[#FAF6F1] hover:text-[#B8602F] transition-colors"
              >
                About &amp; Why Choose Us
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-base font-semibold text-[#1F3A5F] hover:bg-[#FAF6F1] hover:text-[#B8602F] transition-colors"
              >
                Contact &amp; Hours
              </a>

              {/* Service area reminder inside mobile menu */}
              <div className="mt-2 pt-3 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-500 px-3">
                <MapPin className="w-3.5 h-3.5 text-[#B8602F]" />
                <span>Serving all of {BUSINESS_CONFIG.serviceArea}</span>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* ================================================================== */}
        {/* SECTION 2: HERO                                                    */}
        {/* ================================================================== */}
        <section
          id="hero"
          className="relative bg-[#1F3A5F] text-white pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden"
        >
          {/* Background Image with Deep Navy Scrim */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/src/assets/images/hero_clean_carpet_1792875545506.jpg"
              alt="Clean carpet in a cozy living room"
              className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
            />
            {/* Rich gradient overlay for high text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#14263F]/95 via-[#1F3A5F]/90 to-[#14263F]/80" />
            <div className="absolute inset-0 bg-dark-carpet-texture opacity-30" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Trust Badges Bar: Star Rating & Open/Closed Status */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6 text-xs sm:text-sm font-medium">
              {/* Star Rating Badge */}
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-xs">
                <div className="flex text-[#F2B93B]" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#F2B93B]" />
                  ))}
                </div>
                <span className="font-semibold text-white tracking-wide">
                  {BUSINESS_CONFIG.rating.text}
                </span>
              </div>

              {/* Live Open / Closed Indicator */}
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md border shadow-xs ${
                  timeStatus.isOpen
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                    : 'bg-amber-500/20 text-amber-200 border-amber-400/30'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    timeStatus.isOpen ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  aria-hidden="true"
                />
                <span className="font-semibold">{timeStatus.statusText}</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] text-balance">
              Fresh, Clean Floors Right At Your Feet.
            </h1>

            {/* Subheadline */}
            <p className="mt-5 text-base sm:text-xl text-neutral-200 max-w-2xl mx-auto font-normal leading-relaxed text-balance">
              Professional carpet and upholstery cleaning across {BUSINESS_CONFIG.serviceArea}.
              Open Monday to Saturday, 9 AM to 9 PM.
            </p>

            {/* CTA Button Group */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Solid Terracotta Button */}
              <a
                href={`tel:${BUSINESS_CONFIG.phoneTel}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#B8602F] hover:bg-[#9E4F24] active:bg-[#86401B] text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Phone className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>Call {BUSINESS_CONFIG.phoneDisplay}</span>
              </a>

              {/* Outlined White Button */}
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 active:bg-white/20 text-white border-2 border-white/80 hover:border-white font-bold text-base px-8 py-3.5 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Get a Free Quote</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </a>
            </div>

            {/* Subtle trust markers */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#D97B4A]" /> Locally Owned &amp; Operated
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#D97B4A]" /> Safe, Eco-Friendly Detergents
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#D97B4A]" /> Fast Drying Results
              </span>
            </div>
          </div>

          {/* Gentle Curved Divider at the Bottom */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 pointer-events-none">
            <svg
              className="relative block w-full h-8 sm:h-14 lg:h-16 text-[#FAF6F1]"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              fill="currentColor"
            >
              <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 3: SERVICES + ABOUT                                        */}
        {/* ================================================================== */}
        <section id="services" className="bg-[#FAF6F1] py-16 sm:py-24 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold text-[#B8602F] tracking-[0.16em] uppercase">
                Expert Care For Your Home
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F3A5F] mt-2">
                Our Cleaning Services
              </h2>
              <p className="mt-3 text-neutral-600 text-base leading-relaxed">
                Whether you need everyday carpet revitalization or specialized pet odor removal,
                we provide deep cleaning that rejuvenates your living spaces.
              </p>
            </div>

            {/* 4 Attractive Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {BUSINESS_CONFIG.services.map((service, index) => {
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl p-6 border border-neutral-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1"
                  >
                    <div>
                      {/* Icon & Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FAF6F1] border border-[#D97B4A]/25 text-[#B8602F] flex items-center justify-center group-hover:bg-[#B8602F] group-hover:text-white transition-colors duration-200">
                          {index === 0 && (
                            /* Vacuum / Carpet Cleaning Icon */
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M7 21h10M12 21v-8M9 13h6l2 4H7l2-4zM12 13V3m-3 0h6" />
                            </svg>
                          )}
                          {index === 1 && (
                            /* Sofa / Upholstery Icon */
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M4 11a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2M4 11h16M6 18v3M18 18v3" />
                            </svg>
                          )}
                          {index === 2 && (
                            /* Paw Print Icon for Pet Stain & Odor */
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="8" cy="8" r="2" />
                              <circle cx="16" cy="8" r="2" />
                              <circle cx="5" cy="13" r="2" />
                              <circle cx="19" cy="13" r="2" />
                              <path d="M12 11c-2.8 0-5 2.2-5 5 0 2.2 2.2 4 5 4s5-1.8 5-4c0-2.8-2.2-5-5-5z" />
                            </svg>
                          )}
                          {index === 3 && (
                            /* Area Rug / Mat Icon */
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="3" y="6" width="18" height="12" rx="2" />
                              <path d="M6 6v12M18 6v12M9 10h6M9 14h6" />
                            </svg>
                          )}
                        </div>

                        <span className="text-[11px] font-semibold text-[#B8602F] bg-[#FAF0E6] px-2.5 py-0.5 rounded-full border border-[#D97B4A]/20">
                          {service.badge}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-heading text-xl font-bold text-[#1F3A5F]">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Mini checklist */}
                      <ul className="mt-4 space-y-1.5 text-xs text-neutral-600">
                        {service.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#B8602F] shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action button inside card */}
                    <div className="mt-6 pt-4 border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => handleSelectServiceFromCard(service.title)}
                        className="w-full text-xs font-bold text-[#1F3A5F] group-hover:text-[#B8602F] flex items-center justify-between py-1 transition-colors"
                      >
                        <span>Request Free Estimate</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* About / "Why Choose At Your Feet" Strip */}
            <div id="about" className="mt-16 sm:mt-20 scroll-mt-24">
              <div className="bg-white rounded-2xl p-6 sm:p-10 border border-neutral-200/80 shadow-xs">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-bold text-[#B8602F] tracking-[0.16em] uppercase">
                    The At Your Feet Difference
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#1F3A5F] mt-1.5">
                    Why Homeowners Choose At Your Feet
                  </h3>
                  <p className="mt-2 text-neutral-600 text-sm sm:text-base">
                    We treat every home with utmost respect, combining powerful deep-cleaning
                    equipment with friendly, transparent service.
                  </p>
                </div>

                {/* 4 Check-Icon Feature Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                  {BUSINESS_CONFIG.whyChoosePoints.map((point, index) => {
                    const IconComponent = point.icon;
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-start p-4 rounded-xl bg-[#FAF6F1]/70 border border-neutral-200/50 hover:bg-[#FAF6F1] transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#B8602F] text-white flex items-center justify-center shrink-0 mb-3 shadow-xs">
                          <IconComponent className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <h4 className="font-heading font-bold text-base text-[#1F3A5F]">
                          {point.title}
                        </h4>
                        <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                          {point.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Service Area callout banner inside About */}
                <div className="mt-8 p-4 rounded-xl bg-[#FAF6F1] border border-[#D97B4A]/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white text-[#B8602F] flex items-center justify-center shrink-0 shadow-xs">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1F3A5F]">
                        Primary Service Area: {BUSINESS_CONFIG.serviceArea}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {BUSINESS_CONFIG.serviceAreaDetails}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${BUSINESS_CONFIG.phoneTel}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#B8602F] hover:text-[#9E4F24] uppercase tracking-wider shrink-0 underline underline-offset-4"
                  >
                    <span>Check availability near you</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECTION 4: CONTACT & HOURS + FOOTER                                */}
        {/* ================================================================== */}
        <section id="contact" className="py-16 sm:py-24 bg-white relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold text-[#B8602F] tracking-[0.16em] uppercase">
                Get In Touch
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F3A5F] mt-2">
                Ready for Fresh Carpets?
              </h2>
              <p className="mt-3 text-neutral-600 text-base">
                Reach out for a quick, no-obligation estimate or call us directly. We are ready
                to restore freshness to your home.
              </p>
            </div>

            {/* Split 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Contact Form */}
              <div className="lg:col-span-7 bg-[#FAF6F1] rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-6">
                  <CalendarCheck className="w-5 h-5 text-[#B8602F]" />
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#1F3A5F]">
                    Request a Free Quote
                  </h3>
                </div>

                {isSubmitted ? (
                  <div className="bg-white rounded-xl p-6 border border-emerald-300 text-center animate-fadeIn">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h4 className="font-heading text-xl font-bold text-[#1F3A5F]">
                      Quote Request Received!
                    </h4>
                    <p className="mt-2 text-sm text-neutral-600 max-w-md mx-auto">
                      Thank you, <span className="font-semibold">{formData.name}</span>! We have received your request for{' '}
                      <span className="font-semibold">{formData.service}</span>. Our team will contact you at{' '}
                      <span className="font-semibold">{formData.phone}</span> shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: '',
                          phone: '',
                          email: '',
                          service: BUSINESS_CONFIG.services[0].title,
                          message: '',
                        });
                      }}
                      className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#B8602F] hover:underline"
                    >
                      Send another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="form-name"
                        className="block text-xs font-bold uppercase tracking-wider text-[#1F3A5F] mb-1.5"
                      >
                        Your Full Name <span className="text-[#B8602F]">*</span>
                      </label>
                      <input
                        type="text"
                        id="form-name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Sarah Jenkins"
                        className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-[#1B2430] placeholder-neutral-400 focus:outline-none transition-colors ${
                          formErrors.name
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-neutral-300 focus:border-[#B8602F] focus:ring-2 focus:ring-[#D97B4A]/20'
                        }`}
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
                      )}
                    </div>

                    {/* Phone & Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="form-phone"
                          className="block text-xs font-bold uppercase tracking-wider text-[#1F3A5F] mb-1.5"
                        >
                          Phone Number <span className="text-[#B8602F]">*</span>
                        </label>
                        <input
                          type="tel"
                          id="form-phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(931) 000-0000"
                          className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-[#1B2430] placeholder-neutral-400 focus:outline-none transition-colors ${
                            formErrors.phone
                              ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-neutral-300 focus:border-[#B8602F] focus:ring-2 focus:ring-[#D97B4A]/20'
                          }`}
                        />
                        {formErrors.phone && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.phone}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="form-email"
                          className="block text-xs font-bold uppercase tracking-wider text-[#1F3A5F] mb-1.5"
                        >
                          Email Address <span className="text-[#B8602F]">*</span>
                        </label>
                        <input
                          type="email"
                          id="form-email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="sarah@example.com"
                          className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-[#1B2430] placeholder-neutral-400 focus:outline-none transition-colors ${
                            formErrors.email
                              ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-neutral-300 focus:border-[#B8602F] focus:ring-2 focus:ring-[#D97B4A]/20'
                          }`}
                        />
                        {formErrors.email && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Service Dropdown */}
                    <div>
                      <label
                        htmlFor="form-service"
                        className="block text-xs font-bold uppercase tracking-wider text-[#1F3A5F] mb-1.5"
                      >
                        Service Needed
                      </label>
                      <select
                        id="form-service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-[#1B2430] focus:outline-none focus:border-[#B8602F] focus:ring-2 focus:ring-[#D97B4A]/20 transition-colors"
                      >
                        {BUSINESS_CONFIG.services.map((svc) => (
                          <option key={svc.id} value={svc.title}>
                            {svc.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="form-message"
                        className="block text-xs font-bold uppercase tracking-wider text-[#1F3A5F] mb-1.5"
                      >
                        Details or Rooms (Optional)
                      </label>
                      <textarea
                        id="form-message"
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about the number of rooms, stains, or any questions you have..."
                        className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-[#1B2430] placeholder-neutral-400 focus:outline-none focus:border-[#B8602F] focus:ring-2 focus:ring-[#D97B4A]/20 transition-colors resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#B8602F] hover:bg-[#9E4F24] active:bg-[#86401B] disabled:opacity-70 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-md transition-colors cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Submitting Request...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" aria-hidden="true" />
                          <span>Request Free Quote</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-neutral-500">
                      No commitment required. We respect your privacy and will never share your info.
                    </p>
                  </form>
                )}
              </div>

              {/* Right Column: Phone, Service Area & Weekly Hours Table */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Call Direct Card */}
                <div className="bg-[#1F3A5F] text-white rounded-2xl p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#B8602F] text-white flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#D97B4A] font-bold">
                        Need Immediate Service?
                      </span>
                      <h4 className="font-heading text-lg font-bold">Give Us a Call</h4>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-200 mb-4 leading-relaxed">
                    Have questions or need same-week booking? Speak directly with our team.
                  </p>

                  <a
                    href={`tel:${BUSINESS_CONFIG.phoneTel}`}
                    className="inline-flex items-center justify-center gap-2 w-full bg-[#B8602F] hover:bg-[#9E4F24] text-white font-bold text-base py-3 px-4 rounded-xl transition-colors shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{BUSINESS_CONFIG.phoneDisplay}</span>
                  </a>
                </div>

                {/* Service Area Card */}
                <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF6F1] text-[#B8602F] flex items-center justify-center shrink-0 border border-[#D97B4A]/25">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#B8602F] font-bold">
                        Service Coverage
                      </span>
                      <h4 className="font-heading text-base font-bold text-[#1F3A5F]">
                        {BUSINESS_CONFIG.serviceArea}
                      </h4>
                      <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                        We travel to residences and commercial properties across {BUSINESS_CONFIG.serviceArea}. No street address walk-ins.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hours Table with Today Highlighted */}
                <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-5 h-5 text-[#B8602F]" />
                      <h4 className="font-heading text-base font-bold text-[#1F3A5F]">
                        Weekly Operating Hours
                      </h4>
                    </div>

                    {/* Small Status Pill */}
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        timeStatus.isOpen
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                      }`}
                    >
                      {timeStatus.isOpen ? 'Open Now' : 'Closed Now'}
                    </span>
                  </div>

                  {/* Hours Table */}
                  <div className="divide-y divide-neutral-100 text-xs sm:text-sm">
                    {BUSINESS_CONFIG.hours.map((item, index) => {
                      const isToday = index === timeStatus.todayIndex;
                      return (
                        <div
                          key={item.day}
                          className={`flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors ${
                            isToday
                              ? 'bg-[#FAF0E6] text-[#1F3A5F] font-bold shadow-xs border border-[#D97B4A]/30'
                              : 'text-neutral-700 hover:bg-[#FAF6F1]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{item.day}</span>
                            {isToday && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 text-[#B8602F] bg-white rounded-md border border-[#D97B4A]/40">
                                Today
                              </span>
                            )}
                          </div>
                          <span
                            className={
                              item.isClosed
                                ? 'text-neutral-400 font-medium'
                                : isToday
                                ? 'text-[#B8602F]'
                                : 'text-neutral-800'
                            }
                          >
                            {item.display}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-3 text-[11px] text-neutral-500 text-center">
                    All times listed in US Central Time (CT).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================================================================== */}
      {/* FOOTER: Slim Dark Navy                                             */}
      {/* ================================================================== */}
      <footer className="bg-[#14263F] text-white border-t border-white/10 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            {/* Logo in Footer */}
            <Logo variant="footer" />

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-neutral-300">
              <a href="#services" className="hover:text-white transition-colors">
                Services
              </a>
              <span className="text-white/20">·</span>
              <a href="#about" className="hover:text-white transition-colors">
                Why Choose Us
              </a>
              <span className="text-white/20">·</span>
              <a href="#contact" className="hover:text-white transition-colors">
                Contact &amp; Hours
              </a>
            </div>

            {/* Phone link */}
            <a
              href={`tel:${BUSINESS_CONFIG.phoneTel}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#D97B4A] hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{BUSINESS_CONFIG.phoneDisplay}</span>
            </a>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
            <p>
              &copy; {new Date().getFullYear()} {BUSINESS_CONFIG.name}. All rights reserved.
            </p>
            <p className="text-neutral-400">
              Serving {BUSINESS_CONFIG.serviceArea} · Mon–Sat 9:00 AM – 9:00 PM
            </p>
          </div>
        </div>
      </footer>

      {/* ================================================================== */}
      {/* FLOATING MOBILE CALL BUTTON                                        */}
      {/* ================================================================== */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <a
          href={`tel:${BUSINESS_CONFIG.phoneTel}`}
          className="flex items-center gap-2 bg-[#B8602F] hover:bg-[#9E4F24] active:bg-[#86401B] text-white font-bold text-sm px-4 py-3 rounded-full shadow-xl transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={`Call ${BUSINESS_CONFIG.phoneDisplay}`}
        >
          <Phone className="w-4 h-4 fill-white" />
          <span>Call Now</span>
        </a>
      </div>
    </div>
  );
}
