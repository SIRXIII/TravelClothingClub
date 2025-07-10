import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, ShoppingBag, DollarSign, Clock, MapPin, Users, Check, Send, Upload, Ruler, UserCheck, Calendar, Search, Star, Heart, Shield, Leaf, Headphones, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import RentNowFlow from './RentNowFlow';

function HomePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showRentFlow, setShowRentFlow] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  // Search form state
  const [searchDates, setSearchDates] = useState({ start: '', end: '' });
  const [searchDestination, setSearchDestination] = useState('');
  const [searchSize, setSearchSize] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 3000);
  };

  const handleRentNowClick = () => {
    setShowRentFlow(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Navigate to results page with search parameters
    navigate('/search-results', {
      state: {
        dates: searchDates,
        destination: searchDestination,
        size: searchSize
      }
    });
  };

  const sizeOptions = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 
    '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50',
    '2T', '3T', '4T', '5T', '6', '7', '8', '10', '12', '14', '16'
  ];

  const testimonials = [
    {
      name: "Ava B.",
      review: "Travel Clothing Club saved me $80 in luggage fees! The clothes were spotless and stylish.",
      city: "Los Angeles",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      name: "Nate D.",
      review: "Business trip packing is now stress-free. Loved the quality and convenience.",
      city: "New York",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      name: "Sara M.",
      review: "Picked up at my hotel, fit perfectly. Will use for every trip!",
      city: "Chicago",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
    }
  ];

  const faqs = [
    {
      question: "What if I damage or lose an item?",
      answer: "We understand accidents happen during travel. Minor wear is expected and covered. For damages or lost items, we'll work with you on a fair replacement cost that's typically much less than retail price."
    },
    {
      question: "Can I buy what I rent?",
      answer: "Absolutely! If you fall in love with any item, you can purchase it at a discounted price. Just let us know during your rental period and we'll arrange the purchase."
    },
    {
      question: "How far in advance should I book?",
      answer: "We recommend booking at least 7 days in advance to ensure availability and proper delivery timing. For popular destinations or peak travel seasons, 2-3 weeks ahead is ideal."
    },
    {
      question: "Are clothes sanitized?",
      answer: "Yes, every item goes through our professional cleaning and sanitization process. We use eco-friendly, hypoallergenic detergents and follow strict hygiene protocols to ensure freshness and safety."
    },
    {
      question: "What if my hotel loses the package?",
      answer: "We work with trusted delivery partners and provide tracking for all shipments. If there's ever an issue with delivery, our 24/7 concierge team will immediately arrange a replacement or alternative solution."
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Split Layout with Background Images */}
      <header className="relative min-h-screen">
        {/* Split Background Images */}
        <div className="absolute inset-0 grid grid-cols-2">
          {/* Left Side - Airplane */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80"
              alt="Airplane"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-slate-900/20"></div>
          </div>
          
          {/* Right Side - Business traveler with luggage in hotel room */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"
              alt="Business traveler in hotel room with luggage"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-white/80 to-white/40"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
          {/* Navigation */}
          <nav className="flex items-center justify-between py-8">
            <div className="flex items-center gap-4">
              <img 
                src="/TCC Cursive.png"
                alt="Travel Clothing Club"
                className="w-20 h-20 md:w-24 md:h-24 object-contain"
              />
              <span className="text-2xl md:text-3xl font-light text-white drop-shadow-lg">Travel Clothing Club</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/lender-portal"
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition flex items-center gap-2 border border-white/20"
              >
                <UserCheck className="w-5 h-5" />
                Partner Portal
              </Link>
            </div>
          </nav>

          {/* Virtual Try-On Demo Banner - Positioned above hero content */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">See Virtual Try-On in Action</span>
                </div>
                <Link 
                  to="/virtual-try-on-demo"
                  className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-white/95 transition text-sm"
                >
                  Try Demo
                </Link>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="flex-1 flex items-center">
            <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
              {/* Left Side - Text Content */}
              <div className="space-y-8 text-white">
                <div className="space-y-6">
                  <p className="text-white/90 font-medium tracking-wide uppercase text-lg">Travel light. Stress less.</p>
                  <h1 className="text-5xl lg:text-7xl font-light leading-tight drop-shadow-lg">
                    Clothing Delivered Straight to Your Stay
                  </h1>
                  <p className="text-2xl lg:text-3xl text-white/90 font-light leading-relaxed drop-shadow-md">
                    Rent stylish, pre-washed outfits at your destination—without lifting a suitcase.
                  </p>
                </div>
                
                <button
                  onClick={handleRentNowClick}
                  className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-semibold text-xl hover:bg-white/95 transition shadow-2xl hover:shadow-3xl transform hover:scale-105"
                >
                  Get Started →
                </button>
              </div>

              {/* Right Side - Visual Elements */}
              <div className="relative lg:block hidden">
                <div className="absolute -top-8 -right-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-semibold">Live Delivery Tracking</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-8 -left-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-4">
                    <ShoppingBag className="w-6 h-6 text-white" />
                    <div className="text-white">
                      <div className="font-semibold text-white">3 Outfits Ready</div>
                      <div className="text-sm text-white/90">Delivered to Room 1205</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="text-center pb-8">
            <div className="inline-flex flex-col items-center text-white/80">
              <span className="text-sm font-medium mb-2">Discover More</span>
              <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Platform Snapshot */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-medium mb-4">Easy Booking</h3>
              <p className="text-slate-600 text-lg">Book your outfits in minutes with our simple trip planner</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-medium mb-4">Delivery to Hotels & Rentals</h3>
              <p className="text-slate-600 text-lg">We deliver directly to your accommodation worldwide</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-medium mb-4">24/7 Concierge Support</h3>
              <p className="text-slate-600 text-lg">Our team is always here to help with your travel needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16 text-slate-900">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&q=80"
                alt="Choose your trip"
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">1</div>
                <h3 className="text-2xl font-medium mb-4">Choose Your Trip</h3>
                <p className="text-slate-600">Tell us your destination, dates, and style preferences</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80"
                alt="Pick your style"
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">2</div>
                <h3 className="text-2xl font-medium mb-4">Pick Your Style</h3>
                <p className="text-slate-600">Select from curated bundles: Work Trip, Family Vacation, or Custom</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"
                alt="Get it delivered"
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">3</div>
                <h3 className="text-2xl font-medium mb-4">Get It Delivered</h3>
                <p className="text-slate-600">Find your outfits waiting at your hotel or rental</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Preview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16 text-slate-900">Shop by Collection</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group cursor-pointer" onClick={handleRentNowClick}>
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80"
                  alt="Men's collection"
                  className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-medium text-white mb-2">Men's Collection</h3>
                  <p className="text-white/90 flex items-center gap-2">
                    Explore Men's →
                  </p>
                </div>
              </div>
            </div>
            <div className="group cursor-pointer" onClick={handleRentNowClick}>
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80"
                  alt="Women's collection"
                  className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-medium text-white mb-2">Women's Collection</h3>
                  <p className="text-white/90 flex items-center gap-2">
                    Explore Women's →
                  </p>
                </div>
              </div>
            </div>
            <div className="group cursor-pointer" onClick={handleRentNowClick}>
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80"
                  alt="Kids collection"
                  className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-medium text-white mb-2">Kids' Collection</h3>
                  <p className="text-white/90 flex items-center gap-2">
                    Explore Kids' →
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-4 text-slate-900">Transparent Pricing</h2>
          <p className="text-xl text-slate-600 text-center mb-16">Choose the perfect package for your trip</p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Basic Tier */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-slate-200 transition">
              <h3 className="text-2xl font-medium mb-4">Basic</h3>
              <div className="text-4xl font-light mb-6">$49<span className="text-lg text-slate-600">/trip</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>2 outfits</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Casual wear</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Standard fabrics</span>
                </li>
              </ul>
              <button 
                onClick={handleRentNowClick}
                className="w-full bg-slate-100 text-slate-900 py-3 rounded-lg font-medium hover:bg-slate-200 transition"
              >
                Select Basic
              </button>
            </div>

            {/* Upscale Tier */}
            <div className="bg-slate-900 text-white rounded-2xl shadow-lg p-8 transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-slate-700 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-2xl font-medium mb-4">Upscale</h3>
              <div className="text-4xl font-light mb-6">$89<span className="text-lg text-slate-300">/trip</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>3 outfits</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Business + casual mix</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Premium materials</span>
                </li>
              </ul>
              <button 
                onClick={handleRentNowClick}
                className="w-full bg-white text-slate-900 py-3 rounded-lg font-medium hover:bg-slate-100 transition"
              >
                Select Upscale
              </button>
            </div>

            {/* Vacay Mode Tier */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-slate-200 transition">
              <h3 className="text-2xl font-medium mb-4">Vacay Mode</h3>
              <div className="text-4xl font-light mb-6">$119<span className="text-lg text-slate-600">/trip</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>4 outfits</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Resortwear + accessories</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Priority delivery</span>
                </li>
              </ul>
              <button 
                onClick={handleRentNowClick}
                className="w-full bg-slate-100 text-slate-900 py-3 rounded-lg font-medium hover:bg-slate-200 transition"
              >
                Select Vacay Mode
              </button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-6 font-medium">Features</th>
                    <th className="text-center p-6 font-medium">Basic</th>
                    <th className="text-center p-6 font-medium">Upscale</th>
                    <th className="text-center p-6 font-medium">Vacay Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-6 font-medium">Number of Outfits</td>
                    <td className="text-center p-6">2</td>
                    <td className="text-center p-6">3</td>
                    <td className="text-center p-6">4</td>
                  </tr>
                  <tr>
                    <td className="p-6 font-medium">Style Types</td>
                    <td className="text-center p-6">Casual</td>
                    <td className="text-center p-6">Business + Casual</td>
                    <td className="text-center p-6">Resort + Accessories</td>
                  </tr>
                  <tr>
                    <td className="p-6 font-medium">Fabric Quality</td>
                    <td className="text-center p-6">Standard</td>
                    <td className="text-center p-6">Premium</td>
                    <td className="text-center p-6">Luxury</td>
                  </tr>
                  <tr>
                    <td className="p-6 font-medium">Delivery Priority</td>
                    <td className="text-center p-6">Standard</td>
                    <td className="text-center p-6">Standard</td>
                    <td className="text-center p-6">Priority</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Moved after pricing */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16 text-slate-900">Why Travelers Love Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plane className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-medium mb-4">Hands-Free Travel</h3>
              <p className="text-slate-600 text-lg">No luggage. Just show up and look great.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-medium mb-4">Tailored to You</h3>
              <p className="text-slate-600 text-lg">Outfits matched to your trip & preferences.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-medium mb-4">Eco-Friendly</h3>
              <p className="text-slate-600 text-lg">Reduce waste. Reuse in style.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16 text-slate-900">What Travelers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-medium text-slate-900">{testimonial.name}</div>
                    <div className="text-slate-600 text-sm">{testimonial.city}</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 italic">"{testimonial.review}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page Email Sign-up */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-light text-white mb-4">Get Exclusive Access</h3>
          <p className="text-xl text-slate-300 mb-8">Early subscribers get first access before we go live—be the first in the Traveler's Club</p>
          
          {submitted ? (
            <div className="bg-green-500/20 border border-green-400 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                <Check className="w-6 h-6" />
                <span className="font-medium">Welcome to the club!</span>
              </div>
              <p className="text-green-300">We'll notify you of exclusive offers and new collections.</p>
            </div>
          ) : (
            <form 
              action="https://travelclothingclub.us9.list-manage.com/subscribe/post?u=76ec7acb17d86542fbeae7fae&id=451cee46ca&f_id=00071ae1f0" 
              method="post" 
              target="_blank" 
              noValidate 
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input 
                type="email" 
                name="EMAIL" 
                placeholder="Enter your email address" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/20 outline-none text-slate-900"
              />
              <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                <input type="text" name="b_76ec7acb17d86542fbeae7fae_451cee46ca" tabIndex={-1} />
              </div>
              <button 
                type="submit" 
                name="subscribe" 
                className="bg-white text-slate-900 px-8 py-3 rounded-lg font-medium hover:bg-slate-100 transition whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16 text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition rounded-xl"
                >
                  <span className="font-medium text-slate-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Email Sign-up */}
      <section className="py-16 bg-white">
        <div className="max-w-md mx-auto px-4 text-center">
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
                <Check className="w-6 h-6" />
                <span className="font-medium">Thank you for joining our exclusive clublist!</span>
              </div>
              <p className="text-green-600">We'll notify you as soon as we launch.</p>
            </div>
          ) : (
            <form 
              action="https://travelclothingclub.us9.list-manage.com/subscribe/post?u=76ec7acb17d86542fbeae7fae&id=451cee46ca&f_id=00071ae1f0" 
              method="post" 
              target="_blank" 
              noValidate 
              className="space-y-4"
            >
              <div>
                <input 
                  type="email" 
                  name="EMAIL" 
                  placeholder="Enter your email address" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                />
              </div>
              <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                <input type="text" name="b_76ec7acb17d86542fbeae7fae_451cee46ca" tabIndex={-1} />
              </div>
              <button 
                type="submit" 
                name="subscribe" 
                className="w-full bg-slate-900 text-white px-6 py-3 text-lg rounded-lg font-medium hover:bg-slate-800 transition"
              >
                Join the Exclusive Clublist
              </button>
              <p className="text-sm text-slate-600">
                Join 100+ travelers simplifying their trips.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/TCC Cursive.png"
                  alt="Travel Clothing Club"
                  className="w-8 h-8 object-contain"
                />
                <h3 className="text-lg font-medium">Travel Clothing Club</h3>
              </div>
              <p className="text-slate-400">Connecting travelers with local clothing lenders worldwide.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Collections</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition">Men's Collection</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Women's Collection</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Kids' Collection</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition">FAQs</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Contact</a></li>
                <li><Link to="/lender-portal" className="text-slate-400 hover:text-white transition">Become a Partner</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://www.instagram.com/travelclothingclub/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">Instagram</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">TikTok</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Travel Clothing Club. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Rent Now Flow Modal */}
      {showRentFlow && (
        <RentNowFlow 
          onClose={() => setShowRentFlow(false)}
        />
      )}
    </div>
  );
}

export default HomePage;