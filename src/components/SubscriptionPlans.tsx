import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { stripeProducts } from '../stripe-config';
import { useStripe } from '../hooks/useStripe';
import { useAuth } from '../hooks/useAuth';

function SubscriptionPlans() {
  const { user } = useAuth();
  const { createCheckoutSession, getCurrentPlan, hasActiveSubscription } = useStripe();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const currentPlan = getCurrentPlan();

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      alert('Please sign in to subscribe');
      return;
    }

    setLoadingPriceId(priceId);
    try {
      await createCheckoutSession(priceId, 'subscription');
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setLoadingPriceId(null);
    }
  };

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-light text-center mb-4 text-slate-900">Choose Your Plan</h2>
        <p className="text-xl text-slate-600 text-center mb-16">Select the perfect subscription for your travel needs</p>
        
        {hasActiveSubscription() && currentPlan && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-center">
            <p className="text-green-800">
              You currently have an active <strong>{currentPlan.name}</strong> subscription.
            </p>
          </div>
        )}
        
        <div className="grid md:grid-cols-3 gap-8">
          {stripeProducts.map((product, index) => {
            const isCurrentPlan = currentPlan?.priceId === product.priceId;
            const isPopular = index === 1; // Upscale is most popular
            const isLoading = loadingPriceId === product.priceId;
            
            return (
              <div 
                key={product.id} 
                className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                  isPopular ? 'transform scale-105 border-2 border-blue-500' : 'border-2 border-transparent hover:border-slate-200'
                } transition`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </div>
                )}

                <h3 className="text-2xl font-medium mb-4">{product.name}</h3>
                <div className="text-4xl font-light mb-6">
                  ${product.price}
                  <span className="text-lg text-slate-600">/month</span>
                </div>
                
                <p className="text-slate-600 mb-8">{product.description}</p>

                <ul className="space-y-3 mb-8">
                  {product.name === 'Basic' && (
                    <>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>2 outfits per month</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>Casual wear selection</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>Standard fabric quality</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>Standard delivery</span>
                      </li>
                    </>
                  )}
                  
                  {product.name === 'Upscale' && (
                    <>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>3 outfits per month</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>Business & casual mix</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>Premium materials</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>Priority support</span>
                      </li>
                    </>
                  )}
                  
                  {product.name === 'Vacay Mode' && (
                    <>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>4 outfits per month</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>Resort-wear & accessories</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>Priority delivery</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>Concierge styling service</span>
                      </li>
                    </>
                  )}
                </ul>

                <button
                  onClick={() => handleSubscribe(product.priceId)}
                  disabled={isLoading || isCurrentPlan}
                  className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                    isCurrentPlan
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : isPopular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : (
                    `Subscribe to ${product.name}`
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPlans;