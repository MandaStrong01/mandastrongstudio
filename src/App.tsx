import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Cpu, Layers, Volume2, 
  Monitor, Sparkles, Clock, Share2, 
  Target, MousePointer2, Camera, Wind,
  Maximize, Activity, Radio, Loader2,
  Film, Scissors, CheckCircle, Type, Music,
  FileText, ShieldCheck, ZapOff, Play,
  MoveHorizontal, Layout, Square, HardDrive, Download
} from 'lucide-react';

/**
 * MANDASTRONG STUDIO: THE STUDIO MASTER RELEASE (75s)
 * --------------------------------------------------
 * Logic: Auto-Start (Zero Latency Ignition)
 * Aesthetic: High-Contrast Cinema / Liquid Titanium UI
 * Features: Steady Creator Mode™ Scaling / Bottom-Anchored SRT Sync Track
 */

const App = () => {
  const [time, setTime] = useState(0);
  const [scene, setScene] = useState(0);
  const [isSteadyMode, setIsSteadyMode] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const timerRef = useRef(null);

  // Script-Matched Precision Timings (Exactly 75s)
  const SCRIPT_TIMINGS = [
    { id: 1, start: 0, end: 6, label: "THE IGNITION" },
    { id: 2, start: 6, end: 16, label: "600+ AI TOOLS" },
    { id: 3, start: 16, end: 24, label: "NO TIME LIMITS" },
    { id: 4, start: 24, end: 36, label: "PRO MASTER TIMELINE" },
    { id: 5, start: 36, end: 46, label: "AI ENHANCEMENT" },
    { id: 6, start: 46, end: 54, label: "SONIC MASTERING" },
    { id: 7, start: 54, end: 62, label: "RENDER & RELEASE" },
    { id: 8, start: 62, end: 75, label: "THE FINALE" }
  ];

  // Auto-Start Production Engine
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTime(prev => {
        if (prev >= 75) {
          clearInterval(timerRef.current);
          return 75;
        }
        return prev + 0.05; 
      });
    }, 50);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const current = SCRIPT_TIMINGS.find(s => time >= s.start && time < s.end);
    if (current) setScene(current.id);

    // Scene 4 Logic: Steady Mode™ Activation (30s - 36s)
    if (time >= 30 && time < 36) {
      setIsSteadyMode(true);
    } else {
      setIsSteadyMode(false);
    }

    // Scene 7 Logic: High-Octane Render Progress
    if (time >= 56 && time < 61) {
      setRenderProgress(((time - 56) / 5) * 100);
    } else if (time >= 61) {
      setRenderProgress(100);
    }
  }, [time]);

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden flex flex-col font-sans antialiased selection:bg-purple-900">
      
      {/* CINEMATIC VIEWPORT (LUMA-SYNCED) */}
      <div className={`flex-1 relative overflow-hidden transition-all duration-[1200ms] ease-in-out ${isSteadyMode ? 'scale-[1.12] ring-[20px] ring-purple-900/10' : 'scale-100'}`}>
        
        {/* OPTICAL CINEMA ENGINE: Grain, Anamorphic Vignette, Volumetric Rays */}
        <div className="absolute inset-0 pointer-events-none z-[100] film-grain opacity-[0.18]"></div>
        <div className="absolute inset-0 pointer-events-none z-[101] luma-vignette opacity-95"></div>
        <div className="absolute inset-0 pointer-events-none z-[102] bg-[radial-gradient(circle_at_center,transparent_20%,black_160%)]"></div>

        {/* SCENE 1: THE IGNITION (0:00–0:06) */}
        {scene === 1 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden animate-fade-in">
            <div className={`w-3 h-3 bg-purple-200 rounded-full transition-all duration-[2000ms] ${time > 0.4 ? 'scale-[800] opacity-0 blur-3xl' : 'scale-100 shadow-[0_0_100px_white]'}`}></div>
            {time > 2.5 && (
              <div className="z-10 text-center animate-reveal-pro relative">
                <div className="absolute inset-0 animate-lightning opacity-[0.15] pointer-events-none"></div>
                <h1 className="text-[15vw] font-black italic tracking-tighter metallic-text leading-none uppercase drop-shadow-master">
                  MandaStrong
                </h1>
                <p className="text-4xl font-black uppercase tracking-[1.5em] text-white/30 mt-12 italic leading-none animate-pulse">AI Movie Powerhouse</p>
              </div>
            )}
          </div>
        )}

        {/* SCENE 2: 600+ TOOLS (0:06–0:16) */}
        {scene === 2 && (
          <div className="absolute inset-0 bg-[#010101] flex items-center justify-center overflow-hidden animate-fade-in">
            <div className="z-10 text-center relative scale-110">
              <div className="flex justify-center gap-16 mb-20 opacity-40">
                 {[Zap, Film, Camera].map((Icon, i) => (
                   <Icon key={i} className="text-purple-600 shadow-[0_0_40px_#7e22ce] animate-pulse" size={90} strokeWidth={1.5} />
                 ))}
              </div>
              <h2 className="text-[30vw] font-black italic tracking-tighter leading-none metallic-text drop-shadow-white animate-impact-zoom">
                600+
              </h2>
              <div className="text-7xl font-black text-white/30 tracking-[0.8em] uppercase mt-12 italic leading-none">AI Weapons Unleashed</div>
              <div className="mt-24 flex gap-12 justify-center opacity-40 font-bold tracking-[0.5em] text-purple-400 uppercase italic">
                <span>Write</span><span>•</span><span>Voice</span><span>•</span><span>Animate</span><span>•</span><span>Build</span>
              </div>
            </div>
            {/* Grid Drift Atmosphere */}
            <div className="absolute inset-0 opacity-[0.04] animate-grid-drift">
               <div className="grid grid-cols-12 grid-rows-12 h-full w-full border-white/10 border-t border-l">
                  {Array.from({length: 144}).map((_, i) => (
                    <div key={i} className="border-r border-b border-white/10"></div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* SCENE 3: TIME INFINITY (0:16–0:24) */}
        {scene === 3 && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center animate-fade-in overflow-hidden">
            <div className="absolute inset-0 z-0">
               {Array.from({length: 12}).map((_, i) => (
                 <Clock key={i} size={500} className="absolute text-white/5 animate-shatter" style={{
                   left: `${Math.random()*100}%`,
                   top: `${Math.random()*100}%`,
                   animationDelay: `${i*0.1}s`
                 }} />
               ))}
             </div>
            <div className="w-full max-w-7xl px-40 z-10">
              <div className="h-1.5 bg-zinc-950 w-full mb-32 relative overflow-hidden border border-white/5 rounded-full shadow-inner">
                 <div className="absolute h-full bg-white shadow-[0_0_150px_white]" style={{ width: `${Math.min(((time - 16) / 8) * 100, 100)}%` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_0_40px_white] glow-pulse"></div>
                 </div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-white/5 text-[15vw] font-black italic tracking-tighter uppercase leading-none">Instant</span>
                <span className="text-white text-[25vw] font-black italic tracking-tighter leading-none drop-shadow-white-intense animate-pop-in">
                  3 <span className="text-purple-700 italic">HOURS</span>
                </span>
              </div>
            </div>
            <p className="mt-16 text-5xl font-black uppercase text-zinc-800 tracking-[1em] italic leading-none animate-pulse">Feature-Length Masterpieces</p>
          </div>
        )}

        {/* SCENE 4: PRO TIMELINE + STEADY MODE™ + BOTTOM SRT (0:24–0:36) */}
        {scene === 4 && (
          <div className="absolute inset-0 bg-[#020202] p-24 flex flex-col justify-center animate-fade-in overflow-hidden">
            <div className="flex items-end justify-between mb-24 border-b border-white/5 pb-14">
               <div>
                  <h2 className="text-[11vw] font-black italic text-white uppercase tracking-tighter leading-none metallic-text">Pro Logic</h2>
                  <p className="text-purple-600 font-black tracking-[0.5em] mt-6 opacity-60 italic uppercase">Neural Workspace 2026</p>
               </div>
               <div className={`flex gap-12 items-center transition-all duration-1000 ${isSteadyMode ? 'bg-purple-900/40 px-14 py-10 rounded-[50px] border-2 border-purple-500/50 shadow-[0_0_120px_rgba(126,34,206,0.5)] scale-110' : 'opacity-20'}`}>
                  <div className="flex flex-col items-end">
                    <span className={`text-4xl font-black tracking-[0.2em] transition-all uppercase leading-none ${isSteadyMode ? 'text-white' : 'text-zinc-600'}`}>STEADY CREATOR MODE™</span>
                    {isSteadyMode && <span className="text-[14px] font-bold text-purple-400 tracking-widest mt-3 uppercase">Calibrated Stability Active</span>}
                  </div>
                  {isSteadyMode ? <ShieldCheck className="text-purple-400 animate-pulse" size={72} /> : <Target size={72} />}
               </div>
            </div>

            <div className="space-y-4 max-w-[95vw] mx-auto w-full relative">
              {['CINEMA_RAW_8K', 'VOCAL_CLONE_MASTER', 'VFX_PLATE_COMPS', 'SRT_SUBTITLE_ENGINE'].map((track, i) => (
                <div key={track} className={`h-28 bg-black border border-white/5 rounded-3xl flex items-center px-16 relative overflow-hidden group transition-all backdrop-blur-2xl ${track === 'SRT_SUBTITLE_ENGINE' ? 'border-purple-500/60 bg-purple-950/10 shadow-[0_0_80px_rgba(126,34,206,0.2)] mt-16 ring-2 ring-purple-500/20' : ''}`}>
                  <div className="flex items-center gap-10 z-10">
                     {track === 'SRT_SUBTITLE_ENGINE' ? <Type size={36} className="text-purple-500 animate-pulse" /> : <Layers size={24} className="opacity-10" />}
                     <span className={`text-2xl font-black tracking-[0.8em] uppercase italic ${track === 'SRT_SUBTITLE_ENGINE' ? 'text-purple-500' : 'text-white/5'}`}>
                        {track}
                     </span>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-transparent w-full animate-scrub-cinema"></div>
                  
                  {/* SRT Track Foundation: Foundational track at the bottom with Drag visual */}
                  {track === 'SRT_SUBTITLE_ENGINE' && (
                    <div className="absolute inset-y-0 right-20 flex items-center gap-16 z-20 animate-reveal-pro">
                       <div className="flex flex-col items-end opacity-40">
                          <span className="text-[14px] font-black tracking-widest text-purple-400 mb-1 italic">DRAG AUDIO + TEXT TO SYNC</span>
                          <div className="h-[2px] w-80 bg-purple-500/30"></div>
                       </div>
                       <div className="flex gap-8">
                          <div className="p-8 rounded-[30px] border-2 border-dashed border-purple-500/40 bg-purple-500/5 hover:bg-purple-500/15 transition-all cursor-pointer group">
                             <Music size={40} className="text-purple-500 group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="p-8 rounded-[30px] border-2 border-dashed border-purple-500/40 bg-purple-500/5 hover:bg-purple-500/15 transition-all cursor-pointer group">
                             <FileText size={40} className="text-purple-500 group-hover:scale-110 transition-transform" />
                          </div>
                       </div>
                    </div>
                  )}
                  <div className="absolute left-1/3 top-0 bottom-0 w-[2px] bg-white/40 z-10 hidden group-hover:block animate-pulse shadow-glow-white"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCENE 5: AI ENHANCEMENT (0:36–0:46) */}
        {scene === 5 && (
          <div className="absolute inset-0 flex overflow-hidden bg-black animate-fade-in">
            <div className="w-1/2 h-full bg-[#050505] relative flex items-center justify-center grayscale brightness-50 contrast-125">
               <p className="relative z-20 text-[10vw] font-black text-white/5 tracking-[0.5em] uppercase italic leading-none">HD PLATE</p>
               <div className="absolute inset-0 bg-black/80 z-10 backdrop-blur-md"></div>
            </div>
            <div className="w-1/2 h-full relative overflow-hidden bg-purple-950">
               <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover contrast-150 brightness-110 scale-110">
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-color-grading-a-video-in-a-professional-studio-34534-large.mp4" type="video/mp4" />
               </video>
               <div className="absolute inset-0 bg-purple-900/40 mix-blend-overlay backdrop-contrast-125"></div>
               <div className="relative z-10 h-full flex flex-col items-center justify-center bg-black/40 text-center px-24">
                  <h2 className="text-[20vw] font-black italic tracking-tighter metallic-text leading-none uppercase drop-shadow-master animate-impact-zoom">8K Master</h2>
                  <div className="flex gap-10 mt-20 animate-reveal-pro">
                    {['HD', '4K', '8K'].map(b => (
                      <div key={b} className={`px-20 py-8 border-2 rounded-full font-black text-5xl tracking-widest transition-all ${b === '8K' ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_150px_#7e22ce]' : 'border-white/10 text-white/20'}`}>
                         {b}
                      </div>
                    ))}
                  </div>
               </div>
            </div>
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white shadow-[0_0_150px_white] z-50 animate-scan-physical"></div>
          </div>
        )}

        {/* SCENE 6: PRO AUDIO MIXER (0:46–0:54) */}
        {scene === 6 && (
          <div className="absolute inset-0 bg-black p-32 flex flex-col items-center justify-center overflow-hidden animate-fade-in">
            <h2 className="text-[12vw] font-black italic text-white mb-40 tracking-tighter uppercase leading-none metallic-text text-center drop-shadow-master">
              Sonic Realism
            </h2>
            <div className="flex gap-40 items-end h-[500px]">
              {['MUSIC', 'VOICE', 'SFX', 'MASTER'].map((ch, i) => (
                <div key={ch} className="flex flex-col items-center gap-20 group">
                   <div className="w-28 h-full bg-[#030303] rounded-[70px] relative overflow-hidden border border-white/5 p-2 shadow-[inset_0_0_80px_black]">
                      <div 
                        className="absolute bottom-2 left-2 right-2 bg-gradient-to-t from-zinc-950 via-purple-700 to-white rounded-[65px] transition-all duration-[40ms] shadow-[0_0_80px_rgba(126,34,206,0.6)]"
                        style={{ height: `${30 + Math.sin(time * 35 + i) * 60}%` }}
                      >
                         <div className="absolute top-0 left-0 w-full h-[8px] bg-white blur-[2px] opacity-90 animate-pulse"></div>
                      </div>
                   </div>
                   <p className="text-4xl font-black text-zinc-900 group-hover:text-white transition-all tracking-[0.5em] italic leading-none uppercase">{ch}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCENE 7: RENDER & RELEASE (0:54–1:02) */}
        {scene >= 7 && time < 62 && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center overflow-hidden animate-fade-in">
            <div className="relative group">
              <div className="absolute inset-0 bg-purple-900/10 blur-[400px] animate-pulse"></div>
              <div className={`relative bg-[#020202] border-[1px] border-white/10 w-[700px] h-[700px] rounded-full flex flex-col items-center justify-center shadow-glow-master transition-transform duration-[1000ms] ${time > 55.5 ? 'scale-105 shadow-[0_0_200px_rgba(126,34,206,0.4)]' : 'scale-100'}`}>
                 <div className="absolute inset-20 border border-white/5 rounded-full animate-spin-slow opacity-40"></div>
                 <Cpu size={280} className="mb-16 text-white/5 drop-shadow-white animate-pulse" />
                 <span className="text-[16vw] font-black tracking-tighter text-white italic leading-none metallic-text uppercase">RENDER</span>
                 <MousePointer2 className={`absolute bottom-24 right-24 text-white fill-white transition-all duration-300 ${time > 55.3 ? 'scale-90 opacity-100 translate-x-4 translate-y-4 shadow-glow-white' : 'scale-110 opacity-0'}`} size={140} />
              </div>
            </div>
            <div className="w-full max-w-7xl mt-48 relative px-40">
               <div className="h-3 bg-zinc-950 w-full overflow-hidden border border-white/5 rounded-full shadow-inner">
                  <div className="h-full bg-white shadow-[0_0_150px_white] transition-all duration-300" style={{ width: `${renderProgress}%` }}></div>
               </div>
               <div className="flex justify-between items-center mt-16 px-10">
                  <p className="text-6xl font-black tracking-[2em] text-white/5 uppercase italic animate-pulse">Encoding 8K Output</p>
                  <p className="text-6xl font-mono font-black text-purple-600 drop-shadow-white-intense">{Math.floor(renderProgress)}%</p>
               </div>
            </div>
            {time > 61.5 && (
              <div className="absolute inset-0 z-[300] flex items-center justify-center overflow-hidden pointer-events-none">
                {Array.from({length: 120}).map((_, i) => (
                  <div key={i} className="confetti-shard" style={{ 
                    left: `${Math.random() * 100}%`, 
                    backgroundColor: i % 2 === 0 ? '#7e22ce' : '#ffffff',
                    animationDuration: '1.2s',
                  }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* FINAL SCENE: CALL TO ACTION (1:02–1:15) */}
        {scene === 8 && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-center p-24 animate-fade-in">
             <div className="absolute inset-0 animate-lightning opacity-[0.08] pointer-events-none"></div>
             <h1 className="text-[28vw] font-black italic tracking-tighter metallic-text leading-none uppercase mb-24 drop-shadow-master">
               MandaStrong
             </h1>
             <div className="relative group bg-zinc-950 border border-white/5 px-60 py-40 rounded-[140px] shadow-3xl overflow-hidden backdrop-blur-3xl transition-all duration-1000 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/15 via-transparent to-transparent"></div>
                <p className="text-6xl font-bold mb-20 tracking-[0.5em] uppercase text-zinc-700 italic opacity-60 leading-none uppercase">From Imagination To Reality</p>
                <a 
                  href="https://MandaStrong1.Etsy.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[11vw] font-black text-white hover:text-purple-600 transition-all duration-700 italic tracking-tighter uppercase underline underline-offset-[60px] decoration-white/5 leading-none"
                >
                  MandaStrong1.Etsy.com
                </a>
             </div>
             <p className="mt-48 text-6xl font-black tracking-[3em] text-white/5 uppercase italic leading-none animate-pulse">Your masterpiece.</p>
          </div>
        )}

      </div>

      {/* THE MASTER NARRATOR ENGINE (AUTOSYNCED TO RELEASE SCRIPT) */}
      <div className="h-44 bg-black flex items-center justify-center px-48 border-t border-white/10 relative overflow-hidden shadow-2xl z-[500]">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-purple-950/30 to-transparent opacity-60"></div>
        <p className="text-6xl font-black italic text-center leading-none tracking-tighter prompter-metallic uppercase scale-105">
          {time < 6 && "“Lights… Camera… ACTION.”"}
          {time >= 6 && time < 16 && "“Six hundred powerful AI tools. Write. Voice. Animate. Build.”"}
          {time >= 16 && time < 24 && "“Viral shorts… to three-hour cinematic masterpieces.”"}
          {time >= 24 && time < 36 && "“Professional multi-track editing. And our new Steady Creator Mode™.”"}
          {time >= 36 && time < 46 && "“Forty AI enhancement tools. Upscale to stunning 8K.”"}
          {time >= 46 && time < 54 && "“Four-channel professional mixing. Harmony.”"}
          {time >= 54 && time < 62 && "“Render in seconds. Export anywhere. Your vision—live.”"}
          {time >= 62 && "“MandaStrong Studio. From imagination to reality. YOUR masterpiece.”"}
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .metallic-text {
          background: linear-gradient(to bottom, #fff 15%, #999 45%, #fff 55%, #050505 95%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .prompter-metallic {
          background: linear-gradient(90deg, #333, #fff, #333);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: prompter-shine 10s linear infinite;
        }

        @keyframes prompter-shine { to { background-position: 200% center; } }

        .film-grain {
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          filter: contrast(250%) brightness(180%) invert(1);
          mix-blend-mode: overlay;
        }

        .luma-vignette {
          background: radial-gradient(circle at center, transparent 10%, black 150%);
        }

        @keyframes lightning {
          0%, 99.7%, 100% { background: transparent; }
          99.8% { background: white; box-shadow: 0 0 200px white; }
        }

        @keyframes scrub-cinema {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(180%); }
        }

        @keyframes shat-ter {
          0% { transform: scale(1) rotate(0deg); opacity: 0.1; }
          100% { transform: scale(8) rotate(160deg); opacity: 0; filter: blur(120px); }
        }

        .drop-shadow-white-intense { filter: drop-shadow(0 0 80px rgba(255,255,255,0.7)); }
        .drop-shadow-master { filter: drop-shadow(0 0 80px rgba(126,34,206,0.7)) drop-shadow(0 0 20px white); }

        .animate-reveal-pro { animation: reveal-pro 3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes reveal-pro {
          0% { transform: scale(0.95) translateY(60px); opacity: 0; filter: blur(60px); letter-spacing: -2.5em; }
          100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); letter-spacing: -0.05em; }
        }

        .animate-lightning { animation: lightning 4s infinite; }
        .animate-scrub-cinema { animation: scrub-cinema 5s infinite linear; }
        
        .animate-impact-zoom { animation: impact-zoom 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes impact-zoom {
          0% { transform: scale(0.1); opacity: 0; filter: blur(60px); }
          30% { transform: scale(1.04); opacity: 1; filter: blur(0); }
          100% { transform: scale(1); opacity: 1; }
        }

        .animate-scan-physical { animation: s-phys 8.5s linear infinite; }
        @keyframes s-phys { from { left: 0%; } to { left: 100%; } }

        .animate-spin-slow { animation: spin 45s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .animate-grid-drift { animation: g-drift 150s linear infinite; }
        @keyframes g-drift { from { transform: translateY(0); } to { transform: translateY(-1500px); } }

        .animate-fade-in { animation: fade 1.5s ease-out forwards; }
        @keyframes fade { from { opacity: 0; } to { opacity: 1; } }

        .confetti-shard {
          position: absolute;
          width: 20px;
          height: 20px;
          top: -20px;
          animation: fall-phys 5s linear infinite;
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        }
        @keyframes fall-phys { to { transform: translateY(110vh) rotate(1440deg) skew(45deg); } }
        
        .animate-shatter { animation: shat-ter 5s ease-out forwards; }
        
        .shadow-glow-white { box-shadow: 0 0 100px rgba(255,255,255,0.4); }

        .animate-pop-in { animation: p-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes p-in { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}} />
    </div>
  );
};

export default App;