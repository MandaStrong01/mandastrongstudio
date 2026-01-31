import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, Sparkles, ChevronRight, ChevronLeft, Play, Upload, MessageCircle,
  Home, Settings, Database, Film, Music, Image as ImageIcon, Video,
  Palette, Layers, Zap, Clock, Download, Share2, Users, FileText,
  Mic, Camera, Scissors, Sliders, Eye, Award, Shield,
  Grid, Search, Plus, Save, FolderOpen, CheckCircle, Info, Bell, User, HelpCircle,
  Youtube, Twitter, Instagram, Facebook, Send
} from 'lucide-react';

const PRODUCTION_PIPELINE = {
  preProduction: {
    name: "Pre-Production",
    icon: FileText,
    color: "blue",
    modules: [
      { id: "script", name: "AI Screenplay Development", icon: FileText, tools: 40 },
      { id: "storyboard", name: "AI Storyboarding", icon: Grid, tools: 35 },
      { id: "casting", name: "AI Character Design", icon: Users, tools: 30 }
    ]
  },
  production: {
    name: "Production",
    icon: Camera,
    color: "purple",
    modules: [
      { id: "video", name: "AI Video Generation", icon: Video, tools: 50 },
      { id: "voice", name: "AI Voice Synthesis", icon: Mic, tools: 45 },
      { id: "assets", name: "AI Asset Generation", icon: ImageIcon, tools: 60 }
    ]
  },
  postProduction: {
    name: "Post-Production",
    icon: Scissors,
    color: "pink",
    modules: [
      { id: "edit", name: "Professional Timeline", icon: Film },
      { id: "color", name: "Color Grading Suite", icon: Palette },
      { id: "audio", name: "Audio Mixing Console", icon: Music },
      { id: "vfx", name: "VFX & Enhancement", icon: Sparkles, tools: 45 }
    ]
  },
  delivery: {
    name: "Delivery",
    icon: Share2,
    color: "green",
    modules: [
      { id: "export", name: "Professional Export", icon: Download },
      { id: "distribute", name: "Distribution Hub", icon: Share2 }
    ]
  }
};

const generateTools = (baseTools: string[], count: number) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    const base = baseTools[i % baseTools.length];
    const version = i >= baseTools.length ? ` Pro ${Math.floor(i / baseTools.length) + 1}` : "";
    result.push(`${base}${version}`);
  }
  return result;
};

const AI_TOOLS: Record<string, string[]> = {
  script: generateTools([
    "Neural Story Engine", "Three-Act AI", "Character Arc Builder", "Dialogue Generator",
    "Scene Analyzer", "Plot Constructor", "Conflict Mapper", "Beat Sheet Creator"
  ], 40),
  storyboard: generateTools([
    "Shot Composer", "Camera Angle AI", "Lighting Designer", "Visual Flow Mapper",
    "Continuity Checker", "Frame Analyzer", "Composition Guide", "Coverage Planner"
  ], 35),
  casting: generateTools([
    "Character Visualizer", "Age Modifier", "Expression Generator", "Costume Designer",
    "Makeup Simulator", "Voice Profiler", "Body Type Matcher", "Casting Suggester"
  ], 30),
  video: generateTools([
    "Text-to-Video Engine", "Scene Synthesizer", "Camera Movement AI", "Depth Creator",
    "Motion Blur Engine", "Frame Interpolator", "Style Transfer", "Cinematic Grader"
  ], 50),
  voice: generateTools([
    "Voice Clone Pro", "Emotion Modulator", "Accent Synthesizer", "Age Shifter",
    "Dialogue Timer", "Lip-Sync Generator", "Vocal Designer", "Breath Controller"
  ], 45),
  assets: generateTools([
    "Environment Generator", "Prop Creator", "Texture Synthesizer", "Lighting Sim",
    "Matte Painting AI", "Set Extension", "Sky Replacer", "Weather Generator"
  ], 60),
  vfx: generateTools([
    "Green Screen Keyer", "Motion Tracker", "3D Camera Solver", "Particle Sim",
    "Explosion Generator", "Fire/Smoke Creator", "Water Simulator", "Destruction Engine"
  ], 45)
};

