import React, { useState } from 'react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, DollarSign, Package, TrendingUp, ArrowRight, Star, Users, Calculator, Sparkles, ExternalLink, Check, Mail } from 'lucide-react';

function LenderLandingPage() {
  const [items, setItems] = useState(5);
  const [dailyPrice, setDailyPrice] = useState(25);
  const [rentalDays, setRentalDays] = useState(10);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Upload form state
  const [itemName, setItemName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedGender, setSelectedGender] = useState<'Male' | 'Female'>('Female');
  const [aiPreviewUrl, setAiPreviewUrl] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateEarnings = () => {
    return items * dailyPrice * rentalDays;
  };

  const categories = ['Suit', 'Dress', 'Shirt', 'Pants', 'Jacket', 'Blazer', 'Skirt', 'Blouse', 'Kids', 'Accessories', 'Other'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '2T', '3T', '4T', '5T', '6', '7', '8', '10', '12', '14', '16'];
  const conditions = ['New with tags', 'Like new', 'Excellent', 'Good', 'Fair'];

  const handleScrollToSignup = () => {
    document.getElementById('waitlist-signup')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(files);
      console.log('Files selected:', files);
      // You can add additional logic here to handle the files
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const generateAIPreview = async () => {
    if (uploadedFiles.length === 0) {
      setAiError('Please upload an image first');
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const formData = new FormData();
      formData.append('clothing_image', uploadedFiles[0]);
      formData.append('gender', selectedGender);

      const response = await fetch('/api/fashn-tryon', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type') || '';

      if (!response.ok) {
        const errorText = contentType.includes('application/json')
          ? await response.json()
          : await response.text();

        throw new Error(
          typeof errorText === 'string'
            ? errorText
            : errorText.error || JSON.stringify(errorText)
        );
      }

      const data = await response.json();

      if (data.tryon_image_url) {
        setAiPreviewUrl(data.tryon_image_url);
      } else {
        throw new Error('No AI preview generated from response');
      }
    } catch (err: any) {
      console.error('Fashn.ai API error:', err);
      setAiError(`AI preview failed: ${err.message || 'Unknown error occurred. Please try again.'}`);
    } finally {
      setAiLoading(false);
    }
  };

  const resetUpload = () => {
    setUploadedFiles([]);
    setAiPreviewUrl(null);
    setAiError(null);
    setItemName('');
    setBrand('');
    setCategory('');
    setSize('');
    setCondition('');
    setPrice('');
    setDescription('');
  };

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
            onClick={handleScrollToSignup}
            className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-semibold text-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:scale-105 mb-12"
          >
            Start Partnering Today
          </button>
          
          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-slate-600">Active Partners</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">$2.3M</div>
              <div className="text-slate-600">Total Earnings</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-yellow-500 mb-2">
                4.9 <Star className="w-8 h-8 fill-current" />
              </div>
              <div className="text-slate-600">Partner Rating</div>
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
              <p className="text-slate-600">Build your reputation, get more bookings, and turn partnering into a profitable side business</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Try-On Demo Section */}
      <section id="waitlist-signup" className="py-20 bg-slate-50">
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
          <h2 className="text-4xl font-light text-center mb-8 text-slate-900">Upload Your Travel Clothes</h2>
          <p className="text-xl text-slate-600 text-center mb-16 max-w-3xl mx-auto">
            See how our AI try-on technology works! Upload a clothing item and watch as we generate a professional model preview.
          </p>
          
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Side - Upload and Form */}
              <div className="space-y-8">
                {/* Upload Zone */}
                <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:border-blue-400 transition bg-blue-50/50"
                     onClick={triggerFileUpload}>
                  <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  {uploadedFiles.length > 0 ? (
                    <div className="space-y-4">
                      <img 
                        src={URL.createObjectURL(uploadedFiles[0])} 
                        alt="Uploaded clothing" 
                        className="max-w-full max-h-48 mx-auto rounded-lg shadow-md object-cover"
                      />
                      <p className="text-slate-600 text-sm">Click to change image</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Clothing Image</h3>
                      <p className="text-slate-600 mb-4">Upload a high-quality photo of your clothing item</p>
                      <button 
                        type="button"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        Choose File
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Gender Selection */}
                {uploadedFiles.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <h4 className="text-lg font-medium mb-4">Select Model Gender</h4>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={selectedGender === 'Female'}
                          onChange={(e) => setSelectedGender(e.target.value as 'Female')}
                          className="mr-2 text-blue-600"
                        />
                        Female Model
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={selectedGender === 'Male'}
                          onChange={(e) => setSelectedGender(e.target.value as 'Male')}
                          className="mr-2 text-blue-600"
                        />
                        Male Model
                      </label>
                    </div>
                  </div>
                )}

                {/* Generate AI Preview Button */}
                {uploadedFiles.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <button
                      onClick={generateAIPreview}
                      disabled={aiLoading}
                      className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-3 text-lg"
                    >
                      {aiLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          Generating AI Preview...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6" />
                          Generate AI Model Preview
                        </>
                      )}
                    </button>

                    {aiError && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{aiError}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reset Button */}
                {(uploadedFiles.length > 0 || aiPreviewUrl) && (
                  <div className="text-center">
                    <button
                      onClick={resetUpload}
                      className="bg-slate-100 text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-slate-200 transition"
                    >
                      Try Another Item
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side - AI Preview */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 border">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-6 text-center">AI Try-On Preview</h3>
                  
                  <div className="border-2 border-slate-200 rounded-xl p-8 min-h-96 flex items-center justify-center">
                    {aiPreviewUrl ? (
                      <div className="text-center space-y-4">
                        <img 
                          src={aiPreviewUrl} 
                          alt="AI try-on preview" 
                          className="max-w-full max-h-80 mx-auto rounded-lg shadow-md object-cover"
                        />
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-green-800 font-medium">✨ AI Preview Generated Successfully!</p>
                          <p className="text-green-700 text-sm mt-1">This is how your item will look on our platform</p>
                        </div>
                      </div>
                    ) : uploadedFiles.length > 0 ? (
                      <div className="text-center space-y-4">
                        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                          <Sparkles className="w-12 h-12 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-slate-900">Ready to Generate</p>
                          <p className="text-slate-600">Select model gender and click generate to see the AI preview</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-12 h-12 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-slate-900">Upload an Image</p>
                          <p className="text-slate-600">Upload a clothing item to see AI try-on preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* How It Works */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">How AI Try-On Works</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                      <span className="text-slate-700">Upload your clothing item photo</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">2</div>
                      <span className="text-slate-700">Select model gender preference</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">3</div>
                      <span className="text-slate-700">AI generates professional model preview</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">4</div>
                      <span className="text-slate-700">Travelers see realistic try-on results</span>
                    </div>
                  </div>
                </div>
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
              <p className="text-slate-400">Connecting travelers with local clothing partners worldwide.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">For Partners</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Pricing Guide</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Success Stories</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Partner Resources</a></li>
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
                <li><a href="#" className="text-slate-400 hover:text-white transition">Partner Agreement</a></li>
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