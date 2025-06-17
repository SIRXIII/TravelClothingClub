import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import AuthForm from './AuthForm';
import LenderDashboard from './LenderDashboard';

function LenderPortal() {
  const { user, loading } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(true);

  useEffect(() => {
    if (user) {
      checkLenderVerification();
    } else {
      setCheckingVerification(false);
    }
  }, [user]);

  const checkLenderVerification = async () => {
    try {
      const { data, error } = await supabase
        .from('lenders')
        .select('verified')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error checking verification:', error);
        setIsVerified(false);
      } else {
        setIsVerified(data?.verified || false);
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      setIsVerified(false);
    } finally {
      setCheckingVerification(false);
    }
  };

  const handleAuthSuccess = () => {
    checkLenderVerification();
  };

  const handleSignOut = () => {
    setIsVerified(false);
    setCheckingVerification(false);
  };

  if (loading || checkingVerification) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSuccess={handleAuthSuccess} />;
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <img 
            src="/ChatGPT Image Jun 4, 2025, 09_30_18 PM copy.png"
            alt="Travel Clothing Club"
            className="w-16 h-16 mx-auto mb-6"
          />
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Account Under Review
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for signing up! Your lender account is currently being reviewed. 
            You'll receive an email notification once your account is verified and you can start listing items.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>What's next?</strong><br />
              Our team will review your application within 24-48 hours. 
              Once approved, you'll have full access to the lender dashboard.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <LenderDashboard onSignOut={handleSignOut} />;
}

export default LenderPortal;