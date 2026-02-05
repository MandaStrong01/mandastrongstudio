import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Menu, Search, Play, MessageCircle, Film, Music,
  Image as ImageIcon, Video, Mic, Zap, Clock, Upload, Database,
  Sliders, Layers, Palette, Download, Share2, Youtube, Twitter, Instagram,
  Facebook, BookOpen, Shield, Heart, Send, X, ChevronRight, ChevronLeft,
  Home, Settings, User, Check, Headphones, Volume2, Eye, FileVideo,
  TrendingUp, Camera, CheckCircle, Crown, LogOut
} from 'lucide-react';
import MandaStrongStudioPro from './components/MandaStrongStudioPro';
import AIToolInterface from './components/AIToolInterface';

const generateTools = (baseTools: string[]) => {
  const tools = [];
  for (let i = 0; i < 120; i++) {
    const base = baseTools[i % baseTools.length];
    const suffix = i >= baseTools.length ? ` PRO ${Math.floor(i / baseTools.length)}` : "";
    tools.push(`${base}${suffix}`);
  }
  return tools;
};

const TOOL_BOARDS = {
  Writing: generateTools([
    "Dialogue Writer", "Plot Generator", "Scene Writer", "Story Outliner",
    "Character Developer", "Dialogue Editor", "Plot Designer", "Story Planner",
    "Treatment Writer", "Script Formatter", "Plot Creator", "Three Act Builder"
  ]),
  Voice: generateTools([
    "Voice Maker", "Voice Cloner", "Voice Creator Tool", "Voice Recorder",
    "Speech Converter", "Voice Builder", "Advanced Voice Generator", "Voice Studio Tool",
    "Premium Voice Generator", "Voice Audio Tool", "Emotional Voice Generator", "Advanced Speech Creator"
  ]),
  Image: generateTools([
    "Image Creator", "Advanced Image Generator", "Design Generator", "Image Tool",
    "Art Maker", "Art Mixer", "Image Stream Tool", "Art Library Tool",
    "Workflow Tool", "Auto Image Generator", "Image Studio Pro", "Easy Image Generator"
  ]),
  Video: generateTools([
    "Motion Video Maker", "Video Creator", "Avatar Generator", "Video Synthesizer",
    "Video Studio", "Video Flow Generator", "Video Creator Studio", "Video Crafter",
    "Image to Motion Tool", "Video Style Tool", "Temporal Flow Tool", "Frame Blender"
  ]),
  Motion: generateTools([
    "Motion Animator", "Motion Studio", "Auto Animator", "Motion Flow Tool",
    "Motion Capture Pro", "Webcam Motion Tool", "Skeleton Tracker", "Joint Tracker",
    "Character Rigger", "3D Character Studio", "Player Avatar Creator", "Avatar Generator"
  ]),
  Editing: generateTools([
    "Smart Video Editor", "Auto Editor", "Video Tools Suite", "Edit Master",
    "Scene Detector", "Beat Syncer", "Auto Assembly Tool", "Smart Timeline",
    "Highlight Finder", "Key Moment Finder", "Context Editor", "Intelligent Cutter"
  ])
};

const COMMUNITY_POSTS = [
  { title: "Epic Action Montage", author: "Sarah Johnson", time: "2 hours ago", likes: 1247, hearts: 823, comments: 156, emoji: "🎬", trending: true },
  { title: "Cinematic Travel Vlog", author: "Mike Chen", time: "5 hours ago", likes: 892, hearts: 634, comments: 89, emoji: "✈️" },
  { title: "Product Showcase Video", author: "Emily Rodriguez", time: "1 day ago", likes: 2156, hearts: 1423, comments: 267, emoji: "📦", trending: true },
  { title: "Music Video Edit", author: "Alex Thompson", time: "1 day ago", likes: 3421, hearts: 2789, comments: 445, emoji: "🎵", trending: true },
  { title: "Wedding Highlights", author: "Jessica Kim", time: "3 days ago", likes: 1847, hearts: 1234, comments: 203, emoji: "💍" },
  { title: "Gaming Montage", author: "David Brown", time: "4 days ago", likes: 2934, hearts: 1987, comments: 512, emoji: "🎮" }
];

