// MANDASTRONG STUDIO - AMANDA'S COMPLETE VISION
// ALL 11 FIXES APPLIED - NO GEMINI CODE
// FRESH BUILD - CACHE CLEARED

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Sparkles, ChevronRight, ChevronLeft, CheckCircle, Upload, 
  MessageCircle, Film, Lock, UserPlus, Mail, Key, User, 
  Video as VideoIcon, Heart, Send
} from 'lucide-react';

// PURPLE THEME - #9333ea
const PURPLE = '#9333ea';
const PURPLE_DARK = '#7e22ce';
const PURPLE_LIGHT = '#a855f7';

// 600 AI TOOLS ACROSS 5 BOARDS (120 EACH)
const createToolList = (baseNames) => {
  const tools = [];
  for (let idx = 0; idx < 120; idx++) {
    const baseName = baseNames[idx % baseNames.length];
    const suffix = idx >= baseNames.length ? ` PRO ${Math.floor(idx / baseNames.length)}` : "";
    tools.push(`${baseName}${suffix}`.toUpperCase());
  }
  return tools;
};

const AI_TOOLS = {
  Writing: createToolList(["Script Builder", "Plot AI", "Dialogue Gen", "Character Dev"]),
  Voice: createToolList(["Voice Clone", "Speech AI", "Tone Mod", "Accent Gen"]),
  Image: createToolList(["Image AI", "Art Gen", "Photo Synth", "Visual FX"]),
  Video: createToolList(["Video AI", "Motion Gen", "Avatar Create", "Scene Build"]),
  Motion: createToolList(["Motion Track", "Physics AI", "Rig Auto", "Anim Gen"])
};

// SPLASH SCREEN COMPONENT
const IntroSplash = ({ onStart }) => (
  <div onClick={onStart} className="w-full h-screen bg-black flex items-center justify-center cursor-pointer relative overflow-hidden">
    <div className="absolute inset-0 opacity-60" style={{background: `radial-gradient(circle at center, ${PURPLE} 0%, #000 70%)`}}></div>
    <div className="relative z-10 text-center">
      <div className="w-72 h-72 mx-auto rounded-full border-4 flex items-center justify-center mb-20 animate-pulse" 
           style={{borderColor: PURPLE, boxShadow: `0 0 140px ${PURPLE}`}}>
        <Film className="w-44 h-44" style={{color: PURPLE_LIGHT}} strokeWidth={1.5}/>
      </div>
      <h1 className="font-black text-white mb-8 uppercase tracking-wider" 
          style={{fontSize: '11rem', fontFamily: 'Impact, sans-serif', textShadow: `0 0 120px ${PURPLE}`}}>
        MANDASTRONG
      </h1>
      <h2 className="text-8xl font-bold mb-28 uppercase tracking-widest" style={{color: PURPLE_LIGHT}}>
        STUDIO
      </h2>
      <div className="w-52 h-2 rounded-full mx-auto mb-24" style={{background: `linear-gradient(to right, transparent, ${PURPLE}, transparent)`}}></div>
      <p className="text-white text-4xl font-bold animate-pulse">Tap anywhere to continue</p>
    </div>
  </div>
);

