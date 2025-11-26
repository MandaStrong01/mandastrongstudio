import { useState } from 'react';
import { Volume2, VolumeX, Music, Mic, Headphones } from 'lucide-react';

interface Page15Props {
  onNext: () => void;
  onBack: () => void;
  onNavigate?: (pageNum: number) => void;
}

interface AudioTrack {
  id: number;
  name: string;
  type: 'music' | 'voice' | 'sfx';
  volume: number;
  muted: boolean;
  icon: string;
}

export default function Page15({ onNext, onBack, onNavigate }: Page15Props) {
  const [tracks, setTracks] = useState<AudioTrack[]>([
    { id: 1, name: 'Background Music', type: 'music', volume: 70, muted: false, icon: '🎵' },
    { id: 2, name: 'Narration', type: 'voice', volume: 85, muted: false, icon: '🎤' },
    { id: 3, name: 'Sound Effects', type: 'sfx', volume: 60, muted: false, icon: '🔊' },
    { id: 4, name: 'Ambient Sound', type: 'music', volume: 40, muted: false, icon: '🌊' },
  ]);

  const [masterVolume, setMasterVolume] = useState(80);

  const toggleMute = (id: number) => {
    setTracks(tracks.map(track =>
      track.id === id ? { ...track, muted: !track.muted } : track
    ));
  };

  const updateVolume = (id: number, volume: number) => {
    setTracks(tracks.map(track =>
      track.id === id ? { ...track, volume } : track
    ));
  };

  const getTrackColor = (type: string) => {
    switch (type) {
      case 'music': return 'from-blue-600 to-cyan-600';
      case 'voice': return 'from-green-600 to-emerald-600';
      case 'sfx': return 'from-orange-600 to-red-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[95vw] mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">STEP 5</div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Headphones className="w-8 h-8 text-cyan-400" />
              Audio Mixing Console
            </h1>
          </div>
          <p className="text-slate-400">Balance and mix your audio tracks professionally</p>
          <div className="bg-blue-900/30 border-l-4 border-blue-500 p-3 rounded-r-lg mt-3">
            <p className="text-blue-200 text-sm"><strong>Beginner Tip:</strong> Slide the volume controls to balance music, voice, and effects. Keep dialogue at 85% for best results!</p>
          </div>
        </div>

        <div className="mb-4 bg-black border border-purple-600 rounded-lg p-2">
          <div className="text-xs font-semibold text-purple-300 mb-2">Quick Navigation</div>
          <div className="flex gap-1 flex-wrap">
            <button onClick={() => onNavigate?.(11)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P11 Media</button>
            <button onClick={() => onNavigate?.(12)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P12 Trim</button>
            <button onClick={() => onNavigate?.(13)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P13 FX</button>
            <button onClick={() => onNavigate?.(14)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P14 Text</button>
            <button onClick={() => onNavigate?.(15)} className="bg-purple-600 px-3 py-1 rounded text-xs font-bold">P15 Audio</button>
            <button onClick={() => onNavigate?.(16)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P16 Export</button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-9">
            <div className="bg-purple-900/30 backdrop-blur rounded-xl border-2 border-purple-500 p-6 mb-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-lg">Master Output</h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-400">Master Volume:</span>
                  <span className="text-xl font-bold text-purple-400">{masterVolume}%</span>
                </div>
              </div>

              <div className="bg-black/50 rounded-lg p-6 border border-purple-600">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(Number(e.target.value))}
                  className="w-full h-3 accent-purple-600"
                />
                <div className="mt-4 h-16 bg-black rounded-lg overflow-hidden relative border border-purple-600">
                  <div className="absolute inset-0 flex items-end justify-around p-2">
                    {[...Array(32)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 mx-0.5 bg-gradient-to-t from-purple-500 to-purple-300 rounded-sm animate-pulse"
                        style={{
                          height: `${Math.random() * 80 + 20}%`,
                          animationDelay: `${i * 0.05}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/30 backdrop-blur rounded-xl border-2 border-purple-500 p-6">
              <h2 className="font-semibold mb-4">Audio Tracks</h2>
              <div className="space-y-4">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className={`bg-gradient-to-r ${getTrackColor(track.type)} p-4 rounded-xl ${
                      track.muted ? 'opacity-50' : 'opacity-100'
                    } transition-all`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-2xl">{track.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold">{track.name}</h3>
                        <p className="text-xs text-white/70 capitalize">{track.type}</p>
                      </div>
                      <button
                        onClick={() => toggleMute(track.id)}
                        className="p-2 bg-black/30 hover:bg-black/50 rounded-lg transition-all"
                      >
                        {track.muted ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                      <span className="text-lg font-bold min-w-[3rem] text-right">
                        {track.volume}%
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/70">0%</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={track.volume}
                        onChange={(e) => updateVolume(track.id, Number(e.target.value))}
                        disabled={track.muted}
                        className="flex-1 accent-white"
                      />
                      <span className="text-xs text-white/70">100%</span>
                    </div>

                    <div className="mt-2 h-8 bg-black/30 rounded overflow-hidden">
                      <div
                        className="h-full bg-white/30 transition-all"
                        style={{ width: `${track.muted ? 0 : track.volume}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-3 space-y-4">
            <div className="bg-purple-900/30 backdrop-blur rounded-xl border-2 border-purple-500 p-4">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full bg-purple-800 hover:bg-purple-700 p-3 rounded-lg text-left transition-all flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  <span>Add Music Track</span>
                </button>
                <button className="w-full bg-purple-800 hover:bg-purple-700 p-3 rounded-lg text-left transition-all flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  <span>Record Voice</span>
                </button>
                <button className="w-full bg-purple-800 hover:bg-purple-700 p-3 rounded-lg text-left transition-all flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Add Sound Effect</span>
                </button>
              </div>
            </div>

            <div className="bg-purple-900/30 backdrop-blur rounded-xl border-2 border-purple-500 p-4">
              <h3 className="font-semibold mb-4">Audio Effects</h3>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 bg-purple-800 rounded-lg">
                  <span className="text-sm">Echo</span>
                  <input type="checkbox" className="accent-purple-600" />
                </label>
                <label className="flex items-center justify-between p-2 bg-purple-800 rounded-lg">
                  <span className="text-sm">Reverb</span>
                  <input type="checkbox" className="accent-purple-600" />
                </label>
                <label className="flex items-center justify-between p-2 bg-purple-800 rounded-lg">
                  <span className="text-sm">Normalize</span>
                  <input type="checkbox" className="accent-purple-600" />
                </label>
                <label className="flex items-center justify-between p-2 bg-purple-800 rounded-lg">
                  <span className="text-sm">Noise Reduction</span>
                  <input type="checkbox" className="accent-purple-600" />
                </label>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-purple-900/30 backdrop-blur rounded-xl border-2 border-purple-500 p-4">
              <h3 className="font-semibold mb-2 text-sm">Mixing Tip</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Keep dialogue at 85%, music at 60-70%, and effects at 50-60% for a balanced mix. Always preview your mix!
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
            Next: Color Grading
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
