import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import AuthForm from './AuthForm';
import LenderDashboard from './LenderDashboard';
import LenderLandingPage from './LenderLandingPage';

function LenderPortal() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  // Show landing page by default
  if (!showAuth && !user) {
    return <LenderLandingPage />;
  }

  // Show auth form if requested
  if (showAuth && !user) {
    return <AuthForm onSuccess={() => setShowAuth(false)} />;
  }

  // Show dashboard if authenticated
  if (user) {
    return <LenderDashboard onSignOut={() => setShowAuth(false)} />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <LenderLandingPage />;
}

export default LenderPortal;