// FIX 1: ADD SPLASH PAGE COMPONENT
const SplashPage = ({ onContinue }: { onContinue: () => void }) => (
  <div 
    className="w-full h-screen bg-black flex items-center justify-center cursor-pointer" 
    onClick={onContinue}
  >
    <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at center, rgba(107,33,168,0.5) 0%, #000 75%)'}}></div>
    <div className="relative z-10 text-center">
      <div className="w-56 h-56 mx-auto rounded-full border-4 border-purple-700 flex items-center justify-center mb-12" style={{boxShadow:'0 0 80px rgba(107,33,168,0.6)'}}>
        <Film className="w-32 h-32 text-purple-400" strokeWidth={1.5} />
      </div>
      <h1 className="text-9xl font-black text-white mb-4" style={{fontFamily:'Impact,sans-serif',letterSpacing:'0.15em',textShadow:'0 0 60px rgba(107,33,168,0.8)'}}>
        MANDASTRONG
      </h1>
      <h2 className="text-6xl font-bold text-purple-400 mb-16" style={{letterSpacing:'0.4em'}}>STUDIO</h2>
      <div className="w-36 h-1 rounded-full mx-auto mb-14" style={{background:'linear-gradient(to right, transparent, #6B21A8, transparent)'}}></div>
      <p className="text-white text-2xl animate-pulse">Tap anywhere to continue</p>
    </div>
  </div>
);