// MAIN APP
export default function App() {
  const [splashVisible, setSplashVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chosenPlan, setChosenPlan] = useState('Studio');
  const videoElement = useRef(null);

  // SPLASH SCREEN HANDLER
  if (splashVisible) {
    return <IntroSplash onStart={() => setSplashVisible(false)}/>;
  }

  // PAGE SCROLL RESET
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // VIDEO BACKGROUND CONTROL
  useEffect(() => {
    const vid = videoElement.current;
    if (!vid) return;
    const pagesWithVideo = [1, 2, 10, 21];
    if (pagesWithVideo.includes(currentPage)) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [currentPage]);

  // NAVIGATION COMPONENT
  const PageNavigation = () => {
    if (currentPage === 1 || currentPage === 21) return null;
    return (
      <div className="fixed z-[400] flex gap-10" style={{bottom: '5rem', left: '50%', transform: 'translateX(-50%)'}}>
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(currentPage - 1)} 
                  className="px-16 py-4 rounded-full font-black uppercase flex items-center gap-3 text-xl shadow-2xl transition hover:scale-105"
                  style={{background: '#18181b', border: `2px solid ${PURPLE}`, color: PURPLE_LIGHT}}>
            <ChevronLeft size={22}/> Back
          </button>
        )}
        {currentPage < 21 && (
          <button onClick={() => setCurrentPage(currentPage + 1)} 
                  className="px-16 py-4 rounded-full font-black uppercase text-white flex items-center gap-3 text-xl shadow-2xl transition hover:scale-105"
                  style={{background: PURPLE, border: `2px solid ${PURPLE}`}}>
            Next <ChevronRight size={22}/>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* HIDE BOLT WATERMARK */}
      <style dangerouslySetInnerHTML={{__html: `
        [data-bolt-badge], .bolt-badge, #bolt-badge, 
        a[href*="bolt"], div[class*="fixed"][class*="bottom"] iframe, 
        [class*="made"], [id*="bolt"], footer[class*="bolt"],
        [aria-label*="bolt"], [data-testid*="bolt"] { 
          display: none !important; 
          visibility: hidden !important;
          opacity: 0 !important;
        }
        .scrollbar-custom::-webkit-scrollbar { width: 12px; }
        .scrollbar-custom::-webkit-scrollbar-track { background: #000; }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: ${PURPLE}; border-radius: 12px; }
        input::placeholder { color: rgba(147, 51, 234, 0.5); }
      `}}/>

      {/* TOP MENU */}
      {currentPage > 0 && (
        <div className="fixed top-10 right-10 z-[300]">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="p-5 rounded-full shadow-2xl text-white transition hover:scale-110"
                  style={{background: PURPLE}}>
            <Menu size={26}/>
          </button>
          {isMenuOpen && (
            <div className="absolute top-20 right-0 p-8 rounded-3xl w-72 shadow-2xl" 
                 style={{background: '#18181b', border: `2px solid ${PURPLE}`}}>
              {[
                {page: 1, label: "Home"},
                {page: 4, label: "AI Hub"},
                {page: 11, label: "Editor"},
                {page: 19, label: "Help"},
                {page: 21, label: "Finish"}
              ].map(item => (
                <button key={item.page} 
                        onClick={() => {setCurrentPage(item.page); setIsMenuOpen(false);}} 
                        className="w-full text-left text-base font-black uppercase p-5 rounded-2xl transition mb-3"
                        style={{color: PURPLE_LIGHT}}
                        onMouseEnter={e => e.target.style.background = PURPLE}
                        onMouseLeave={e => e.target.style.background = 'transparent'}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HELP BUTTON */}
      {currentPage >= 1 && (
        <button onClick={() => setCurrentPage(19)} 
                className="fixed bottom-10 right-10 z-[500] p-6 rounded-full transition hover:scale-110"
                style={{background: PURPLE, boxShadow: `0 0 60px ${PURPLE}`, border: `2px solid ${PURPLE_LIGHT}`}}>
          <MessageCircle size={30} className="text-white"/>
        </button>
      )}

      {/* FOOTER */}
      {currentPage >= 3 && (
        <div className="fixed bottom-0 left-0 w-full py-5 text-center z-[350]" 
             style={{background: 'rgba(0,0,0,0.95)', borderTop: `2px solid ${PURPLE}`}}>
          <p className="text-base uppercase font-black tracking-widest" style={{color: PURPLE_LIGHT}}>
            MandaStrong Studio 2025 • Author of Doxy The School Bully • MandaStrong1.Etsy.com
          </p>
        </div>
      )}

      <PageNavigation/>

      {/* VIDEO BACKGROUND */}
      {[1, 2, 10, 21].includes(currentPage) && (
        <div className="absolute inset-0 z-0 bg-black">
          <video ref={videoElement} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
            <source src="background.mp4" type="video/mp4"/>
          </video>
        </div>
      )}

      <main className="relative z-10 min-h-screen">
        
        {/* PAGE 1: HOME */}
        {currentPage === 1 && (
          <div className="h-screen flex flex-col justify-center items-center text-center px-10">
            <h1 className="font-black text-white uppercase italic tracking-tighter leading-none mb-10" 
                style={{fontSize: '11rem'}}>
              MandaStrong Studio
            </h1>
            <p className="text-4xl font-black italic uppercase tracking-tight max-w-5xl mb-24" 
               style={{color: PURPLE_LIGHT}}>
              Professional cinema production platform with AI-powered tools for creating feature-length films up to 3 hours
            </p>
            <div className="flex flex-wrap justify-center gap-10">
              <button onClick={() => setCurrentPage(2)} 
                      className="bg-white text-black px-24 py-7 rounded-3xl font-black uppercase text-4xl hover:scale-105 transition shadow-2xl">
                Next
              </button>
              <button onClick={() => setCurrentPage(3)} 
                      className="text-white px-24 py-7 rounded-3xl font-black uppercase text-4xl hover:scale-105 transition shadow-xl"
                      style={{background: PURPLE, border: `2px solid ${PURPLE_LIGHT}`}}>
                Login
              </button>
              <button onClick={() => setCurrentPage(3)} 
                      className="text-white px-24 py-7 rounded-3xl font-black uppercase text-4xl hover:scale-105 transition shadow-xl"
                      style={{background: PURPLE, border: `2px solid ${PURPLE_LIGHT}`}}>
                Register
              </button>
            </div>
          </div>
        )}

        {/* PAGE 2: MISSION */}
        {currentPage === 2 && (
          <div className="h-screen flex flex-col justify-center items-center text-center px-8">
            <Sparkles size={110} className="mb-14 animate-pulse" style={{color: PURPLE}}/>
            <h1 className="text-9xl font-black text-white uppercase italic tracking-tighter mb-14">
              MANDASTRONG'S STUDIO
            </h1>
            <p className="text-7xl font-black italic uppercase max-w-6xl leading-tight" style={{color: PURPLE_LIGHT}}>
              Make Awesome Family Movies & Bring Dreams To Life!
            </p>
          </div>
        )}

        {/* PAGE 3: AUTH & PRICING */}
        {currentPage === 3 && (
          <div className="p-10 pt-24 pb-56 max-w-7xl mx-auto overflow-y-auto scrollbar-custom">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-24">
              {/* SIGN IN */}
              <div className="p-12 rounded-3xl" style={{background: '#18181b', border: `2px solid ${PURPLE}`}}>
                <h3 className="text-4xl font-black uppercase italic mb-10 flex items-center gap-4" style={{color: PURPLE_LIGHT}}>
                  <Lock size={28}/> Sign In
                </h3>
                <div className="space-y-7">
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2" size={22} style={{color: PURPLE}}/>
                    <input type="email" placeholder="Email Address" 
                           className="w-full bg-black p-6 pl-16 rounded-2xl text-white text-xl outline-none"
                           style={{border: `2px solid ${PURPLE}`}}/>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-6 top-1/2 -translate-y-1/2" size={22} style={{color: PURPLE}}/>
                    <input type="password" placeholder="Password" 
                           className="w-full bg-black p-6 pl-16 rounded-2xl text-white text-xl outline-none"
                           style={{border: `2px solid ${PURPLE}`}}/>
                  </div>
                  <button className="w-full py-6 rounded-2xl font-black uppercase text-xl tracking-widest text-white transition"
                          style={{background: PURPLE}}>
                    Sign In
                  </button>
                </div>
              </div>

              {/* CREATE ACCOUNT */}
              <div className="p-12 rounded-3xl" style={{background: '#18181b', border: `2px solid ${PURPLE}`}}>
                <h3 className="text-4xl font-black uppercase italic mb-10 flex items-center gap-4" style={{color: PURPLE_LIGHT}}>
                  <UserPlus size={28}/> Create Account
                </h3>
                <div className="space-y-7">
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2" size={22} style={{color: PURPLE}}/>
                    <input type="text" placeholder="Full Name" 
                           className="w-full bg-black p-6 pl-16 rounded-2xl text-white text-xl outline-none"
                           style={{border: `2px solid ${PURPLE}`}}/>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2" size={22} style={{color: PURPLE}}/>
                    <input type="email" placeholder="Email Address" 
                           className="w-full bg-black p-6 pl-16 rounded-2xl text-xl text-white outline-none"
                           style={{border: `2px solid ${PURPLE}`}}/>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-6 top-1/2 -translate-y-1/2" size={22} style={{color: PURPLE}}/>
                    <input type="password" placeholder="Password" 
                           className="w-full bg-black p-6 pl-16 rounded-2xl text-white text-xl outline-none"
                           style={{border: `2px solid ${PURPLE}`}}/>
                  </div>
                  <button className="w-full py-6 rounded-2xl font-black uppercase text-xl tracking-widest transition"
                          style={{background: '#27272a', border: `2px solid ${PURPLE}`, color: PURPLE_LIGHT}}>
                    Register
                  </button>
                </div>
              </div>
            </div>

            <h2 className="text-6xl font-black text-center mb-14 uppercase italic" style={{color: PURPLE_LIGHT}}>
              Choose Your Plan
            </h2>
            
            {/* AMANDA STRONG - STUDIO PLAN */}
            <div className="text-center mb-14">
              <h3 className="text-5xl font-black text-white uppercase">AMANDA STRONG</h3>
              <p className="text-2xl font-bold uppercase tracking-widest mt-3" style={{color: PURPLE_LIGHT}}>
                Studio Plan
              </p>
            </div>

            {/* PRICING: BASIC $20, PRO $30, STUDIO $50 (NO FREE) */}
            <div className="grid md:grid-cols-3 gap-10 mb-28">
              {[
                {name: 'Basic', price: '20', features: ['HD Export', '100 AI Tools', 'Basic Templates', '10GB Storage', 'Email Support']},
                {name: 'Pro', price: '30', features: ['4K Export', '300 AI Tools', 'Premium Templates', '100GB Storage', 'Priority Support', 'Commercial License'], popular: true},
                {name: 'Studio', price: '50', features: ['8K Export', 'All 600 AI Tools', 'Unlimited Templates', '1TB Storage', '24/7 Live Support', 'Full Commercial Rights', 'Team Collaboration']}
              ].map(plan => (
                <div key={plan.name} 
                     className="p-12 rounded-3xl transition"
                     style={{
                       background: '#18181b',
                       border: chosenPlan === plan.name ? `2px solid ${PURPLE}` : `2px solid #3f3f46`,
                       boxShadow: chosenPlan === plan.name ? `0 0 70px rgba(147,51,234,0.7)` : 'none'
                     }}>
                  {plan.popular && (
                    <div className="text-xs font-black uppercase px-6 py-2 rounded-full w-fit mb-7" 
                         style={{background: PURPLE}}>
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-4xl font-black uppercase italic mb-4 text-white">{plan.name}</h3>
                  <div className="text-7xl font-black mb-14" style={{color: PURPLE_LIGHT}}>
                    ${plan.price}<span className="text-xl opacity-50">/mo</span>
                  </div>
                  <ul className="space-y-5 mb-14">
                    {plan.features.map(feat => (
                      <li key={feat} className="text-base font-bold uppercase flex items-center gap-3 text-white/80">
                        <CheckCircle size={16} style={{color: PURPLE}}/> {feat}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setChosenPlan(plan.name)} 
                          className="w-full py-6 rounded-2xl font-black uppercase text-base tracking-widest transition"
                          style={{
                            background: chosenPlan === plan.name ? PURPLE : '#27272a',
                            color: chosenPlan === plan.name ? 'white' : PURPLE_LIGHT
                          }}>
                    {chosenPlan === plan.name ? 'Selected' : 'Choose Plan'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 4: AI HUB */}
        {currentPage === 4 && (
          <div className="p-12 pt-28 pb-56 max-w-7xl mx-auto text-center">
            <h1 className="text-9xl font-black uppercase italic mb-24" style={{color: PURPLE_LIGHT}}>
              AI HUB DIRECTORY
            </h1>
            <div className="grid md:grid-cols-3 gap-12">
              {["Writing", "Voice", "Image", "Video", "Motion"].map((category, idx) => (
                <div key={category} 
                     onClick={() => setCurrentPage(5 + idx)} 
                     className="p-20 rounded-[60px] cursor-pointer transition hover:scale-105 shadow-2xl"
                     style={{background: '#18181b', border: `2px solid ${PURPLE_DARK}`}}>
                  <div className="text-9xl mb-12">{["✍️", "🎙️", "🎨", "🎬", "🎭"][idx]}</div>
                  <h3 className="text-5xl font-black uppercase italic mb-4 text-white">{category} Board</h3>
                  <p className="text-xl font-black uppercase tracking-widest" style={{color: PURPLE_LIGHT}}>
                    120 Professional Tools
                  </p>
                </div>
              ))}
              <div onClick={() => setCurrentPage(10)} 
                   className="p-20 rounded-[60px] cursor-pointer transition hover:scale-105 shadow-2xl"
                   style={{background: '#18181b', border: `2px solid ${PURPLE_DARK}`}}>
                <div className="text-9xl mb-12">⭐</div>
                <h3 className="text-5xl font-black uppercase italic mb-4 text-white">Editor's Choice</h3>
              </div>
            </div>
          </div>
        )}

        {/* PAGES 5-9: AI TOOL BOARDS */}
        {currentPage >= 5 && currentPage <= 9 && (
          <div className="p-12 pt-28 pb-56 max-w-7xl mx-auto">
            <h2 className="text-8xl font-black uppercase italic mb-16" style={{color: PURPLE_LIGHT}}>
              {["Writing", "Voice", "Image", "Video", "Motion"][currentPage - 5]} BOARD
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {AI_TOOLS[["Writing", "Voice", "Image", "Video", "Motion"][currentPage - 5]].map((tool, idx) => (
                <button key={idx} 
                        className="p-10 rounded-3xl text-left transition"
                        style={{background: '#18181b', border: `2px solid ${PURPLE_DARK}`}}>
                  <span className="text-sm font-black uppercase text-white italic">{tool}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 10: EDITOR'S CHOICE */}
        {currentPage === 10 && (
          <div className="h-screen flex flex-col justify-center items-center text-center p-12">
            <h1 className="text-9xl font-black uppercase italic mb-24" style={{color: PURPLE_LIGHT}}>
              Editor's Choice
            </h1>
            <div className="w-full max-w-6xl aspect-video rounded-[80px] flex flex-col items-center justify-center"
                 style={{background: '#18181b', border: `4px solid ${PURPLE}`, boxShadow: `0 0 120px ${PURPLE}`}}>
              <Upload size={130} className="mb-16 animate-bounce" style={{color: PURPLE}}/>
              <button onClick={() => setCurrentPage(11)} 
                      className="text-white px-36 py-10 rounded-[50px] font-black uppercase text-6xl shadow-2xl hover:scale-105 transition"
                      style={{background: PURPLE}}>
                Upload Media
              </button>
            </div>
          </div>
        )}

        {/* PAGES 11-18: EDITOR/TOOLS */}
        {currentPage >= 11 && currentPage <= 18 && (
          <div className="min-h-screen p-12 pt-28 pb-56">
            <h1 className="text-7xl font-black uppercase italic mb-12" style={{color: PURPLE_LIGHT}}>
              Page {currentPage}
            </h1>
            <div className="p-16 rounded-3xl" style={{background: '#18181b', border: `2px solid ${PURPLE}`}}>
              <p className="text-white/50 font-bold text-3xl">Content for page {currentPage}</p>
            </div>
          </div>
        )}

        {/* PAGE 19: HELP DESK */}
        {currentPage === 19 && (
          <div className="h-screen flex flex-col justify-center items-center text-center p-14">
            <MessageCircle size={110} className="mb-16" style={{color: PURPLE}}/>
            <h1 className="text-9xl font-black uppercase italic mb-20" style={{color: PURPLE_LIGHT}}>
              Agent Grok
            </h1>
            <div className="w-full max-w-4xl p-20 rounded-[50px] text-3xl font-bold"
                 style={{background: '#18181b', border: `4px solid ${PURPLE}`, boxShadow: `0 0 100px ${PURPLE}`}}>
              Welcome back. Your Studio Master status is verified. How can I assist your movie making process today?
            </div>
          </div>
        )}

        {/* PAGE 20: COMMUNITY */}
        {currentPage === 20 && (
          <div className="min-h-screen p-12 pt-28 pb-56">
            <h1 className="text-7xl font-black uppercase italic mb-12" style={{color: PURPLE_LIGHT}}>
              Community Hub
            </h1>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map(num => (
                <div key={num} className="p-12 rounded-3xl" style={{background: '#18181b', border: `2px solid ${PURPLE}`}}>
                  <h3 className="text-4xl font-bold text-white mb-4">Community Post {num}</h3>
                  <p className="text-xl mb-5" style={{color: PURPLE_LIGHT}}>by User {num} • 2 hours ago</p>
                  <div className="flex gap-10 text-xl" style={{color: PURPLE_LIGHT}}>
                    <span className="flex items-center gap-3"><Heart size={22}/> 234</span>
                    <span className="flex items-center gap-3"><MessageCircle size={22}/> 56</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 21: FINALE */}
        {currentPage === 21 && (
          <div className="h-screen flex flex-col justify-center items-center text-center p-14 pb-56">
            <div className="mb-20 w-full max-w-5xl">
              <video autoPlay loop muted playsInline className="w-full rounded-3xl" 
                     style={{border: `4px solid ${PURPLE}`, boxShadow: `0 0 120px ${PURPLE}`}}>
                <source src="/ThatsAllFolks.MP4" type="video/mp4"/>
              </video>
            </div>
            <h1 className="font-black uppercase italic mb-20 leading-none" 
                style={{fontSize: '13rem', color: PURPLE_LIGHT}}>
              THAT'S ALL FOLKS!
            </h1>
            <div className="max-w-6xl mb-24 space-y-12">
              <p className="text-6xl font-black uppercase italic text-white leading-tight">
                "Amanda's Thank you to creators now in future. Supporting cinematic innovation through our Veteran Fundraiser mission."
              </p>
              <a href="https://MandaStrong1.Etsy.com" target="_blank" 
                 className="inline-block text-9xl font-black hover:text-white transition underline decoration-[12px]"
                 style={{color: PURPLE_LIGHT, textDecorationColor: PURPLE, textUnderlineOffset: '28px'}}>
                MandaStrong1.Etsy.com
              </a>
            </div>
            <div className="flex gap-12">
              <button onClick={() => setCurrentPage(1)} 
                      className="text-white px-28 py-10 rounded-3xl font-black uppercase text-5xl transition hover:scale-105"
                      style={{background: PURPLE, boxShadow: `0 0 100px ${PURPLE}`}}>
                Home
              </button>
              <button className="px-28 py-10 rounded-3xl font-black uppercase text-5xl transition hover:scale-105 text-white/50"
                      style={{background: '#27272a', border: `2px solid ${PURPLE_DARK}`}}>
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
vv