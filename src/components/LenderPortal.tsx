import React from 'react';
import LenderLandingPage from './LenderLandingPage';

function LenderPortal() {
  // Since we're not using authentication, just show the landing page
  return <LenderLandingPage />;
}

export default LenderPortal;