export default function App() {
  // FIX 2: ADD SHOWSPLASH STATE
  const [showSplash, setShowSplash] = useState(true);
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [duration, setDuration] = useState(90);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [volume, setVolume] = useState(80);
  const [editorTab, setEditorTab] = useState('home');
  const [showProStudio, setShowProStudio] = useState(false);
  const [selectedTool, setSelectedTool] = useState<{name: string, category: string} | null>(null);

  // FIX 3: SPLASH RENDER CHECK
  if (showSplash) {
    return <SplashPage onContinue={() => setShowSplash(false)} />;
  }

  if (showProStudio) {
    return <MandaStrongStudioPro />;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const goTo = (p: number) => {
    setPage(p);
    setMenuOpen(false);
  };

  const QuickAccessMenu = () => (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-5 py-2.5 rounded-lg font-medium text-sm text-white flex items-center gap-2 shadow-lg transition-all backdrop-blur-sm"
      >
        <Menu size={18} /> Menu
      </button>
      {menuOpen && (
        <div className="absolute top-14 right-0 bg-zinc-900 border border-zinc-700 rounded-lg p-2 w-64 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => { setShowProStudio(true); setMenuOpen(false); }}
              className="text-left text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-md transition"
            >
              Pro Studio
            </button>
            <div className="h-px bg-zinc-800 my-1"></div>
            {[
              {page: 1, label: "Home"},
              {page: 4, label: "AI Tools"},
              {page: 12, label: "Editor Suite"},
              {page: 16, label: "Export"},
              {page: 17, label: "Tutorials"},
              {page: 19, label: "Help Desk"},
              {page: 20, label: "Community"},
              {page: 21, label: "About"}
            ].map((item) => (
              <button
                key={item.page}
                onClick={() => goTo(item.page)}
                className="text-left text-sm font-medium text-gray-300 hover:text-white px-4 py-2.5 hover:bg-zinc-800 rounded-md transition"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const GrokButton = () => page >= 2 && page !== 19 ? (
    <button
      onClick={() => setPage(19)}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 p-3.5 rounded-full shadow-lg transition-all"
    >
      <MessageCircle size={24} className="text-white" />
    </button>
  ) : null;

  const Footer = () => page >= 3 ? (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-sm py-3 text-center text-gray-400 text-xs md:text-sm font-medium z-40 border-t border-zinc-800">
      <p>MandaStrong Studio 2025 • Author of Doxy The School Bully • MandaStrong1.Etsy.com</p>
    </div>
  ) : null;

  // FIX 4: CENTERED NAVIGATION
  const Navigation = () => page >= 2 && page <= 21 ? (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex gap-4">
      {page > 1 && page < 21 && (
        <button
          onClick={() => setPage(page - 1)}
          className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-6 py-3 rounded-lg font-medium text-sm text-white shadow-lg transition-all flex items-center gap-2"
        >
          <ChevronLeft size={18} /> Back
        </button>
      )}
      {page < 21 && (
        <button
          onClick={() => setPage(page + 1)}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium text-sm text-white shadow-lg transition-all flex items-center gap-2"
        >
          Next <ChevronRight size={18} />
        </button>
      )}
      {page === 21 && (
        <>
          <button
            onClick={() => setPage(1)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium text-sm text-white shadow-lg transition-all"
          >
            Home
          </button>
          <button
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-6 py-3 rounded-lg font-medium text-sm text-white shadow-lg transition-all"
          >
            Close
          </button>
        </>
      )}
    </div>
  ) : null;

  const ToolBoard = ({ title, tools }: { title: string; tools: string[] }) => (
    <div className="min-h-screen bg-black text-white p-6 pb-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-400 mb-2">{title} Tools</h1>
          <p className="text-purple-300">Click any tool to start creating with AI</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {tools.map((tool, i) => (
            <button
              key={i}
              onClick={() => setSelectedTool({ name: tool, category: title })}
              className="bg-purple-950/30 border-2 border-purple-700 hover:border-purple-500 rounded-lg p-4 flex items-center gap-3 transition-all cursor-pointer group hover:scale-105"
            >
              <Sparkles size={18} className="text-purple-500 flex-shrink-0" />
              <span className="font-medium text-sm text-purple-200 group-hover:text-white transition text-left">{tool}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      {/* FIX 5: WATERMARK HIDING CSS */}
      <style>{`
        [data-bolt-badge], .bolt-badge, #bolt-badge,
        a[href*="bolt.new"], a[href*="bolt.host"],
        div[class*="fixed"][class*="bottom"] iframe { display:none !important; }
      `}</style>
      <QuickAccessMenu />
      <GrokButton />
      <Footer />
      <Navigation />

      {/* PAGE 1: HOME - NO VIDEO */}
      {page === 1 && (
        <div className="relative h-screen overflow-hidden bg-black">
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 py-8">
            <div className="mb-12">
              <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-4">
                MandaStrong Studio
              </h1>
              <p className="text-lg md:text-xl text-gray-300 font-normal max-w-3xl mx-auto">
                Professional cinema production platform with AI-powered tools for creating feature-length films up to 3 hours
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              <button
                onClick={() => setShowProStudio(true)}
                className="bg-blue-600 hover:bg-blue-700 px-12 py-4 rounded-lg text-lg font-semibold text-white transition shadow-lg"
              >
                Launch Pro Studio
              </button>
              {/* FIX 6: CORRECT BUTTON TEXT */}
              <div className="flex gap-3">
                <button
                  onClick={() => setPage(3)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-8 py-3 rounded-lg text-sm font-medium text-white transition"
                >
                  Login
                </button>
                <button
                  onClick={() => setPage(3)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-8 py-3 rounded-lg text-sm font-medium text-white transition"
                >
                  Register
                </button>
                <button
                  onClick={() => setPage(4)}
                  className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 px-8 py-3 rounded-lg text-sm font-medium text-gray-300 transition"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 2: WELCOME */}
      {page === 2 && (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center text-center px-4">
          <Sparkles size={64} className="text-blue-500 mb-8 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            MandaStrong Studio
          </h1>
          <p className="text-xl md:text-2xl font-normal text-gray-400 mb-3 max-w-2xl">Create professional family movies</p>
          <p className="text-xl md:text-2xl font-normal text-gray-400 max-w-2xl">and bring your stories to life</p>
        </div>
      )}

      {/* PAGE 3: LOGIN/REGISTER/PRICING */}
      {page === 3 && (
        <div className="min-h-screen bg-black p-8 pb-32 overflow-y-auto">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
            {/* Login */}
            <div className="bg-purple-950/30 border-2 border-purple-500 rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-8 text-purple-300">Sign In</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-300">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-black border-2 border-purple-500 rounded-lg px-4 py-3 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-300">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black border-2 border-purple-500 rounded-lg px-4 py-3 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 py-3.5 rounded-lg font-semibold text-base mt-6 transition">
                  Login
                </button>
                <div className="text-center">
                  <a href="#" className="text-sm text-purple-400 hover:text-purple-300">Forgot password?</a>
                </div>
              </form>
            </div>

            {/* Register */}
            <div className="bg-purple-950/30 border-2 border-purple-500 rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-8 text-purple-300">Create Account</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-300">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-black border-2 border-purple-500 rounded-lg px-4 py-3 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-300">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-black border-2 border-purple-500 rounded-lg px-4 py-3 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-300">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full bg-black border-2 border-purple-500 rounded-lg px-4 py-3 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 py-3.5 rounded-lg font-semibold text-base mt-6 transition">
                  Register
                </button>
              </form>
            </div>
          </div>

          <div className="flex items-center gap-4 max-w-lg mx-auto mb-8">
            <div className="flex-1 h-px bg-purple-700"></div>
            <span className="text-purple-400 font-medium text-sm">or</span>
            <div className="flex-1 h-px bg-purple-700"></div>
          </div>

          <div className="max-w-lg mx-auto mb-16">
            <button
              onClick={() => setPage(4)}
              className="w-full bg-purple-700 hover:bg-purple-600 border-2 border-purple-500 py-3.5 rounded-lg font-medium text-base flex items-center justify-center gap-2 transition"
            >
              <Eye size={20} /> Continue as Guest
            </button>
            <p className="text-center text-purple-400 text-sm mt-3">Explore features without creating an account</p>
          </div>

          {/* FIX 7: PRICING - NO FREE PLAN, BASIC $20, PRO $30, STUDIO $50 */}
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3 text-white">Choose Your Plan</h2>
            <p className="text-center text-purple-300 mb-10">Start free, upgrade anytime</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Basic', price: '20', features: ['HD Export', '100 AI Tools', 'Basic Templates', '10GB Storage', 'Email Support'], tier: 'basic' },
                { name: 'Pro', price: '30', features: ['4K Export', '300 AI Tools', 'Premium Templates', '100GB Storage', 'Priority Support', 'Commercial License'], popular: true, tier: 'pro' },
                { name: 'Studio', price: '50', features: ['8K Export', 'All 600 AI Tools', 'Unlimited Templates', '1TB Storage', '24/7 Live Support', 'Full Commercial Rights', 'Team Collaboration'], tier: 'studio' }
              ].map((plan, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedPlan(plan.tier)}
                  className={`bg-black border-2 rounded-xl p-6 transition-all cursor-pointer ${
                    selectedPlan === plan.tier || plan.popular ? 'border-purple-500 ring-2 ring-purple-500/20 scale-105' : 'border-purple-700 hover:border-purple-500'
                  } ${plan.popular ? 'relative' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 px-4 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-4 text-purple-300">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-purple-400 text-lg">/month</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check size={18} className="text-purple-500 flex-shrink-0" />
                        <span className="text-purple-200">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {selectedPlan === plan.tier && (
                    <div className="text-purple-400 font-semibold text-sm flex items-center gap-2">
                      <CheckCircle size={18} /> Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <button
                onClick={() => setPage(4)}
                className="bg-purple-600 hover:bg-purple-500 px-12 py-4 rounded-lg font-semibold text-lg transition"
              >
                Continue to Payment
              </button>
              <p className="text-purple-400 text-sm mt-4">Secure payment processing with Stripe</p>
            </div>
          </div>
        </div>
      )}
