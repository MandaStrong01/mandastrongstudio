import React, { useState } from 'react';

const COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  purple: '#4B0082' 
};

export default function App() {
  const [page, setPage] = useState(0);
  const [duration, setDuration] = useState(90);

  const renderContent = () => {
    switch(page) {
      case 0: return (
        <div style={{ textAlign: 'center', marginTop: '15vh' }}>
          <h1 style={{ color: COLORS.purple, fontSize: '5rem', fontWeight: 'bold', fontFamily: 'Impact, sans-serif' }}>MANDASTRONG STUDIO</h1>
          <button onClick={() => setPage(1)} style={{ marginTop: '50px', backgroundColor: COLORS.purple, color: COLORS.white, padding: '25px 70px', border: '2px solid #FFFFFF', cursor: 'pointer', fontSize: '2rem', borderRadius: '8px' }}>ENTER STUDIO</button>
        </div>
      );
      case 1: return (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: COLORS.purple, fontSize: '3.5rem', fontFamily: 'Impact, sans-serif' }}>MANDASTRONG STUDIO 2025</h1>
          <div style={{ height: '40vh', margin: '20px 0', border: `3px solid ${COLORS.purple}`, position: 'relative', overflow: 'hidden' }}>
             <video autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
               <source src="/background__2_.mp4" type="video/mp4" />
             </video>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
            <div style={{ border: `2px solid ${COLORS.purple}`, padding: '20px', width: '150px', background: 'rgba(0,0,0,0.6)' }}>Basic $20</div>
            <div style={{ border: `2px solid ${COLORS.purple}`, padding: '30px', width: '150px', background: 'rgba(0,0,0,0.6)' }}>Pro $40</div>
            <div style={{ backgroundColor: COLORS.purple, border: `2px solid ${COLORS.white}`, padding: '40px', width: '150px' }}>Studio $80</div>
          </div>
        </div>
      );
      case 5: return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '200px', height: '300px', borderRadius: '50%', overflow: 'hidden', border: `4px solid ${COLORS.purple}`, margin: '0 auto 20px' }}>
            <video autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
              <source src="/avatar.mp4" type="video/mp4" />
            </video>
          </div>
          <h2 style={{ color: COLORS.purple, fontSize: '3rem' }}>AI TOOL BOARDS</h2>
          <p style={{ fontSize: '1.5rem' }}>Integrating 600+ AI Tools</p>
        </div>
      );
      case 14: return (
        <div style={{ textAlign: 'center', marginTop: '10vh' }}>
          <h2 style={{ color: COLORS.purple, fontSize: '3rem' }}>FILM DURATION</h2>
          <div style={{ marginTop: '50px' }}>
            <label style={{ fontSize: '3rem', display: 'block' }}>{duration} Minutes</label>
            <input type="range" min="0" max="180" value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={{ width: '80%', accentColor: COLORS.purple, height: '25px' }} />
            <p style={{ marginTop: '15px', fontSize: '1.2rem' }}>0 to 3 Hours Max</p>
          </div>
        </div>
      );
      case 21: return (
        <div style={{ textAlign: 'center' }}>
          <video width="100%" controls autoPlay style={{ border: `5px solid ${COLORS.purple}`, maxWidth: '1000px' }}>
            <source src="/thatsallfolks.mp4" type="video/mp4" />
          </video>
          <h1 style={{ color: COLORS.purple, fontSize: '4rem', marginTop: '20px', fontFamily: 'Impact, sans-serif' }}>THAT'S ALL FOLKS!</h1>
          <p style={{ fontSize: '1.5rem' }}>Visit <a href="https://MandaStrong1.Etsy.com" style={{ color: COLORS.white, fontWeight: 'bold' }}>MandaStrong1.Etsy.com</a></p>
        </div>
      );
      default: return (
        <div style={{ textAlign: 'center', marginTop: '5vh' }}>
          <h2 style={{ color: COLORS.purple, fontSize: '2.5rem' }}>Studio Page {page}</h2>
          <div style={{ width: '90%', height: '50vh', background: '#0a0a0a', border: '1px solid #333', margin: '20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#333', fontSize: '1.5rem' }}>[Image Asset {page}]</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div style={{ backgroundColor: COLORS.black, color: COLORS.white, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '40px' }}>
        {renderContent()}
      </div>
      {page !== 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', paddingBottom: '70px' }}>
          <button onClick={() => setPage(Math.max(1, page - 1))} style={{ backgroundColor: COLORS.purple, color: COLORS.white, border: '1px solid #FFFFFF', padding: '20px 80px', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}>Back</button>
          <button onClick={() => setPage(Math.min(21, page + 1))} style={{ backgroundColor: COLORS.purple, color: COLORS.white, border: '1px solid #FFFFFF', padding: '20px 80px', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}>Next</button>
        </div>
      )}
    </div>
  );
}