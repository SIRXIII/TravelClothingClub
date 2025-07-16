import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase, addItem } from '../lib/supabase';
import AuthForm from './AuthForm';
import LenderDashboard from './LenderDashboard';
import LenderLandingPage from './LenderLandingPage';

function LenderPortal() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  
  // Form state for adding items
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState<'male'|'female'>('female');
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [aiPreviewUrl, setAiPreviewUrl] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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