export default function MandaStrongStudioPro() {
  const [page, setPage] = useState('welcome');
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [currentModule, setCurrentModule] = useState<any>(null);
  const [duration, setDuration] = useState(90);
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && page === 'welcome') {
      videoRef.current.play().catch(() => {});
    }
  }, [page]);

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col overflow-hidden">

      {page !== 'welcome' && (
        <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-3.5 flex items-center justify-between z-50">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-white">MandaStrong Studio Pro</h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="hover:bg-zinc-800 p-2 rounded-lg transition"><Bell size={20} className="text-gray-400" /></button>
            <button className="hover:bg-zinc-800 p-2 rounded-lg transition"><HelpCircle size={20} className="text-gray-400" /></button>
            <button className="hover:bg-zinc-800 p-2 rounded-lg transition"><Settings size={20} className="text-gray-400" /></button>
            <button className="hover:bg-zinc-800 p-2 rounded-lg transition"><User size={20} className="text-gray-400" /></button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition ml-2"
            >
              <Menu size={20} />
            </button>
          </div>

          {menuOpen && (
            <div className="absolute top-16 right-6 bg-zinc-900 border border-zinc-700 rounded-lg p-2 w-56 shadow-2xl">
              <button onClick={() => { setPage('dashboard'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-800 rounded-md font-medium transition">Dashboard</button>
              <button onClick={() => { setPage('help'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-800 rounded-md font-medium transition">Help Center</button>
              <div className="h-px bg-zinc-800 my-1"></div>
              <button onClick={() => { setPage('welcome'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-600 rounded-md font-medium transition">Sign Out</button>
            </div>
          )}
        </header>
      )}

      <main className="flex-1 overflow-hidden">

        {page === 'welcome' && (
          <div className="h-full relative">
            <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-30">
              <source src="/video/background.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>

            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-8">
              <Sparkles size={80} className="text-blue-500 mb-10 animate-pulse" />

              <h1 className="text-6xl font-bold text-white leading-tight mb-6">
                MandaStrong Studio Pro
              </h1>

              <p className="text-xl text-gray-300 max-w-4xl mb-12 font-normal">
                Complete AI-powered cinema production suite. Create professional feature films up to 3 hours with tools for every stage of production.
              </p>

              <div className="grid grid-cols-4 gap-6 mb-16 max-w-6xl">
                {Object.values(PRODUCTION_PIPELINE).map((stage, i) => (
                  <div key={i} className="bg-zinc-900/90 p-8 rounded-xl border border-zinc-800 backdrop-blur-sm hover:border-blue-600 transition">
                    <stage.icon size={40} className="text-blue-500 mb-4 mx-auto" />
                    <h3 className="text-lg font-semibold mb-2">{stage.name}</h3>
                    <p className="text-sm text-gray-400">{stage.modules.length} Modules</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPage('dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-lg text-lg font-semibold transition shadow-xl"
              >
                Enter Studio
              </button>
            </div>
          </div>
        )}

        {page === 'dashboard' && (
          <div className="h-full bg-zinc-950 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl font-bold mb-2">Production Dashboard</h1>
              <p className="text-gray-400 mb-10">Complete cinema production pipeline • Up to 3 hours per project</p>

              <div className="grid grid-cols-4 gap-6">
                {Object.entries(PRODUCTION_PIPELINE).map(([key, stage]) => (
                  <div
                    key={key}
                    onClick={() => { setCurrentStage(key); setPage('stage'); }}
                    className="bg-zinc-900 border border-zinc-800 hover:border-blue-600 p-8 rounded-xl cursor-pointer transition-all group"
                  >
                    <stage.icon size={48} className="text-blue-500 mb-4 group-hover:scale-105 transition" />
                    <h3 className="text-xl font-bold mb-2">{stage.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{stage.modules.length} Modules</p>
                    <div className="text-blue-500 font-medium text-sm flex items-center gap-2">
                      Open <ChevronRight size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {page === 'stage' && currentStage && (
          <div className="h-full bg-zinc-950 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => setPage('dashboard')}
                className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 font-medium text-sm transition"
              >
                <ChevronLeft size={18} /> Back to Dashboard
              </button>

              <h1 className="text-3xl font-bold mb-10">{PRODUCTION_PIPELINE[currentStage as keyof typeof PRODUCTION_PIPELINE].name}</h1>

              <div className="grid grid-cols-2 gap-6">
                {PRODUCTION_PIPELINE[currentStage as keyof typeof PRODUCTION_PIPELINE].modules.map(module => (
                  <div
                    key={module.id}
                    onClick={() => { setCurrentModule(module); setPage('module'); }}
                    className="bg-zinc-900 border border-zinc-800 hover:border-blue-600 p-8 rounded-xl cursor-pointer transition-all group"
                  >
                    <module.icon size={40} className="text-blue-500 mb-4 group-hover:scale-105 transition" />
                    <h3 className="text-2xl font-bold mb-3">{module.name}</h3>
                    {module.tools && (
                      <p className="text-gray-400 font-medium text-sm">{module.tools} AI Tools</p>
                    )}
                    <div className="mt-6 text-blue-500 font-medium text-sm flex items-center gap-2">
                      Launch <ChevronRight size={18} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {page === 'module' && currentModule && currentModule.tools && (
          <div className="h-full flex">
            <div className="w-1/3 bg-zinc-900 border-r border-zinc-800 overflow-y-auto p-6">
              <button
                onClick={() => setPage('stage')}
                className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 font-medium text-sm transition"
              >
                <ChevronLeft size={18} /> Back
              </button>

              <h2 className="text-xl font-bold mb-2">{currentModule.name}</h2>
              <p className="text-sm text-gray-500 mb-6">{currentModule.tools} Tools Available</p>

              <div className="space-y-1.5">
                {AI_TOOLS[currentModule.id]?.map((tool, i) => (
                  <button
                    key={i}
                    className="w-full text-left bg-zinc-800 hover:bg-blue-600 p-3.5 rounded-lg transition"
                  >
                    <div className="font-medium text-sm">{tool}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 bg-zinc-950 flex items-center justify-center">
              <div className="text-center">
                <Sparkles size={80} className="text-blue-500 mx-auto mb-8 animate-pulse" />
                <h3 className="text-3xl font-bold mb-4">AI Processing Engine</h3>
                <p className="text-gray-400 mb-8">Select a tool from the sidebar to begin</p>
                <button className="bg-blue-600 hover:bg-blue-700 px-10 py-3.5 rounded-lg font-semibold transition">
                  Start Generation
                </button>
              </div>
            </div>
          </div>
        )}

        {page === 'module' && currentModule && currentModule.id === 'edit' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 flex">
              <div className="w-64 bg-zinc-900 border-r border-zinc-800 p-4">
                <h3 className="text-xs font-semibold uppercase text-gray-400 mb-4">Media Library</h3>
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-lg mb-2 cursor-pointer transition">
                    <div className="text-xs font-medium">Clip_{i+1}.mp4</div>
                    <div className="text-xs text-gray-500 mt-1">00:{String(i+5).padStart(2, '0')}</div>
                  </div>
                ))}
              </div>

              <div className="flex-1 flex items-center justify-center bg-black">
                <div className="w-full aspect-video max-w-5xl bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
                  <Play size={64} className="text-gray-600" />
                </div>
              </div>
            </div>

            <div className="h-64 bg-zinc-950 border-t-2 border-blue-600 p-4">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold text-sm">Multi-Track Timeline</h3>
                <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition"><Play size={18} /></button>
              </div>
              <div className="space-y-2">
                {['Video 1', 'Video 2', 'Audio 1', 'Audio 2', 'Text'].map(track => (
                  <div key={track} className="bg-zinc-900 h-12 rounded-lg flex items-center px-4 text-sm font-medium text-gray-300 hover:bg-zinc-800 transition cursor-pointer">{track}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {page === 'module' && currentModule && currentModule.id === 'color' && (
          <div className="h-full flex">
            <div className="w-1/4 bg-zinc-900 p-6 overflow-y-auto border-r border-zinc-800">
              <h2 className="text-lg font-bold mb-6">Color Grading</h2>
              {['Exposure', 'Contrast', 'Highlights', 'Shadows', 'Temperature', 'Tint', 'Saturation'].map(ctrl => (
                <div key={ctrl} className="mb-6">
                  <label className="text-sm font-medium mb-2 block text-gray-300">{ctrl}</label>
                  <input type="range" min="-100" max="100" defaultValue="0" className="w-full accent-blue-600" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>-100</span><span>0</span><span>+100</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 flex items-center justify-center bg-black p-8">
              <div className="w-full aspect-video max-w-5xl bg-zinc-900 rounded-xl border border-zinc-800"></div>
            </div>
          </div>
        )}

        {page === 'module' && currentModule && currentModule.id === 'audio' && (
          <div className="h-full bg-zinc-950 p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-8">Audio Mixing Console</h1>
            <div className="grid grid-cols-6 gap-4">
              {['Music', 'Dialogue', 'SFX', 'Ambience', 'Foley', 'Master'].map((ch, i) => (
                <div key={ch} className={`bg-zinc-900 rounded-xl p-6 ${i === 5 ? 'border-2 border-blue-600' : 'border border-zinc-800'}`}>
                  <Mic size={28} className="mx-auto mb-3 text-blue-500" />
                  <h3 className="font-semibold text-center mb-4 text-sm">{ch}</h3>
                  <div className="h-48 bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg mb-4 opacity-80"></div>
                  <input type="range" min="0" max="100" defaultValue="75" className="w-full accent-blue-600 mb-2 h-1.5" />
                  <div className="text-center font-semibold text-sm mb-4">75%</div>
                  {i < 5 ? (
                    <div className="flex gap-2">
                      <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-2 rounded-lg text-xs font-medium transition">MUTE</button>
                      <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-2 rounded-lg text-xs font-medium transition">SOLO</button>
                    </div>
                  ) : (
                    <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold text-sm transition">OUTPUT</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'module' && currentModule && currentModule.id === 'export' && (
          <div className="h-full bg-zinc-950 p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-8">Professional Export</h1>

            <div className="max-w-6xl grid grid-cols-2 gap-8">
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
                <h2 className="text-xl font-bold mb-6">Export Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Resolution</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold text-sm transition">8K</button>
                      <button className="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-medium text-sm transition">4K</button>
                      <button className="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-medium text-sm transition">1080p</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Format</label>
                    <select className="w-full bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600">
                      <option>MP4 (H.264)</option>
                      <option>MOV (ProRes)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl flex flex-col items-center justify-center">
                <Film size={64} className="text-blue-500 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Ready to Render</h3>
                <button className="bg-blue-600 hover:bg-blue-700 px-10 py-3.5 rounded-lg font-semibold transition">
                  Start Rendering
                </button>
              </div>
            </div>

            <div className="mt-8 bg-zinc-900 border border-zinc-800 p-8 rounded-xl max-w-6xl">
              <h2 className="text-xl font-bold mb-6">Distribution Platforms</h2>
              <div className="grid grid-cols-5 gap-4">
                {['YouTube', 'Vimeo', 'Instagram', 'TikTok', 'Custom'].map(p => (
                  <button key={p} className="bg-zinc-800 hover:bg-blue-600 border border-zinc-700 hover:border-blue-600 p-6 rounded-lg transition flex flex-col items-center gap-3">
                    <Share2 size={28} />
                    <span className="font-medium text-sm">{p}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {page === 'help' && (
          <div className="h-full bg-zinc-950 p-8 flex items-center justify-center">
            <div className="max-w-4xl w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="bg-blue-600 p-8 flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle size={32} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Agent Grok</h2>
                  <p className="text-blue-100 font-medium">24/7 Professional Support</p>
                </div>
              </div>

              <div className="p-8 h-96 bg-black overflow-y-auto">
                <div className="bg-zinc-800 rounded-lg p-5 max-w-md">
                  <p className="text-sm mb-2">Hello! How can I assist your production today?</p>
                  <span className="text-xs text-gray-500">Just now</span>
                </div>
              </div>

              <div className="p-6 bg-zinc-900 border-t border-zinc-800 flex gap-4">
                <input
                  type="text"
                  placeholder="Ask about any feature..."
                  className="flex-1 bg-zinc-800 border border-zinc-700 px-5 py-3.5 rounded-lg outline-none text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <button className="bg-blue-600 hover:bg-blue-700 p-3.5 rounded-lg transition"><Send size={20} /></button>
              </div>
            </div>
          </div>
        )}

      </main>

      {page !== 'welcome' && (
        <footer className="bg-zinc-900 border-t border-zinc-800 px-6 py-3 text-center text-xs text-gray-500 font-medium">
          MandaStrong Studio Pro 2025 • Professional AI Cinema Suite • Support: MandaStrong1.Etsy.com
        </footer>
      )}
    </div>
  );
}
