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
  return <LenderDashboard />;
