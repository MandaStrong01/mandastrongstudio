import { useState } from 'react';
import { Sparkles, Zap, Waves, CircleDot } from 'lucide-react';

interface Page13Props {
  onNext: () => void;
  onBack: () => void;
  onNavigate?: (pageNum: number) => void;
}

export default function Page13({ onNext, onBack, onNavigate }: Page13Props) {
  const [selectedTransition, setSelectedTransition] = useState<string>('fade');

  const transitions = [
    { id: 'fade', name: 'Fade', icon: '🌅', duration: '0.5s', preview: 'Smooth opacity transition' },
    { id: 'dissolve', name: 'Dissolve', icon: '✨', duration: '0.8s', preview: 'Pixel dissolve effect' },
    { id: 'slide', name: 'Slide', icon: '➡️', duration: '0.6s', preview: 'Directional slide' },
    { id: 'zoom', name: 'Zoom', icon: '🔍', duration: '0.7s', preview: 'Scale transition' },
    { id: 'wipe', name: 'Wipe', icon: '🧹', duration: '0.5s', preview: 'Directional wipe' },
    { id: 'blur', name: 'Blur', icon: '🌫️', duration: '0.6s', preview: 'Blur transition' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[95vw] mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">STEP 3</div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-300" />
              Transitions & Effects
            </h1>
          </div>
          <p className="text-slate-400">Add smooth transitions between your clips</p>
          <div className="bg-blue-900/30 border-l-4 border-blue-500 p-3 rounded-r-lg mt-3">
            <p className="text-blue-200 text-sm"><strong>Beginner Tip:</strong> Pick a transition from the library, adjust duration, and it appears between your clips!</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-8">
            <div className="bg-purple-900/30 backdrop-blur rounded-xl border-2 border-purple-500 p-6 mb-4">
              <h2 className="font-semibold mb-4 text-purple-300">Transition Preview</h2>
              <div className="aspect-video bg-black rounded-lg mb-4 relative overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-2xl font-bold">Clip A</span>
                  </div>
                  <div className="w-1 bg-purple-500 animate-pulse"></div>
                  <div className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                    <span className="text-2xl font-bold">Clip B</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur px-4 py-2 rounded-full text-sm">
                  Transition: <span className="text-purple-300 font-semibold">{selectedTransition}</span>
                </div>
              </div>

              <div className="mt-3 bg-black border border-purple-600 rounded-lg p-2">
                <div className="text-xs font-semibold text-purple-300 mb-2">Quick Navigation</div>
                <div className="flex gap-1 flex-wrap">
                  <button onClick={() => onNavigate?.(11)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P11 Media</button>
                  <button onClick={() => onNavigate?.(12)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P12 Trim</button>
                  <button onClick={() => onNavigate?.(13)} className="bg-purple-600 px-3 py-1 rounded text-xs font-bold">P13 FX</button>
                  <button onClick={() => onNavigate?.(14)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P14 Text</button>
                  <button onClick={() => onNavigate?.(15)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P15 Audio</button>
                  <button onClick={() => onNavigate?.(16)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P16 Export</button>
                </div>
              </div>

              <div className="bg-black/50 rounded-lg p-4 border border-purple-600">
                <h3 className="text-sm font-semibold mb-3 text-purple-300">Timeline with Transitions</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-16 bg-purple-600 rounded-l-lg flex items-center justify-center text-sm font-semibold">
                    Scene 1
                  </div>
                  <div className="w-12 h-16 bg-purple-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1 h-16 bg-blue-600 flex items-center justify-center text-sm font-semibold">
                    Scene 2
                  </div>
                  <div className="w-12 h-16 bg-purple-500 flex items-center justify-center">
                    <Waves className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1 h-16 bg-green-600 rounded-r-lg flex items-center justify-center text-sm font-semibold">
                    Scene 3
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/30 backdrop-blur rounded-xl border-2 border-purple-500 p-6">
              <h2 className="font-semibold mb-4">Transition Duration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Duration (seconds)</label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    defaultValue="0.5"
                    className="w-full accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0.1s</span>
                    <span>Fast</span>
                    <span>2.0s</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Easing</label>
                  <select className="w-full bg-black border border-purple-500 rounded-lg p-2 text-white">
                    <option>Linear</option>
                    <option>Ease In</option>
                    <option>Ease Out</option>
                    <option>Ease In-Out</option>
                    <option>Bounce</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="bg-purple-900/30 backdrop-blur rounded-xl border-2 border-purple-500 p-4">
              <h3 className="font-semibold mb-4">Transition Library</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {transitions.map((transition) => (
                  <button
                    key={transition.id}
                    onClick={() => setSelectedTransition(transition.id)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedTransition === transition.id
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg'
                        : 'bg-purple-800 hover:bg-purple-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{transition.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{transition.name}</div>
                        <div className="text-xs text-slate-300 mb-1">{transition.preview}</div>
                        <div className="text-xs text-slate-400">Duration: {transition.duration}</div>
                      </div>
                      {selectedTransition === transition.id && (
                        <CircleDot className="w-4 h-4 text-purple-300" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-purple-500/30"
          >
            Next: Text & Titles
          </button>
        </div>

        <footer className="border-t-2 border-purple-500 pt-6 mt-8 text-center">
          <p className="text-white text-sm">
            MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com
          </p>
        </footer>
      </div>
    </div>
  );
}
