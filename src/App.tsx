import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import VirtualTryOn from './components/VirtualTryOn';
import VirtualTryOnDemo from './components/VirtualTryOnDemo';
import LenderPortal from './components/LenderPortal';
import SearchResults from './components/SearchResults';

const PartnerOnboardingLazy = lazy(() => import('./features/partnerOnboarding'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/virtual-try-on" element={<VirtualTryOn />} />
      <Route path="/virtual-try-on-demo" element={<VirtualTryOnDemo />} />
      <Route path="/lender-portal" element={<LenderPortal />} />
      <Route path="/search-results" element={<SearchResults />} />
      <Route path="/partner-onboarding/*" element={
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>}>
          <PartnerOnboardingLazy />
        </Suspense>
      } />
      <Route path="*" element={<Navigate to="/lender-portal" replace />} />
    </Routes>
  );
}

export default App;