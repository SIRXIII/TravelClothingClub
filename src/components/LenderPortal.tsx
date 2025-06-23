import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import AuthForm from './AuthForm';
import LenderDashboard from './LenderDashboard';

function LenderPortal() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

return <LenderDashboard />;

export default LenderPortal;