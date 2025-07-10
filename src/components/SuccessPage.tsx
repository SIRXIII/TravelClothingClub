import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Gift } from 'lucide-react';
import { useStripe } from '../hooks/useStripe';

function SuccessPage() {
  const { refreshData, getCurrentPlan } = useStripe();

  useEffect(() => {
    // Refresh subscription data when the success page loads
    const timer = setTimeout(() => {
      refreshData();
    }, 2000);

    return () => clearTimeout(timer);
  }, [refreshData]);

  const currentPlan = getCurrentPlan();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <img 
              src="/TCC Cursive.png"
              alt="Travel Clothing Club"
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-xl font-medium">Travel Clothing Club</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Travel Clothing Club!
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your subscription has been successfully activated. Get ready to travel light and look amazing!
          </p>

          {/* Plan Details */}
          {currentPlan && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gift className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Your Plan</h3>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {currentPlan.name}
              </div>
              <p className="text-gray-600 mb-4">{currentPlan.description}</p>
              <div className="text-2xl font-semibold text-gray-900">
                ${currentPlan.price}/month
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-blue-50 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">What happens next?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Style Profile</h4>
                  <p className="text-gray-600 text-sm">We'll contact you within 24 hours to create your personalized style profile</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">First Delivery</h4>
                  <p className="text-gray-600 text-sm">Your first curated outfits will be ready for your next trip</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Travel Light</h4>
                  <p className="text-gray-600 text-sm">Enjoy stress-free travel with perfectly fitted, stylish outfits</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              Explore Collections
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/lender-portal"
              className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Manage Account
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 bg-white rounded-xl p-6 max-w-md mx-auto">
            <h4 className="font-semibold text-gray-900 mb-3">Questions?</h4>
            <p className="text-gray-600 text-sm mb-4">
              Our team is here to help you get the most out of your subscription.
            </p>
            <a
              href="mailto:support@travelclothingclub.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              support@travelclothingclub.com
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SuccessPage;