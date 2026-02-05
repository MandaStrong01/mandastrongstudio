import React, { useState, useEffect } from 'react';
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
  const [showSplash, setShowSplash] = useState(true);
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [showProStudio, setShowProStudio] = useState(false);
  const [selectedTool, setSelectedTool] = useState<{name: string, category: string} | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (showSplash) return <SplashPage onContinue={() => setShowSplash(false)} />;
  if (showProStudio) return <MandaStrongStudioPro />;

  const goTo = (p: number) => {
    setPage(p);
    setMenuOpen(false);
  };

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
      <style>{`
        [data-bolt-badge], .bolt-badge, #bolt-badge,
        a[href*="bolt.new"], a[href*="bolt.host"] { display:none !important; }
      `}</style>

      {/* Navigation & Menu */}
      <div className="fixed top-6 right-6 z-50">
        <button onClick={() => setMenuOpen(!menuOpen)} className="bg-zinc-800 border border-zinc-700 px-5 py-2.5 rounded-lg text-white flex items-center gap-2 shadow-lg">
          <Menu size={18} /> Menu
        </button>
        {menuOpen && (
          <div className="absolute top-14 right-0 bg-zinc-900 border border-zinc-700 rounded-lg p-2 w-64 shadow-2xl">
            <button onClick={() => { setShowProStudio(true); setMenuOpen(false); }} className="w-full text-left text-sm font-medium text-white bg-blue-600 px-4 py-2.5 rounded-md mb-1">Pro Studio</button>
            <div className="flex flex-col gap-1">
              {["Home", "AI Tools", "Community", "Pricing"].map((label, idx) => (
                <button key={idx} onClick={() => goTo(idx + 1)} className="text-left text-sm text-gray-300 hover:bg-zinc-800 px-4 py-2.5 rounded-md">{label}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Page Content */}
      {page === 1 && (
        <div className="h-screen flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-6xl font-bold mb-4">MandaStrong Studio</h1>
          <p className="text-xl text-gray-400 max-w-2xl mb-8">Professional production platform with AI-powered tools.</p>
          <div className="flex gap-4">
            <button onClick={() => setShowProStudio(true)} className="bg-blue-600 px-8 py-3 rounded-lg font-bold">Launch Studio</button>
            <button onClick={() => setPage(3)} className="bg-zinc-800 px-8 py-3 rounded-lg border border-zinc-700">Login</button>
          </div>
        </div>
      )}

      {page === 2 && (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <Sparkles size={64} className="text-blue-500 mb-8 animate-pulse" />
            <h1 className="text-5xl font-bold mb-4">Welcome to the Future</h1>
            <p className="text-gray-400">Advanced AI filmmaking at your fingertips.</p>
        </div>
      )}

      {page === 3 && (
        <div className="min-h-screen p-8 pt-24">
           <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Select Your Plan</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[{t:'Basic', p:'20'}, {t:'Pro', p:'30'}, {t:'Studio', p:'50'}].map((plan) => (
                  <div key={plan.t} className="bg-zinc-900 border border-purple-500/30 p-6 rounded-xl text-center">
                    <h3 className="text-xl font-bold mb-2">{plan.t}</h3>
                    <div className="text-3xl font-bold mb-6">${plan.p}<span className="text-sm text-gray-500">/mo</span></div>
                    <button onClick={() => setPage(4)} className="w-full bg-purple-600 py-2 rounded-lg">Get Started</button>
                  </div>
                ))}
              </div>
           </div>
        </div>
      )}

      {page === 4 && <ToolBoard title="Cinema Writing" tools={TOOL_BOARDS.Writing} />}

      {/* Navigation Controls */}
      {page > 1 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-50">
          <button onClick={() => setPage(page - 1)} className="bg-zinc-800 px-6 py-2 rounded-lg border border-zinc-700">Back</button>
          <button onClick={() => setPage(page + 1)} className="bg-blue-600 px-6 py-2 rounded-lg">Next</button>
        </div>
      )}

      {/* Tool Interface Modal */}
      {selectedTool && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md">
          <div className="absolute top-4 right-4 z-[110]">
            <button onClick={() => setSelectedTool(null)} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700">
              <X size={24} />
            </button>
          </div>
          <AIToolInterface 
            toolName={selectedTool.name} 
            category={selectedTool.category} 
            onClose={() => setSelectedTool(null)} 
          />
        </div>
      )}
    </div>
  );
}