import React, { useState, useEffect, useRef } from 'react';
import { Scissors, Volume2, Clock, CheckCircle, X, Settings, Play, Wand2, FileVideo, Upload, Music, Image as ImageIcon, Video, Sparkles, MessageCircle, Home, Search, Menu, Film, Palette, Layers, Download, Youtube, Twitter, BookOpen, Shield, Users, Heart, Guitar, Mic, PenTool, Camera, Zap, Database, Sliders, Eye, Share2 } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [volume, setVolume] = useState(100);
  const [duration, setDuration] = useState(60);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && page <= 1) {
      videoRef.current.play().catch(() => {});
    }
  }, [page]);

  // Global Navigation Component
  const Navigation = () => (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-50">
      {page > 1 && (
        <button 
          onClick={() => setPage(page - 1)} 
          className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-full font-black uppercase text-sm shadow-lg transition-all border-2 border-purple-400/20"
        >
          ← Back
        </button>
      )}
      {page < 21 && (
        <button 
          onClick={() => setPage(page + 1)} 
          className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-full font-black uppercase text-sm shadow-lg transition-all border-2 border-purple-400/20"
        >
          Next →
        </button>
      )}
      {page === 21 && (
        <>
          <button 
            onClick={() => setPage(1)} 
            className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-full font-black uppercase text-sm shadow-lg transition-all border-2 border-purple-400/20"
          >
            Home
          </button>
          <button 
            onClick={() => window.close()} 
            className="bg-black hover:bg-gray-900 text-white px-10 py-4 rounded-full font-black uppercase text-sm shadow-lg transition-all border-2 border-white/20"
          >
            Close
          </button>
        </>
      )}
    </div>
  );

  // Global Help Desk Button (🎸 icon on every page)
  const HelpButton = () => (
    <button 
      onClick={() => setPage(18)} 
      className="fixed bottom-8 right-8 z-50 bg-purple-600 hover:bg-purple-500 p-4 rounded-full shadow-lg transition-all border-2 border-purple-400/20"
      title="24/7 Help Desk"
    >
      <Guitar size={24} className="text-white" />
    </button>
  );

  // Global Quick Access Menu (top right on every page)
  const QuickAccessMenu = () => (
    <div className="fixed top-8 right-8 z-50">
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="bg-purple-600 hover:bg-purple-500 p-4 rounded-full shadow-lg transition-all border-2 border-purple-400/20"
      >
        <Menu size={24} className="text-white" />
      </button>
      {isMenuOpen && (
        <div className="absolute top-16 right-0 bg-black border-2 border-purple-500/30 rounded-2xl p-4 w-64 shadow-2xl">
          <div className="text-white space-y-2">
            <button onClick={() => { setPage(1); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-purple-600/20 rounded font-bold">Home</button>
            <button onClick={() => { setPage(4); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-purple-600/20 rounded font-bold">AI Hub</button>
            <button onClick={() => { setPage(11); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-purple-600/20 rounded font-bold">Editor Suite</button>
            <button onClick={() => { setPage(17); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-purple-600/20 rounded font-bold">Tutorial Center</button>
            <button onClick={() => { setPage(20); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-purple-600/20 rounded font-bold">Community</button>
          </div>
        </div>
      )}
    </div>
  );

  // Footer Component (from page 3 onwards)
  const Footer = () => page >= 3 ? (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur py-3 text-center text-white text-xs z-40 border-t border-purple-500/20">
      <p className="font-bold">MANDASTRONG1 2025 ~ Author of Doxy The School Bully ~ Please Help With Our Fundraiser If You Can. Thank You.</p>
    </div>
  ) : null;

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      
      {/* PAGE 1: LANDING PAGE - Beach Video Background */}
      {page === 1 && (
        <div className="relative h-full">
          <video 
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src="background.mp4"
            loop
            muted={false}
            playsInline
          />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-[10rem] leading-none text-black font-black italic uppercase tracking-tighter mb-6" style={{ fontFamily: 'serif' }}>
              MANDASTRONG'S STUDIO
            </h1>
            <p className="text-4xl text-black font-black italic mb-12">
              Welcome To An All In One Make A Movie App ~ Up To 3 Hours
            </p>
            <div className="flex gap-6">
              <button onClick={() => setPage(2)} className="bg-black text-white px-12 py-5 rounded-2xl font-black uppercase text-xl hover:bg-purple-600 transition-all shadow-2xl">
                Next
              </button>
              <button onClick={() => setPage(3)} className="bg-black text-white px-12 py-5 rounded-2xl font-black uppercase text-xl hover:bg-purple-600 transition-all shadow-2xl">
                Login
              </button>
              <button onClick={() => setPage(3)} className="bg-black text-white px-12 py-5 rounded-2xl font-black uppercase text-xl hover:bg-purple-600 transition-all shadow-2xl">
                Register
              </button>
              <button onClick={() => setPage(4)} className="bg-gray-800 text-white px-12 py-5 rounded-2xl font-black uppercase text-xl hover:bg-gray-700 transition-all shadow-2xl">
                Browse For Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 2: MISSION SPLASH - Purple Background */}
      {page === 2 && (
        <div className="h-full bg-gradient-to-br from-purple-900 via-black to-purple-900 flex flex-col items-center justify-center text-center px-4">
          <Sparkles size={120} className="text-purple-500 mb-12 animate-pulse" />
          <h1 className="text-[8rem] leading-none text-white font-black uppercase tracking-tighter mb-6" style={{ fontFamily: 'serif' }}>
            MANDASTRONG'S<br/>STUDIO
          </h1>
          <p className="text-5xl text-purple-400 font-black italic max-w-5xl">
            Make Awesome Family Movies Or Put Your Dreams Into Reality. Enjoy!
          </p>
        </div>
      )}

      {/* PAGE 3: AUTH & PRICING */}
      {page === 3 && (
        <div className="h-full bg-gradient-to-br from-purple-900 via-black to-purple-900 flex items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-7xl">
            {/* Login and Register Side by Side */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              {/* Login Card */}
              <div className="bg-black/60 border-2 border-purple-500/30 rounded-3xl p-10 backdrop-blur">
                <h2 className="text-4xl text-white font-black uppercase mb-8">Login</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-white font-bold mb-2 block">Email</label>
                    <input 
                      type="email" 
                      placeholder="your@email.com"
                      className="w-full bg-purple-900/20 border-2 border-purple-500/30 rounded-xl px-6 py-4 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-white font-bold mb-2 block">Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-purple-900/20 border-2 border-purple-500/30 rounded-xl px-6 py-4 text-white placeholder-gray-400"
                    />
                  </div>
                  <button onClick={() => setPage(4)} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-black uppercase text-xl transition-all">
                    Login
                  </button>
                  <button onClick={() => setPage(1)} className="w-full bg-purple-900/40 border-2 border-purple-500/30 hover:bg-purple-800/40 text-white py-4 rounded-xl font-black uppercase transition-all">
                    Back
                  </button>
                </div>
              </div>

              {/* Register Card */}
              <div className="bg-black/60 border-2 border-purple-500/30 rounded-3xl p-10 backdrop-blur">
                <h2 className="text-4xl text-white font-black uppercase mb-8">Register</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-white font-bold mb-2 block">Name</label>
                    <input 
                      type="text" 
                      placeholder="Your Name"
                      className="w-full bg-purple-900/20 border-2 border-purple-500/30 rounded-xl px-6 py-4 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-white font-bold mb-2 block">Email</label>
                    <input 
                      type="email" 
                      placeholder="your@email.com"
                      className="w-full bg-purple-900/20 border-2 border-purple-500/30 rounded-xl px-6 py-4 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-white font-bold mb-2 block">Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-purple-900/20 border-2 border-purple-500/30 rounded-xl px-6 py-4 text-white placeholder-gray-400"
                    />
                  </div>
                  <button onClick={() => setPage(4)} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-black uppercase text-xl transition-all">
                    Create Account
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing Tiers */}
            <h2 className="text-6xl text-white font-black uppercase text-center mb-10">Select Your Plan</h2>
            <div className="grid grid-cols-3 gap-8">
              {[
                { name: 'BASIC', price: '20', features: ['HD Export', '100 AI Tools', 'Basic Templates', '10GB Storage', 'Email Support'] },
                { name: 'PRO', price: '30', features: ['4K Export', '300 AI Tools', 'Premium Templates', '100GB Storage', 'Priority Support', 'Commercial License'], popular: true },
                { name: 'STUDIO', price: '50', features: ['8K Export', 'All 600 AI Tools', 'Unlimited Templates', '1TB Storage', '24/7 Live Support', 'Full Commercial Rights', 'Team Collaboration'] }
              ].map((plan, i) => (
                <div 
                  key={i} 
                  className={`bg-black/60 border-2 ${plan.popular ? 'border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.3)]' : 'border-purple-500/30'} rounded-3xl p-8 backdrop-blur relative`}
                  onClick={() => setSelectedPlan(plan.name.toLowerCase())}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 px-6 py-2 rounded-full font-black text-black text-sm uppercase">
                      POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl text-white font-black uppercase mb-4">{plan.name}</h3>
                  <div className="text-7xl text-white font-black mb-6">
                    ${plan.price}<span className="text-2xl text-gray-400">/mo</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-white flex items-center gap-2">
                        <CheckCircle size={20} className="text-purple-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.popular && selectedPlan === plan.name.toLowerCase() && (
                    <div className="text-center text-yellow-500 font-black text-lg mb-4">✓ SELECTED</div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <button onClick={() => setPage(4)} className="bg-purple-600 hover:bg-purple-500 text-white px-16 py-5 rounded-full font-black uppercase text-2xl transition-all shadow-2xl">
                Continue to Payment
              </button>
              <p className="text-gray-400 mt-4">Secure payment powered by Stripe</p>
            </div>

            <div className="text-center mt-8">
              <button onClick={() => setPage(4)} className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 rounded-full font-black uppercase text-lg transition-all flex items-center gap-3 mx-auto">
                <Eye size={24} />
                Browse as Guest (View Only)
              </button>
              <p className="text-gray-400 mt-2 text-sm">Explore the platform without an account</p>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 4: AI HUB DIRECTORY - 3x2 Grid */}
      {page === 4 && (
        <div className="h-full bg-black flex flex-col items-center justify-center p-8 relative">
          {/* Search Button Top Left */}
          <button className="absolute top-8 left-8 bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-full font-black uppercase flex items-center gap-2 transition-all">
            <Search size={20} />
            Search Tools
          </button>

          <h1 className="text-7xl text-white font-black uppercase mb-16">AI Production Hub</h1>
          <div className="grid grid-cols-3 gap-8 max-w-7xl">
            {[
              { name: 'Writing Board', icon: PenTool, page: 5, desc: '120 Script & Story Tools' },
              { name: 'Voice Board', icon: Mic, page: 6, desc: 'AI Voice Synthesis' },
              { name: 'Image Board', icon: ImageIcon, page: 7, desc: 'Visual Asset Creation' },
              { name: 'Video Board', icon: Camera, page: 8, desc: 'Cinematography Tools' },
              { name: 'Motion Board', icon: Zap, page: 9, desc: 'Animation & Physics' },
              { name: 'Editing Board', icon: Film, page: 10, desc: 'Final Assembly' }
            ].map((board, i) => (
              <button
                key={i}
                onClick={() => setPage(board.page)}
                className="bg-gradient-to-br from-purple-900 to-purple-600 hover:from-purple-600 hover:to-purple-900 border-4 border-purple-400/30 rounded-3xl p-12 flex flex-col items-center justify-center gap-6 transition-all hover:scale-105 shadow-2xl"
              >
                <board.icon size={80} className="text-white" />
                <div className="text-center">
                  <h2 className="text-3xl text-white font-black uppercase">{board.name}</h2>
                  <p className="text-purple-200 mt-2">{board.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 5: WRITING BOARD - 120 Tools Grid */}
      {page === 5 && (
        <div className="h-full bg-black overflow-y-auto p-8">
          <h1 className="text-6xl text-white font-black uppercase mb-4 text-center">Writing Board</h1>
          <p className="text-purple-400 text-center mb-12 text-xl">Pre-Production & Script Development Tools</p>
          <div className="grid grid-cols-6 gap-4 max-w-[1800px] mx-auto pb-32">
            {Array.from({ length: 120 }, (_, i) => [
              'Script Generator', 'Dialogue Writer', 'Character Builder', 'Plot Outliner', 'Scene Breakdown',
              'Story Arc Creator', 'Conflict Generator', 'Theme Developer', 'Logline Creator', 'Synopsis Writer',
              'Beat Sheet', 'Three-Act Structure', 'Character Arc', 'Subplot Generator', 'Backstory Creator',
              'Motivation Builder', 'World Builder', 'Setting Designer', 'Time Period Research', 'Historical Context'
            ][i % 20] + ` ${Math.floor(i / 20) + 1}`).map((tool, i) => (
              <div
                key={i}
                className="bg-purple-900/30 hover:bg-purple-600 border-2 border-purple-500/30 rounded-xl p-4 text-center transition-all cursor-pointer"
              >
                <p className="text-white font-black text-sm uppercase">{tool}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 6: VOICE BOARD */}
      {page === 6 && (
        <div className="h-full bg-black overflow-y-auto p-8">
          <h1 className="text-6xl text-white font-black uppercase mb-4 text-center">Voice Board</h1>
          <p className="text-purple-400 text-center mb-12 text-xl">Audio Synthesis & Voice Cloning Tools</p>
          <div className="grid grid-cols-6 gap-4 max-w-[1800px] mx-auto pb-32">
            {Array.from({ length: 120 }, (_, i) => [
              'Voice Clone', 'Narrator AI', 'Character Voice', 'Emotion Control', 'Accent Generator',
              'Dialogue Synthesis', 'Voice Aging', 'Pitch Adjuster', 'Speech Speed', 'Tonal Shift'
            ][i % 10] + ` ${Math.floor(i / 10) + 1}`).map((tool, i) => (
              <div
                key={i}
                className="bg-purple-900/30 hover:bg-purple-600 border-2 border-purple-500/30 rounded-xl p-4 text-center transition-all cursor-pointer"
              >
                <p className="text-white font-black text-sm uppercase">{tool}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 7: IMAGE BOARD */}
      {page === 7 && (
        <div className="h-full bg-black overflow-y-auto p-8">
          <h1 className="text-6xl text-white font-black uppercase mb-4 text-center">Image Board</h1>
          <p className="text-purple-400 text-center mb-12 text-xl">Visual Asset Creation & Generation Tools</p>
          <div className="grid grid-cols-6 gap-4 max-w-[1800px] mx-auto pb-32">
            {Array.from({ length: 120 }, (_, i) => [
              'Character Portrait', 'Background Art', 'Texture Generator', 'Concept Art', 'Storyboard Frame',
              'VFX Plate', 'Matte Painting', 'Prop Design', 'Costume Design', 'Location Concept'
            ][i % 10] + ` ${Math.floor(i / 10) + 1}`).map((tool, i) => (
              <div
                key={i}
                className="bg-purple-900/30 hover:bg-purple-600 border-2 border-purple-500/30 rounded-xl p-4 text-center transition-all cursor-pointer"
              >
                <p className="text-white font-black text-sm uppercase">{tool}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 8: VIDEO BOARD */}
      {page === 8 && (
        <div className="h-full bg-black overflow-y-auto p-8">
          <h1 className="text-6xl text-white font-black uppercase mb-4 text-center">Video Board</h1>
          <p className="text-purple-400 text-center mb-12 text-xl">Cinematography & Motion Video Tools</p>
          <div className="grid grid-cols-6 gap-4 max-w-[1800px] mx-auto pb-32">
            {Array.from({ length: 120 }, (_, i) => [
              'Motion Video Gen', 'Avatar Synthesis', 'Camera Pan', 'Camera Tilt', 'Crane Shot',
              'Dolly Movement', 'Zoom Control', 'Tracking Shot', 'Establishing Shot', 'Close-Up Gen'
            ][i % 10] + ` ${Math.floor(i / 10) + 1}`).map((tool, i) => (
              <div
                key={i}
                className="bg-purple-900/30 hover:bg-purple-600 border-2 border-purple-500/30 rounded-xl p-4 text-center transition-all cursor-pointer"
              >
                <p className="text-white font-black text-sm uppercase">{tool}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 9: MOTION BOARD */}
      {page === 9 && (
        <div className="h-full bg-black overflow-y-auto p-8">
          <h1 className="text-6xl text-white font-black uppercase mb-4 text-center">Motion Board</h1>
          <p className="text-purple-400 text-center mb-12 text-xl">Animation & Physics Simulation Tools</p>
          <div className="grid grid-cols-6 gap-4 max-w-[1800px] mx-auto pb-32">
            {Array.from({ length: 120 }, (_, i) => [
              'Motion Capture', 'Character Rigging', 'Facial Tracking', 'Cloth Physics', 'Fluid Dynamics',
              'Particle System', 'Bone Animation', 'IK Solver', 'Walk Cycle', 'Expression Morph'
            ][i % 10] + ` ${Math.floor(i / 10) + 1}`).map((tool, i) => (
              <div
                key={i}
                className="bg-purple-900/30 hover:bg-purple-600 border-2 border-purple-500/30 rounded-xl p-4 text-center transition-all cursor-pointer"
              >
                <p className="text-white font-black text-sm uppercase">{tool}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 10: EDITOR'S CHOICE - Full Screen Movie Player */}
      {page === 10 && (
        <div className="h-full bg-black flex flex-col items-center justify-center relative">
          <div className="absolute top-8 left-8">
            <h1 className="text-5xl text-white font-black uppercase">Editor's Choice</h1>
            <p className="text-purple-400 mt-2">Featured Films & Templates</p>
          </div>
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-gray-900 border-4 border-purple-500/30 rounded-3xl w-4/5 h-3/4 flex items-center justify-center">
              <Play size={120} className="text-purple-500" />
              <p className="text-white text-3xl font-black ml-8">FULL SCREEN MOVIE PLAYER</p>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 11: EDITOR'S SUITE */}
      {page === 11 && (
        <div className="h-full bg-black flex flex-col p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-6xl text-white font-black uppercase">Editor's Suite</h1>
              <p className="text-purple-400 mt-2 text-xl">Professional Multi-Track Timeline Interface</p>
            </div>
          </div>
          
          {/* Timeline Interface */}
          <div className="flex-1 bg-gray-900 border-2 border-purple-500/30 rounded-3xl p-8 mb-24">
            <div className="space-y-4">
              {['SRT Track (Subtitles)', 'VIDEO Track', 'AUDIO Track', 'TEXT Track'].map((track, i) => (
                <div key={i} className="bg-black border-2 border-purple-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-black uppercase">{track}</span>
                    <button className="bg-purple-600 px-4 py-2 rounded-lg text-white font-bold text-sm hover:bg-purple-500">
                      + Add Clip
                    </button>
                  </div>
                  <div className="h-16 bg-gray-800 rounded-lg flex items-center px-4">
                    <div className="bg-purple-600 h-12 w-48 rounded-lg flex items-center justify-center text-white font-bold">
                      Clip {i + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAGE 12: ASSET MANAGER */}
      {page === 12 && (
        <div className="h-full bg-black p-8 overflow-y-auto">
          <h1 className="text-6xl text-white font-black uppercase mb-4">Asset Manager</h1>
          <p className="text-purple-400 mb-12 text-xl">Storage for Uploaded & AI-Generated Content</p>
          
          <div className="mb-8 flex gap-4">
            <button className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-black uppercase flex items-center gap-2">
              <Upload size={20} />
              Open Files
            </button>
            <button className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-black uppercase flex items-center gap-2">
              <ImageIcon size={20} />
              Open Photos/Videos
            </button>
            <button className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl font-black uppercase flex items-center gap-2">
              <Database size={20} />
              Open Google Drive
            </button>
          </div>

          <div className="grid grid-cols-5 gap-6 pb-32">
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} className="bg-gray-900 border-2 border-purple-500/30 rounded-2xl p-4 hover:border-purple-500 transition-all cursor-pointer">
                <div className="bg-gray-800 rounded-xl h-40 mb-3 flex items-center justify-center">
                  <FileVideo size={48} className="text-purple-500" />
                </div>
                <p className="text-white font-bold text-sm">Asset_{i + 1}.mp4</p>
              </div>
            ))}
          </div>

          <div className="bg-purple-900/30 border-2 border-purple-500/30 rounded-2xl p-6 mb-32">
            <p className="text-white font-black text-xl">⚠️ Have I Missed A Thing?</p>
            <p className="text-purple-300 mt-2">Double-check you've uploaded all necessary assets before proceeding!</p>
          </div>
        </div>
      )}

      {/* PAGE 13: AI ENHANCEMENT STUDIO */}
      {page === 13 && (
        <div className="h-full bg-black p-8 overflow-y-auto">
          <h1 className="text-6xl text-white font-black uppercase mb-4">AI Enhancement Studio</h1>
          <p className="text-purple-400 mb-12 text-xl">The Best Movie Enhancer - 30 Optimization Tools</p>

          {/* Duration Slider */}
          <div className="bg-gray-900 border-2 border-purple-500/30 rounded-2xl p-8 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-black text-2xl uppercase">Master Duration (0-180 minutes)</span>
              <span className="text-purple-400 font-black text-4xl">{duration}m</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="180" 
              value={duration} 
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div className="grid grid-cols-5 gap-4 pb-32">
            {[
              '4K Upscale', '8K Upscale', 'AI Color Grade', 'De-Noise Pro', 'Frame Generation',
              'Motion Smoothing', 'Sharpness Enhance', 'Contrast Boost', 'Dynamic Range', 'HDR Conversion',
              'Lighting Synth', 'Shadow Recovery', 'Highlight Fix', 'Saturation Control', 'White Balance',
              'Grain Removal', 'Artifact Cleanup', 'Stabilization', 'Slow Motion', 'Speed Ramp',
              'Resolution Boost', 'Codec Optimize', 'Bitrate Control', 'Render Quality', 'Export Preset',
              'Color Space', 'Gamma Correction', 'LUT Apply', 'Film Emulation', 'Vintage Effect'
            ].map((tool, i) => (
              <button
                key={i}
                className="bg-purple-900/30 hover:bg-purple-600 border-2 border-purple-500/30 rounded-xl p-6 text-center transition-all"
              >
                <Settings size={32} className="text-purple-400 mx-auto mb-2" />
                <p className="text-white font-black text-sm uppercase">{tool}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 14: MULTI-LAYER TIMELINE */}
      {page === 14 && (
        <div className="h-full bg-black p-8">
          <h1 className="text-6xl text-white font-black uppercase mb-4">Multi-Layer Timeline</h1>
          <p className="text-purple-400 mb-12 text-xl">VFX Layering & Green Screen Compositing</p>

          <div className="bg-gray-900 border-2 border-purple-500/30 rounded-3xl p-8 h-[70vh] overflow-y-auto mb-24">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="bg-black border-2 border-purple-500/20 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-black uppercase">Layer {i + 1}</span>
                  <div className="flex gap-2">
                    <button className="bg-purple-600 px-3 py-1 rounded text-white font-bold text-sm hover:bg-purple-500">
                      VFX
                    </button>
                    <button className="bg-purple-600 px-3 py-1 rounded text-white font-bold text-sm hover:bg-purple-500">
                      Overlay
                    </button>
                  </div>
                </div>
                <div className="h-12 bg-gray-800 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 15: AUDIO MIXING SUITE */}
      {page === 15 && (
        <div className="h-full bg-black p-8">
          <h1 className="text-6xl text-white font-black uppercase mb-4">Audio Mixing Suite</h1>
          <p className="text-purple-400 mb-12 text-xl">Balance Dialogue, SFX, and Music with Spatial Audio</p>

          <div className="grid grid-cols-3 gap-8 mb-24">
            {['Dialogue', 'Sound Effects', 'Music'].map((channel, i) => (
              <div key={i} className="bg-gray-900 border-2 border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-white font-black text-2xl uppercase mb-6 text-center">{channel}</h3>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-64 bg-gray-800 rounded-full relative mb-4">
                    <div className="absolute bottom-0 left-0 right-0 bg-purple-600 rounded-full" style={{ height: '60%' }}></div>
                  </div>
                  <div className="text-white font-black text-3xl">-12dB</div>
                </div>
                <div className="mt-6 space-y-3">
                  <button className="w-full bg-purple-600 hover:bg-purple-500 py-2 rounded-lg text-white font-bold">
                    Solo
                  </button>
                  <button className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-white font-bold">
                    Mute
                  </button>
                  <button className="w-full bg-purple-900/40 hover:bg-purple-800/40 py-2 rounded-lg text-white font-bold">
                    3D Pan
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 border-2 border-purple-500/30 rounded-2xl p-6 mb-24">
            <h3 className="text-white font-black text-xl uppercase mb-4">Master Volume</h3>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={volume} 
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="flex-1 h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <span className="text-purple-400 font-black text-4xl w-24">{volume}%</span>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 16: COLOR CORRECTION & FINAL HUB */}
      {page === 16 && (
        <div className="h-full bg-black p-8 overflow-y-auto">
          <h1 className="text-6xl text-white font-black uppercase mb-4">Color Grading & Final Hub</h1>
          <p className="text-purple-400 mb-12 text-xl">Professional Cinema Look & Export Center</p>

          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Preview Window */}
            <div className="bg-gray-900 border-2 border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-white font-black text-xl uppercase mb-4">Preview</h3>
              <div className="bg-black rounded-xl h-64 flex items-center justify-center">
                <Play size={64} className="text-purple-500" />
              </div>
            </div>

            {/* Color Wheels */}
            <div className="bg-gray-900 border-2 border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-white font-black text-xl uppercase mb-4">Color Wheels</h3>
              <div className="grid grid-cols-3 gap-4">
                {['Lift', 'Gamma', 'Gain'].map((wheel, i) => (
                  <div key={i} className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mx-auto mb-2"></div>
                    <p className="text-white font-bold">{wheel}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Final Actions */}
          <div className="bg-purple-900/30 border-2 border-purple-500/30 rounded-2xl p-8 mb-8">
            <h3 className="text-white font-black text-3xl uppercase mb-6 text-center">Final Export & Publish</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button className="bg-purple-600 hover:bg-purple-500 py-4 rounded-xl text-white font-black uppercase flex flex-col items-center gap-2">
                <Download size={32} />
                Save
              </button>
              <button className="bg-purple-600 hover:bg-purple-500 py-4 rounded-xl text-white font-black uppercase flex flex-col items-center gap-2">
                <Download size={32} />
                Download
              </button>
              <button className="bg-purple-600 hover:bg-purple-500 py-4 rounded-xl text-white font-black uppercase flex flex-col items-center gap-2">
                <Share2 size={32} />
                Export
              </button>
              <button className="bg-green-600 hover:bg-green-500 py-4 rounded-xl text-white font-black uppercase flex flex-col items-center gap-2">
                <CheckCircle size={32} />
                Render
              </button>
            </div>

            <div className="bg-black/50 rounded-xl p-6">
              <h4 className="text-white font-black text-xl uppercase mb-4">Share To:</h4>
              <div className="grid grid-cols-6 gap-4">
                {[
                  { name: 'YouTube', icon: Youtube, color: 'red' },
                  { name: 'X/Twitter', icon: Twitter, color: 'blue' },
                  { name: 'Instagram', icon: ImageIcon, color: 'pink' },
                  { name: 'TikTok', icon: Music, color: 'black' },
                  { name: 'Vimeo', icon: Video, color: 'cyan' },
                  { name: 'Facebook', icon: Users, color: 'blue' }
                ].map((platform, i) => (
                  <button key={i} className={`bg-${platform.color}-600 hover:bg-${platform.color}-500 py-3 rounded-lg text-white font-bold flex flex-col items-center gap-2`}>
                    <platform.icon size={24} />
                    {platform.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border-2 border-green-500/30 rounded-2xl p-6 text-center mb-32">
            <p className="text-green-400 font-black text-2xl mb-2">✅ RENDER COMPLETE</p>
            <p className="text-white text-lg">Your movie is ready! It will appear on the preview screen.</p>
          </div>
        </div>
      )}

      {/* PAGE 17: TUTORIAL CENTER */}
      {page === 17 && (
        <div className="h-full bg-black p-8 overflow-y-auto">
          <h1 className="text-6xl text-white font-black uppercase mb-4 text-center">Tutorial Center</h1>
          <p className="text-purple-400 mb-12 text-xl text-center">Video-Based Masterclasses & Knowledge Hub</p>

          <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto pb-32">
            {[
              'Getting Started', 'AI Tools Overview', 'Script Writing 101', 'Voice Synthesis Guide',
              'Image Generation', 'Video Creation', 'Animation Basics', 'Timeline Editing',
              'Audio Mixing', 'Color Grading', 'VFX Compositing', 'Export Settings',
              'YouTube Upload', 'Social Media Tips', 'Feature Film Workflow', 'Advanced Techniques'
            ].map((tutorial, i) => (
              <div key={i} className="bg-gray-900 border-2 border-purple-500/30 rounded-2xl p-6 hover:border-purple-500 transition-all cursor-pointer">
                <div className="bg-black rounded-xl h-48 flex items-center justify-center mb-4">
                  <Play size={64} className="text-purple-500" />
                </div>
                <h3 className="text-white font-black text-xl mb-2">{tutorial}</h3>
                <p className="text-gray-400">Learn how to master this feature</p>
                <p className="text-purple-400 font-bold mt-2">Duration: 10-15 min</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 18: LEGAL & HELP DESK */}
      {page === 18 && (
        <div className="h-full bg-black p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto pb-32">
            <h1 className="text-6xl text-white font-black uppercase mb-4 text-center">Legal & Support</h1>
            <p className="text-purple-400 mb-12 text-xl text-center">Terms of Service & 24/7 Agent Grok Help Desk</p>

            {/* Help Desk */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-600 border-2 border-purple-400/30 rounded-3xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl text-white font-black uppercase">Agent Grok Help Desk</h2>
                  <p className="text-purple-200 mt-2 text-xl">🤖 AI-Powered Support - Available 24/7</p>
                </div>
                <MessageCircle size={64} className="text-white" />
              </div>
              
              <div className="bg-black/30 rounded-2xl p-6 mb-4 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  <div className="bg-purple-700 rounded-xl p-4 max-w-md">
                    <p className="text-white font-bold">Hello! I'm Agent Grok. How can I help you today?</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Type your question here..."
                  className="flex-1 bg-white/10 border-2 border-purple-400/30 rounded-xl px-6 py-4 text-white placeholder-gray-400"
                />
                <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-black uppercase hover:bg-purple-100 transition-all">
                  Send
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button className="bg-white/10 hover:bg-white/20 py-3 rounded-xl text-white font-bold">Technical Issues</button>
                <button className="bg-white/10 hover:bg-white/20 py-3 rounded-xl text-white font-bold">Feature Questions</button>
                <button className="bg-white/10 hover:bg-white/20 py-3 rounded-xl text-white font-bold">Creative Guidance</button>
                <button className="bg-white/10 hover:bg-white/20 py-3 rounded-xl text-white font-bold">Billing Inquiries</button>
              </div>
            </div>

            {/* Legal Documents */}
            <div className="bg-gray-900 border-2 border-purple-500/30 rounded-2xl p-8">
              <h2 className="text-3xl text-white font-black uppercase mb-6">Legal Documents</h2>
              
              <div className="space-y-6">
                <div className="bg-black/50 rounded-xl p-6">
                  <h3 className="text-white font-black text-xl mb-3 flex items-center gap-2">
                    <Shield size={24} className="text-purple-500" />
                    Terms of Service
                  </h3>
                  <p className="text-gray-300 mb-4">
                    By using MandaStrong Studio, you agree to our terms and conditions. All content created using our AI tools is owned by you. We respect intellectual property rights and expect all users to do the same.
                  </p>
                  <button className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-lg text-white font-bold">
                    Read Full TOS
                  </button>
                </div>

                <div className="bg-black/50 rounded-xl p-6">
                  <h3 className="text-white font-black text-xl mb-3 flex items-center gap-2">
                    <Shield size={24} className="text-purple-500" />
                    Disclaimer
                  </h3>
                  <p className="text-gray-300">
                    AI-generated content should be reviewed before distribution. Users are responsible for ensuring their content complies with local laws and regulations. We provide tools for creativity, but users maintain full responsibility for their final productions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 19: (Reserved/Blank) */}
      {page === 19 && (
        <div className="h-full bg-black flex items-center justify-center">
          <div className="text-center">
            <Sparkles size={120} className="text-purple-500 mx-auto mb-8 animate-pulse" />
            <h1 className="text-6xl text-white font-black uppercase mb-4">Coming Soon</h1>
            <p className="text-purple-400 text-2xl">More Features on the Way!</p>
          </div>
        </div>
      )}

      {/* PAGE 20: COMMUNITY HUB */}
      {page === 20 && (
        <div className="h-full bg-black p-8 overflow-y-auto">
          <h1 className="text-6xl text-white font-black uppercase mb-4 text-center">Community Hub</h1>
          <p className="text-purple-400 mb-12 text-xl text-center">Share Your Work & Connect with Fellow Creators</p>

          <div className="max-w-7xl mx-auto pb-32">
            <div className="bg-purple-900/30 border-2 border-purple-500/30 rounded-2xl p-8 mb-8">
              <h2 className="text-3xl text-white font-black uppercase mb-4">Submit Your Creation</h2>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Title of your movie..."
                  className="flex-1 bg-black/50 border-2 border-purple-500/30 rounded-xl px-6 py-4 text-white placeholder-gray-400"
                />
                <button className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-xl text-white font-black uppercase">
                  Upload
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="bg-gray-900 border-2 border-purple-500/30 rounded-2xl p-6 hover:border-purple-500 transition-all">
                  <div className="bg-black rounded-xl h-48 flex items-center justify-center mb-4">
                    <Film size={64} className="text-purple-500" />
                  </div>
                  <h3 className="text-white font-black text-xl mb-2">User Film {i + 1}</h3>
                  <p className="text-gray-400 mb-4">by Creator_{i + 1}</p>
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300">
                      <Heart size={20} />
                      <span className="font-bold">{Math.floor(Math.random() * 500) + 50}</span>
                    </button>
                    <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300">
                      <MessageCircle size={20} />
                      <span className="font-bold">{Math.floor(Math.random() * 100) + 10}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAGE 21: THANK YOU */}
      {page === 21 && (
        <div className="h-full bg-gradient-to-br from-purple-900 via-black to-purple-900 flex flex-col items-center justify-center p-8 overflow-y-auto">
          <div className="text-center max-w-5xl mb-16">
            <h1 className="text-[8rem] leading-none text-white font-black uppercase mb-8" style={{ fontFamily: 'serif' }}>
              THAT'S ALL FOLKS!
            </h1>
            
            <div className="bg-black/60 border-2 border-purple-500/30 rounded-3xl p-12 backdrop-blur mb-12">
              <h2 className="text-4xl text-purple-400 font-black uppercase mb-6">Thank You from Amanda!</h2>
              <p className="text-white text-2xl leading-relaxed mb-6">
                Thank you to all creators - past, present, and future - for choosing MandaStrong Studio to bring your creative visions to life. Your stories matter. Your dreams matter. Together, we're creating content that educates, inspires, and makes a positive impact on the world.
              </p>
            </div>

            <div className="bg-purple-900/30 border-2 border-purple-500/30 rounded-3xl p-12 backdrop-blur mb-12">
              <h2 className="text-4xl text-white font-black uppercase mb-6">Our Fundraiser Mission</h2>
              <p className="text-purple-200 text-xl leading-relaxed mb-6">
                MandaStrong Studio is part of a larger educational mission focused on bullying prevention programs for schools, social skills development, and educational movie content for students.
              </p>
              <div className="bg-yellow-500/20 border-2 border-yellow-500/30 rounded-2xl p-6 mb-6">
                <p className="text-yellow-300 text-2xl font-black">
                  💛 100% of all Etsy Store proceeds are donated to Veterans Mental Health Services
                </p>
              </div>
              <a 
                href="https://MandaStrong1.Etsy.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 hover:bg-purple-500 text-white px-12 py-5 rounded-full font-black uppercase text-2xl transition-all shadow-2xl"
              >
                Visit MandaStrong1.Etsy.com
              </a>
            </div>

            <div className="bg-black/60 border-2 border-purple-500/30 rounded-3xl p-12 backdrop-blur">
              <h2 className="text-4xl text-white font-black uppercase mb-6">Complete User Guide</h2>
              <p className="text-purple-200 text-xl mb-6">
                Need help getting started? Check out our comprehensive guide on how to use MandaStrong Studio to create feature-length films up to 3 hours.
              </p>
              <button className="bg-purple-600 hover:bg-purple-500 text-white px-12 py-4 rounded-full font-black uppercase text-xl transition-all flex items-center gap-3 mx-auto">
                <BookOpen size={24} />
                View Complete Guide
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-purple-400 text-2xl italic mb-4">
              "Your creativity matters. Your stories matter. Your impact matters."
            </p>
            <p className="text-white font-black text-xl">
              © 2025 MandaStrong1 - All Rights Reserved
            </p>
          </div>
        </div>
      )}

      {/* Global UI Elements */}
      {page >= 1 && <HelpButton />}
      {page >= 1 && <QuickAccessMenu />}
      <Footer />
      <Navigation />
    </div>
  );
}