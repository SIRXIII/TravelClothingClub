import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import VirtualTryOn from './components/VirtualTryOn';
import LenderPortal from './components/LenderPortal';
import SearchResults from './components/SearchResults';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/virtual-try-on" element={<VirtualTryOn />} />
      <Route path="/lender-portal" element={<LenderPortal />} />
      <Route path="/search-results" element={<SearchResults />} />
    </Routes>
  );
}

export default App;