import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Sparkles, ChevronRight, ChevronLeft, CheckCircle, Play, Upload, 
  MessageCircle, Film, Lock, UserPlus, Mail, Key, User, Video as VideoIcon,
  Database, FileVideo, Heart, TrendingUp, Send
} from 'lucide-react';

// 600 AI TOOLS - PROFESSIONAL GENERATOR
const generateTools = (category) => {
  const baseTools = {
    Writing: ["Neural Script Architect", "DeepPlot Narrative AI", "Dialogue Synthesis Engine", "Character Core Logic", "Three-Act Quantum Solver", "Arc Flow Optimizer", "DeepLore Neural Link", "Subtext Logic Synth", "Scene-Beat Optimizer", "Climatic Logic Pro", "Backstory Neural Weaver", "Protagonist Core Lab"],
    Voice: ["Neural Vocal Clone Pro", "Atmospheric Timbre Synth", "Emotion-Depth Modulator", "Sonic Dialect Weaver", "DeepBreath Neural AI", "Vocal Clarity Engine", "Resonance Mapping Pro", "Linguistic Flow Lab", "Neural Accent Synthesis", "Studio Harmony Logic", "Whisper-Logic Pro", "Vocal Identity Synth"],
    Image: ["Neural Asset Architect", "Quantum Texture Mapper", "VFX Plate Synthesis", "Matte Painting Logic", "Atmospheric Light Engine", "Skin-Shader Neural Lab", "Depth-Field Logic Pro", "Style Transfer Matrix", "Background Weaver AI", "Cinematic Grain Synth", "Reflection Logic Engine", "Particle Physics Synth"],
    Video: ["Temporal Motion Synth", "Cinematic Camera Logic", "Neural Avatar Rigger", "Dynamic Pan AI", "Crane Shot Simulator", "Dolly Zoom Neural Pro", "Tracking Shot Logic", "Frame Interpolation Pro", "Depth Motion Synth", "Action-Sequence Weaver", "Perspective Shift AI", "Dynamic Focus Lab"],
    Motion: ["Skeleton Tracker Pro", "Neural Mocap Logic", "Fluid Physics Engine", "Cloth Dynamics AI", "Facial Logic Synthesis", "Joint Precision Engine", "Gravity Simulator Lab", "Collision Matrix Pro", "Soft-Body Neural Pro", "Muscle-Fiber Logic", "Impact Logic Mapper", "Auto-Rigger Neural V2"]
  };
  const list = [];
  const tools = baseTools[category] || baseTools["Writing"];
  for (let i = 0; i < 120; i++) {
    list.push(`${tools[i % tools.length]}${i >= tools.length ? ` PRO ${Math.floor(i / tools.length)}` : ""}`.toUpperCase());
  }
  return list;
};

const BOARD_DATA = {
  Writing: generateTools("Writing"),
  Voice: generateTools("Voice"),
  Image: generateTools("Image"),
  Video: generateTools("Video"),
  Motion: generateTools("Motion")
};

// FIX 1: SPLASH PAGE
const SplashPage = ({ onContinue }) => (
  <div onClick={onContinue} className="h-screen bg-black flex items-center justify-center cursor-pointer">
    <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at center, rgba(147,51,234,0.5) 0%, #000 75%)'}}></div>
    <div className="relative z-10 text-center animate-pulse">
      <div className="w-56 h-56 mx-auto rounded-full border-4 border-purple-600 flex items-center justify-center mb-12" style={{boxShadow:'0 0 100px rgba(147,51,234,0.7)'}}>
        <Film className="w-32 h-32 text-purple-400" strokeWidth={1.5} />
      </div>
      <h1 className="text-9xl font-black text-white mb-4 uppercase" style={{fontFamily:'Impact,sans-serif',letterSpacing:'0.2em',textShadow:'0 0 80px rgba(147,51,234,0.9)'}}>
        MANDASTRONG
      </h1>
      <h2 className="text-6xl font-bold text-purple-400 mb-20 uppercase" style={{letterSpacing:'0.5em'}}>STUDIO</h2>
      <div className="w-40 h-1 rounded-full mx-auto mb-16 bg-purple-500"></div>
      <p className="text-white text-2xl">Tap anywhere to continue</p>
    </div>
  </div>
);

