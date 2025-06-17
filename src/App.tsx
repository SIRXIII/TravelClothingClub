import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import VirtualTryOn from './components/VirtualTryOn';
import LenderPortal from './components/LenderPortal';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/virtual-try-on" element={<VirtualTryOn />} />
      <Route path="/lender-portal" element={<LenderPortal />} />
    </Routes>
  );
}

export default App;