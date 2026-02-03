import React, { useState } from 'react';

export default function App() {
  const [page, setPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // AUTH PAGE: Changed "Sign" to "Login" in 2 places
  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: '#000000', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#4B0082' }}>Login</h1> 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '320px' }}>
          <input type="text" placeholder="Username" style={{ padding: '12px', background: '#FFFFFF', color: '#000000' }} />
          <input type="password" placeholder="Password" style={{ padding: '12px', background: '#FFFFFF', color: '#000000' }} />
          <button 
            onClick={() => setIsLoggedIn(true)} 
            style={{ backgroundColor: '#4B0082', color: '#FFFFFF', border: 'none', padding: '12px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ flex: 1, padding: '20px' }}>
        
        {/* PAGE 1: Remove Free Plan */}
        {page === 1 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#4B0082' }}>Choose Your Plan</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
              <div style={{ border: '2px solid #4B0082', padding: '25px' }}>Basic $20/month</div>
              <div style={{ border: '2px solid #4B0082', padding: '25px' }}>Pro $30/month</div>
              <div style={{ border: '2px solid #FFFFFF', backgroundColor: '#4B0082', padding: '25px' }}>Studio $50/month</div>
            </div>
          </div>
        )}

        {/* PAGE 5: Creative Studio Plan display */}
        {page === 5 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#4B0082' }}>Creative Studio</h2>
            <p>Your Plan: <span style={{ color: '#4B0082', fontWeight: 'bold' }}>Studio</span></p>
          </div>
        )}

        {/* PAGE 15: Editor's Choice - Removed "no movies yet" */}
        {page === 15 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#4B0082' }}>Editor's Choice</h2>
          </div>
        )}

        {/* PAGE 21: Added video at top */}
        {page === 21 && (
          <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
            <video width="100%" controls autoPlay style={{ border: '3px solid #4B0082', marginBottom: '20px' }}>
              <source src="/thatsallfolks.mp4" type="video/mp4" />
            </video>
            <h2 style={{ color: '#4B0082' }}>THAT'S ALL FOLKS!</h2>
            <p>Visit MandaStrong1.Etsy.com</p>
          </div>
        )}
      </div>

      {/* NAVIGATION: Back & Next side-by-side and centered at bottom */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', padding: '40px' }}>
        <button 
          onClick={() => setPage(Math.max(1, page - 1))}
          style={{ backgroundColor: '#4B0082', color: '#FFFFFF', border: '1px solid #FFFFFF', padding: '12px 45px', cursor: 'pointer' }}
        >
          Back
        </button>
        <button 
          onClick={() => setPage(Math.min(21, page + 1))}
          style={{ backgroundColor: '#4B0082', color: '#FFFFFF', border: '1px solid #FFFFFF', padding: '12px 45px', cursor: 'pointer' }}
        >
          Next
        </button>
      </div>

    </div>
  );
}