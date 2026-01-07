import React, { useState, useEffect } from 'react';
import { 
  Upload, Home, Library, Clock, Music, Settings, Wand2, Terminal, 
  Workflow, MessageSquare, ShieldCheck, ChevronLeft, ChevronRight, 
  Cpu, Layers, Maximize, Sparkles, Database 
} from 'lucide-react';

export default function App() {
  const [page, setPage] = useState(1); // Starts at Node 1 (Home)
  const [showEnhancement, setShowEnhancement] = useState(false);
  
  // Controlled inputs for Node 3
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  // Navigation Component
  const Navigation = () => (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-6 z-[100]">
      <button onClick={() => setPage(Math.max(1, page - 1))} className="bg-zinc-800 px-10 py-4 rounded-full font-black uppercase text-[10px] border border-white/10 hover:bg-white hover:text-black transition-all">← BACK</button>
      <button onClick={() => setPage(Math.min(21, page + 1))} className="bg-purple-600 px-10 py-4 rounded-full font-black uppercase text-[10px] border border-white/10 hover:bg-purple-500 transition-all">NEXT →</button>
    </div>
  );

  // --- NODES 1-2: VIDEO PERSISTENCE ---
  if (page === 1 || page === 2) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 flex flex-col items-center justify-center relative overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
        <source src="background.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 text-center italic font-black">
        {page === 1 ? (
          <>
            <h1 className="text-7xl text-white uppercase tracking-tighter mb-4 leading-none">MANDASTRONG'S STUDIO</h1>
            <p className="text-xl text-white uppercase tracking-widest">Welcome To The All-In-One Make-A-Movie App!</p>
          </>
        ) : (
          <>
            <h2 className="text-5xl text-white uppercase mb-12">Gateway Portal</h2>
            <div className="flex gap-6">
              <button onClick={() => setPage(3)} className="bg-purple-600 px-12 py-5 rounded-xl uppercase hover:scale-105 transition-transform">Login / Register</button>
              <button onClick={() => setPage(3)} className="bg-blue-600 px-12 py-5 rounded-xl uppercase hover:scale-105 transition-transform">Browse Guest</button>
            </div>
          </>
        )}
      </div>
      <Navigation />
    </div>
  );

  // --- NODE 3: FORMS TOP / PLANS BOTTOM ---
  if (page === 3) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 p-10 flex flex-col items-center italic font-black relative overflow-y-auto">
      <div className="w-full max-w-4xl bg-zinc-900/80 p-10 rounded-[3rem] border-2 border-purple-500/30 mb-12 text-center shadow-2xl">
        <h2 className="text-3xl text-white uppercase mb-8">Login / Register</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black p-5 rounded-xl text-white border border-zinc-800 outline-none focus:border-purple-500 transition-all" 
          />
          <input 
            type="password" 
            placeholder="Secure Password" 
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="bg-black p-5 rounded-xl text-white border border-zinc-800 outline-none focus:border-purple-500 transition-all" 
          />
        </div>
        <button onClick={() => setPage(11)} className="bg-purple-600 px-20 py-5 rounded-xl text-white uppercase hover:bg-white hover:text-black transition-all">Enter Studio</button>
      </div>
      <div className="grid grid-cols-3 gap-6 w-full max-w-5xl pb-24 text-center">
        {["Basic — $20", "Pro — $40", "Studio — $80"].map((p, i) => (
          <div key={i} className={`bg-zinc-900 p-6 rounded-2xl border-2 ${i === 1 ? 'border-yellow-500 scale-105' : 'border-zinc-800 opacity-50'}`}>
            <span className="text-white uppercase">{p}</span>
          </div>
        ))}
      </div>
      <Navigation />
    </div>
  );

  // --- NODE 11: EDITOR SUITE / MEDIA LIBRARY ---
  if (page === 11) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 flex relative italic font-black">
      {/* Sidebar Suite */}
      <div className="w-72 border-r border-zinc-800 p-8 flex flex-col gap-4 text-[10px] uppercase">
        <div className="text-white text-xl mb-12 tracking-tighter leading-none">MandaStrong<br/><span className="text-[8px] text-purple-500">Proprietary Engine</span></div>
        <nav className="flex flex-col gap-2">
            <button className="flex items-center gap-4 p-4 text-zinc-500 hover:bg-zinc-900 rounded-xl transition-all"><Home size={18}/> Editor Home</button>
            <button className="flex items-center gap-4 p-4 bg-zinc-900 text-white rounded-xl shadow-lg border border-white/5"><Library size={18}/> Media Library</button>
            <button className="flex items-center gap-4 p-4 text-zinc-500 hover:bg-zinc-900 rounded-xl transition-all"><Clock size={18}/> Timeline</button>
            <button className="flex items-center gap-4 p-4 text-zinc-500 hover:bg-zinc-900 rounded-xl transition-all"><Music size={18}/> Audio Mixer</button>
            <button className="flex items-center gap-4 p-4 text-zinc-500 hover:bg-zinc-900 rounded-xl transition-all"><Settings size={18}/> Settings</button>
        </nav>
      </div>

      {/* Media Library Main Content */}
      <div className="flex-1 p-12 flex flex-col relative">
        <header className="flex justify-between items-center mb-12">
          <h2 className="text-5xl text-white uppercase tracking-tighter leading-none">MEDIA LIBRARY</h2>
          {/* THE ENHANCEMENT STUDIO ATTACHMENT BUTTON */}
          <button onClick={() => setShowEnhancement(true)} className="bg-purple-600 px-10 py-5 rounded-xl uppercase text-xs text-white flex items-center gap-3 shadow-2xl hover:bg-white hover:text-black transition-all border border-white/10">
            <Wand2 size={18}/> Enhancement Studio Attachment
          </button>
        </header>

        <div className="flex-1 bg-zinc-950 border-4 border-dashed border-zinc-900 rounded-[5rem] flex flex-col items-center justify-center text-center group hover:border-purple-500 transition-all">
          <Upload size={64} className="text-zinc-800 mb-6 group-hover:text-purple-500 transition-all" />
          <p className="text-white uppercase text-xl mb-2">Upload or Drag Assets</p>
          <p className="text-zinc-700 uppercase text-[10px]">Vault Currently Empty</p>
        </div>
        <Navigation />
      </div>

      {/* ENHANCEMENT STUDIO OVERLAY (Neural Attachment) */}
      {showEnhancement && (
        <div className="fixed inset-0 z-[200] bg-black p-10 flex flex-col animate-in slide-in-from-right duration-500">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-5xl text-purple-500 uppercase flex items-center gap-4 leading-none"><Terminal size={40}/> Global Enhancement Studio</h2>
            <button onClick={() => setShowEnhancement(false)} className="bg-purple-600 px-10 py-4 rounded-full uppercase text-white font-black hover:bg-white hover:text-black transition-all border-2 border-white/10">Close Studio</button>
          </div>
          <div className="flex-1 bg-zinc-900/20 border-4 border-zinc-800 rounded-[5rem] flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent animate-pulse" />
             <Workflow size={100} className="text-zinc-800 animate-spin-slow relative z-10" />
          </div>
        </div>
      )}
    </div>
  );

  // AI Tool Board (4-9)
  if (page >= 4 && page <= 9) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 p-10 flex flex-col relative italic font-black">
      <h2 className="text-6xl text-white uppercase mb-10 tracking-tighter">AI TOOL BOARD</h2>
      <div className="grid grid-cols-4 gap-6 flex-1 mb-20">
        {[{n:"Neural Sync",i:<Cpu/>},{n:"Texture Synth",i:<Layers/>},{n:"Flow Sync",i:<Maximize/>},{n:"Logic Sculpt",i:<Sparkles/>}].map((t, idx) => (
          <div key={idx} className="bg-zinc-900/50 border-2 border-zinc-800 p-8 rounded-3xl flex flex-col items-center justify-center hover:border-purple-500 transition-all cursor-pointer group">
            <div className="text-zinc-700 group-hover:text-purple-500 transition-all mb-4 scale-150">{t.i}</div>
            <span className="text-white uppercase text-xs">{t.n}</span>
          </div>
        ))}
      </div>
      <Navigation />
    </div>
  );

  // --- NODE 19: GROK HELP DESK ---
  if (page === 19) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 p-20 flex flex-col items-center italic font-black relative">
      <MessageSquare size={64} className="text-purple-500 mb-8" />
      <h2 className="text-5xl text-white uppercase mb-12 tracking-tighter">Grok Help Desk</h2>
      <div className="w-full max-w-4xl bg-zinc-900 border-2 border-zinc-800 p-10 rounded-[3rem]">
        <div className="p-6 bg-zinc-950 text-white rounded-2xl border border-purple-600/30 mb-8">Grok: Analyzing engine status... All MandaStrong parameters are synchronized for correct answers only.</div>
        <div className="flex gap-4">
          <input type="text" placeholder="Query the Agent..." className="flex-1 bg-black p-5 rounded-2xl text-white border border-zinc-800 outline-none focus:border-purple-500" />
          <button className="bg-purple-600 px-10 rounded-2xl text-white uppercase hover:bg-white hover:text-black transition-all">Ask</button>
        </div>
      </div>
      <Navigation />
    </div>
  );

  // --- NODE 21: THANK YOU ---
  if (page === 21) return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 flex flex-col items-center justify-center relative overflow-hidden italic font-black text-center">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80">
        <source src="thatsallfolk.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 animate-in fade-in duration-1000">
        <h2 className="text-8xl text-white uppercase tracking-tighter mb-12 drop-shadow-2xl">THANK YOU</h2>
        <button onClick={() => setPage(1)} className="bg-white text-black px-16 py-6 rounded-full uppercase text-xl font-black hover:bg-purple-600 hover:text-white transition-all">RESTART ENGINE</button>
      </div>
    </div>
  );

  // Fallback / Nodes not yet defined
  return (
    <div className="h-screen bg-black border-[20px] border-zinc-900 flex flex-col items-center justify-center italic font-black relative">
      <h2 className="text-9xl text-white opacity-10 tracking-tighter leading-none">NODE {page}</h2>
      <Navigation />
    </div>
  );
}