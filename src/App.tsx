import React, { useState } from 'react';

// Theme Constants
const COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  purple: '#4B0082', // Deep Purple
};

export default function App() {
  const [page, setPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Centered Navigation Component
  const Navigation = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '20px', 
      padding: '20px', 
      marginTop: 'auto' 
    }}>
      <button 
        onClick={() => setPage(Math.max(1, page - 1))}
        style={{ backgroundColor: COLORS.purple, color: COLORS.white, padding: '10px 20px', border: 'none', borderRadius: '5px' }}
      >
        Back
      </button>
      <button 
        onClick={() => setPage(Math.min(21, page + 1))}
        style={{ backgroundColor: COLORS.purple, color: COLORS.white, padding: '10px 20px', border: 'none', borderRadius: '5px' }}
      >
        Next
      </button>
    </div>
  );

  // Authentication Page (Login)
  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: COLORS.black, color: COLORS.white, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: COLORS.purple }}>Login</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
          <input type="email" placeholder="Email" style={{ padding: '10px' }} />
          <input type="password" placeholder="Password" style={{ padding: '10px' }} />
          <button 
            onClick={() => setIsLoggedIn(true)}
            style={{ backgroundColor: COLORS.purple, color: COLORS.white, padding: '10px', border: 'none' }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: COLORS.black, color: COLORS.white, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Page Content */}
      <div style={{ flex: 1, padding: '40px', textAlign: 'center' }}>
        
        {page === 1 && (
          <div>
            <h1 style={{ color: COLORS.purple }}>Choose Your Plan</h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <div style={{ border: `1px solid ${COLORS.purple}`, padding: '20px' }}>Basic - $20/month</div>
              <div style={{ border: `1px solid ${COLORS.purple}`, padding: '20px' }}>Pro - $30/month</div>
              <div style={{ border: `2px solid ${COLORS.white}`, padding: '20px', backgroundColor: COLORS.purple }}>Studio - $50/month</div>
            </div>
          </div>
        )}

        {page === 5 && (
          <div>
            <h1 style={{ color: COLORS.purple }}>Creative Studio</h1>
            <p>Your Plan: <strong>Studio</strong></p>
          </div>
        )}

        {page === 15 && (
          <div>
            <h1 style={{ color: COLORS.purple }}>Editor's Choice</h1>
            {/* "no movies yet" word removed */}
          </div>
        )}

        {page === 21 && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <video width="100%" controls autoPlay style={{ marginBottom: '20px' }}>
              <source src="/thatsallfolks.mp4" type="video/mp4" />
            </video>
            <h1 style={{ color: COLORS.purple }}>THAT'S ALL FOLKS!</h1>
            <p>Visit our fundraiser at MandaStrong1.Etsy.com</p>
          </div>
        )}

      </div>

      {/* Persistent Navigation at Bottom */}
      <Navigation />

      {/* Bolt Watermark intentionally excluded */}
    </div>
  );
}