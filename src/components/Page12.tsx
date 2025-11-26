import { useState } from 'react';
import { Scissors, Maximize2, Minimize2, Play, Pause } from 'lucide-react';

interface Page12Props {
  onNext: () => void;
  onBack: () => void;
  onNavigate?: (pageNum: number) => void;
}

export default function Page12({ onNext, onBack, onNavigate }: Page12Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedClip, setSelectedClip] = useState<number | null>(null);

  const clips = [
    { id: 1, name: 'Opening Scene', duration: '0:15', thumbnail: '🎬' },
    { id: 2, name: 'Intro Animation', duration: '0:08', thumbnail: '✨' },
    { id: 3, name: 'Main Content', duration: '1:30', thumbnail: '🎭' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[95vw] mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">STEP 2</div>
            <h1 className="text-3xl font-bold">Basic Trimming & Cutting</h1>
          </div>
          <p className="text-slate-400">Learn to trim and cut your clips precisely</p>
          <div className="bg-blue-900/30 border-l-4 border-blue-500 p-3 rounded-r-lg mt-3">
            <p className="text-blue-200 text-sm"><strong>Beginner Tip:</strong> Select a clip from the timeline and use the trim tools to remove unwanted sections!</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-9 bg-purple-900/30 backdrop-blur rounded-xl border-2 border-purple-500 p-4">
            <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
              <div className="relative z-10 text-center">
                <Play className="w-16 h-16 mx-auto mb-2 text-white/80" />
                <p className="text-white/60">Preview Window</p>
              </div>
            </div>

            <div className="mt-3 bg-black border border-purple-600 rounded-lg p-2">
              <div className="text-xs font-semibold text-purple-300 mb-2">Quick Navigation</div>
              <div className="flex gap-1 flex-wrap">
                <button onClick={() => onNavigate?.(11)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P11 Media</button>
                <button onClick={() => onNavigate?.(12)} className="bg-purple-600 px-3 py-1 rounded text-xs font-bold">P12 Trim</button>
                <button onClick={() => onNavigate?.(13)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P13 FX</button>
                <button onClick={() => onNavigate?.(14)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P14 Text</button>
                <button onClick={() => onNavigate?.(15)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P15 Audio</button>
                <button onClick={() => onNavigate?.(16)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P16 Export</button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition-all"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <div className="flex-1 h-2 bg-slate-700 rounded-full relative">
                <div className="absolute h-full w-1/3 bg-blue-600 rounded-full"></div>
              </div>
              <span className="text-sm text-slate-400 font-mono">0:45 / 2:15</span>
            </div>

            <div className="bg-black/50 rounded-lg p-4 border border-purple-600">
              <h3 className="text-sm font-semibold mb-3 text-slate-300">Timeline</h3>
              <div className="space-y-2">
                {clips.map((clip) => (
                  <div
                    key={clip.id}
                    onClick={() => setSelectedClip(clip.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedClip === clip.id
                        ? 'bg-blue-600 shadow-lg shadow-blue-500/30'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{clip.thumbnail}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{clip.name}</div>
                      <div className="text-xs text-slate-400">{clip.duration}</div>
                    </div>
                    <button className="text-slate-400 hover:text-white">
                      <Scissors className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-3 space-y-4">
            <div className="bg-purple-900/30 backdrop-blur rounded-xl border-2 border-purple-500 p-4">
              <h3 className="font-semibold mb-4 text-lg">Trim Tools</h3>
              <div className="space-y-2">
                <button className="w-full bg-purple-700 hover:bg-purple-600 p-3 rounded-lg text-left transition-all flex items-center gap-2">
                  <Scissors className="w-4 h-4" />
                  <span>Cut at Playhead</span>
                </button>
                <button className="w-full bg-purple-700 hover:bg-purple-600 p-3 rounded-lg text-left transition-all flex items-center gap-2">
                  <Maximize2 className="w-4 h-4" />
                  <span>Trim Start</span>
                </button>
                <button className="w-full bg-purple-700 hover:bg-purple-600 p-3 rounded-lg text-left transition-all flex items-center gap-2">
                  <Minimize2 className="w-4 h-4" />
                  <span>Trim End</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-purple-900/30 backdrop-blur rounded-xl border-2 border-purple-500 p-4">
              <h3 className="font-semibold mb-2 text-sm">Quick Tip</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Select a clip and use the trim tools to remove unwanted sections. The timeline updates in real-time.
              </p>
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
            Next: Add Transitions
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
