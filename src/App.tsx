import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import VirtualTryOn from './components/VirtualTryOn';
import VirtualTryOnDemo from './components/VirtualTryOnDemo';
import LenderPortal from './components/LenderPortal';
import SearchResults from './components/SearchResults';
import AuthForm from './components/AuthForm';
import SuccessPage from './components/SuccessPage';
import UserDashboard from './components/UserDashboard';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/virtual-try-on" element={<VirtualTryOn />} />
      <Route path="/virtual-try-on-demo" element={<VirtualTryOnDemo />} />
      <Route path="/lender-portal" element={<LenderPortal />} />
      <Route path="/search-results" element={<SearchResults />} />
      <Route path="/auth" element={
        user ? <UserDashboard onSignOut={() => window.location.href = '/'} /> : <AuthForm onSuccess={() => window.location.href = '/dashboard'} />
      } />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/dashboard" element={
        user ? <UserDashboard onSignOut={() => window.location.href = '/'} /> : <AuthForm onSuccess={() => window.location.href = '/dashboard'} />
      } />
    </Routes>
  );
}

export default App;