export default function App() {
  // FIX 2: STATE MANAGEMENT
  const [showSplash, setShowSplash] = useState(true);
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Studio');
  const videoRef = useRef(null);

  // FIX 3: SPLASH CONTROL
  if (showSplash) {
    return <SplashPage onContinue={() => setShowSplash(false)} />;
  }

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if ([1, 2, 10, 21].includes(page)) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [page]);

  const goTo = (p) => { setPage(p); setMenuOpen(false); };

  // FIX 4: CENTERED NAVIGATION
  const Navigation = () => {
    if (page === 1 || page === 21) return null;
    return (
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[400] flex gap-6">
        {page > 1 && (
          <button onClick={() => setPage(page - 1)} className="bg-zinc-950 border-2 border-purple-600 px-12 py-3 rounded-full font-black uppercase text-purple-400 hover:bg-purple-600 hover:text-white transition-all shadow-2xl flex items-center gap-2">
            <ChevronLeft size={18} /> Back
          </button>
        )}
        {page < 21 && (
          <button onClick={() => setPage(page + 1)} className="bg-purple-600 border-2 border-purple-600 px-12 py-3 rounded-full font-black uppercase text-white hover:bg-purple-700 transition-all shadow-2xl flex items-center gap-2">
            Next <ChevronRight size={18} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* FIX 5: WATERMARK REMOVAL */}
      <style dangerouslySetInnerHTML={{__html:`
        [data-bolt-badge], .bolt-badge, #bolt-badge, a[href*="bolt"], 
        div[class*="fixed"][class*="bottom"] iframe, [class*="made-in"], 
        [id*="bolt"], footer[class*="bolt"] { 
          display: none !important; visibility: hidden !important; 
        }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #9333ea; border-radius: 10px; }
      `}}/>

      {/* MENU */}
      {page > 0 && (
        <div className="fixed top-6 right-6 z-[300]">
          <button onClick={() => setMenuOpen(!menuOpen)} className="bg-purple-600 p-3 rounded-full shadow-2xl text-white hover:scale-110 transition">
            <Menu size={20} />
          </button>
          {menuOpen && (
            <div className="absolute top-14 right-0 bg-zinc-950 border-2 border-purple-600 p-4 rounded-2xl w-56 shadow-2xl">
              {[{p:1, l:"Home"}, {p:4, l:"AI Hub"}, {p:11, l:"Editor"}, {p:19, l:"Help"}, {p:21, l:"Finish"}].map((item) => (
                <button key={item.p} onClick={() => goTo(item.p)} className="w-full text-left text-xs font-black uppercase text-purple-400 p-3 hover:bg-purple-600 hover:text-white rounded-lg transition mb-1">
                  {item.l}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HELP BUBBLE - FROM PAGE 1 */}
      {page >= 1 && (
        <button onClick={() => setPage(19)} className="fixed bottom-6 right-6 z-[500] bg-purple-600 p-4 rounded-full shadow-[0_0_40px_rgba(147,51,234,0.8)] border-2 border-purple-400 hover:scale-110 transition">
          <MessageCircle size={24} className="text-white" />
        </button>
      )}

      {/* FOOTER */}
      {page >= 3 && (
        <div className="fixed bottom-0 left-0 w-full bg-black/95 py-3 text-center z-[350] border-t-2 border-purple-600">
          <p className="text-xs uppercase font-black text-purple-300 tracking-widest">
            MandaStrong Studio 2025 • Author of Doxy The School Bully • MandaStrong1.Etsy.com
          </p>
        </div>
      )}

      <Navigation />

      {/* VIDEO BACKGROUND */}
      {[1, 2, 10, 21].includes(page) && (
        <div className="absolute inset-0 z-0 bg-black">
          <video ref={videoRef} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
            <source src="background.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      <main className="relative z-10 min-h-screen">
        
        {/* PAGE 1: HOME - FIX 6: CORRECT BUTTONS */}
        {page === 1 && (
          <div className="h-screen flex flex-col justify-center items-center text-center px-6">
            <h1 className="text-7xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
              MandaStrong Studio
            </h1>
            <p className="text-2xl md:text-3xl font-black italic text-purple-400 max-w-3xl mb-16 uppercase tracking-tight">
              Professional cinema production platform with AI-powered tools for creating feature-length films up to 3 hours
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button onClick={() => setPage(2)} className="bg-white text-black px-16 py-5 rounded-2xl font-black uppercase text-2xl hover:scale-105 transition shadow-2xl">Next</button>
              <button onClick={() => setPage(3)} className="bg-purple-600 text-white px-16 py-5 rounded-2xl font-black uppercase text-2xl hover:scale-105 transition shadow-xl border-2 border-purple-400">Login</button>
              <button onClick={() => setPage(3)} className="bg-purple-600 text-white px-16 py-5 rounded-2xl font-black uppercase text-2xl hover:scale-105 transition shadow-xl border-2 border-purple-400">Register</button>
            </div>
          </div>
        )}

        {/* PAGE 2: MISSION */}
        {page === 2 && (
          <div className="h-screen flex flex-col justify-center items-center text-center px-4">
            <Sparkles size={80} className="text-purple-500 mb-8 animate-pulse" />
            <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter mb-8">MANDASTRONG'S STUDIO</h1>
            <p className="text-4xl md:text-6xl font-black text-purple-400 italic uppercase max-w-4xl leading-tight">Make Awesome Family Movies & Bring Dreams To Life!</p>
          </div>
        )}

        {/* PAGE 3: AUTH & PRICING - FIX 7 & 8: NO FREE PLAN + AMANDA STRONG */}
        {page === 3 && (
          <div className="p-6 pt-16 pb-40 max-w-7xl mx-auto overflow-y-auto custom-scrollbar">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              {/* SIGN IN */}
              <div className="bg-zinc-950 border-2 border-purple-600 p-8 rounded-3xl">
                <h3 className="text-2xl font-black uppercase italic mb-6 text-purple-400 flex items-center gap-2">
                  <Lock size={20}/> Sign In
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" size={18}/>
                    <input type="email" placeholder="Email Address" className="w-full bg-black border-2 border-purple-600 p-4 pl-12 rounded-xl text-white focus:border-purple-400 outline-none" />
                  </div>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" size={18}/>
                    <input type="password" placeholder="Password" className="w-full bg-black border-2 border-purple-600 p-4 pl-12 rounded-xl text-white focus:border-purple-400 outline-none" />
                  </div>
                  <button className="w-full bg-purple-600 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-purple-700">Sign In</button>
                </div>
              </div>

              {/* REGISTER */}
              <div className="bg-zinc-950 border-2 border-purple-600 p-8 rounded-3xl">
                <h3 className="text-2xl font-black uppercase italic mb-6 text-purple-400 flex items-center gap-2">
                  <UserPlus size={20}/> Create Account
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" size={18}/>
                    <input type="text" placeholder="Full Name" className="w-full bg-black border-2 border-purple-600 p-4 pl-12 rounded-xl text-white focus:border-purple-400 outline-none" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" size={18}/>
                    <input type="email" placeholder="Email Address" className="w-full bg-black border-2 border-purple-600 p-4 pl-12 rounded-xl text-white focus:border-purple-400 outline-none" />
                  </div>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600" size={18}/>
                    <input type="password" placeholder="Password" className="w-full bg-black border-2 border-purple-600 p-4 pl-12 rounded-xl text-white focus:border-purple-400 outline-none" />
                  </div>
                  <button className="w-full bg-zinc-900 border-2 border-purple-600 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-purple-600">Register</button>
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-black text-center mb-10 uppercase italic text-purple-400">Choose Your Plan</h2>
            
            {/* FIX 8: AMANDA STRONG - STUDIO PLAN */}
            <div className="text-center mb-10">
              <h3 className="text-3xl font-black text-white uppercase">AMANDA STRONG</h3>
              <p className="text-lg font-bold text-purple-400 uppercase tracking-widest">Studio Plan</p>
            </div>

            {/* FIX 7: BASIC $20, PRO $30, STUDIO $50 (NO FREE) */}
            <div className="grid md:grid-cols-3 gap-6 mb-20">
              {[
                {t:'Basic', p:'20', d:['HD Export', '100 AI Tools', 'Basic Templates', '10GB Storage', 'Email Support']},
                {t:'Pro', p:'30', d:['4K Export', '300 AI Tools', 'Premium Templates', '100GB Storage', 'Priority Support', 'Commercial License'], popular: true},
                {t:'Studio', p:'50', d:['8K Export', 'All 600 AI Tools', 'Unlimited Templates', '1TB Storage', '24/7 Live Support', 'Full Commercial Rights', 'Team Collaboration']}
              ].map(plan => (
                <div key={plan.t} className={`bg-zinc-950 border-2 rounded-3xl p-8 transition ${selectedPlan === plan.t ? 'border-purple-500 shadow-[0_0_50px_rgba(147,51,234,0.6)]' : 'border-purple-700'}`}>
                  {plan.popular && <div className="bg-purple-600 text-xs font-black uppercase px-4 py-1 rounded-full w-fit mb-4">Most Popular</div>}
                  <h3 className="text-2xl font-black uppercase italic mb-2 text-white">{plan.t}</h3>
                  <div className="text-5xl font-black text-purple-400 mb-10">${plan.p}<span className="text-sm opacity-50">/mo</span></div>
                  <ul className="space-y-3 mb-10">
                    {plan.d.map(item => (
                      <li key={item} className="text-xs font-bold uppercase flex items-center gap-2 text-white/80">
                        <CheckCircle size={12} className="text-purple-500" /> {item}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setSelectedPlan(plan.t)} className={`w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest ${selectedPlan === plan.t ? 'bg-purple-600 text-white' : 'bg-zinc-900 text-purple-400 hover:bg-purple-600 hover:text-white'}`}>
                    {selectedPlan === plan.t ? 'Selected' : 'Choose Plan'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 4: AI HUB */}
        {page === 4 && (
          <div className="p-8 pt-20 pb-40 max-w-7xl mx-auto text-center">
            <h1 className="text-7xl font-black uppercase italic text-purple-400 mb-16">AI HUB DIRECTORY</h1>
            <div className="grid md:grid-cols-3 gap-8">
              {["Writing", "Voice", "Image", "Video", "Motion"].map((cat, i) => (
                <div key={cat} onClick={() => setPage(5+i)} className="bg-zinc-950 border-2 border-purple-700 rounded-[40px] p-12 hover:border-purple-500 transition cursor-pointer shadow-2xl hover:shadow-[0_0_50px_rgba(147,51,234,0.6)]">
                  <div className="text-8xl mb-8">{["✍️", "🎙️", "🎨", "🎬", "🎭"][i]}</div>
                  <h3 className="text-4xl font-black uppercase italic mb-2 text-white">{cat} Board</h3>
                  <p className="text-sm font-black text-purple-400 uppercase tracking-widest">120 Professional Tools</p>
                </div>
              ))}
              <div onClick={() => setPage(10)} className="bg-zinc-950 border-2 border-purple-700 rounded-[40px] p-12 hover:border-purple-500 transition cursor-pointer shadow-2xl">
                <div className="text-8xl mb-8">⭐</div>
                <h3 className="text-4xl font-black uppercase italic mb-2 text-white">Editor's Choice</h3>
              </div>
            </div>
          </div>
        )}

        {/* AI BOARDS (5-9) */}
        {(page >= 5 && page <= 9) && (
          <div className="p-8 pt-20 pb-40 max-w-6xl mx-auto">
            <h2 className="text-6xl font-black uppercase italic text-purple-400 mb-10">{["Writing", "Voice", "Image", "Video", "Motion"][page-5]} BOARD</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BOARD_DATA[["Writing", "Voice", "Image", "Video", "Motion"][page-5]].map((tool, i) => (
                <button key={i} className="bg-zinc-950 border-2 border-purple-700 p-6 rounded-2xl text-left hover:border-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] transition">
                  <span className="text-xs font-black uppercase text-white italic">{tool}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 10: EDITOR'S CHOICE */}
        {page === 10 && (
          <div className="h-screen flex flex-col justify-center items-center text-center p-8">
            <h1 className="text-8xl font-black uppercase italic text-purple-400 mb-16">Editor's Choice</h1>
            <div className="w-full max-w-4xl aspect-video bg-zinc-950 rounded-[60px] border-4 border-purple-600 shadow-[0_0_80px_rgba(147,51,234,0.6)] flex flex-col items-center justify-center">
              <Upload size={100} className="text-purple-500 mb-8 animate-bounce" />
              <button onClick={() => setPage(11)} className="bg-purple-600 text-white px-24 py-6 rounded-[30px] font-black uppercase text-4xl shadow-2xl hover:scale-105">Upload Media</button>
            </div>
          </div>
        )}

        {/* PAGES 11-18 */}
        {page >= 11 && page <= 18 && (
          <div className="min-h-screen p-8 pt-20 pb-40">
            <h1 className="text-5xl font-black uppercase italic text-purple-400 mb-8">Page {page}</h1>
            <div className="bg-zinc-950 border-2 border-purple-700 rounded-3xl p-10">
              <p className="text-white/50 font-bold text-xl">Content for page {page}</p>
            </div>
          </div>
        )}

        {/* PAGE 19: HELP */}
        {page === 19 && (
          <div className="h-screen flex flex-col justify-center items-center text-center p-10">
            <MessageCircle size={80} className="text-purple-500 mb-8" />
            <h1 className="text-7xl font-black uppercase italic mb-10 text-purple-400">Agent Grok</h1>
            <div className="w-full max-w-2xl bg-zinc-950 border-4 border-purple-600 p-12 rounded-[30px] text-xl font-bold shadow-[0_0_60px_rgba(147,51,234,0.6)]">
              Welcome back. Your Studio Master status is verified. How can I assist your movie making process today?
            </div>
          </div>
        )}

        {/* PAGE 20: COMMUNITY */}
        {page === 20 && (
          <div className="min-h-screen p-8 pt-20 pb-40">
            <h1 className="text-5xl font-black uppercase italic text-purple-400 mb-8">Community Hub</h1>
            <div className="space-y-4">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="bg-zinc-950 border-2 border-purple-700 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Community Post {i}</h3>
                  <p className="text-purple-300 mb-3">by User {i} • 2 hours ago</p>
                  <div className="flex gap-6 text-purple-400">
                    <span className="flex items-center gap-1"><Heart size={18} /> 234</span>
                    <span className="flex items-center gap-1"><MessageCircle size={18} /> 56</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 21: FINALE - FIX 9: THATSALLFOLKS VIDEO */}
        {page === 21 && (
          <div className="h-screen flex flex-col justify-center items-center text-center p-10 pb-40">
            <div className="mb-10 w-full max-w-3xl">
              <video autoPlay loop muted playsInline className="w-full rounded-xl border-4 border-purple-600 shadow-[0_0_80px_rgba(147,51,234,0.8)]">
                <source src="/ThatsAllFolks.MP4" type="video/mp4" />
              </video>
            </div>
            <h1 className="text-[10rem] font-black text-purple-400 uppercase italic mb-10 leading-none">THAT'S ALL FOLKS!</h1>
            <div className="max-w-4xl mb-16 space-y-8">
              <p className="text-4xl font-black uppercase italic text-white leading-tight">
                "Amanda's Thank you to creators now in future. Supporting cinematic innovation through our Veteran Fundraiser mission."
              </p>
              <a href="https://MandaStrong1.Etsy.com" target="_blank" className="inline-block text-7xl font-black text-purple-400 hover:text-white transition underline underline-offset-[20px] decoration-8 decoration-purple-600">MandaStrong1.Etsy.com</a>
            </div>
            <div className="flex gap-8">
              <button onClick={() => setPage(1)} className="bg-purple-600 text-white px-20 py-6 rounded-2xl font-black uppercase text-3xl shadow-[0_0_60px_rgba(147,51,234,0.7)] hover:scale-105">Home</button>
              <button className="bg-zinc-900 border-2 border-purple-700 px-20 py-6 rounded-2xl font-black uppercase text-3xl hover:bg-zinc-800 text-white/50">Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
