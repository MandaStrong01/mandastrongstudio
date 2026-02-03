import React, { useState, useEffect } from 'react';

export default function App() {
  const [page, setPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Force build update timestamp: 2026-02-03-1013
  useEffect(() => {
    console.log("MandaStrong Studio 2025 - Build Active");
  }, []);

  // 1. AUTH PAGE: Login text in 2 places
  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: '#000000', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#4B0082', fontSize: '3rem', marginBottom: '30px' }}>Login</h1> 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '350px' }}>
          <input type="text" placeholder="Username" style={{ padding: '15px', border: '1px solid #4B0082', background: '#000000', color: '#FFFFFF' }} />
          <input type="password" placeholder="Password" style={{ padding: '15px', border: '1px solid #4B0082', background: '#000000', color: '#FFFFFF' }} />
          <button 
            onClick={() => setIsLoggedIn(true)} 
            style={{ backgroundColor: '#4B0082', color: '#FFFFFF', border: '1px solid #FFFFFF', padding: '15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ flex: 1, padding: '40px' }}>
        
        {/* PAGE 1: No Free Plan */}
        {page === 1 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#4B0082', fontSize: '2.5rem' }}>Choose Your Plan</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '50px' }}>
              <div style={{ border: '2px solid #4B0082', padding: '40px', width: '250px' }}>
                <h3>Basic</h3>
                <p>$20/month</p>
              </div>
              <div style={{ border: '2px solid #4B0082', padding: '40px', width: '250px' }}>
                <h3>Pro</h3>
                <p>$30/month</p>
              </div>
              <div style={{ border: '3px solid #FFFFFF', backgroundColor: '#4B0082', padding: '40px', width: '250px' }}>
                <h3>Studio</h3>
                <p>$50/month</p>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 5: Creative Studio Plan display */}
        {page === 5 && (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#4B0082', fontSize: '3rem' }}>Creative Studio</h1>
            <p style={{ fontSize: '1.8rem' }}>Your Plan: <span style={{ color: '#4B0082', fontWeight: 'bold' }}>Studio</span></p>
          </div>
        )}

        {/* PAGE 15: Editor's Choice - "no movies yet" removed */}
        {page === 15 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#4B0082', fontSize: '2.5rem' }}>Editor's Choice</h2>
          </div>
        )}

        {/* PAGE 21: Video thatsallfolks.mp4 at top */}
        {page === 21 && (
          <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
            <video width="100%" controls autoPlay style={{ border: '5px solid #4B0082', marginBottom: '30px' }}>
              <source src="/thatsallfolks.mp4" type="video/mp4" />
            </video>
            <h1 style={{ color: '#4B0082', fontSize: '3.5rem' }}>THAT'S ALL FOLKS!</h1>
            <div style={{ marginTop: '20px', fontSize: '1.2rem' }}>
              <p>Visit our fundraiser at <a href="https://MandaStrong1.Etsy.com" style={{ color: '#FFFFFF' }}>MandaStrong1.Etsy.com</a></p>
            </div>
          </div>
        )}

        {/* Placeholder for intermediate pages */}
        {(page !== 1 && page !== 5 && page !== 15 && page !== 21) && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#4B0082' }}>Page {page}</h2>
            <p>Project Content Area</p>
          </div>
        )}
      </div>

      {/* NAVIGATION: Side-by-side & Centered at bottom */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '50px', backgroundColor: '#000000' }}>
        <button 
          onClick={() => setPage(Math.max(1, page - 1))}
          style={{ backgroundColor: '#4B0082', color: '#FFFFFF', border: '1px solid #FFFFFF', padding: '15px 60px', cursor: 'pointer', fontSize: '1.3rem', fontWeight: 'bold' }}
        >
          Back
        </button>
        <button 
          onClick={() => setPage(Math.min(21, page + 1))}
          style={{ backgroundColor: '#4B0082', color: '#FFFFFF', border: '1px solid #FFFFFF', padding: '15px 60px', cursor: 'pointer', fontSize: '1.3rem', fontWeight: 'bold' }}
        >
          Next
        </button>
      </div>

    </div>
  );
}