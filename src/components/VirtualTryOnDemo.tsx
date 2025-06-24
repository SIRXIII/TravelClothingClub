import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Check, Mail } from 'lucide-react';

function VirtualTryOnDemo() {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <div className="flex items-center gap-3">
                <img 
                  src="/TCC Cursive.png"
                  alt="Travel Clothing Club"
                  className="w-8 h-8 object-contain"
                />
                <h1 className="text-xl font-medium">Virtual Try-On Demo</h1>
              </div>
            </div>
            <Link 
              to="/lender-portal"
              className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition flex items-center gap-2"
            >
              Lender Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            See Virtual Try-On in Action
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Curious how our upcoming A.I. try-on will work? Preview the future of travel style with Google's live virtual try-on demo. Soon, you'll be able to see yourself—or a model—in your favorite outfits, right here on Travel Clothing Club.
          </p>
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">Experience the Technology</h3>
            <p className="text-slate-600 mb-8">
              Try Google's cutting-edge virtual try-on technology to see how AI-powered clothing visualization works. This is the same type of technology we're integrating into Travel Clothing Club.
            </p>
            
            <a
              href="https://www.google.com/shopping/tryon?gl=us&hl=en&utm_source=searchlabs&udm=28"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try Google's Virtual Try-On
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          {/* Preview Images */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=400&h=500"
                alt="Virtual try-on example"
                className="w-full h-80 object-cover rounded-lg shadow-md mb-4"
              />
              <p className="text-sm text-slate-600">Example: See how clothes look on different body types</p>
            </div>
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=400&h=500"
                alt="AI clothing visualization"
                className="w-full h-80 object-cover rounded-lg shadow-md mb-4"
              />
              <p className="text-sm text-slate-600">AI-powered clothing visualization in real-time</p>
            </div>
          </div>
        </div>

        {/* How It Will Work Section */}
        <div className="bg-slate-50 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-semibold text-slate-900 text-center mb-8">
            How It Will Work on Travel Clothing Club
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Your Photo</h4>
              <p className="text-slate-600">Take a quick photo or upload an existing one to create your virtual model</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Browse & Try On</h4>
              <p className="text-slate-600">See how any outfit looks on you instantly before booking your rental</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Book with Confidence</h4>
              <p className="text-slate-600">Rent only the outfits you love, knowing exactly how they'll look</p>
            </div>
          </div>
        </div>

        {/* Waitlist Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-semibold text-slate-900 mb-4">
            Get Early Access to Virtual Try-On
          </h3>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Be among the first to experience AI-powered virtual try-on when we launch this feature. Join our exclusive waitlist for early access and special launch pricing.
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
                <Check className="w-6 h-6" />
                <span className="font-medium">You're on the list!</span>
              </div>
              <p className="text-green-600">We'll notify you when virtual try-on is available.</p>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div id="mc_embed_shell">
                <link href="//cdn-images.mailchimp.com/embedcode/classic-061523.css" rel="stylesheet" type="text/css" />
                <style type="text/css">
                  {`
                    #mc_embed_signup {
                      background: #fff;
                      clear: left;
                      font: 14px Helvetica,Arial,sans-serif;
                      width: 100%;
                      max-width: 440px;
                      margin: 0 auto;
                      padding: 2rem 1rem;
                      border-radius: 1.25rem;
                      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
                    }
                    #mc_embed_signup h2 {
                      text-align: center;
                      font-size: 1.3rem;
                      font-weight: 600;
                      color: #222;
                      margin-bottom: 0.5rem;
                    }
                    #mc_embed_signup .indicates-required {
                      text-align: center;
                      color: #666;
                      font-size: 1rem;
                      margin-bottom: 1rem;
                    }
                    #mc_embed_signup input[type="email"] {
                      padding: 1rem;
                      border: 1.5px solid #e7e8ec;
                      border-radius: 0.75rem;
                      font-size: 1rem;
                      width: 100%;
                      background: #f9f9fa;
                      margin-bottom: 1rem;
                    }
                    #mc_embed_signup input[type="submit"] {
                      padding: 1rem;
                      border: none;
                      border-radius: 2rem;
                      background: #334155;
                      color: #fff;
                      font-weight: 600;
                      font-size: 1.05rem;
                      cursor: pointer;
                      transition: background 0.2s;
                      width: 100%;
                    }
                    #mc_embed_signup input[type="submit"]:hover {
                      background: #1e293b;
                    }
                    #mc_embed_signup .mc-field-group label {
                      display: none;
                    }
                    #mc_embed_signup .asterisk {
                      display: none;
                    }
                    #mc_embed_signup .optionalParent {
                      margin-top: 1rem;
                    }
                    #mc_embed_signup .refferal_badge {
                      display: none;
                    }
                    #mc_embed_signup .foot p {
                      display: none;
                    }
                  `}
                </style>
                <div id="mc_embed_signup">
                  <form action="https://travelclothingclub.us9.list-manage.com/subscribe/post?u=76ec7acb17d86542fbeae7fae&amp;id=451cee46ca&amp;f_id=00321ae1f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" onSubmit={handleSubmit}>
                    <div id="mc_embed_signup_scroll">
                      <h2>Be the First to Use In-Site AI Try-On</h2>
                      <div className="indicates-required">Get early access to our integrated AI try-on feature and boost your rental rates</div>
                      <div className="mc-field-group">
                        <label htmlFor="mce-EMAIL">Email Address <span className="asterisk">*</span></label>
                        <input type="email" name="EMAIL" className="required email" id="mce-EMAIL" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" />
                      </div>
                      <div id="mce-responses" className="clear foot">
                        <div className="response" id="mce-error-response" style={{display: 'none'}}></div>
                        <div className="response" id="mce-success-response" style={{display: 'none'}}></div>
                      </div>
                      <div aria-hidden="true" style={{position: 'absolute', left: '-5000px'}}>
                        <input type="text" name="b_76ec7acb17d86542fbeae7fae_451cee46ca" tabIndex={-1} value="" />
                      </div>
                      <div className="optionalParent">
                        <div className="clear foot">
                          <input type="submit" name="subscribe" id="mc-embedded-subscribe" className="button" value="Join Waitlist" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <script type="text/javascript" src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"></script>
                <script type="text/javascript">
                  {`(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';fnames[3]='ADDRESS';ftypes[3]='address';fnames[4]='PHONE';ftypes[4]='phone';fnames[5]='BIRTHDAY';ftypes[5]='birthday';fnames[6]='COMPANY';ftypes[6]='text';}(jQuery));var $mcj = jQuery.noConflict(true);`}
                </script>
              </div>
            </div>
          )}

          <p className="text-sm text-slate-500 mt-4">
            Join 100+ travelers waiting for the future of travel fashion.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-3">For Travelers</h4>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600" />
                <span>See exact fit before traveling</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600" />
                <span>Reduce rental uncertainty</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600" />
                <span>Try multiple outfits instantly</span>
              </li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-3">For Lenders</h4>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Increase booking confidence</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Reduce returns and exchanges</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Showcase items more effectively</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VirtualTryOnDemo;