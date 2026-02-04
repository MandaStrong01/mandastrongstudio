import React, { useState } from 'react';

export default function App() {
  const [page, setPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // AUTH PAGE - Fix: Change "Sign" to "Login" in two places
  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: '#000000', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#4B0082' }}>Login</h1> 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
          <input type="text" placeholder="Username" style={{ padding: '12px', borderRadius: '4px', border: 'none' }} />
          <input type="password" placeholder="Password" style={{ padding: '12px', borderRadius: '4px', border: 'none' }} />
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
      
      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '20px' }}>
        
        {/* PAGE 1: CHOOSE PLAN - Fix: Remove Free Plan */}
        {page === 1 && (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 style={{ color: '#4B0082', fontSize: '2.5rem' }}>Choose Your Plan</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
              <div style={{ border: '2px solid #4B0082', padding: '30px', width: '200px' }}>
                <h3>Basic</h3>
                <p>$20/month</p>
              </div>
              <div style={{ border: '2px solid #4B0082', padding: '30px', width: '200px' }}>
                <h3>Pro</h3>
                <p>$30/month</p>
              </div>
              <div style={{ border: '3px solid #FFFFFF', backgroundColor: '#4B0082', padding: '30px', width: '200px' }}>
                <h3>Studio</h3>
                <p>$50/month</p>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 5: CREATIVE STUDIO - Fix: Show Studio Plan */}
        {page === 5 && (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#4B0082' }}>Creative Studio</h1>
            <p style={{ fontSize: '1.5rem' }}>Your Plan: <span style={{ color: '#4B0082' }}>Studio</span></p>
          </div>
        )}

        {/* PAGE 15: EDITOR'S CHOICE - Fix: Remove "no movies yet" */}
        {page === 15 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#4B0082' }}>Editor's Choice</h2>
          </div>
        )}

        {/* PAGE 21: FINALE - Fix: Readd video thatsallfolks.mp4 at top */}
        {page === 21 && (
          <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
            <video width="100%" controls autoPlay style={{ border: '4px solid #4B0082', marginBottom: '30px' }}>
              <source src="/thatsallfolks.mp4" type="video/mp4" />
            </video>
            <h1 style={{ color: '#4B0082', fontSize: '3rem' }}>THAT'S ALL FOLKS!</h1>
            <div style={{ padding: '20px', border: '1px solid #4B0082', background: 'rgba(75, 0, 130, 0.1)' }}>
               <p>Visit our fundraiser at <a href="https://MandaStrong1.Etsy.com" style={{ color: '#FFFFFF', textDecoration: 'underline' }}>MandaStrong1.Etsy.com</a></p>
            </div>
          </div>
        )}
      </div>

      {/* NAVIGATION - Fix: Side-by-side and Centered at bottom */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', padding: '40px', background: '#000000' }}>
        <button 
          onClick={() => setPage(Math.max(1, page - 1))}
          style={{ backgroundColor: '#4B0082', color: '#FFFFFF', border: '1px solid #FFFFFF', padding: '15px 50px', cursor: 'pointer', fontSize: '1.2rem' }}
        >
          Back
        </button>
        <button 
          onClick={() => setPage(Math.min(21, page + 1))}
          style={{ backgroundColor: '#4B0082', color: '#FFFFFF', border: '1px solid #FFFFFF', padding: '15px 50px', cursor: 'pointer', fontSize: '1.2rem' }}
        >
          Next
        </button>
      </div>

    </div>
  );
}