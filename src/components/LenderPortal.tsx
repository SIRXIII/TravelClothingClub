import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import AuthForm from './AuthForm';
import LenderDashboard from './LenderDashboard';


function LenderPortal() {
  // ...all your imports, useAuth, useEffect, etc.

  // Just this one line for the public dashboard:
  return <LenderDashboard />;
}

export default LenderPortal;
