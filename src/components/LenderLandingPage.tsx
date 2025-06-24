import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, DollarSign, Package, TrendingUp, ArrowRight, Star, Users, Calculator, Sparkles, ExternalLink, Check, Mail } from 'lucide-react';

function LenderLandingPage() {
  const [items, setItems] = useState(5);
  const [dailyPrice, setDailyPrice] = useState(25);
  const [rentalDays, setRentalDays] = useState(10);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);

  // Upload form state
  const [itemName, setItemName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const calculateEarnings = () => {
    return items * dailyPrice * rentalDays;
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 3000);
  };

  const handleStartLending = () => {
    setShowWaitlist(true);
  };

  const categories = ['Suit', 'Dress', 'Shirt', 'Pants', 'Jacket', 'Blazer', 'Skirt', 'Blouse', 'Kids', 'Accessories', 'Other'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '2T', '3T', '4T', '5T', '6', '7', '8', '10', '12', '14', '16'];
  const conditions = ['New with tags', 'Like new', 'Excellent', 'Good', 'Fair'];

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-white shadow-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/TCC Cursive.png"
                alt="Travel Clothing Club"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-medium text-slate-900">Travel Clothing Club</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition">How It Works</a>
              <a href="#upload-items" className="text-slate-600 hover:text-slate-900 transition">Upload Items</a>
              <a href="#earnings" className="text-slate-600 hover:text-slate-900 transition">Earnings</a>
              <a href="#support" className="text-slate-600 hover:text-slate-900 transition">Support</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-light text-slate-900 mb-6">
            Turn Your Travel Wardrobe Into Income
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Join thousands of travelers earning money by sharing their high-quality travel clothing with our AI-powered rental platform
          </p>
          <button 
            onClick={handleStartLending}
            className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-semibold text-xl hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform hover:scale-105 mb-12"
          >
            Start Lending Today
          </button>
          
          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-slate-900 mb-2">50K+</div>
              <div className="text-slate-600">Active Lenders</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">$2.3M</div>
              <div className="text-slate-600">Total Earnings</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-yellow-500 mb-2">
                4.9 <Star className="w-8 h-8 fill-current" />
              </div>
              <div className="text-slate-600">Lender Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16 text-slate-900">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 text-center hover:shadow-lg transition group">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">1. Upload Items</h3>
              <p className="text-slate-600">Take photos and list your high-quality travel clothing with our simple upload tool</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center hover:shadow-lg transition group">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">2. Set Your Price</h3>
              <p className="text-slate-600">Choose competitive daily rental rates and earn money from clothes sitting in your closet</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center hover:shadow-lg transition group">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">3. Ship & Earn</h3>
              <p className="text-slate-600">We handle bookings and payments. You ship directly to travelers and get paid instantly</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 text-center hover:shadow-lg transition group">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">4. Scale Up</h3>
              <p className="text-slate-600">Build your reputation, get more bookings, and turn lending into a profitable side business</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Try-On Demo Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light mb-6 text-slate-900">AI Virtual Try-On Technology</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Your clothes get 3x more views and 40% higher rental rates with our AI Virtual Try-On feature
            </p>
          </div>

          {/* Visual Process */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center flex-1 max-w-xs">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Your Item</h3>
              <p className="text-sm text-slate-600">Upload photos of your clothing</p>
            </div>
            
            <ArrowRight className="w-8 h-8 text-slate-400 hidden md:block" />
            <div className="md:hidden w-8 h-8 rotate-90">
              <ArrowRight className="w-8 h-8 text-slate-400" />
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center flex-1 max-w-xs">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">AI Processing</h3>
              <p className="text-sm text-slate-600">AI creates virtual try-on models</p>
            </div>
            
            <ArrowRight className="w-8 h-8 text-slate-400 hidden md:block" />
            <div className="md:hidden w-8 h-8 rotate-90">
              <ArrowRight className="w-8 h-8 text-slate-400" />
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center flex-1 max-w-xs">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Virtual Try-On</h3>
              <p className="text-sm text-slate-600">Travelers see how it looks on them</p>
            </div>
          </div>

          {/* Demo Button */}
          <div className="text-center mb-8">
            <a
              href="https://www.google.com/shopping/tryon?gl=us&hl=en&utm_source=searchlabs&udm=28"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition shadow-lg"
            >
              See Google's Virtual Try-On Demo
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          {/* Waitlist Signup */}
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
                  <Check className="w-6 h-6" />
                  <span className="font-medium">You're on the waitlist!</span>
                </div>
                <p className="text-green-600">We'll notify you when AI try-on is available for lenders.</p>
              </div>
            ) : (
              <form 
                action="https://travelclothingclub.us9.list-manage.com/subscribe/post?u=76ec7acb17d86542fbeae7fae&id=451cee46ca" 
                method="post" 
                target="_blank" 
                noValidate
                style={{
                  background: '#fff',
                  padding: '2rem 1rem',
                  borderRadius: '1.25rem',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}
                onSubmit={handleEmailSubmit}
              >
                <h2 style={{
                  textAlign: 'center',
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#222',
                  marginBottom: '0.2em'
                }}>
                  Be the First to Use In-Site AI Try-On
                </h2>
                <div style={{
                  textAlign: 'center',
                  color: '#666',
                  fontSize: '1rem',
                  marginBottom: '0.4em'
                }}>
                  Get early access to our integrated AI try-on feature and boost your rental rates
                </div>
                <input
                  type="email"
                  name="EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  style={{
                    padding: '1rem',
                    border: '1.5px solid #e7e8ec',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    width: '100%',
                    background: '#f9f9fa'
                  }}
                />
                <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                  <input type="text" name="b_76ec7acb17d86542fbeae7fae_451cee46ca" tabIndex={-1} />
                </div>
                <button
                  type="submit"
                  name="subscribe"
                  style={{
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '2rem',
                    background: '#334155',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#334155'}
                >
                  Join Waitlist
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Upload Interface Section */}
      <section id="upload-items" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16 text-slate-900">Upload Your Travel Clothes</h2>
          
          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-700">Step 1 of 3</span>
              <span className="text-sm text-slate-500">Item Details</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-slate-900 h-2 rounded-full" style={{ width: '33%' }}></div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Upload Zone */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center mb-12 hover:border-slate-400 transition bg-slate-50/50">
              <Upload className="w-16 h-16 text-slate-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">Drag & Drop Your Photos</h3>
              <p className="text-slate-600 mb-6">Upload up to 5 high-quality photos of your item</p>
              <button className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition">
                Choose Files
              </button>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Item Name *</label>
                    <input
                      type="text"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="e.g., Navy Blue Business Suit"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g., Hugo Boss, Zara, etc."
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Size *</label>
                      <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                      >
                        <option value="">Select size</option>
                        {sizes.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Condition *</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select condition</option>
                      {conditions.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Daily Rental Price *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="25.00"
                        className="pl-10 w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      placeholder="Describe the item, its condition, and any special features..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition shadow-lg hover:shadow-xl">
                  Continue to Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Calculator Section */}
      <section id="earnings" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16 text-slate-900">Calculate Your Potential Earnings</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Number of Items: {items}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={items}
                    onChange={(e) => setItems(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>1</span>
                    <span>50</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Average Daily Price: ${dailyPrice}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={dailyPrice}
                    onChange={(e) => setDailyPrice(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>$10</span>
                    <span>$100</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Rental Days per Month: {rentalDays}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={rentalDays}
                    onChange={(e) => setRentalDays(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>1</span>
                    <span>30</span>
                  </div>
                </div>
              </div>

              {/* Earnings Display */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Calculator className="w-8 h-8 text-green-600" />
                  <h3 className="text-2xl font-semibold text-slate-900">Monthly Potential</h3>
                </div>
                <div className="text-5xl font-bold text-green-600 mb-2">
                  ${calculateEarnings().toLocaleString()}
                </div>
                <p className="text-slate-600">
                  Based on {items} items × ${dailyPrice}/day × {rentalDays} rental days
                </p>
              </div>

              <p className="text-sm text-slate-500 text-center mt-6">
                * Earnings are estimates based on your inputs. Actual results may vary depending on demand, seasonality, and item popularity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16 text-slate-900">Success Stories</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  JM
                </div>
                <div>
                  <div className="font-semibold text-slate-900">James M.</div>
                  <div className="text-slate-600 text-sm">Crown & Cuff Menswear</div>
                </div>
              </div>
              <p className="text-slate-700 italic mb-4">
                "I've earned over $3,200 in 6 months just from my business suits that were sitting unused. The AI try-on feature really boosted my bookings!"
              </p>
              <div className="text-2xl font-bold text-green-600">$3,200/6mo</div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  CL
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Chloe L.</div>
                  <div className="text-slate-600 text-sm">Velvet & Vine Boutique</div>
                </div>
              </div>
              <p className="text-slate-700 italic mb-4">
                "Started with 5 designer pieces, now I have 30+ items listed. This platform turned my fashion hobby into a real income stream."
              </p>
              <div className="text-2xl font-bold text-green-600">$1,850/mo</div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  GR
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Gwen R.</div>
                  <div className="text-slate-600 text-sm">The Gilded Thread</div>
                </div>
              </div>
              <p className="text-slate-700 italic mb-4">
                "My formal dresses were only worn once or twice. Now they're earning me consistent income while helping other travelers look great."
              </p>
              <div className="text-2xl font-bold text-green-600">$980/mo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="support" className="bg-slate-900 text-white py-12">
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
              <h4 className="text-lg font-medium mb-4">For Lenders</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Pricing Guide</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Success Stories</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Lender Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Safety Guidelines</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Insurance</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Lender Agreement</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Community Guidelines</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Travel Clothing Club. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light">Join the Lender Waitlist</h2>
                <button
                  onClick={() => setShowWaitlist(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
                    <Check className="w-6 h-6" />
                    <span className="font-medium">Welcome to the waitlist!</span>
                  </div>
                  <p className="text-green-600">We'll notify you as soon as the lender platform launches.</p>
                </div>
              ) : (
                <form 
                  action="https://travelclothingclub.us9.list-manage.com/subscribe/post?u=76ec7acb17d86542fbeae7fae&id=451cee46ca" 
                  method="post" 
                  target="_blank" 
                  noValidate
                  style={{
                    background: '#fff',
                    padding: '2rem 1rem',
                    borderRadius: '1.25rem',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                  }}
                  onSubmit={handleEmailSubmit}
                >
                  <h2 style={{
                    textAlign: 'center',
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: '#222',
                    marginBottom: '0.2em'
                  }}>
                    Be the First to Start Lending
                  </h2>
                  <div style={{
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '1rem',
                    marginBottom: '0.4em'
                  }}>
                    Get early access to our lender platform and start earning from your travel wardrobe
                  </div>
                  <input
                    type="email"
                    name="EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    style={{
                      padding: '1rem',
                      border: '1.5px solid #e7e8ec',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      width: '100%',
                      background: '#f9f9fa'
                    }}
                  />
                  <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                    <input type="text" name="b_76ec7acb17d86542fbeae7fae_451cee46ca" tabIndex={-1} />
                  </div>
                  <button
                    type="submit"
                    name="subscribe"
                    style={{
                      padding: '1rem',
                      border: 'none',
                      borderRadius: '2rem',
                      background: '#334155',
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: '1.05rem',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#334155'}
                  >
                    Join Waitlist
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #334155;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #334155;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}

export default LenderLandingPage;