import React, { useState } from 'react';

const COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  purple: '#4B0082' 
};

export default function App() {
  const [page, setPage] = useState(0); 

  return (
    <div style={{ backgroundColor: COLORS.black, color: COLORS.white, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* PAGE 0: SPLASH SCREEN */}
        {page === 0 && (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1 style={{ color: COLORS.purple, fontSize: '4rem' }}>MANDASTRONG STUDIO</h1>
            <button 
              onClick={() => setPage(1)}
              style={{ marginTop: '50px', backgroundColor: COLORS.purple, color: COLORS.white, padding: '20px 50px', border: `1px solid ${COLORS.white}`, cursor: 'pointer', fontSize: '1.5rem' }}
            >
              ENTER STUDIO
            </button>
          </div>
        )}

        {/* PAGE 1: CHOOSE YOUR PLAN - No Free Plan */}
        {page === 1 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: COLORS.purple, fontSize: '2.5rem' }}>Choose Your Plan</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '50px' }}>
              <div style={{ border: `2px solid ${COLORS.purple}`, padding: '40px', width: '200px' }}>Basic $20/month</div>
              <div style={{ border: `2px solid ${COLORS.purple}`, padding: '40px', width: '200px' }}>Pro $30/month</div>
              <div style={{ border: `3px solid ${COLORS.white}`, backgroundColor: COLORS.purple, padding: '40px', width: '200px' }}>Studio $50/month</div>
            </div>
          </div>
        )}

        {/* PAGE 5: CREATIVE STUDIO - Plan Display */}
        {page === 5 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: COLORS.purple, fontSize: '3rem' }}>Creative Studio</h2>
            <p style={{ fontSize: '1.8rem' }}>Your Plan: <span style={{ color: COLORS.purple, fontWeight: 'bold' }}>Studio</span></p>
          </div>
        )}

        {/* PAGE 15: EDITOR'S CHOICE - Clean Layout */}
        {page === 15 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: COLORS.purple, fontSize: '2.5rem' }}>Editor's Choice</h2>
          </div>
        )}

        {/* PAGE 21: FINALE - Video at Top */}
        {page === 21 && (
          <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
            <video width="100%" controls autoPlay style={{ border: `5px solid ${COLORS.purple}`, marginBottom: '30px' }}>
              <source src="/thatsallfolks.mp4" type="video/mp4" />
            </video>
            <h1 style={{ color: COLORS.purple, fontSize: '3.5rem' }}>THAT'S ALL FOLKS!</h1>
            <p>Visit MandaStrong1.Etsy.com</p>
          </div>
        )}
      </div>

      {/* NAVIGATION: Side-by-side & Centered at Bottom */}
      {page !== 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '50px', backgroundColor: COLORS.black }}>
          <button 
            onClick={() => setPage(Math.max(1, page - 1))}
            style={{ backgroundColor: COLORS.purple, color: COLORS.white, border: `1px solid ${COLORS.white}`, padding: '15px 60px', cursor: 'pointer', fontSize: '1.3rem' }}
          >
            Back
          </button>
          <button 
            onClick={() => setPage(Math.min(21, page + 1))}
            style={{ backgroundColor: COLORS.purple, color: COLORS.white, border: `1px solid ${COLORS.white}`, padding: '15px 60px', cursor: 'pointer', fontSize: '1.3rem' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}