import React, { useState } from 'react';
import { Plane, ShoppingBag, DollarSign, Clock, MapPin, Users, Check, Send, Upload, Ruler } from 'lucide-react';

function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80"
            alt="Hotel lobby"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/80"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-8">
            {/* Knitted Logo */}
            <div className="mb-8">
              <img 
                src="/ChatGPT Image Jun 4, 2025, 09_30_18 PM copy.png"
                alt="Travel Clothing Club Logo"
                className="w-32 h-32 md:w-40 md:h-40 object-contain"
              />
            </div>
            
            {/* New Hero Copy */}
            <div className="text-center max-w-4xl mx-auto mb-8">
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
                Travel Lighter. Stress Less.
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed">
                Rent stylish, weather-ready clothes at your destination—skip the suitcase, not the style.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Email Form Section */}
      <section className="py-16 bg-gray-50">
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
              className="flex flex-col items-center gap-4"
            >
              <input 
                type="email" 
                name="EMAIL" 
                placeholder="Enter your email" 
                required 
                className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button 
                type="submit" 
                name="subscribe" 
                className="w-full bg-black text-white px-6 py-3 text-lg rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Join the Exclusive Clublist
              </button>
              <p className="text-sm text-gray-600">
                Join 100+ travelers simplifying their trips.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">1. Choose Your Trip</h3>
              <p className="text-gray-600">Select your destination and travel dates</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">2. Pick Your Styles</h3>
              <p className="text-gray-600">Choose from curated businesswear, casual outfits, and family options</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">3. Get It Delivered</h3>
              <p className="text-gray-600">Receive your wardrobe at the airport or hotel when you land</p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Clothing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light text-center mb-4">Available Clothing</h2>
          <p className="text-gray-600 text-center mb-12">Find the perfect outfit for your needs with our AI-powered size matching</p>
          
          <div className="mb-12">
            <h3 className="text-2xl font-light mb-8">Size Customization</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-xl shadow-sm">
              <div>
                <h4 className="text-xl font-medium mb-4">Perfect Fit with AI</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Ruler className="w-6 h-6 text-blue-600" />
                    <span>AI-powered size recommendations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Upload className="w-6 h-6 text-blue-600" />
                    <span>Upload your full body picture</span>
                  </div>
                  <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg">
                    Get Started
                  </button>
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80"
                alt="Size customization"
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Men's Collection */}
          <div className="mb-16">
            <h3 className="text-2xl font-light mb-8">Men's Collection</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80"
                  alt="Business Suit"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h4 className="font-medium mb-2">Business Suit</h4>
                  <p className="text-gray-600 mb-4">Classic navy suit with modern fit</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Rent Now</button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80"
                  alt="Casual Blazer"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h4 className="font-medium mb-2">Casual Blazer</h4>
                  <p className="text-gray-600 mb-4">Versatile blazer for any occasion</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Rent Now</button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80"
                  alt="Summer Collection"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h4 className="font-medium mb-2">Summer Collection</h4>
                  <p className="text-gray-600 mb-4">Light and breathable summer wear</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Rent Now</button>
                </div>
              </div>
            </div>
          </div>

          {/* Women's Collection */}
          <div className="mb-16">
            <h3 className="text-2xl font-light mb-8">Women's Collection</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80"
                  alt="Evening Dress"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h4 className="font-medium mb-2">Evening Dress</h4>
                  <p className="text-gray-600 mb-4">Elegant black evening dress</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Rent Now</button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80"
                  alt="Business Attire"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h4 className="font-medium mb-2">Business Attire</h4>
                  <p className="text-gray-600 mb-4">Professional business ensemble</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Rent Now</button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80"
                  alt="Casual Chic"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h4 className="font-medium mb-2">Casual Chic</h4>
                  <p className="text-gray-600 mb-4">Stylish everyday wear</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Rent Now</button>
                </div>
              </div>
            </div>
          </div>

          {/* Kids' Collection */}
          <div>
            <h3 className="text-2xl font-light mb-8">Kids' Collection</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80"
                  alt="Party Wear"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h4 className="font-medium mb-2">Party Wear</h4>
                  <p className="text-gray-600 mb-4">Adorable party outfits</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Rent Now</button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80"
                  alt="Casual Play"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h4 className="font-medium mb-2">Casual Play</h4>
                  <p className="text-gray-600 mb-4">Comfortable play clothes</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Rent Now</button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&q=80"
                  alt="Special Occasion"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h4 className="font-medium mb-2">Special Occasion</h4>
                  <p className="text-gray-600 mb-4">Formal wear for special events</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Rent Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light text-center mb-4">Choose Your Style Package</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Select from our curated clothing packages designed for every occasion and style preference</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Basic Tier */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition p-8">
              <h3 className="text-2xl font-light text-gray-900 mb-4">Basic</h3>
              <p className="text-gray-600 mb-6">Essential clothing for comfortable travel</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  <span>White shirts (M/W/K)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  <span>Black shorts (M/W/K)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  <span>Basic accessories</span>
                </div>
              </div>
              <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
                Select Basic
              </button>
            </div>

            {/* Vaca Mode Tier */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition p-8">
              <h3 className="text-2xl font-light text-gray-900 mb-4">Vaca Mode</h3>
              <p className="text-gray-600 mb-6">Perfect for casual vacation style</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  <span>Breathable tan shirts (M/W/K)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  <span>Jean shorts & pants (M/W/K)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  <span>Vacation accessories</span>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                Select Vaca Mode
              </button>
            </div>

            {/* Upscale Tier */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition p-8">
              <h3 className="text-2xl font-light text-gray-900 mb-4">Upscale</h3>
              <p className="text-gray-600 mb-6">Professional business attire</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  <span>Business suits (M/W)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  <span>Professional shoes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  <span>Business accessories</span>
                </div>
              </div>
              <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition">
                Select Upscale
              </button>
            </div>

            {/* Award Tier */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-8 text-white">
              <h3 className="text-2xl font-light mb-4">Award</h3>
              <p className="text-gray-300 mb-6">Premium fashion brands and styles</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-400" />
                  <span>Designer button-downs (M)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-400" />
                  <span>Premium dresses (W)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-400" />
                  <span>Kids designer wear</span>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                Select Award
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-light mb-6">Why Choose Travel Clothing Club?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Verified Lenders</h3>
                    <p className="text-gray-600">All lenders are verified and rated by our community</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Flexible Pricing</h3>
                    <p className="text-gray-600">Rent by the day with transparent pricing</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Plane className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Convenient Delivery</h3>
                    <p className="text-gray-600">Meet directly at your location - no extra trips needed</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80"
                alt="Professional clothing"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/ChatGPT Image Jun 4, 2025, 09_30_18 PM copy.png"
                  alt="Travel Clothing Club"
                  className="w-8 h-8 object-contain"
                />
                <h3 className="text-lg font-medium">Travel Clothing Club</h3>
              </div>
              <p className="text-gray-400">Connecting travelers with local clothing lenders worldwide.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Become a Lender</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Instagram</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Travel Clothing Club. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;