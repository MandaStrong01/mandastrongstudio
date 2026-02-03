import React, { useState, useEffect } from 'react';

export default function App() {
  const [page, setPage] = useState(0); // Starts at Page 0 (Splash)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Theme Colors
  const purple = '#4B0082';
  const black = '#000000';
  const white = '#FFFFFF';

  // AUTH PAGE: Login text in 2 places
  const LoginPage = () => (
    <div style={{ backgroundColor: black, color: white, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: purple, fontSize: '3rem', marginBottom: '30px' }}>Login</h1> 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '350px' }}>
        <input type="text" placeholder="Username" style={{ padding: '15px', border: `1px solid ${purple}`, background: black, color: white }} />
        <input type="password" placeholder="Password" style={{ padding: '15px', border: `1px solid ${purple}`, background: black, color: white }} />
        <button 
          onClick={() => setIsLoggedIn(true)} 
          style={{ backgroundColor: purple, color: white, border: `1px solid ${white}`, padding: '15px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Login
        </button>
      </div>
    </div>
  );

  // Redirect to Login if not logged in (unless on Splash page)
  if (page !== 0 && !isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div style={{ backgroundColor: black, color: white, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ flex: 1, padding: '40px' }}>
        
        {/* PAGE 0: SPLASH SCREEN */}
        {page === 0 && (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1 style={{ color: purple, fontSize: '4rem' }}>MANDASTRONG STUDIO</h1>
            <p style={{ fontSize: '1.5rem', marginTop: '20px' }}>2025 Cinematic Edition</p>
            <button 
              onClick={() => setPage(1)}
              style={{ marginTop: '50px', backgroundColor: purple, color: white, padding: '20px 50px', border: `1px solid ${white}`, cursor: 'pointer', fontSize: '1.5rem' }}
            >
              ENTER STUDIO
            </button>
          </div>
        )}

        {/* PAGE 1: CHOOSE PLAN (No Free Plan) */}
        {page === 1 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: purple, fontSize: '2.5rem' }}>Choose Your Plan</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '50px' }}>
              <div style={{ border: `2px solid ${purple}`, padding: '40px', width: '250px' }}>Basic $20/month</div>
              <div style={{ border: `2px solid ${purple}`, padding: '40px', width: '250px' }}>Pro $30/month</div>
              <div style={{ border: `3px solid ${white}`, backgroundColor: purple, padding: '40px', width: '250px' }}>Studio $50/month</div>
            </div>
          </div>
        )}

        {/* PAGE 5: CREATIVE STUDIO (Plan: Studio) */}
        {page === 5 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: purple, fontSize: '3rem' }}>Creative Studio</h2>
            <p style={{ fontSize: '1.8rem' }}>Your Plan: <span style={{ color: purple, fontWeight: 'bold' }}>Studio</span></p>
          </div>
        )}

        {/* PAGE 15: EDITOR'S CHOICE (Removed "no movies yet") */}
        {page === 15 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: purple, fontSize: '2.5rem' }}>Editor's Choice</h2>
          </div>
        )}

        {/* PAGE 21: FINALE (Video at top) */}
        {page === 21 && (
          <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
            <video width="100%" controls autoPlay style={{ border: `5px solid ${purple}`, marginBottom: '30px' }}>
              <source src="/thatsallfolks.mp4" type="video/mp4" />
            </video>
            <h1 style={{ color: purple, fontSize: '3.5rem' }}>THAT'S ALL FOLKS!</h1>
            <p style={{ marginTop: '20px' }}>Visit <a href="https://MandaStrong1.Etsy.com" style={{ color: white }}>MandaStrong1.Etsy.com</a></p>
          </div>
        )}

        {/* Content for other pages */}
        {(page > 1 && page !== 5 && page !== 15 && page !== 21) && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: purple }}>Page {page}</h2>
            <p>App Content Area</p>
          </div>
        )}
      </div>

      {/* NAVIGATION: Side-by-side and Centered at bottom */}
      {page !== 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '50px' }}>
          <button 
            onClick={() => setPage(Math.max(1, page - 1))}
            style={{ backgroundColor: purple, color: white, border: `1px solid ${white}`, padding: '15px 60px', cursor: 'pointer', fontSize: '1.3rem' }}
          >
            Back
          </button>
          <button 
            onClick={() => setPage(Math.min(21, page + 1))}
            style={{ backgroundColor: purple, color: white, border: `1px solid ${white}`, padding: '15px 60px', cursor: 'pointer', fontSize: '1.3rem' }}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}