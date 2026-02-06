import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, MessageCircle, Film, ChevronRight, ChevronLeft, Check, CheckCircle, Eye, Download, Play, Upload, Database, Layers, Headphones, Volume2, FileVideo, Send, Heart, TrendingUp } from 'lucide-react';

const COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  purple: '#9333ea'
};

const SplashPage = ({ onContinue }: { onContinue: () => void }) => (
  <div onClick={onContinue} className="w-full h-screen bg-black flex items-center justify-center cursor-pointer">
    <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at center, rgba(147,51,234,0.5) 0%, #000 75%)'}}></div>
    <div className="relative z-10 text-center">
      <div className="w-56 h-56 mx-auto rounded-full border-4 border-purple-700 flex items-center justify-center mb-12">
        <Film className="w-32 h-32 text-purple-400" strokeWidth={1.5} />
      </div>
      <h1 className="text-9xl font-black text-white mb-4" style={{fontFamily:'Impact,sans-serif',letterSpacing:'0.15em'}}>
        MANDASTRONG
      </h1>
      <h2 className="text-6xl font-bold text-purple-400 mb-16" style={{letterSpacing:'0.4em'}}>STUDIO</h2>
      <div className="w-36 h-1 rounded-full mx-auto mb-14 bg-purple-600"></div>
      <p className="text-white text-2xl animate-pulse">Tap anywhere to continue</p>
    </div>
  </div>
);

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [duration, setDuration] = useState(90);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [volume, setVolume] = useState(80);

  if (showSplash) {
    return <SplashPage onContinue={() => setShowSplash(false)} />;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const QuickAccessMenu = () => (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-5 py-2.5 rounded-lg font-medium text-sm text-white flex items-center gap-2"
      >
        <Menu size={18} /> Menu
      </button>
      {menuOpen && (
        <div className="absolute top-14 right-0 bg-zinc-900 border border-zinc-700 rounded-lg p-2 w-64">
          {[
            {page: 1, label: "Home"},
            {page: 4, label: "AI Tools"},
            {page: 10, label: "Upload"},
            {page: 16, label: "Export"},
            {page: 19, label: "Help"},
            {page: 20, label: "Community"},
            {page: 21, label: "About"}
          ].map((item) => (
            <button
              key={item.page}
              onClick={() => { setPage(item.page); setMenuOpen(false); }}
              className="text-left w-full text-sm font-medium text-gray-300 hover:text-white px-4 py-2.5 hover:bg-zinc-800 rounded-md"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const GrokButton = () => page !== 19 ? (
    <button
      onClick={() => setPage(19)}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 p-3.5 rounded-full shadow-lg"
    >
      <MessageCircle size={24} className="text-white" />
    </button>
  ) : null;

  const Navigation = () => page >= 2 && page <= 21 ? (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex gap-4">
      {page > 1 && (
        <button
          onClick={() => setPage(page - 1)}
          className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-6 py-3 rounded-lg font-medium text-sm text-white flex items-center gap-2"
        >
          <ChevronLeft size={18} /> Back
        </button>
      )}
      {page < 21 && (
        <button
          onClick={() => setPage(page + 1)}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium text-sm text-white flex items-center gap-2"
        >
          Next <ChevronRight size={18} />
        </button>
      )}
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        [data-bolt-badge], .bolt-badge, #bolt-badge,
        a[href*="bolt"], div[class*="fixed"][class*="bottom"] iframe,
        [class*="made-in"], [id*="bolt"],
        footer[class*="bolt"] { display: none !important; }
      `}</style>
      
      <QuickAccessMenu />
      <GrokButton />
      <Navigation />

      {/* PAGE 1: BROWSE FIRST */}
      {page === 1 && (
        <div className="h-screen flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">MandaStrong Studio</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Professional cinema production platform with AI-powered tools
          </p>
          <div className="flex gap-3 mb-8">
            <button onClick={() => setPage(3)} className="bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3 rounded-lg text-sm font-medium text-white">
              Login
            </button>
            <button onClick={() => setPage(3)} className="bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3 rounded-lg text-sm font-medium text-white">
              Register
            </button>
            <button onClick={() => setPage(2)} className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-lg text-sm font-medium text-gray-300">
              Next
            </button>
          </div>
        </div>
      )}

      {/* PAGE 2: WELCOME */}
      {page === 2 && (
        <div className="h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center text-center px-4">
          <Sparkles size={64} className="text-blue-500 mb-8 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">MandaStrong Studio</h1>
          <p className="text-xl text-gray-400 mb-3">Create professional family movies</p>
          <p className="text-xl text-gray-400">and bring your stories to life</p>
        </div>
      )}

      {/* PAGE 3: LOGIN/REGISTER + PRICING */}
      {page === 3 && (
        <div className="min-h-screen bg-black p-8 pb-32 overflow-y-auto">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-purple-950/30 border-2 border-purple-500 rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-8 text-purple-300">Sign In</h2>
              <input type="email" placeholder="your@email.com" className="w-full bg-black border-2 border-purple-500 rounded-lg px-4 py-3 text-white mb-4" />
              <input type="password" placeholder="••••••••" className="w-full bg-black border-2 border-purple-500 rounded-lg px-4 py-3 text-white mb-6" />
              <button className="w-full bg-purple-600 hover:bg-purple-500 py-3.5 rounded-lg font-semibold">Login</button>
            </div>
            <div className="bg-purple-950/30 border-2 border-purple-500 rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-8 text-purple-300">Create Account</h2>
              <input type="text" placeholder="John Doe" className="w-full bg-black border-2 border-purple-500 rounded-lg px-4 py-3 text-white mb-4" />
              <input type="email" placeholder="your@email.com" className="w-full bg-black border-2 border-purple-500 rounded-lg px-4 py-3 text-white mb-4" />
              <input type="password" placeholder="••••••••" className="w-full bg-black border-2 border-purple-500 rounded-lg px-4 py-3 text-white mb-6" />
              <button className="w-full bg-purple-600 hover:bg-purple-500 py-3.5 rounded-lg font-semibold">Register</button>
            </div>
          </div>

          <div className="max-w-lg mx-auto mb-16">
            <button onClick={() => setPage(4)} className="w-full bg-purple-700 hover:bg-purple-600 border-2 border-purple-500 py-3.5 rounded-lg font-medium flex items-center justify-center gap-2">
              <Eye size={20} /> Continue as Guest
            </button>
          </div>

          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-white">Choose Your Plan</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Basic', price: '20', features: ['HD Export', '100 AI Tools', '10GB Storage'] },
                { name: 'Pro', price: '30', features: ['4K Export', '300 AI Tools', '100GB Storage', 'Priority Support'], popular: true },
                { name: 'Studio', price: '50', features: ['8K Export', 'All 600 AI Tools', '1TB Storage', '24/7 Support'] }
              ].map((plan) => (
                <div key={plan.name} className={`bg-black border-2 rounded-xl p-6 ${plan.popular ? 'border-purple-500 ring-2 ring-purple-500/20 scale-105 relative' : 'border-purple-700'}`}>
                  {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 px-4 py-1 rounded-full text-xs font-semibold">Most Popular</div>}
                  <h3 className="text-2xl font-bold mb-4 text-purple-300">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-purple-400 text-lg">/month</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check size={18} className="text-purple-500" />
                        <span className="text-purple-200">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAGE 4-15: PLACEHOLDER PAGES */}
      {page >= 4 && page <= 15 && (
        <div className="min-h-screen bg-black p-6 pb-32">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-purple-400 mb-8">Page {page}</h1>
            <div className="bg-purple-950/30 border-2 border-purple-700 rounded-xl p-8">
              <p className="text-purple-300">Content for page {page}</p>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 16: EXPORT WITH DURATION SLIDER */}
      {page === 16 && (
        <div className="min-h-screen bg-black p-6 pb-32 flex items-center justify-center">
          <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">Export Your Film</h1>
            <div className="bg-purple-950/30 border-2 border-purple-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Film Duration</h3>
              <div className="text-center mb-6">
                <span className="text-6xl font-bold text-purple-400">{duration}</span>
                <span className="text-2xl text-purple-300 ml-2">minutes</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-3 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-purple-400 text-sm mt-2">
                <span>0 min</span>
                <span>90 min</span>
                <span>180 min (3 hrs)</span>
              </div>
              <button className="w-full mt-8 bg-purple-600 hover:bg-purple-500 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2">
                <Download size={24} /> Export Film
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 17-18: PLACEHOLDER */}
      {(page === 17 || page === 18) && (
        <div className="min-h-screen bg-black p-6 pb-32">
          <h1 className="text-4xl font-bold text-purple-400 mb-8">Page {page}</h1>
          <div className="bg-purple-950/30 border-2 border-purple-700 rounded-xl p-8">
            <p className="text-purple-300">Content for page {page}</p>
          </div>
        </div>
      )}

      {/* PAGE 19: HELP DESK */}
      {page === 19 && (
        <div className="min-h-screen bg-black p-6 pb-32">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-purple-400 mb-8">Agent Grok Help Desk</h1>
            <div className="bg-purple-950/30 border-2 border-purple-700 rounded-xl p-8">
              <div className="h-96 bg-black rounded-lg border-2 border-purple-500 mb-4 p-4">
                <div className="bg-purple-600 rounded-lg p-4 max-w-xs">
                  <p className="text-white">Hi! I'm Agent Grok. How can I help?</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Type your question..." className="flex-1 bg-black border-2 border-purple-500 rounded-lg px-4 py-3 text-white" />
                <button className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 20: COMMUNITY */}
      {page === 20 && (
        <div className="min-h-screen bg-black p-6 pb-32">
          <h1 className="text-4xl font-bold text-purple-400 mb-8">Community Hub</h1>
          <div className="space-y-4">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="bg-purple-950/30 border-2 border-purple-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-2">Community Post {i}</h3>
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

      {/* PAGE 21: THANK YOU */}
      {page === 21 && (
        <div className="min-h-screen bg-black p-6 pb-32 flex flex-col items-center justify-center">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <video autoPlay loop muted playsInline className="w-full max-w-3xl mx-auto rounded-xl border-4 border-purple-700">
                <source src="/ThatsAllFolks.MP4" type="video/mp4" />
              </video>
            </div>
            <h1 className="text-6xl font-black text-purple-400 mb-6" style={{fontFamily:'Impact,sans-serif'}}>
              THAT'S ALL FOLKS!
            </h1>
            <p className="text-2xl text-purple-300 mb-8">Thank you for using MandaStrong Studio</p>
            <a href="https://MandaStrong1.Etsy.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
              Visit MandaStrong1.Etsy.com
            </a>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 py-3 text-center text-gray-400 text-xs z-40 border-t border-zinc-800">
        <p>MandaStrong Studio 2025 • Author of Doxy The School Bully • MandaStrong1.Etsy.com</p>
      </div>
    </div>
  );
}