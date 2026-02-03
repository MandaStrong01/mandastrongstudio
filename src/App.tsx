import React, { useState } from 'react';

export default function App() {
  const [page, setPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // AUTH PAGE
  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: '#000000', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#4B0082' }}>Login</h1> 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Username" style={{ padding: '10px' }} />
          <input type="password" placeholder="Password" style={{ padding: '10px' }} />
          <button onClick={() => setIsLoggedIn(true)} style={{ backgroundColor: '#4B0082', color: '#FFFFFF', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: '20px' }}>
        
        {/* PAGE 1: PLANS */}
        {page === 1 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#4B0082' }}>Choose Your Plan</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
              <div style={{ border: '1px solid #4B0082', padding: '20px' }}>Basic $20/month</div>
              <div style={{ border: '1px solid #4B0082', padding: '20px' }}>Pro $30/month</div>
              <div style={{ border: '1px solid #FFFFFF', backgroundColor: '#4B0082', padding: '20px' }}>Studio $50/month</div>
            </div>
          </div>
        )}

        {/* PAGE 5: CREATIVE STUDIO */}
        {page === 5 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#4B0082' }}>Creative Studio</h2>
            <p>Your Plan: <span style={{ color: '#4B0082', fontWeight: 'bold' }}>Studio</span></p>
          </div>
        )}

        {/* PAGE 15: EDITOR'S CHOICE */}
        {page === 15 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#4B0082' }}>Editor's Choice</h2>
            {/* "no movies yet" text removed */}
          </div>
        )}

        {/* PAGE 21: FINAL PAGE */}
        {page === 21 && (
          <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
            <video width="100%" controls autoPlay style={{ border: '2px solid #4B0082', marginBottom: '20px' }}>
              <source src="/thatsallfolks.mp4" type="video/mp4" />
            </video>
            <h2 style={{ color: '#4B0082' }}>THAT'S ALL FOLKS!</h2>
            <p>Visit our fundraiser at <a href="https://MandaStrong1.Etsy.com" style={{ color: '#FFFFFF' }}>MandaStrong1.Etsy.com</a></p>
          </div>
        )}
      </div>

      {/* FIXED NAVIGATION AT BOTTOM */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '30px', backgroundColor: '#000000' }}>
        <button 
          onClick={() => setPage(Math.max(1, page - 1))}
          style={{ backgroundColor: '#4B0082', color: '#FFFFFF', border: '1px solid #FFFFFF', padding: '10px 40px', cursor: 'pointer' }}
        >
          Back
        </button>
        <button 
          onClick={() => setPage(Math.min(21, page + 1))}
          style={{ backgroundColor: '#4B0082', color: '#FFFFFF', border: '1px solid #FFFFFF', padding: '10px 40px', cursor: 'pointer' }}
        >
          Next
        </button>
      </div>

    </div>
  );
}