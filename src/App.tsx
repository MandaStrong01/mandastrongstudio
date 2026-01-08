import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [page, setPage] = useState(1);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && page <= 2) {
      videoRef.current.play().catch(() => {});
    }
  }, [page]);

  const Navigation = () => (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-[100]">
      <button onClick={() => setPage(Math.max(1, page - 1))} className="bg-black text-white px-6 py-2 rounded-full font-black uppercase text-[10px] border border-white/20">BACK</button>
      <button onClick={() => setPage(Math.min(21, page + 1))} className="bg-black text-white px-6 py-2 rounded-full font-black uppercase text-[10px] border border-white/20">NEXT</button>
    </div>
  );

  return (
    <div className="h-screen bg-black overflow-hidden relative font-black italic">
      <video ref={videoRef} className={`absolute inset-0 w-full h-full object-cover transition-opacity ${page <= 2 ? 'opacity-100' : 'opacity-0'}`} src="background.mp4" loop playsInline />
      
      {/* NODE 1: THE STUDIO SPLASH */}
      {page === 1 && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-7xl text-black uppercase leading-none font-black">MANDASTRONG'S STUDIO</h1>
          <button onClick={() => setPage(3)} className="absolute bottom-20 bg-black text-white px-10 py-3 rounded-xl font-black uppercase">Enter Studio</button>
        </div>
      )}

      {/* NODE 3: THE BUSINESS PRICING ($20, $40, $80) */}
      {page === 3 && (
        <div className="h-full bg-black flex flex-col items-center p-8 border-[15px] border-zinc-900 overflow-y-auto pb-32">
          <div className="grid grid-cols-2 gap-6 w-full max-w-5xl mb-10">
            <div className="bg-[#1a0b2e] p-8 rounded-3xl border-2 border-purple-500/30 text-white text-center font-black uppercase"><h2>Login</h2></div>
            <div className="bg-[#1a0b2e] p-8 rounded-3xl border-2 border-purple-500/30 text-white text-center font-black uppercase"><h2>Register</h2></div>
          </div>
          <div className="grid grid-cols-3 gap-6 w-full max-w-6xl">
            {[{t:"Basic", p:"20"}, {t:"Pro", p:"40"}, {t:"Studio", p:"80"}].map((p, i) => (
              <div key={i} className="bg-[#0d0517] p-8 rounded-2xl border-2 border-purple-500/10 text-white text-center font-black">
                <h3 className="uppercase">{p.t}</h3>
                <div className="text-6xl font-black tracking-tighter">${p.p}</div>
                <button onClick={() => setPage(4)} className="w-full bg-purple-600 mt-4 py-3 rounded-xl uppercase">Select</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FALLBACK FOR NODES 4-21 */}
      {![1,3].includes(page) && (
        <div className="h-full bg-black border-[20px] border-zinc-900 flex flex-col items-center justify-center text-white italic font-black opacity-10 uppercase text-9xl">Node {page}</div>
      )}
      <Navigation />
    </div>
  );
}