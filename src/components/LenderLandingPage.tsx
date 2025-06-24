import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, DollarSign, Package, TrendingUp, ArrowRight, Star, Users, Calculator, Sparkles, ExternalLink, Check, Mail } from 'lucide-react';

function LenderLandingPage() {
  const [items, setItems] = useState(5);
  const [dailyPrice, setDailyPrice] = useState(25);
  const [rentalDays, setRentalDays] = useState(10);

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
          <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-semibold text-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:scale-105 mb-12">
            Start Lending Today
          </button>
          
          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
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
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center hover:shadow-lg transition group">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
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
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center hover:shadow-lg transition group">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">3. Ship & Earn</h3>
              <p className="text-slate-600">We handle bookings and payments. You ship directly to travelers and get paid instantly</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 text-center hover:shadow-lg transition group">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Your Item</h3>
              <p className="text-sm text-slate-600">Upload photos of your clothing</p>
            </div>
            
            <ArrowRight className="w-8 h-8 text-slate-400 hidden md:block" />
            <div className="md:hidden w-8 h-8 rotate-90">
              <ArrowRight className="w-8 h-8 text-slate-400" />
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center flex-1 max-w-xs">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
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

          {/* Mailchimp Embedded Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                Be the First to Use In-Site AI Try-On
              </h3>
              <p className="text-slate-600">
                Get early access to our integrated AI try-on feature and boost your rental rates
              </p>
            </div>

            {/* Mailchimp Embedded Form with Custom Styling */}
            <div id="mc_embed_shell">
              <style type="text/css">
                {`
                  #mc_embed_signup {
                    background: transparent !important;
                    clear: left;
                    font: 14px Helvetica,Arial,sans-serif;
                    width: 100% !important;
                  }
                  #mc_embed_signup h2 {
                    display: none !important;
                  }
                  #mc_embed_signup .indicates-required {
                    display: none !important;
                  }
                  #mc_embed_signup .mc-field-group {
                    margin-bottom: 1rem;
                  }
                  #mc_embed_signup .mc-field-group label {
                    display: none !important;
                  }
                  #mc_embed_signup input[type="email"] {
                    width: 100% !important;
                    padding: 0.75rem 1rem !important;
                    border: 1px solid #cbd5e1 !important;
                    border-radius: 0.5rem !important;
                    font-size: 1rem !important;
                    outline: none !important;
                    transition: all 0.2s !important;
                  }
                  #mc_embed_signup input[type="email"]:focus {
                    border-color: #3b82f6 !important;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
                  }
                  #mc_embed_signup .button {
                    background-color: #3b82f6 !important;
                    color: white !important;
                    padding: 0.75rem 1.5rem !important;
                    border: none !important;
                    border-radius: 0.5rem !important;
                    font-weight: 500 !important;
                    cursor: pointer !important;
                    transition: background-color 0.2s !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    gap: 0.5rem !important;
                  }
                  #mc_embed_signup .button:hover {
                    background-color: #2563eb !important;
                  }
                  #mc_embed_signup .optionalParent {
                    margin-top: 1rem;
                  }
                  #mc_embed_signup .clear.foot {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 1rem !important;
                    align-items: center !important;
                  }
                  #mc_embed_signup .refferal_badge {
                    display: none !important;
                  }
                  #mc_embed_signup p {
                    display: none !important;
                  }
                  @media (min-width: 640px) {
                    #mc_embed_signup .clear.foot {
                      flex-direction: row !important;
                      justify-content: center !important;
                    }
                  }
                `}
              </style>
              <div id="mc_embed_signup">
                <form 
                  action="https://travelclothingclub.us9.list-manage.com/subscribe/post?u=76ec7acb17d86542fbeae7fae&id=451cee46ca&f_id=00321ae1f0" 
                  method="post" 
                  id="mc-embedded-subscribe-form" 
                  name="mc-embedded-subscribe-form" 
                  className="validate" 
                  target="_blank"
                >
                  <div id="mc_embed_signup_scroll">
                    <h2>Be the First to Use In-Site AI Try-On</h2>
                    <div className="indicates-required">
                      <span className="asterisk">*</span> indicates required
                    </div>
                    <div className="mc-field-group">
                      <label htmlFor="mce-EMAIL">Email Address <span className="asterisk">*</span></label>
                      <input 
                        type="email" 
                        name="EMAIL" 
                        className="required email" 
                        id="mce-EMAIL" 
                        required 
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div id="mce-responses" className="clear foot">
                      <div className="response" id="mce-error-response" style={{ display: 'none' }}></div>
                      <div className="response" id="mce-success-response" style={{ display: 'none' }}></div>
                    </div>
                    <div aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
                      <input type="text" name="b_76ec7acb17d86542fbeae7fae_451cee46ca" tabIndex={-1} />
                    </div>
                    <div className="optionalParent">
                      <div className="clear foot">
                        <input 
                          type="submit" 
                          name="subscribe" 
                          id="mc-embedded-subscribe" 
                          className="button" 
                          value="Join Waitlist"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <script type="text/javascript" src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"></script>
              <script type="text/javascript">
                {`(function($) {
                  window.fnames = new Array(); 
                  window.ftypes = new Array();
                  fnames[0]='EMAIL';ftypes[0]='email';
                  fnames[1]='FNAME';ftypes[1]='text';
                  fnames[2]='LNAME';ftypes[2]='text';
                  fnames[3]='ADDRESS';ftypes[3]='address';
                  fnames[4]='PHONE';ftypes[4]='phone';
                  fnames[5]='BIRTHDAY';ftypes[5]='birthday';
                  fnames[6]='COMPANY';ftypes[6]='text';
                }(jQuery));
                var $mcj = jQuery.noConflict(true);`}
              </script>
            </div>
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
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '33%' }}></div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Upload Zone */}
            <div className="border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center mb-12 hover:border-blue-400 transition bg-blue-50/50">
              <Upload className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">Drag & Drop Your Photos</h3>
              <p className="text-slate-600 mb-6">Upload up to 5 high-quality photos of your item</p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g., Hugo Boss, Zara, etc."
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                        className="pl-10 w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
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
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  SM
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
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  JL
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
                  MR
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

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}

export default LenderLandingPage;