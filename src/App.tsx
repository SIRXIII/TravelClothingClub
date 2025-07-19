import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import VirtualTryOn from './components/VirtualTryOn';
import VirtualTryOnDemo from './components/VirtualTryOnDemo';
import LenderPortal from './components/LenderPortal';
import SearchResults from './components/SearchResults';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/virtual-try-on" element={<VirtualTryOn />} />
      <Route path="/virtual-try-on-demo" element={<VirtualTryOnDemo />} />
      <Route path="/lender-portal" element={<LenderPortal />} />
      <Route path="/search-results" element={<SearchResults />} />
      <Route path="*" element={<Navigate to="/lender-portal" replace />} />
    </Routes>
  );
}

export default App;